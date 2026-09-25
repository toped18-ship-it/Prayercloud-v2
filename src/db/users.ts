import { db } from './index.ts';
import { users, prayerRequests, auditLogs, syncStatus } from './schema.ts';
import { desc, eq, ne, and } from 'drizzle-orm';

// Fetch all users from Cloud SQL
export async function getAllUsersFromDb() {
  try {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  } catch (error) {
    console.error('Database query for users failed:', error);
    throw new Error('Failed to retrieve users from Cloud SQL database.', { cause: error });
  }
}

// Delete a single user from Cloud SQL
export async function deleteUserFromDb(uid: string) {
  try {
    const deleted = await db.delete(users).where(eq(users.uid, uid)).returning();
    return deleted[0] || null;
  } catch (error) {
    console.error(`Failed to delete user ${uid} from Cloud SQL:`, error);
    throw new Error(`Failed to delete user from Cloud SQL database.`, { cause: error });
  }
}

// Purge all non-admin demo users from Cloud SQL to reset user count for fresh production launch
export async function purgeNonAdminUsersFromDb() {
  try {
    const deleted = await db.delete(users).where(
      and(
        ne(users.uid, 'usr-admin-1'),
        ne(users.role, 'Super Admin'),
        ne(users.email, 'admin@prayercloud.org'),
        ne(users.email, 'dtemitope60@gmail.com')
      )
    ).returning();
    return deleted;
  } catch (error) {
    console.error('Failed to purge non-admin users from Cloud SQL:', error);
    throw new Error('Failed to purge non-admin users from Cloud SQL database.', { cause: error });
  }
}

// Get or upsert user into Cloud SQL
export async function getOrCreateUser(
  uid: string,
  email: string,
  fullName?: string,
  extra?: {
    username?: string;
    phoneNumber?: string;
    country?: string;
    role?: string;
    avatarUrl?: string;
    bio?: string;
  }
) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        fullName: fullName || email.split('@')[0],
        username: extra?.username || email.split('@')[0],
        phoneNumber: extra?.phoneNumber || '',
        country: extra?.country || 'Global',
        role: extra?.role || 'Prayer Warrior',
        avatarUrl: extra?.avatarUrl || '',
        bio: extra?.bio || 'Dedicated intercessor standing in the gap.',
        joinedAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(fullName ? { fullName } : {}),
          ...(extra?.username ? { username: extra.username } : {}),
          ...(extra?.phoneNumber ? { phoneNumber: extra.phoneNumber } : {}),
          ...(extra?.country ? { country: extra.country } : {}),
          ...(extra?.role ? { role: extra.role } : {}),
          ...(extra?.avatarUrl ? { avatarUrl: extra.avatarUrl } : {}),
          ...(extra?.bio ? { bio: extra.bio } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to create or update user in Cloud SQL:', error);
    throw new Error('Failed to synchronize user to Cloud SQL database.', { cause: error });
  }
}

// Record prayer request in Cloud SQL
export async function recordPrayerRequestInDb(prayer: {
  id?: string;
  title: string;
  description: string;
  targetCountry?: string;
  urgency?: string;
  authorId: string;
  authorName: string;
}) {
  try {
    const result = await db
      .insert(prayerRequests)
      .values({
        title: prayer.title,
        description: prayer.description,
        targetCountry: prayer.targetCountry || 'Global',
        urgency: prayer.urgency || 'Medium',
        authorUid: prayer.authorId,
        authorName: prayer.authorName,
        prayerCount: 1,
        isAnswered: false,
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to record prayer request in Cloud SQL:', error);
    throw new Error('Failed to save prayer request to Cloud SQL.', { cause: error });
  }
}

// Log audit trail to Cloud SQL
export async function logAuditToCloudSql(
  actorId: string,
  actorName: string,
  action: string,
  details?: string
) {
  try {
    const result = await db
      .insert(auditLogs)
      .values({
        userUid: actorId,
        userName: actorName,
        action,
        details: details || '',
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Failed to write audit log to Cloud SQL:', error);
    return null;
  }
}

// Get or update system sync status
export async function getCloudSqlSyncStatus() {
  try {
    const records = await db.select().from(syncStatus).orderBy(desc(syncStatus.id)).limit(1);
    if (records.length > 0) {
      return records[0];
    }
    const created = await db
      .insert(syncStatus)
      .values({
        autoSyncEnabled: true,
        totalCountriesCount: 195,
        totalUpgsCount: 7420,
        syncInterval: '1h',
      })
      .returning();
    return created[0];
  } catch (error) {
    console.error('Failed to query sync status from Cloud SQL:', error);
    return {
      lastSyncAt: new Date(),
      autoSyncEnabled: true,
      totalCountriesCount: 195,
      totalUpgsCount: 7420,
      syncInterval: '1h',
    };
  }
}
