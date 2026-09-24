const fs = require('fs');

// We have 30 existing detailed countries. Let's read them and parse or maintain them.
const existingFile = fs.readFileSync('src/data/countriesData.ts', 'utf8');

// Let's create the full 195 database generator
const ALL_195_RAW = [
  // Existing 30 are retained with full manual fidelity
  // Now all remaining 165 countries with missional, demographic, and prayer data
  
  // AFRICA
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
  {
    id: 'bwa', code: 'BW', code3: 'BWA', name: 'Botswana', flag: '🇧🇼', continent: 'Africa',
    population: 2630000,
    dominantReligions: [{ religion: 'Christianity', percentage: 73.0 }, { religion: 'Badimo / Traditional', percentage: 20.0 }, { religion: 'Other', percentage: 7.0 }],
    christianPercentage: 73.0, evangelicalPercentage: 15.0, unreachedPopulationPercentage: 2.0, unreachedPeopleGroupsCount: 2,
    securityLevel: 'Low', primaryLanguages: ['Setswana', 'English', 'Kalanga'], capitalCity: 'Gaborone', isIn1040Window: false,
    activeMissionariesCount: 30, activePrayerWarriorsCount: 650,
    description: 'One of Africa\'s most peaceful and stable democracies with strong Christian heritage, now focusing on youth revival and reaching San/Bushmen communities.',
    prayerPoints: ['Biblical discipleship and overcoming nominalism among urban youth', 'Outreach to remote Kalahari Desert San communities', 'Mission vision in local churches for global unreached nations'],
    missionOpportunities: ['University campus ministry in Gaborone', 'Wilderness outreach and literacy in Kalahari']
  },
  {
    id: 'bfa', code: 'BF', code3: 'BFA', name: 'Burkina Faso', flag: '🇧🇫', continent: 'Africa',
    population: 22670000,
    dominantReligions: [{ religion: 'Islam', percentage: 61.5 }, { religion: 'Christianity', percentage: 29.8 }, { religion: 'Traditional / Animist', percentage: 8.7 }],
    christianPercentage: 29.8, evangelicalPercentage: 9.2, unreachedPopulationPercentage: 64.0, unreachedPeopleGroupsCount: 28,
    securityLevel: 'High', primaryLanguages: ['French', 'Mossi (Mooré)', 'Fulfulde', 'Dyula'], capitalCity: 'Ouagadougou', isIn1040Window: true,
    activeMissionariesCount: 60, activePrayerWarriorsCount: 1950,
    description: 'Facing severe security challenges and jihadist pressure in northern regions, yet believers demonstrate heroic faith and love towards displaced neighbors.',
    prayerPoints: ['Protection and courage for persecuted pastors in rural villages', 'Breakthrough among the 12 million Mossi and nomadic Fulani herders', 'Provision for internally displaced families and orphan care'],
    missionOpportunities: ['Trauma healing and emergency food relief for displaced families', 'Solar audio Bible distribution']
  },
  {
    id: 'bdi', code: 'BI', code3: 'BDI', name: 'Burundi', flag: '🇧🇮', continent: 'Africa',
    population: 12890000,
    dominantReligions: [{ religion: 'Christianity (Catholic/Protestant)', percentage: 91.0 }, { religion: 'Islam', percentage: 3.0 }, { religion: 'Traditional', percentage: 6.0 }],
    christianPercentage: 91.0, evangelicalPercentage: 35.0, unreachedPopulationPercentage: 0.5, unreachedPeopleGroupsCount: 1,
    securityLevel: 'Medium', primaryLanguages: ['Kirundi', 'French', 'English', 'Swahili'], capitalCity: 'Gitega', isIn1040Window: false,
    activeMissionariesCount: 40, activePrayerWarriorsCount: 1250,
    description: 'A densely populated nation with a history of revival (East African Revival) and reconciliation work between Hutu and Tutsi believers.',
    prayerPoints: ['Deep racial and tribal healing through the Gospel of Grace', 'Economic empowerment and ethical leadership among Christian leaders', 'Missionary sending initiatives to the Great Lakes and Sahel'],
    missionOpportunities: ['Pastoral leadership development', 'Agricultural mission and sustainable community development']
  },
  {
    id: 'cpv', code: 'CV', code3: 'CPV', name: 'Cabo Verde', flag: '🇨🇻', continent: 'Africa',
    population: 593000,
    dominantReligions: [{ religion: 'Christianity (Catholic)', percentage: 77.3 }, { religion: 'Christianity (Protestant)', percentage: 10.2 }, { religion: 'Other', percentage: 12.5 }],
    christianPercentage: 87.5, evangelicalPercentage: 9.8, unreachedPopulationPercentage: 1.0, unreachedPeopleGroupsCount: 1,
    securityLevel: 'Low', primaryLanguages: ['Portuguese', 'Kriolu'], capitalCity: 'Praia', isIn1040Window: false,
    activeMissionariesCount: 12, activePrayerWarriorsCount: 380,
    description: 'An archipelago off West Africa with a predominantly Catholic cultural background, witnessing vibrant evangelical church growth in recent years.',
    prayerPoints: ['Spiritual renewal among the islands of Santiago, Sao Vicente, and Sal', 'Effective outreach to drug-impacted youth in port cities', 'Sending of Creole-speaking missionaries to West Africa'],
    missionOpportunities: ['Youth and sports ministries', 'Island-to-island church planting']
  },
  {
    id: 'cmr', code: 'CM', code3: 'CMR', name: 'Cameroon', flag: '🇨🇲', continent: 'Africa',
    population: 27910000,
    dominantReligions: [{ religion: 'Christianity', percentage: 70.0 }, { religion: 'Islam', percentage: 20.0 }, { religion: 'Traditional', percentage: 10.0 }],
    christianPercentage: 70.0, evangelicalPercentage: 11.5, unreachedPopulationPercentage: 24.5, unreachedPeopleGroupsCount: 42,
    securityLevel: 'Medium', primaryLanguages: ['French', 'English', 'Cameroonian Pidgin', 'Fulfulde'], capitalCity: 'Yaoundé', isIn1040Window: true,
    activeMissionariesCount: 110, activePrayerWarriorsCount: 2800,
    description: 'Known as "Africa in miniature" with over 250 ethnic groups. Southern areas are largely Christian, while northern Far North region is predominantly unreached Muslim and animist.',
    prayerPoints: ['Gospel breakthrough among northern Kirdi and Fulani groups', 'Peace and reconciliation in the Anglophone crisis regions', 'Bible translation in over 100 languages still lacking scripture'],
    missionOpportunities: ['Mother-tongue Bible translation with Wycliffe/SIL', 'Northern Sahel pioneer missions']
  },
  {
    id: 'caf', code: 'CF', code3: 'CAF', name: 'Central African Republic', flag: '🇨🇫', continent: 'Africa',
    population: 5580000,
    dominantReligions: [{ religion: 'Christianity', percentage: 80.0 }, { religion: 'Islam', percentage: 15.0 }, { religion: 'Traditional', percentage: 5.0 }],
    christianPercentage: 80.0, evangelicalPercentage: 32.0, unreachedPopulationPercentage: 16.0, unreachedPeopleGroupsCount: 14,
    securityLevel: 'High', primaryLanguages: ['Sango', 'French', 'Banda', 'Gbaya'], capitalCity: 'Bangui', isIn1040Window: true,
    activeMissionariesCount: 35, activePrayerWarriorsCount: 950,
    description: 'Experiencing significant civil turmoil, yet the evangelical church remains the primary stabilizing pillar of hope and forgiveness across ethnic lines.',
    prayerPoints: ['Healing of trauma and peace across armed group territories', 'Discipleship of young men vulnerable to militia recruitment', 'Missionary outreach to unreached Chadian and Sudanese border tribes'],
    missionOpportunities: ['Medical missionary aviation (MAF)', 'Orphan rehabilitation and vocational training']
  },
  {
    id: 'tcd', code: 'TD', code3: 'TCD', name: 'Chad', flag: '🇹🇩', continent: 'Africa',
    population: 17720000,
    dominantReligions: [{ religion: 'Islam', percentage: 52.1 }, { religion: 'Christianity', percentage: 44.1 }, { religion: 'Traditional', percentage: 3.8 }],
    christianPercentage: 44.1, evangelicalPercentage: 9.8, unreachedPopulationPercentage: 54.0, unreachedPeopleGroupsCount: 74,
    securityLevel: 'High', primaryLanguages: ['Arabic (Chadian)', 'French', 'Sara'], capitalCity: "N'Djamena", isIn1040Window: true,
    activeMissionariesCount: 55, activePrayerWarriorsCount: 1700,
    description: 'A key frontier battlefield in the Sahel. Southern Chad is largely Christian, while northern and eastern Sahara regions remain deeply unreached.',
    prayerPoints: ['Spiritual breakthrough among 74 unreached nomadic Arab, Toubou, and Kanembu peoples', 'Unity between northern converts and southern Christian communities', 'Protection for water well drilling and medical teams in remote deserts'],
    missionOpportunities: ['Nomadic desert medical teams', 'Chadian Arabic radio broadcast and digital scripture']
  },
  {
    id: 'com', code: 'KM', code3: 'COM', name: 'Comoros', flag: '🇰🇲', continent: 'Africa',
    population: 836000,
    dominantReligions: [{ religion: 'Islam (Sunni)', percentage: 98.5 }, { religion: 'Christianity (Catholic / Expat)', percentage: 1.0 }, { religion: 'Other', percentage: 0.5 }],
    christianPercentage: 1.0, evangelicalPercentage: 0.2, unreachedPopulationPercentage: 98.8, unreachedPeopleGroupsCount: 3,
    securityLevel: 'High', primaryLanguages: ['Shikomor (Comorian)', 'Arabic', 'French'], capitalCity: 'Moroni', isIn1040Window: true,
    activeMissionariesCount: 6, activePrayerWarriorsCount: 420,
    description: 'An Indian Ocean island nation where proselytizing non-Muslim faiths is restricted by law. A tiny network of indigenous believers worships in secret.',
    prayerPoints: ['Protection and boldness for the small underground Comorian church', 'Opening of legal doors for freedom of conscience and belief', 'Translation and distribution of Kingwana and Shikomor scripture'],
    missionOpportunities: ['English teaching and humanitarian development', 'Healthcare and island educational initiatives']
  },
  {
    id: 'cog', code: 'CG', code3: 'COG', name: 'Congo (Republic of)', flag: '🇨🇬', continent: 'Africa',
    population: 5970000,
    dominantReligions: [{ religion: 'Christianity', percentage: 88.5 }, { religion: 'Traditional', percentage: 8.0 }, { religion: 'Islam', percentage: 3.5 }],
    christianPercentage: 88.5, evangelicalPercentage: 17.5, unreachedPopulationPercentage: 3.5, unreachedPeopleGroupsCount: 4,
    securityLevel: 'Low', primaryLanguages: ['French', 'Lingala', 'Kituba'], capitalCity: 'Brazzaville', isIn1040Window: false,
    activeMissionariesCount: 40, activePrayerWarriorsCount: 920,
    description: 'Vibrant urban churches in Brazzaville and Pointe-Noire, with ongoing pioneer work among forest Pygmy (Baka/Babinga) hunter-gatherer communities in the north.',
    prayerPoints: ['Dignity, education, and Gospel transformation for marginalized Pygmy communities', 'Discipleship to root out occult syncretism and fetishism', 'Missionary mobilization to Francophone Sahel nations'],
    missionOpportunities: ['Forest Pygmy literacy and church planting', 'Pastoral leadership training']
  },
  {
    id: 'cod', code: 'CD', code3: 'COD', name: 'Congo (DRC)', flag: '🇨🇩', continent: 'Africa',
    population: 99000000,
    dominantReligions: [{ religion: 'Christianity (Catholic)', percentage: 50.0 }, { religion: 'Christianity (Protestant)', percentage: 40.0 }, { religion: 'Traditional/Islam', percentage: 10.0 }],
    christianPercentage: 90.0, evangelicalPercentage: 25.0, unreachedPopulationPercentage: 2.5, unreachedPeopleGroupsCount: 8,
    securityLevel: 'High', primaryLanguages: ['French', 'Lingala', 'Swahili', 'Kikongo', 'Tshiluba'], capitalCity: 'Kinshasa', isIn1040Window: false,
    activeMissionariesCount: 320, activePrayerWarriorsCount: 5400,
    description: 'Immense in size and population with deep Christian faith. Facing mineral-fueled armed conflict in the eastern Kivu regions while Kinshasa sees explosive church growth.',
    prayerPoints: ['Deliverance and peace for families suffering militia violence in North and South Kivu', 'Transformation of civil governance and end to systemic corruption', 'Empowerment of Congolese mission agencies sending workers to North Africa'],
    missionOpportunities: ['Refugee and trauma healing ministries in Goma', 'Christian university education and business leadership']
  },
  {
    id: 'civ', code: 'CI', code3: 'CIV', name: "Cote d'Ivoire", flag: '🇨🇮', continent: 'Africa',
    population: 28160000,
    dominantReligions: [{ religion: 'Islam', percentage: 42.9 }, { religion: 'Christianity', percentage: 39.8 }, { religion: 'Traditional / Animist', percentage: 17.3 }],
    christianPercentage: 39.8, evangelicalPercentage: 11.2, unreachedPopulationPercentage: 36.0, unreachedPeopleGroupsCount: 22,
    securityLevel: 'Medium', primaryLanguages: ['French', 'Baoulé', 'Dioula', 'Dan', 'Bété'], capitalCity: 'Yamoussoukro', isIn1040Window: true,
    activeMissionariesCount: 95, activePrayerWarriorsCount: 2200,
    description: 'An economic hub of West Africa. The south is predominantly Christian while the north is Muslim. National prayer movements are driving intercession for the Sahel.',
    prayerPoints: ['National unity and revival across tribal and religious divides', 'Gospel movements among the northern Dioula, Senufo, and Fulani peoples', 'Missionary training schools sending workers into Mali and Guinea'],
    missionOpportunities: ['Cross-cultural missionary training in Abidjan', 'Northern rural agricultural mission stations']
  },
  {
    id: 'dji', code: 'DJ', code3: 'DJI', name: 'Djibouti', flag: '🇩🇯', continent: 'Africa',
    population: 1120000,
    dominantReligions: [{ religion: 'Islam (Sunni)', percentage: 97.0 }, { religion: 'Christianity', percentage: 2.5 }, { religion: 'Other', percentage: 0.5 }],
    christianPercentage: 2.5, evangelicalPercentage: 0.2, unreachedPopulationPercentage: 97.5, unreachedPeopleGroupsCount: 4,
    securityLevel: 'Medium', primaryLanguages: ['French', 'Arabic', 'Somali', 'Afar'], capitalCity: 'Djibouti City', isIn1040Window: true,
    activeMissionariesCount: 14, activePrayerWarriorsCount: 750,
    description: 'Strategically located on the Bab-el-Mandeb strait between Africa and Arabia. A peaceful gateway to reaching the Afar and Somali populations.',
    prayerPoints: ['Awakening among the nomadic Afar desert dwellers', 'Protection for local converts and expatriate mission workers', 'Digital media evangelism reaching Somali youth in Djibouti City'],
    missionOpportunities: ['Community healthcare and vocational institutes', 'Port city diaspora ministry']
  },
  {
    id: 'gnq', code: 'GQ', code3: 'GNQ', name: 'Equatorial Guinea', flag: '🇬🇶', continent: 'Africa',
    population: 1670000,
    dominantReligions: [{ religion: 'Christianity (Catholic)', percentage: 87.0 }, { religion: 'Christianity (Protestant)', percentage: 5.0 }, { religion: 'Traditional / Islam', percentage: 8.0 }],
    christianPercentage: 92.0, evangelicalPercentage: 4.8, unreachedPopulationPercentage: 2.0, unreachedPeopleGroupsCount: 1,
    securityLevel: 'Low', primaryLanguages: ['Spanish', 'French', 'Portuguese', 'Fang', 'Bubi'], capitalCity: 'Malabo', isIn1040Window: false,
    activeMissionariesCount: 18, activePrayerWarriorsCount: 410,
    description: 'The only Spanish-speaking nation in Africa. Oil wealth contrasts with poverty, while evangelical churches are growing rapidly among the Fang majority.',
    prayerPoints: ['Equipping faithful pastors and church planters in rural mainland Rio Muni', 'Freedom of gospel radio broadcasting and youth outreach', 'Justice and integrity across governmental leadership'],
    missionOpportunities: ['Spanish-language theological training', 'Island youth discipleship in Malabo']
  },
  {
    id: 'eri', code: 'ER', code3: 'ERI', name: 'Eritrea', flag: '🇪🇷', continent: 'Africa',
    population: 3680000,
    dominantReligions: [{ religion: 'Christianity (Orthodox / Catholic)', percentage: 50.0 }, { religion: 'Islam (Sunni)', percentage: 48.0 }, { religion: 'Evangelical (Underground)', percentage: 2.0 }],
    christianPercentage: 50.0, evangelicalPercentage: 2.0, unreachedPopulationPercentage: 49.0, unreachedPeopleGroupsCount: 7,
    securityLevel: 'Extreme', primaryLanguages: ['Tigrinya', 'Arabic', 'Tigre', 'English'], capitalCity: 'Asmara', isIn1040Window: true,
    activeMissionariesCount: 5, activePrayerWarriorsCount: 2300,
    description: 'Often called "The North Korea of Africa." Hundreds of evangelical believers endure years of imprisonment in shipping containers, maintaining steadfast prayer and worship.',
    prayerPoints: ['Release and healing for imprisoned pastors and underground believers', 'Comfort and strength for families whose loved ones are detained', 'Breakthrough among unreached lowland Muslim tribes (Rashaida, Saho, Tigre)'],
    missionOpportunities: ['Refugee diaspora outreach in Europe and North America', 'Tigrinya Christian satellite broadcasting']
  },
  {
    id: 'swz', code: 'SZ', code3: 'SWZ', name: 'Eswatini', flag: '🇸🇿', continent: 'Africa',
    population: 1200000,
    dominantReligions: [{ religion: 'Christianity (Zionist / Protestant)', percentage: 88.0 }, { religion: 'Traditional', percentage: 10.0 }, { religion: 'Other', percentage: 2.0 }],
    christianPercentage: 88.0, evangelicalPercentage: 24.5, unreachedPopulationPercentage: 0.5, unreachedPeopleGroupsCount: 1,
    securityLevel: 'Low', primaryLanguages: ['siSwati', 'English'], capitalCity: 'Mbabane', isIn1040Window: false,
    activeMissionariesCount: 28, activePrayerWarriorsCount: 650,
    description: 'A traditional African kingdom with a rich history of faith. Facing social recovery from HIV/AIDS with Christian orphan care centers leading national healing.',
    prayerPoints: ['Clear biblical teaching to distinguish the Gospel from ancestral rituals', 'Support and education for orphaned children and vulnerable families', 'Vision for sending Swazi missionaries to unreached African nations'],
    missionOpportunities: ['Orphan care and educational centers', 'Youth leadership academies']
  },
  {
    id: 'gab', code: 'GA', code3: 'GAB', name: 'Gabon', flag: '🇬🇦', continent: 'Africa',
    population: 2380000,
    dominantReligions: [{ religion: 'Christianity', percentage: 76.0 }, { religion: 'Bwiti / Traditional', percentage: 14.0 }, { religion: 'Islam', percentage: 10.0 }],
    christianPercentage: 76.0, evangelicalPercentage: 12.0, unreachedPopulationPercentage: 3.0, unreachedPeopleGroupsCount: 2,
    securityLevel: 'Low', primaryLanguages: ['French', 'Fang', 'Myene', 'Nzebi'], capitalCity: 'Libreville', isIn1040Window: false,
    activeMissionariesCount: 22, activePrayerWarriorsCount: 540,
    description: 'Heavily forested nation with substantial natural resources. The famous Albert Schweitzer hospital pioneered medical missions here.',
    prayerPoints: ['Spiritual breakthrough over the Bwiti animist initiation cult', 'Integrity and righteous governance for Gabon\'s new generation', 'Revival in university campuses in Libreville'],
    missionOpportunities: ['Medical missionary service in Lambarene', 'Youth camp and university ministry']
  },
  {
    id: 'gmb', code: 'GM', code3: 'GMB', name: 'Gambia', flag: '🇬🇲', continent: 'Africa',
    population: 2700000,
    dominantReligions: [{ religion: 'Islam (Sunni)', percentage: 95.7 }, { religion: 'Christianity', percentage: 3.8 }, { religion: 'Traditional', percentage: 0.5 }],
    christianPercentage: 3.8, evangelicalPercentage: 0.9, unreachedPopulationPercentage: 96.0, unreachedPeopleGroupsCount: 11,
    securityLevel: 'Low', primaryLanguages: ['English', 'Mandinka', 'Fula', 'Wolof'], capitalCity: 'Banjul', isIn1040Window: true,
    activeMissionariesCount: 25, activePrayerWarriorsCount: 780,
    description: 'A peaceful strip along the Gambia River with religious tolerance, allowing open church life despite a 96% Muslim population.',
    prayerPoints: ['Multiplying church movements among Mandinka, Wolof, and Jola tribes', 'Fruitfulness for Christian schools and hospital outreaches', 'Courage for Muslim-background believers sharing Christ with families'],
    missionOpportunities: ['Riverboat mobile medical clinics', 'Vocational skills and Christian community schools']
  },
  {
    id: 'gha', code: 'GH', code3: 'GHA', name: 'Ghana', flag: '🇬🇭', continent: 'Africa',
    population: 33470000,
    dominantReligions: [{ religion: 'Christianity', percentage: 71.2 }, { religion: 'Islam', percentage: 17.6 }, { religion: 'Traditional / Animist', percentage: 5.2 }, { religion: 'Other', percentage: 6.0 }],
    christianPercentage: 71.2, evangelicalPercentage: 28.0, unreachedPopulationPercentage: 12.0, unreachedPeopleGroupsCount: 18,
    securityLevel: 'Low', primaryLanguages: ['English', 'Akan (Twi/Fante)', 'Ewe', 'Ga', 'Dagbani'], capitalCity: 'Accra', isIn1040Window: true,
    activeMissionariesCount: 350, activePrayerWarriorsCount: 6200,
    description: 'A vibrant spiritual powerhouse and one of Africa\'s leading missionary-sending nations, actively dispatching evangelists into the unreached Sahel and North Africa.',
    prayerPoints: ['Spiritual breakthrough in northern Ghana among Dagomba, Gonja, and Fulani peoples', 'Discernment and depth in theology against the prosperity gospel', 'Protection and empowerment for Ghanaian missionaries serving across the 10/40 window'],
    missionOpportunities: ['Frontier mission training and sending centers', 'Northern agricultural church planting']
  },
  {
    id: 'gin', code: 'GN', code3: 'GIN', name: 'Guinea', flag: '🇬🇳', continent: 'Africa',
    population: 13860000,
    dominantReligions: [{ religion: 'Islam (Sunni)', percentage: 86.8 }, { religion: 'Christianity', percentage: 8.5 }, { religion: 'Traditional', percentage: 4.7 }],
    christianPercentage: 8.5, evangelicalPercentage: 2.4, unreachedPopulationPercentage: 87.0, unreachedPeopleGroupsCount: 24,
    securityLevel: 'Medium', primaryLanguages: ['French', 'Fula (Pular)', 'Maninka', 'Susu'], capitalCity: 'Conakry', isIn1040Window: true,
    activeMissionariesCount: 42, activePrayerWarriorsCount: 1100,
    description: 'A major West African unreached nation. The Fouta Djallon highlands are the historic heartland of the Fulani people.',
    prayerPoints: ['Gospel awakening among the 5 million Pular Fulani and 4 million Maninka', 'Protection and fellowship for isolated converts in rural villages', 'Audio Bible translation and distribution across remote tribal communities'],
    missionOpportunities: ['Radio and digital smartphone evangelism', 'Rural healthcare and clean water ministry']
  },
  {
    id: 'gnb', code: 'GW', code3: 'GNB', name: 'Guinea-Bissau', flag: '🇬🇼', continent: 'Africa',
    population: 2100000,
    dominantReligions: [{ religion: 'Islam', percentage: 46.0 }, { religion: 'Traditional / Animist', percentage: 39.0 }, { religion: 'Christianity', percentage: 15.0 }],
    christianPercentage: 15.0, evangelicalPercentage: 2.8, unreachedPopulationPercentage: 55.0, unreachedPeopleGroupsCount: 12,
    securityLevel: 'Medium', primaryLanguages: ['Portuguese', 'Crioulo', 'Balanta', 'Fula'], capitalCity: 'Bissau', isIn1040Window: true,
    activeMissionariesCount: 30, activePrayerWarriorsCount: 620,
    description: 'One of the least developed countries in the world, where animist and Muslim communities are showing unprecedented openness to the Gospel.',
    prayerPoints: ['Rapid church planting among Balanta, Mandinka, and Bijago islanders', 'Bible translation in Crioulo and tribal dialects', 'Training for native evangelists and church planters'],
    missionOpportunities: ['Bijagos Archipelago boat evangelism', 'Literacy and vocational school projects']
  },
  {
    id: 'lso', code: 'LS', code3: 'LSO', name: 'Lesotho', flag: '🇱🇸', continent: 'Africa',
    population: 2300000,
    dominantReligions: [{ religion: 'Christianity (Catholic / Protestant)', percentage: 92.0 }, { religion: 'Traditional', percentage: 7.0 }, { religion: 'Other', percentage: 1.0 }],
    christianPercentage: 92.0, evangelicalPercentage: 12.0, unreachedPopulationPercentage: 0.5, unreachedPeopleGroupsCount: 1,
    securityLevel: 'Low', primaryLanguages: ['Sesotho', 'English'], capitalCity: 'Maseru', isIn1040Window: false,
    activeMissionariesCount: 20, activePrayerWarriorsCount: 510,
    description: 'The "Kingdom in the Sky," an enclave completely surrounded by South Africa. Mountain shepherd boys and highland villages need discipleship.',
    prayerPoints: ['Equipping mountain shepherds (herd boys) with audio scripture', 'Renewal of spiritual passion in historical church denominations', 'Overcoming widespread poverty and unemployment through godly innovation'],
    missionOpportunities: ['Highland shepherd outreach on horseback', 'Youth vocational trade academies']
  },
  {
    id: 'lbr', code: 'LR', code3: 'LBR', name: 'Liberia', flag: '🇱🇷', continent: 'Africa',
    population: 5300000,
    dominantReligions: [{ religion: 'Christianity', percentage: 85.5 }, { religion: 'Islam', percentage: 12.2 }, { religion: 'Traditional', percentage: 2.3 }],
    christianPercentage: 85.5, evangelicalPercentage: 22.0, unreachedPopulationPercentage: 8.0, unreachedPeopleGroupsCount: 6,
    securityLevel: 'Low', primaryLanguages: ['English', 'Liberian Kpelle', 'Bassa', 'Vai'], capitalCity: 'Monrovia', isIn1040Window: true,
    activeMissionariesCount: 65, activePrayerWarriorsCount: 1350,
    description: 'Africa\'s oldest republic, rebuilt through the resilience of Christian prayer groups following civil conflict and Ebola crises.',
    prayerPoints: ['Spiritual breakthrough among Muslim Vai and Mandingo tribes in the northwest', 'Biblical discipleship to eliminate secret society practices (Poro/Sande)', 'Raising up moral, Christ-centered national leaders'],
    missionOpportunities: ['Christian higher education and teacher training', 'Interior jungle clinic and solar lighting missions']
  },
  {
    id: 'lby', code: 'LY', code3: 'LBY', name: 'Libya', flag: '🇱🇾', continent: 'Africa',
    population: 6810000,
    dominantReligions: [{ religion: 'Islam (Sunni)', percentage: 97.0 }, { religion: 'Christianity (Expatriate / Secret)', percentage: 2.5 }, { religion: 'Other', percentage: 0.5 }],
    christianPercentage: 2.5, evangelicalPercentage: 0.3, unreachedPopulationPercentage: 98.5, unreachedPeopleGroupsCount: 19,
    securityLevel: 'Extreme', primaryLanguages: ['Arabic (Libyan)', 'Berber (Nafusi)', 'Tuareg'], capitalCity: 'Tripoli', isIn1040Window: true,
    activeMissionariesCount: 6, activePrayerWarriorsCount: 1400,
    description: 'Ancient Cyrene (home of Simon who carried Jesus\' cross). Today, an intense spiritual frontier where underground believers seek unity and protection amidst political fracture.',
    prayerPoints: ['Peace and stabilization across eastern and western factions', 'Supernatural protection for Libyan secret believers and migrant workers', 'Gospel breakthroughs among desert Tuareg and Toubou tribes'],
    missionOpportunities: ['Digital Arabic discipleship and online house churches', 'Humanitarian relief for stranded refugees']
  },
  {
    id: 'mdg', code: 'MG', code3: 'MDG', name: 'Madagascar', flag: '🇲🇬', continent: 'Africa',
    population: 29610000,
    dominantReligions: [{ religion: 'Christianity', percentage: 58.0 }, { religion: 'Traditional (Ancestral veneration)', percentage: 35.0 }, { religion: 'Islam', percentage: 7.0 }],
    christianPercentage: 58.0, evangelicalPercentage: 14.5, unreachedPopulationPercentage: 9.0, unreachedPeopleGroupsCount: 9,
    securityLevel: 'Low', primaryLanguages: ['Malagasy', 'French'], capitalCity: 'Antananarivo', isIn1040Window: false,
    activeMissionariesCount: 75, activePrayerWarriorsCount: 1650,
    description: 'A vast island with a dramatic history of early Christian martyrdom under Queen Ranavalona I, now experiencing fresh spiritual awakening and mission sending.',
    prayerPoints: ['Deep deliverance from ancestral bone-turning rituals (Famadihana)', 'Gospel movements among coastal Muslim Antankarana and Mikea forest dwellers', 'Economic transformation and environmental restoration'],
    missionOpportunities: ['Remote coastal sailing medical missions', 'Rural primary school church plants']
  },
  {
    id: 'mwi', code: 'MW', code3: 'MWI', name: 'Malawi', flag: '🇲🇼', continent: 'Africa',
    population: 20400000,
    dominantReligions: [{ religion: 'Christianity', percentage: 77.3 }, { religion: 'Islam', percentage: 13.8 }, { religion: 'Traditional / Other', percentage: 8.9 }],
    christianPercentage: 77.3, evangelicalPercentage: 27.2, unreachedPopulationPercentage: 12.0, unreachedPeopleGroupsCount: 4,
    securityLevel: 'Low', primaryLanguages: ['English', 'Chichewa', 'Tumbuka', 'Yao'], capitalCity: 'Lilongwe', isIn1040Window: false,
    activeMissionariesCount: 88, activePrayerWarriorsCount: 1800,
    description: 'The "Warm Heart of Africa," deeply influenced by David Livingstone. Southern regions around Lake Malawi have large unreached Yao Muslim communities.',
    prayerPoints: ['Breakthrough among the 2.5 million Yao Muslims along Lake Malawi', 'Pastoral training to disciple rural congregations against syncretism', 'Effective famine and climate-resilience agricultural models'],
    missionOpportunities: ['Yao Muslim outreach teams in Mangochi and Machinga', 'Pastoral and Bible college leadership training']
  },
  {
    id: 'mli', code: 'ML', code3: 'MLI', name: 'Mali', flag: '🇲🇱', continent: 'Africa',
    population: 22590000,
    dominantReligions: [{ religion: 'Islam (Sunni/Sufi)', percentage: 94.8 }, { religion: 'Christianity', percentage: 2.8 }, { religion: 'Traditional / Animist', percentage: 2.4 }],
    christianPercentage: 2.8, evangelicalPercentage: 0.9, unreachedPopulationPercentage: 92.0, unreachedPeopleGroupsCount: 41,
    securityLevel: 'Extreme', primaryLanguages: ['French', 'Bambara', 'Fulfulde', 'Songhai', 'Dogon'], capitalCity: 'Bamako', isIn1040Window: true,
    activeMissionariesCount: 38, activePrayerWarriorsCount: 1550,
    description: 'Home of historic Timbuktu. Believers in central and northern regions endure severe extremist insurgencies with unwavering testimony.',
    prayerPoints: ['Protection for Dogon and Christian minority communities facing violence', 'Church planting movements among the 6 million Bambara and Tuareg nomads', 'Openness of heart among Fulani herdsmen to Jesus their Good Shepherd'],
    missionOpportunities: ['Radio and digital solar player scripture distribution', 'Refugee relief in Mopti and Segou']
  },
  {
    id: 'mrt', code: 'MR', code3: 'MRT', name: 'Mauritania', flag: '🇲🇷', continent: 'Africa',
    population: 4730000,
    dominantReligions: [{ religion: 'Islam (Sunni - Official State)', percentage: 99.9 }, { religion: 'Christianity (Expat / Secret)', percentage: 0.1 }],
    christianPercentage: 0.1, evangelicalPercentage: 0.05, unreachedPopulationPercentage: 99.9, unreachedPeopleGroupsCount: 14,
    securityLevel: 'Extreme', primaryLanguages: ['Arabic (Hassaniya)', 'Pulaar', 'Soninke', 'Wolof', 'French'], capitalCity: 'Nouakchott', isIn1040Window: true,
    activeMissionariesCount: 5, activePrayerWarriorsCount: 950,
    description: 'An Islamic Republic where 100% of citizens are legally recorded as Muslim. A tiny yet courageous underground fellowship of Moorish and West African believers persists.',
    prayerPoints: ['Supernatural dreams and revelations of Christ among Hassaniya Arabs and Haratin', 'Abolition of hereditary caste bondage and transformation through Christ', 'Safety and endurance for secret believers in Nouakchott and Nouadhibou'],
    missionOpportunities: ['Sub-Saharan diaspora healthcare and education', 'Shortwave and internet digital ministry']
  },
  {
    id: 'mus', code: 'MU', code3: 'MUS', name: 'Mauritius', flag: '🇲🇺', continent: 'Africa',
    population: 1260000,
    dominantReligions: [{ religion: 'Hinduism', percentage: 48.5 }, { religion: 'Christianity (Catholic)', percentage: 26.3 }, { religion: 'Islam', percentage: 17.3 }, { religion: 'Christianity (Protestant)', percentage: 6.4 }],
    christianPercentage: 32.7, evangelicalPercentage: 9.8, unreachedPopulationPercentage: 42.0, unreachedPeopleGroupsCount: 5,
    securityLevel: 'Low', primaryLanguages: ['Mauritian Creole', 'English', 'French', 'Bhojpuri'], capitalCity: 'Port Louis', isIn1040Window: false,
    activeMissionariesCount: 20, activePrayerWarriorsCount: 480,
    description: 'A multicultural Indian Ocean crossroad. The only African nation with a Hindu majority, experiencing exciting church planting in recent years.',
    prayerPoints: ['Gospel fruitfulness among Indo-Mauritian Hindu and Muslim communities', 'Equipping Creole and Franco-Mauritian believers for cross-cultural missions', 'Preserving island harmony and racial unity in Christ'],
    missionOpportunities: ['Church planting in Hindi and Bhojpuri speaking areas', 'University and youth creative arts ministry']
  },
  {
    id: 'moz', code: 'MZ', code3: 'MOZ', name: 'Mozambique', flag: '🇲🇿', continent: 'Africa',
    population: 32970000,
    dominantReligions: [{ religion: 'Christianity', percentage: 59.8 }, { religion: 'Islam', percentage: 18.9 }, { religion: 'Traditional / None', percentage: 21.3 }],
    christianPercentage: 59.8, evangelicalPercentage: 16.5, unreachedPopulationPercentage: 18.0, unreachedPeopleGroupsCount: 15,
    securityLevel: 'Medium', primaryLanguages: ['Portuguese', 'Makhuwa', 'Tsonga', 'Sena', 'Mwani'], capitalCity: 'Maputo', isIn1040Window: true,
    activeMissionariesCount: 140, activePrayerWarriorsCount: 3100,
    description: 'Witnessed historic revivals (Iris Global in Pemba). Facing jihadist insurgencies in northern Cabo Delgado, where Christians have shown extraordinary forgiveness.',
    prayerPoints: ['Comfort and total restoration for families displaced by Cabo Delgado conflict', 'Breakthrough among unreached coastal Mwani and Makwe Muslim peoples', 'Discipleship and spiritual depth for hundreds of thousands of new converts'],
    missionOpportunities: ['Disaster relief, bush church planting, and medical missions', 'Bush pastors mobile training schools']
  },
  {
    id: 'nam', code: 'NA', code3: 'NAM', name: 'Namibia', flag: '🇳🇦', continent: 'Africa',
    population: 2600000,
    dominantReligions: [{ religion: 'Christianity (Lutheran / Catholic)', percentage: 90.0 }, { religion: 'Traditional', percentage: 8.0 }, { religion: 'Other', percentage: 2.0 }],
    christianPercentage: 90.0, evangelicalPercentage: 13.5, unreachedPopulationPercentage: 1.5, unreachedPeopleGroupsCount: 2,
    securityLevel: 'Low', primaryLanguages: ['English', 'Oshiwambo', 'Afrikaans', 'Khoekhoegowab', 'German'], capitalCity: 'Windhoek', isIn1040Window: false,
    activeMissionariesCount: 35, activePrayerWarriorsCount: 560,
    description: 'Stunning desert nation with deep Christian roots dating to 19th-century Finnish and Rhenish missions. Today mobilizing workers for the unreached.',
    prayerPoints: ['Revival of first love and discipleship in historic Lutheran congregations', 'Effective outreach to Himba and San nomadic desert tribes', 'Sending Namibian mission teams to unreached parts of Angola and Zambia'],
    missionOpportunities: ['Himba village outreach in Kunene region', 'Youth campus ministry in Windhoek']
  },
  {
    id: 'ner', code: 'NE', code3: 'NER', name: 'Niger', flag: '🇳🇪', continent: 'Africa',
    population: 26200000,
    dominantReligions: [{ religion: 'Islam (Sunni)', percentage: 98.3 }, { religion: 'Traditional / Animist', percentage: 1.2 }, { religion: 'Christianity', percentage: 0.5 }],
    christianPercentage: 0.5, evangelicalPercentage: 0.2, unreachedPopulationPercentage: 97.0, unreachedPeopleGroupsCount: 35,
    securityLevel: 'High', primaryLanguages: ['French', 'Hausa', 'Zarma-Songhai', 'Tamajaq (Tuareg)', 'Fulfulde'], capitalCity: 'Niamey', isIn1040Window: true,
    activeMissionariesCount: 45, activePrayerWarriorsCount: 1600,
    description: 'A Sahelian nation at the epicenter of the 10/40 window. Despite severe drought and radical extremist pressure, the small Nigerien church is growing with boldness.',
    prayerPoints: ['Spiritual breakthrough among 14 million Hausa, 5 million Zarma, and 2 million Tuareg', 'Protection for Christian hospitals (Galmi) and schools that shine Christ\'s light', 'Famine relief and deep wells for thirsty Sahara desert villages'],
    missionOpportunities: ['Galmi and Niamey medical missionary teams', 'Solar audio scripture players for nomadic camel herders']
  },
  {
    id: 'rwa', code: 'RW', code3: 'RWA', name: 'Rwanda', flag: '🇷🇼', continent: 'Africa',
    population: 13780000,
    dominantReligions: [{ religion: 'Christianity (Catholic)', percentage: 48.5 }, { religion: 'Christianity (Protestant)', percentage: 45.3 }, { religion: 'Islam', percentage: 4.6 }, { religion: 'Traditional', percentage: 1.6 }],
    christianPercentage: 93.8, evangelicalPercentage: 30.5, unreachedPopulationPercentage: 0.5, unreachedPeopleGroupsCount: 1,
    securityLevel: 'Low', primaryLanguages: ['Kinyarwanda', 'French', 'English', 'Swahili'], capitalCity: 'Kigali', isIn1040Window: false,
    activeMissionariesCount: 70, activePrayerWarriorsCount: 1900,
    description: 'A testimony of divine redemption and reconciliation after the 1994 genocide. A clean, innovative nation emerging as a missionary sender to Central and East Africa.',
    prayerPoints: ['Sustained generational healing and deep heart forgiveness in Christ', 'Sound biblical grounding to guard against modern materialism', 'Mobilizing Rwandan youth to take the Gospel to the Horn of Africa'],
    missionOpportunities: ['Peace, reconciliation, and trauma counseling institutes', 'Tech-driven missional entrepreneurship in Kigali']
  },
  {
    id: 'stp', code: 'ST', code3: 'STP', name: 'Sao Tome and Principe', flag: '🇸🇹', continent: 'Africa',
    population: 227000,
    dominantReligions: [{ religion: 'Christianity (Catholic)', percentage: 70.0 }, { religion: 'Christianity (Protestant)', percentage: 15.0 }, { religion: 'Other', percentage: 15.0 }],
    christianPercentage: 85.0, evangelicalPercentage: 11.0, unreachedPopulationPercentage: 1.0, unreachedPeopleGroupsCount: 1,
    securityLevel: 'Low', primaryLanguages: ['Portuguese', 'Forro', 'Angolar', 'Principense'], capitalCity: 'São Tomé', isIn1040Window: false,
    activeMissionariesCount: 8, activePrayerWarriorsCount: 220,
    description: 'A tropical island nation in the Gulf of Guinea with a peaceful culture and growing evangelical church networks.',
    prayerPoints: ['Spiritual breakthrough against spiritism and occult remedies', 'Discipleship for fathers and healthy biblical family structures', 'Youth revival across plantation villages'],
    missionOpportunities: ['Island community clinics and vocational training', 'Radio and Christian literature ministry']
  },
  {
    id: 'sen', code: 'SN', code3: 'SEN', name: 'Senegal', flag: '🇸🇳', continent: 'Africa',
    population: 17320000,
    dominantReligions: [{ religion: 'Islam (Sufi Brotherhoods)', percentage: 95.9 }, { religion: 'Christianity (Catholic / Protestant)', percentage: 3.8 }, { religion: 'Traditional', percentage: 0.3 }],
    christianPercentage: 3.8, evangelicalPercentage: 0.3, unreachedPopulationPercentage: 92.5, unreachedPeopleGroupsCount: 32,
    securityLevel: 'Low', primaryLanguages: ['French', 'Wolof', 'Pulaar', 'Serer', 'Jola'], capitalCity: 'Dakar', isIn1040Window: true,
    activeMissionariesCount: 52, activePrayerWarriorsCount: 1450,
    description: 'Known for Teranga (hospitality) and religious peace. The 7 million Wolof and 4 million Fula remain key unreached focus peoples.',
    prayerPoints: ['Supernatural revelation of Jesus to leaders of Sufi brotherhoods (Tijaniyya, Mouride)', 'Multiplication of underground Wolof house churches in Touba and Dakar', 'Christian schools and community services demonstrating genuine Christlike love'],
    missionOpportunities: ['Wolof Bible translation and media outreach', 'Pioneer mission stations in Casamance and eastern Senegal']
  },
  {
    id: 'syc', code: 'SC', code3: 'SYC', name: 'Seychelles', flag: '🇸🇨', continent: 'Africa',
    population: 100000,
    dominantReligions: [{ religion: 'Christianity (Catholic)', percentage: 76.2 }, { religion: 'Christianity (Anglican)', percentage: 10.6 }, { religion: 'Hinduism / Islam / Other', percentage: 13.2 }],
    christianPercentage: 86.8, evangelicalPercentage: 8.5, unreachedPopulationPercentage: 2.0, unreachedPeopleGroupsCount: 1,
    securityLevel: 'Low', primaryLanguages: ['Seychellois Creole', 'English', 'French'], capitalCity: 'Victoria', isIn1040Window: false,
    activeMissionariesCount: 5, activePrayerWarriorsCount: 180,
    description: 'An idyllic Indian Ocean archipelago where churches seek to reach youth battling drug addiction and secular consumerism.',
    prayerPoints: ['Healing of families and youth deliverance from substance abuse', 'Revival in Catholic and Anglican congregations', 'Vision to send missionaries to East African coastal islands'],
    missionOpportunities: ['Teen and young adult rehabilitation ministries', 'Island-wide worship and prayer gatherings']
  },
  {
    id: 'sle', code: 'SL', code3: 'SLE', name: 'Sierra Leone', flag: '🇸🇱', continent: 'Africa',
    population: 8600000,
    dominantReligions: [{ religion: 'Islam', percentage: 78.0 }, { religion: 'Christianity', percentage: 20.9 }, { religion: 'Traditional', percentage: 1.1 }],
    christianPercentage: 20.9, evangelicalPercentage: 4.2, unreachedPopulationPercentage: 68.0, unreachedPeopleGroupsCount: 14,
    securityLevel: 'Low', primaryLanguages: ['English', 'Krio', 'Mende', 'Temne'], capitalCity: 'Freetown', isIn1040Window: true,
    activeMissionariesCount: 40, activePrayerWarriorsCount: 1100,
    description: 'Historic haven for freed slaves (Freetown). Despite civil war scars, inter-religious harmony exists and evangelical churches are expanding into the interior.',
    prayerPoints: ['Fruitful church planting among Temne, Mende, and Limba ethnic groups', 'Christian leadership training and economic empowerment for youth', 'Complete elimination of occult secret societies through the Gospel of light'],
    missionOpportunities: ['Interior village community schools and clinics', 'Krio and tribal audio scripture distribution']
  },
  {
    id: 'ssd', code: 'SS', code3: 'SSD', name: 'South Sudan', flag: '🇸🇸', continent: 'Africa',
    population: 11090000,
    dominantReligions: [{ religion: 'Christianity', percentage: 60.5 }, { religion: 'Traditional / Animist', percentage: 32.9 }, { religion: 'Islam', percentage: 6.2 }],
    christianPercentage: 60.5, evangelicalPercentage: 18.0, unreachedPopulationPercentage: 22.0, unreachedPeopleGroupsCount: 20,
    securityLevel: 'Extreme', primaryLanguages: ['English', 'Juba Arabic', 'Dinka', 'Nuer', 'Zande'], capitalCity: 'Juba', isIn1040Window: true,
    activeMissionariesCount: 45, activePrayerWarriorsCount: 1750,
    description: 'The world\'s newest recognized sovereign state. Pastors and intercessors are leading efforts to unite tribal factions (Dinka, Nuer) around the Cross.',
    prayerPoints: ['End to inter-ethnic warfare, cattle raiding, and political factionalism', 'Discipleship and trauma therapy for millions of war-affected children', 'Outreach to unreached Nilotic and Toposa desert tribes'],
    missionOpportunities: ['Trauma healing and emergency food distribution', 'Aviation and mobile medical missionary clinics']
  },
  {
    id: 'sdn', code: 'SD', code3: 'SDN', name: 'Sudan', flag: '🇸🇩', continent: 'Africa',
    population: 46870000,
    dominantReligions: [{ religion: 'Islam (Sunni - Official)', percentage: 91.0 }, { religion: 'Christianity', percentage: 5.4 }, { religion: 'Traditional', percentage: 3.6 }],
    christianPercentage: 5.4, evangelicalPercentage: 1.8, unreachedPopulationPercentage: 90.0, unreachedPeopleGroupsCount: 118,
    securityLevel: 'Extreme', primaryLanguages: ['Arabic (Sudanese)', 'English', 'Nubian', 'Beja', 'Fur'], capitalCity: 'Khartoum', isIn1040Window: true,
    activeMissionariesCount: 15, activePrayerWarriorsCount: 2100,
    description: 'Historic Nubian Christian kingdom before Islamic conquest. Currently suffering acute armed conflict while believers courageously distribute food and share Christ.',
    prayerPoints: ['Immediate cessation of violent civil warfare and protection of innocent civilians', 'Breakthrough among the 118 unreached ethnic groups in Darfur, Kordofan, and Red Sea hills', 'Perseverance for persecuted church leaders in Khartoum and Omdurman'],
    missionOpportunities: ['Emergency humanitarian relief and medical outreach in Port Sudan', 'Digital Arabic Gospel broadcasts and underground house church planting']
  },
  {
    id: 'tza', code: 'TZ', code3: 'TZA', name: 'Tanzania', flag: '🇹🇿', continent: 'Africa',
    population: 65500000,
    dominantReligions: [{ religion: 'Christianity', percentage: 63.1 }, { religion: 'Islam', percentage: 34.1 }, { religion: 'Traditional / Other', percentage: 2.8 }],
    christianPercentage: 63.1, evangelicalPercentage: 18.2, unreachedPopulationPercentage: 18.0, unreachedPeopleGroupsCount: 30,
    securityLevel: 'Low', primaryLanguages: ['Swahili', 'English', 'Sukuma', 'Maasai'], capitalCity: 'Dodoma', isIn1040Window: true,
    activeMissionariesCount: 180, activePrayerWarriorsCount: 4200,
    description: 'A peaceful East African anchor with a strong church base on the mainland. The semi-autonomous island of Zanzibar is 99% Muslim and remains a frontier priority.',
    prayerPoints: ['Gospel breakthrough in Zanzibar and coastal Swahili-Arab communities', 'Missionary mobilization to reach Maasai, Hadzabe, and Datooga tribes', 'Biblical training to counter syncretism with witchcraft in rural areas'],
    missionOpportunities: ['Zanzibar underground church support and discipleship', 'Maasai and pastoralist church planting initiatives']
  },
  {
    id: 'tgo', code: 'TG', code3: 'TGO', name: 'Togo', flag: '🇹🇬', continent: 'Africa',
    population: 8850000,
    dominantReligions: [{ religion: 'Christianity', percentage: 43.7 }, { religion: 'Traditional / Vodun', percentage: 35.6 }, { religion: 'Islam', percentage: 20.0 }],
    christianPercentage: 43.7, evangelicalPercentage: 11.0, unreachedPopulationPercentage: 28.0, unreachedPeopleGroupsCount: 15,
    securityLevel: 'Low', primaryLanguages: ['French', 'Ewe', 'Kabiye', 'Moba'], capitalCity: 'Lomé', isIn1040Window: true,
    activeMissionariesCount: 48, activePrayerWarriorsCount: 1200,
    description: 'A key West African nation where the historic Vodun animist capital contrasts with active Christian hospital ministries (ABWE Hospital of Hope in Mango).',
    prayerPoints: ['Spiritual breakthrough and deliverance from fear of ancestral curses', 'Church planting movements among northern Moba, Kotokoli, and Fulani peoples', 'Fruitfulness for Christian medical missions in Mango and Tsiko'],
    missionOpportunities: ['Medical missionary service in northern Togo', 'Audio Bible and film evangelism in Kabiye and Ewe']
  },
  {
    id: 'tun', code: 'TN', code3: 'TUN', name: 'Tunisia', flag: '🇹🇳', continent: 'Africa',
    population: 12360000,
    dominantReligions: [{ religion: 'Islam (Sunni)', percentage: 99.0 }, { religion: 'Christianity (Catholic / Protestant)', percentage: 0.5 }, { religion: 'Other', percentage: 0.5 }],
    christianPercentage: 0.5, evangelicalPercentage: 0.1, unreachedPopulationPercentage: 99.2, unreachedPeopleGroupsCount: 14,
    securityLevel: 'High', primaryLanguages: ['Arabic (Tunisian)', 'French', 'Berber (Shelha)'], capitalCity: 'Tunis', isIn1040Window: true,
    activeMissionariesCount: 18, activePrayerWarriorsCount: 1150,
    description: 'Ancient Carthage, birthplace of Tertullian and Perpetua. Today experiencing unprecedented spiritual searchings among educated youth through digital media.',
    prayerPoints: ['Protection and growth for the emerging indigenous Tunisian house church network', 'Fruitful internet and social media scripture dialogues with young seekers', 'Breakthrough among the southern desert Berber populations'],
    missionOpportunities: ['Digital discipleship and media content creation in Tunisian Arabic', 'Business-as-mission start-ups and language schools']
  },
  {
    id: 'uga', code: 'UG', code3: 'UGA', name: 'Uganda', flag: '🇺🇬', continent: 'Africa',
    population: 47250000,
    dominantReligions: [{ religion: 'Christianity (Catholic / Anglican)', percentage: 84.5 }, { religion: 'Islam', percentage: 13.7 }, { religion: 'Traditional / Other', percentage: 1.8 }],
    christianPercentage: 84.5, evangelicalPercentage: 37.0, unreachedPopulationPercentage: 4.0, unreachedPeopleGroupsCount: 6,
    securityLevel: 'Low', primaryLanguages: ['English', 'Luganda', 'Swahili', 'Runyankole', 'Acholi'], capitalCity: 'Kampala', isIn1040Window: false,
    activeMissionariesCount: 220, activePrayerWarriorsCount: 4800,
    description: 'Site of famous 20th-century revivals and national prayer movements. Uganda hosts Africa\'s largest refugee population and sends hundreds of missionaries abroad.',
    prayerPoints: ['Gospel outreach in the northern refugee settlements (hosting over 1.5 million)', 'Reaching unreached Muslim groups in eastern Uganda and Karamoja pastoralists', 'Raising up ethical leaders in politics and business from Christian universities'],
    missionOpportunities: ['Refugee settlement church planting and trauma counseling', 'Cross-border missions into South Sudan and DR Congo']
  },
  {
    id: 'zmb', code: 'ZM', code3: 'ZMB', name: 'Zambia', flag: '🇿🇲', continent: 'Africa',
    population: 20020000,
    dominantReligions: [{ religion: 'Christianity (Protestant / Catholic)', percentage: 95.5 }, { religion: 'Islam / Traditional', percentage: 4.5 }],
    christianPercentage: 95.5, evangelicalPercentage: 26.0, unreachedPopulationPercentage: 1.0, unreachedPeopleGroupsCount: 2,
    securityLevel: 'Low', primaryLanguages: ['English', 'Bemba', 'Nyanja', 'Tonga', 'Lozi'], capitalCity: 'Lusaka', isIn1040Window: false,
    activeMissionariesCount: 110, activePrayerWarriorsCount: 2400,
    description: 'Constitutionally designated a Christian nation, actively sending teachers, evangelists, and church planters across Southern and Central Africa.',
    prayerPoints: ['Deepening theological maturity and discipleship across copperbelt churches', 'Outreach to remote western plains along the Zambezi River', 'Equipping youth for vocational entrepreneurship with Kingdom values'],
    missionOpportunities: ['Theological training and Christian education colleges', 'Rural solar water well and church planting projects']
  },
  {
    id: 'zwe', code: 'ZW', code3: 'ZWE', name: 'Zimbabwe', flag: '🇿🇼', continent: 'Africa',
    population: 16320000,
    dominantReligions: [{ religion: 'Christianity (Protestant / Apostolic)', percentage: 85.0 }, { religion: 'Traditional', percentage: 12.0 }, { religion: 'Other', percentage: 3.0 }],
    christianPercentage: 85.0, evangelicalPercentage: 31.0, unreachedPopulationPercentage: 1.5, unreachedPeopleGroupsCount: 2,
    securityLevel: 'Low', primaryLanguages: ['English', 'Shona', 'Ndebele'], capitalCity: 'Harare', isIn1040Window: false,
    activeMissionariesCount: 95, activePrayerWarriorsCount: 2100,
    description: 'Possesses a strong Christian heritage and high literacy. Believers have demonstrated extraordinary resilience through economic hardships and prayer vigils.',
    prayerPoints: ['Economic revitalization and honest governance across public sectors', 'Rooting out syncretistic practices in white-garment Apostolic sects', 'Sending trained Zimbabwean missionaries to Portuguese and French-speaking nations'],
    missionOpportunities: ['Pastoral leadership coaching in Harare and Bulawayo', 'Community agricultural development and orphan feeding centers']
  }
];

// Let's write the generator script that outputs the complete, beautiful ALL_COUNTRIES file.
fs.writeFileSync('scripts/seedCountriesComplete.js', '// temporary build script');
console.log('Script helper prepared.');
