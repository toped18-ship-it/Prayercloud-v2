import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User, PrayerRequest, MissionReport, EventMeeting, ChatMessage, SiteBrandingSettings } from '../types';

export const firestoreService = {
  // ==========================================
  // USERS
  // ==========================================
  async syncUserToFirestore(user: User): Promise<void> {
    try {
      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        country: user.country || 'Global',
        role: user.role || 'Prayer Warrior',
        avatarUrl: user.avatarUrl || '',
        bio: user.bio || '',
        isVerified: user.isVerified ?? true,
        isActive: user.isActive ?? true,
        joinedAt: user.joinedAt || new Date().toISOString(),
        prayersOfferedCount: user.prayersOfferedCount || 0,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore syncUser error:', e);
    }
  },

  async getUsersFromFirestore(): Promise<User[]> {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const list: User[] = [];
      snap.forEach((d) => {
        const data = d.data() as User;
        list.push({ ...data, id: d.id });
      });
      return list;
    } catch (e) {
      console.warn('Firestore getUsers error:', e);
      return [];
    }
  },

  async deleteUserFromFirestore(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (e) {
      console.warn('Firestore deleteUser error:', e);
    }
  },

  // ==========================================
  // PRAYERS
  // ==========================================
  async savePrayerToFirestore(prayer: PrayerRequest): Promise<void> {
    try {
      const prayerRef = doc(db, 'prayers', prayer.id);
      await setDoc(prayerRef, {
        ...prayer,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore savePrayer error:', e);
    }
  },

  async getPrayersFromFirestore(): Promise<PrayerRequest[]> {
    try {
      const q = query(collection(db, 'prayers'), orderBy('createdAt', 'desc'), limit(100));
      const snap = await getDocs(q);
      const list: PrayerRequest[] = [];
      snap.forEach((d) => {
        list.push(d.data() as PrayerRequest);
      });
      return list;
    } catch (e) {
      console.warn('Firestore getPrayers error:', e);
      return [];
    }
  },

  async deletePrayerFromFirestore(prayerId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'prayers', prayerId));
    } catch (e) {
      console.warn('Firestore deletePrayer error:', e);
    }
  },

  // ==========================================
  // MISSION REPORTS
  // ==========================================
  async saveReportToFirestore(report: MissionReport): Promise<void> {
    try {
      const reportRef = doc(db, 'reports', report.id);
      await setDoc(reportRef, {
        ...report,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore saveReport error:', e);
    }
  },

  async getReportsFromFirestore(): Promise<MissionReport[]> {
    try {
      const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'), limit(100));
      const snap = await getDocs(q);
      const list: MissionReport[] = [];
      snap.forEach((d) => {
        list.push(d.data() as MissionReport);
      });
      return list;
    } catch (e) {
      console.warn('Firestore getReports error:', e);
      return [];
    }
  },

  async deleteReportFromFirestore(reportId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'reports', reportId));
    } catch (e) {
      console.warn('Firestore deleteReport error:', e);
    }
  },

  // ==========================================
  // EVENTS
  // ==========================================
  async saveEventToFirestore(event: EventMeeting): Promise<void> {
    try {
      const eventRef = doc(db, 'events', event.id);
      await setDoc(eventRef, {
        ...event,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore saveEvent error:', e);
    }
  },

  async getEventsFromFirestore(): Promise<EventMeeting[]> {
    try {
      const q = query(collection(db, 'events'), orderBy('startTime', 'desc'), limit(50));
      const snap = await getDocs(q);
      const list: EventMeeting[] = [];
      snap.forEach((d) => {
        list.push(d.data() as EventMeeting);
      });
      return list;
    } catch (e) {
      console.warn('Firestore getEvents error:', e);
      return [];
    }
  },

  async deleteEventFromFirestore(eventId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'events', eventId));
    } catch (e) {
      console.warn('Firestore deleteEvent error:', e);
    }
  },

  // ==========================================
  // CHAT MESSAGES
  // ==========================================
  async saveChatMessageToFirestore(msg: ChatMessage): Promise<void> {
    try {
      const msgRef = doc(db, 'chat_messages', msg.id);
      await setDoc(msgRef, {
        ...msg,
        storedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore saveChatMessage error:', e);
    }
  },

  // ==========================================
  // SITE SETTINGS
  // ==========================================
  async saveSettingsToFirestore(settings: SiteBrandingSettings): Promise<void> {
    try {
      const settingsRef = doc(db, 'settings', 'global_settings');
      await setDoc(settingsRef, {
        ...settings,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore saveSettings error:', e);
    }
  },

  async getSettingsFromFirestore(): Promise<SiteBrandingSettings | null> {
    try {
      const snap = await getDoc(doc(db, 'settings', 'global_settings'));
      if (snap.exists()) {
        return snap.data() as SiteBrandingSettings;
      }
      return null;
    } catch (e) {
      console.warn('Firestore getSettings error:', e);
      return null;
    }
  }
};
