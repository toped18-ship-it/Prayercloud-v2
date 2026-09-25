export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'Missionary'
  | 'Pastor'
  | 'Evangelist'
  | 'Prayer Warrior'
  | 'Intercessor';

export type SecurityLevel = 'Low' | 'Medium' | 'High' | 'Extreme';
export type GospelAccessStatus = 'Unreached' | 'Minimally Reached' | 'Partially Reached' | 'Reached';

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber?: string;
  country: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  isVerified?: boolean;
  isActive: boolean;
  mustChangePassword?: boolean;
  joinedAt: string;
  prayersOfferedCount: number;
}

export interface UnreachedPlace {
  id: string;
  name: string;
  countryCode: string; // ISO 2 or 3
  countryName: string;
  type: 'People Group' | 'Tribe' | 'City' | 'Village' | 'Region';
  population: number;
  mainReligion: string;
  languages: string[];
  gospelAccessStatus: GospelAccessStatus;
  percentEvangelical: number;
  churchesCount: number;
  bibleAvailability: 'Complete' | 'New Testament Only' | 'Portions' | 'None' | 'Translation in Progress';
  missionaryPresence: 'None' | 'Few' | 'Adequate' | 'Pioneer Needed';
  prayerRequests: string[];
  photoUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  riskNotes: string;
  strategicRecommendations: string;
}

export interface Country {
  id: string;
  code: string; // ISO 2
  code3: string; // ISO 3
  name: string;
  flag: string; // emoji flag or SVG
  continent: 'Africa' | 'Asia' | 'Europe' | 'North America' | 'South America' | 'Oceania' | 'Middle East';
  population: number;
  dominantReligions: { religion: string; percentage: number }[];
  christianPercentage: number;
  evangelicalPercentage: number;
  unreachedPopulationPercentage: number;
  unreachedPeopleGroupsCount: number;
  securityLevel: SecurityLevel;
  primaryLanguages: string[];
  capitalCity: string;
  prayerPoints: string[];
  missionOpportunities: string[];
  isIn1040Window: boolean;
  activeMissionariesCount: number;
  activePrayerWarriorsCount: number;
  description: string;
}

export interface GlobalMissionStats {
  totalWorldPopulation: number;
  totalUnreachedPeopleGroups: number;
  total1040WindowCountries: number;
  globalChristianPercentage: number;
  globalEvangelicalPercentage: number;
  unreachedPopulationTotal: number;
  activeFrontierMissionaries: number;
  globalPrayerWarriorsCount: number;
}

export interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  category: 'Country Need' | 'Missionary Request' | 'Personal' | 'Unreached Tribe' | 'Emergency / Persecution';
  urgency: 'Urgent' | 'High' | 'Normal';
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorCountry: string;
  targetCountry?: string;
  targetPlaceId?: string;
  targetPlaceName?: string;
  isAnonymous: boolean;
  prayedCount: number;
  prayingUserIds: string[];
  createdAt: string;
  updatedAt: string;
  comments: PrayerComment[];
  isAnswered?: boolean;
  praiseReport?: string;
}

export interface PrayerComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  text: string;
  createdAt: string;
}

export interface MissionReport {
  id: string;
  title: string;
  missionaryId: string;
  missionaryName: string;
  country: string;
  regionOrCity: string;
  summary: string;
  fullReport: string;
  peopleReachedEstimate: number;
  conversionsCount?: number;
  churchesPlantedCount?: number;
  challenges: string;
  urgentNeeds: string[];
  photoUrls: string[];
  videoUrl?: string;
  scriptureAnchor: string;
  createdAt: string;
  isVerified: boolean;
  likesCount: number;
  likedUserIds: string[];
}

export interface EventMeeting {
  id: string;
  title: string;
  description: string;
  type: '24/7 Global Prayer' | 'Mission Strategy Summit' | 'Country Intercession' | 'Daily Devotion' | 'Frontier Briefing';
  hostId: string;
  hostName: string;
  startTime: string;
  endTime: string;
  targetCountry?: string;
  maxParticipants?: number;
  meetingLink: string;
  isLiveNow: boolean;
  rsvps: string[]; // user IDs
  recordingAvailable?: boolean;
  recordingId?: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  senderCountry?: string;
  content: string;
  type: 'text' | 'voice_note' | 'image' | 'prayer_call' | 'file';
  voiceNoteUrl?: string;
  voiceDurationSeconds?: number;
  attachmentUrl?: string;
  attachmentName?: string;
  createdAt: string;
  isPinned?: boolean;
  reactions: { emoji: string; count: number; userIds: string[] }[];
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
}

export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  type: 'global' | 'country' | 'strategy' | 'direct';
  countryCode?: string;
  isPrivate: boolean;
  memberIds: string[];
  createdBy: string;
  createdAt: string;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface CallSession {
  id: string;
  title: string;
  type: 'voice' | 'video';
  hostId: string;
  hostName: string;
  targetFocus: string; // e.g. "Praying for Yemen", "Global Frontier Strategy"
  startedAt: string;
  endedAt?: string;
  participants: {
    userId: string;
    name: string;
    role: string;
    country: string;
    isMuted: boolean;
    isVideoOn: boolean;
    isHandRaised: boolean;
  }[];
  isRecording: boolean;
  recordingUrl?: string;
  durationSeconds: number;
  isActive: boolean;
}

export interface MeetingRecording {
  id: string;
  title: string;
  callType: 'voice' | 'video';
  hostName: string;
  countryFocus: string;
  date: string;
  durationFormatted: string;
  sizeFormatted: string;
  mediaUrl: string;
  downloadsCount: number;
  viewsCount: number;
  tags: string[];
}

export interface MissionaryResource {
  id: string;
  title: string;
  category: 'Training Manual' | 'Security Guide' | 'Research Brief' | 'Prayer Guide' | 'Audio Sermon' | 'Bible Tool';
  author: string;
  description: string;
  fileType: 'PDF' | 'DOCX' | 'MP3' | 'EPUB';
  fileSize: string;
  downloadUrl: string;
  downloadsCount: number;
  targetRegion?: string;
  language: string;
  createdAt: string;
}

export interface SiteBrandingSettings {
  siteName: string;
  tagline: string;
  primaryColor: string; // #2563EB
  secondaryColor: string; // #0EA5E9
  heroHeading: string;
  heroSubheading: string;
  contactEmail: string;
  footerScripture: string;
  enable2FA: boolean;
  enableRegistrations: boolean;
  maxRecordingQuotaMB: number;
  metaTitle: string;
  metaDescription: string;
  globeRotationPaused?: boolean;
  globeTickingSound?: boolean;
  globeSpeed?: 0.5 | 1 | 2;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  action: string;
  target: string;
  details: string;
}

export type SUDevotionalEdition = 'Daily Guide';

export interface SUDailyDevotional {
  id: string;
  date: string; // YYYY-MM-DD
  edition: SUDevotionalEdition;
  title: string;
  openingPrayer: string;
  biblePassage: {
    book: string;
    chapter: number;
    verses: string;
    text: string;
  };
  keyVerse: {
    text: string;
    reference: string;
  };
  readingNotes: string[];
  reflectionQuestions: string[];
  prayerOfCommitment: string;
  oneYearBibleReading: {
    morning: string;
    evening: string;
  };
  suGlobalPrayerFocus: string;
  authorOrSource: string;
  tags: string[];
}

export interface BibleBookMeta {
  id: string;
  name: string;
  abbreviation: string;
  testament: 'OT' | 'NT';
  category: 'Law' | 'History' | 'Poetry' | 'Prophets' | 'Gospels' | 'Acts' | 'Epistles' | 'Revelation';
  chaptersCount: number;
}

export interface BibleVerse {
  verse: number;
  text: string;
}

export interface BibleChapterData {
  book: string;
  chapter: number;
  translation: string;
  verses: BibleVerse[];
}

export interface DevotionalJournalEntry {
  id: string;
  devotionalId?: string;
  date: string;
  title: string;
  scriptureReference: string;
  notes: string;
  actionPoint: string;
  createdAt: string;
}

export interface BibleHighlight {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  color: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose';
  createdAt: string;
}

