import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  User,
  Country,
  UnreachedPlace,
  PrayerRequest,
  PrayerComment,
  MissionReport,
  EventMeeting,
  ChatMessage,
  MeetingRecording,
  MissionaryResource,
  SiteBrandingSettings,
  UserRole
} from '../types';
import { ALL_COUNTRIES } from '../data/countriesData';
import { UNREACHED_PLACES_DATA } from '../data/unreachedPlacesData';
import {
  INITIAL_USERS,
  INITIAL_PRAYER_REQUESTS,
  INITIAL_MISSION_REPORTS,
  INITIAL_EVENTS,
  INITIAL_RECORDINGS,
  INITIAL_RESOURCES,
  DEFAULT_BRANDING_SETTINGS
} from '../data/seedData';
import { storage, DEFAULT_ADMIN_USER } from './storageService';

// Initialize Firebase App
const rtdbUrl = (firebaseConfig as any).databaseURL || 'https://prayercloud-e341d-default-rtdb.firebaseio.com';
export const app = !getApps().length
  ? initializeApp({
      ...firebaseConfig,
      databaseURL: rtdbUrl
    })
  : getApp();

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const rtdb = getDatabase(app, rtdbUrl);

// Target Firestore Database instance configured in firebase-applet-config.json
export const firestoreDatabaseId =
  (firebaseConfig as any).firestoreDatabaseId || 'ai-studio-prayercloudgloba-13fbd439-8f48-4e20-88cf-2b0f802da752';

export const db = getFirestore(app, firestoreDatabaseId);

// ==========================================
// FIRESTORE CLOUD DATABASE SERVICE
// ==========================================
export const firebaseService = {
  db,
  auth,
  app,

  // --- USERS & AUTHENTICATION ---
  async getUsers(): Promise<User[]> {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const list: User[] = [];
      snap.forEach((d) => {
        const u = d.data() as User;
        list.push({ ...u, id: d.id });
      });

      if (list.length > 0) {
        // Ensure default admin user is present
        if (!list.some(u => u.id === 'usr-admin-1' || u.email.toLowerCase() === 'admin@prayercloud.org')) {
          list.unshift(DEFAULT_ADMIN_USER);
        }
        return list;
      }
    } catch (e) {
      console.warn('Firestore getUsers fallback to local cache:', e);
    }
    return storage.getUsers();
  },

  async syncUser(user: User, password?: string): Promise<void> {
    storage.updateUser(user);
    if (password) {
      storage.setUserPassword(user.id, password);
    }
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

      if (password) {
        const credRef = doc(db, 'credentials', user.id);
        await setDoc(credRef, {
          userId: user.id,
          email: user.email.toLowerCase(),
          username: user.username.toLowerCase(),
          password: password,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore syncUser notice:', e);
    }
  },

  async deleteUser(userId: string): Promise<void> {
    storage.deleteUser(userId);
    try {
      await deleteDoc(doc(db, 'users', userId));
      await deleteDoc(doc(db, 'credentials', userId));
    } catch (e) {
      console.warn('Firestore deleteUser notice:', e);
    }
  },

  subscribeToUsers(callback: (users: User[]) => void): Unsubscribe {
    try {
      return onSnapshot(collection(db, 'users'), (snap) => {
        const list: User[] = [];
        snap.forEach((d) => {
          list.push({ ...(d.data() as User), id: d.id });
        });
        if (list.length > 0) {
          if (!list.some(u => u.id === 'usr-admin-1')) {
            list.unshift(DEFAULT_ADMIN_USER);
          }
          callback(list);
        }
      }, (err) => {
        console.warn('Firestore users snapshot listener error:', err);
      });
    } catch {
      return () => {};
    }
  },

  // --- PRAYER REQUESTS ---
  async getPrayers(): Promise<PrayerRequest[]> {
    try {
      const q = query(collection(db, 'prayers'), orderBy('createdAt', 'desc'), limit(100));
      const snap = await getDocs(q);
      const list: PrayerRequest[] = [];
      snap.forEach((d) => {
        list.push({ ...(d.data() as PrayerRequest), id: d.id });
      });
      if (list.length > 0) {
        return list;
      }
    } catch (e) {
      console.warn('Firestore getPrayers fallback to local cache:', e);
    }
    return storage.getPrayerRequests();
  },

  async addPrayer(prayer: PrayerRequest): Promise<void> {
    storage.addPrayerRequest(prayer);
    try {
      const prayerRef = doc(db, 'prayers', prayer.id);
      await setDoc(prayerRef, {
        ...prayer,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore addPrayer notice:', e);
    }
  },

  async recordPrayerOffered(prayerId: string, userId: string): Promise<void> {
    storage.recordPrayerOffered(prayerId, userId);
    try {
      const prayerRef = doc(db, 'prayers', prayerId);
      const snap = await getDoc(prayerRef);
      if (snap.exists()) {
        const data = snap.data() as PrayerRequest;
        const currentPrayers = Array.isArray(data.prayingUserIds) ? [...data.prayingUserIds] : [];
        if (!currentPrayers.includes(userId)) {
          currentPrayers.push(userId);
        }
        await setDoc(prayerRef, {
          prayedCount: (data.prayedCount || 0) + 1,
          prayingUserIds: currentPrayers,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore recordPrayerOffered notice:', e);
    }
  },

  async addPrayerComment(prayerId: string, comment: { authorId: string; authorName: string; authorRole: UserRole; text: string }): Promise<void> {
    storage.addPrayerComment(prayerId, comment);
    try {
      const prayerRef = doc(db, 'prayers', prayerId);
      const snap = await getDoc(prayerRef);
      if (snap.exists()) {
        const data = snap.data() as PrayerRequest;
        const comments = Array.isArray(data.comments) ? [...data.comments] : [];
        comments.push({
          id: `c-${Date.now()}`,
          authorId: comment.authorId,
          authorName: comment.authorName,
          authorRole: comment.authorRole,
          text: comment.text,
          createdAt: new Date().toISOString()
        });
        await setDoc(prayerRef, {
          comments,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore addPrayerComment notice:', e);
    }
  },

  async deletePrayer(prayerId: string): Promise<void> {
    storage.deletePrayerRequest(prayerId);
    try {
      await deleteDoc(doc(db, 'prayers', prayerId));
    } catch (e) {
      console.warn('Firestore deletePrayer notice:', e);
    }
  },

  subscribeToPrayers(callback: (prayers: PrayerRequest[]) => void): Unsubscribe {
    try {
      const q = query(collection(db, 'prayers'), orderBy('createdAt', 'desc'), limit(100));
      return onSnapshot(q, (snap) => {
        const list: PrayerRequest[] = [];
        snap.forEach((d) => {
          list.push({ ...(d.data() as PrayerRequest), id: d.id });
        });
        if (list.length > 0) {
          callback(list);
        }
      }, (err) => {
        console.warn('Firestore prayers snapshot listener error:', err);
      });
    } catch {
      return () => {};
    }
  },

  // --- MISSION REPORTS ---
  async getReports(): Promise<MissionReport[]> {
    try {
      const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'), limit(100));
      const snap = await getDocs(q);
      const list: MissionReport[] = [];
      snap.forEach((d) => {
        list.push({ ...(d.data() as MissionReport), id: d.id });
      });
      if (list.length > 0) {
        return list;
      }
    } catch (e) {
      console.warn('Firestore getReports fallback:', e);
    }
    return storage.getMissionReports();
  },

  async addReport(report: MissionReport): Promise<void> {
    storage.addMissionReport(report);
    try {
      const reportRef = doc(db, 'reports', report.id);
      await setDoc(reportRef, {
        ...report,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore addReport notice:', e);
    }
  },

  async toggleLikeReport(reportId: string, userId: string): Promise<void> {
    storage.toggleLikeReport(reportId, userId);
    try {
      const reportRef = doc(db, 'reports', reportId);
      const snap = await getDoc(reportRef);
      if (snap.exists()) {
        const rep = snap.data() as MissionReport;
        const likedUserIds = Array.isArray(rep.likedUserIds) ? [...rep.likedUserIds] : [];
        let likesCount = rep.likesCount || 0;
        const idx = likedUserIds.indexOf(userId);
        if (idx >= 0) {
          likedUserIds.splice(idx, 1);
          likesCount = Math.max(0, likesCount - 1);
        } else {
          likedUserIds.push(userId);
          likesCount += 1;
        }
        await setDoc(reportRef, {
          likesCount,
          likedUserIds,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore toggleLikeReport notice:', e);
    }
  },

  async deleteReport(reportId: string): Promise<void> {
    storage.deleteMissionReport(reportId);
    try {
      await deleteDoc(doc(db, 'reports', reportId));
    } catch (e) {
      console.warn('Firestore deleteReport notice:', e);
    }
  },

  // --- EVENTS & SUMMITS ---
  async getEvents(): Promise<EventMeeting[]> {
    try {
      const q = query(collection(db, 'events'), orderBy('startTime', 'desc'), limit(50));
      const snap = await getDocs(q);
      const list: EventMeeting[] = [];
      snap.forEach((d) => {
        list.push({ ...(d.data() as EventMeeting), id: d.id });
      });
      if (list.length > 0) {
        return list;
      }
    } catch (e) {
      console.warn('Firestore getEvents fallback:', e);
    }
    return storage.getEvents();
  },

  async addEvent(event: EventMeeting): Promise<void> {
    storage.addEvent(event);
    try {
      const eventRef = doc(db, 'events', event.id);
      await setDoc(eventRef, {
        ...event,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore addEvent notice:', e);
    }
  },

  async toggleEventRSVP(eventId: string, userId: string): Promise<void> {
    storage.toggleEventRSVP(eventId, userId);
    try {
      const eventRef = doc(db, 'events', eventId);
      const snap = await getDoc(eventRef);
      if (snap.exists()) {
        const evt = snap.data() as EventMeeting;
        const rsvps = Array.isArray(evt.rsvps) ? [...evt.rsvps] : [];
        const idx = rsvps.indexOf(userId);
        if (idx >= 0) {
          rsvps.splice(idx, 1);
        } else {
          rsvps.push(userId);
        }
        await setDoc(eventRef, {
          rsvps,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore toggleEventRSVP notice:', e);
    }
  },

  async deleteEvent(eventId: string): Promise<void> {
    storage.deleteEvent(eventId);
    try {
      await deleteDoc(doc(db, 'events', eventId));
    } catch (e) {
      console.warn('Firestore deleteEvent notice:', e);
    }
  },

  // --- CHAT MESSAGES ---
  async sendMessage(msg: ChatMessage): Promise<void> {
    storage.sendMessage(msg);
    try {
      const msgRef = doc(db, 'chat_messages', msg.id);
      await setDoc(msgRef, {
        ...msg,
        storedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore sendMessage notice:', e);
    }
  },

  // --- SETTINGS & BRANDING ---
  async getBrandingSettings(): Promise<SiteBrandingSettings> {
    try {
      const snap = await getDoc(doc(db, 'settings', 'global_settings'));
      if (snap.exists()) {
        return { ...DEFAULT_BRANDING_SETTINGS, ...(snap.data() as SiteBrandingSettings) };
      }
    } catch (e) {
      console.warn('Firestore getBrandingSettings fallback:', e);
    }
    return storage.getBrandingSettings();
  },

  async updateBrandingSettings(settings: SiteBrandingSettings): Promise<void> {
    storage.updateBrandingSettings(settings);
    try {
      const settingsRef = doc(db, 'settings', 'global_settings');
      await setDoc(settingsRef, {
        ...settings,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore updateBrandingSettings notice:', e);
    }
  },

  // --- STATIC / DIRECTORY HELPERS ---
  getCountries(): Country[] {
    return storage.getCountries();
  },

  getCountryByCode(code: string): Country | undefined {
    return storage.getCountryByCode(code);
  },

  getUnreachedPlaces(): UnreachedPlace[] {
    return storage.getUnreachedPlaces();
  },

  getUnreachedPlacesByCountry(countryCode: string): UnreachedPlace[] {
    return storage.getUnreachedPlacesByCountry(countryCode);
  },

  getResources(): MissionaryResource[] {
    return storage.getResources();
  },

  getRecordings(): MeetingRecording[] {
    return storage.getRecordings();
  }
};
