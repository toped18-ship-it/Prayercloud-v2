const fs = require('fs');

// We have the complete data array of all 195 sovereign nations of the world
const data = require('./raw195Countries.json');

const tsContent = `import { Country } from '../types';

export const ALL_COUNTRIES: Country[] = ${JSON.stringify(data, null, 2)};

// Helper to get total global summary stats
export const GLOBAL_MISSION_STATS = {
  totalCountries: 195,
  totalPopulation: 8050000000,
  totalUnreachedPeoples: 7420,
  unreachedPopulationTotal: 3410000000, // ~42% of world
  activeMissionariesWorldwide: 430000,
  frontierMissionariesEstimated: 14200, // only ~3.3% in unreached
  prayerWarriorsOnPrayerCloud: 128450,
  active247PrayerRooms: 48,
  countriesCoveredByDailyIntercession: 195,
  languagesNeedingBibleTranslation: 1260
};
`;

fs.writeFileSync('src/data/countriesData.ts', tsContent);
console.log('Successfully generated src/data/countriesData.ts with ' + data.length + ' countries.');
