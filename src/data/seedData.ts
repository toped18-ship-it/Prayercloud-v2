import {
  User,
  PrayerRequest,
  MissionReport,
  EventMeeting,
  ChatRoom,
  ChatMessage,
  MeetingRecording,
  MissionaryResource,
  SiteBrandingSettings
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    fullName: 'Super Administrator',
    username: 'admin',
    email: 'admin@prayercloud.org',
    phoneNumber: '+1-800-PRAY-NOW',
    country: 'United Kingdom',
    role: 'Super Admin',
    avatarUrl: '',
    bio: 'Overseeing global coordination, missionary welfare, and strategic prayer deployments across unreached nations.',
    isVerified: true,
    isActive: true,
    mustChangePassword: false,
    joinedAt: '2025-01-01T00:00:00Z',
    prayersOfferedCount: 2480
  },
  {
    id: 'usr-1790216583705',
    fullName: 'Temitope Admin',
    username: 'dtemitope60',
    email: 'dtemitope60@gmail.com',
    phoneNumber: '+234-800-PRAY-NOW',
    country: 'Nigeria',
    role: 'Super Admin',
    avatarUrl: '',
    bio: 'Global directorate overseer and platform administrator.',
    isVerified: true,
    isActive: true,
    mustChangePassword: false,
    joinedAt: '2025-01-01T00:00:00Z',
    prayersOfferedCount: 2480
  }
];

export const INITIAL_PRAYER_REQUESTS: PrayerRequest[] = [];

export const INITIAL_MISSION_REPORTS: MissionReport[] = [];

export const INITIAL_EVENTS: EventMeeting[] = [];

export const INITIAL_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'room-global-strategy',
    name: '🌐 Global Frontier Strategy',
    description: 'High-level missionary collaboration, strategic coordination, and worldwide prayer alerts.',
    type: 'global',
    isPrivate: false,
    memberIds: ['usr-admin-1'],
    createdBy: 'usr-admin-1',
    createdAt: '2025-01-01T00:00:00Z',
    lastMessage: 'Channel active · Start conversation',
    lastMessageTime: 'Ready'
  },
  {
    id: 'room-1040-watch',
    name: '🔥 10/40 Window Pioneers',
    description: 'Dedicated to the least-reached latitude belt between 10 and 40 degrees north.',
    type: 'strategy',
    isPrivate: false,
    memberIds: ['usr-admin-1'],
    createdBy: 'usr-admin-1',
    createdAt: '2025-01-05T00:00:00Z',
    lastMessage: 'Channel active · Start conversation',
    lastMessageTime: 'Ready'
  },
  {
    id: 'room-country-afghanistan',
    name: '🇦🇫 Afghanistan Prayer Watch',
    description: 'Underground church support, Pashtun & Tajik intercession, and refugee aid.',
    type: 'country',
    countryCode: 'AF',
    isPrivate: false,
    memberIds: ['usr-admin-1'],
    createdBy: 'usr-admin-1',
    createdAt: '2025-01-10T00:00:00Z',
    lastMessage: 'Channel active · Start conversation',
    lastMessageTime: 'Ready'
  },
  {
    id: 'room-country-india',
    name: '🇮🇳 India Frontier Harvest',
    description: 'Reaching the Hindi belt, Bhojpuri villages, and unreached tribal communities.',
    type: 'country',
    countryCode: 'IN',
    isPrivate: false,
    memberIds: ['usr-admin-1'],
    createdBy: 'usr-admin-1',
    createdAt: '2025-01-12T00:00:00Z',
    lastMessage: 'Channel active · Start conversation',
    lastMessageTime: 'Ready'
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {};

export const INITIAL_RECORDINGS: MeetingRecording[] = [];

export const INITIAL_RESOURCES: MissionaryResource[] = [
  {
    id: 'res-1',
    title: 'Frontier Missionary Security & Digital Operational Safety Manual (2026 Edition)',
    category: 'Security Guide',
    author: 'PRAYERCLOUD Security Working Group',
    description: 'Comprehensive guidelines on encrypted communication, device sanitation, crossing borders with sensitive scripture materials, and crisis protocol in high-risk zones.',
    fileType: 'PDF',
    fileSize: '4.8 MB',
    downloadUrl: '#',
    downloadsCount: 1840,
    targetRegion: 'Global 10/40 Window',
    language: 'English',
    createdAt: '2026-01-15'
  },
  {
    id: 'res-2',
    title: 'Oral Chronological Bible Storytelling Handbook for Non-Literate Peoples',
    category: 'Training Manual',
    author: 'Frontier Storytellers Fellowship',
    description: '36 complete story units from Genesis to Revelation specifically structured for unreached oral cultures, pastoral tribes, and illiterate village elders.',
    fileType: 'PDF',
    fileSize: '6.2 MB',
    downloadUrl: '#',
    downloadsCount: 2490,
    targetRegion: 'Asia & Africa',
    language: 'English',
    createdAt: '2026-02-01'
  },
  {
    id: 'res-3',
    title: 'Joshua Project: Global Unreached Peoples Dossier & Strategic Prayer Guide',
    category: 'Research Brief',
    author: 'Joshua Project & Operation World Research',
    description: 'Statistical mapping of the remaining 7,400+ unreached people groups, dominant religious worldview breakdowns, and actionable prayer focuses.',
    fileType: 'PDF',
    fileSize: '12.4 MB',
    downloadUrl: '#',
    downloadsCount: 3120,
    targetRegion: 'Global',
    language: 'English',
    createdAt: '2026-03-01'
  },
  {
    id: 'res-4',
    title: 'The Great Commission in the 21st Century - Audio Masterclass',
    category: 'Audio Sermon',
    author: 'David Livingstone Global Missions Institute',
    description: 'Inspiring 4-part audio teaching on mobilizing the global Church, sacrificial cross-cultural pioneering, and supernatural Holy Spirit ministry.',
    fileType: 'MP3',
    fileSize: '38.5 MB',
    downloadUrl: '#',
    downloadsCount: 1280,
    targetRegion: 'Worldwide',
    language: 'English',
    createdAt: '2026-04-10'
  }
];

export const DEFAULT_BRANDING_SETTINGS: SiteBrandingSettings = {
  siteName: 'PRAYERCLOUD',
  tagline: 'Global Christian Missionary & Unreached Peoples Hub',
  primaryColor: '#2563EB',
  secondaryColor: '#0EA5E9',
  heroHeading: 'Until Every Tribe, Tongue, and Nation Hears the Gospel of Jesus Christ',
  heroSubheading: 'A world-class strategic missionary coordination platform connecting believers, pastors, evangelists, and prayer warriors to bring the Light of the World to the remaining 7,400+ unreached people groups.',
  contactEmail: 'missions@prayercloud.org',
  footerScripture: 'Matthew 24:14 — "And this gospel of the kingdom will be preached in the whole world as a testimony to all nations, and then the end will come."',
  enable2FA: false,
  enableRegistrations: true,
  maxRecordingQuotaMB: 50000,
  metaTitle: 'PRAYERCLOUD - Global Christian Missionary & Unreached Peoples Platform',
  metaDescription: 'Strategic Christian platform mapping unreached people groups, global 24/7 prayer coordination, missionary hub, real-time chat, voice notes, and live video conferencing.',
  globeRotationPaused: false,
  globeTickingSound: false,
  globeSpeed: 1
};
