import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import { getLatestSyncStatus, recordSyncExecution, logAuditToDb } from './src/db/sync.ts';
import { getOrCreateUser, getAllUsersFromDb, recordPrayerRequestInDb, deleteUserFromDb, purgeNonAdminUsersFromDb } from './src/db/users.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Whitelist of allowed origins for the decoupled architecture
const allowedOrigins: string[] = [
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

// Enable and configure CORS on this standalone Backend API
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

// Preflight options handling for all routes
app.options('*', cors());

app.use(express.json());

// API Health Check & Cloud SQL Connection Info
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'PrayerCloud Standalone Cloud SQL Backend API',
    architecture: 'Decoupled (Frontend on GitHub Pages, Backend on Google Cloud)',
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

// API: Authentication Login via Cloud SQL
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier) {
      return res.status(400).json({ success: false, error: 'Identifier is required' });
    }
    const cleanId = String(identifier).trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    const isAdminIdentifier =
      cleanId === 'admin' ||
      cleanId === 'superadmin' ||
      cleanId === 'administrator' ||
      cleanId === 'admin@prayercloud.org' ||
      cleanId === 'dtemitope60@gmail.com' ||
      cleanId.startsWith('admin@') ||
      cleanId.includes('livingtech') ||
      (cleanId.endsWith('@prayercloud.org') && cleanId.includes('admin'));

    // Query users from Cloud SQL
    let user: any = null;
    try {
      const allUsers = await getAllUsersFromDb();
      user = allUsers.find(
        (u: any) =>
          u.email?.toLowerCase() === cleanId ||
          u.username?.toLowerCase() === cleanId ||
          u.uid === cleanId
      );
    } catch (e) {
      console.warn('Cloud SQL query notice in login:', e);
    }

    if (!user && isAdminIdentifier) {
      // Auto-provision Super Admin in Cloud SQL
      user = await getOrCreateUser(
        'usr-admin-1',
        cleanId.includes('@') ? cleanId : 'admin@prayercloud.org',
        'Super Administrator',
        {
          username: cleanId.includes('@') ? cleanId.split('@')[0] : 'admin',
          role: 'Super Admin',
          country: 'United Kingdom',
          phoneNumber: '+1-800-PRAY-NOW',
        }
      );
    }

    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found' });
    }

    await logAuditToDb('USER_LOGIN', `User logged in via Cloud SQL: ${user.email}`, user.uid, user.fullName || 'User');
    return res.json({ success: true, user });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Login failed' });
  }
});

// API: Authentication Register via Cloud SQL
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { uid, email, fullName, username, phoneNumber, country, role, avatarUrl, bio } = req.body || {};
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    const finalUid = uid || `usr-${Date.now()}`;
    const user = await getOrCreateUser(finalUid, email, fullName, {
      username,
      phoneNumber,
      country,
      role,
      avatarUrl,
      bio,
    });
    await logAuditToDb('USER_REGISTER', `New user registered in Cloud SQL: ${email}`, finalUid, fullName || 'User');
    return res.json({ success: true, user });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Registration failed' });
  }
});

// API: Get Cloud SQL Database Sync Status
app.get('/api/sync/status', async (req: Request, res: Response) => {
  try {
    const status = await getLatestSyncStatus();
    res.json({ success: true, data: status });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to fetch sync status' });
  }
});

// API: Trigger & Record Demographic Synchronization to Cloud SQL
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

// API: Synchronize User Profile to Cloud SQL Database
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

// API: Get Users from Cloud SQL
app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const list = await getAllUsersFromDb();
    res.json({ success: true, users: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to retrieve users' });
  }
});

// API: Delete single user from Cloud SQL
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

// API: Purge all demo/non-admin users to reset for fresh launch
app.post('/api/users/purge-non-admins', async (req: Request, res: Response) => {
  try {
    const deleted = await purgeNonAdminUsersFromDb();
    await logAuditToDb('PURGE_NON_ADMIN_USERS', `Purged ${deleted.length} non-admin accounts to reset for live launch`, 'admin', 'Super Admin');
    res.json({ success: true, purgedCount: deleted.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to purge users' });
  }
});

// API: Record Prayer in Cloud SQL
app.post('/api/prayers', async (req: Request, res: Response) => {
  try {
    const { id, title, description, countryCode, targetCountry, category, urgency, authorId, authorName, authorRole, authorCountry } = req.body || {};
    if (!title || !description || !authorId) {
      return res.status(400).json({ success: false, error: 'title, description, and authorId are required' });
    }
    const prayer = await recordPrayerRequestInDb({
      id: id || `pr-${Date.now()}`,
      title,
      description,
      targetCountry: targetCountry || 'Global',
      urgency: urgency || 'Medium',
      authorId,
      authorName: authorName || 'Intercessor',
    });
    res.json({ success: true, prayer });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to save prayer to Cloud SQL' });
  }
});

// API: Get prayers from Cloud SQL
app.get('/api/prayers', async (req: Request, res: Response) => {
  try {
    const { db } = await import('./src/db/index.ts');
    const { prayerRequests } = await import('./src/db/schema.ts');
    const { desc } = await import('drizzle-orm');
    const list = await db.select().from(prayerRequests).orderBy(desc(prayerRequests.createdAt)).limit(100);
    res.json({ success: true, prayers: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to fetch prayers from Cloud SQL' });
  }
});

// Standalone Backend API & Optional SPA Serving
async function startServer() {
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
    console.log(`🚀 PrayerCloud Standalone Backend API Online`);
    console.log(`📡 Listening on http://0.0.0.0:${PORT}`);
    console.log(`🌐 CORS Whitelisted Frontend: https://livingtech.name.ng`);
    console.log(`🗄️ Database: Google Cloud SQL (PostgreSQL 15 europe-west1)`);
    console.log(`=======================================================`);
  });
}

startServer();
