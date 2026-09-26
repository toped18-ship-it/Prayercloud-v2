/**
 * Standalone Google Cloud Backend API Client
 * 
 * Routes all database requests from the frontend (hosted on GitHub Pages / https://livingtech.name.ng)
 * to the standalone Google Cloud backend API securely via CORS-enabled HTTP fetch calls.
 */

// Default Google Cloud Run deployment URLs for the PrayerCloud backend API
export const DEV_GOOGLE_CLOUD_BACKEND_URL =
  'https://ais-dev-2riwkkrxe5tdz6cwpjkvyl-20126573867.europe-west1.run.app';

export const SHARED_GOOGLE_CLOUD_BACKEND_URL =
  'https://ais-pre-2riwkkrxe5tdz6cwpjkvyl-20126573867.europe-west1.run.app';

export const DEFAULT_GOOGLE_CLOUD_BACKEND_URL = DEV_GOOGLE_CLOUD_BACKEND_URL;

export const CUSTOM_FRONTEND_DOMAIN = 'https://livingtech.name.ng';

const BACKEND_URL_STORAGE_KEY = 'prayercloud_backend_api_url';

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
  const custom = getCustomBackendUrl();
  const envUrl = typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_API_URL
    ? import.meta.env.VITE_BACKEND_API_URL.replace(/\/+$/, '')
    : '';

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

  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_API_URL) {
    return import.meta.env.VITE_BACKEND_API_URL.replace(/\/+$/, '');
  }

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
    return this.get('/api/users');
  },

  async deleteUserFromCloudSql(uid: string) {
    return this.delete(`/api/users/${encodeURIComponent(uid)}`);
  },

  async purgeNonAdminUsersFromCloudSql() {
    return this.post('/api/users/purge-non-admins');
  },

  async recordPrayerInCloudSql(prayerData: {
    id: string;
    title: string;
    description: string;
    targetCountry?: string;
    category?: string;
    urgency?: string;
    authorId: string;
    authorName?: string;
    authorRole?: string;
    authorCountry?: string;
  }) {
    return this.post('/api/prayers', prayerData);
  },

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
};
