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
    fullName: 'David Livingstone (Admin)',
    username: 'superadmin',
    email: 'admin@prayercloud.org',
    phoneNumber: '+1-800-PRAY-NOW',
    country: 'United Kingdom',
    role: 'Super Admin',
    avatarUrl: '',
    bio: 'Overseeing global coordination, missionary welfare, and strategic prayer deployments across unreached nations.',
    isVerified: true,
    isActive: true,
    mustChangePassword: true, // Prompt specifies: Force password change on first login.
    joinedAt: '2025-01-01T00:00:00Z',
    prayersOfferedCount: 2480
  },
  {
    id: 'usr-miss-1',
    fullName: 'Pastor Johnathan Bae',
    username: 'pioneer_bae',
    email: 'johnathan.bae@prayercloud.org',
    phoneNumber: '+82-10-5555-1234',
    country: 'South Korea',
    role: 'Missionary',
    avatarUrl: '',
    bio: 'Pioneer church planter operating in Central Asia and the Silk Road corridor for over 12 years.',
    isVerified: true,
    isActive: true,
    mustChangePassword: false,
    joinedAt: '2025-02-14T00:00:00Z',
    prayersOfferedCount: 1640
  },
  {
    id: 'usr-intercessor-1',
    fullName: 'Deborah Grace Alabi',
    username: 'deborah_prayer',
    email: 'deborah.alabi@prayercloud.org',
    phoneNumber: '+234-803-555-0199',
    country: 'Nigeria',
    role: 'Intercessor',
    avatarUrl: '',
    bio: '24/7 Global Intercession Leader holding the night watch for the 10/40 Window nations.',
    isVerified: true,
    isActive: true,
    mustChangePassword: false,
    joinedAt: '2025-03-01T00:00:00Z',
    prayersOfferedCount: 4230
  },
  {
    id: 'usr-pastor-1',
    fullName: 'Rev. Emmanuel K. Mensah',
    username: 'pastor_mensah',
    email: 'emmanuel.mensah@prayercloud.org',
    phoneNumber: '+233-24-555-7890',
    country: 'Kenya',
    role: 'Pastor',
    avatarUrl: '',
    bio: 'Mobilizing African frontier missionaries and planting bilingual discovery churches.',
    isVerified: true,
    isActive: true,
    mustChangePassword: false,
    joinedAt: '2025-03-10T00:00:00Z',
    prayersOfferedCount: 980
  },
  {
    id: 'usr-evangelist-1',
    fullName: 'Caleb Al-Masri',
    username: 'caleb_witness',
    email: 'caleb.masri@prayercloud.org',
    phoneNumber: '+90-532-555-4321',
    country: 'Turkey',
    role: 'Evangelist',
    avatarUrl: '',
    bio: 'Digital evangelist and coffee shop outreach worker across Anatolia and Middle East cities.',
    isVerified: true,
    isActive: true,
    mustChangePassword: false,
    joinedAt: '2025-03-15T00:00:00Z',
    prayersOfferedCount: 1120
  }
];

export const INITIAL_PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: 'pr-1',
    title: 'Urgent: Safety for 12 Secret Believers Questioned in Southern Afghanistan',
    description: 'Yesterday, local authorities brought in three of our underground house fellowship elders for questioning. Please pray for God\'s supernatural peace, silence from accusers, and that no other family names are disclosed.',
    category: 'Emergency / Persecution',
    urgency: 'Urgent',
    authorId: 'usr-miss-1',
    authorName: 'Pastor Johnathan Bae',
    authorRole: 'Missionary',
    authorCountry: 'Afghanistan',
    targetCountry: 'Afghanistan',
    targetPlaceId: 'upg-pashtun-afg',
    targetPlaceName: 'Southern Pashtun',
    isAnonymous: false,
    prayedCount: 384,
    prayingUserIds: ['usr-intercessor-1', 'usr-admin-1', 'usr-pastor-1'],
    createdAt: '2026-09-22T08:30:00Z',
    updatedAt: '2026-09-22T08:30:00Z',
    comments: [
      {
        id: 'c-1',
        authorId: 'usr-intercessor-1',
        authorName: 'Deborah Grace Alabi',
        authorRole: 'Intercessor',
        text: 'Praying Psalm 91 over each brother right now. Angels of the Lord encamping round about them!',
        createdAt: '2026-09-22T09:15:00Z'
      },
      {
        id: 'c-2',
        authorId: 'usr-admin-1',
        authorName: 'David Livingstone (Admin)',
        authorRole: 'Super Admin',
        text: 'The global 24/7 prayer watch has been alerted. Standing in continuous agreement.',
        createdAt: '2026-09-22T10:00:00Z'
      }
    ],
    isAnswered: false
  },
  {
    id: 'pr-2',
    title: 'Open Hearts in Cox\'s Bazar Camp for New Audio Bibles',
    description: 'We just delivered 150 solar-powered audio Bible players in the native Rohingya dialect to volunteer health workers. Pray for rapid multiplication of family listening groups inside the shelters.',
    category: 'Unreached Tribe',
    urgency: 'High',
    authorId: 'usr-evangelist-1',
    authorName: 'Caleb Al-Masri',
    authorRole: 'Evangelist',
    authorCountry: 'Bangladesh',
    targetCountry: 'Bangladesh',
    targetPlaceId: 'upg-rohingya-mmr',
    targetPlaceName: 'Rohingya People',
    isAnonymous: false,
    prayedCount: 290,
    prayingUserIds: ['usr-admin-1', 'usr-miss-1'],
    createdAt: '2026-09-21T14:20:00Z',
    updatedAt: '2026-09-21T14:20:00Z',
    comments: [],
    isAnswered: false
  },
  {
    id: 'pr-3',
    title: 'Breakthrough Among Sundanese University Students in Bandung',
    description: 'Starting a weekly English conversation and life questions group with 25 Sundanese college students. Pray that the Holy Spirit sparks deep curiosity for the teachings of Jesus.',
    category: 'Missionary Request',
    urgency: 'Normal',
    authorId: 'usr-pastor-1',
    authorName: 'Rev. Emmanuel K. Mensah',
    authorRole: 'Pastor',
    authorCountry: 'Indonesia',
    targetCountry: 'Indonesia',
    targetPlaceId: 'upg-sundanese-idn',
    targetPlaceName: 'Sundanese of West Java',
    isAnonymous: false,
    prayedCount: 198,
    prayingUserIds: ['usr-intercessor-1'],
    createdAt: '2026-09-20T11:00:00Z',
    updatedAt: '2026-09-20T11:00:00Z',
    comments: [],
    isAnswered: true,
    praiseReport: 'Praise God! 3 students asked to read the Gospel of Luke together after our second meeting!'
  },
  {
    id: 'pr-4',
    title: 'Spiritual Vision and Healing in Saharan Oasis Villages',
    description: 'Our mobile medical caravan is crossing the desert reaching 6 nomadic Tuareg settlements this week. Pray for divine healings that validate the Gospel of the Kingdom.',
    category: 'Country Need',
    urgency: 'High',
    authorId: 'usr-admin-1',
    authorName: 'David Livingstone (Admin)',
    authorRole: 'Super Admin',
    authorCountry: 'Niger',
    targetCountry: 'Niger',
    targetPlaceId: 'upg-tuareg-ner',
    targetPlaceName: 'Tuareg (Blue Men of the Sahara)',
    isAnonymous: false,
    prayedCount: 412,
    prayingUserIds: ['usr-miss-1', 'usr-intercessor-1', 'usr-pastor-1'],
    createdAt: '2026-09-19T06:45:00Z',
    updatedAt: '2026-09-19T06:45:00Z',
    comments: [],
    isAnswered: false
  }
];

export const INITIAL_MISSION_REPORTS: MissionReport[] = [
  {
    id: 'rep-1',
    title: 'First House Church Planted in Remote Atlas Mountain Village',
    missionaryId: 'usr-miss-1',
    missionaryName: 'Pastor Johnathan Bae',
    country: 'Morocco',
    regionOrCity: 'High Atlas Range',
    summary: 'After 18 months of silent agricultural assistance and prayer, an extended family of 14 Berber believers made public commitments to follow Christ and broke bread together.',
    fullReport: 'When we first entered this valley in 2024, there was not a single known believer within 80 kilometers. Through teaching drip irrigation techniques and sharing audio parables, the patriarch of the village invited us into his home. Last Sunday, three generations of this family gathered in tears of joy to celebrate the Lord’s Supper in their native Tamasheq dialect.',
    peopleReachedEstimate: 120,
    conversionsCount: 14,
    churchesPlantedCount: 1,
    challenges: 'Water scarcity remains intense, and winter snows will soon close the mountain pass for 3 months.',
    urgentNeeds: [
      'Winter heating fuel support for the meeting home',
      'Solar audio players in Berber language',
      'Continued intercession against village elder intimidation'
    ],
    photoUrls: [],
    scriptureAnchor: 'Isaiah 42:11 - "Let the desert and its towns raise their voices; let the settlements where Kedar lives rejoice. Let the people of Sela sing for joy; let them shout from the mountaintops."',
    createdAt: '2026-09-18T16:00:00Z',
    isVerified: true,
    likesCount: 142,
    likedUserIds: ['usr-admin-1', 'usr-intercessor-1']
  },
  {
    id: 'rep-2',
    title: '42 Village Leaders in Northern Bihar Complete Oral Storytelling Training',
    missionaryId: 'usr-pastor-1',
    missionaryName: 'Rev. Emmanuel K. Mensah',
    country: 'India',
    regionOrCity: 'Bihar State',
    summary: 'Grassroots disciple-makers among the Yadav caste completed a 5-day intensive training in chronological oral storytelling from Creation to the Resurrection.',
    fullReport: 'Northern Bihar is known as the "graveyard of modern missions," but the soil is softening rapidly. Because 65% of the rural population cannot read fluently, our team developed 36 story sets matching local agrarian metaphors. Every leader committed to planting 2 new discovery groups before harvest time.',
    peopleReachedEstimate: 850,
    conversionsCount: 38,
    churchesPlantedCount: 6,
    challenges: 'Strict local scrutiny and false accusations against rural leaders by extremist groups.',
    urgentNeeds: [
      'Bicycles for traveling village evangelists',
      'Micro-loans for goat farming so pastors remain self-sustained'
    ],
    photoUrls: [],
    scriptureAnchor: 'Matthew 9:37-38 - "The harvest is plentiful but the workers are few. Ask the Lord of the harvest, therefore, to send out workers into his harvest field."',
    createdAt: '2026-09-15T12:30:00Z',
    isVerified: true,
    likesCount: 210,
    likedUserIds: ['usr-admin-1', 'usr-miss-1', 'usr-evangelist-1']
  }
];

export const INITIAL_EVENTS: EventMeeting[] = [
  {
    id: 'evt-1',
    title: '24/7 Global Prayer Watch: Middle East & 10/40 Window',
    description: 'Continuous live prayer room where intercessors from all 6 continents rotate hourly praying through unreached cities, underground churches, and missionary safety.',
    type: '24/7 Global Prayer',
    hostId: 'usr-intercessor-1',
    hostName: 'Deborah Grace Alabi',
    startTime: '2026-09-24T00:00:00Z',
    endTime: '2026-09-24T23:59:59Z',
    targetCountry: 'Global 10/40 Window',
    maxParticipants: 500,
    meetingLink: '/calls?room=global-prayer-watch',
    isLiveNow: true,
    rsvps: ['usr-admin-1', 'usr-miss-1', 'usr-pastor-1', 'usr-evangelist-1'],
    recordingAvailable: true
  },
  {
    id: 'evt-2',
    title: 'Frontier Strategy Summit: Reaching the Nomadic Sahel Tribes',
    description: 'Interactive strategy and logistical briefing between African and international mission directors on opening 5 new gospel stations across Chad, Niger, and Mali.',
    type: 'Mission Strategy Summit',
    hostId: 'usr-admin-1',
    hostName: 'David Livingstone (Admin)',
    startTime: '2026-09-25T14:00:00Z',
    endTime: '2026-09-25T16:00:00Z',
    targetCountry: 'Niger',
    maxParticipants: 100,
    meetingLink: '/calls?room=sahel-strategy-summit',
    isLiveNow: false,
    rsvps: ['usr-miss-1', 'usr-pastor-1'],
    recordingAvailable: false
  },
  {
    id: 'evt-3',
    title: 'Weekly Anatolian Intercession: Praying for Turkey & Caucasus',
    description: 'Deep intercession for Turkish university cities, Kurdish provinces, and historical biblical sites across Asia Minor.',
    type: 'Country Intercession',
    hostId: 'usr-evangelist-1',
    hostName: 'Caleb Al-Masri',
    startTime: '2026-09-26T18:00:00Z',
    endTime: '2026-09-26T19:30:00Z',
    targetCountry: 'Turkey',
    maxParticipants: 250,
    meetingLink: '/calls?room=turkey-intercession',
    isLiveNow: false,
    rsvps: ['usr-admin-1'],
    recordingAvailable: false
  }
];

export const INITIAL_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'room-global-strategy',
    name: '🌐 Global Frontier Strategy',
    description: 'High-level missionary collaboration, strategic coordination, and worldwide prayer alerts.',
    type: 'global',
    isPrivate: false,
    memberIds: ['usr-admin-1', 'usr-miss-1', 'usr-intercessor-1', 'usr-pastor-1', 'usr-evangelist-1'],
    createdBy: 'usr-admin-1',
    createdAt: '2025-01-01T00:00:00Z',
    lastMessage: 'All teams please review the updated security protocol for the Sahel mission.',
    lastMessageTime: '10 mins ago'
  },
  {
    id: 'room-1040-watch',
    name: '🔥 10/40 Window Pioneers',
    description: 'Dedicated to the least-reached latitude belt between 10 and 40 degrees north.',
    type: 'strategy',
    isPrivate: false,
    memberIds: ['usr-admin-1', 'usr-miss-1', 'usr-intercessor-1'],
    createdBy: 'usr-admin-1',
    createdAt: '2025-01-05T00:00:00Z',
    lastMessage: 'Audio Bibles ready for distribution in southern border crossings.',
    lastMessageTime: '45 mins ago'
  },
  {
    id: 'room-country-afghanistan',
    name: '🇦🇫 Afghanistan Prayer Watch',
    description: 'Underground church support, Pashtun & Tajik intercession, and refugee aid.',
    type: 'country',
    countryCode: 'AF',
    isPrivate: false,
    memberIds: ['usr-admin-1', 'usr-miss-1', 'usr-intercessor-1'],
    createdBy: 'usr-miss-1',
    createdAt: '2025-01-10T00:00:00Z',
    lastMessage: 'Praise God! The three interrogated brothers have returned home safely!',
    lastMessageTime: '2 hours ago'
  },
  {
    id: 'room-country-india',
    name: '🇮🇳 India Frontier Harvest',
    description: 'Reaching the Hindi belt, Bhojpuri villages, and unreached tribal communities.',
    type: 'country',
    countryCode: 'IN',
    isPrivate: false,
    memberIds: ['usr-admin-1', 'usr-pastor-1', 'usr-intercessor-1'],
    createdBy: 'usr-pastor-1',
    createdAt: '2025-01-12T00:00:00Z',
    lastMessage: 'New discovery Bible study initiated in northern Bihar village.',
    lastMessageTime: '4 hours ago'
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'room-global-strategy': [
    {
      id: 'msg-1',
      roomId: 'room-global-strategy',
      senderId: 'usr-admin-1',
      senderName: 'David Livingstone (Admin)',
      senderRole: 'Super Admin',
      senderCountry: 'United Kingdom',
      content: 'Welcome beloved co-laborers to the PRAYERCLOUD Frontier Strategy Room! Let us lift up Jesus in every unreached nation.',
      type: 'text',
      createdAt: '2026-09-23T10:00:00Z',
      isPinned: true,
      reactions: [
        { emoji: '🙏', count: 12, userIds: ['usr-intercessor-1', 'usr-miss-1'] },
        { emoji: '🔥', count: 8, userIds: ['usr-pastor-1'] }
      ]
    },
    {
      id: 'msg-2',
      roomId: 'room-global-strategy',
      senderId: 'usr-intercessor-1',
      senderName: 'Deborah Grace Alabi',
      senderRole: 'Intercessor',
      senderCountry: 'Nigeria',
      content: 'Amen! The 24/7 Prayer Watch is currently covering the horn of Africa and Yemen. The atmosphere of intercession is heavy with glory.',
      type: 'text',
      createdAt: '2026-09-23T10:15:00Z',
      reactions: [{ emoji: '🙌', count: 6, userIds: ['usr-admin-1'] }]
    },
    {
      id: 'msg-3',
      roomId: 'room-global-strategy',
      senderId: 'usr-miss-1',
      senderName: 'Pastor Johnathan Bae',
      senderRole: 'Missionary',
      senderCountry: 'South Korea',
      content: 'Here is a quick audio update from our field team regarding the mountain pass outreach:',
      type: 'voice_note',
      voiceDurationSeconds: 42,
      createdAt: '2026-09-23T10:30:00Z',
      reactions: [{ emoji: '❤️', count: 5, userIds: ['usr-intercessor-1'] }]
    }
  ]
};

export const INITIAL_RECORDINGS: MeetingRecording[] = [
  {
    id: 'rec-1',
    title: 'Global 24/7 Prayer Watch - Midnight Hour Intercession for Yemen & Somalia',
    callType: 'video',
    hostName: 'Deborah Grace Alabi',
    countryFocus: 'Yemen / Horn of Africa',
    date: '2026-09-22',
    durationFormatted: '1 hr 15 min',
    sizeFormatted: '184 MB',
    mediaUrl: '#',
    downloadsCount: 142,
    viewsCount: 680,
    tags: ['24/7 Prayer', 'Yemen', 'Intercession', 'Holy Spirit']
  },
  {
    id: 'rec-2',
    title: 'Frontier Missionary Strategy: Overcoming Hostile Terrain in the Sahel',
    callType: 'voice',
    hostName: 'David Livingstone (Admin)',
    countryFocus: 'Niger / Sahara',
    date: '2026-09-20',
    durationFormatted: '48 min',
    sizeFormatted: '44 MB',
    mediaUrl: '#',
    downloadsCount: 98,
    viewsCount: 340,
    tags: ['Strategy', 'Sahel', 'Logistics', 'Missionary Safety']
  },
  {
    id: 'rec-3',
    title: 'Urdu & Pashto Digital Evangelism Briefing with Underground Workers',
    callType: 'video',
    hostName: 'Pastor Johnathan Bae',
    countryFocus: 'Afghanistan / Pakistan',
    date: '2026-09-18',
    durationFormatted: '54 min',
    sizeFormatted: '132 MB',
    mediaUrl: '#',
    downloadsCount: 215,
    viewsCount: 890,
    tags: ['Central Asia', 'Digital Gospel', 'Security']
  }
];

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
