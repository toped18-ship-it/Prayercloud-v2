import json
import os

# Complete master list of all 195 Sovereign Countries in the world
# Each country is mapped with full data matching the TypeScript Country interface.

RAW_COUNTRIES = [
    # =========================================================================
    # AFRICA (54 Countries)
    # =========================================================================
    {
        "id": "dza", "code": "DZ", "code3": "DZA", "name": "Algeria", "flag": "🇩🇿", "continent": "Africa", "population": 44900000,
        "dominantReligions": [{"religion": "Islam (Sunni)", "percentage": 99.0}, {"religion": "Christianity (Kabyle/Catholic)", "percentage": 0.3}, {"religion": "Other", "percentage": 0.7}],
        "christianPercentage": 0.3, "evangelicalPercentage": 0.2, "unreachedPopulationPercentage": 99.1, "unreachedPeopleGroupsCount": 35, "securityLevel": "High",
        "primaryLanguages": ["Arabic (Algerian)", "Tamazight (Kabyle)", "French"], "capitalCity": "Algiers", "isIn1040Window": True, "activeMissionariesCount": 35, "activePrayerWarriorsCount": 2100,
        "description": "Birthplace of Saint Augustine. A remarkable revival has touched the mountainous Kabyle Berber people, despite recent church closures.",
        "prayerPoints": ["Reopening of sealed church buildings and legal recognition for the EPA", "Expansion of the Kabyle revival into Arabic-speaking populations", "Perseverance for young believers enduring police harassment"],
        "missionOpportunities": ["Kabyle audio Bible recording studios", "Digital discipleship apps for North African seekers"]
    },
    {
        "id": "ago", "code": "AO", "code3": "AGO", "name": "Angola", "flag": "🇦🇴", "continent": "Africa", "population": 35588000,
        "dominantReligions": [{"religion": "Christianity (Catholic)", "percentage": 56.4}, {"religion": "Christianity (Protestant)", "percentage": 37.0}, {"religion": "Traditional", "percentage": 6.6}],
        "christianPercentage": 93.4, "evangelicalPercentage": 22.5, "unreachedPopulationPercentage": 1.2, "unreachedPeopleGroupsCount": 4, "securityLevel": "Low",
        "primaryLanguages": ["Portuguese", "Umbundu", "Kimbundu", "Kikongo"], "capitalCity": "Luanda", "isIn1040Window": False, "activeMissionariesCount": 82, "activePrayerWarriorsCount": 1450,
        "description": "Recovered from civil war, experiencing widespread church growth and missionary zeal sending workers to Central African neighbors.",
        "prayerPoints": ["Deep discipleship and biblical literacy to combat syncretism", "Training native rural pastors in eastern provinces", "Missionary mobilization to Portuguese-speaking unreached groups"],
        "missionOpportunities": ["Theological training institutes in Luanda and Huambo", "Rural health clinics and community development"]
    },
    {
        "id": "ben", "code": "BJ", "code3": "BEN", "name": "Benin", "flag": "🇧🇯", "continent": "Africa", "population": 13350000,
        "dominantReligions": [{"religion": "Christianity", "percentage": 48.5}, {"religion": "Islam", "percentage": 27.7}, {"religion": "Vodun / Animism", "percentage": 23.8}],
        "christianPercentage": 48.5, "evangelicalPercentage": 8.5, "unreachedPopulationPercentage": 38.5, "unreachedPeopleGroupsCount": 16, "securityLevel": "Medium",
        "primaryLanguages": ["French", "Fon", "Yoruba", "Bariba"], "capitalCity": "Porto-Novo", "isIn1040Window": True, "activeMissionariesCount": 45, "activePrayerWarriorsCount": 1100,
        "description": "Historic cradle of Vodun. While churches grow rapidly in the south, northern tribes (Bariba, Fulani) remain largely unreached.",
        "prayerPoints": ["Spiritual breakthrough and freedom from ancestral fear and occult strongholds", "Church planting movements among northern Fulani and Dendi peoples", "Denominational unity in Cotonou"],
        "missionOpportunities": ["Pioneer church planting in northern savannah villages", "Audio Bible distribution in local languages"]
    },
    {
        "id": "bwa", "code": "BW", "code3": "BWA", "name": "Botswana", "flag": "🇧🇼", "continent": "Africa", "population": 2630000,
        "dominantReligions": [{"religion": "Christianity", "percentage": 73.0}, {"religion": "Badimo / Traditional", "percentage": 20.0}, {"religion": "Other", "percentage": 7.0}],
        "christianPercentage": 73.0, "evangelicalPercentage": 15.0, "unreachedPopulationPercentage": 2.0, "unreachedPeopleGroupsCount": 2, "securityLevel": "Low",
        "primaryLanguages": ["Setswana", "English", "Kalanga"], "capitalCity": "Gaborone", "isIn1040Window": False, "activeMissionariesCount": 30, "activePrayerWarriorsCount": 650,
        "description": "A stable African democracy with a strong Christian heritage, now focusing on youth revival and reaching San/Bushmen communities.",
        "prayerPoints": ["Discipleship and overcoming nominalism among urban youth", "Outreach to remote Kalahari Desert San communities", "Mission vision in local churches for unreached nations"],
        "missionOpportunities": ["University campus ministry in Gaborone", "Wilderness outreach and literacy in Kalahari"]
    },
    {
        "id": "bfa", "code": "BF", "code3": "BFA", "name": "Burkina Faso", "flag": "🇧🇫", "continent": "Africa", "population": 22670000,
        "dominantReligions": [{"religion": "Islam", "percentage": 61.5}, {"religion": "Christianity", "percentage": 29.8}, {"religion": "Traditional / Animist", "percentage": 8.7}],
        "christianPercentage": 29.8, "evangelicalPercentage": 9.2, "unreachedPopulationPercentage": 64.0, "unreachedPeopleGroupsCount": 28, "securityLevel": "High",
        "primaryLanguages": ["French", "Mossi (Mooré)", "Fulfulde", "Dyula"], "capitalCity": "Ouagadougou", "isIn1040Window": True, "activeMissionariesCount": 60, "activePrayerWarriorsCount": 1950,
        "description": "Facing security challenges in northern regions, yet believers demonstrate heroic faith and love towards displaced neighbors.",
        "prayerPoints": ["Protection and courage for persecuted pastors in rural villages", "Breakthrough among the 12 million Mossi and nomadic Fulani herders", "Provision for internally displaced families"],
        "missionOpportunities": ["Trauma healing and emergency food relief for displaced families", "Solar audio Bible distribution"]
    },
    {
        "id": "bdi", "code": "BI", "code3": "BDI", "name": "Burundi", "flag": "🇧🇮", "continent": "Africa", "population": 12890000,
        "dominantReligions": [{"religion": "Christianity (Catholic/Protestant)", "percentage": 91.0}, {"religion": "Islam", "percentage": 3.0}, {"religion": "Traditional", "percentage": 6.0}],
        "christianPercentage": 91.0, "evangelicalPercentage": 35.0, "unreachedPopulationPercentage": 0.5, "unreachedPeopleGroupsCount": 1, "securityLevel": "Medium",
        "primaryLanguages": ["Kirundi", "French", "English", "Swahili"], "capitalCity": "Gitega", "isIn1040Window": False, "activeMissionariesCount": 40, "activePrayerWarriorsCount": 1250,
        "description": "A densely populated nation with a history of revival and reconciliation work between Hutu and Tutsi believers.",
        "prayerPoints": ["Deep reconciliation and tribal healing through the Gospel", "Economic empowerment and ethical leadership among Christian leaders", "Missionary sending to Great Lakes and Sahel"],
        "missionOpportunities": ["Pastoral leadership development", "Agricultural mission and community development"]
    },
    {
        "id": "cpv", "code": "CV", "code3": "CPV", "name": "Cabo Verde", "flag": "🇨🇻", "continent": "Africa", "population": 593000,
        "dominantReligions": [{"religion": "Christianity (Catholic)", "percentage": 77.3}, {"religion": "Christianity (Protestant)", "percentage": 10.2}, {"religion": "Other", "percentage": 12.5}],
        "christianPercentage": 87.5, "evangelicalPercentage": 9.8, "unreachedPopulationPercentage": 1.0, "unreachedPeopleGroupsCount": 1, "securityLevel": "Low",
        "primaryLanguages": ["Portuguese", "Kriolu"], "capitalCity": "Praia", "isIn1040Window": False, "activeMissionariesCount": 12, "activePrayerWarriorsCount": 380,
        "description": "An archipelago off West Africa with a Catholic cultural background, witnessing vibrant evangelical church growth.",
        "prayerPoints": ["Spiritual renewal across the islands of Santiago, Sao Vicente, and Sal", "Effective outreach to youth in port cities", "Sending Creole-speaking missionaries to West Africa"],
        "missionOpportunities": ["Youth and sports ministries", "Island-to-island church planting"]
    },
    {
        "id": "cmr", "code": "CM", "code3": "CMR", "name": "Cameroon", "flag": "🇨🇲", "continent": "Africa", "population": 27910000,
        "dominantReligions": [{"religion": "Christianity", "percentage": 70.0}, {"religion": "Islam", "percentage": 20.0}, {"religion": "Traditional", "percentage": 10.0}],
        "christianPercentage": 70.0, "evangelicalPercentage": 11.5, "unreachedPopulationPercentage": 24.5, "unreachedPeopleGroupsCount": 42, "securityLevel": "Medium",
        "primaryLanguages": ["French", "English", "Cameroonian Pidgin", "Fulfulde"], "capitalCity": "Yaoundé", "isIn1040Window": True, "activeMissionariesCount": 110, "activePrayerWarriorsCount": 2800,
        "description": "Known as 'Africa in miniature' with over 250 ethnic groups. Northern Far North region is predominantly unreached Muslim and animist.",
        "prayerPoints": ["Gospel breakthrough among northern Kirdi and Fulani groups", "Peace and reconciliation in Anglophone regions", "Bible translation in over 100 languages still lacking scripture"],
        "missionOpportunities": ["Mother-tongue Bible translation with Wycliffe/SIL", "Northern Sahel pioneer missions"]
    },
    {
        "id": "caf", "code": "CF", "code3": "CAF", "name": "Central African Republic", "flag": "🇨🇫", "continent": "Africa", "population": 5580000,
        "dominantReligions": [{"religion": "Christianity", "percentage": 80.0}, {"religion": "Islam", "percentage": 15.0}, {"religion": "Traditional", "percentage": 5.0}],
        "christianPercentage": 80.0, "evangelicalPercentage": 32.0, "unreachedPopulationPercentage": 16.0, "unreachedPeopleGroupsCount": 14, "securityLevel": "High",
        "primaryLanguages": ["Sango", "French", "Banda", "Gbaya"], "capitalCity": "Bangui", "isIn1040Window": True, "activeMissionariesCount": 35, "activePrayerWarriorsCount": 950,
        "description": "Experiencing civil turmoil, yet the evangelical church remains the primary stabilizing pillar of hope and forgiveness across ethnic lines.",
        "prayerPoints": ["Healing of trauma and peace across armed group territories", "Discipleship of young men vulnerable to militia recruitment", "Missionary outreach to unreached Chadian and Sudanese border tribes"],
        "missionOpportunities": ["Medical missionary aviation", "Orphan rehabilitation and vocational training"]
    },
    {
        "id": "tcd", "code": "TD", "code3": "TCD", "name": "Chad", "flag": "🇹🇩", "continent": "Africa", "population": 17720000,
        "dominantReligions": [{"religion": "Islam", "percentage": 52.1}, {"religion": "Christianity", "percentage": 44.1}, {"religion": "Traditional", "percentage": 3.8}],
        "christianPercentage": 44.1, "evangelicalPercentage": 9.8, "unreachedPopulationPercentage": 54.0, "unreachedPeopleGroupsCount": 74, "securityLevel": "High",
        "primaryLanguages": ["Arabic (Chadian)", "French", "Sara"], "capitalCity": "N'Djamena", "isIn1040Window": True, "activeMissionariesCount": 55, "activePrayerWarriorsCount": 1700,
        "description": "A key frontier battlefield in the Sahel. Southern Chad is largely Christian, while northern Sahara regions remain deeply unreached.",
        "prayerPoints": ["Spiritual breakthrough among 74 unreached nomadic Arab, Toubou, and Kanembu peoples", "Unity between northern converts and southern Christian communities", "Protection for water well drilling teams in remote deserts"],
        "missionOpportunities": ["Nomadic desert medical teams", "Chadian Arabic radio broadcast and digital scripture"]
    },
    {
        "id": "com", "code": "KM", "code3": "COM", "name": "Comoros", "flag": "🇰🇲", "continent": "Africa", "population": 836000,
        "dominantReligions": [{"religion": "Islam (Sunni)", "percentage": 98.5}, {"religion": "Christianity", "percentage": 1.0}, {"religion": "Other", "percentage": 0.5}],
        "christianPercentage": 1.0, "evangelicalPercentage": 0.2, "unreachedPopulationPercentage": 98.8, "unreachedPeopleGroupsCount": 3, "securityLevel": "High",
        "primaryLanguages": ["Shikomor (Comorian)", "Arabic", "French"], "capitalCity": "Moroni", "isIn1040Window": True, "activeMissionariesCount": 6, "activePrayerWarriorsCount": 420,
        "description": "An Indian Ocean island nation where proselytizing non-Muslim faiths is restricted by law. A tiny network of indigenous believers worships in secret.",
        "prayerPoints": ["Protection and boldness for the small underground Comorian church", "Opening legal doors for freedom of conscience and belief", "Translation of Shikomor scripture"],
        "missionOpportunities": ["English teaching and humanitarian development", "Healthcare and island educational initiatives"]
    },
    {
        "id": "cog", "code": "CG", "code3": "COG", "name": "Congo (Republic of)", "flag": "🇨🇬", "continent": "Africa", "population": 5970000,
        "dominantReligions": [{"religion": "Christianity", "percentage": 88.5}, {"religion": "Traditional", "percentage": 8.0}, {"religion": "Islam", "percentage": 3.5}],
        "christianPercentage": 88.5, "evangelicalPercentage": 17.5, "unreachedPopulationPercentage": 3.5, "unreachedPeopleGroupsCount": 4, "securityLevel": "Low",
        "primaryLanguages": ["French", "Lingala", "Kituba"], "capitalCity": "Brazzaville", "isIn1040Window": False, "activeMissionariesCount": 40, "activePrayerWarriorsCount": 920,
        "description": "Vibrant urban churches in Brazzaville, with ongoing pioneer work among forest Pygmy (Baka/Babinga) hunter-gatherer communities in the north.",
        "prayerPoints": ["Dignity, education, and Gospel transformation for marginalized Pygmy communities", "Discipleship to root out occult syncretism", "Missionary mobilization to Francophone Sahel nations"],
        "missionOpportunities": ["Forest Pygmy literacy and church planting", "Pastoral leadership training"]
    },
    {
        "id": "cod", "code": "CD", "code3": "COD", "name": "Congo (DRC)", "flag": "🇨🇩", "continent": "Africa", "population": 99000000,
        "dominantReligions": [{"religion": "Christianity (Catholic)", "percentage": 50.0}, {"religion": "Christianity (Protestant)", "percentage": 40.0}, {"religion": "Traditional/Islam", "percentage": 10.0}],
        "christianPercentage": 90.0, "evangelicalPercentage": 25.0, "unreachedPopulationPercentage": 2.5, "unreachedPeopleGroupsCount": 8, "securityLevel": "High",
        "primaryLanguages": ["French", "Lingala", "Swahili", "Kikongo", "Tshiluba"], "capitalCity": "Kinshasa", "isIn1040Window": False, "activeMissionariesCount": 320, "activePrayerWarriorsCount": 5400,
        "description": "Immense in size with deep Christian faith. Facing conflict in eastern Kivu regions while Kinshasa sees explosive church growth.",
        "prayerPoints": ["Peace and deliverance for families in North and South Kivu", "Transformation of governance and end to corruption", "Empowering Congolese mission agencies sending workers to North Africa"],
        "missionOpportunities": ["Refugee and trauma healing ministries in Goma", "Christian university education and business leadership"]
    },
    {
        "id": "civ", "code": "CI", "code3": "CIV", "name": "Cote d'Ivoire", "flag": "🇨🇮", "continent": "Africa", "population": 28160000,
        "dominantReligions": [{"religion": "Islam", "percentage": 42.9}, {"religion": "Christianity", "percentage": 39.8}, {"religion": "Traditional / Animist", "percentage": 17.3}],
        "christianPercentage": 39.8, "evangelicalPercentage": 11.2, "unreachedPopulationPercentage": 36.0, "unreachedPeopleGroupsCount": 22, "securityLevel": "Medium",
        "primaryLanguages": ["French", "Baoulé", "Dioula", "Dan"], "capitalCity": "Yamoussoukro", "isIn1040Window": True, "activeMissionariesCount": 95, "activePrayerWarriorsCount": 2200,
        "description": "An economic hub of West Africa. South is predominantly Christian while the north is Muslim. National prayer movements are driving intercession for the Sahel.",
        "prayerPoints": ["National unity and revival across tribal and religious divides", "Gospel movements among northern Dioula, Senufo, and Fulani peoples", "Missionary training schools sending workers into Mali and Guinea"],
        "missionOpportunities": ["Cross-cultural missionary training in Abidjan", "Northern rural agricultural mission stations"]
    },
    {
        "id": "dji", "code": "DJ", "code3": "DJI", "name": "Djibouti", "flag": "🇩🇯", "continent": "Africa", "population": 1120000,
        "dominantReligions": [{"religion": "Islam (Sunni)", "percentage": 97.0}, {"religion": "Christianity", "percentage": 2.5}, {"religion": "Other", "percentage": 0.5}],
        "christianPercentage": 2.5, "evangelicalPercentage": 0.2, "unreachedPopulationPercentage": 97.5, "unreachedPeopleGroupsCount": 4, "securityLevel": "Medium",
        "primaryLanguages": ["French", "Arabic", "Somali", "Afar"], "capitalCity": "Djibouti City", "isIn1040Window": True, "activeMissionariesCount": 14, "activePrayerWarriorsCount": 750,
        "description": "Strategically located on the Bab-el-Mandeb strait between Africa and Arabia. A peaceful gateway to reaching Afar and Somali populations.",
        "prayerPoints": ["Awakening among nomadic Afar desert dwellers", "Protection for local converts and expatriate mission workers", "Digital media evangelism reaching Somali youth"],
        "missionOpportunities": ["Community healthcare and vocational institutes", "Port city diaspora ministry"]
    },
    {
        "id": "egy", "code": "EG", "code3": "EGY", "name": "Egypt", "flag": "🇪🇬", "continent": "Africa", "population": 110000000,
        "dominantReligions": [{"religion": "Islam (Sunni - Official)", "percentage": 89.5}, {"religion": "Christianity (Coptic Orthodox)", "percentage": 9.5}, {"religion": "Christianity (Evangelical/Catholic)", "percentage": 1.0}],
        "christianPercentage": 10.5, "evangelicalPercentage": 3.8, "unreachedPopulationPercentage": 89.2, "unreachedPeopleGroupsCount": 42, "securityLevel": "High",
        "primaryLanguages": ["Arabic (Egyptian)", "Coptic", "Nubian", "Siwi Berber"], "capitalCity": "Cairo", "isIn1040Window": True, "activeMissionariesCount": 240, "activePrayerWarriorsCount": 6800,
        "description": "Historic land where the Holy Family found refuge (Matthew 2:13-15). Home to the largest Christian community in the Middle East (over 10M Coptic believers).",
        "prayerPoints": ["Revival inside historic Coptic and Evangelical churches", "Fulfillment of Isaiah 19:25: 'Blessed be Egypt my people'", "Multiplying house church movements among rural Upper Egypt and Nubian villages"],
        "missionOpportunities": ["Cave Church prayer & intercession ministries in Mokattam", "Arabic Christian satellite broadcasting", "Sudanese and Eritrean refugee medical care"]
    },
    {
        "id": "gnq", "code": "GQ", "code3": "GNQ", "name": "Equatorial Guinea", "flag": "🇬🇶", "continent": "Africa", "population": 1670000,
        "dominantReligions": [{"religion": "Christianity (Catholic)", "percentage": 87.0}, {"religion": "Christianity (Protestant)", "percentage": 5.0}, {"religion": "Traditional / Islam", "percentage": 8.0}],
        "christianPercentage": 92.0, "evangelicalPercentage": 4.8, "unreachedPopulationPercentage": 2.0, "unreachedPeopleGroupsCount": 1, "securityLevel": "Low",
        "primaryLanguages": ["Spanish", "French", "Portuguese", "Fang"], "capitalCity": "Malabo", "isIn1040Window": False, "activeMissionariesCount": 18, "activePrayerWarriorsCount": 410,
        "description": "The only Spanish-speaking nation in Africa. Evangelical churches are growing rapidly among the Fang majority.",
        "prayerPoints": ["Equipping faithful pastors in rural mainland Rio Muni", "Freedom of gospel radio broadcasting and youth outreach", "Justice and integrity across leadership"],
        "missionOpportunities": ["Spanish-language theological training", "Island youth discipleship in Malabo"]
    },
    {
        "id": "eri", "code": "ER", "code3": "ERI", "name": "Eritrea", "flag": "🇪🇷", "continent": "Africa", "population": 3680000,
        "dominantReligions": [{"religion": "Christianity (Orthodox/Catholic)", "percentage": 50.0}, {"religion": "Islam (Sunni)", "percentage": 48.0}, {"religion": "Evangelical (Underground)", "percentage": 2.0}],
        "christianPercentage": 50.0, "evangelicalPercentage": 2.0, "unreachedPopulationPercentage": 49.0, "unreachedPeopleGroupsCount": 7, "securityLevel": "Extreme",
        "primaryLanguages": ["Tigrinya", "Arabic", "Tigre", "English"], "capitalCity": "Asmara", "isIn1040Window": True, "activeMissionariesCount": 5, "activePrayerWarriorsCount": 2300,
        "description": "Hundreds of evangelical believers endure years of imprisonment in shipping containers, maintaining steadfast prayer and worship.",
        "prayerPoints": ["Release and healing for imprisoned pastors and underground believers", "Comfort and strength for families whose loved ones are detained", "Breakthrough among unreached lowland Muslim tribes (Rashaida, Saho, Tigre)"],
        "missionOpportunities": ["Refugee diaspora outreach in Europe and North America", "Tigrinya Christian satellite broadcasting"]
    },
    {
        "id": "swz", "code": "SZ", "code3": "SWZ", "name": "Eswatini", "flag": "🇸🇿", "continent": "Africa", "population": 1200000,
        "dominantReligions": [{"religion": "Christianity (Zionist/Protestant)", "percentage": 88.0}, {"religion": "Traditional", "percentage": 10.0}, {"religion": "Other", "percentage": 2.0}],
        "christianPercentage": 88.0, "evangelicalPercentage": 24.5, "unreachedPopulationPercentage": 0.5, "unreachedPeopleGroupsCount": 1, "securityLevel": "Low",
        "primaryLanguages": ["siSwati", "English"], "capitalCity": "Mbabane", "isIn1040Window": False, "activeMissionariesCount": 28, "activePrayerWarriorsCount": 650,
        "description": "A traditional kingdom with rich Christian history, focusing on orphan care, youth empowerment, and missions.",
        "prayerPoints": ["Clear biblical teaching distinguishing Gospel from ancestral rituals", "Support for orphaned children and vulnerable families", "Sending Swazi missionaries to unreached African nations"],
        "missionOpportunities": ["Orphan care and educational centers", "Youth leadership academies"]
    },
    {
        "id": "eth", "code": "ET", "code3": "ETH", "name": "Ethiopia", "flag": "🇪🇹", "continent": "Africa", "population": 123400000,
        "dominantReligions": [{"religion": "Christianity (Ethiopian Orthodox)", "percentage": 43.8}, {"religion": "Islam (Sunni)", "percentage": 31.3}, {"religion": "Christianity (Evangelical P'ent'ay)", "percentage": 22.8}, {"religion": "Traditional", "percentage": 2.1}],
        "christianPercentage": 66.6, "evangelicalPercentage": 22.8, "unreachedPopulationPercentage": 32.5, "unreachedPeopleGroupsCount": 38, "securityLevel": "Medium",
        "primaryLanguages": ["Amharic", "Oromo", "Tigrinya", "Somali", "Afar"], "capitalCity": "Addis Ababa", "isIn1040Window": True, "activeMissionariesCount": 420, "activePrayerWarriorsCount": 7800,
        "description": "Ancient biblical Christian nation (Acts 8 Ethiopian eunuch). Experiencing massive evangelical church multiplication (P'ent'ay) and sending thousands of cross-cultural missionaries.",
        "prayerPoints": ["Healing and cessation of ethnic conflicts across regional states", "Spiritual breakthrough among unreached Somali, Afar, and Oromo Muslim communities", "Protection and equipping for Ethiopian missionaries dispatched to Horn of Africa"],
        "missionOpportunities": ["Cross-cultural missionary training in Addis Ababa", "Bible translation in southwestern omotic languages", "Peace and reconciliation intercession summits"]
    },
    {
        "id": "gab", "code": "GA", "code3": "GAB", "name": "Gabon", "flag": "🇬🇦", "continent": "Africa", "population": 2380000,
        "dominantReligions": [{"religion": "Christianity", "percentage": 76.0}, {"religion": "Bwiti / Traditional", "percentage": 14.0}, {"religion": "Islam", "percentage": 10.0}],
        "christianPercentage": 76.0, "evangelicalPercentage": 12.0, "unreachedPopulationPercentage": 3.0, "unreachedPeopleGroupsCount": 2, "securityLevel": "Low",
        "primaryLanguages": ["French", "Fang", "Myene"], "capitalCity": "Libreville", "isIn1040Window": False, "activeMissionariesCount": 22, "activePrayerWarriorsCount": 540,
        "description": "Heavily forested nation with substantial resources. Famous Albert Schweitzer hospital pioneered medical missions here.",
        "prayerPoints": ["Spiritual breakthrough over Bwiti animist initiation cult", "Integrity and righteous governance for Gabon's new generation", "Revival in university campuses in Libreville"],
        "missionOpportunities": ["Medical missionary service in Lambarene", "Youth camp and university ministry"]
    },
    {
        "id": "gmb", "code": "GM", "code3": "GMB", "name": "Gambia", "flag": "🇬🇲", "continent": "Africa", "population": 2700000,
        "dominantReligions": [{"religion": "Islam (Sunni)", "percentage": 95.7}, {"religion": "Christianity", "percentage": 3.8}, {"religion": "Traditional", "percentage": 0.5}],
        "christianPercentage": 3.8, "evangelicalPercentage": 0.9, "unreachedPopulationPercentage": 96.0, "unreachedPeopleGroupsCount": 11, "securityLevel": "Low",
        "primaryLanguages": ["English", "Mandinka", "Fula", "Wolof"], "capitalCity": "Banjul", "isIn1040Window": True, "activeMissionariesCount": 25, "activePrayerWarriorsCount": 780,
        "description": "A peaceful nation along the Gambia River with religious tolerance, allowing open church life despite a 96% Muslim population.",
        "prayerPoints": ["Multiplying church movements among Mandinka, Wolof, and Jola tribes", "Fruitfulness for Christian schools and hospital outreaches", "Courage for Muslim-background believers sharing Christ with families"],
        "missionOpportunities": ["Riverboat mobile medical clinics", "Vocational skills and Christian community schools"]
    },
    {
        "id": "gha", "code": "GH", "code3": "GHA", "name": "Ghana", "flag": "🇬🇭", "continent": "Africa", "population": 33470000,
        "dominantReligions": [{"religion": "Christianity", "percentage": 71.2}, {"religion": "Islam", "percentage": 17.6}, {"religion": "Traditional", "percentage": 5.2}, {"religion": "Other", "percentage": 6.0}],
        "christianPercentage": 71.2, "evangelicalPercentage": 28.0, "unreachedPopulationPercentage": 12.0, "unreachedPeopleGroupsCount": 18, "securityLevel": "Low",
        "primaryLanguages": ["English", "Akan (Twi/Fante)", "Ewe", "Ga", "Dagbani"], "capitalCity": "Accra", "isIn1040Window": True, "activeMissionariesCount": 350, "activePrayerWarriorsCount": 6200,
        "description": "A spiritual powerhouse and one of Africa's leading missionary-sending nations, actively dispatching evangelists into the Sahel.",
        "prayerPoints": ["Spiritual breakthrough in northern Ghana among Dagomba, Gonja, and Fulani peoples", "Discernment and depth in theology against prosperity gospel", "Protection and empowerment for Ghanaian missionaries serving across 10/40 window"],
        "missionOpportunities": ["Frontier mission training and sending centers", "Northern agricultural church planting"]
    },
    {
        "id": "gin", "code": "GN", "code3": "GIN", "name": "Guinea", "flag": "🇬🇳", "continent": "Africa", "population": 13860000,
        "dominantReligions": [{"religion": "Islam (Sunni)", "percentage": 86.8}, {"religion": "Christianity", "percentage": 8.5}, {"religion": "Traditional", "percentage": 4.7}],
        "christianPercentage": 8.5, "evangelicalPercentage": 2.4, "unreachedPopulationPercentage": 87.0, "unreachedPeopleGroupsCount": 24, "securityLevel": "Medium",
        "primaryLanguages": ["French", "Fula (Pular)", "Maninka", "Susu"], "capitalCity": "Conakry", "isIn1040Window": True, "activeMissionariesCount": 42, "activePrayerWarriorsCount": 1100,
        "description": "A major West African unreached nation. Fouta Djallon highlands are the historic heartland of the Fulani people.",
        "prayerPoints": ["Gospel awakening among 5 million Pular Fulani and 4 million Maninka", "Protection and fellowship for isolated converts in rural villages", "Audio Bible translation across remote tribal communities"],
        "missionOpportunities": ["Radio and digital smartphone evangelism", "Rural healthcare and clean water ministry"]
    },
    {
        "id": "gnb", "code": "GW", "code3": "GNB", "name": "Guinea-Bissau", "flag": "🇬🇼", "continent": "Africa", "population": 2100000,
        "dominantReligions": [{"religion": "Islam", "percentage": 46.0}, {"religion": "Traditional / Animist", "percentage": 39.0}, {"religion": "Christianity", "percentage": 15.0}],
        "christianPercentage": 15.0, "evangelicalPercentage": 2.8, "unreachedPopulationPercentage": 55.0, "unreachedPeopleGroupsCount": 12, "securityLevel": "Medium",
        "primaryLanguages": ["Portuguese", "Crioulo", "Balanta", "Fula"], "capitalCity": "Bissau", "isIn1040Window": True, "activeMissionariesCount": 30, "activePrayerWarriorsCount": 620,
        "description": "One of the least developed countries, where animist and Muslim communities are showing openness to the Gospel.",
        "prayerPoints": ["Rapid church planting among Balanta, Mandinka, and Bijago islanders", "Bible translation in Crioulo and tribal dialects", "Training native evangelists and church planters"],
        "missionOpportunities": ["Bijagos Archipelago boat evangelism", "Literacy and vocational school projects"]
    },
    {
        "id": "ken", "code": "KE", "code3": "KEN", "name": "Kenya", "flag": "🇰🇪", "continent": "Africa", "population": 54000000,
        "dominantReligions": [{"religion": "Christianity (Protestant/Evangelical)", "percentage": 60.0}, {"religion": "Christianity (Catholic)", "percentage": 25.5}, {"religion": "Islam (Somali/Swahili)", "percentage": 11.2}, {"religion": "Traditional/Other", "percentage": 3.3}],
        "christianPercentage": 85.5, "evangelicalPercentage": 37.0, "unreachedPopulationPercentage": 14.5, "unreachedPeopleGroupsCount": 32, "securityLevel": "Medium",
        "primaryLanguages": ["Swahili (Kiswahili)", "English", "Kikuyu", "Luo", "Kalenjin", "Somali"], "capitalCity": "Nairobi", "isIn1040Window": False, "activeMissionariesCount": 580, "activePrayerWarriorsCount": 9200,
        "description": "Major mission hub of East Africa, home to Nairobi mission agencies and 24/7 prayer altars. Sending workers to reach northern pastoralist tribes (Turkana, Rendille, Borana).",
        "prayerPoints": ["Breakthrough among unreached northern Muslim nomads (Somali, Borana, Orma)", "Revival and pure biblical discipleship in urban churches in Nairobi and Mombasa", "Protection for rural believers along the eastern border"],
        "missionOpportunities": ["Frontier cross-cultural training institutes", "Pastoralist mobile solar school initiatives", "Slum community church plants in Kibera and Mathare"]
    },
    {
        "id": "lso", "code": "LS", "code3": "LSO", "name": "Lesotho", "flag": "🇱🇸", "continent": "Africa", "population": 2300000,
        "dominantReligions": [{"religion": "Christianity (Catholic/Protestant)", "percentage": 92.0}, {"religion": "Traditional", "percentage": 7.0}, {"religion": "Other", "percentage": 1.0}],
        "christianPercentage": 92.0, "evangelicalPercentage": 12.0, "unreachedPopulationPercentage": 0.5, "unreachedPeopleGroupsCount": 1, "securityLevel": "Low",
        "primaryLanguages": ["Sesotho", "English"], "capitalCity": "Maseru", "isIn1040Window": False, "activeMissionariesCount": 20, "activePrayerWarriorsCount": 510,
        "description": "The 'Kingdom in the Sky' enclave. Mountain shepherd boys and highland villages need discipleship and audio scripture.",
        "prayerPoints": ["Equipping mountain shepherds (herd boys) with audio scripture", "Renewal of spiritual passion in historical church denominations", "Overcoming poverty through godly innovation"],
        "missionOpportunities": ["Highland shepherd outreach on horseback", "Youth vocational trade academies"]
    },
    {
        "id": "lbr", "code": "LR", "code3": "LBR", "name": "Liberia", "flag": "🇱🇷", "continent": "Africa", "population": 5300000,
        "dominantReligions": [{"religion": "Christianity", "percentage": 85.5}, {"religion": "Islam", "percentage": 12.2}, {"religion": "Traditional", "percentage": 2.3}],
        "christianPercentage": 85.5, "evangelicalPercentage": 22.0, "unreachedPopulationPercentage": 8.0, "unreachedPeopleGroupsCount": 6, "securityLevel": "Low",
        "primaryLanguages": ["English", "Liberian Kpelle", "Bassa", "Vai"], "capitalCity": "Monrovia", "isIn1040Window": True, "activeMissionariesCount": 65, "activePrayerWarriorsCount": 1350,
        "description": "Africa's oldest republic, rebuilt through the resilience of Christian prayer groups following civil conflict.",
        "prayerPoints": ["Spiritual breakthrough among Muslim Vai and Mandingo tribes", "Discipleship to eliminate secret society practices", "Raising moral, Christ-centered national leaders"],
        "missionOpportunities": ["Christian higher education and teacher training", "Interior jungle clinic and solar lighting missions"]
    },
    {
        "id": "lby", "code": "LY", "code3": "LBY", "name": "Libya", "flag": "🇱🇾", "continent": "Africa", "population": 6810000,
        "dominantReligions": [{"religion": "Islam (Sunni)", "percentage": 97.0}, {"religion": "Christianity (Secret/Expat)", "percentage": 2.5}, {"religion": "Other", "percentage": 0.5}],
        "christianPercentage": 2.5, "evangelicalPercentage": 0.3, "unreachedPopulationPercentage": 98.5, "unreachedPeopleGroupsCount": 19, "securityLevel": "Extreme",
        "primaryLanguages": ["Arabic (Libyan)", "Berber (Nafusi)", "Tuareg"], "capitalCity": "Tripoli", "isIn1040Window": True, "activeMissionariesCount": 6, "activePrayerWarriorsCount": 1400,
        "description": "Ancient Cyrene. Underground believers seek unity and protection amidst political fracture and armed conflicts.",
        "prayerPoints": ["Peace and stabilization across factions", "Protection for Libyan secret believers and migrant workers", "Gospel breakthroughs among desert Tuareg and Toubou tribes"],
        "missionOpportunities": ["Digital Arabic discipleship and online house churches", "Humanitarian relief for stranded refugees"]
    },
    {
        "id": "mdg", "code": "MG", "code3": "MDG", "name": "Madagascar", "flag": "🇲🇬", "continent": "Africa", "population": 29610000,
        "dominantReligions": [{"religion": "Christianity", "percentage": 58.0}, {"religion": "Traditional (Ancestral)", "percentage": 35.0}, {"religion": "Islam", "percentage": 7.0}],
        "christianPercentage": 58.0, "evangelicalPercentage": 14.5, "unreachedPopulationPercentage": 9.0, "unreachedPeopleGroupsCount": 9, "securityLevel": "Low",
        "primaryLanguages": ["Malagasy", "French"], "capitalCity": "Antananarivo", "isIn1040Window": False, "activeMissionariesCount": 75, "activePrayerWarriorsCount": 1650,
        "description": "A vast island with a dramatic history of Christian perseverance, experiencing fresh spiritual awakening and mission sending.",
        "prayerPoints": ["Deliverance from ancestral bone-turning rituals (Famadihana)", "Gospel movements among coastal Muslim Antankarana and Mikea forest dwellers", "Economic transformation and environmental restoration"],
        "missionOpportunities": ["Remote coastal sailing medical missions", "Rural primary school church plants"]
    },
    {
        "id": "mwi", "code": "MW", "code3": "MWI", "name": "Malawi", "flag": "🇲🇼", "continent": "Africa", "population": 20400000,
        "dominantReligions": [{"religion": "Christianity", "percentage": 77.3}, {"religion": "Islam", "percentage": 13.8}, {"religion": "Traditional / Other", "percentage": 8.9}],
        "christianPercentage": 77.3, "evangelicalPercentage": 27.2, "unreachedPopulationPercentage": 12.0, "unreachedPeopleGroupsCount": 4, "securityLevel": "Low",
        "primaryLanguages": ["English", "Chichewa", "Tumbuka", "Yao"], "capitalCity": "Lilongwe", "isIn1040Window": False, "activeMissionariesCount": 88, "activePrayerWarriorsCount": 1800,
        "description": "The 'Warm Heart of Africa'. Southern regions around Lake Malawi have large unreached Yao Muslim communities.",
        "prayerPoints": ["Breakthrough among 2.5 million Yao Muslims along Lake Malawi", "Pastoral training to disciple rural congregations against syncretism", "Famine and climate-resilience agricultural models"],
        "missionOpportunities": ["Yao Muslim outreach teams in Mangochi and Machinga", "Pastoral and Bible college leadership training"]
    },
    {
        "id": "mli", "code": "ML", "code3": "MLI", "name": "Mali", "flag": "🇲🇱", "continent": "Africa", "population": 22590000,
        "dominantReligions": [{"religion": "Islam (Sunni/Sufi)", "percentage": 94.8}, {"religion": "Christianity", "percentage": 2.8}, {"religion": "Traditional", "percentage": 2.4}],
        "christianPercentage": 2.8, "evangelicalPercentage": 0.9, "unreachedPopulationPercentage": 92.0, "unreachedPeopleGroupsCount": 41, "securityLevel": "Extreme",
        "primaryLanguages": ["French", "Bambara", "Fulfulde", "Songhai", "Dogon"], "capitalCity": "Bamako", "isIn1040Window": True, "activeMissionariesCount": 38, "activePrayerWarriorsCount": 1550,
        "description": "Home of historic Timbuktu. Believers in central and northern regions endure severe extremist insurgencies with steadfast testimony.",
        "prayerPoints": ["Protection for Dogon and Christian minority communities facing violence", "Church planting movements among 6 million Bambara and Tuareg nomads", "Openness of heart among Fulani herdsmen to Jesus"],
        "missionOpportunities": ["Radio and digital solar player scripture distribution", "Refugee relief in Mopti and Segou"]
    },
    {
        "id": "mrt", "code": "MR", "code3": "MRT", "name": "Mauritania", "flag": "🇲🇷", "continent": "Africa", "population": 4730000,
        "dominantReligions": [{"religion": "Islam (Sunni - 100% Official)", "percentage": 99.9}, {"religion": "Christianity (Secret/Expat)", "percentage": 0.1}],
        "christianPercentage": 0.1, "evangelicalPercentage": 0.05, "unreachedPopulationPercentage": 99.9, "unreachedPeopleGroupsCount": 14, "securityLevel": "Extreme",
        "primaryLanguages": ["Arabic (Hassaniya)", "Pulaar", "Soninke", "Wolof", "French"], "capitalCity": "Nouakchott", "isIn1040Window": True, "activeMissionariesCount": 5, "activePrayerWarriorsCount": 950,
        "description": "An Islamic Republic where 100% of citizens are legally recorded as Muslim. A tiny yet courageous underground fellowship persists.",
        "prayerPoints": ["Dreams and revelations of Christ among Hassaniya Arabs and Haratin", "Abolition of hereditary caste bondage and transformation through Christ", "Safety and endurance for secret believers in Nouakchott"],
        "missionOpportunities": ["Sub-Saharan diaspora healthcare and education", "Shortwave and internet digital ministry"]
    },
    {
        "id": "mus", "code": "MU", "code3": "MUS", "name": "Mauritius", "flag": "🇲🇺", "continent": "Africa", "population": 1260000,
        "dominantReligions": [{"religion": "Hinduism", "percentage": 48.5}, {"religion": "Christianity (Catholic)", "percentage": 26.3}, {"religion": "Islam", "percentage": 17.3}, {"religion": "Christianity (Protestant)", "percentage": 6.4}],
        "christianPercentage": 32.7, "evangelicalPercentage": 9.8, "unreachedPopulationPercentage": 42.0, "unreachedPeopleGroupsCount": 5, "securityLevel": "Low",
        "primaryLanguages": ["Mauritian Creole", "English", "French", "Bhojpuri"], "capitalCity": "Port Louis", "isIn1040Window": False, "activeMissionariesCount": 20, "activePrayerWarriorsCount": 480,
        "description": "A multicultural Indian Ocean crossroads. The only African nation with a Hindu majority, experiencing exciting church planting.",
        "prayerPoints": ["Gospel fruitfulness among Indo-Mauritian Hindu and Muslim communities", "Equipping Creole and Franco-Mauritian believers for cross-cultural missions", "Preserving island harmony and racial unity in Christ"],
        "missionOpportunities": ["Church planting in Hindi and Bhojpuri speaking areas", "University and youth creative arts ministry"]
    },
    {
        "id": "mar", "code": "MA", "code3": "MAR", "name": "Morocco", "flag": "🇲🇦", "continent": "Africa", "population": 37800000,
        "dominantReligions": [{"religion": "Islam (Sunni - Official)", "percentage": 99.0}, {"religion": "Christianity (Expatriate/Berber)", "percentage": 0.8}, {"religion": "Other", "percentage": 0.2}],
        "christianPercentage": 0.8, "evangelicalPercentage": 0.3, "unreachedPopulationPercentage": 98.8, "unreachedPeopleGroupsCount": 31, "securityLevel": "High",
        "primaryLanguages": ["Arabic (Moroccan Darija)", "Tamazight (Berber)", "French"], "capitalCity": "Rabat", "isIn1040Window": True, "activeMissionariesCount": 48, "activePrayerWarriorsCount": 2600,
        "description": "Gateway between Africa and Europe. Thousands of young Moroccans and Amazigh (Berber) people are finding Christ through digital media and dreams.",
        "prayerPoints": ["Full freedom of conscience and official church registration", "Multiplication of indigenous house churches in Casablanca, Fes, and Marrakech", "Bible translation and media discipleship in Central Atlas Tamazight and Tarifit"],
        "missionOpportunities": ["Online discipleship and digital follow-up teams", "Business-as-mission start-ups and eco-tourism initiatives", "Refugee transit care in northern coastal cities"]
    },
    {
        "id": "moz", "code": "MZ", "code3": "MOZ", "name": "Mozambique", "flag": "🇲🇿", "continent": "Africa", "population": 32970000,
        "dominantReligions": [{"religion": "Christianity", "percentage": 59.8}, {"religion": "Islam", "percentage": 18.9}, {"religion": "Traditional / None", "percentage": 21.3}],
        "christianPercentage": 59.8, "evangelicalPercentage": 16.5, "unreachedPopulationPercentage": 18.0, "unreachedPeopleGroupsCount": 15, "securityLevel": "Medium",
        "primaryLanguages": ["Portuguese", "Makhuwa", "Tsonga", "Sena", "Mwani"], "capitalCity": "Maputo", "isIn1040Window": True, "activeMissionariesCount": 140, "activePrayerWarriorsCount": 3100,
        "description": "Witnessed historic revivals. Facing insurgencies in northern Cabo Delgado, where Christians show extraordinary forgiveness.",
        "prayerPoints": ["Comfort and total restoration for families displaced in Cabo Delgado", "Breakthrough among unreached coastal Mwani and Makwe Muslim peoples", "Discipleship and spiritual depth for hundreds of thousands of new converts"],
        "missionOpportunities": ["Disaster relief, bush church planting, and medical missions", "Bush pastors mobile training schools"]
    },
    {
        "id": "nam", "code": "NA", "code3": "NAM", "name": "Namibia", "flag": "🇳🇦", "continent": "Africa", "population": 2600000,
        "dominantReligions": [{"religion": "Christianity (Lutheran/Catholic)", "percentage": 90.0}, {"religion": "Traditional", "percentage": 8.0}, {"religion": "Other", "percentage": 2.0}],
        "christianPercentage": 90.0, "evangelicalPercentage": 13.5, "unreachedPopulationPercentage": 1.5, "unreachedPeopleGroupsCount": 2, "securityLevel": "Low",
        "primaryLanguages": ["English", "Oshiwambo", "Afrikaans", "German"], "capitalCity": "Windhoek", "isIn1040Window": False, "activeMissionariesCount": 35, "activePrayerWarriorsCount": 560,
        "description": "Stunning desert nation with deep Christian roots, mobilizing workers for unreached pastoralist and San communities.",
        "prayerPoints": ["Revival of first love and discipleship in historic congregations", "Effective outreach to Himba and San nomadic desert tribes", "Sending Namibian mission teams to unreached parts of Angola and Zambia"],
        "missionOpportunities": ["Himba village outreach in Kunene region", "Youth campus ministry in Windhoek"]
    },
    {
        "id": "ner", "code": "NE", "code3": "NER", "name": "Niger", "flag": "🇳🇪", "continent": "Africa", "population": 26200000,
        "dominantReligions": [{"religion": "Islam (Sunni)", "percentage": 98.3}, {"religion": "Traditional", "percentage": 1.2}, {"religion": "Christianity", "percentage": 0.5}],
        "christianPercentage": 0.5, "evangelicalPercentage": 0.2, "unreachedPopulationPercentage": 97.0, "unreachedPeopleGroupsCount": 35, "securityLevel": "High",
        "primaryLanguages": ["French", "Hausa", "Zarma-Songhai", "Tamajaq (Tuareg)", "Fulfulde"], "capitalCity": "Niamey", "isIn1040Window": True, "activeMissionariesCount": 45, "activePrayerWarriorsCount": 1600,
        "description": "A Sahelian nation at the epicenter of the 10/40 window. The small Nigerien church is growing with courage and bold witness.",
        "prayerPoints": ["Spiritual breakthrough among 14 million Hausa, 5 million Zarma, and 2 million Tuareg", "Protection for Christian hospitals (Galmi) and schools", "Famine relief and deep wells for Sahara desert villages"],
        "missionOpportunities": ["Galmi and Niamey medical missionary teams", "Solar audio scripture players for nomadic camel herders"]
    },
    {
        "id": "nga", "code": "NG", "code3": "NGA", "name": "Nigeria", "flag": "🇳🇬", "continent": "Africa", "population": 224000000,
        "dominantReligions": [{"religion": "Christianity (Protestant/Catholic)", "percentage": 49.3}, {"religion": "Islam (Sunni)", "percentage": 48.8}, {"religion": "Traditional", "percentage": 1.9}],
        "christianPercentage": 49.3, "evangelicalPercentage": 31.0, "unreachedPopulationPercentage": 47.0, "unreachedPeopleGroupsCount": 68, "securityLevel": "High",
        "primaryLanguages": ["English", "Hausa", "Yoruba", "Igbo", "Fulfulde", "Kanuri"], "capitalCity": "Abuja", "isIn1040Window": True, "activeMissionariesCount": 1400, "activePrayerWarriorsCount": 24000,
        "description": "The giant of Africa and a powerhouse of global mission sending. Believers in the Middle Belt and North face severe persecution yet stand firm in prayer and revival.",
        "prayerPoints": ["Deliverance, protection, and comfort for persecuted believers in northern and Middle Belt states", "Spiritual breakthrough among 35 million Hausa, Kanuri, and Fulani Muslim peoples", "Empowering 10,000+ Nigerian missionaries serving across the Sahel and North Africa"],
        "missionOpportunities": ["Sahel mission training bases in Jos and Kaduna", "Northern agricultural and clean water church plants", "Displaced persons trauma counseling and rehabilitation"]
    },
    {
        "id": "rwa", "code": "RW", "code3": "RWA", "name": "Rwanda", "flag": "🇷🇼", "continent": "Africa", "population": 13780000,
        "dominantReligions": [{"religion": "Christianity (Catholic)", "percentage": 48.5}, {"religion": "Christianity (Protestant)", "percentage": 45.3}, {"religion": "Islam", "percentage": 4.6}, {"religion": "Traditional", "percentage": 1.6}],
        "christianPercentage": 93.8, "evangelicalPercentage": 30.5, "unreachedPopulationPercentage": 0.5, "unreachedPeopleGroupsCount": 1, "securityLevel": "Low",
        "primaryLanguages": ["Kinyarwanda", "French", "English", "Swahili"], "capitalCity": "Kigali", "isIn1040Window": False, "activeMissionariesCount": 70, "activePrayerWarriorsCount": 1900,
        "description": "A testimony of divine redemption and reconciliation, emerging as an innovative missionary sender to Central and East Africa.",
        "prayerPoints": ["Sustained generational healing and deep forgiveness in Christ", "Sound biblical grounding to guard against materialism", "Mobilizing youth to take the Gospel to the Horn of Africa"],
        "missionOpportunities": ["Peace, reconciliation, and trauma counseling institutes", "Tech-driven missional entrepreneurship in Kigali"]
    },
    {
        "id": "stp", "code": "ST", "code3": "STP", "name": "Sao Tome and Principe", "flag": "🇸🇹", "continent": "Africa", "population": 227000,
        "dominantReligions": [{"religion": "Christianity (Catholic)", "percentage": 70.0}, {"religion": "Christianity (Protestant)", "percentage": 15.0}, {"religion": "Other", "percentage": 15.0}],
        "christianPercentage": 85.0, "evangelicalPercentage": 11.0, "unreachedPopulationPercentage": 1.0, "unreachedPeopleGroupsCount": 1, "securityLevel": "Low",
        "primaryLanguages": ["Portuguese", "Forro", "Angolar"], "capitalCity": "São Tomé", "isIn1040Window": False, "activeMissionariesCount": 8, "activePrayerWarriorsCount": 220,
        "description": "A tropical island nation in the Gulf of Guinea with a peaceful culture and growing evangelical church networks.",
        "prayerPoints": ["Spiritual breakthrough against spiritism and occult remedies", "Discipleship for fathers and healthy biblical family structures", "Youth revival across plantation villages"],
        "missionOpportunities": ["Island community clinics and vocational training", "Radio and Christian literature ministry"]
    },
    {
        "id": "sen", "code": "SN", "code3": "SEN", "name": "Senegal", "flag": "🇸🇳", "continent": "Africa", "population": 17320000,
        "dominantReligions": [{"religion": "Islam (Sufi Brotherhoods)", "percentage": 95.9}, {"religion": "Christianity (Catholic/Protestant)", "percentage": 3.8}, {"religion": "Traditional", "percentage": 0.3}],
        "christianPercentage": 3.8, "evangelicalPercentage": 0.3, "unreachedPopulationPercentage": 92.5, "unreachedPeopleGroupsCount": 32, "securityLevel": "Low",
        "primaryLanguages": ["French", "Wolof", "Pulaar", "Serer", "Jola"], "capitalCity": "Dakar", "isIn1040Window": True, "activeMissionariesCount": 52, "activePrayerWarriorsCount": 1450,
        "description": "Known for Teranga (hospitality) and religious peace. The 7 million Wolof and 4 million Fula remain key unreached focus peoples.",
        "prayerPoints": ["Revelation of Jesus to leaders of Sufi brotherhoods (Tijaniyya, Mouride)", "Multiplication of underground Wolof house churches in Touba and Dakar", "Christian schools demonstrating genuine Christlike love"],
        "missionOpportunities": ["Wolof Bible translation and media outreach", "Pioneer mission stations in Casamance and eastern Senegal"]
    },
    {
        "id": "syc", "code": "SC", "code3": "SYC", "name": "Seychelles", "flag": "🇸🇨", "continent": "Africa", "population": 100000,
        "dominantReligions": [{"religion": "Christianity (Catholic)", "percentage": 76.2}, {"religion": "Christianity (Anglican)", "percentage": 10.6}, {"religion": "Other", "percentage": 13.2}],
        "christianPercentage": 86.8, "evangelicalPercentage": 8.5, "unreachedPopulationPercentage": 2.0, "unreachedPeopleGroupsCount": 1, "securityLevel": "Low",
        "primaryLanguages": ["Seychellois Creole", "English", "French"], "capitalCity": "Victoria", "isIn1040Window": False, "activeMissionariesCount": 5, "activePrayerWarriorsCount": 180,
        "description": "An Indian Ocean archipelago where churches seek to reach youth battling drug addiction and secular consumerism.",
        "prayerPoints": ["Healing of families and youth deliverance from substance abuse", "Revival in Catholic and Anglican congregations", "Vision to send missionaries to East African coastal islands"],
        "missionOpportunities": ["Teen and young adult rehabilitation ministries", "Island-wide worship and prayer gatherings"]
    },
    {
        "id": "sle", "code": "SL", "code3": "SLE", "name": "Sierra Leone", "flag": "🇸🇱", "continent": "Africa", "population": 8600000,
        "dominantReligions": [{"religion": "Islam", "percentage": 78.0}, {"religion": "Christianity", "percentage": 20.9}, {"religion": "Traditional", "percentage": 1.1}],
        "christianPercentage": 20.9, "evangelicalPercentage": 4.2, "unreachedPopulationPercentage": 68.0, "unreachedPeopleGroupsCount": 14, "securityLevel": "Low",
        "primaryLanguages": ["English", "Krio", "Mende", "Temne"], "capitalCity": "Freetown", "isIn1040Window": True, "activeMissionariesCount": 40, "activePrayerWarriorsCount": 1100,
        "description": "Historic haven for freed slaves (Freetown). Inter-religious harmony exists and evangelical churches are expanding into the interior.",
        "prayerPoints": ["Fruitful church planting among Temne, Mende, and Limba ethnic groups", "Christian leadership training and economic empowerment for youth", "Elimination of secret societies through the Gospel"],
        "missionOpportunities": ["Interior village community schools and clinics", "Krio and tribal audio scripture distribution"]
    },
    {
        "id": "som", "code": "SO", "code3": "SOM", "name": "Somalia", "flag": "🇸🇴", "continent": "Africa", "population": 17600000,
        "dominantReligions": [{"religion": "Islam (Sunni)", "percentage": 99.8}, {"religion": "Christianity", "percentage": 0.01}, {"religion": "Other", "percentage": 0.19}],
        "christianPercentage": 0.01, "evangelicalPercentage": 0.01, "unreachedPopulationPercentage": 99.9, "unreachedPeopleGroupsCount": 22, "securityLevel": "Extreme",
        "primaryLanguages": ["Somali", "Arabic"], "capitalCity": "Mogadishu", "isIn1040Window": True, "activeMissionariesCount": 4, "activePrayerWarriorsCount": 950,
        "description": "The Horn of Africa nation where tribal allegiance and strict laws leave less than a few hundred known believers. Faith requires utmost secrecy.",
        "prayerPoints": ["Spiritual breakthrough among clan elders and nomadic camel herders", "Audio Bibles to spread across desert trade routes", "Enduring courage for isolated Somali saints facing martyrdom"],
        "missionOpportunities": ["Somali diaspora outreach in Kenya, USA, and Europe", "Shortwave audio Gospel broadcasts"]
    },
    {
        "id": "zaf", "code": "ZA", "code3": "ZAF", "name": "South Africa", "flag": "🇿🇦", "continent": "Africa", "population": 60400000,
        "dominantReligions": [{"religion": "Christianity (Protestant/Zionist)", "percentage": 78.0}, {"religion": "Traditional", "percentage": 5.0}, {"religion": "Islam", "percentage": 2.0}, {"religion": "No Religion / Other", "percentage": 15.0}],
        "christianPercentage": 78.0, "evangelicalPercentage": 24.0, "unreachedPopulationPercentage": 4.5, "unreachedPeopleGroupsCount": 16, "securityLevel": "Medium",
        "primaryLanguages": ["IsiZulu", "IsiXhosa", "Afrikaans", "English", "Sepedi", "Setswana"], "capitalCity": "Pretoria (Administrative)", "isIn1040Window": False, "activeMissionariesCount": 520, "activePrayerWarriorsCount": 8400,
        "description": "The 'Rainbow Nation.' A premier missionary sending base in Southern Africa, with vibrant national prayer networks (e.g. Mighty Men, It's Time) contending for revival.",
        "prayerPoints": ["Deliverance from violent crime, corruption, and racial polarization", "Spiritual breakthrough in township communities and unreached migrant groups", "Mobilizing South African youth as missionaries into the Francophone and Lusophone Sahel"],
        "missionOpportunities": ["Township church planting and youth mentorship", "Cross-cultural mission training institutes in Cape Town and Pretoria", "Refugee diaspora outreach to Somali and Congolese immigrants"]
    },
    {
        "id": "ssd", "code": "SS", "code3": "SSD", "name": "South Sudan", "flag": "🇸🇸", "continent": "Africa", "population": 11090000,
        "dominantReligions": [{"religion": "Christianity", "percentage": 60.5}, {"religion": "Traditional / Animist", "percentage": 32.9}, {"religion": "Islam", "percentage": 6.2}],
        "christianPercentage": 60.5, "evangelicalPercentage": 18.0, "unreachedPopulationPercentage": 22.0, "unreachedPeopleGroupsCount": 20, "securityLevel": "Extreme",
        "primaryLanguages": ["English", "Juba Arabic", "Dinka", "Nuer", "Zande"], "capitalCity": "Juba", "isIn1040Window": True, "activeMissionariesCount": 45, "activePrayerWarriorsCount": 1750,
        "description": "The world's newest sovereign state. Pastors and intercessors lead efforts to unite tribal factions around the Cross.",
        "prayerPoints": ["End to inter-ethnic warfare, cattle raiding, and factionalism", "Discipleship and trauma therapy for war-affected children", "Outreach to unreached Nilotic and Toposa desert tribes"],
        "missionOpportunities": ["Trauma healing and emergency food distribution", "Aviation and mobile medical missionary clinics"]
    },
    {
        "id": "sdn", "code": "SD", "code3": "SDN", "name": "Sudan", "flag": "🇸🇩", "continent": "Africa", "population": 46870000,
        "dominantReligions": [{"religion": "Islam (Sunni - Official)", "percentage": 91.0}, {"religion": "Christianity", "percentage": 5.4}, {"religion": "Traditional", "percentage": 3.6}],
        "christianPercentage": 5.4, "evangelicalPercentage": 1.8, "unreachedPopulationPercentage": 90.0, "unreachedPeopleGroupsCount": 118, "securityLevel": "Extreme",
        "primaryLanguages": ["Arabic (Sudanese)", "English", "Nubian", "Beja", "Fur"], "capitalCity": "Khartoum", "isIn1040Window": True, "activeMissionariesCount": 15, "activePrayerWarriorsCount": 2100,
        "description": "Historic Nubian Christian kingdom before conquest. Believers courageously distribute food and share Christ amidst acute conflict.",
        "prayerPoints": ["Immediate cessation of civil warfare and protection of civilians", "Breakthrough among 118 unreached ethnic groups in Darfur and Kordofan", "Perseverance for persecuted church leaders in Khartoum"],
        "missionOpportunities": ["Emergency relief and medical outreach in Port Sudan", "Digital Arabic Gospel broadcasts and underground church planting"]
    },
    {
        "id": "tza", "code": "TZ", "code3": "TZA", "name": "Tanzania", "flag": "🇹🇿", "continent": "Africa", "population": 65500000,
        "dominantReligions": [{"religion": "Christianity", "percentage": 63.1}, {"religion": "Islam", "percentage": 34.1}, {"religion": "Traditional / Other", "percentage": 2.8}],
        "christianPercentage": 63.1, "evangelicalPercentage": 18.2, "unreachedPopulationPercentage": 18.0, "unreachedPeopleGroupsCount": 30, "securityLevel": "Low",
        "primaryLanguages": ["Swahili", "English", "Sukuma", "Maasai"], "capitalCity": "Dodoma", "isIn1040Window": True, "activeMissionariesCount": 180, "activePrayerWarriorsCount": 4200,
        "description": "A peaceful East African anchor with strong mainland churches. The semi-autonomous island of Zanzibar is 99% Muslim and a frontier priority.",
        "prayerPoints": ["Gospel breakthrough in Zanzibar and coastal Swahili-Arab communities", "Missionary mobilization to reach Maasai, Hadzabe, and Datooga tribes", "Biblical training to counter syncretism with witchcraft in rural areas"],
        "missionOpportunities": ["Zanzibar underground church support and discipleship", "Maasai and pastoralist church planting initiatives"]
    },
    {
        "id": "tgo", "code": "TG", "code3": "TGO", "name": "Togo", "flag": "🇹🇬", "continent": "Africa", "population": 8850000,
        "dominantReligions": [{"religion": "Christianity", "percentage": 43.7}, {"religion": "Traditional / Vodun", "percentage": 35.6}, {"religion": "Islam", "percentage": 20.0}],
        "christianPercentage": 43.7, "evangelicalPercentage": 11.0, "unreachedPopulationPercentage": 28.0, "unreachedPeopleGroupsCount": 15, "securityLevel": "Low",
        "primaryLanguages": ["French", "Ewe", "Kabiye", "Moba"], "capitalCity": "Lomé", "isIn1040Window": True, "activeMissionariesCount": 48, "activePrayerWarriorsCount": 1200,
        "description": "Historic Vodun animist capital contrasts with active Christian hospital ministries (Hospital of Hope in Mango).",
        "prayerPoints": ["Spiritual deliverance from fear of ancestral curses", "Church planting movements among northern Moba and Kotokoli peoples", "Fruitfulness for Christian medical missions in Mango"],
        "missionOpportunities": ["Medical missionary service in northern Togo", "Audio Bible and film evangelism in Kabiye and Ewe"]
    },
    {
        "id": "tun", "code": "TN", "code3": "TUN", "name": "Tunisia", "flag": "🇹🇳", "continent": "Africa", "population": 12360000,
        "dominantReligions": [{"religion": "Islam (Sunni)", "percentage": 99.0}, {"religion": "Christianity", "percentage": 0.5}, {"religion": "Other", "percentage": 0.5}],
        "christianPercentage": 0.5, "evangelicalPercentage": 0.1, "unreachedPopulationPercentage": 99.2, "unreachedPeopleGroupsCount": 14, "securityLevel": "High",
        "primaryLanguages": ["Arabic (Tunisian)", "French", "Berber (Shelha)"], "capitalCity": "Tunis", "isIn1040Window": True, "activeMissionariesCount": 18, "activePrayerWarriorsCount": 1150,
        "description": "Ancient Carthage, birthplace of Tertullian. Today experiencing spiritual searchings among educated youth through digital media.",
        "prayerPoints": ["Protection and growth for emerging indigenous Tunisian house churches", "Fruitful internet scripture dialogues with young seekers", "Breakthrough among southern desert Berber populations"],
        "missionOpportunities": ["Digital discipleship in Tunisian Arabic", "Business-as-mission start-ups and language schools"]
    },
    {
        "id": "uga", "code": "UG", "code3": "UGA", "name": "Uganda", "flag": "🇺🇬", "continent": "Africa", "population": 47250000,
        "dominantReligions": [{"religion": "Christianity (Catholic/Anglican)", "percentage": 84.5}, {"religion": "Islam", "percentage": 13.7}, {"religion": "Traditional", "percentage": 1.8}],
        "christianPercentage": 84.5, "evangelicalPercentage": 37.0, "unreachedPopulationPercentage": 4.0, "unreachedPeopleGroupsCount": 6, "securityLevel": "Low",
        "primaryLanguages": ["English", "Luganda", "Swahili", "Runyankole", "Acholi"], "capitalCity": "Kampala", "isIn1040Window": False, "activeMissionariesCount": 220, "activePrayerWarriorsCount": 4800,
        "description": "Site of 20th-century revivals and prayer movements. Uganda hosts Africa's largest refugee population and sends hundreds of missionaries.",
        "prayerPoints": ["Gospel outreach in northern refugee settlements", "Reaching unreached Muslim groups in eastern Uganda and Karamoja pastoralists", "Raising ethical leaders in politics and business"],
        "missionOpportunities": ["Refugee settlement church planting and trauma counseling", "Cross-border missions into South Sudan and DR Congo"]
    },
    {
        "id": "zmb", "code": "ZM", "code3": "ZMB", "name": "Zambia", "flag": "🇿🇲", "continent": "Africa", "population": 20020000,
        "dominantReligions": [{"religion": "Christianity (Protestant/Catholic)", "percentage": 95.5}, {"religion": "Islam / Traditional", "percentage": 4.5}],
        "christianPercentage": 95.5, "evangelicalPercentage": 26.0, "unreachedPopulationPercentage": 1.0, "unreachedPeopleGroupsCount": 2, "securityLevel": "Low",
        "primaryLanguages": ["English", "Bemba", "Nyanja", "Tonga", "Lozi"], "capitalCity": "Lusaka", "isIn1040Window": False, "activeMissionariesCount": 110, "activePrayerWarriorsCount": 2400,
        "description": "Constitutionally designated a Christian nation, actively sending teachers, evangelists, and church planters across Southern and Central Africa.",
        "prayerPoints": ["Deepening theological maturity and discipleship across copperbelt churches", "Outreach to remote western plains along the Zambezi River", "Equipping youth for vocational entrepreneurship with Kingdom values"],
        "missionOpportunities": ["Theological training and Christian education colleges", "Rural solar water well and church planting projects"]
    },
    {
        "id": "zwe", "code": "ZW", "code3": "ZWE", "name": "Zimbabwe", "flag": "🇿🇼", "continent": "Africa", "population": 16320000,
        "dominantReligions": [{"religion": "Christianity (Protestant/Apostolic)", "percentage": 85.0}, {"religion": "Traditional", "percentage": 12.0}, {"religion": "Other", "percentage": 3.0}],
        "christianPercentage": 85.0, "evangelicalPercentage": 31.0, "unreachedPopulationPercentage": 1.5, "unreachedPeopleGroupsCount": 2, "securityLevel": "Low",
        "primaryLanguages": ["English", "Shona", "Ndebele"], "capitalCity": "Harare", "isIn1040Window": False, "activeMissionariesCount": 95, "activePrayerWarriorsCount": 2100,
        "description": "Possesses a strong Christian heritage and high literacy. Believers demonstrate extraordinary resilience through economic hardships and prayer vigils.",
        "prayerPoints": ["Economic revitalization and honest governance across public sectors", "Rooting out syncretistic practices in white-garment Apostolic sects", "Sending trained Zimbabwean missionaries to Portuguese and French-speaking nations"],
        "missionOpportunities": ["Pastoral leadership coaching in Harare and Bulawayo", "Community agricultural development and orphan feeding centers"]
    }
]

print(f"Total African countries defined: {len(RAW_COUNTRIES)}")
