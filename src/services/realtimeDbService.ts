import {
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  off,
  serverTimestamp
} from 'firebase/database';
import { rtdb } from '../lib/firebase';
import { User, AuditLog, PrayerRequest, ChatMessage, EventMeeting } from '../types';

export interface RTDBSyncRecord {
  id?: string;
  lastSyncAt: string;
  autoSyncEnabled: boolean;
  syncInterval: string;
  totalCountriesCount: number;
  totalUpgsCount: number;
  updatedAt: string;
}

export const realtimeDbService = {
  // Sync Status
  async getLatestSyncStatus(): Promise<RTDBSyncRecord | null> {
    try {
      const syncRef = ref(rtdb, 'sync/latest');
      const snapshot = await get(syncRef);
      if (snapshot.exists()) {
        return snapshot.val() as RTDBSyncRecord;
      }
      // Return default baseline
      const defaultRecord: RTDBSyncRecord = {
        lastSyncAt: new Date().toISOString(),
        autoSyncEnabled: true,
        syncInterval: '1h',
        totalCountriesCount: 195,
        totalUpgsCount: 7420,
        updatedAt: new Date().toISOString()
      };
      await set(syncRef, defaultRecord);
      return defaultRecord;
    } catch (error) {
      console.warn('Firebase RTDB getLatestSyncStatus error, using local fallback:', error);
      return {
        lastSyncAt: new Date().toISOString(),
        autoSyncEnabled: true,
        syncInterval: '1h',
        totalCountriesCount: 195,
        totalUpgsCount: 7420,
        updatedAt: new Date().toISOString()
      };
    }
  },

  async recordSyncExecution(countriesCount = 195, upgsCount = 7420, interval = '1h'): Promise<RTDBSyncRecord> {
    const record: RTDBSyncRecord = {
      lastSyncAt: new Date().toISOString(),
      autoSyncEnabled: true,
      syncInterval: interval,
      totalCountriesCount: countriesCount,
      totalUpgsCount: upgsCount,
      updatedAt: new Date().toISOString()
    };

    try {
      // Set latest
      const syncRef = ref(rtdb, 'sync/latest');
      await set(syncRef, record);

      // Append to history
      const historyRef = push(ref(rtdb, 'sync/history'));
      await set(historyRef, {
        ...record,
        id: historyRef.key
      });

      return record;
    } catch (error) {
      console.warn('Firebase RTDB recordSyncExecution error:', error);
      return record;
    }
  },

  // Users Synchronization
  async getOrCreateUser(uid: string, email: string, fullName?: string): Promise<Partial<User>> {
    const userRef = ref(rtdb, `users/${uid}`);
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const existing = snapshot.val();
        if (fullName && existing.fullName !== fullName) {
          await update(userRef, { fullName, updatedAt: new Date().toISOString() });
          return { ...existing, fullName };
        }
        return existing;
      }

      const newUser: Partial<User> = {
        id: uid,
        email,
        fullName: fullName || email.split('@')[0],
        role: email.toLowerCase().includes('admin') ? 'Super Admin' : 'Prayer Warrior',
        isActive: true,
        isVerified: true,
        joinedAt: new Date().toISOString(),
        prayersOfferedCount: 0
      };

      await set(userRef, newUser);
      return newUser;
    } catch (error) {
      console.warn('Firebase RTDB getOrCreateUser error, returning local fallback:', error);
      return {
        id: uid,
        email,
        fullName: fullName || email.split('@')[0],
        role: 'Prayer Warrior'
      };
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const usersRef = ref(rtdb, 'users');
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.values(data) as User[];
      }
      return [];
    } catch (error) {
      console.warn('Firebase RTDB getAllUsers error:', error);
      return [];
    }
  },

  // Audit Logs
  async logAudit(action: string, details: string, userUid?: string, userName?: string): Promise<AuditLog> {
    const logItem: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      actorId: userUid || 'system',
      actorName: userName || 'Firebase Realtime Worker',
      action,
      target: 'Firebase RTDB',
      details
    };

    try {
      const logRef = ref(rtdb, `auditLogs/${logItem.id}`);
      await set(logRef, logItem);
    } catch (error) {
      console.warn('Firebase RTDB logAudit error:', error);
    }

    return logItem;
  },

  async getAuditLogs(limitCount = 50): Promise<AuditLog[]> {
    try {
      const logsRef = ref(rtdb, 'auditLogs');
      const snapshot = await get(logsRef);
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list = Object.values(val) as AuditLog[];
        return list.reverse().slice(0, limitCount);
      }
      return [];
    } catch (error) {
      console.warn('Firebase RTDB getAuditLogs error:', error);
      return [];
    }
  },

  // Live Realtime Chat Subscription
  listenToChatMessages(roomId: string, callback: (messages: ChatMessage[]) => void) {
    try {
      const messagesRef = ref(rtdb, `chats/${roomId}/messages`);
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const list = Object.values(val) as ChatMessage[];
          callback(list);
        } else {
          callback([]);
        }
      });
      return () => off(messagesRef);
    } catch (e) {
      console.warn('Realtime chat subscribe error:', e);
      return () => {};
    }
  },

  async sendChatMessage(roomId: string, message: ChatMessage) {
    try {
      const msgRef = push(ref(rtdb, `chats/${roomId}/messages`));
      await set(msgRef, {
        ...message,
        id: msgRef.key || message.id
      });
    } catch (e) {
      console.warn('Realtime send message error:', e);
    }
  },

  // Live Conference Room State
  listenToConferenceRoom(roomCode: string, callback: (roomData: any) => void) {
    try {
      const roomRef = ref(rtdb, `conferences/${roomCode}`);
      onValue(roomRef, (snapshot) => {
        if (snapshot.exists()) {
          callback(snapshot.val());
        }
      });
      return () => off(roomRef);
    } catch (e) {
      console.warn('Conference room subscribe error:', e);
      return () => {};
    }
  },

  async updateConferenceRoom(roomCode: string, data: any) {
    try {
      const roomRef = ref(rtdb, `conferences/${roomCode}`);
      await update(roomRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Conference room update error:', e);
    }
  }
};
