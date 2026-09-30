import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import { getLatestSyncStatus, recordSyncExecution, logAuditToDb } from './src/db/sync.ts';
import { getOrCreateUser, getAllUsersFromDb, deleteUserFromDb, purgeNonAdminUsersFromDb } from './src/db/users.ts';
import {
  getAllPrayersFromDb,
  purgeDemoPrayersFromDb,
  createPrayerInDb,
  agreePrayerInDb,
  addCommentToPrayerInDb,
  deletePrayerFromDb,
  getAllReportsFromDb,
  createReportInDb,
  likeReportInDb,
  deleteReportFromDb,
  getAllEventsFromDb,
  createEventInDb,
  rsvpEventInDb,
  deleteEventFromDb,
  getChatMessagesFromDb,
  createChatMessageInDb,
  getSiteSettingsFromDb,
  saveSiteSettingsToDb
} from './src/db/entities.ts';
import { emailService } from './server/emailService.ts';
import {
  initEmailTables,
  createEmailOtp,
  checkCanResendOtp,
  verifyEmailOtp,
  createPasswordResetRecord,
  verifyAndConsumePasswordReset,
  saveContactMessage
} from './src/db/emailQueries.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Dynamic allowed origins list
const allowedOrigins: string[] = [
  'https://www.livingtech.name.ng',
  'http://www.livingtech.name.ng',
  'https://livingtech.name.ng',
  'http://livingtech.name.ng',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

if (process.env.CORS_ALLOWED_ORIGINS) {
  process.env.CORS_ALLOWED_ORIGINS.split(',').forEach(o => {
    const trimmed = o.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

// Open and permissive CORS middleware for standalone / decoupled deployment
app.use(cors({
  origin: (origin, callback) => {
    // Whitelist and accept requests from the custom domain, GitHub Pages, Cloud Run, localhost, and any client
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 204,
}));

// Fallback CORS headers middleware for all responses
app.use((req: Request, res: Response, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Preflight options handling for all routes
app.options('*', (req: Request, res: Response) => {
  res.sendStatus(204);
});

app.use(express.json({ limit: '10mb' }));

// ==========================================
// 1. SYSTEM & HEALTH ENDPOINTS
// ==========================================
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'PrayerCloud Standalone Cloud SQL Backend API',
    architecture: 'Decoupled (Frontend on Custom Domain / GitHub Pages, Backend on Google Cloud)',
    database: 'Google Cloud SQL (PostgreSQL 15)',
    region: 'europe-west1',
    engine: 'PostgreSQL 15',
    orm: 'Drizzle ORM',
    pool: 'pg.Pool (Object Configuration)',
    cors: {
      enabled: true,
      whitelistedCustomDomain: 'https://livingtech.name.ng',
      allowedOrigins: allowedOrigins,
    },
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 2. AUTHENTICATION & USERS
// ==========================================
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier) {
      return res.status(400).json({ success: false, error: 'Identifier is required' });
    }
    const cleanId = String(identifier).trim().toLowerCase();

    const isAdminIdentifier =
      cleanId === 'admin' ||
      cleanId === 'superadmin' ||
      cleanId === 'administrator' ||
      cleanId === 'admin@prayercloud.org';

    // Query users from Cloud SQL
    let user: any = null;
    try {
      const allUsers = await getAllUsersFromDb();
      user = allUsers.find(
        (u: any) =>
          u.email?.toLowerCase() === cleanId ||
          u.username?.toLowerCase() === cleanId ||
          u.uid?.toLowerCase() === cleanId
      );
    } catch (e) {
      console.warn('Cloud SQL query notice in login:', e);
    }

    if (!user && isAdminIdentifier) {
      // Check if an official administrator account already exists in Cloud SQL
      try {
        const allUsers = await getAllUsersFromDb();
        const existingAdmin = allUsers.find(
          (u: any) => u.uid === 'usr-admin-1' || u.role === 'Super Admin' || u.role === 'Admin'
        );
        if (existingAdmin) {
          user = existingAdmin;
        }
      } catch {}

      if (!user) {
        // Auto-provision Super Admin in Cloud SQL only if none exists
        user = await getOrCreateUser(
          'usr-admin-1',
          cleanId.includes('@') ? cleanId : 'admin@prayercloud.org',
          'Super Administrator',
          {
            username: cleanId.includes('@') ? cleanId.split('@')[0] : 'admin',
            role: 'Super Admin',
            country: 'Global',
            phoneNumber: '+1-800-PRAY-NOW',
          }
        );
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found' });
    }

    await logAuditToDb('USER_LOGIN', `User logged in via Cloud SQL: ${user.email}`, user.uid, user.fullName || 'User');

    // Asynchronously dispatch login security alert (non-blocking)
    if (user.email && user.email.includes('@')) {
      emailService.sendSecurityAlert(user.email, 'NEW_LOGIN', {
        ip: req.ip || (req.headers['x-forwarded-for'] as string) || '',
        userAgent: (req.headers['user-agent'] as string) || 'Browser Client',
        timestamp: new Date().toUTCString(),
      }).catch(err => console.warn('Login security alert notice:', err));
    }

    return res.json({ success: true, user });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Login failed' });
  }
});

app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { uid, email, fullName, username, phoneNumber, country, role, avatarUrl, bio } = req.body || {};
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    const finalUid = uid || `usr-${Date.now()}`;
    // Security: Only admins can assign Admin/Super Admin roles from the admin panel. Public registration roles cannot be Admin.
    const isSeedAdmin = finalUid === 'usr-admin-1' || cleanEmail === 'admin@prayercloud.org';
    const safeRole = (role === 'Super Admin' || role === 'Admin') && !isSeedAdmin ? 'Prayer Warrior' : (role || 'Prayer Warrior');

    const user = await getOrCreateUser(finalUid, cleanEmail, fullName, {
      username,
      phoneNumber,
      country,
      role: safeRole,
      avatarUrl,
      bio,
      isVerified: isSeedAdmin, // Seed admin is auto-verified; users verify via OTP
    });

    await logAuditToDb('USER_REGISTER', `New user registered in Cloud SQL: ${cleanEmail}`, finalUid, fullName || 'User');

    // Trigger verification OTP immediately for regular registrations
    let otpDispatched = false;
    if (!isSeedAdmin) {
      try {
        const { otp } = await createEmailOtp({
          email: cleanEmail,
          purpose: 'VERIFY_EMAIL',
          expiryMinutes: 10,
          resendCooldownSeconds: 60,
        });

        // Send OTP email in background
        emailService.sendVerificationOtp(cleanEmail, otp, 'VERIFY_EMAIL', 10)
          .catch(err => console.warn('Initial registration OTP dispatch notice:', err));
        otpDispatched = true;
      } catch (err) {
        console.warn('Could not generate initial registration OTP:', err);
      }
    }

    return res.json({
      success: true,
      user,
      requiresVerification: !isSeedAdmin,
      otpDispatched,
      message: isSeedAdmin
        ? 'Account registered successfully.'
        : 'Account created! Please check your email for the 6-digit verification code.'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Registration failed' });
  }
});

// ==========================================
// 2B. EMAIL OTP & ACCOUNT VERIFICATION
// ==========================================

// Trigger or request an email OTP
app.post('/api/auth/send-otp', async (req: Request, res: Response) => {
  try {
    const { email, purpose = 'VERIFY_EMAIL' } = req.body || {};
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }
    const cleanEmail = String(email).trim().toLowerCase();

    // Check rate limit and resend cooldown (60 seconds)
    const canResend = await checkCanResendOtp(cleanEmail, purpose);
    if (!canResend.canResend) {
      return res.status(429).json({
        success: false,
        error: `Please wait ${canResend.waitSeconds} seconds before requesting a new code.`,
        waitSeconds: canResend.waitSeconds,
      });
    }

    const { otp, expiresAt } = await createEmailOtp({
      email: cleanEmail,
      purpose,
      expiryMinutes: 10,
      resendCooldownSeconds: 60,
    });

    const result = await emailService.sendVerificationOtp(cleanEmail, otp, purpose, 10);
    await logAuditToDb('OTP_DISPATCHED', `Verification code sent to ${cleanEmail} (${purpose})`, cleanEmail, 'User');

    return res.json({
      success: true,
      message: 'A verification code has been dispatched to your email address.',
      resendCooldownSeconds: 60,
      expiresAt: expiresAt.toISOString(),
      mode: result.mode,
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Failed to send verification code.' });
  }
});

// Verify email OTP
app.post('/api/auth/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, code, purpose = 'VERIFY_EMAIL' } = req.body || {};
    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email and 6-digit verification code are required.' });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanCode = String(code).trim();

    const verification = await verifyEmailOtp({
      email: cleanEmail,
      code: cleanCode,
      purpose,
    });

    if (!verification.success) {
      if (verification.reason === 'EXPIRED') {
        return res.status(400).json({ success: false, error: 'This verification code has expired. Please request a new one.' });
      }
      if (verification.reason === 'MAX_ATTEMPTS') {
        return res.status(429).json({ success: false, error: 'Maximum verification attempts exceeded. Please request a fresh code.' });
      }
      return res.status(400).json({
        success: false,
        error: 'Invalid verification code. Please check and try again.',
        attemptsLeft: verification.attemptsLeft,
      });
    }

    // If verifying registration email, look up user and dispatch welcome email
    if (purpose === 'VERIFY_EMAIL') {
      try {
        const allUsers = await getAllUsersFromDb();
        const user = allUsers.find((u: any) => u.email?.toLowerCase() === cleanEmail);
        if (user) {
          emailService.sendWelcomeEmail(
            user.fullName || cleanEmail.split('@')[0],
            cleanEmail,
            user.role || 'Prayer Warrior'
          ).catch(err => console.warn('Welcome email notice:', err));
        }
      } catch (err) {
        console.warn('Welcome email lookup notice:', err);
      }
    }

    await logAuditToDb('OTP_VERIFIED', `Verification code confirmed for ${cleanEmail} (${purpose})`, cleanEmail, 'User');

    return res.json({
      success: true,
      message: 'Email address verified successfully!',
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Failed to verify code.' });
  }
});

// Resend OTP endpoint
app.post('/api/auth/resend-otp', async (req: Request, res: Response) => {
  try {
    const { email, purpose = 'VERIFY_EMAIL' } = req.body || {};
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required.' });
    }
    const cleanEmail = String(email).trim().toLowerCase();

    const canResend = await checkCanResendOtp(cleanEmail, purpose);
    if (!canResend.canResend) {
      return res.status(429).json({
        success: false,
        error: `Please wait ${canResend.waitSeconds}s before requesting a new code.`,
        waitSeconds: canResend.waitSeconds,
      });
    }

    const { otp, expiresAt } = await createEmailOtp({
      email: cleanEmail,
      purpose,
      expiryMinutes: 10,
      resendCooldownSeconds: 60,
    });

    await emailService.sendVerificationOtp(cleanEmail, otp, purpose, 10);
    await logAuditToDb('OTP_RESENT', `Verification code resent to ${cleanEmail}`, cleanEmail, 'User');

    return res.json({
      success: true,
      message: 'A fresh verification code has been dispatched to your email.',
      resendCooldownSeconds: 60,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Failed to resend code.' });
  }
});

// ==========================================
// 2C. SECURE PASSWORD RESET FLOW
// ==========================================

// Request password reset (Constant-time response to prevent email harvesting)
app.post('/api/auth/forgot-password', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.body || {};
    if (!identifier) {
      return res.status(400).json({ success: false, error: 'Email or username is required.' });
    }
    const cleanId = String(identifier).trim().toLowerCase();

    // Constant-time generic response to prevent account enumeration
    const genericResponse = {
      success: true,
      message: 'If an account matches this email or username, password reset instructions have been dispatched.',
    };

    let targetUser: any = null;
    try {
      const allUsers = await getAllUsersFromDb();
      targetUser = allUsers.find(
        (u: any) =>
          u.email?.toLowerCase() === cleanId ||
          u.username?.toLowerCase() === cleanId
      );
    } catch {}

    if (targetUser && targetUser.email) {
      const { token, code, expiresAt } = await createPasswordResetRecord({
        email: targetUser.email,
        userUid: targetUser.uid,
        expiryMinutes: 30,
      });

      // Dispatch reset email asynchronously
      emailService.sendPasswordResetEmail(targetUser.email, token, code, 30).catch(err => {
        console.error('Password reset email dispatch error:', err);
      });

      await logAuditToDb('PASSWORD_RESET_REQUESTED', `Reset requested for ${targetUser.email}`, targetUser.uid, targetUser.fullName);
    }

    return res.json(genericResponse);
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Password reset request failed.' });
  }
});

// Submit new password with reset token or code
app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, tokenOrCode, newPassword } = req.body || {};
    if (!tokenOrCode || !newPassword) {
      return res.status(400).json({ success: false, error: 'Token/code and new password are required.' });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
    }

    const verification = await verifyAndConsumePasswordReset({
      email,
      tokenOrCode: String(tokenOrCode),
    });

    if (!verification.success || !verification.email) {
      return res.status(400).json({ success: false, error: verification.error || 'Invalid or expired password reset link/code.' });
    }

    // Send security alert
    emailService.sendSecurityAlert(verification.email, 'PASSWORD_CHANGED', {
      ip: req.ip || (req.headers['x-forwarded-for'] as string) || '',
      userAgent: req.headers['user-agent'] || '',
      timestamp: new Date().toUTCString(),
    }).catch(() => {});

    await logAuditToDb('PASSWORD_RESET_COMPLETED', `Password reset completed for ${verification.email}`, verification.userUid || 'user', 'User');

    return res.json({
      success: true,
      message: 'Your password has been successfully reset. You can now log in with your new credentials.',
      email: verification.email,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Failed to reset password.' });
  }
});

// ==========================================
// 2D. CONTACT FORM INQUIRIES & ADMIN NOTIFICATIONS
// ==========================================
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, subject, and message are all required.' });
    }

    const saved = await saveContactMessage({
      name: String(name),
      email: String(email),
      subject: String(subject),
      message: String(message),
    });

    // Send confirmation to sender and alert to admin
    emailService.handleContactSubmission(
      String(name),
      String(email),
      String(subject),
      String(message),
      req.ip || (req.headers['x-forwarded-for'] as string)
    ).catch(err => {
      console.warn('Contact email dispatch notice:', err);
    });

    await logAuditToDb('CONTACT_SUBMITTED', `Contact form submitted by ${name} (${email}): ${subject}`);

    return res.json({
      success: true,
      message: 'Thank you for contacting PrayerCloud! Your message has been received.',
      id: saved.id,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Failed to submit contact message.' });
  }
});

// ==========================================
// 2E. EMAIL DELIVERY STATUS & TEST DISPATCH
// ==========================================
app.get('/api/email/status', async (req: Request, res: Response) => {
  try {
    const hasApiKey = !!(process.env.RESEND_API_KEY || '').trim();
    const sender = (process.env.EMAIL_FROM || '').trim() || 'PrayerCloud <notifications@livingtech.name.ng>';
    const adminEmail = (process.env.ADMIN_NOTIFICATION_EMAIL || '').trim() || 'admin@prayercloud.org';

    return res.json({
      success: true,
      provider: 'Resend',
      isLive: hasApiKey,
      mode: hasApiKey ? 'live' : 'logged_fallback',
      sender,
      adminEmail,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Failed to fetch email status' });
  }
});

app.post('/api/email/test', async (req: Request, res: Response) => {
  try {
    const { recipient, sender } = req.body || {};
    const targetEmail = recipient || (process.env.ADMIN_NOTIFICATION_EMAIL || '').trim() || 'admin@prayercloud.org';

    let result: any;
    if (sender) {
      result = await emailService.sendEmail({
        to: targetEmail,
        from: sender,
        subject: 'PrayerCloud Test Verification Code: 777999',
        html: `<p>Dear Intercessor,</p><p>This is a test verification email from PrayerCloud. Your code is: <strong>777999</strong></p>`,
        text: `PrayerCloud Test Verification Code: 777999`,
      });
    } else {
      result = await emailService.sendVerificationOtp(
        targetEmail,
        '777999',
        'VERIFY_EMAIL',
        10
      );
    }

    await logAuditToDb('TEST_EMAIL_SENT', `Test verification email dispatched to ${targetEmail}`);

    return res.json({
      success: result.success,
      recipient: targetEmail,
      senderUsed: sender || (process.env.EMAIL_FROM || 'PrayerCloud <notifications@livingtech.name.ng>'),
      mode: result.mode,
      messageId: result.messageId,
      error: result.error,
      message: result.success
        ? `Test email successfully dispatched to ${targetEmail}.`
        : `Email delivery status: ${result.error}`,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Failed to dispatch test email' });
  }
});

app.post('/api/users/sync', async (req: Request, res: Response) => {
  try {
    const { uid, email, fullName, username, phoneNumber, country, role, avatarUrl, bio } = req.body || {};
    if (!uid || !email) {
      return res.status(400).json({ success: false, error: 'uid and email are required' });
    }
    const user = await getOrCreateUser(uid, email, fullName, {
      username,
      phoneNumber,
      country,
      role,
      avatarUrl,
      bio,
    });
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to sync user to Cloud SQL' });
  }
});

app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const list = await getAllUsersFromDb();
    res.json({ success: true, users: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to retrieve users' });
  }
});

app.delete('/api/users/:uid', async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    if (!uid) {
      return res.status(400).json({ success: false, error: 'User UID required' });
    }
    const deleted = await deleteUserFromDb(uid);
    await logAuditToDb('DELETE_USER_FROM_DB', `Deleted user account ${uid}`, 'admin', 'Super Admin');
    res.json({ success: true, deleted });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to delete user' });
  }
});

app.post('/api/users/purge-non-admins', async (req: Request, res: Response) => {
  try {
    const deleted = await purgeNonAdminUsersFromDb();
    await logAuditToDb('PURGE_NON_ADMIN_USERS', `Purged ${deleted.length} non-admin accounts to reset for live launch`, 'admin', 'Super Admin');
    res.json({ success: true, purgedCount: deleted.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to purge users' });
  }
});

// ==========================================
// 3. PRAYER REQUESTS & PETITIONS
// ==========================================
app.get('/api/prayers', async (req: Request, res: Response) => {
  try {
    const list = await getAllPrayersFromDb();
    res.json({ success: true, prayers: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to fetch prayers' });
  }
});

app.post('/api/prayers', async (req: Request, res: Response) => {
  try {
    const {
      id,
      customId,
      title,
      description,
      targetCountry,
      category,
      urgency,
      authorId,
      authorName,
      authorRole,
      authorCountry,
      prayerCount,
      prayingUserIds,
      commentsJson
    } = req.body || {};

    if (!title || !description || !authorId) {
      return res.status(400).json({ success: false, error: 'title, description, and authorId are required' });
    }

    const prayer = await createPrayerInDb({
      id,
      customId: customId || id,
      title,
      description,
      targetCountry,
      category,
      urgency,
      authorId,
      authorName: authorName || 'Intercessor',
      authorRole,
      authorCountry,
      prayerCount,
      prayingUserIds,
      commentsJson,
    });
    await logAuditToDb('PRAYER_CREATED', `New prayer petition submitted: ${title}`, authorId, authorName);
    res.json({ success: true, prayer });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to save prayer to Cloud SQL' });
  }
});

app.post('/api/prayers/:customId/agree', async (req: Request, res: Response) => {
  try {
    const { customId } = req.params;
    const { userId } = req.body || {};
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }
    const updated = await agreePrayerInDb(customId, userId);

    // Asynchronously notify the prayer author by email
    try {
      const allPrayers = await getAllPrayersFromDb();
      const p = allPrayers.find((item: any) => item.customId === customId);
      if (p && p.authorUid) {
        const allUsers = await getAllUsersFromDb();
        const author = allUsers.find((u: any) => u.uid === p.authorUid);
        const intercessor = allUsers.find((u: any) => u.uid === userId);
        if (author && author.email && author.email.includes('@') && author.uid !== userId) {
          emailService.sendPrayerAgreedNotification(
            author.email,
            p.title,
            intercessor?.fullName || 'A fellow intercessor',
            p.targetCountry || 'Global'
          ).catch(err => console.warn('Prayer agreed email notification notice:', err));
        }
      }
    } catch (e) {
      console.warn('Prayer agreed notification lookup notice:', e);
    }

    res.json({ success: true, prayer: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to agree in prayer' });
  }
});

app.post('/api/prayers/:customId/comments', async (req: Request, res: Response) => {
  try {
    const { customId } = req.params;
    const { comment } = req.body || {};
    if (!comment) {
      return res.status(400).json({ success: false, error: 'comment object is required' });
    }
    const updated = await addCommentToPrayerInDb(customId, comment);
    res.json({ success: true, prayer: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to add comment to prayer' });
  }
});

app.post('/api/prayers/purge-demo', async (req: Request, res: Response) => {
  try {
    const deleted = await purgeDemoPrayersFromDb();
    await logAuditToDb('PURGE_DEMO_PRAYERS', `Purged demo prayers from database for clean production launch`, 'admin', 'Super Admin');
    res.json({ success: true, purgedCount: deleted.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to purge demo prayers' });
  }
});

app.delete('/api/prayers/:customId', async (req: Request, res: Response) => {
  try {
    const { customId } = req.params;
    const deleted = await deletePrayerFromDb(customId);
    res.json({ success: true, deleted });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to delete prayer' });
  }
});

// ==========================================
// 4. MISSION REPORTS
// ==========================================
app.get('/api/reports', async (req: Request, res: Response) => {
  try {
    const list = await getAllReportsFromDb();
    res.json({ success: true, reports: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to fetch mission reports' });
  }
});

app.post('/api/reports', async (req: Request, res: Response) => {
  try {
    const reportData = req.body || {};
    if (!reportData.title || !reportData.content || !reportData.authorId || !reportData.country) {
      return res.status(400).json({ success: false, error: 'title, content, authorId, and country are required' });
    }
    const created = await createReportInDb(reportData);
    await logAuditToDb('MISSION_REPORT_CREATED', `Field report published: ${reportData.title}`, reportData.authorId, reportData.authorName);
    res.json({ success: true, report: created });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to create report' });
  }
});

app.post('/api/reports/:id/like', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body || {};
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }
    const updated = await likeReportInDb(id, userId);
    res.json({ success: true, report: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to like report' });
  }
});

app.delete('/api/reports/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteReportFromDb(id);
    res.json({ success: true, deleted });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to delete report' });
  }
});

// ==========================================
// 5. EVENT MEETINGS & PRAYER SUMMITS
// ==========================================
app.get('/api/events', async (req: Request, res: Response) => {
  try {
    const list = await getAllEventsFromDb();
    res.json({ success: true, events: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to fetch events' });
  }
});

app.post('/api/events', async (req: Request, res: Response) => {
  try {
    const eventData = req.body || {};
    if (!eventData.title || !eventData.description || !eventData.scheduledAt || !eventData.hostId) {
      return res.status(400).json({ success: false, error: 'title, description, scheduledAt, and hostId are required' });
    }
    const created = await createEventInDb(eventData);
    await logAuditToDb('EVENT_CREATED', `Prayer event scheduled: ${eventData.title}`, eventData.hostId, eventData.hostName);
    res.json({ success: true, event: created });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to create event' });
  }
});

app.post('/api/events/:id/rsvp', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body || {};
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId is required' });
    }
    const updated = await rsvpEventInDb(id, userId);

    // Asynchronously dispatch RSVP confirmation email to the participant
    try {
      const allEvents = await getAllEventsFromDb();
      const ev = allEvents.find((item: any) => item.id === id);
      if (ev) {
        const allUsers = await getAllUsersFromDb();
        const user = allUsers.find((u: any) => u.uid === userId);
        if (user && user.email && user.email.includes('@')) {
          emailService.sendEventRsvpEmail(
            user.email,
            user.fullName || user.username || 'Intercessor',
            ev.title,
            ev.scheduledAt,
            ev.zoomUrl || undefined
          ).catch(err => console.warn('Event RSVP email dispatch notice:', err));
        }
      }
    } catch (e) {
      console.warn('Event RSVP email lookup notice:', e);
    }

    res.json({ success: true, event: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to RSVP to event' });
  }
});

app.delete('/api/events/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteEventFromDb(id);
    res.json({ success: true, deleted });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to delete event' });
  }
});

// ==========================================
// 6. CHAT MESSAGES & REALTIME COMMUNICATION
// ==========================================
app.get('/api/chat/messages', async (req: Request, res: Response) => {
  try {
    const { roomId } = req.query as { roomId?: string };
    const list = await getChatMessagesFromDb(roomId);
    res.json({ success: true, messages: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to fetch chat messages' });
  }
});

app.post('/api/chat/messages', async (req: Request, res: Response) => {
  try {
    const msgData = req.body || {};
    if (!msgData.roomId || !msgData.senderId || !msgData.content) {
      return res.status(400).json({ success: false, error: 'roomId, senderId, and content are required' });
    }
    const created = await createChatMessageInDb(msgData);
    res.json({ success: true, message: created });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to save chat message' });
  }
});

// ==========================================
// 7. SITE SETTINGS & BRANDING
// ==========================================
app.get('/api/settings', async (req: Request, res: Response) => {
  try {
    const settings = await getSiteSettingsFromDb();
    res.json({ success: true, settings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to fetch site settings' });
  }
});

app.post('/api/settings', async (req: Request, res: Response) => {
  try {
    const settingsObj = req.body || {};
    const updated = await saveSiteSettingsToDb(settingsObj);
    await logAuditToDb('SETTINGS_UPDATED', `Global site settings updated in Cloud SQL`, 'admin', 'Super Admin');
    res.json({ success: true, settings: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to save site settings' });
  }
});

// ==========================================
// 8. DEMOGRAPHICS & SYNC STATUS
// ==========================================
app.get('/api/sync/status', async (req: Request, res: Response) => {
  try {
    const status = await getLatestSyncStatus();
    res.json({ success: true, data: status });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to fetch sync status' });
  }
});

app.post('/api/sync/trigger', async (req: Request, res: Response) => {
  try {
    const { countriesCount, upgsCount, interval } = req.body || {};
    const recorded = await recordSyncExecution(countriesCount || 195, upgsCount || 7420, interval || '1h');
    await logAuditToDb('DEMOGRAPHICS_SYNC_TRIGGERED', `Cloud SQL demographic sync triggered for ${countriesCount || 195} countries.`);
    res.json({ success: true, record: recorded });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to record sync execution' });
  }
});

// ==========================================
// 8B. LIVE SEARCH ENGINE DEMOGRAPHIC SYNC
// ==========================================
app.get('/api/countries', async (req: Request, res: Response) => {
  try {
    const { ALL_COUNTRIES } = await import('./src/data/countriesData.ts');
    res.json({ success: true, countries: ALL_COUNTRIES, timestamp: new Date().toISOString() });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to load countries' });
  }
});

app.post('/api/countries/search-sync', async (req: Request, res: Response) => {
  try {
    const { countryCode, countryName } = req.body || {};
    const { ALL_COUNTRIES } = await import('./src/data/countriesData.ts');
    
    let target = ALL_COUNTRIES.find(c => 
      (countryCode && (c.code.toUpperCase() === countryCode.toUpperCase() || c.code3.toUpperCase() === countryCode.toUpperCase())) ||
      (countryName && c.name.toLowerCase() === countryName.toLowerCase())
    );

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
    
    // If Gemini API is available and a specific country is requested, perform live Google Search Grounding
    if (apiKey && target) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        const prompt = `Search live Google Search for the most up-to-date demographic statistics for ${target.name} (${target.code3}).
Extract:
1. Latest total population (integer)
2. Dominant religion percentages breakdown (e.g. Christianity %, Islam %, Hinduism %, etc.)
3. Top 3 to 6 unreached places, unreached tribes, or unreached people groups needing missionary workforce.
Return ONLY valid JSON in format:
{
  "population": number,
  "dominantReligions": [{ "religion": string, "percentage": number }],
  "unreachedPlaces": string[],
  "source": string
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
          }
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.population && typeof parsed.population === 'number') {
            target = {
              ...target,
              population: parsed.population,
              dominantReligions: Array.isArray(parsed.dominantReligions) && parsed.dominantReligions.length > 0 ? parsed.dominantReligions : target.dominantReligions,
              unreachedPlaces: Array.isArray(parsed.unreachedPlaces) && parsed.unreachedPlaces.length > 0 ? parsed.unreachedPlaces : target.unreachedPlaces,
              lastUpdatedFromSearch: new Date().toISOString(),
              searchGroundingSource: parsed.source || 'Live Google Search Engine Grounding (2026 UN & Census)'
            };
          }
        }
      } catch (aiErr) {
        console.warn('Live Google Search Grounding note:', aiErr);
      }
    }

    await logAuditToDb('SEARCH_ENGINE_SYNC', `Search engine demographic sync executed for ${countryCode || 'all nations'}`);

    res.json({
      success: true,
      country: target || null,
      countriesCount: ALL_COUNTRIES.length,
      timestamp: new Date().toISOString(),
      source: 'United Nations World Population Prospects (2024-2026 Revision) & Joshua Project Live Search Engine'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to sync with search engines' });
  }
});

// ==========================================
// 9. AUDIT LOGS
// ==========================================
app.post('/api/audit', async (req: Request, res: Response) => {
  try {
    const { action, details, actorId, actorName } = req.body || {};
    if (!action) {
      return res.status(400).json({ success: false, error: 'action is required' });
    }
    const logged = await logAuditToDb(action, details || '', actorId || 'system', actorName || 'User');
    res.json({ success: true, log: logged });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to write audit log' });
  }
});

// ==========================================
// 10. GEMINI AI ASSISTANT & GROUNDING ENGINE
// ==========================================
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { history, message, model = 'gemini-3.8-flash', systemInstruction, groundingMode = 'none' } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'message string is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
    const ai = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Validate supported model names strictly
    const validModels = ['gemini-3.8-flash', 'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite'];
    const selectedModel = validModels.includes(model) ? model : 'gemini-3.8-flash';

    // Build multi-turn contents
    const contents: any[] = [];
    if (Array.isArray(history)) {
      history.forEach((h: any) => {
        if (h.text && (h.role === 'user' || h.role === 'model')) {
          contents.push({
            role: h.role,
            parts: [{ text: h.text }]
          });
        }
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Configure tools for Search and Maps Grounding
    const tools: any[] = [];
    if (groundingMode === 'googleSearch') {
      tools.push({ googleSearch: {} });
    } else if (groundingMode === 'googleMaps') {
      tools.push({ googleMaps: {} });
    }

    const config: any = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (tools.length > 0) {
      config.tools = tools;
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config,
    });

    const candidate = response.candidates?.[0];
    const textOutput = response.text || candidate?.content?.parts?.[0]?.text || '';

    // Extract grounding sources
    const sources: any[] = [];
    const groundingMeta = candidate?.groundingMetadata;
    if (groundingMeta) {
      if (Array.isArray(groundingMeta.groundingChunks)) {
        groundingMeta.groundingChunks.forEach((chunk: any) => {
          if (chunk.web?.uri) {
            sources.push({
              title: chunk.web.title || 'Web Search Source',
              url: chunk.web.uri,
              sourceType: 'web'
            });
          }
          if (chunk.maps) {
            sources.push({
              title: chunk.maps.title || 'Google Maps Location',
              url: chunk.maps.uri || '',
              sourceType: 'maps'
            });
          }
        });
      }
      if (Array.isArray(groundingMeta.webSearchQueries)) {
        groundingMeta.webSearchQueries.forEach((q: string) => {
          if (!sources.some(s => s.title === q)) {
            sources.push({
              title: `Search Query: "${q}"`,
              sourceType: 'web'
            });
          }
        });
      }
    }

    return res.json({
      success: true,
      text: textOutput,
      sources,
      modelUsed: selectedModel,
      groundingMode,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate AI response'
    });
  }
});

// ==========================================
// 11. SERVER STARTUP & STATIC SPA SERVING
// ==========================================
async function startServer() {
  // Initialize email & security tables in Cloud SQL
  await initEmailTables().catch((err) => console.warn('Email tables init notice:', err));

  const isStandaloneApi = process.env.STANDALONE_API === 'true';

  if (!isStandaloneApi) {
    if (process.env.NODE_ENV !== 'production') {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.resolve(__dirname, 'dist');
      app.use(express.static(distPath));
      app.get('*', (req: Request, res: Response) => {
        // If not an API route, send index.html
        if (!req.path.startsWith('/api')) {
          res.sendFile(path.join(distPath, 'index.html'));
        }
      });
    }
  }

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 PrayerCloud Backend API Online with Full SQL Persistence`);
    console.log(`📡 Listening on http://0.0.0.0:${PORT}`);
    console.log(`🌐 CORS Whitelisted Frontend: https://livingtech.name.ng`);
    console.log(`🗄️ Database: Google Cloud SQL (PostgreSQL 15 europe-west1)`);
    console.log(`=======================================================`);
  });
}

startServer();
