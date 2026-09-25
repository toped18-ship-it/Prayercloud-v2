import { BibleBookMeta, BibleChapterData } from '../types';

export const BIBLE_BOOKS: BibleBookMeta[] = [
  // OLD TESTAMENT
  { id: 'GEN', name: 'Genesis', abbreviation: 'Gen', testament: 'OT', category: 'Law', chaptersCount: 50 },
  { id: 'EXO', name: 'Exodus', abbreviation: 'Exo', testament: 'OT', category: 'Law', chaptersCount: 40 },
  { id: 'LEV', name: 'Leviticus', abbreviation: 'Lev', testament: 'OT', category: 'Law', chaptersCount: 27 },
  { id: 'NUM', name: 'Numbers', abbreviation: 'Num', testament: 'OT', category: 'Law', chaptersCount: 36 },
  { id: 'DEU', name: 'Deuteronomy', abbreviation: 'Deu', testament: 'OT', category: 'Law', chaptersCount: 34 },
  { id: 'JOS', name: 'Joshua', abbreviation: 'Jos', testament: 'OT', category: 'History', chaptersCount: 24 },
  { id: 'JDG', name: 'Judges', abbreviation: 'Jdg', testament: 'OT', category: 'History', chaptersCount: 21 },
  { id: 'RUT', name: 'Ruth', abbreviation: 'Rut', testament: 'OT', category: 'History', chaptersCount: 4 },
  { id: '1SA', name: '1 Samuel', abbreviation: '1Sa', testament: 'OT', category: 'History', chaptersCount: 31 },
  { id: '2SA', name: '2 Samuel', abbreviation: '2Sa', testament: 'OT', category: 'History', chaptersCount: 24 },
  { id: '1KI', name: '1 Kings', abbreviation: '1Ki', testament: 'OT', category: 'History', chaptersCount: 22 },
  { id: '2KI', name: '2 Kings', abbreviation: '2Ki', testament: 'OT', category: 'History', chaptersCount: 25 },
  { id: '1CH', name: '1 Chronicles', abbreviation: '1Ch', testament: 'OT', category: 'History', chaptersCount: 29 },
  { id: '2CH', name: '2 Chronicles', abbreviation: '2Ch', testament: 'OT', category: 'History', chaptersCount: 36 },
  { id: 'EZR', name: 'Ezra', abbreviation: 'Ezr', testament: 'OT', category: 'History', chaptersCount: 10 },
  { id: 'NEH', name: 'Nehemiah', abbreviation: 'Neh', testament: 'OT', category: 'History', chaptersCount: 13 },
  { id: 'EST', name: 'Esther', abbreviation: 'Est', testament: 'OT', category: 'History', chaptersCount: 10 },
  { id: 'JOB', name: 'Job', abbreviation: 'Job', testament: 'OT', category: 'Poetry', chaptersCount: 42 },
  { id: 'PSA', name: 'Psalms', abbreviation: 'Psa', testament: 'OT', category: 'Poetry', chaptersCount: 150 },
  { id: 'PRO', name: 'Proverbs', abbreviation: 'Pro', testament: 'OT', category: 'Poetry', chaptersCount: 31 },
  { id: 'ECC', name: 'Ecclesiastes', abbreviation: 'Ecc', testament: 'OT', category: 'Poetry', chaptersCount: 12 },
  { id: 'SNG', name: 'Song of Solomon', abbreviation: 'Sng', testament: 'OT', category: 'Poetry', chaptersCount: 8 },
  { id: 'ISA', name: 'Isaiah', abbreviation: 'Isa', testament: 'OT', category: 'Prophets', chaptersCount: 66 },
  { id: 'JER', name: 'Jeremiah', abbreviation: 'Jer', testament: 'OT', category: 'Prophets', chaptersCount: 52 },
  { id: 'LAM', name: 'Lamentations', abbreviation: 'Lam', testament: 'OT', category: 'Prophets', chaptersCount: 5 },
  { id: 'EZK', name: 'Ezekiel', abbreviation: 'Ezk', testament: 'OT', category: 'Prophets', chaptersCount: 48 },
  { id: 'DAN', name: 'Daniel', abbreviation: 'Dan', testament: 'OT', category: 'Prophets', chaptersCount: 12 },
  { id: 'HOS', name: 'Hosea', abbreviation: 'Hos', testament: 'OT', category: 'Prophets', chaptersCount: 14 },
  { id: 'JOL', name: 'Joel', abbreviation: 'Jol', testament: 'OT', category: 'Prophets', chaptersCount: 3 },
  { id: 'AMO', name: 'Amos', abbreviation: 'Amo', testament: 'OT', category: 'Prophets', chaptersCount: 9 },
  { id: 'OBA', name: 'Obadiah', abbreviation: 'Oba', testament: 'OT', category: 'Prophets', chaptersCount: 1 },
  { id: 'JON', name: 'Jonah', abbreviation: 'Jon', testament: 'OT', category: 'Prophets', chaptersCount: 4 },
  { id: 'MIC', name: 'Micah', abbreviation: 'Mic', testament: 'OT', category: 'Prophets', chaptersCount: 7 },
  { id: 'NAM', name: 'Nahum', abbreviation: 'Nam', testament: 'OT', category: 'Prophets', chaptersCount: 3 },
  { id: 'HAB', name: 'Habakkuk', abbreviation: 'Hab', testament: 'OT', category: 'Prophets', chaptersCount: 3 },
  { id: 'ZEP', name: 'Zephaniah', abbreviation: 'Zep', testament: 'OT', category: 'Prophets', chaptersCount: 3 },
  { id: 'HAG', name: 'Haggai', abbreviation: 'Hag', testament: 'OT', category: 'Prophets', chaptersCount: 2 },
  { id: 'ZEC', name: 'Zechariah', abbreviation: 'Zec', testament: 'OT', category: 'Prophets', chaptersCount: 14 },
  { id: 'MAL', name: 'Malachi', abbreviation: 'Mal', testament: 'OT', category: 'Prophets', chaptersCount: 4 },

  // NEW TESTAMENT
  { id: 'MAT', name: 'Matthew', abbreviation: 'Mat', testament: 'NT', category: 'Gospels', chaptersCount: 28 },
  { id: 'MRK', name: 'Mark', abbreviation: 'Mrk', testament: 'NT', category: 'Gospels', chaptersCount: 16 },
  { id: 'LUK', name: 'Luke', abbreviation: 'Luk', testament: 'NT', category: 'Gospels', chaptersCount: 24 },
  { id: 'JHN', name: 'John', abbreviation: 'Jhn', testament: 'NT', category: 'Gospels', chaptersCount: 21 },
  { id: 'ACT', name: 'Acts', abbreviation: 'Act', testament: 'NT', category: 'Acts', chaptersCount: 28 },
  { id: 'ROM', name: 'Romans', abbreviation: 'Rom', testament: 'NT', category: 'Epistles', chaptersCount: 16 },
  { id: '1CO', name: '1 Corinthians', abbreviation: '1Co', testament: 'NT', category: 'Epistles', chaptersCount: 16 },
  { id: '2CO', name: '2 Corinthians', abbreviation: '2Co', testament: 'NT', category: 'Epistles', chaptersCount: 13 },
  { id: 'GAL', name: 'Galatians', abbreviation: 'Gal', testament: 'NT', category: 'Epistles', chaptersCount: 6 },
  { id: 'EPH', name: 'Ephesians', abbreviation: 'Eph', testament: 'NT', category: 'Epistles', chaptersCount: 6 },
  { id: 'PHP', name: 'Philippians', abbreviation: 'Php', testament: 'NT', category: 'Epistles', chaptersCount: 4 },
  { id: 'COL', name: 'Colossians', abbreviation: 'Col', testament: 'NT', category: 'Epistles', chaptersCount: 4 },
  { id: '1TH', name: '1 Thessalonians', abbreviation: '1Th', testament: 'NT', category: 'Epistles', chaptersCount: 5 },
  { id: '2TH', name: '2 Thessalonians', abbreviation: '2Th', testament: 'NT', category: 'Epistles', chaptersCount: 3 },
  { id: '1TI', name: '1 Timothy', abbreviation: '1Ti', testament: 'NT', category: 'Epistles', chaptersCount: 6 },
  { id: '2TI', name: '2 Timothy', abbreviation: '2Ti', testament: 'NT', category: 'Epistles', chaptersCount: 4 },
  { id: 'TIT', name: 'Titus', abbreviation: 'Tit', testament: 'NT', category: 'Epistles', chaptersCount: 3 },
  { id: 'PHM', name: 'Philemon', abbreviation: 'Phm', testament: 'NT', category: 'Epistles', chaptersCount: 1 },
  { id: 'HEB', name: 'Hebrews', abbreviation: 'Heb', testament: 'NT', category: 'Epistles', chaptersCount: 13 },
  { id: 'JAS', name: 'James', abbreviation: 'Jas', testament: 'NT', category: 'Epistles', chaptersCount: 5 },
  { id: '1PE', name: '1 Peter', abbreviation: '1Pe', testament: 'NT', category: 'Epistles', chaptersCount: 5 },
  { id: '2PE', name: '2 Peter', abbreviation: '2Pe', testament: 'NT', category: 'Epistles', chaptersCount: 3 },
  { id: '1JN', name: '1 John', abbreviation: '1Jn', testament: 'NT', category: 'Epistles', chaptersCount: 5 },
  { id: '2JN', name: '2 John', abbreviation: '2Jn', testament: 'NT', category: 'Epistles', chaptersCount: 1 },
  { id: '3JN', name: '3 John', abbreviation: '3Jn', testament: 'NT', category: 'Epistles', chaptersCount: 1 },
  { id: 'JUD', name: 'Jude', abbreviation: 'Jud', testament: 'NT', category: 'Epistles', chaptersCount: 1 },
  { id: 'REV', name: 'Revelation', abbreviation: 'Rev', testament: 'NT', category: 'Revelation', chaptersCount: 22 }
];

export const BIBLE_TRANSLATIONS = [
  { id: 'NIV', name: 'New International Version (NIV)' },
  { id: 'KJV', name: 'King James Version (KJV)' },
  { id: 'ESV', name: 'English Standard Version (ESV)' },
  { id: 'WEB', name: 'World English Bible (WEB)' },
  { id: 'NLT', name: 'New Living Translation (NLT)' }
];

// Rich Curated Scripture Passages for Instant Offline Loading & Devotional Synchronization
export const CORE_BIBLE_CHAPTERS: Record<string, Record<number, { verse: number; text: string }[]>> = {
  Acts: {
    4: [
      { verse: 1, text: 'The priests and the captain of the temple guard and the Sadducees came up to Peter and John while they were speaking to the people.' },
      { verse: 2, text: 'They were greatly disturbed because the apostles were teaching the people, proclaiming in Jesus the resurrection of the dead.' },
      { verse: 3, text: 'They seized Peter and John, and because it was evening, they put them in jail until the next day.' },
      { verse: 4, text: 'But many who heard the message believed; so the number of men who believed grew to about five thousand.' },
      { verse: 12, text: 'Salvation is found in no one else, for there is no other name under heaven given to mankind by which we must be saved.' },
      { verse: 13, text: 'When they saw the courage of Peter and John and realized that they were unschooled, ordinary men, they were astonished and they took note that these men had been with Jesus.' },
      { verse: 19, text: 'But Peter and John replied, "Which is right in God\'s eyes: to listen to you, or to him? You be the judges!' },
      { verse: 20, text: 'As for us, we cannot help speaking about what we have seen and heard."' },
      { verse: 23, text: 'On their release, Peter and John went back to their own people and reported all that the chief priests and the elders had said to them.' },
      { verse: 24, text: 'When they heard this, they raised their voices together in prayer to God. "Sovereign Lord," they said, "you made the heavens and the earth and the sea, and everything in them."' },
      { verse: 29, text: 'Now, Lord, consider their threats and enable your servants to speak your word with great boldness.' },
      { verse: 30, text: 'Stretch out your hand to heal and perform signs and wonders through the name of your holy servant Jesus.' },
      { verse: 31, text: 'After they prayed, the place where they were meeting was shaken. And they were all filled with the Holy Spirit and spoke the word of God boldly.' },
      { verse: 32, text: 'All the believers were one in heart and mind. No one claimed that any of their possessions was their own, but they shared everything they had.' }
    ],
    1: [
      { verse: 8, text: 'But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.' }
    ]
  },
  Romans: {
    12: [
      { verse: 1, text: 'Therefore, I urge you, brothers and sisters, in view of God\'s mercy, to offer your bodies as a living sacrifice, holy and pleasing to God—this is your true and proper worship.' },
      { verse: 2, text: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God\'s will is—his good, pleasing and perfect will.' },
      { verse: 9, text: 'Love must be sincere. Hate what is evil; cling to what is good.' },
      { verse: 10, text: 'Be devoted to one another in love. Honor one another above yourselves.' },
      { verse: 11, text: 'Never be lacking in zeal, but keep your spiritual fervor, serving the Lord.' },
      { verse: 12, text: 'Be joyful in hope, patient in affliction, faithful in prayer.' },
      { verse: 13, text: 'Share with the Lord\'s people who are in need. Practice hospitality.' },
      { verse: 14, text: 'Bless those who persecute you; bless and do not curse.' },
      { verse: 15, text: 'Rejoice with those who rejoice; mourn with those who mourn.' },
      { verse: 16, text: 'Live in harmony with one another. Do not be proud, but be willing to associate with people of low position. Do not be conceited.' },
      { verse: 21, text: 'Do not be overcome by evil, but overcome evil with good.' }
    ],
    10: [
      { verse: 13, text: 'For, "Everyone who calls on the name of the Lord will be saved."' },
      { verse: 14, text: 'How, then, can they call on the one they have not believed in? And how can they believe in the one of whom they have not heard? And how can they hear without someone preaching to them?' },
      { verse: 15, text: 'And how can anyone preach unless they are sent? As it is written: "How beautiful are the feet of those who bring good news!"' },
      { verse: 17, text: 'Consequently, faith comes from hearing the message, and the message is heard through the word about Christ.' }
    ]
  },
  Matthew: {
    28: [
      { verse: 16, text: 'Then the eleven disciples went to Galilee, to the mountain where Jesus had told them to go.' },
      { verse: 17, text: 'When they saw him, they worshiped him; but some doubted.' },
      { verse: 18, text: 'Then Jesus came to them and said, "All authority in heaven and on earth has been given to me.' },
      { verse: 19, text: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,' },
      { verse: 20, text: 'and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age."' }
    ],
    24: [
      { verse: 14, text: 'And this gospel of the kingdom will be preached in the whole world as a testimony to all nations, and then the end will come.' }
    ]
  },
  John: {
    7: [
      { verse: 37, text: 'On the last and greatest day of the festival, Jesus stood and said in a loud voice, "Let anyone who is thirsty come to me and drink.' },
      { verse: 38, text: 'Whoever believes in me, as Scripture has said, rivers of living water will flow from within them."' },
      { verse: 39, text: 'By this he meant the Spirit, whom those who believed in him were later to receive. Up to that time the Spirit had not been given, since Jesus had not yet been glorified.' }
    ],
    14: [
      { verse: 6, text: 'Jesus answered, "I am the way and the truth and the life. No one comes to the Father except through me."' },
      { verse: 26, text: 'But the Advocate, the Holy Spirit, whom the Father will send in my name, will teach you all things and will remind you of everything I have said to you.' },
      { verse: 27, text: 'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.' }
    ]
  },
  '1 Timothy': {
    2: [
      { verse: 1, text: 'I urge, then, first of all, that petitions, prayers, intercession and thanksgiving be made for all people—' },
      { verse: 2, text: 'for kings and all those in authority, that we may live peaceful and quiet lives in all godliness and holiness.' },
      { verse: 3, text: 'This is good, and pleases God our Savior,' },
      { verse: 4, text: 'who wants all people to be saved and to come to a knowledge of the truth.' },
      { verse: 5, text: 'For there is one God and one mediator between God and mankind, the man Christ Jesus,' },
      { verse: 6, text: 'who gave himself as a ransom for all people. This has now been witnessed to at the proper time.' },
      { verse: 8, text: 'Therefore I want the men everywhere to pray, lifting up holy hands without anger or disputing.' }
    ]
  },
  Psalms: {
    23: [
      { verse: 1, text: 'The Lord is my shepherd, I lack nothing.' },
      { verse: 2, text: 'He makes me lie down in green pastures, he leads me beside quiet waters,' },
      { verse: 3, text: 'he refreshes my soul. He guides me along the right paths for his name\'s sake.' },
      { verse: 4, text: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.' },
      { verse: 5, text: 'You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows.' },
      { verse: 6, text: 'Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.' }
    ],
    91: [
      { verse: 1, text: 'Whoever dwells in the shelter of the Most High will rest in the shadow of the Almighty.' },
      { verse: 2, text: 'I will say of the Lord, "He is my refuge and my fortress, my God, in whom I trust."' },
      { verse: 4, text: 'He will cover you with his feathers, and under his wings you will find refuge; his faithfulness will be your shield and rampart.' },
      { verse: 11, text: 'For he will command his angels concerning you to guard you in all your ways;' }
    ],
    67: [
      { verse: 1, text: 'May God be gracious to us and bless us and make his face shine on us—' },
      { verse: 2, text: 'so that your ways may be known on earth, your salvation among all nations.' },
      { verse: 3, text: 'May the peoples praise you, God; may all the peoples praise you.' }
    ]
  },
  Isaiah: {
    55: [
      { verse: 1, text: 'Come, all you who are thirsty, come to the waters; and you who have no money, come, buy and eat!' },
      { verse: 6, text: 'Seek the Lord while he may be found; call on him while he is near.' },
      { verse: 11, text: 'so is my word that goes out from my mouth: It will not return to me empty, but will accomplish what I desire and achieve the purpose for which I sent it.' }
    ],
    6: [
      { verse: 8, text: 'Then I heard the voice of the Lord saying, "Whom shall I send? And who will go for us?" And I said, "Here am I. Send me!"' }
    ]
  },
  Ephesians: {
    6: [
      { verse: 10, text: 'Finally, be strong in the Lord and in his mighty power.' },
      { verse: 11, text: 'Put on the full armor of God, so that you can take your stand against the devil\'s schemes.' },
      { verse: 12, text: 'For our struggle is not against flesh and blood, but against the rulers, against the authorities, against the powers of this dark world and against the spiritual forces of evil in the heavenly realms.' },
      { verse: 18, text: 'And pray in the Spirit on all occasions with all kinds of prayers and requests. With this in mind, be alert and always keep on praying for all the Lord\'s people.' },
      { verse: 19, text: 'Pray also for me, that whenever I speak, words may be given me so that I will fearlessly make known the mystery of the gospel,' }
    ]
  }
};
