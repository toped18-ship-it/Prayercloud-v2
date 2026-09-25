import { pgTable, serial, text, integer, boolean, timestamp, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table for Cloud SQL PostgreSQL
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID / Unique User ID
  email: text('email').notNull(),
  fullName: text('full_name'),
  role: text('role').default('Prayer Warrior'),
  avatarUrl: text('avatar_url'),
  username: text('username'),
  phoneNumber: text('phone_number'),
  country: text('country').default('Global'),
  bio: text('bio'),
  isVerified: boolean('is_verified').default(true),
  isActive: boolean('is_active').default(true),
  prayersOfferedCount: integer('prayers_offered_count').default(0),
  joinedAt: text('joined_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Prayer Requests table
export const prayerRequests = pgTable('prayer_requests', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  targetCountry: text('target_country'),
  urgency: text('urgency').default('Medium'),
  authorUid: text('author_uid'),
  authorName: text('author_name'),
  prayerCount: integer('prayer_count').default(1),
  isAnswered: boolean('is_answered').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Audit Logs table for security and compliance
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid'),
  userName: text('user_name'),
  action: text('action').notNull(),
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Countries Table in Cloud SQL
export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  code: text('code'),
  code3: text('code3'),
  name: text('name'),
  continent: text('continent'),
  flag: text('flag'),
  population: text('population'),
  upgCount: integer('upg_count'),
  evangelicalPercentage: text('evangelical_percentage'),
  dominantReligionsJson: json('dominant_religions_json'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Demographics and System Synchronization Status
export const syncStatus = pgTable('sync_status', {
  id: serial('id').primaryKey(),
  lastSyncAt: timestamp('last_sync_at').defaultNow(),
  autoSyncEnabled: boolean('auto_sync_enabled').default(true),
  syncInterval: text('sync_interval').default('1h'),
  totalCountriesCount: integer('total_countries_count').default(195),
  totalUpgsCount: integer('total_upgs_count').default(7420),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  prayers: many(prayerRequests),
}));

export const prayerRequestsRelations = relations(prayerRequests, ({ one }) => ({
  user: one(users, {
    fields: [prayerRequests.authorUid],
    references: [users.uid],
  }),
}));
