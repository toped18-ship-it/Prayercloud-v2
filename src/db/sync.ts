import { db } from './index.ts';
import { syncStatus, auditLogs } from './schema.ts';
import { desc } from 'drizzle-orm';

export async function getLatestSyncStatus() {
  try {
    const records = await db.select().from(syncStatus).orderBy(desc(syncStatus.updatedAt)).limit(1);
    return records[0] || null;
  } catch (error) {
    console.error("Database query failed in getLatestSyncStatus:", error);
    return null;
  }
}

export async function recordSyncExecution(countriesCount = 195, upgsCount = 7420, interval = '1h') {
  try {
    const result = await db.insert(syncStatus)
      .values({
        lastSyncAt: new Date(),
        autoSyncEnabled: true,
        syncInterval: interval,
        totalCountriesCount: countriesCount,
        totalUpgsCount: upgsCount,
        updatedAt: new Date(),
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error("Database query failed in recordSyncExecution:", error);
    return null;
  }
}

export async function logAuditToDb(action: string, details: string, userUid?: string, userName?: string) {
  try {
    const result = await db.insert(auditLogs)
      .values({
        userUid: userUid || 'system',
        userName: userName || 'Cloud SQL System Worker',
        action,
        details,
        createdAt: new Date(),
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error("Database query failed in logAuditToDb:", error);
    return null;
  }
}
