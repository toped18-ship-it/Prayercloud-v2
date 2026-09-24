import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, fullName?: string) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        fullName: fullName || email.split('@')[0],
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(fullName ? { fullName } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Database query failed in getOrCreateUser:", error);
    throw new Error("Failed to synchronize user account to Cloud SQL database.", { cause: error });
  }
}

export async function getAllUsersFromDb() {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error("Database query failed in getAllUsersFromDb:", error);
    throw new Error("Failed to fetch users from database.", { cause: error });
  }
}
