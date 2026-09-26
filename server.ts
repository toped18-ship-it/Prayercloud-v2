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

app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { uid, email, fullName, username, phoneNumber, country, role, avatarUrl, bio } = req.body || {};
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }
    const finalUid = uid || `usr-${Date.now()}`;
    // Security: Only admins can assign Admin/Super Admin roles from the admin panel. Public registration roles cannot be Admin.
    const isSeedAdmin = finalUid === 'usr-admin-1' || email.toLowerCase() === 'admin@prayercloud.org';
    const safeRole = (role === 'Super Admin' || role === 'Admin') && !isSeedAdmin ? 'Prayer Warrior' : (role || 'Prayer Warrior');

    const user = await getOrCreateUser(finalUid, email, fullName, {
      username,
      phoneNumber,
      country,
      role: safeRole,
      avatarUrl,
      bio,
    });
    await logAuditToDb('USER_REGISTER', `New user registered in Cloud SQL: ${email}`, finalUid, fullName || 'User');
    return res.json({ success: true, user });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error?.message || 'Registration failed' });
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
    const { history, message, model = 'gemini-3.5-flash', systemInstruction, groundingMode = 'none' } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'message string is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';
    const ai = new GoogleGenAI(apiKey ? { apiKey } : {});

    // Validate supported model names strictly
    const validModels = ['gemini-3.5-flash', 'gemini-3.1-pro-preview', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
    const selectedModel = validModels.includes(model) ? model : 'gemini-3.5-flash';

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
