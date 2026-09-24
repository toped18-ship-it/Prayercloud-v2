import React, { useState, useMemo } from 'react';
import { Country, UnreachedPlace } from '../types';
import { InteractiveWorldMap } from '../components/map/InteractiveWorldMap';
import {
  Globe,
  Flame,
  CheckCircle2,
  XCircle,
  Users,
  Search,
  PieChart,
  BarChart3,
  HeartHandshake,
  ArrowRight,
  BookOpen,
  Filter
} from 'lucide-react';

interface WorldMapPageProps {
  countries: Country[];
  places: UnreachedPlace[];
  onSelectCountry: (countryCode: string) => void;
  onSelectPlace: (placeId: string) => void;
  onOpenCreatePrayer?: (context?: string) => void;
}

export const WorldMapPage: React.FC<WorldMapPageProps> = ({
  countries,
  places,
  onSelectCountry,
  onSelectPlace,
  onOpenCreatePrayer
}) => {
  const [tableFilter, setTableFilter] = useState<'all' | 'unreached' | 'reached'>('all');
  const [tableReligionFilter, setTableReligionFilter] = useState<string>('all');
  const [tableSearch, setTableSearch] = useState('');

  // Global aggregates
  const totalWorldPopulation = useMemo(() => {
    return countries.reduce((acc, c) => acc + c.population, 0);
  }, [countries]);

  const totalUnreachedPeopleGroups = useMemo(() => {
    return countries.reduce((acc, c) => acc + c.unreachedPeopleGroupsCount, 0);
  }, [countries]);

  const unreachedCountriesCount = useMemo(() => {
    return countries.filter(c => c.unreachedPopulationPercentage >= 50 || c.evangelicalPercentage < 2).length;
  }, [countries]);

  const reachedCountriesCount = countries.length - unreachedCountriesCount;

  // Filtered list for the comprehensive directory table below the map
  const filteredList = useMemo(() => {
    return countries.filter(c => {
      const isUnreached = c.unreachedPopulationPercentage >= 50 || c.evangelicalPercentage < 2;
      
      if (tableFilter === 'unreached' && !isUnreached) return false;
      if (tableFilter === 'reached' && isUnreached) return false;

      if (tableReligionFilter !== 'all') {
        const hasReligion = c.dominantReligions?.some(r =>
          r.religion.toLowerCase().includes(tableReligionFilter.toLowerCase())
        );
        if (!hasReligion) return false;
      }

      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.continent.toLowerCase().includes(q) ||
          c.dominantReligions?.some(r => r.religion.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [countries, tableFilter, tableReligionFilter, tableSearch]);

  const getReligionBarColor = (rel: string) => {
    const r = rel.toLowerCase();
    if (r.includes('islam') || r.includes('muslim')) return '#10b981';
    if (r.includes('hindu')) return '#f59e0b';
    if (r.includes('buddh')) return '#f97316';
    if (r.includes('christ') || r.includes('orthodox') || r.includes('catholic') || r.includes('protestant')) return '#3b82f6';
    if (r.includes('animis') || r.includes('ethnic') || r.includes('tribal') || r.includes('folk')) return '#a855f7';
    if (r.includes('secular') || r.includes('non') || r.includes('agnostic') || r.includes('atheist')) return '#64748b';
    return '#14b8a6';
  };

  return (
    <div className="space-y-8 pb-20 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-7 h-7 text-[#0e71eb]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Global Frontier Map & Religion Statistics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tracking reached & unreached places in the whole world, gospel accessibility status, and comprehensive religion statistics.
          </p>
        </div>

        {/* Aggregate Badges */}
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <div className="text-xs">
              <span className="text-slate-500 dark:text-slate-400">Unreached Nations: </span>
              <strong className="text-red-600 dark:text-red-400 font-bold">{unreachedCountriesCount}</strong>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <div className="text-xs">
              <span className="text-slate-500 dark:text-slate-400">Reached Nations: </span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{reachedCountriesCount}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Global Religion Breakdown Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Islam', share: '25.1%', color: 'border-emerald-500 text-emerald-600 dark:text-emerald-400', icon: '☪️' },
          { label: 'Christianity', share: '31.2%', color: 'border-blue-500 text-blue-600 dark:text-blue-400', icon: '✝️' },
          { label: 'Hinduism', share: '15.2%', color: 'border-amber-500 text-amber-600 dark:text-amber-400', icon: '🕉️' },
          { label: 'Buddhism', share: '6.8%', color: 'border-orange-500 text-orange-600 dark:text-orange-400', icon: '☸️' },
          { label: 'Tribal / Ethnic', share: '5.7%', color: 'border-purple-500 text-purple-600 dark:text-purple-400', icon: '🌿' },
          { label: 'Non-Religious', share: '16.0%', color: 'border-slate-500 text-slate-600 dark:text-slate-400', icon: '⚛️' }
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] shadow-sm space-y-1"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300">{item.icon} {item.label}</span>
            </div>
            <div className={`text-xl font-extrabold font-mono ${item.color}`}>
              {item.share}
            </div>
            <div className="text-[10px] text-slate-400">Global Share</div>
          </div>
        ))}
      </div>

      {/* Main Interactive World Map Component */}
      <InteractiveWorldMap
        countries={countries}
        places={places}
        onSelectCountry={onSelectCountry}
        onSelectPlace={onSelectPlace}
        onOpenCreatePrayer={onOpenCreatePrayer}
      />

      {/* Comprehensive Country & Place Religion Statistics Directory Table */}
      <div className="bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] shadow-lg p-6 space-y-5">
        
        {/* Table Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#262f43]">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#0e71eb]" />
              <span>Worldwide Reach Status & Religion Statistics Directory</span>
            </h3>
            <p className="text-xs text-slate-500">
              Detailed demographic breakdown for all 195 sovereign nations and frontier places
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Tabs */}
            <div className="flex bg-slate-100 dark:bg-[#1f2738] p-1 rounded-xl">
              {(['all', 'unreached', 'reached'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setTableFilter(tab)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                    tableFilter === tab
                      ? 'bg-[#0e71eb] text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search country or religion..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-[#1f2738] text-slate-700 dark:text-slate-300 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-[#2a3449]">
              <tr>
                <th className="p-3.5 rounded-l-xl">Country / Territory</th>
                <th className="p-3.5">Reach Status</th>
                <th className="p-3.5 min-w-[220px]">Religion Statistics (%)</th>
                <th className="p-3.5">Evangelical %</th>
                <th className="p-3.5">Unreached UPGs</th>
                <th className="p-3.5">Population</th>
                <th className="p-3.5 rounded-r-xl text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#232a3b]">
              {filteredList.map((country) => {
                const isUnreached = country.unreachedPopulationPercentage >= 50 || country.evangelicalPercentage < 2;

                return (
                  <tr
                    key={country.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-[#1a2130] transition-colors"
                  >
                    {/* Country Name */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        <span className="text-base">{country.flag}</span>
                        <span>{country.name}</span>
                        <span className="text-[10px] font-normal text-slate-400">({country.continent})</span>
                      </div>
                    </td>

                    {/* Reach Status */}
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        isUnreached
                          ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900'
                          : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                      }`}>
                        {isUnreached ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                            <span>UNREACHED</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>REACHED</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Religion Statistics Bar */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                          {country.dominantReligions?.map((r, i) => (
                            <span key={i} className="whitespace-nowrap">
                              {r.religion}: <strong>{r.percentage}%</strong>{i < (country.dominantReligions?.length || 1) - 1 ? ' · ' : ''}
                            </span>
                          ))}
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-[#232d42] rounded-full overflow-hidden flex">
                          {country.dominantReligions?.map((r, i) => (
                            <div
                              key={i}
                              style={{
                                width: `${r.percentage}%`,
                                backgroundColor: getReligionBarColor(r.religion)
                              }}
                              title={`${r.religion}: ${r.percentage}%`}
                            />
                          ))}
                        </div>
                      </div>
                    </td>

                    {/* Evangelical % */}
                    <td className="p-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {country.evangelicalPercentage}%
                    </td>

                    {/* Unreached People Groups Count */}
                    <td className="p-3.5 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {country.unreachedPeopleGroupsCount}
                    </td>

                    {/* Population */}
                    <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300">
                      {country.population.toLocaleString()}
                    </td>

                    {/* Action */}
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onSelectCountry(country.code)}
                        className="px-3 py-1.5 bg-[#0e71eb] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1 shadow-sm"
                      >
                        <span>Profile</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
