import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getLatestSyncStatus, recordSyncExecution, logAuditToDb } from './src/db/sync.ts';
import { getOrCreateUser, getAllUsersFromDb, recordPrayerRequestInDb, deleteUserFromDb, purgeNonAdminUsersFromDb } from './src/db/users.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Health Check & Cloud SQL Connection Info
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    database: 'Google Cloud SQL (PostgreSQL)',
    region: 'europe-west1',
    engine: 'PostgreSQL 15',
    orm: 'Drizzle ORM',
    pool: 'pg.Pool (Object Configuration)',
    timestamp: new Date().toISOString(),
  });
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

// Vite middleware in development vs Static files in production
async function startServer() {
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
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
