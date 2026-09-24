import React, { useState, useMemo } from 'react';
import { Country } from '../types';
import { Search, Filter, Globe, Flame, ShieldAlert, ArrowUpDown, ChevronRight, HeartHandshake, Eye, Sparkles } from 'lucide-react';

interface CountriesDirectoryPageProps {
  countries: Country[];
  onSelectCountry: (countryCode: string) => void;
}

export const CountriesDirectoryPage: React.FC<CountriesDirectoryPageProps> = ({
  countries,
  onSelectCountry
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [selectedReligion, setSelectedReligion] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [filter1040Only, setFilter1040Only] = useState(false);
  const [sortBy, setSortBy] = useState<'unreached' | 'population' | 'upgs' | 'christian' | 'name'>('unreached');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const continents = ['All', 'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];
  const religions = ['All', 'Islam', 'Hinduism', 'Buddhism', 'Christianity', 'Secular / Agnostic', 'Traditional'];
  const riskLevels = ['All', 'Extreme', 'High', 'Medium', 'Low'];

  const filteredCountries = useMemo(() => {
    return countries.filter(c => {
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesCode = c.code.toLowerCase().includes(q) || c.code3.toLowerCase().includes(q);
        const matchesLang = c.primaryLanguages.some(l => l.toLowerCase().includes(q));
        const matchesCapital = c.capitalCity.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesLang && !matchesCapital) return false;
      }

      // Continent filter
      if (selectedContinent !== 'All') {
        if (selectedContinent === 'Americas') {
          if (c.continent !== 'North America' && c.continent !== 'South America') return false;
        } else if (c.continent !== selectedContinent) {
          return false;
        }
      }

      // Religion filter
      if (selectedReligion !== 'All') {
        const hasReligion = c.dominantReligions.some(r => r.religion.toLowerCase().includes(selectedReligion.toLowerCase()));
        if (!hasReligion) return false;
      }

      // Risk filter
      if (selectedRisk !== 'All') {
        if (c.securityLevel !== selectedRisk) return false;
      }

      // 10/40 window
      if (filter1040Only && !c.isIn1040Window) return false;

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'unreached') {
        comparison = a.unreachedPopulationPercentage - b.unreachedPopulationPercentage;
      } else if (sortBy === 'population') {
        comparison = a.population - b.population;
      } else if (sortBy === 'upgs') {
        comparison = a.unreachedPeopleGroupsCount - b.unreachedPeopleGroupsCount;
      } else if (sortBy === 'christian') {
        comparison = a.christianPercentage - b.christianPercentage;
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [countries, searchQuery, selectedContinent, selectedReligion, selectedRisk, filter1040Only, sortBy, sortOrder]);

  const toggleSort = (type: typeof sortBy) => {
    if (sortBy === type) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Global Countries Directory (195)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete missional profiles, religious freedom indices, unreached counts, and prayer directives.
          </p>
        </div>

        {/* 10/40 Quick Filter */}
        <button
          onClick={() => setFilter1040Only(!filter1040Only)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
            filter1040Only
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>{filter1040Only ? 'Showing 10/40 Window Only' : 'Filter 10/40 Window'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        
        {/* Search row */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by country name, language, capital city, or ISO code..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          
          {/* Continent */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Continent
            </label>
            <select
              value={selectedContinent}
              onChange={(e) => setSelectedContinent(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              {continents.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Dominant Religion */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Main Religion
            </label>
            <select
              value={selectedReligion}
              onChange={(e) => setSelectedReligion(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              {religions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Persecution / Risk Level */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Security / Risk
            </label>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              {riskLevels.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Sort selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Sort Criteria
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              <option value="unreached">Unreached % (High to Low)</option>
              <option value="upgs">Unreached Tribes Count</option>
              <option value="population">Total Population</option>
              <option value="christian">Christian %</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Quick Stats */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong className="text-slate-900 dark:text-white">{filteredCountries.length}</strong> of 195 nations</span>
        <span>Click any nation to open complete missional dossier</span>
      </div>

      {/* Countries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCountries.map((c) => {
          const isHighUnreached = c.unreachedPopulationPercentage >= 70;
          const isExtremeRisk = c.securityLevel === 'Extreme';

          return (
            <div
              key={c.id}
              onClick={() => onSelectCountry(c.code)}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Flag & Title Row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl shadow-sm rounded-lg p-1 bg-slate-50 dark:bg-slate-800">
                      {c.flag}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {c.name}
                        </h3>
                        {c.isIn1040Window && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded border border-amber-500/30">
                            10/40
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {c.continent} · Capital: {c.capitalCity}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isExtremeRisk
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/40'
                      : c.securityLevel === 'High'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}>
                    {c.securityLevel} Risk
                  </span>
                </div>

                {/* Metrics 3-Grid */}
                <div className="grid grid-cols-3 gap-2 my-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-center">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Unreached</div>
                    <div className={`text-sm font-bold font-mono-data ${isHighUnreached ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200'}`}>
                      {c.unreachedPopulationPercentage}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">UPGs</div>
                    <div className="text-sm font-bold font-mono-data text-red-500">
                      {c.unreachedPeopleGroupsCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Christian</div>
                    <div className="text-sm font-bold font-mono-data text-blue-600 dark:text-blue-400">
                      {c.christianPercentage}%
                    </div>
                  </div>
                </div>

                {/* Dominant Religion & Primary Languages */}
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Main Religion:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                      {c.dominantReligions.map(r => r.religion).join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Languages:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                      {c.primaryLanguages.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                <span className="flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>{c.activePrayerWarriorsCount} Intercessors</span>
                </span>
                <div className="flex items-center gap-1">
                  <span>Open Dossier</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
