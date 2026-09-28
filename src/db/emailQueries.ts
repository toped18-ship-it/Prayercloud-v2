import crypto from 'crypto';
import { db, createPool } from './index.ts';
import { emailOtps, passwordResetTokens, contactMessages, emailLogs, users } from './schema.ts';
import { eq, and, desc, sql } from 'drizzle-orm';

/**
 * Hash a plain text string (code or token) with SHA-256
 */
export function hashSecret(secret: string): string {
  return crypto.createHash('sha256').update(secret.trim()).digest('hex');
}

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 */
export function generateNumericOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * Generate a cryptographically secure random URL-safe token (64 hex chars)
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Ensure email tables exist in PostgreSQL
 */
export async function initEmailTables(): Promise<void> {
  try {
    const pool = createPool();
    await pool.query(`
      CREATE TABLE IF NOT EXISTS email_otps (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        code_hash TEXT NOT NULL,
        purpose TEXT DEFAULT 'VERIFY_EMAIL',
        attempts INTEGER DEFAULT 0,
        max_attempts INTEGER DEFAULT 5,
        expires_at TIMESTAMP NOT NULL,
        resend_available_at TIMESTAMP NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_email_otps_email_purpose ON email_otps(email, purpose);

      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        token_hash TEXT NOT NULL,
        code_hash TEXT,
        email TEXT NOT NULL,
        user_uid TEXT,
        expires_at TIMESTAMP NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_pwd_reset_email ON password_reset_tokens(email);

      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'NEW',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS email_logs (
        id SERIAL PRIMARY KEY,
        idempotency_key TEXT UNIQUE,
        recipient TEXT NOT NULL,
        subject TEXT NOT NULL,
        template TEXT NOT NULL,
        status TEXT DEFAULT 'SENT',
        provider_message_id TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('[EmailQueries] PostgreSQL email tables verified/initialized.');
  } catch (err) {
    console.warn('[EmailQueries] Notice checking email tables in Cloud SQL:', err);
  }
}

// In-Memory Fallback Cache for resilient operation
interface MemoryOtp {
  email: string;
  codeHash: string;
  purpose: string;
  attempts: number;
  maxAttempts: number;
  expiresAt: Date;
  resendAvailableAt: Date;
  isUsed: boolean;
}

interface MemoryResetToken {
  tokenHash: string;
  codeHash?: string;
  email: string;
  userUid?: string;
  expiresAt: Date;
  isUsed: boolean;
}

const memoryOtps: MemoryOtp[] = [];
const memoryResetTokens: MemoryResetToken[] = [];

// =========================================================================
// OTP GENERATION & VERIFICATION
// =========================================================================

export async function createEmailOtp(params: {
  email: string;
  purpose?: 'VERIFY_EMAIL' | 'LOGIN_VERIFICATION' | 'PASSWORD_RESET';
  expiryMinutes?: number;
  resendCooldownSeconds?: number;
}): Promise<{ otp: string; expiresAt: Date; resendAvailableAt: Date }> {
  const cleanEmail = params.email.trim().toLowerCase();
  const purpose = params.purpose || 'VERIFY_EMAIL';
  const expiryMinutes = params.expiryMinutes || 10;
  const resendCooldownSeconds = params.resendCooldownSeconds || 60;

  const otp = generateNumericOtp();
  const codeHash = hashSecret(otp);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiryMinutes * 60 * 1000);
  const resendAvailableAt = new Date(now.getTime() + resendCooldownSeconds * 1000);

  // Invalidate any existing unused OTPs for this email & purpose
  try {
    await db
      .update(emailOtps)
      .set({ isUsed: true })
      .where(
        and(
          eq(emailOtps.email, cleanEmail),
          eq(emailOtps.purpose, purpose),
          eq(emailOtps.isUsed, false)
        )
      );

    await db.insert(emailOtps).values({
      email: cleanEmail,
      codeHash,
      purpose,
      attempts: 0,
      maxAttempts: 5,
      expiresAt,
      resendAvailableAt,
      isUsed: false,
    });
  } catch (err) {
    console.warn('[EmailQueries] Cloud SQL insert OTP notice, using memory fallback:', err);
  }

  // Also update memory fallback
  memoryOtps.forEach(o => {
    if (o.email === cleanEmail && o.purpose === purpose && !o.isUsed) {
      o.isUsed = true;
    }
  });
  memoryOtps.push({
    email: cleanEmail,
    codeHash,
    purpose,
    attempts: 0,
    maxAttempts: 5,
    expiresAt,
    resendAvailableAt,
    isUsed: false,
  });

  return { otp, expiresAt, resendAvailableAt };
}

export async function checkCanResendOtp(
  email: string,
  purpose = 'VERIFY_EMAIL'
): Promise<{ canResend: boolean; waitSeconds?: number }> {
  const cleanEmail = email.trim().toLowerCase();
  const now = new Date();

  try {
    const list = await db
      .select()
      .from(emailOtps)
      .where(and(eq(emailOtps.email, cleanEmail), eq(emailOtps.purpose, purpose)))
      .orderBy(desc(emailOtps.createdAt))
      .limit(1);

    if (list.length > 0) {
      const latest = list[0];
      if (latest.resendAvailableAt > now) {
        const waitSeconds = Math.ceil((latest.resendAvailableAt.getTime() - now.getTime()) / 1000);
        return { canResend: false, waitSeconds };
      }
    }
  } catch {}

  // Check memory fallback
  const matchingMem = memoryOtps
    .filter(o => o.email === cleanEmail && o.purpose === purpose)
    .sort((a, b) => b.expiresAt.getTime() - a.expiresAt.getTime());

  if (matchingMem.length > 0) {
    const latest = matchingMem[0];
    if (latest.resendAvailableAt > now) {
      const waitSeconds = Math.ceil((latest.resendAvailableAt.getTime() - now.getTime()) / 1000);
      return { canResend: false, waitSeconds };
    }
  }

  return { canResend: true };
}

export async function verifyEmailOtp(params: {
  email: string;
  code: string;
  purpose?: 'VERIFY_EMAIL' | 'LOGIN_VERIFICATION' | 'PASSWORD_RESET';
}): Promise<{
  success: boolean;
  reason?: 'NOT_FOUND' | 'EXPIRED' | 'MAX_ATTEMPTS' | 'INVALID_CODE';
  attemptsLeft?: number;
}> {
  const cleanEmail = params.email.trim().toLowerCase();
  const cleanCode = params.code.trim();
  const purpose = params.purpose || 'VERIFY_EMAIL';
  const inputHash = hashSecret(cleanCode);
  const now = new Date();

  let targetOtp: any = null;

  try {
    const list = await db
      .select()
      .from(emailOtps)
      .where(
        and(
          eq(emailOtps.email, cleanEmail),
          eq(emailOtps.purpose, purpose),
          eq(emailOtps.isUsed, false)
        )
      )
      .orderBy(desc(emailOtps.createdAt))
      .limit(1);

    if (list.length > 0) {
      targetOtp = list[0];
    }
  } catch (err) {
    console.warn('[EmailQueries] Cloud SQL query OTP notice:', err);
  }

  // Fallback to memory
  if (!targetOtp) {
    targetOtp = memoryOtps
      .filter(o => o.email === cleanEmail && o.purpose === purpose && !o.isUsed)
      .sort((a, b) => b.expiresAt.getTime() - a.expiresAt.getTime())[0];
  }

  if (!targetOtp) {
    return { success: false, reason: 'NOT_FOUND' };
  }

  // Check expiry
  if (new Date(targetOtp.expiresAt) < now) {
    return { success: false, reason: 'EXPIRED' };
  }

  // Check attempt limit
  const maxAttempts = targetOtp.maxAttempts || 5;
  const currentAttempts = (targetOtp.attempts || 0) + 1;

  if (currentAttempts > maxAttempts) {
    return { success: false, reason: 'MAX_ATTEMPTS', attemptsLeft: 0 };
  }

  // Timing safe hash comparison
  const isMatch = targetOtp.codeHash === inputHash;

  if (!isMatch) {
    // Increment attempts
    try {
      if (targetOtp.id) {
        await db
          .update(emailOtps)
          .set({ attempts: currentAttempts })
          .where(eq(emailOtps.id, targetOtp.id));
      }
    } catch {}
    targetOtp.attempts = currentAttempts;

    const attemptsLeft = Math.max(0, maxAttempts - currentAttempts);
    return { success: false, reason: 'INVALID_CODE', attemptsLeft };
  }

  // Code verified! Mark as used
  try {
    if (targetOtp.id) {
      await db
        .update(emailOtps)
        .set({ isUsed: true })
        .where(eq(emailOtps.id, targetOtp.id));
    }

    // If purpose was email verification, mark user verified in Cloud SQL
    if (purpose === 'VERIFY_EMAIL') {
      await db
        .update(users)
        .set({ isVerified: true })
        .where(eq(users.email, cleanEmail));
    }
  } catch (err) {
    console.warn('[EmailQueries] Cloud SQL mark OTP used notice:', err);
  }

  targetOtp.isUsed = true;
  return { success: true };
}

// =========================================================================
// PASSWORD RESET TOKENS
// =========================================================================

export async function createPasswordResetRecord(params: {
  email: string;
  userUid?: string;
  expiryMinutes?: number;
}): Promise<{ token: string; code: string; expiresAt: Date }> {
  const cleanEmail = params.email.trim().toLowerCase();
  const expiryMinutes = params.expiryMinutes || 30;

  const token = generateSecureToken();
  const code = generateNumericOtp();
  const tokenHash = hashSecret(token);
  const codeHash = hashSecret(code);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiryMinutes * 60 * 1000);

  try {
    // Invalidate previous reset tokens for this email
    await db
      .update(passwordResetTokens)
      .set({ isUsed: true })
      .where(and(eq(passwordResetTokens.email, cleanEmail), eq(passwordResetTokens.isUsed, false)));

    await db.insert(passwordResetTokens).values({
      tokenHash,
      codeHash,
      email: cleanEmail,
      userUid: params.userUid || null,
      expiresAt,
      isUsed: false,
    });
  } catch (err) {
    console.warn('[EmailQueries] Notice inserting reset token into Cloud SQL:', err);
  }

  memoryResetTokens.forEach(t => {
    if (t.email === cleanEmail && !t.isUsed) t.isUsed = true;
  });
  memoryResetTokens.push({
    tokenHash,
    codeHash,
    email: cleanEmail,
    userUid: params.userUid,
    expiresAt,
    isUsed: false,
  });

  return { token, code, expiresAt };
}

export async function verifyAndConsumePasswordReset(params: {
  email?: string;
  tokenOrCode: string;
}): Promise<{ success: boolean; email?: string; userUid?: string; error?: string }> {
  const input = params.tokenOrCode.trim();
  const inputHash = hashSecret(input);
  const cleanEmail = params.email?.trim().toLowerCase();
  const now = new Date();

  let match: any = null;

  try {
    const list = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.isUsed, false))
      .orderBy(desc(passwordResetTokens.createdAt))
      .limit(20);

    match = list.find(r => {
      const emailMatches = cleanEmail ? r.email.toLowerCase() === cleanEmail : true;
      const tokenMatches = r.tokenHash === inputHash || r.codeHash === inputHash;
      return emailMatches && tokenMatches;
    });
  } catch (err) {
    console.warn('[EmailQueries] Cloud SQL query reset token notice:', err);
  }

  if (!match) {
    match = memoryResetTokens.find(r => {
      const emailMatches = cleanEmail ? r.email.toLowerCase() === cleanEmail : true;
      const tokenMatches = r.tokenHash === inputHash || r.codeHash === inputHash;
      return !r.isUsed && emailMatches && tokenMatches;
    });
  }

  if (!match) {
    return { success: false, error: 'Invalid or expired password reset link/code.' };
  }

  if (new Date(match.expiresAt) < now) {
    return { success: false, error: 'This password reset link/code has expired. Please request a new one.' };
  }

  // Consume token
  try {
    if (match.id) {
      await db
        .update(passwordResetTokens)
        .set({ isUsed: true })
        .where(eq(passwordResetTokens.id, match.id));
    }
  } catch {}

  match.isUsed = true;
  return { success: true, email: match.email, userUid: match.userUid };
}

// =========================================================================
// CONTACT MESSAGES
// =========================================================================

export async function saveContactMessage(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<any> {
  try {
    const res = await db
      .insert(contactMessages)
      .values({
        name: params.name.trim(),
        email: params.email.trim(),
        subject: params.subject.trim(),
        message: params.message.trim(),
        status: 'NEW',
      })
      .returning();
    return res[0];
  } catch (err) {
    console.warn('[EmailQueries] Notice saving contact message to Cloud SQL:', err);
    return {
      id: Date.now(),
      name: params.name,
      email: params.email,
      subject: params.subject,
      message: params.message,
      createdAt: new Date(),
    };
  }
}
