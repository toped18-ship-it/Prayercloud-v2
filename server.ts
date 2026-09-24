import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getLatestSyncStatus, recordSyncExecution, logAuditToDb } from './src/db/sync.ts';
import { getOrCreateUser, getAllUsersFromDb } from './src/db/users.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    database: 'Cloud SQL (PostgreSQL)',
    projectId: 'temporal-student-6k76w',
    region: 'europe-west1',
    timestamp: new Date().toISOString(),
  });
});

// API: Get Cloud SQL Sync Status
app.get('/api/sync/status', async (req: Request, res: Response) => {
  try {
    const status = await getLatestSyncStatus();
    res.json({ success: true, data: status });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to fetch sync status' });
  }
});

// API: Trigger & Record Demographic Synchronization
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

// API: Synchronize User Profile
app.post('/api/users/sync', async (req: Request, res: Response) => {
  try {
    const { uid, email, fullName } = req.body || {};
    if (!uid || !email) {
      return res.status(400).json({ success: false, error: 'uid and email are required' });
    }
    const user = await getOrCreateUser(uid, email, fullName);
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to sync user' });
  }
});

// API: Get Users
app.get('/api/users', async (req: Request, res: Response) => {
  try {
    const list = await getAllUsersFromDb();
    res.json({ success: true, users: list });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to retrieve users' });
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
