import { SUDailyDevotional, SUDevotionalEdition } from '../types';

export function getTodayDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function shiftDateString(dateStr: string, daysOffset: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  dateObj.setDate(dateObj.getDate() + daysOffset);
  return getTodayDateString(dateObj);
}

export function getDayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = (d.getTime() - start.getTime()) + ((start.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export const SU_DAILY_DEVOTIONALS: SUDailyDevotional[] = [
  {
    id: 'su-dg-2026-09-24',
    date: '2026-09-24',
    edition: 'Daily Guide',
    title: 'The Power of Prevailing Intercession',
    openingPrayer: 'Holy Spirit, teach me to pray as I ought. Elevate my heart to intercede for the lost and broken with the compassion of Christ. Amen.',
    biblePassage: {
      book: '1 Timothy',
      chapter: 2,
      verses: '1-8',
      text: 'I urge, then, first of all, that petitions, prayers, intercession and thanksgiving be made for all people—for kings and all those in authority, that we may live peaceful and quiet lives in all godliness and holiness. This is good, and pleases God our Savior, who wants all people to be saved and to come to a knowledge of the truth. For there is one God and one mediator between God and mankind, the man Christ Jesus, who gave himself as a ransom for all people. This has now been witnessed to at the proper time. And for this purpose I was appointed a herald and an apostle—I am telling the truth, I am not lying—and a true and faithful teacher of the Gentiles. Therefore I want the men everywhere to pray, lifting up holy hands without anger or disputing.'
    },
    keyVerse: {
      text: 'This is good, and pleases God our Savior, who wants all people to be saved and to come to a knowledge of the truth.',
      reference: '1 Timothy 2:3-4'
    },
    readingNotes: [
      'Paul places intercession at the top of spiritual priorities: "first of all." Prayer is not the preparation for the work; prayer is the primary spiritual work that dislodges demonic strongholds and softens hearts for the Gospel.',
      'Notice God’s global missional heart: He "wants all people to be saved and to come to a knowledge of the truth." Because Jesus gave Himself as a ransom for all, our prayer scope must never be limited to our immediate family or ethnic group, but must embrace heads of state, closed nations, and unreached tribes.',
      'Effective intercession requires clean hands and a pure heart: "lifting up holy hands without anger or disputing" (v. 8). Bitterness, discord, and unforgiveness hinder our prayers. Let us come before God with clean consciences and earnest love.'
    ],
    reflectionQuestions: [
      'Does your prayer life reflect God\'s universal desire for all nations to be saved?',
      'Do you regularly intercede for national leaders and authorities, even those with whom you disagree politically?',
      'Is there any unresolved anger or grudge that is currently obstructing your prayer life?'
    ],
    prayerOfCommitment: 'Father of all mercies, expand my heart to pray for the world as You love the world. I pray today for the leaders of our nation and all closed countries, that doors may open for the Gospel. Forgive me for any resentment or critical spirit. Cleanse my heart and grant me the grace of persistent intercession. In Jesus\' Name. Amen.',
    oneYearBibleReading: {
      morning: 'Isaiah 51 - 54',
      evening: '2 Corinthians 5'
    },
    suGlobalPrayerFocus: 'Pray for Scripture Union prayer chains across Europe and the Middle East, mobilizing thousands of intercessors for peace and revival among immigrant communities.',
    authorOrSource: 'Scripture Union Daily Guide',
    tags: ['Intercession', 'Global Mission', 'Government Leaders', 'Holiness']
  },
  {
    id: 'su-dg-2026-09-25',
    date: '2026-09-25',
    edition: 'Daily Guide',
    title: 'Unshakable Boldness on the Frontier',
    openingPrayer: 'O Lord, open my eyes that I may see wonderful things in Your law. Grant me the courage of the Apostles as I engage a world that needs Your saving truth. Amen.',
    biblePassage: {
      book: 'Acts',
      chapter: 4,
      verses: '23-31',
      text: 'On their release, Peter and John went back to their own people and reported all that the chief priests and the elders had said to them. When they heard this, they raised their voices together in prayer to God. "Sovereign Lord," they said, "you made the heavens and the earth and the sea, and everything in them. You spoke by the Holy Spirit through the mouth of your servant, our father David: \'Why do the nations rage and the peoples plot in vain? The kings of the earth rise up and the rulers band together against the Lord and against his anointed one.\' Indeed Herod and Pontius Pilate met together with the Gentiles and the people of Israel in this city to conspire against your holy servant Jesus, whom you anointed. They did what your power and will had decided beforehand should happen. Now, Lord, consider their threats and enable your servants to speak your word with great boldness. Stretch out your hand to heal and perform signs and wonders through the name of your holy servant Jesus." After they prayed, the place where they were meeting was shaken. And they were all filled with the Holy Spirit and spoke the word of God boldly.'
    },
    keyVerse: {
      text: 'Now, Lord, consider their threats and enable your servants to speak your word with great boldness.',
      reference: 'Acts 4:29'
    },
    readingNotes: [
      'Notice how the early disciples responded to fierce religious and political intimidation. Instead of retreating into fear, nursing grievances, or asking God to annihilate their persecutors, their immediate instinct was corporate intercession grounded in the absolute sovereignty of God (v. 24). They recognized that no emperor, governor, or hostile regime can thwart the sovereign decrees of the Creator.',
      'Their prayer was remarkably kingdom-centric. They did not pray for personal safety, luxury, or an easy life; they prayed for boldness to proclaim the Gospel and for supernatural confirmation through the healing name of Jesus (v. 29-30). In hostile frontier environments—whether in closed nations or secular institutions—our first weapon is not human diplomacy, but prevailing prayer.',
      'God’s answer was immediate, palpable, and invigorating. The building shook, signifying God\'s presence in their midst, and they were freshly filled with the Holy Spirit. Boldness is not the absence of danger; it is the presence of the Holy Spirit overpowering our natural fear. When we yield our fears to God, He equips us to be fearless witnesses.'
    ],
    reflectionQuestions: [
      'How do you instinctively react when facing opposition, criticism, or hostility for your faith?',
      'What dominates your prayer life during seasons of trial: personal comfort or Kingdom advancement?',
      'In what specific area of your life or missionary calling is the Lord asking you to speak with greater boldness today?'
    ],
    prayerOfCommitment: 'Sovereign Father, Creator of the universe, thank You that no power on earth or in hell can stand against Your Kingdom. Fill me afresh with Your Holy Spirit today. Strip away all timidity and enable me to speak Your Word with unyielding boldness and compassion. Protect our brethren serving in persecuted frontier fields and confirm Your Word with signs and wonders. In Jesus\' mighty Name. Amen.',
    oneYearBibleReading: {
      morning: 'Isaiah 55 - 58',
      evening: '2 Corinthians 6'
    },
    suGlobalPrayerFocus: 'Pray for Scripture Union school clubs and university fellowships in Central Asia and Northern Nigeria facing severe pressure from hostile authorities. Pray for wisdom, courage, and spiritual stamina for the student leaders.',
    authorOrSource: 'Scripture Union Daily Guide',
    tags: ['Boldness', 'Holy Spirit', 'Persecution', 'Frontier Mission', 'Prayer']
  },
  {
    id: 'su-dg-2026-09-26',
    date: '2026-09-26',
    edition: 'Daily Guide',
    title: 'Streams in the Desert: The Refreshing Spirit',
    openingPrayer: 'Lord God, my soul thirsts for You in a dry and parched land. Quench my thirst with the living waters of Your Holy Spirit today. Amen.',
    biblePassage: {
      book: 'John',
      chapter: 7,
      verses: '37-39',
      text: 'On the last and greatest day of the festival, Jesus stood and said in a loud voice, "Let anyone who is thirsty come to me and drink. Whoever believes in me, as Scripture has said, rivers of living water will flow from within them." By this he meant the Spirit, whom those who believed in him were later to receive. Up to that time the Spirit had not been given, since Jesus had not yet been glorified.'
    },
    keyVerse: {
      text: 'Whoever believes in me, as Scripture has said, rivers of living water will flow from within them.',
      reference: 'John 7:38'
    },
    readingNotes: [
      'During the Feast of Tabernacles in Jerusalem, the priests poured water at the altar to commemorate God\'s provision in the desert. In that very dramatic moment, Jesus raised His voice and made a staggering announcement: He Himself is the true source of living water.',
      'The prerequisite to receiving is thirst: "Let anyone who is thirsty come to me and drink." Those who are self-satisfied or complacent will never taste the fullness of the Spirit. But to the thirsty soul, Christ offers not a mere trickle, but "rivers of living water" overflowing to bless a drought-stricken world.',
      'As missionaries and believers, we cannot pour into others from an empty vessel. We must constantly drink deeply from the Fountain of Christ so that His life, joy, and transformative power burst forth from our innermost being.'
    ],
    reflectionQuestions: [
      'Are you feeling spiritually exhausted, dry, or running on empty fumes today?',
      'What are the cisterns of worldly comfort you are tempted to drink from instead of Christ?',
      'How can you allow the living water of the Holy Spirit to overflow to someone near you today?'
    ],
    prayerOfCommitment: 'Lord Jesus, You alone are the Living Water. I come to You with an open and thirsty soul. Wash away all dryness, apathy, and burnout. Fill me to overflowing with Your Holy Spirit so that rivers of life, truth, and hope flow out of me to touch those in spiritual drought. Amen.',
    oneYearBibleReading: {
      morning: 'Isaiah 59 - 62',
      evening: '2 Corinthians 7'
    },
    suGlobalPrayerFocus: 'Pray for rural missionary workers operating in desert regions of North Africa and the Sahel strip, that they will experience deep spiritual renewal in God’s presence.',
    authorOrSource: 'Scripture Union Daily Guide',
    tags: ['Holy Spirit', 'Living Water', 'Spiritual Renewal', 'Thirst for God']
  },
  {
    id: 'su-dg-2026-09-27',
    date: '2026-09-27',
    edition: 'Daily Guide',
    title: 'The Whole Armor of God: Standing Firm on the Frontline',
    openingPrayer: 'Mighty God, clothe me in Your divine armor this day. Give me spiritual discernment to recognize the schemes of the enemy and stand unwavering in Your victory. Amen.',
    biblePassage: {
      book: 'Ephesians',
      chapter: 6,
      verses: '10-20',
      text: 'Finally, be strong in the Lord and in his mighty power. Put on the full armor of God, so that you can take your stand against the devil’s schemes. For our struggle is not against flesh and blood, but against the rulers, against the authorities, against the powers of this dark world and against the spiritual forces of evil in the heavenly realms. Therefore put on the full armor of God, so that when the day of evil comes, you may be able to stand your ground, and after you have done everything, to stand. Stand firm then, with the belt of truth buckled around your waist, with the breastplate of righteousness in place, and with your feet fitted with the readiness that comes from the gospel of peace. In addition to all this, take up the shield of faith, with which you can extinguish all the flaming arrows of the evil one. Take the helmet of salvation and the sword of the Spirit, which is the word of God. And pray in the Spirit on all occasions with all kinds of prayers and requests. With this in mind, be alert and always keep on praying for all the Lord’s people.'
    },
    keyVerse: {
      text: 'Put on the full armor of God, so that you can take your stand against the devil’s schemes.',
      reference: 'Ephesians 6:11'
    },
    readingNotes: [
      'The Christian life is not a playground, but a spiritual battleground. Paul makes it unmistakably clear that our true enemies are not human beings or hostile political systems, but unseen spiritual powers seeking to derail God’s kingdom purposes.',
      'God does not send us into this warfare ill-equipped. He provides His own armor: truth, righteousness, gospel readiness, faith, salvation, and the sword of the Spirit, which is the spoken and believed Word of God. Notice that every piece of armor is grounded in Christ Himself.',
      'Notice the vital engine that powers all the armor: persistent prayer in the Spirit (v. 18). Without communion with God and watchful intercession for the saints, our armor remains unworn. We conquer not by human strength, but by prevailing on our knees.'
    ],
    reflectionQuestions: [
      'Are you battling human opposition as if they are your real enemy, or are you discerning the spiritual battle underneath?',
      'Which piece of God’s armor do you most need to consciously take up today?',
      'How alert and intentional is your intercession for frontline workers and fellow believers?'
    ],
    prayerOfCommitment: 'Lord God Almighty, thank You that the battle belongs to You and the victory is secured in Christ Jesus. I put on the belt of truth, breastplate of righteousness, shoes of the gospel of peace, shield of faith, and helmet of salvation. Teach me to wield the sword of the Spirit with authority. Protect all frontline missionaries against the schemes of darkness today. Amen.',
    oneYearBibleReading: {
      morning: 'Isaiah 63 - 66',
      evening: '2 Corinthians 8'
    },
    suGlobalPrayerFocus: 'Pray for missionaries and Bible translators in Papua New Guinea and remote Pacific islands facing severe spiritual warfare and tribal conflicts.',
    authorOrSource: 'Scripture Union Daily Guide',
    tags: ['Spiritual Warfare', 'Armor of God', 'Faith', 'Intercession']
  },
  {
    id: 'su-dg-2026-09-28',
    date: '2026-09-28',
    edition: 'Daily Guide',
    title: 'More Than Conquerors in Christ',
    openingPrayer: 'Loving Father, root my identity in Your everlasting love. Remind me that nothing in all creation can separate me from Your grace in Christ Jesus. Amen.',
    biblePassage: {
      book: 'Romans',
      chapter: 8,
      verses: '31-39',
      text: 'What, then, shall we say in response to these things? If God is for us, who can be against us? He who did not spare his own Son, but gave him up for us all—how will he not also, along with him, graciously give us all things? Who will bring any charge against those whom God has chosen? It is God who justifies. Who then is the one who condemns? No one. Christ Jesus who died—more than that, who was raised to life—is at the right hand of God and is also interceding for us. Who shall separate us from the love of Christ? Shall trouble or hardship or persecution or famine or nakedness or danger or sword? ... No, in all these things we are more than conquerors through him who loved us. For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord.'
    },
    keyVerse: {
      text: 'No, in all these things we are more than conquerors through him who loved us.',
      reference: 'Romans 8:37'
    },
    readingNotes: [
      'Paul confronts the harshest realities of human suffering: hardship, persecution, famine, danger, and the sword. He does not promise that believers will be exempt from trial, but guarantees that trials will never sever us from Christ’s love.',
      'We are called "more than conquerors" (hypernikōmen)—meaning we do not merely survive difficulties, but emerge victorious through Christ who turns every affliction into a testimony of His surpassing grace.',
      'Jesus Himself is actively interceding for us at the right hand of the Father (v. 34). Whatever accusations the enemy brings or whatever fears grip our hearts, our standing is secure because God Himself has justified us.'
    ],
    reflectionQuestions: [
      'What present hardship or anxiety is currently challenging your sense of God\'s love?',
      'How does knowing that Jesus is actively praying for you right now alter your perspective on your current trials?',
      'How can you share the comfort of God\'s unbreakable love with someone walking through a storm?'
    ],
    prayerOfCommitment: 'Heavenly Father, I praise You that You are for me, and no adversary can stand against Your decree. Thank You that Christ died, rose, and lives to intercede for me. I anchor my soul in Your unfailing love today. Make me more than a conqueror in every situation I face. In Jesus\' mighty Name. Amen.',
    oneYearBibleReading: {
      morning: 'Jeremiah 1 - 3',
      evening: '2 Corinthians 9'
    },
    suGlobalPrayerFocus: 'Pray for persecuted Christians in the Middle East and South Asia who have lost jobs, homes, and family acceptance for following Christ. Pray for supernatural provision and deep peace.',
    authorOrSource: 'Scripture Union Daily Guide',
    tags: ['Victory', 'Perseverance', 'Love of God', 'Assurance']
  },
  {
    id: 'su-dg-2026-09-29',
    date: '2026-09-29',
    edition: 'Daily Guide',
    title: 'Set Your Minds on Things Above',
    openingPrayer: 'Eternal God, elevate my affections above the fleeting distractions of this world. Fix my gaze on the glory of Christ who reigns exalted. Amen.',
    biblePassage: {
      book: 'Colossians',
      chapter: 3,
      verses: '1-17',
      text: 'Since, then, you have been raised with Christ, set your hearts on things above, where Christ is, seated at the right hand of God. Set your minds on things above, not on earthly things. For you died, and your life is now hidden with Christ in God. When Christ, who is your life, appears, then you also will appear with him in glory. Put to death, therefore, whatever belongs to your earthly nature: sexual immorality, impurity, lust, evil desires and greed, which is idolatry... Therefore, as God’s chosen people, holy and dearly loved, clothe yourselves with compassion, kindness, humility, gentleness and patience. Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you. And over all these virtues put on love, which binds them all together in perfect unity.'
    },
    keyVerse: {
      text: 'Set your minds on things above, not on earthly things. For you died, and your life is now hidden with Christ in God.',
      reference: 'Colossians 3:2-3'
    },
    readingNotes: [
      'Our practical conduct always stems from our spiritual position. Because we have died with Christ and been raised with Him, we are exhorted to realign our desires and mental habits with heavenly reality.',
      'Paul describes a two-fold motion: "putting to death" the old sinful patterns and "clothing ourselves" with the character of Christ—compassion, kindness, humility, and above all, love.',
      'Notice the supreme mandate of forgiveness: "Forgive as the Lord forgave you." A refusal to forgive chains our hearts to earthly bitterness. When we forgive freely, the peace of Christ rules in our hearts.'
    ],
    reflectionQuestions: [
      'What earthly concerns or distractions are consuming your thoughts and stealing your spiritual focus?',
      'Which garment of Christ’s character—humility, kindness, patience—needs to be put on today?',
      'Is there anyone you need to extend unconditional forgiveness to today?'
    ],
    prayerOfCommitment: 'Lord Jesus, You are my life and my supreme treasure. I choose to set my mind on things above today. Cleanse me from all selfish desires and worldly entanglement. Clothe me with Your humility, gentleness, and selfless love. Let Your peace rule in my heart and let whatever I do be done for Your glory. Amen.',
    oneYearBibleReading: {
      morning: 'Jeremiah 4 - 6',
      evening: '2 Corinthians 10'
    },
    suGlobalPrayerFocus: 'Pray for Scripture Union youth camps and leadership training academies across Latin America, discipling the next generation to live counter-cultural, holy lives.',
    authorOrSource: 'Scripture Union Daily Guide',
    tags: ['Holy Living', 'Heavenly Mindset', 'Forgiveness', 'Discipleship']
  },
  {
    id: 'su-dg-2026-09-30',
    date: '2026-09-30',
    edition: 'Daily Guide',
    title: 'The Living and Enduring Word of God',
    openingPrayer: 'Living God, Your Word is a lamp unto my feet and a light unto my path. Give me a ravenous hunger for Your truth today. Amen.',
    biblePassage: {
      book: '1 Peter',
      chapter: 1,
      verses: '22-25',
      text: 'Now that you have purified yourselves by obeying the truth so that you have sincere love for each other, love one another deeply, from the heart. For you have been born again, not of perishable seed, but of imperishable, through the living and enduring word of God. For, "All people are like grass, and all their glory is like the flowers of the field; the grass withers and the flowers fall, but the word of the Lord endures forever." And this is the word that was preached to you.'
    },
    keyVerse: {
      text: 'The grass withers and the flowers fall, but the word of the Lord endures forever.',
      reference: '1 Peter 1:24-25'
    },
    readingNotes: [
      'In a world where human philosophies, regimes, and cultural trends constantly fade away, the Word of God stands eternal and indestructible.',
      'Peter connects the power of the Word directly to our new birth: we were born again of imperishable seed. God’s Word is not dead letters on a page, but a dynamic, life-giving agent that transforms human nature.',
      'The fruit of the Word in our lives is authentic mutual love: "love one another deeply, from the heart." Bible knowledge that does not produce sacrificial love for others is vain orthodoxy.'
    ],
    reflectionQuestions: [
      'How regularly do you feed on God’s Word compared to feeding on secular media and news?',
      'In what ways has the imperishable Word produced sacrificial love in your daily relationships?',
      'Are you actively sharing this enduring Word with those whose lives are founded on sinking sand?'
    ],
    prayerOfCommitment: 'Heavenly Father, thank You for the timeless treasure of Your Holy Scriptures. Plant Your Word deeply into the soil of my heart. Let it bear the rich fruit of sincere love, purity, and bold witness. Grant success to all Bible translators bringing Your Word to unreached languages. In Jesus\' Name. Amen.',
    oneYearBibleReading: {
      morning: 'Jeremiah 7 - 9',
      evening: '2 Corinthians 11'
    },
    suGlobalPrayerFocus: 'Pray for Bible translation teams working with Wycliffe and Scripture Union in Southeast Asia, striving to complete translations for minority language groups.',
    authorOrSource: 'Scripture Union Daily Guide',
    tags: ['Word of God', 'Eternal Truth', 'Love', 'Bible Translation']
  },
  {
    id: 'su-dg-2026-10-01',
    date: '2026-10-01',
    edition: 'Daily Guide',
    title: 'Renewing Your Strength Like the Eagle',
    openingPrayer: 'O Everlasting God, Creator of the ends of the earth, You do not grow faint or weary. Impart Your supernatural strength to my weary spirit today. Amen.',
    biblePassage: {
      book: 'Isaiah',
      chapter: 40,
      verses: '27-31',
      text: 'Why do you complain, Jacob? Why do you say, Israel, "My way is hidden from the Lord; my cause is disregarded by my God"? Do you not know? Have you not heard? The Lord is the everlasting God, the Creator of the ends of the earth. He will not grow tired or weary, and his understanding no one can fathom. He gives strength to the weary and increases the power of the weak. Even youths grow tired and weary, and young men stumble and fall; but those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.'
    },
    keyVerse: {
      text: 'Those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
      reference: 'Isaiah 40:31'
    },
    readingNotes: [
      'Isaiah addresses believers who feel forgotten by God during prolonged exile and difficulty. God gently rebukes their despondency by directing their gaze to His eternal character: He never sleeps, never grows weary, and His wisdom is inexhaustible.',
      'Human energy—even youthful vitality—has severe limits. Human willpower will eventually stumble and fall. But those who wait on the Lord (qavah—to bind oneself, entwine, expect with patient trust) exchange their weakness for God\'s limitless energy.',
      'Soaring like eagles signifies rising above the turbulent winds of life through the thermals of the Holy Spirit. When we wait upon the Lord, we find grace not just for dramatic flights, but for the daily steady walk of faithful obedience.'
    ],
    reflectionQuestions: [
      'Have you been relying on natural stamina rather than waiting upon God for spiritual renewal?',
      'What does "waiting on the Lord" look like practically in your personal routine this week?',
      'Who around you is spiritually or physically exhausted and needs you to minister God\'s refreshing power to them?'
    ],
    prayerOfCommitment: 'Almighty God, I confess my weakness and self-sufficiency. I bring my fatigue and anxieties to Your throne. I choose to wait upon You, hoping in Your unfailing promises. Renew my strength today. Empower me to soar above discouragement, to run the race with perseverance, and to walk faithfully without fainting. In Jesus\' Name. Amen.',
    oneYearBibleReading: {
      morning: 'Jeremiah 10 - 12',
      evening: '2 Corinthians 12'
    },
    suGlobalPrayerFocus: 'Pray for missionary families on the frontlines suffering from burnout, sickness, or emotional exhaustion. Pray for restorative rest and fresh divine vigor.',
    authorOrSource: 'Scripture Union Daily Guide',
    tags: ['Renewal', 'Strength', 'Trust', 'Patience', 'Isaiah']
  },
  {
    id: 'su-dg-2026-10-02',
    date: '2026-10-02',
    edition: 'Daily Guide',
    title: 'The Great Commission: Disciple the Nations',
    openingPrayer: 'Risen Lord Jesus, all authority in heaven and on earth belongs to You. Open my eyes to the harvest fields of the world and make me a faithful laborer in Your vineyard. Amen.',
    biblePassage: {
      book: 'Matthew',
      chapter: 28,
      verses: '16-20',
      text: 'Then the eleven disciples went to Galilee, to the mountain where Jesus had told them to go. When they saw him, they worshiped him; but some doubted. Then Jesus came to them and said, "All authority in heaven and on earth has been given to me. Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age."'
    },
    keyVerse: {
      text: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you.',
      reference: 'Matthew 28:19-20'
    },
    readingNotes: [
      'The Great Commission is grounded upon the absolute authority of the Risen Christ. Because all authority in heaven and earth belongs to Him, no hostile government, closed border, or cultural hostility can nullify His command.',
      'The core imperative is not merely to convert individuals, but to "make disciples" (matheteusate)—mentoring believers into full obedience to all Christ commanded. Discipleship requires patient teaching, modeling, and deep relational investment.',
      'The promise accompanying the mandate is God’s eternal presence: "I am with you always, to the very end of the age." We never go alone onto the frontier; the Master walks with every missionary and evangelist until the task is complete.'
    ],
    reflectionQuestions: [
      'Are you actively discipling someone in the faith, helping them grow in obedience to Christ?',
      'How does Christ\'s absolute authority comfort you when proclaiming the Gospel in intimidating environments?',
      'What practical part are you playing in reaching all nations—through prayer, giving, or going?'
    ],
    prayerOfCommitment: 'Lord Jesus, King of kings, I bow before Your supreme authority. I surrender my life to Your great commission. Use my voice, resources, and time to disciple others into Your kingdom. Comfort every missionary facing isolation with the assurance of Your unbroken presence. In Your holy Name. Amen.',
    oneYearBibleReading: {
      morning: 'Jeremiah 13 - 15',
      evening: '2 Corinthians 13'
    },
    suGlobalPrayerFocus: 'Pray for frontier church planters engaging unreached people groups in northern India and the Tibetan plateau. Pray for protection and rapid discipleship movements.',
    authorOrSource: 'Scripture Union Daily Guide',
    tags: ['Great Commission', 'Discipleship', 'Missions', 'Authority of Christ']
  }
];

// Systematic 366-day curriculum library for Scripture Union daily rotation
interface DevotionalCurriculumSeed {
  book: string;
  chapter: number;
  verses: string;
  title: string;
  theme: string;
  otReading: string;
  ntReading: string;
  passageText: string;
  keyVerse: string;
  keyRef: string;
  readingNotes: [string, string, string];
  questions: [string, string, string];
  prayer: string;
  globalFocus: string;
  tags: string[];
}

const DEVOTIONAL_CURRICULUM_SEEDS: DevotionalCurriculumSeed[] = [
  {
    book: 'Romans',
    chapter: 12,
    verses: '1-8',
    title: 'Living Sacrifices: Worship in Daily Life',
    theme: 'Consecration & Spiritual Gifts',
    otReading: 'Genesis 1 - 3',
    ntReading: 'Matthew 1',
    passageText: 'Therefore, I urge you, brothers and sisters, in view of God’s mercy, to offer your bodies as a living sacrifice, holy and pleasing to God—this is your true and proper worship. Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God’s will is—his good, pleasing and perfect will.',
    keyVerse: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind.',
    keyRef: 'Romans 12:2',
    readingNotes: [
      'True Christian worship is not confined to church buildings or songs; it encompasses the consecration of our total physical life to God as a living sacrifice.',
      'The world exerts constant pressure to squeeze us into its secular mold. Transformation requires the continuous renewal of the mind through Scripture and the Holy Spirit.',
      'When our minds are renewed, we discover the beauty of God’s will—which is always good, pleasing, and designed for His highest glory.'
    ],
    questions: [
      'In what specific areas is worldly thinking trying to conform your lifestyle?',
      'How are you actively renewing your mind with God’s Word on a daily basis?',
      'Are you using your spiritual gifts to build up the body of Christ with humility?'
    ],
    prayer: 'Lord God, I lay my body, mind, and future on Your altar today as a living sacrifice. Renew my thoughts and deliver me from the mold of this world. Let Your perfect will be done in my life. Amen.',
    globalFocus: 'Pray for Christian students in secular universities around the world, that they stand firm against relativistic and anti-biblical ideologies.',
    tags: ['Consecration', 'Mind Renewal', 'Worship', 'Discipleship']
  },
  {
    book: 'Philippians',
    chapter: 4,
    verses: '4-9',
    title: 'The Peace of God That Transcends Understanding',
    theme: 'Anxiety, Prayer & Inner Peace',
    otReading: 'Genesis 4 - 6',
    ntReading: 'Matthew 2',
    passageText: 'Rejoice in the Lord always. I will say it again: Rejoice! Let your gentleness be evident to all. The Lord is near. Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
    keyVerse: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',
    keyRef: 'Philippians 4:6',
    readingNotes: [
      'Paul wrote these radiant words while chained in a Roman prison. Christian joy is not based on pleasant circumstances, but on the unchangeable character of our Lord.',
      'The divine antidote to crippling anxiety is specific, thankful prayer. When we transfer our burdens to God’s shoulders, we make room for His peace.',
      'God’s peace acts as a celestial garrison (phroureo) guarding our hearts and vulnerable thought lives against panic and despair.'
    ],
    questions: [
      'What anxiety or worry have you been carrying instead of releasing it to God in prayer?',
      'How does incorporating thanksgiving into your prayers shift your emotional state?',
      'What wholesome, pure, and praiseworthy thoughts can you dwell on today?'
    ],
    prayer: 'Loving Father, I cast all my anxieties, fears, and heavy burdens into Your hands. Thank You for Your steadfast faithfulness. Flood my heart with Your supernatural peace that guards my mind in Christ Jesus. Amen.',
    globalFocus: 'Pray for Christian refugees fleeing war and persecution in the Levant and Eastern Europe, that God’s supernatural peace will sustain their families.',
    tags: ['Peace', 'Prayer', 'Thanksgiving', 'Joy']
  },
  {
    book: 'Joshua',
    chapter: 1,
    verses: '1-9',
    title: 'Be Strong and Courageous on the New Frontier',
    theme: 'Leadership, Courage & God’s Presence',
    otReading: 'Genesis 7 - 9',
    ntReading: 'Matthew 3',
    passageText: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go. Keep this Book of the Law always on your lips; meditate on it day and night, so that you may be careful to do everything written in it. Then you will be prosperous and successful.',
    keyVerse: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
    keyRef: 'Joshua 1:9',
    readingNotes: [
      'Joshua faced the daunting task of succeeding Moses and leading a vast multitude into the promised land. God did not promise an easy road, but promised His sovereign presence.',
      'Courage in the biblical sense is not the absence of human apprehension; it is obedience fueled by the certainty that God goes before us.',
      'The bedrock of spiritual success is meditation on the Word of God day and night. When God’s Word saturates our thoughts, fear is displaced by unyielding faith.'
    ],
    questions: [
      'What new spiritual assignment or challenge is testing your courage today?',
      'How disciplined is your habit of meditating on God’s Word morning and evening?',
      'How does the promise of God’s companionship empower you to step out in faith?'
    ],
    prayer: 'Sovereign God, You are with me wherever I go. Dispel all fear, discouragement, and doubt from my soul. Grant me the courage to step onto new frontiers for Your Kingdom. Teach me to treasure Your Word day and night. Amen.',
    globalFocus: 'Pray for national church leaders and pioneer missionaries planting churches in hostile and unreached regions of Central Asia.',
    tags: ['Courage', 'Word of God', 'Presence of God', 'Leadership']
  },
  {
    book: 'Psalm',
    chapter: 23,
    verses: '1-6',
    title: 'The Lord is My Shepherd: Provision and Guidance',
    theme: 'Shepherd’s Care, Protection & Abundance',
    otReading: 'Genesis 10 - 12',
    ntReading: 'Matthew 4',
    passageText: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul. He guides me along the right paths for his name’s sake. Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me. You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows. Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.',
    keyVerse: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.',
    keyRef: 'Psalm 23:4',
    readingNotes: [
      'David speaks from intimate sheep-and-shepherd experience. Because Yahweh is our Shepherd, we lack nothing essential for our eternal wellbeing.',
      'Notice that the Shepherd leads not around dark valleys, but through them. The valley is temporary, but the Shepherd’s presence is perpetual.',
      'God does not wait for our enemies to disappear before blessing us; He prepares an abundant table of grace right in the midst of adversity.'
    ],
    questions: [
      'In what area of your life are you currently walking through a "dark valley"?',
      'Do you rest in God as your Shepherd, or are you striving to shepherd your own life?',
      'How has God’s goodness and mercy pursued you in seasons past?'
    ],
    prayer: 'Good Shepherd, thank You that You know my name and lead me with gentle authority. I rest in Your provision. When valleys are dark, I will not fear because You walk beside me. Fill my cup to overflowing with Your Spirit today. Amen.',
    globalFocus: 'Pray for persecuted pastors in Iran, China, and North Korea who continue to shepherd underground flocks under immense danger.',
    tags: ['Shepherd', 'Comfort', 'Protection', 'Psalm 23']
  },
  {
    book: 'John',
    chapter: 15,
    verses: '1-8',
    title: 'Abiding in the Vine: The Secret to Fruitfulness',
    theme: 'Abiding in Christ, Pruning & Spiritual Fruit',
    otReading: 'Genesis 13 - 15',
    ntReading: 'Matthew 5',
    passageText: 'I am the true vine, and my Father is the gardener. He cuts off every branch in me that bears no fruit, while every branch that does bear fruit he prunes so that it will be even more fruitful. You are already clean because of the word I have spoken to you. Remain in me, as I also remain in you. No branch can bear fruit by itself; it must remain in the vine. Neither can you bear fruit unless you remain in me. I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.',
    keyVerse: 'I am the vine; you are the branches. If you remain in me and I in you, you will bear much fruit; apart from me you can do nothing.',
    keyRef: 'John 15:5',
    readingNotes: [
      'Jesus gives the ultimate paradigm of the Christian life: fruitfulness is not the result of frantic striving, but the byproduct of intimate connection with Christ.',
      'Pruning can feel painful, but the divine Gardener only prunes fruitful branches so that they may produce richer, sweeter spiritual fruit.',
      'The solemn truth stands: "Apart from me you can do nothing." Human intellect, eloquence, and resources are powerless to produce eternal fruit without the sap of the Holy Spirit.'
    ],
    questions: [
      'Is your spiritual life characterized more by striving or by restful abiding in Christ?',
      'Can you identify any recent pruning by the Father that is preparing you for greater fruitfulness?',
      'What practices help you consciously remain in communion with Jesus throughout the day?'
    ],
    prayer: 'Lord Jesus, You are the True Vine. Forgive me for trying to bear fruit through my own strength. I surrender to the Father’s loving pruning. Teach me to abide deeply in Your love, Your Word, and Your Spirit so that my life bears lasting fruit for Your Kingdom. Amen.',
    globalFocus: 'Pray for Bible college students and young missionaries across Africa, that their ministry will be rooted in deep prayer and personal holiness.',
    tags: ['Abiding', 'Fruitfulness', 'Pruning', 'True Vine']
  },
  {
    book: 'Hebrews',
    chapter: 12,
    verses: '1-3',
    title: 'Running the Race with Unshakable Endurance',
    theme: 'Perseverance, Laying Aside Sin & Fixing Eyes on Jesus',
    otReading: 'Genesis 16 - 18',
    ntReading: 'Matthew 6',
    passageText: 'Therefore, since we are surrounded by such a great cloud of witnesses, let us throw off everything that hinders and the sin that so easily entangles. And let us run with perseverance the race marked out for us, fixing our eyes on Jesus, the pioneer and perfecter of faith. For the joy set before him he endured the cross, scorning its shame, and sat down at the right hand of the throne of God. Consider him who endured such opposition from sinners, so that you will not grow weary and lose heart.',
    keyVerse: 'Let us run with perseverance the race marked out for us, fixing our eyes on Jesus, the pioneer and perfecter of faith.',
    keyRef: 'Hebrews 12:1-2',
    readingNotes: [
      'The Christian life is compared to a marathon, not a sprint. We are cheered on by the saints of redemptive history who ran faithfully before us.',
      'To run effectively, we must shed two things: legitimate weights that slow us down, and entangling sins that trip us up. Discipleship requires ruthless spiritual stripping.',
      'The secret to enduring stamina is fixing our gaze on Jesus. When we consider how He endured the cross for the joy of redeeming us, our temporary fatigue vanishes.'
    ],
    questions: [
      'What weights or entangling habits do you need to actively throw off today?',
      'Are you tempted to grow weary or give up in your service to the Lord?',
      'How does contemplating the joy set before Christ renew your willingness to endure hardness?'
    ],
    prayer: 'Lord Jesus, Author and Finisher of my faith, I fix my gaze on You today. Forgive me for carrying weights of worldly care and compromising sins. Empower me by Your Spirit to run with relentless endurance, keeping eternity in view. Amen.',
    globalFocus: 'Pray for veteran missionaries who have served 20+ years in hardship fields, that God will grant them fresh stamina, joy, and physical health.',
    tags: ['Endurance', 'Marathon of Faith', 'Focus on Jesus', 'Overcoming']
  },
  {
    book: 'Galatians',
    chapter: 5,
    verses: '16-25',
    title: 'Walking in the Spirit: The Heavenly Harvest',
    theme: 'Flesh vs. Spirit & The Ninefold Fruit',
    otReading: 'Genesis 19 - 21',
    ntReading: 'Matthew 7',
    passageText: 'So I say, walk by the Spirit, and you will not gratify the desires of the flesh. For the flesh desires what is contrary to the Spirit, and the Spirit what is contrary to the flesh... But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law. Those who belong to Christ Jesus have crucified the flesh with its passions and desires. Since we live by the Spirit, let us keep in step with the Spirit.',
    keyVerse: 'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.',
    keyRef: 'Galatians 5:22-23',
    readingNotes: [
      'Paul describes the inner conflict between the fallen carnal nature and the Holy Spirit. Victory is achieved not through legalistic rules, but by "walking in the Spirit."',
      'Notice that the Spirit produces "fruit" (singular)—an organic ninefold manifestation of Christ’s own character woven into the believer’s daily conduct.',
      'To "keep in step with the Spirit" means marching to the rhythm of God’s promptings, listening to His still small voice, and instantly obeying His lead.'
    ],
    questions: [
      'Which aspect of the fruit of the Spirit is most evident in your life right now?',
      'Where is the flesh attempting to regain ground in your thoughts or reactions?',
      'How can you consciously pause and yield to the Spirit before responding in stressful moments?'
    ],
    prayer: 'Holy Spirit, take full control of my thoughts, words, and actions today. Crucify my fleshly inclinations. Cultivate in me the divine fruit of love, joy, peace, patience, kindness, and self-control. Let my life be a sweet aroma of Christ to everyone I meet. Amen.',
    globalFocus: 'Pray for unity and Spirit-filled love among missionary teams of diverse cultural backgrounds working together on pioneer fields.',
    tags: ['Fruit of the Spirit', 'Holy Spirit', 'Character', 'Sanctification']
  }
];

export function getDevotionalForDate(dateStr: string, edition: SUDevotionalEdition = 'Daily Guide'): SUDailyDevotional {
  // 1. Check curated explicit devotionals first
  const existing = SU_DAILY_DEVOTIONALS.find(d => d.date === dateStr && (!edition || d.edition === edition));
  if (existing) return existing;

  // Check matching by date only if edition not matched
  const dateMatch = SU_DAILY_DEVOTIONALS.find(d => d.date === dateStr);
  if (dateMatch) {
    return {
      ...dateMatch,
      edition: edition || dateMatch.edition,
      id: `su-${(edition || dateMatch.edition).toLowerCase().replace(/\s+/g, '-')}-${dateStr}`
    };
  }

  // 2. Generate deterministically for any date
  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);
  const dayOfYear = getDayOfYear(targetDate);
  const seedIndex = Math.abs((dayOfYear + y * 7) % DEVOTIONAL_CURRICULUM_SEEDS.length);
  const seed = DEVOTIONAL_CURRICULUM_SEEDS[seedIndex];

  // Tailor text slightly based on edition
  let editionTitle = seed.title;
  let editionNotes = [...seed.readingNotes];
  if (edition === 'Daily Power') {
    editionTitle = `[Youth & Frontline] ${seed.title}`;
    editionNotes[0] = `Frontline Action Point: ${editionNotes[0]}`;
  } else if (edition === 'Encounter with God') {
    editionTitle = `[Exposition] ${seed.title}`;
    editionNotes[0] = `Historical & Theological Context: ${editionNotes[0]}`;
  }

  return {
    id: `su-${edition.toLowerCase().replace(/\s+/g, '-')}-${dateStr}`,
    date: dateStr,
    edition,
    title: editionTitle,
    openingPrayer: seed.prayer,
    biblePassage: {
      book: seed.book,
      chapter: seed.chapter,
      verses: seed.verses,
      text: seed.passageText
    },
    keyVerse: {
      text: seed.keyVerse,
      reference: seed.keyRef
    },
    readingNotes: editionNotes,
    reflectionQuestions: [...seed.questions],
    prayerOfCommitment: seed.prayer,
    oneYearBibleReading: {
      morning: seed.otReading,
      evening: seed.ntReading
    },
    suGlobalPrayerFocus: seed.globalFocus,
    authorOrSource: `Scripture Union ${edition}`,
    tags: seed.tags
  };
}

export const SU_READING_PLANS_2026 = [
  {
    day: 267,
    date: '2026-09-24',
    passage: '1 Timothy 2:1-8',
    otReading: 'Isaiah 51 - 54',
    ntReading: '2 Corinthians 5',
    psalmOrProverb: 'Psalm 119:113-128',
    theme: 'Prevailing Global Intercession'
  },
  {
    day: 268,
    date: '2026-09-25',
    passage: 'Acts 4:23-31',
    otReading: 'Isaiah 55 - 58',
    ntReading: '2 Corinthians 6',
    psalmOrProverb: 'Psalm 119:129-144',
    theme: 'Kingdom Boldness & Power'
  },
  {
    day: 269,
    date: '2026-09-26',
    passage: 'John 7:37-39',
    otReading: 'Isaiah 59 - 62',
    ntReading: '2 Corinthians 7',
    psalmOrProverb: 'Psalm 119:145-160',
    theme: 'Streams of Living Water'
  },
  {
    day: 270,
    date: '2026-09-27',
    passage: 'Ephesians 6:10-20',
    otReading: 'Isaiah 63 - 66',
    ntReading: '2 Corinthians 8',
    psalmOrProverb: 'Psalm 119:161-176',
    theme: 'The Whole Armor of God'
  },
  {
    day: 271,
    date: '2026-09-28',
    passage: 'Romans 8:31-39',
    otReading: 'Jeremiah 1 - 3',
    ntReading: '2 Corinthians 9',
    psalmOrProverb: 'Psalm 120 - 121',
    theme: 'More Than Conquerors'
  },
  {
    day: 272,
    date: '2026-09-29',
    passage: 'Colossians 3:1-17',
    otReading: 'Jeremiah 4 - 6',
    ntReading: '2 Corinthians 10',
    psalmOrProverb: 'Psalm 122 - 123',
    theme: 'Set Your Minds on Things Above'
  },
  {
    day: 273,
    date: '2026-09-30',
    passage: '1 Peter 1:22-25',
    otReading: 'Jeremiah 7 - 9',
    ntReading: '2 Corinthians 11',
    psalmOrProverb: 'Psalm 124 - 125',
    theme: 'The Living & Enduring Word'
  },
  {
    day: 274,
    date: '2026-10-01',
    passage: 'Isaiah 40:27-31',
    otReading: 'Jeremiah 10 - 12',
    ntReading: '2 Corinthians 12',
    psalmOrProverb: 'Psalm 126 - 127',
    theme: 'Renewing Your Strength'
  },
  {
    day: 275,
    date: '2026-10-02',
    passage: 'Matthew 28:16-20',
    otReading: 'Jeremiah 13 - 15',
    ntReading: '2 Corinthians 13',
    psalmOrProverb: 'Psalm 128 - 129',
    theme: 'The Great Commission'
  }
];
