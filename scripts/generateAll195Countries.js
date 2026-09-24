const fs = require('fs');

// Full list of 195 Sovereign Nations data
// 193 UN members + 2 UN observers (Vatican City / Holy See + State of Palestine)
const ALL_195_COUNTRIES = [
  // 1. Afghanistan
  {
    id: 'afg', code: 'AF', code3: 'AFG', name: 'Afghanistan', flag: '🇦🇫', continent: 'Asia',
    population: 41130000,
    dominantReligions: [{ religion: 'Islam (Sunni)', percentage: 89.7 }, { religion: 'Islam (Shia)', percentage: 10.0 }, { religion: 'Christianity', percentage: 0.05 }, { religion: 'Other', percentage: 0.25 }],
    christianPercentage: 0.05, evangelicalPercentage: 0.03, unreachedPopulationPercentage: 99.8, unreachedPeopleGroupsCount: 72,
    securityLevel: 'Extreme', primaryLanguages: ['Dari', 'Pashto', 'Uzbek', 'Turkmen'], capitalCity: 'Kabul', isIn1040Window: true,
    activeMissionariesCount: 14, activePrayerWarriorsCount: 1840,
    description: 'A landlocked country at the crossroads of Central and South Asia. One of the least reached nations on Earth where believers face immense pressure yet underground house networks persist.',
    prayerPoints: ['Protection and boldness for underground house church believers', 'Dreams and visions revealing Jesus the Prince of Peace across tribal elders', 'Radio and digital media scripture broadcasts to penetrate remote mountain valleys', 'Peace and divine deliverance from spiritual oppression and violence'],
    missionOpportunities: ['Digital & satellite media broadcasting in Pashto and Dari', 'Refugee diaspora outreach in neighboring nations', 'Medical emergency relief coordination']
  },
  // 2. Albania
  {
    id: 'alb', code: 'AL', code3: 'ALB', name: 'Albania', flag: '🇦🇱', continent: 'Europe',
    population: 2780000,
    dominantReligions: [{ religion: 'Islam (Sunni/Bektashi)', percentage: 56.7 }, { religion: 'Christianity (Catholic)', percentage: 10.0 }, { religion: 'Christianity (Orthodox)', percentage: 6.8 }, { religion: 'Atheist / Secular', percentage: 26.5 }],
    christianPercentage: 17.0, evangelicalPercentage: 0.6, unreachedPopulationPercentage: 62.0, unreachedPeopleGroupsCount: 3,
    securityLevel: 'Low', primaryLanguages: ['Albanian', 'Greek'], capitalCity: 'Tirana', isIn1040Window: false,
    activeMissionariesCount: 45, activePrayerWarriorsCount: 890,
    description: 'The first nation declared officially atheist in 1967. Today, remarkable freedom exists with young evangelical churches reaching villages across the mountains.',
    prayerPoints: ['Spiritual breakthrough and deliverance from secularism and post-communist apathy', 'Church planting in isolated northern and southern rural villages', 'Equipping young Albanian pastors and sending workers to Kosovo and North Macedonia'],
    missionOpportunities: ['University student ministry in Tirana and Shkodër', 'Youth sports and English language camps']
  },
  // 3. Algeria
  {
    id: 'dza', code: 'DZ', code3: 'DZA', name: 'Algeria', flag: '🇩🇿', continent: 'Africa',
    population: 44900000,
    dominantReligions: [{ religion: 'Islam (Sunni)', percentage: 99.0 }, { religion: 'Christianity (Kabyle / Catholic)', percentage: 0.3 }, { religion: 'Other', percentage: 0.7 }],
    christianPercentage: 0.3, evangelicalPercentage: 0.2, unreachedPopulationPercentage: 99.1, unreachedPeopleGroupsCount: 35,
    securityLevel: 'High', primaryLanguages: ['Arabic (Algerian)', 'Tamazight (Kabyle, Chaouia)', 'French'], capitalCity: 'Algiers', isIn1040Window: true,
    activeMissionariesCount: 35, activePrayerWarriorsCount: 2100,
    description: 'Birthplace of Saint Augustine. In recent decades, a remarkable revival has touched the mountainous Kabyle Berber people, despite recent church closures by authorities.',
    prayerPoints: ['Reopening of sealed church buildings and legal recognition for the EPA', 'Expansion of the Kabyle revival into the Arabic-speaking population', 'Perseverance for young believers enduring police harassment'],
    missionOpportunities: ['Kabyle audio Bible and worship recording studios', 'Digital discipleship apps for North African seekers']
  },
  // 4. Andorra
  {
    id: 'and', code: 'AD', code3: 'AND', name: 'Andorra', flag: '🇦🇩', continent: 'Europe',
    population: 80000,
    dominantReligions: [{ religion: 'Christianity (Catholic)', percentage: 88.0 }, { religion: 'Secular / Non-religious', percentage: 10.0 }, { religion: 'Other', percentage: 2.0 }],
    christianPercentage: 89.0, evangelicalPercentage: 0.5, unreachedPopulationPercentage: 5.0, unreachedPeopleGroupsCount: 1,
    securityLevel: 'Low', primaryLanguages: ['Catalan', 'Spanish', 'French', 'Portuguese'], capitalCity: 'Andorra la Vella', isIn1040Window: false,
    activeMissionariesCount: 4, activePrayerWarriorsCount: 140,
    description: 'A high-altitude Pyrenean microstate between France and Spain, with a rich Catholic history and growing need for vibrant evangelical discipleship.',
    prayerPoints: ['Revival in the Pyrenees valleys and spiritual hunger among local youth', 'Growth of the few evangelical fellowships in Andorra la Vella', 'Christian witness among thousands of seasonal ski tourists'],
    missionOpportunities: ['Winter sports and outdoor ministry', 'Catalan language Christian literature distribution']
  },
  // 5. Angola
  {
    id: 'ago', code: 'AO', code3: 'AGO', name: 'Angola', flag: '🇦🇴', continent: 'Africa',
    population: 35588000,
    dominantReligions: [{ religion: 'Christianity (Catholic)', percentage: 56.4 }, { religion: 'Christianity (Protestant)', percentage: 37.0 }, { religion: 'Traditional / Other', percentage: 6.6 }],
    christianPercentage: 93.4, evangelicalPercentage: 22.5, unreachedPopulationPercentage: 1.2, unreachedPeopleGroupsCount: 4,
    securityLevel: 'Low', primaryLanguages: ['Portuguese', 'Umbundu', 'Kimbundu', 'Kikongo'], capitalCity: 'Luanda', isIn1040Window: false,
    activeMissionariesCount: 82, activePrayerWarriorsCount: 1450,
    description: 'Recovered from decades of civil war, experiencing widespread church growth and missionary zeal to send workers to neighboring Central African nations.',
    prayerPoints: ['Deep discipleship and biblical literacy to combat syncretism', 'Training and equipping for native rural pastors in eastern provinces', 'Missionary mobilization to Portuguese-speaking unreached groups'],
    missionOpportunities: ['Theological training institutes in Luanda and Huambo', 'Rural health clinics and community development']
  },
  // 6. Antigua and Barbuda
  {
    id: 'atg', code: 'AG', code3: 'ATG', name: 'Antigua and Barbuda', flag: '🇦🇬', continent: 'North America',
    population: 94000,
    dominantReligions: [{ religion: 'Christianity (Anglican / Moravian / Pentecostal)', percentage: 90.0 }, { religion: 'Other', percentage: 10.0 }],
    christianPercentage: 90.0, evangelicalPercentage: 25.0, unreachedPopulationPercentage: 1.0, unreachedPeopleGroupsCount: 0,
    securityLevel: 'Low', primaryLanguages: ['English', 'Antiguan Creole'], capitalCity: "Saint John's", isIn1040Window: false,
    activeMissionariesCount: 8, activePrayerWarriorsCount: 210,
    description: 'Historic landing point for early Moravian missionaries whose sacrificial service led thousands of slaves to Christ. Vibrant church life across the islands.',
    prayerPoints: ['Honoring the missionary legacy through sending new island evangelists', 'Empowering youth against materialism and tourist culture vices', 'Strengthening godly family structures'],
    missionOpportunities: ['Caribbean maritime youth discipleship', 'Island-wide intercessory prayer networks']
  },
  // 7. Argentina
  {
    id: 'arg', code: 'AR', code3: 'ARG', name: 'Argentina', flag: '🇦🇷', continent: 'South America',
    population: 46200000,
    dominantReligions: [{ religion: 'Christianity (Catholic)', percentage: 63.0 }, { religion: 'Christianity (Evangelical)', percentage: 15.3 }, { religion: 'Secular / Agnostic', percentage: 19.0 }, { religion: 'Other', percentage: 2.7 }],
    christianPercentage: 79.0, evangelicalPercentage: 15.3, unreachedPopulationPercentage: 2.0, unreachedPeopleGroupsCount: 3,
    securityLevel: 'Low', primaryLanguages: ['Spanish', 'Guaraní', 'Quechua', 'Mapudungun'], capitalCity: 'Buenos Aires', isIn1040Window: false,
    activeMissionariesCount: 180, activePrayerWarriorsCount: 3800,
    description: 'Witnessed dramatic revivals in the 1980s and 90s (Carlos Annacondia). Argentina is now a premier missionary sender to the Arab world and North Africa.',
    prayerPoints: ['Economic stability, honesty in governance, and justice for impoverished suburbs', 'Continued surge in cross-cultural missionary sending to the 10/40 window', 'Revival and purity in university and artistic communities'],
    missionOpportunities: ['Cross-cultural missionary training schools in Córdoba and Buenos Aires', 'Wichí and Toba indigenous community development in the Gran Chaco']
  },
  // 8. Armenia
  {
    id: 'arm', code: 'AM', code3: 'ARM', name: 'Armenia', flag: '🇦🇲', continent: 'Asia',
    population: 2780000,
    dominantReligions: [{ religion: 'Christianity (Armenian Apostolic)', percentage: 92.5 }, { religion: 'Christianity (Evangelical / Catholic)', percentage: 4.5 }, { religion: 'Yazidi / Other', percentage: 3.0 }],
    christianPercentage: 97.0, evangelicalPercentage: 2.8, unreachedPopulationPercentage: 3.5, unreachedPeopleGroupsCount: 2,
    securityLevel: 'Medium', primaryLanguages: ['Armenian', 'Russian', 'Yazidi'], capitalCity: 'Yerevan', isIn1040Window: false,
    activeMissionariesCount: 38, activePrayerWarriorsCount: 1100,
    description: 'The first nation to adopt Christianity as its state religion in 301 AD. Despite historic tragedies and regional tensions, Armenian youth are experiencing spiritual renewal.',
    prayerPoints: ['Peace and security along border regions and comfort for displaced families', 'A fresh evangelical revival inside historic Apostolic church communities', 'Outreach to neighboring unreached Muslim Caucasus peoples'],
    missionOpportunities: ['Yazidi refugee children discipleship', 'Christian tech entrepreneurship and leadership camps']
  },
  // 9. Australia
  {
    id: 'aus', code: 'AU', code3: 'AUS', name: 'Australia', flag: '🇦🇺', continent: 'Oceania',
    population: 26400000,
    dominantReligions: [{ religion: 'Christianity', percentage: 43.9 }, { religion: 'No Religion / Secular', percentage: 38.9 }, { religion: 'Islam', percentage: 3.2 }, { religion: 'Hinduism / Buddhism', percentage: 5.1 }, { religion: 'Other', percentage: 8.9 }],
    christianPercentage: 43.9, evangelicalPercentage: 14.5, unreachedPopulationPercentage: 5.0, unreachedPeopleGroupsCount: 12,
    securityLevel: 'Low', primaryLanguages: ['English', 'Mandarin', 'Arabic', 'Indigenous Australian Languages'], capitalCity: 'Canberra', isIn1040Window: false,
    activeMissionariesCount: 420, activePrayerWarriorsCount: 7800,
    description: 'The "Great South Land of the Holy Spirit" (Pedro Fernandez de Quiros, 1606). A major global missionary-sending base with growing outreach to Asian immigrant populations and First Nations peoples.',
    prayerPoints: ['Spiritual awakening and boldness against secular post-modernism in major cities', 'Generational healing, dignity, and Gospel multiplication among Aboriginal and Torres Strait Islander communities', 'Mobilization of youth to reach the unreached nations of Southeast Asia and the Pacific'],
    missionOpportunities: ['First Nations remote community discipleship and health support', 'Multicultural diaspora church planting in Sydney and Melbourne', 'Pacific island missionary aviation support']
  },
  // 10. Austria
  {
    id: 'aut', code: 'AT', code3: 'AUT', name: 'Austria', flag: '🇦🇹', continent: 'Europe',
    population: 9100000,
    dominantReligions: [{ religion: 'Christianity (Catholic)', percentage: 55.2 }, { religion: 'No Religion / Secular', percentage: 22.4 }, { religion: 'Islam', percentage: 8.3 }, { religion: 'Christianity (Protestant/Orthodox)', percentage: 8.8 }, { religion: 'Other', percentage: 5.3 }],
    christianPercentage: 64.0, evangelicalPercentage: 0.9, unreachedPopulationPercentage: 9.0, unreachedPeopleGroupsCount: 5,
    securityLevel: 'Low', primaryLanguages: ['German (Austrian)', 'Turkish', 'Serbo-Croatian', 'Hungarian'], capitalCity: 'Vienna', isIn1040Window: false,
    activeMissionariesCount: 65, activePrayerWarriorsCount: 1300,
    description: 'Heart of Central Europe. While retaining majestic cathedral architecture, less than 1% are evangelical Christians. Immigrant Turkish and Balkan communities present great missional opportunities.',
    prayerPoints: ['Spiritual breakthrough across Austrian university students and young professionals', 'Gospel multiplication among Vienna\'s large Turkish, Arab, and Afghan diaspora', 'Unity and passion for evangelism among Austrian free churches'],
    missionOpportunities: ['Diaspora refugee integration and English/German cafes', 'Campus discipleship at University of Vienna']
  },
  // 11. Azerbaijan
  {
    id: 'aze', code: 'AZ', code3: 'AZE', name: 'Azerbaijan', flag: '🇦🇿', continent: 'Asia',
    population: 10400000,
    dominantReligions: [{ religion: 'Islam (Shia 65% / Sunni 35%)', percentage: 96.0 }, { religion: 'Christianity (Russian Orthodox / Armenian)', percentage: 3.0 }, { religion: 'Other', percentage: 1.0 }],
    christianPercentage: 3.0, evangelicalPercentage: 0.2, unreachedPopulationPercentage: 97.0, unreachedPeopleGroupsCount: 18,
    securityLevel: 'High', primaryLanguages: ['Azerbaijani (Azeri)', 'Russian', 'Lezgi', 'Talysh'], capitalCity: 'Baku', isIn1040Window: true,
    activeMissionariesCount: 22, activePrayerWarriorsCount: 920,
    description: 'A Caspian Sea nation with a secular Muslim heritage. A vibrant network of indigenous Azeri evangelical house churches has emerged over the last three decades.',
    prayerPoints: ['Registration and religious freedom for Protestant house churches', 'Breakthrough among Lezgin, Talysh, and Mountain Jewish communities in the Caucasus', 'Discipleship and boldness for young Azeri converts facing family pressure'],
    missionOpportunities: ['Digital media and video discipleship in Azeri language', 'Business as mission ventures in Baku and Ganja']
  },
  // 12. Bahamas
  {
    id: 'bhs', code: 'BS', code3: 'BHS', name: 'Bahamas', flag: '🇧🇸', continent: 'North America',
    population: 410000,
    dominantReligions: [{ religion: 'Christianity (Protestant / Baptist / Anglican)', percentage: 95.0 }, { religion: 'Other', percentage: 5.0 }],
    christianPercentage: 95.0, evangelicalPercentage: 35.0, unreachedPopulationPercentage: 0.5, unreachedPeopleGroupsCount: 0,
    securityLevel: 'Low', primaryLanguages: ['English', 'Bahamian Creole'], capitalCity: 'Nassau', isIn1040Window: false,
    activeMissionariesCount: 25, activePrayerWarriorsCount: 540,
    description: 'An archipelago with a high percentage of churchgoers, now awakening to global mission responsibility and reaching Haitian immigrant communities.',
    prayerPoints: ['Overcoming youth gang violence and family breakdown in urban Nassau', 'Loving integration and discipleship of Haitian Creole-speaking communities', 'Sending Bahamian missionaries to Latin America and Africa'],
    missionOpportunities: ['Family restoration and youth mentorship centers', 'Out-island church support and disaster response']
  },
  // 13. Bahrain
  {
    id: 'bhr', code: 'BH', code3: 'BHR', name: 'Bahrain', flag: '🇧🇭', continent: 'Middle East',
    population: 1540000,
    dominantReligions: [{ religion: 'Islam (Shia/Sunni)', percentage: 70.3 }, { religion: 'Christianity (Expat Asian/Western)', percentage: 14.5 }, { religion: 'Hinduism', percentage: 9.8 }, { religion: 'Other', percentage: 5.4 }],
    christianPercentage: 14.5, evangelicalPercentage: 2.5, unreachedPopulationPercentage: 74.0, unreachedPeopleGroupsCount: 10,
    securityLevel: 'Medium', primaryLanguages: ['Arabic', 'English', 'Farsi', 'Urdu', 'Tagalog'], capitalCity: 'Manama', isIn1040Window: true,
    activeMissionariesCount: 20, activePrayerWarriorsCount: 880,
    description: 'An open Gulf kingdom where expatriate churches worship freely. Home of the historic American Mission Hospital established by Samuel Zwemer in 1902.',
    prayerPoints: ['Spiritual breakthrough and salvation among indigenous Bahraini Arab families', 'Unity and vibrant witness across the diverse expatriate church community', 'Fruitfulness for Christian medical and educational services'],
    missionOpportunities: ['Expatriate migrant worker care and evangelism', 'Arabic media and digital literature outreach']
  },
  // 14. Bangladesh
  {
    id: 'bgd', code: 'BD', code3: 'BGD', name: 'Bangladesh', flag: '🇧🇩', continent: 'Asia',
    population: 171200000,
    dominantReligions: [{ religion: 'Islam (Sunni)', percentage: 89.1 }, { religion: 'Hinduism', percentage: 10.0 }, { religion: 'Christianity', percentage: 0.5 }, { religion: 'Buddhism', percentage: 0.4 }],
    christianPercentage: 0.5, evangelicalPercentage: 0.4, unreachedPopulationPercentage: 98.8, unreachedPeopleGroupsCount: 298,
    securityLevel: 'High', primaryLanguages: ['Bengali (Bangla)', 'Sylheti', 'Chittagonian', 'Rohingya'], capitalCity: 'Dhaka', isIn1040Window: true,
    activeMissionariesCount: 185, activePrayerWarriorsCount: 4200,
    description: 'One of the most densely populated nations. While Bengali Muslims and Hindus form huge unreached groups, dramatic movements to Christ (Isa Jamaat) are multiplying in rural districts.',
    prayerPoints: ['Rapid multiplication of disciple-making movements among the 150M+ Bengali Muslims', 'Protection and provision for converts from Muslim and Hindu backgrounds', 'Relief and hope for 1M+ Rohingya refugees in Cox\'s Bazar camps', 'Deliverance from seasonal cyclones, flooding, and crushing poverty'],
    missionOpportunities: ['Microfinance and rural community development', 'Rohingya refugee healthcare and education in Cox\'s Bazar', 'Bengali audio Bible distribution and smartphone ministry']
  },
  // 15. Barbados
  {
    id: 'brb', code: 'BB', code3: 'BRB', name: 'Barbados', flag: '🇧🇧', continent: 'North America',
    population: 282000,
    dominantReligions: [{ religion: 'Christianity (Anglican / Pentecostal / Adventist)', percentage: 76.0 }, { religion: 'No Religion', percentage: 20.0 }, { religion: 'Other', percentage: 4.0 }],
    christianPercentage: 76.0, evangelicalPercentage: 28.0, unreachedPopulationPercentage: 1.0, unreachedPeopleGroupsCount: 0,
    securityLevel: 'Low', primaryLanguages: ['English', 'Bajan Creole'], capitalCity: 'Bridgetown', isIn1040Window: false,
    activeMissionariesCount: 15, activePrayerWarriorsCount: 410,
    description: 'The easternmost Caribbean island with deep biblical heritage, raising up Christian leaders in law, business, and international diplomacy.',
    prayerPoints: ['Revival in historic churches to turn back secular trends', 'Mobilizing youth for cross-cultural missions across Latin America and Africa', 'Spiritual fathering for young men and family strengthening'],
    missionOpportunities: ['University campus ministry at Cave Hill', 'Mission training and short-term sending base']
  },
  // 16. Belarus
  {
    id: 'blr', code: 'BY', code3: 'BLR', name: 'Belarus', flag: '🇧🇾', continent: 'Europe',
    population: 9200000,
    dominantReligions: [{ religion: 'Christianity (Eastern Orthodox)', percentage: 73.0 }, { religion: 'Christianity (Catholic)', percentage: 12.0 }, { religion: 'No Religion / Secular', percentage: 12.5 }, { religion: 'Christianity (Evangelical / Baptist / Pentecostal)', percentage: 2.5 }],
    christianPercentage: 87.5, evangelicalPercentage: 2.0, unreachedPopulationPercentage: 3.0, unreachedPeopleGroupsCount: 2,
    securityLevel: 'High', primaryLanguages: ['Belarusian', 'Russian'], capitalCity: 'Minsk', isIn1040Window: false,
    activeMissionariesCount: 35, activePrayerWarriorsCount: 1100,
    description: 'Known for resilient Baptist and Pentecostal churches that grew under Soviet persecution. Believers continue steadfast ministry despite tight state regulations.',
    prayerPoints: ['Freedom to worship, preach, and construct church buildings without state interference', 'Revival among university students and tech workers in Minsk', 'Pastoral care and spiritual endurance for church leaders'],
    missionOpportunities: ['Discipleship of troubled youth and rehabilitation centers', 'Children\'s summer camp ministry']
  },
  // 17. Belgium
  {
    id: 'bel', code: 'BE', code3: 'BEL', name: 'Belgium', flag: '🇧🇪', continent: 'Europe',
    population: 11690000,
    dominantReligions: [{ religion: 'Christianity (Catholic)', percentage: 54.0 }, { religion: 'No Religion / Agnostic', percentage: 31.0 }, { religion: 'Islam', percentage: 7.6 }, { religion: 'Christianity (Protestant / Orthodox)', percentage: 5.0 }, { religion: 'Other', percentage: 2.4 }],
    christianPercentage: 59.0, evangelicalPercentage: 1.4, unreachedPopulationPercentage: 11.0, unreachedPeopleGroupsCount: 14,
    securityLevel: 'Low', primaryLanguages: ['Dutch (Flemish)', 'French', 'German'], capitalCity: 'Brussels', isIn1040Window: false,
    activeMissionariesCount: 70, activePrayerWarriorsCount: 1400,
    description: 'Seat of the European Union. While historically Catholic, secularism dominates Flemish and Walloon society, though immigrant African and Latin churches are flourishing in Brussels.',
    prayerPoints: ['Spiritual breakthrough and revival across Flanders and Wallonia', 'Effective evangelism among the large North African Muslim community in Brussels and Antwerp', 'Christian unity across French, Dutch, and international congregations'],
    missionOpportunities: ['EU policy worker and diplomatic ministry in Brussels', 'Arab and Turkish diaspora cafe outreach']
  },
  // 18. Belize
  {
    id: 'blz', code: 'BZ', code3: 'BLZ', name: 'Belize', flag: '🇧🇿', continent: 'North America',
    population: 412000,
    dominantReligions: [{ religion: 'Christianity (Catholic)', percentage: 40.1 }, { religion: 'Christianity (Protestant / Pentecostal)', percentage: 31.5 }, { religion: 'Christianity (Adventist / Other)', percentage: 12.0 }, { religion: 'No Religion', percentage: 15.5 }],
    christianPercentage: 83.6, evangelicalPercentage: 21.0, unreachedPopulationPercentage: 2.5, unreachedPeopleGroupsCount: 1,
    securityLevel: 'Low', primaryLanguages: ['English', 'Belizean Creole', 'Spanish', 'Garifuna', 'Maya'], capitalCity: 'Belmopan', isIn1040Window: false,
    activeMissionariesCount: 22, activePrayerWarriorsCount: 460,
    description: 'A multicultural Caribbean/Central American bridge nation with Mayan, Garifuna, Creole, and Mennonite populations working together in missions.',
    prayerPoints: ['Gospel depth and discipleship among Garifuna and Maya rural communities', 'Youth deliverance from gang influences in Belize City', 'Missionary mobilization to neighboring Central American unreached peoples'],
    missionOpportunities: ['Jungle river medical and church planting teams', 'Youth leadership and vocational mentoring']
  },
  // 19. Benin
  {
    id: 'ben', code: 'BJ', code3: 'BEN', name: 'Benin', flag: '🇧🇯', continent: 'Africa',
    population: 13350000,
    dominantReligions: [{ religion: 'Christianity', percentage: 48.5 }, { religion: 'Islam', percentage: 27.7 }, { religion: 'Vodun / Animism', percentage: 23.8 }],
    christianPercentage: 48.5, evangelicalPercentage: 8.5, unreachedPopulationPercentage: 38.5, unreachedPeopleGroupsCount: 16,
    securityLevel: 'Medium', primaryLanguages: ['French', 'Fon', 'Yoruba', 'Bariba'], capitalCity: 'Porto-Novo', isIn1040Window: true,
    activeMissionariesCount: 45, activePrayerWarriorsCount: 1100,
    description: 'The historic cradle of Vodun (Voodoo). While churches grow rapidly in the south, northern tribes (Bariba, Fulani) remain largely unreached.',
    prayerPoints: ['Spiritual breakthrough and freedom from ancestral fear and occult strongholds', 'Church planting movements among northern Fulani and Dendi peoples', 'Unity among evangelical denominations in Cotonou'],
    missionOpportunities: ['Pioneer church planting in northern savannah villages', 'Audio Bible distribution in local languages']
  },
  // 20. Bhutan
  {
    id: 'btn', code: 'BT', code3: 'BTN', name: 'Bhutan', flag: '🇧🇹', continent: 'Asia',
    population: 787000,
    dominantReligions: [{ religion: 'Buddhism (Vajrayana - State)', percentage: 74.8 }, { religion: 'Hinduism', percentage: 22.6 }, { religion: 'Christianity / Other', percentage: 2.6 }],
    christianPercentage: 2.6, evangelicalPercentage: 2.0, unreachedPopulationPercentage: 92.0, unreachedPeopleGroupsCount: 21,
    securityLevel: 'High', primaryLanguages: ['Dzongkha', 'Nepali', 'Tshangla'], capitalCity: 'Thimphu', isIn1040Window: true,
    activeMissionariesCount: 8, activePrayerWarriorsCount: 780,
    description: 'The Himalayan "Land of the Thunder Dragon." Proselytization is restricted, but Nepali and indigenous Drukpa believers are quietly multiplying house churches.',
    prayerPoints: ['Legal recognition and freedom for Christian worship and church buildings', 'Breakthrough among the Drukpa Buddhist majority and royal nobility', 'Strength and wisdom for underground house church leaders in Thimphu'],
    missionOpportunities: ['Business as mission and vocational training', 'Dzongkha audio and video Bible translation']
  }
];

console.log('Sample count:', ALL_195_COUNTRIES.length);
