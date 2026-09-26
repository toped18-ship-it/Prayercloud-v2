import { pgTable, serial, text, integer, boolean, timestamp, json, jsonb } from 'drizzle-orm/pg-core';
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
  customId: text('custom_id'),
  title: text('title').notNull(),
  description: text('description').notNull(),
  targetCountry: text('target_country'),
  category: text('category').default('Unreached People'),
  urgency: text('urgency').default('Medium'),
  authorUid: text('author_uid'),
  authorName: text('author_name'),
  authorRole: text('author_role').default('Intercessor'),
  authorCountry: text('author_country').default('Global'),
  prayerCount: integer('prayer_count').default(1),
  prayingUserIds: jsonb('praying_user_ids'),
  commentsJson: jsonb('comments_json'),
  isAnswered: boolean('is_answered').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Mission Reports table in Cloud SQL
export const missionReports = pgTable('mission_reports', {
  id: text('id').primaryKey(),
  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role'),
  authorCountry: text('author_country'),
  country: text('country').notNull(),
  countryCode: text('country_code'),
  title: text('title').notNull(),
  content: text('content').notNull(),
  peopleReached: integer('people_reached').default(0),
  salvationsCount: integer('salvations_count').default(0),
  bapCount: integer('bap_count').default(0),
  securityLevel: text('security_level').default('Low'),
  tagsJson: jsonb('tags_json'),
  likesCount: integer('likes_count').default(0),
  likedUserIds: jsonb('liked_user_ids'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Event Meetings table in Cloud SQL
export const eventMeetings = pgTable('event_meetings', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  hostId: text('host_id').notNull(),
  hostName: text('host_name').notNull(),
  hostRole: text('host_role'),
  targetCountry: text('target_country'),
  category: text('category').default('Global Prayer'),
  scheduledAt: text('scheduled_at').notNull(),
  durationMinutes: integer('duration_minutes').default(60),
  zoomUrl: text('zoom_url'),
  status: text('status').default('upcoming'),
  rsvps: jsonb('rsvps'),
  maxParticipants: integer('max_participants').default(500),
  isLive: boolean('is_live').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Chat Messages table in Cloud SQL
export const chatMessages = pgTable('chat_messages', {
  id: text('id').primaryKey(),
  roomId: text('room_id').notNull(),
  senderId: text('sender_id').notNull(),
  senderName: text('sender_name').notNull(),
  senderRole: text('sender_role'),
  senderCountry: text('sender_country'),
  senderAvatar: text('sender_avatar'),
  content: text('content').notNull(),
  audioUrl: text('audio_url'),
  audioDuration: integer('audio_duration'),
  reactions: jsonb('reactions'),
  timestamp: text('timestamp').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Site Settings & Branding
export const siteSettings = pgTable('site_settings', {
  id: text('id').primaryKey().default('global_settings'),
  settingsJson: jsonb('settings_json').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
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
