/**
 * Standalone Google Cloud Backend API Client
 * 
 * Routes all database requests from the frontend (hosted on Custom Domains, GitHub Pages, etc.)
 * to the standalone Google Cloud backend API securely via CORS-enabled HTTP fetch calls.
 */

// Production Google Cloud Run backend deployment URLs for PrayerCloud
export const DEV_GOOGLE_CLOUD_BACKEND_URL =
  'https://ais-dev-2riwkkrxe5tdz6cwpjkvyl-20126573867.europe-west1.run.app';

export const SHARED_GOOGLE_CLOUD_BACKEND_URL =
  'https://ais-pre-2riwkkrxe5tdz6cwpjkvyl-20126573867.europe-west1.run.app';

export const DEFAULT_GOOGLE_CLOUD_BACKEND_URL = DEV_GOOGLE_CLOUD_BACKEND_URL;

export const CUSTOM_FRONTEND_DOMAIN = 'https://livingtech.name.ng';

const BACKEND_URL_STORAGE_KEY = 'prayercloud_backend_api_url';

/**
 * Resolves dynamic environment variables from Vite or React runtime
 */
export function getEnvBackendUrl(): string {
  // Check Vite env
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      if (import.meta.env.VITE_API_URL) return String(import.meta.env.VITE_API_URL).trim();
      if (import.meta.env.VITE_BACKEND_API_URL) return String(import.meta.env.VITE_BACKEND_API_URL).trim();
      if (import.meta.env.REACT_APP_API_URL) return String(import.meta.env.REACT_APP_API_URL).trim();
    }
  } catch (_) {}

  // Check Node/Process env if defined in build
  try {
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.VITE_API_URL) return String(process.env.VITE_API_URL).trim();
      if (process.env.REACT_APP_API_URL) return String(process.env.REACT_APP_API_URL).trim();
      if (process.env.API_URL) return String(process.env.API_URL).trim();
    }
  } catch (_) {}

  return '';
}

/**
 * Gets the current configured or active backend API URL
 */
export function getCustomBackendUrl(): string {
  if (typeof window !== 'undefined' && window.localStorage) {
    const saved = localStorage.getItem(BACKEND_URL_STORAGE_KEY);
    if (saved && saved.trim()) {
      return saved.trim().replace(/\/+$/, '');
    }
  }
  return '';
}

/**
 * Allows updating the active backend API URL dynamically from admin settings
 */
export function setCustomBackendUrl(url: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (url && url.trim()) {
      localStorage.setItem(BACKEND_URL_STORAGE_KEY, url.trim().replace(/\/+$/, ''));
    } else {
      localStorage.removeItem(BACKEND_URL_STORAGE_KEY);
    }
  }
}

/**
 * Returns the list of potential backend candidate endpoints for automatic failover
 */
export function getBackendCandidates(): string[] {
  const envUrl = getEnvBackendUrl().replace(/\/+$/, '');
  const custom = getCustomBackendUrl();

  const list: string[] = [];
  if (custom) list.push(custom);
  if (envUrl && !list.includes(envUrl)) list.push(envUrl);
  if (!list.includes(DEV_GOOGLE_CLOUD_BACKEND_URL)) list.push(DEV_GOOGLE_CLOUD_BACKEND_URL);
  if (!list.includes(SHARED_GOOGLE_CLOUD_BACKEND_URL)) list.push(SHARED_GOOGLE_CLOUD_BACKEND_URL);

  // If local or same-origin preview
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.run.app')) {
      list.unshift('');
    }
  }

  return list;
}

/**
 * Dynamically resolves the base URL for the backend API.
 */
export function getApiBaseUrl(): string {
  const custom = getCustomBackendUrl();
  if (custom) return custom;

  const envUrl = getEnvBackendUrl();
  if (envUrl) return envUrl.replace(/\/+$/, '');

  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;

    if (
      hostname === 'livingtech.name.ng' ||
      hostname.endsWith('.github.io') ||
      hostname.includes('livingtech')
    ) {
      return DEV_GOOGLE_CLOUD_BACKEND_URL.replace(/\/+$/, '');
    }

    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.run.app')) {
      return '';
    }
  }

  return DEV_GOOGLE_CLOUD_BACKEND_URL.replace(/\/+$/, '');
}

/**
 * Builds the full qualified URL for an API endpoint
 */
export function getApiUrl(path: string, customBase?: string): string {
  const base = customBase !== undefined ? customBase : getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

export interface ApiHealthResponse {
  status: string;
  service?: string;
  architecture?: string;
  mode?: string;
  database: string;
  region?: string;
  engine?: string;
  orm?: string;
  pool?: string;
  cors?: {
    enabled: boolean;
    whitelistedCustomDomain: string;
    allowedOrigins: string[];
  };
  timestamp: string;
}

/**
 * Performs a fetch request with automatic candidate failover if the primary URL is unreachable
 */
async function fetchWithFailover(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const candidates = getBackendCandidates();
  let lastError: any = null;

  for (const base of candidates) {
    try {
      const url = getApiUrl(endpoint, base);
      const res = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          ...(options.headers || {}),
        },
      });

      // If we get an HTTP response (even 4xx/5xx), the server is reached
      if (res.ok || res.status < 500) {
        if (base && base !== getCustomBackendUrl()) {
          // Save working URL as active backend
          setCustomBackendUrl(base);
        }
        return res;
      }
      lastError = new Error(`HTTP status ${res.status}`);
    } catch (e: any) {
      lastError = e;
      // Try next candidate
    }
  }

  throw lastError || new Error(`Failed to reach backend API for ${endpoint}`);
}

export const apiClient = {
  getApiBaseUrl,
  getApiUrl,
  getCustomBackendUrl,
  setCustomBackendUrl,
  getBackendCandidates,

  async get<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetchWithFailover(endpoint, {
      ...options,
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(`API GET ${endpoint} failed with HTTP status ${res.status}`);
    }
    return res.json();
  },

  async post<T = any>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> {
    const res = await fetchWithFailover(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      throw new Error(`API POST ${endpoint} failed with HTTP status ${res.status}`);
    }
    return res.json();
  },

  async delete<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetchWithFailover(endpoint, {
      ...options,
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(`API DELETE ${endpoint} failed with HTTP status ${res.status}`);
    }
    return res.json();
  },

  // Specific Cloud SQL API Operations
  async checkHealth(): Promise<ApiHealthResponse> {
    return this.get<ApiHealthResponse>('/api/health');
  },

  async login(identifier: string, password?: string): Promise<{ success: boolean; user?: any; error?: string }> {
    return this.post('/api/auth/login', { identifier, password });
  },

  async register(userData: {
    uid?: string;
    email: string;
    fullName?: string;
    username?: string;
    phoneNumber?: string;
    country?: string;
    role?: string;
    avatarUrl?: string;
    bio?: string;
  }): Promise<{ success: boolean; user?: any; error?: string }> {
    return this.post('/api/auth/register', userData);
  },

  async syncUserToCloudSql(userData: {
    uid: string;
    email: string;
    fullName?: string;
    username?: string;
    phoneNumber?: string;
    country?: string;
    role?: string;
    avatarUrl?: string;
    bio?: string;
  }) {
    return this.post('/api/users/sync', userData);
  },

  async getUsersFromCloudSql() {
    return this.get<{ success: boolean; users: any[] }>('/api/users');
  },

  async deleteUserFromCloudSql(uid: string) {
    return this.delete(`/api/users/${encodeURIComponent(uid)}`);
  },

  async purgeNonAdminUsersFromCloudSql() {
    return this.post('/api/users/purge-non-admins');
  },

  // Prayers
  async getPrayersFromCloudSql() {
    return this.get<{ success: boolean; prayers: any[] }>('/api/prayers');
  },

  async recordPrayerInCloudSql(prayerData: any) {
    return this.post('/api/prayers', prayerData);
  },

  async agreeInPrayerInCloudSql(customId: string, userId: string) {
    return this.post(`/api/prayers/${encodeURIComponent(customId)}/agree`, { userId });
  },

  async addCommentToPrayerInCloudSql(customId: string, comment: any) {
    return this.post(`/api/prayers/${encodeURIComponent(customId)}/comments`, { comment });
  },

  async deletePrayerInCloudSql(customId: string) {
    return this.delete(`/api/prayers/${encodeURIComponent(customId)}`);
  },

  // Reports
  async getReportsFromCloudSql() {
    return this.get<{ success: boolean; reports: any[] }>('/api/reports');
  },

  async createReportInCloudSql(reportData: any) {
    return this.post('/api/reports', reportData);
  },

  async likeReportInCloudSql(reportId: string, userId: string) {
    return this.post(`/api/reports/${encodeURIComponent(reportId)}/like`, { userId });
  },

  async deleteReportInCloudSql(reportId: string) {
    return this.delete(`/api/reports/${encodeURIComponent(reportId)}`);
  },

  // Events
  async getEventsFromCloudSql() {
    return this.get<{ success: boolean; events: any[] }>('/api/events');
  },

  async createEventInCloudSql(eventData: any) {
    return this.post('/api/events', eventData);
  },

  async rsvpEventInCloudSql(eventId: string, userId: string) {
    return this.post(`/api/events/${encodeURIComponent(eventId)}/rsvp`, { userId });
  },

  async deleteEventInCloudSql(eventId: string) {
    return this.delete(`/api/events/${encodeURIComponent(eventId)}`);
  },

  // Chat
  async getChatMessagesFromCloudSql(roomId?: string) {
    const query = roomId ? `?roomId=${encodeURIComponent(roomId)}` : '';
    return this.get<{ success: boolean; messages: any[] }>(`/api/chat/messages${query}`);
  },

  async sendChatMessageToCloudSql(msgData: any) {
    return this.post('/api/chat/messages', msgData);
  },

  // Settings & Branding
  async getSettingsFromCloudSql() {
    return this.get<{ success: boolean; settings: any }>('/api/settings');
  },

  async saveSettingsToCloudSql(settings: any) {
    return this.post('/api/settings', settings);
  },

  // Demographics Sync
  async triggerDemographicsSync(params: {
    countriesCount?: number;
    upgsCount?: number;
    interval?: string;
  }) {
    return this.post('/api/sync/trigger', params);
  },

  async getSyncStatus() {
    return this.get('/api/sync/status');
  },

  // Audit Logs
  async logAuditInCloudSql(action: string, details?: string, actorId?: string, actorName?: string) {
    return this.post('/api/audit', { action, details, actorId, actorName });
  }
};
