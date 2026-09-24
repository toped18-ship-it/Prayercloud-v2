import { relations } from 'drizzle-orm';
import { boolean, integer, json, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  fullName: text('full_name'),
  role: text('role').default('missionary'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Countries Demographic Table
export const countries = pgTable('countries', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  code3: text('code3'),
  name: text('name').notNull(),
  continent: text('continent'),
  flag: text('flag'),
  population: text('population'),
  unreachedPeopleGroupsCount: integer('upg_count').default(0),
  evangelicalPercentage: text('evangelical_percentage'),
  dominantReligionsJson: json('dominant_religions_json'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Prayer Requests Table
export const prayerRequests = pgTable('prayer_requests', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  targetCountry: text('target_country'),
  authorUid: text('author_uid'),
  authorName: text('author_name'),
  urgency: text('urgency').default('Medium'),
  prayerCount: integer('prayer_count').default(0),
  isAnswered: boolean('is_answered').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Sync Status & Statistics Engine Table
export const syncStatus = pgTable('sync_status', {
  id: serial('id').primaryKey(),
  lastSyncAt: timestamp('last_sync_at').defaultNow(),
  autoSyncEnabled: boolean('auto_sync_enabled').default(true),
  syncInterval: text('sync_interval').default('1h'),
  totalCountriesCount: integer('total_countries_count').default(195),
  totalUpgsCount: integer('total_upgs_count').default(7420),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Audit Logs Table
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid'),
  userName: text('user_name'),
  action: text('action').notNull(),
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  prayerRequests: many(prayerRequests),
  auditLogs: many(auditLogs),
}));

export const prayerRequestsRelations = relations(prayerRequests, ({ one }) => ({
  author: one(users, {
    fields: [prayerRequests.authorUid],
    references: [users.uid],
  }),
}));
