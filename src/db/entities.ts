import { db } from './index.ts';
import {
  prayerRequests,
  missionReports,
  eventMeetings,
  chatMessages,
  siteSettings,
  auditLogs
} from './schema.ts';
import { desc, eq } from 'drizzle-orm';

// --- PRAYER REQUESTS ---
export async function getAllPrayersFromDb() {
  try {
    return await db.select().from(prayerRequests).orderBy(desc(prayerRequests.createdAt));
  } catch (e) {
    console.error('Failed to get prayers from Cloud SQL:', e);
    return [];
  }
}

export async function createPrayerInDb(prayer: {
  id?: string;
  customId?: string;
  title: string;
  description: string;
  targetCountry?: string;
  category?: string;
  urgency?: string;
  authorId: string;
  authorName: string;
  authorRole?: string;
  authorCountry?: string;
  prayerCount?: number;
  prayingUserIds?: string[];
  commentsJson?: any[];
}) {
  try {
    const result = await db
      .insert(prayerRequests)
      .values({
        customId: prayer.customId || prayer.id || `pr-${Date.now()}`,
        title: prayer.title,
        description: prayer.description,
        targetCountry: prayer.targetCountry || 'Global',
        category: prayer.category || 'Unreached People',
        urgency: prayer.urgency || 'Medium',
        authorUid: prayer.authorId,
        authorName: prayer.authorName,
        authorRole: prayer.authorRole || 'Intercessor',
        authorCountry: prayer.authorCountry || 'Global',
        prayerCount: prayer.prayerCount || 1,
        prayingUserIds: prayer.prayingUserIds || [prayer.authorId],
        commentsJson: prayer.commentsJson || [],
        isAnswered: false,
      })
      .returning();
    return result[0];
  } catch (e) {
    console.error('Failed to insert prayer in Cloud SQL:', e);
    throw e;
  }
}

export async function agreePrayerInDb(prayerCustomId: string, userId: string) {
  try {
    const existing = await db
      .select()
      .from(prayerRequests)
      .where(eq(prayerRequests.customId, prayerCustomId));

    if (existing.length > 0) {
      const p = existing[0];
      const currentPrayers = Array.isArray(p.prayingUserIds) ? (p.prayingUserIds as string[]) : [];
      if (!currentPrayers.includes(userId)) {
        currentPrayers.push(userId);
      }
      const updated = await db
        .update(prayerRequests)
        .set({
          prayerCount: (p.prayerCount || 0) + 1,
          prayingUserIds: currentPrayers,
        })
        .where(eq(prayerRequests.id, p.id))
        .returning();
      return updated[0];
    }
    return null;
  } catch (e) {
    console.error('Failed to agree prayer in Cloud SQL:', e);
    throw e;
  }
}

export async function addCommentToPrayerInDb(prayerCustomId: string, comment: any) {
  try {
    const existing = await db
      .select()
      .from(prayerRequests)
      .where(eq(prayerRequests.customId, prayerCustomId));

    if (existing.length > 0) {
      const p = existing[0];
      const currentComments = Array.isArray(p.commentsJson) ? (p.commentsJson as any[]) : [];
      currentComments.push(comment);

      const updated = await db
        .update(prayerRequests)
        .set({
          commentsJson: currentComments,
        })
        .where(eq(prayerRequests.id, p.id))
        .returning();
      return updated[0];
    }
    return null;
  } catch (e) {
    console.error('Failed to add comment to prayer in Cloud SQL:', e);
    throw e;
  }
}

export async function deletePrayerFromDb(prayerCustomId: string) {
  try {
    const deleted = await db
      .delete(prayerRequests)
      .where(eq(prayerRequests.customId, prayerCustomId))
      .returning();
    return deleted[0] || null;
  } catch (e) {
    console.error('Failed to delete prayer in Cloud SQL:', e);
    throw e;
  }
}

// --- MISSION REPORTS ---
export async function getAllReportsFromDb() {
  try {
    return await db.select().from(missionReports).orderBy(desc(missionReports.createdAt));
  } catch (e) {
    console.error('Failed to get reports from Cloud SQL:', e);
    return [];
  }
}

export async function createReportInDb(report: {
  id?: string;
  authorId: string;
  authorName: string;
  authorRole?: string;
  authorCountry?: string;
  country: string;
  countryCode?: string;
  title: string;
  content: string;
  peopleReached?: number;
  salvationsCount?: number;
  bapCount?: number;
  securityLevel?: string;
  tags?: string[];
  likesCount?: number;
  likedUserIds?: string[];
}) {
  try {
    const result = await db
      .insert(missionReports)
      .values({
        id: report.id || `rep-${Date.now()}`,
        authorId: report.authorId,
        authorName: report.authorName,
        authorRole: report.authorRole || 'Missionary',
        authorCountry: report.authorCountry || 'Global',
        country: report.country,
        countryCode: report.countryCode || '',
        title: report.title,
        content: report.content,
        peopleReached: report.peopleReached || 0,
        salvationsCount: report.salvationsCount || 0,
        bapCount: report.bapCount || 0,
        securityLevel: report.securityLevel || 'Low',
        tagsJson: report.tags || [],
        likesCount: report.likesCount || 0,
        likedUserIds: report.likedUserIds || [],
      })
      .returning();
    return result[0];
  } catch (e) {
    console.error('Failed to create report in Cloud SQL:', e);
    throw e;
  }
}

export async function likeReportInDb(reportId: string, userId: string) {
  try {
    const existing = await db
      .select()
      .from(missionReports)
      .where(eq(missionReports.id, reportId));

    if (existing.length > 0) {
      const rep = existing[0];
      const likes = Array.isArray(rep.likedUserIds) ? (rep.likedUserIds as string[]) : [];
      let nextLikesCount = rep.likesCount || 0;
      if (!likes.includes(userId)) {
        likes.push(userId);
        nextLikesCount += 1;
      }
      const updated = await db
        .update(missionReports)
        .set({
          likesCount: nextLikesCount,
          likedUserIds: likes,
        })
        .where(eq(missionReports.id, reportId))
        .returning();
      return updated[0];
    }
    return null;
  } catch (e) {
    console.error('Failed to like report in Cloud SQL:', e);
    throw e;
  }
}

export async function deleteReportFromDb(reportId: string) {
  try {
    const deleted = await db
      .delete(missionReports)
      .where(eq(missionReports.id, reportId))
      .returning();
    return deleted[0] || null;
  } catch (e) {
    console.error('Failed to delete report in Cloud SQL:', e);
    throw e;
  }
}

// --- EVENT MEETINGS ---
export async function getAllEventsFromDb() {
  try {
    return await db.select().from(eventMeetings).orderBy(desc(eventMeetings.createdAt));
  } catch (e) {
    console.error('Failed to get events from Cloud SQL:', e);
    return [];
  }
}

export async function createEventInDb(event: {
  id?: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  hostRole?: string;
  targetCountry?: string;
  category?: string;
  scheduledAt: string;
  durationMinutes?: number;
  zoomUrl?: string;
  status?: string;
  rsvps?: string[];
  maxParticipants?: number;
  isLive?: boolean;
}) {
  try {
    const result = await db
      .insert(eventMeetings)
      .values({
        id: event.id || `evt-${Date.now()}`,
        title: event.title,
        description: event.description,
        hostId: event.hostId,
        hostName: event.hostName,
        hostRole: event.hostRole || 'Host',
        targetCountry: event.targetCountry || 'Global',
        category: event.category || 'Global Prayer',
        scheduledAt: event.scheduledAt,
        durationMinutes: event.durationMinutes || 60,
        zoomUrl: event.zoomUrl || '',
        status: event.status || 'upcoming',
        rsvps: event.rsvps || [event.hostId],
        maxParticipants: event.maxParticipants || 500,
        isLive: event.isLive || false,
      })
      .returning();
    return result[0];
  } catch (e) {
    console.error('Failed to create event in Cloud SQL:', e);
    throw e;
  }
}

export async function rsvpEventInDb(eventId: string, userId: string) {
  try {
    const existing = await db
      .select()
      .from(eventMeetings)
      .where(eq(eventMeetings.id, eventId));

    if (existing.length > 0) {
      const evt = existing[0];
      const rsvps = Array.isArray(evt.rsvps) ? (evt.rsvps as string[]) : [];
      if (!rsvps.includes(userId)) {
        rsvps.push(userId);
      }
      const updated = await db
        .update(eventMeetings)
        .set({ rsvps })
        .where(eq(eventMeetings.id, eventId))
        .returning();
      return updated[0];
    }
    return null;
  } catch (e) {
    console.error('Failed to RSVP event in Cloud SQL:', e);
    throw e;
  }
}

export async function deleteEventFromDb(eventId: string) {
  try {
    const deleted = await db
      .delete(eventMeetings)
      .where(eq(eventMeetings.id, eventId))
      .returning();
    return deleted[0] || null;
  } catch (e) {
    console.error('Failed to delete event in Cloud SQL:', e);
    throw e;
  }
}

// --- CHAT MESSAGES ---
export async function getChatMessagesFromDb(roomId?: string) {
  try {
    if (roomId) {
      return await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.roomId, roomId))
        .orderBy(desc(chatMessages.createdAt))
        .limit(200);
    }
    return await db.select().from(chatMessages).orderBy(desc(chatMessages.createdAt)).limit(300);
  } catch (e) {
    console.error('Failed to get chat messages from Cloud SQL:', e);
    return [];
  }
}

export async function createChatMessageInDb(msg: {
  id?: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderRole?: string;
  senderCountry?: string;
  senderAvatar?: string;
  content: string;
  audioUrl?: string;
  audioDuration?: number;
  reactions?: any;
  timestamp: string;
}) {
  try {
    const result = await db
      .insert(chatMessages)
      .values({
        id: msg.id || `msg-${Date.now()}`,
        roomId: msg.roomId,
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderRole: msg.senderRole || 'Intercessor',
        senderCountry: msg.senderCountry || 'Global',
        senderAvatar: msg.senderAvatar || '',
        content: msg.content,
        audioUrl: msg.audioUrl || null,
        audioDuration: msg.audioDuration || null,
        reactions: msg.reactions || {},
        timestamp: msg.timestamp || new Date().toISOString(),
      })
      .returning();
    return result[0];
  } catch (e) {
    console.error('Failed to save chat message in Cloud SQL:', e);
    throw e;
  }
}

// --- SITE SETTINGS ---
export async function getSiteSettingsFromDb() {
  try {
    const records = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, 'global_settings'));
    if (records.length > 0) {
      return records[0].settingsJson;
    }
    return null;
  } catch (e) {
    console.error('Failed to get settings from Cloud SQL:', e);
    return null;
  }
}

export async function saveSiteSettingsToDb(settingsObj: any) {
  try {
    const result = await db
      .insert(siteSettings)
      .values({
        id: 'global_settings',
        settingsJson: settingsObj,
      })
      .onConflictDoUpdate({
        target: siteSettings.id,
        set: {
          settingsJson: settingsObj,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  } catch (e) {
    console.error('Failed to save settings in Cloud SQL:', e);
    throw e;
  }
}
