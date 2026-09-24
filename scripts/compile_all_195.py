import json
import os
import sys

from africa_countries import AFRICA_COUNTRIES
from europe_countries import EUROPE_COUNTRIES
from americas_countries import AMERICAS_COUNTRIES
from oceania_countries import OCEANIA_COUNTRIES
from asia_countries import ASIA_COUNTRIES

all_countries = []
all_countries.extend(AFRICA_COUNTRIES)
all_countries.extend(EUROPE_COUNTRIES)
all_countries.extend(AMERICAS_COUNTRIES)
all_countries.extend(OCEANIA_COUNTRIES)
all_countries.extend(ASIA_COUNTRIES)

print(f"Total compiled countries: {len(all_countries)}")

# Check for unique IDs and codes
seen_ids = set()
seen_codes = set()
duplicates = []

for c in all_countries:
    if c['id'] in seen_ids:
        duplicates.append(('id', c['id'], c['name']))
    seen_ids.add(c['id'])
    
    if c['code'] in seen_codes:
        duplicates.append(('code', c['code'], c['name']))
    seen_codes.add(c['code'])

if duplicates:
    print(f"WARNING: Found duplicates: {duplicates}")
else:
    print("All IDs and country codes are 100% unique.")

# Sort alphabetically by country name
all_countries.sort(key=lambda x: x['name'])

# Calculate global stats
total_population = sum(c['population'] for c in all_countries)
total_upg_count = sum(c['unreachedPeopleGroupsCount'] for c in all_countries)
window_1040_count = sum(1 for c in all_countries if c['isIn1040Window'])

# Generate TypeScript file
ts_content = f'''import {{ Country, GlobalMissionStats }} from '../types';

export const GLOBAL_MISSION_STATS: GlobalMissionStats = {{
  totalWorldPopulation: {total_population},
  totalUnreachedPeopleGroups: {total_upg_count},
  total1040WindowCountries: {window_1040_count},
  globalChristianPercentage: 31.2,
  globalEvangelicalPercentage: 8.4,
  unreachedPopulationTotal: 3350000000,
  activeFrontierMissionaries: 43000,
  globalPrayerWarriorsCount: 1450000
}};

export const ALL_COUNTRIES: Country[] = {json.dumps(all_countries, indent=2, ensure_ascii=False)};
'''

# Fix any TypeScript formatting
target_file = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'countriesData.ts'))
with open(target_file, 'w', encoding='utf-8') as f:
    f.write(ts_content.replace("{Country, GlobalMissionStats}", "{ Country, GlobalMissionStats }"))

print(f"Successfully generated {target_file} with {len(all_countries)} countries!")
