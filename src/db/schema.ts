// Firebase Realtime Database (RTDB) Schemas and Structure
export interface RTDBSyncStatus {
  lastSyncAt: string;
  autoSyncEnabled: boolean;
  syncInterval: string;
  totalCountriesCount: number;
  totalUpgsCount: number;
  updatedAt: string;
}

export interface RTDBUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  joinedAt: string;
  prayersOfferedCount?: number;
}

export interface RTDBAuditLog {
  id: string;
  userUid: string;
  userName: string;
  action: string;
  details: string;
  createdAt: string;
}
