import { db } from './index.ts';
import { syncStatus, auditLogs } from './schema.ts';
import { desc } from 'drizzle-orm';

export interface CloudSqlSyncRecord {
  id?: number;
  lastSyncAt: string;
  autoSyncEnabled: boolean;
  syncInterval: string;
  totalCountriesCount: number;
  totalUpgsCount: number;
  updatedAt?: string;
}

export async function getLatestSyncStatus(): Promise<CloudSqlSyncRecord> {
  try {
    const list = await db.select().from(syncStatus).orderBy(desc(syncStatus.id)).limit(1);
    if (list.length > 0) {
      const record = list[0];
      return {
        id: record.id,
        lastSyncAt: record.lastSyncAt ? record.lastSyncAt.toISOString() : new Date().toISOString(),
        autoSyncEnabled: record.autoSyncEnabled ?? true,
        syncInterval: record.syncInterval ?? '1h',
        totalCountriesCount: record.totalCountriesCount ?? 195,
        totalUpgsCount: record.totalUpgsCount ?? 7420,
        updatedAt: record.updatedAt ? record.updatedAt.toISOString() : new Date().toISOString(),
      };
    }
    // Seed initial sync status if empty
    const created = await db
      .insert(syncStatus)
      .values({
        autoSyncEnabled: true,
        syncInterval: '1h',
        totalCountriesCount: 195,
        totalUpgsCount: 7420,
      })
      .returning();

    const record = created[0];
    return {
      id: record.id,
      lastSyncAt: record.lastSyncAt ? record.lastSyncAt.toISOString() : new Date().toISOString(),
      autoSyncEnabled: record.autoSyncEnabled ?? true,
      syncInterval: record.syncInterval ?? '1h',
      totalCountriesCount: record.totalCountriesCount ?? 195,
      totalUpgsCount: record.totalUpgsCount ?? 7420,
    };
  } catch (error) {
    console.error('Failed to query Cloud SQL sync status:', error);
    return {
      lastSyncAt: new Date().toISOString(),
      autoSyncEnabled: true,
      syncInterval: '1h',
      totalCountriesCount: 195,
      totalUpgsCount: 7420,
    };
  }
}

export async function recordSyncExecution(
  countriesCount = 195,
  upgsCount = 7420,
  interval = '1h'
): Promise<CloudSqlSyncRecord> {
  try {
    const created = await db
      .insert(syncStatus)
      .values({
        autoSyncEnabled: true,
        syncInterval: interval,
        totalCountriesCount: countriesCount,
        totalUpgsCount: upgsCount,
      })
      .returning();

    const record = created[0];
    return {
      id: record.id,
      lastSyncAt: record.lastSyncAt ? record.lastSyncAt.toISOString() : new Date().toISOString(),
      autoSyncEnabled: record.autoSyncEnabled ?? true,
      syncInterval: record.syncInterval ?? interval,
      totalCountriesCount: record.totalCountriesCount ?? countriesCount,
      totalUpgsCount: record.totalUpgsCount ?? upgsCount,
    };
  } catch (error) {
    console.error('Failed to record sync execution to Cloud SQL:', error);
    throw new Error('Failed to record sync execution to Cloud SQL database.', { cause: error });
  }
}

export async function logAuditToDb(
  action: string,
  details: string,
  userUid = 'system',
  userName = 'Platform System'
) {
  try {
    const created = await db
      .insert(auditLogs)
      .values({
        userUid,
        userName,
        action,
        details,
      })
      .returning();
    return created[0];
  } catch (error) {
    console.error('Failed to write audit log in Cloud SQL:', error);
    return null;
  }
}
