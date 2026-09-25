import { realtimeDbService, RTDBSyncRecord } from '../services/realtimeDbService';

export async function getLatestSyncStatus(): Promise<RTDBSyncRecord | null> {
  return await realtimeDbService.getLatestSyncStatus();
}

export async function recordSyncExecution(countriesCount = 195, upgsCount = 7420, interval = '1h'): Promise<RTDBSyncRecord> {
  return await realtimeDbService.recordSyncExecution(countriesCount, upgsCount, interval);
}

export async function logAuditToDb(action: string, details: string, userUid?: string, userName?: string) {
  return await realtimeDbService.logAudit(action, details, userUid, userName);
}
