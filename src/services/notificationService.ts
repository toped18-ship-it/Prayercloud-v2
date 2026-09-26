import { storage } from './storageService';
import { EventMeeting, PrayerRequest } from '../types';

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'prayer' | 'conference' | 'general';
  targetUrl?: string;
  actionLabel?: string;
  createdAt: string;
  read: boolean;
  metadata?: {
    prayerId?: string;
    meetingId?: string;
    targetCountry?: string;
  };
}

const STORAGE_KEY_NOTIFICATIONS = 'prayercloud_system_notifications_v1';
const STORAGE_KEY_SEEN_PRAYERS = 'prayercloud_notified_prayer_ids';
const STORAGE_KEY_NOTIFIED_EVENTS = 'prayercloud_notified_event_ids';

class NotificationService {
  private listeners: Array<(notifications: SystemNotification[]) => void> = [];
  private checkInterval: NodeJS.Timeout | null = null;
  private hasRequestedBrowserPermission = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Auto-start background scheduler to scan for upcoming conferences
      this.startScheduler();
    }
  }

  // Request browser Native Notification permission if supported
  public async requestBrowserPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    try {
      if (Notification.permission === 'granted') {
        return true;
      }
      if (Notification.permission !== 'denied') {
        const result = await Notification.requestPermission();
        this.hasRequestedBrowserPermission = true;
        return result === 'granted';
      }
    } catch (e) {
      console.warn('Native notification permission error:', e);
    }
    return false;
  }

  // Trigger both in-app notification and native OS notification
  public triggerNotification(payload: {
    title: string;
    message: string;
    type: 'prayer' | 'conference' | 'general';
    targetUrl?: string;
    actionLabel?: string;
    metadata?: SystemNotification['metadata'];
  }): SystemNotification {
    const list = this.getNotifications();
    const notification: SystemNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      targetUrl: payload.targetUrl,
      actionLabel: payload.actionLabel,
      createdAt: new Date().toISOString(),
      read: false,
      metadata: payload.metadata
    };

    list.unshift(notification);
    // Keep max 40 notifications
    if (list.length > 40) {
      list.length = 40;
    }
    this.saveNotifications(list);

    // Also trigger sound and visual toast
    this.playNotificationSound(payload.type);

    // Native Browser Notification (if granted)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const nativeNotif = new Notification(payload.title, {
          body: payload.message,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: notification.id
        });

        if (payload.targetUrl) {
          nativeNotif.onclick = () => {
            window.focus();
            window.location.hash = payload.targetUrl!;
            nativeNotif.close();
          };
        }
      } catch (err) {
        console.warn('Browser native notification dispatch notice:', err);
      }
    }

    // Broadcast toast event for instant UI banner
    window.dispatchEvent(
      new CustomEvent('prayercloud_toast_notification', {
        detail: notification
      })
    );

    return notification;
  }

  // Explicit handler when a new prayer request is added
  public onNewPrayerRequestAdded(prayer: PrayerRequest): void {
    const notifiedPrayers = this.getSet(STORAGE_KEY_SEEN_PRAYERS);
    if (notifiedPrayers.has(prayer.id)) {
      return;
    }
    notifiedPrayers.add(prayer.id);
    this.saveSet(STORAGE_KEY_SEEN_PRAYERS, notifiedPrayers);

    const countrySuffix = prayer.targetCountry ? ` · ${prayer.targetCountry}` : '';
    this.triggerNotification({
      title: `🙏 New Prayer Request Posted${countrySuffix}`,
      message: `"${prayer.title}" posted by ${prayer.authorName}. Click to join intercession.`,
      type: 'prayer',
      targetUrl: 'prayers',
      actionLabel: 'Pray Now',
      metadata: {
        prayerId: prayer.id,
        targetCountry: prayer.targetCountry
      }
    });
  }

  // Explicit check for upcoming live conferences (e.g. starting within 15 minutes or currently live)
  public checkUpcomingConferences(): void {
    try {
      const events = storage.getEvents();
      const notifiedEvents = this.getSet(STORAGE_KEY_NOTIFIED_EVENTS);
      const now = Date.now();

      events.forEach((evt) => {
        const startTime = new Date(evt.startTime).getTime();
        const diffMinutes = (startTime - now) / (1000 * 60);

        // Conference is starting within 15 minutes, or is flagged liveNow
        const isImminent = (diffMinutes >= 0 && diffMinutes <= 15) || evt.isLiveNow;

        if (isImminent) {
          const eventKey = `${evt.id}-${evt.isLiveNow ? 'live' : 'soon'}`;
          if (!notifiedEvents.has(eventKey)) {
            notifiedEvents.add(eventKey);
            this.saveSet(STORAGE_KEY_NOTIFIED_EVENTS, notifiedEvents);

            const isNow = evt.isLiveNow || diffMinutes <= 2;
            this.triggerNotification({
              title: isNow ? `🔴 LIVE CONFERENCE IN SESSION` : `⏰ LIVE CONFERENCE ABOUT TO BEGIN`,
              message: isNow
                ? `"${evt.title}" hosted by ${evt.hostName} is currently LIVE. Join now!`
                : `"${evt.title}" is starting in ~${Math.round(diffMinutes)} minutes. Enter the room.`,
              type: 'conference',
              targetUrl: 'conferences',
              actionLabel: 'Join Conference',
              metadata: {
                meetingId: evt.id,
                targetCountry: evt.targetCountry
              }
            });
          }
        }
      });
    } catch (e) {
      console.warn('Upcoming conference check notice:', e);
    }
  }

  public getNotifications(): SystemNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return [];
  }

  public getUnreadCount(): number {
    return this.getNotifications().filter(n => !n.read).length;
  }

  public markAsRead(id: string): void {
    const list = this.getNotifications();
    const item = list.find(n => n.id === id);
    if (item && !item.read) {
      item.read = true;
      this.saveNotifications(list);
    }
  }

  public markAllAsRead(): void {
    const list = this.getNotifications();
    let changed = false;
    list.forEach(n => {
      if (!n.read) {
        n.read = true;
        changed = true;
      }
    });
    if (changed) {
      this.saveNotifications(list);
    }
  }

  public clearAll(): void {
    this.saveNotifications([]);
  }

  public subscribe(callback: (notifications: SystemNotification[]) => void): () => void {
    this.listeners.push(callback);
    callback(this.getNotifications());
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private saveNotifications(list: SystemNotification[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(list));
      this.listeners.forEach(cb => cb(list));
      window.dispatchEvent(new CustomEvent('prayercloud_notifications_update', { detail: list }));
    } catch {}
  }

  private startScheduler(): void {
    if (this.checkInterval) return;

    // Run initial scan
    setTimeout(() => {
      this.checkUpcomingConferences();
    }, 2000);

    // Periodic scan every 30 seconds
    this.checkInterval = setInterval(() => {
      this.checkUpcomingConferences();
    }, 30000);

    // Listen to storage update events for newly posted prayer requests or events
    window.addEventListener('prayercloud_storage_update', (e: any) => {
      const key = e?.detail?.key;
      if (key === 'prayercloud_events_v2') {
        this.checkUpcomingConferences();
      }
    });
  }

  private playNotificationSound(type: 'prayer' | 'conference' | 'general'): void {
    try {
      // Use clean Web Audio API tone synthesis (no external MP3 asset dependency)
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type === 'conference' ? 'sine' : 'triangle';
      
      const now = ctx.currentTime;
      if (type === 'conference') {
        // Melodic two-tone alert
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880.00, now + 0.12); // A5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      } else {
        // Gentle chime for prayer
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // Silently fail if browser restricts audio
    }
  }

  private getSet(storageKey: string): Set<string> {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        return new Set(JSON.parse(raw));
      }
    } catch {}
    return new Set<string>();
  }

  private saveSet(storageKey: string, set: Set<string>): void {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(set)));
    } catch {}
  }
}

export const notificationService = new NotificationService();
