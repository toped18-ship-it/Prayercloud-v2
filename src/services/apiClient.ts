/**
 * Standalone Google Cloud Backend API Client
 * 
 * Routes all database requests from the frontend (hosted on GitHub Pages / https://livingtech.name.ng)
 * to the standalone Google Cloud backend API securely via CORS-enabled HTTP fetch calls.
 */

// Default Google Cloud Run deployment URL for the PrayerCloud backend API
export const DEFAULT_GOOGLE_CLOUD_BACKEND_URL =
  'https://ais-dev-2riwkkrxe5tdz6cwpjkvyl-20126573867.europe-west1.run.app';

export const CUSTOM_FRONTEND_DOMAIN = 'https://livingtech.name.ng';

/**
 * Dynamically resolves the base URL for the backend API.
 * - When running on the decoupled GitHub Pages custom domain (https://livingtech.name.ng),
 *   it directs calls to the Google Cloud Backend API.
 * - When an explicit VITE_BACKEND_API_URL env var is supplied, it honors that value.
 * - When running in same-origin dev/Cloud Run mode, uses relative paths or the direct backend URL.
 */
export function getApiBaseUrl(): string {
  // 1. Explicit environment variable takes top precedence
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_API_URL) {
    return import.meta.env.VITE_BACKEND_API_URL.replace(/\/+$/, '');
  }

  // 2. Browser origin inspection
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;

    // Decoupled frontend custom domain or GitHub Pages
    if (
      hostname === 'livingtech.name.ng' ||
      hostname.endsWith('.github.io') ||
      hostname.includes('livingtech')
    ) {
      return DEFAULT_GOOGLE_CLOUD_BACKEND_URL.replace(/\/+$/, '');
    }

    // In local development or Cloud Run preview on the same origin, relative path works
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.run.app')) {
      return '';
    }
  }

  return DEFAULT_GOOGLE_CLOUD_BACKEND_URL.replace(/\/+$/, '');
}

/**
 * Builds the full qualified URL for an API endpoint
 */
export function getApiUrl(path: string): string {
  const base = getApiBaseUrl();
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

export const apiClient = {
  getApiBaseUrl,
  getApiUrl,

  async get<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = getApiUrl(endpoint);
    const res = await fetch(url, {
      ...options,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      throw new Error(`API GET ${endpoint} failed with HTTP status ${res.status}`);
    }
    return res.json();
  },

  async post<T = any>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> {
    const url = getApiUrl(endpoint);
    const res = await fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
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
    const url = getApiUrl(endpoint);
    const res = await fetch(url, {
      ...options,
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {}),
      },
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
