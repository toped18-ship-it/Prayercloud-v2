import { UnreachedPlace } from '../types';

export const UNREACHED_PLACES_DATA: UnreachedPlace[] = [
  {
    id: 'upg-pashtun-afg',
    name: 'Southern Pashtun',
    countryCode: 'AF',
    countryName: 'Afghanistan',
    type: 'People Group',
    population: 14800000,
    mainReligion: 'Islam (Sunni - Hanafi)',
    languages: ['Southern Pashto', 'Dari'],
    gospelAccessStatus: 'Unreached',
    percentEvangelical: 0.01,
    churchesCount: 0,
    bibleAvailability: 'Complete',
    missionaryPresence: 'Pioneer Needed',
    prayerRequests: [
      'Tribal elders (Maliks) to encounter Jesus through dreams and visions',
      'Pashtun women and youth to find freedom and salvation in the Messiah',
      'Underground digital scripture distribution via Bluetooth and SD cards'
    ],
    coordinates: {
      lat: 31.6289,
      lng: 65.7372 // Kandahar region
    },
    riskNotes: 'Fiercely governed by tribal code (Pashtunwali) and Taliban authorities. Direct open preaching is punishable by death. Extreme discretion required.',
    strategicRecommendations: 'Focus on shortwave radio, satellite television broadcasts, and engaging diaspora refugees in Pakistan and the West.'
  },
  {
    id: 'upg-rohingya-mmr',
    name: 'Rohingya People',
    countryCode: 'MM',
    countryName: 'Myanmar',
    type: 'People Group',
    population: 2200000,
    mainReligion: 'Islam (Sunni)',
    languages: ['Rohingya (Ruáingga)', 'Bengali', 'Burmese'],
    gospelAccessStatus: 'Unreached',
    percentEvangelical: 0.05,
    churchesCount: 4,
    bibleAvailability: 'Portions',
    missionaryPresence: 'Few',
    prayerRequests: [
      'Healing from profound trauma and statelessness in refugee camps',
      'Audio scripture translation in native Rohingya language',
      'Protection of converts within the overcrowded refugee camps of Cox\'s Bazar'
    ],
    coordinates: {
      lat: 21.4272,
      lng: 92.0058 // Rakhine / Cox's Bazar border
    },
    riskNotes: 'Stateless population facing extreme vulnerability, gang violence in camps, and military opposition in Myanmar.',
    strategicRecommendations: 'Medical clinics, trauma healing workshops, and distribution of solar audio Bibles.'
  },
  {
    id: 'upg-sundanese-idn',
    name: 'Sundanese of West Java',
    countryCode: 'ID',
    countryName: 'Indonesia',
    type: 'People Group',
    population: 39500000,
    mainReligion: 'Islam (Shafi\'i)',
    languages: ['Sundanese', 'Bahasa Indonesia'],
    gospelAccessStatus: 'Unreached',
    percentEvangelical: 0.05,
    churchesCount: 18,
    bibleAvailability: 'Complete',
    missionaryPresence: 'Few',
    prayerRequests: [
      'Breakthrough of Disciple-Making Movements (DMM) across West Java villages',
      'Sundanese Christian music and cultural worship expressions',
      'Courage for new believers facing family exclusion and community shaming'
    ],
    coordinates: {
      lat: -6.9175,
      lng: 107.6191 // Bandung & surrounding regencies
    },
    riskNotes: 'Moderate to conservative Islamic region. Church permits are frequently blocked by local regulations.',
    strategicRecommendations: 'Marketplace business-as-mission (BAM) cafes, agricultural cooperatives, and family discovery Bible studies.'
  },
  {
    id: 'upg-kurds-tur',
    name: 'Kurmanji Kurds',
    countryCode: 'TR',
    countryName: 'Turkey',
    type: 'People Group',
    population: 15400000,
    mainReligion: 'Islam (Sunni / Alevi)',
    languages: ['Kurdish (Kurmanji)', 'Turkish'],
    gospelAccessStatus: 'Unreached',
    percentEvangelical: 0.08,
    churchesCount: 8,
    bibleAvailability: 'Complete',
    missionaryPresence: 'Few',
    prayerRequests: [
      'Sovereign Holy Spirit outpouring across southeastern cities (Diyarbakir, Mardin, Van)',
      'Alevi Kurdish seekers finding the ultimate Mediator in Christ',
      'Training and equipping of indigenous Kurdish pastors'
    ],
    coordinates: {
      lat: 37.9144,
      lng: 40.2306 // Diyarbakir
    },
    riskNotes: 'Political tensions and surveillance in southeastern provinces. Sensitivity required when addressing ethnic dynamics.',
    strategicRecommendations: 'Kurdish language worship songwriting, humanitarian relief, and youth language institutes.'
  },
  {
    id: 'upg-yadav-ind',
    name: 'Yadav (North India)',
    countryCode: 'IN',
    countryName: 'India',
    type: 'People Group',
    population: 62000000,
    mainReligion: 'Hinduism (Vaishnavite)',
    languages: ['Hindi', 'Bhojpuri', 'Maithili'],
    gospelAccessStatus: 'Unreached',
    percentEvangelical: 0.12,
    churchesCount: 120,
    bibleAvailability: 'Complete',
    missionaryPresence: 'Few',
    prayerRequests: [
      'Massive transformation among agrarian and dairy farming communities',
      'Deliverance from caste pride and spiritual bondage to ancestral idols',
      'Multiplying house churches led by passionate Yadav elders'
    ],
    coordinates: {
      lat: 25.5941,
      lng: 85.1376 // Bihar / Uttar Pradesh belt
    },
    riskNotes: 'High socio-political influence in northern states; radical religious groups oppose conversion fiercely.',
    strategicRecommendations: 'Oral chronological Bible storytelling, village literacy programs, and agricultural extension services.'
  },
  {
    id: 'upg-tuareg-ner',
    name: 'Tuareg (Blue Men of the Sahara)',
    countryCode: 'NER',
    countryName: 'Niger / Mali / Algeria',
    type: 'Tribe',
    population: 3200000,
    mainReligion: 'Islam (Sunni / Animism syncretism)',
    languages: ['Tamasheq', 'Hausa', 'French'],
    gospelAccessStatus: 'Unreached',
    percentEvangelical: 0.02,
    churchesCount: 3,
    bibleAvailability: 'Translation in Progress',
    missionaryPresence: 'Pioneer Needed',
    prayerRequests: [
      'Gospel caravans across nomadic Saharan grazing tracks',
      'Tamasheq Bible translation completion and oral Bible recording',
      'Desert wells bringing both clean water and the Living Water of Jesus'
    ],
    coordinates: {
      lat: 16.9667,
      lng: 7.9833 // Agadez / Sahara Oasis
    },
    riskNotes: 'Harsh desert climate, banditry, and insurgent activity across the Sahel strip.',
    strategicRecommendations: 'Solar well drilling, camel medical caravans, and solar MP3 audio players loaded with Tamasheq scriptures.'
  },
  {
    id: 'upg-hui-chn',
    name: 'Hui Chinese Muslims',
    countryCode: 'CN',
    countryName: 'China',
    type: 'People Group',
    population: 11400000,
    mainReligion: 'Islam (Sunni / Gedimu / Sufi)',
    languages: ['Mandarin Chinese', 'Arabic (Liturgical)'],
    gospelAccessStatus: 'Unreached',
    percentEvangelical: 0.03,
    churchesCount: 15,
    bibleAvailability: 'Complete',
    missionaryPresence: 'Few',
    prayerRequests: [
      'Han Chinese Christians overcoming ethnic prejudice to lovingly share Christ with Hui neighbors',
      'Understanding of Isa al-Masih as Lord through the Arabic and Chinese Quranic bridges',
      'Protection for secret believers in Ningxia and Gansu provinces'
    ],
    coordinates: {
      lat: 38.4872,
      lng: 106.2309 // Yinchuan, Ningxia
    },
    riskNotes: 'Tight governmental scrutiny on religious affairs and state surveillance.',
    strategicRecommendations: 'Cultural hospitality, noodle and tea shops as mission hubs, and bilingual Gospel materials.'
  },
  {
    id: 'upg-sanaani-yem',
    name: 'Sana\'ani Arabs of Old Sana\'a',
    countryCode: 'YE',
    countryName: 'Yemen',
    type: 'City',
    population: 3900000,
    mainReligion: 'Islam (Zaydi Shia / Sunni)',
    languages: ['Sanaani Arabic'],
    gospelAccessStatus: 'Unreached',
    percentEvangelical: 0.02,
    churchesCount: 0,
    bibleAvailability: 'Complete',
    missionaryPresence: 'Pioneer Needed',
    prayerRequests: [
      'Deliverance from generational cycles of warfare and famine',
      'Courage for secret seekers following Jesus in ancient mud-brick tower homes',
      'Gospel radio signals over the mountains of Sana\'a'
    ],
    coordinates: {
      lat: 15.3694,
      lng: 44.1910 // Sana\'a Old City
    },
    riskNotes: 'Active conflict zone, severe food shortages, strict religious governance.',
    strategicRecommendations: 'Emergency food baskets combined with silent prayer, satellite TV follow-up, and online discipleship.'
  },
  {
    id: 'upg-tibet-lhasa',
    name: 'Lhasa Tibetan Buddhists',
    countryCode: 'CN',
    countryName: 'China',
    type: 'City',
    population: 860000,
    mainReligion: 'Tibetan Buddhism (Lamaism)',
    languages: ['Tibetan (Lhasa)', 'Mandarin'],
    gospelAccessStatus: 'Unreached',
    percentEvangelical: 0.04,
    churchesCount: 2,
    bibleAvailability: 'Complete',
    missionaryPresence: 'Few',
    prayerRequests: [
      'Spiritual liberation from fear of demons and reincarnation cycles',
      'Monks inside Jokhang and Sera monasteries to find the True Light',
      'Tibetan worship music using traditional instruments (dranyen, dungchen)'
    ],
    coordinates: {
      lat: 29.6524,
      lng: 91.1721 // Lhasa, Tibet Plateau
    },
    riskNotes: 'Strict travel permit restrictions and high-altitude physical demands.',
    strategicRecommendations: 'Tibetan cultural preservation, medical relief, high-altitude greenhouse farming, and prayer walks.'
  },
  {
    id: 'upg-somali-ogaden',
    name: 'Ogaden Somali Clans',
    countryCode: 'ET',
    countryName: 'Ethiopia',
    type: 'Region',
    population: 6800000,
    mainReligion: 'Islam (Sunni)',
    languages: ['Somali'],
    gospelAccessStatus: 'Unreached',
    percentEvangelical: 0.02,
    churchesCount: 5,
    bibleAvailability: 'Complete',
    missionaryPresence: 'Pioneer Needed',
    prayerRequests: [
      'Ethiopian highland churches to send loving workers into the Somali desert',
      'Deliverance from severe drought, clan warfare, and poverty',
      'Supernatural healings and miracles in rural pastoral camps'
    ],
    coordinates: {
      lat: 6.7454,
      lng: 44.2749 // Somali Region, Ethiopia
    },
    riskNotes: 'Clan retribution against any member suspected of abandoning traditional beliefs.',
    strategicRecommendations: 'Veterinary care for camels/goats, mobile health clinics, and radio broadcast discipleship.'
  }
];
