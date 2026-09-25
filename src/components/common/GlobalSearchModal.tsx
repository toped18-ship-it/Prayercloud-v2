import React, { useState, useEffect, useMemo } from 'react';
import { Search, Globe, MapPin, HeartHandshake, FileText, BookOpen, User as UserIcon, X, ArrowRight } from 'lucide-react';
import { storage } from '../../services/storageService';
import { Country, UnreachedPlace, PrayerRequest, MissionReport, MissionaryResource } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string, param?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const countries = useMemo(() => storage.getCountries(), [isOpen]);
  const places = useMemo(() => storage.getUnreachedPlaces(), [isOpen]);
  const prayers = useMemo(() => storage.getPrayerRequests(), [isOpen]);
  const reports = useMemo(() => storage.getMissionReports(), [isOpen]);
  const resources = useMemo(() => storage.getResources(), [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredCountries = q
    ? countries.filter(c => c.name.toLowerCase().includes(q) || c.primaryLanguages.some(l => l.toLowerCase().includes(q)) || c.continent.toLowerCase().includes(q)).slice(0, 4)
    : countries.slice(0, 3);

  const filteredPlaces = q
    ? places.filter(p => p.name.toLowerCase().includes(q) || p.countryName.toLowerCase().includes(q) || p.mainReligion.toLowerCase().includes(q)).slice(0, 4)
    : places.slice(0, 3);

  const filteredPrayers = q
    ? prayers.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.targetCountry && p.targetCountry.toLowerCase().includes(q))).slice(0, 3)
    : [];

  const filteredReports = q
    ? reports.filter(r => r.title.toLowerCase().includes(q) || r.country.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q)).slice(0, 2)
    : [];

  const filteredResources = q
    ? resources.filter(res => res.title.toLowerCase().includes(q) || res.category.toLowerCase().includes(q)).slice(0, 2)
    : [];

  const handleSelect = (page: string, param?: string) => {
    onNavigate(page, param);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 195 countries, unreached tribes, prayer requests, mission reports, resources..."
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none text-base"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-200"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-5">
          {/* Quick Hub Launchers */}
          {(!q || 'devotional'.includes(q) || 'bible'.includes(q) || 'scripture union'.includes(q) || 'su'.includes(q)) && (
            <div className="p-3 bg-gradient-to-r from-amber-500/10 to-blue-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">
                    Scripture Union (SU) Devotional & Holy Bible Hub
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Daily Guide, Encounter with God, 66-Book Bible reader & Spiritual Journal
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleSelect('devotionals')}
                className="px-3.5 py-1.5 bg-[#0e71eb] text-white font-bold text-xs rounded-xl shadow shrink-0"
              >
                Open Hub
              </button>
            </div>
          )}

          {/* Countries Section */}
          {filteredCountries.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <span>Countries of the World ({filteredCountries.length})</span>
                <span className="text-[11px] font-normal text-blue-600 dark:text-blue-400">195 Sovereign Nations</span>
              </div>
              <div className="space-y-1">
                {filteredCountries.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelect('country', c.code)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <div className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {c.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {c.continent} · {c.unreachedPopulationPercentage}% Unreached · {c.unreachedPeopleGroupsCount} UPGs
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Unreached Places Section */}
          {filteredPlaces.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Unreached Tribes & Places ({filteredPlaces.length})
              </div>
              <div className="space-y-1">
                {filteredPlaces.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect('unreached-places', p.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-700 dark:text-amber-300">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-amber-600">
                          {p.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {p.type} in {p.countryName} · {(p.population / 1000000).toFixed(1)}M Pop · {p.mainReligion}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono-data text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded">
                      {p.percentEvangelical}% Gospel
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Prayer Requests Section */}
          {filteredPrayers.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Active Prayer Requests ({filteredPrayers.length})
              </div>
              <div className="space-y-1">
                {filteredPrayers.map((pr) => (
                  <button
                    key={pr.id}
                    onClick={() => handleSelect('prayer-requests', pr.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <HeartHandshake className="w-4 h-4 text-rose-500 shrink-0" />
                      <div className="truncate max-w-md">
                        <div className="font-medium text-xs text-slate-900 dark:text-white truncate">
                          {pr.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {pr.targetCountry || 'Global'} · {pr.prayedCount} Believers Prayed
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mission Reports */}
          {filteredReports.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Field Mission Reports
              </div>
              <div className="space-y-1">
                {filteredReports.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelect('reports', r.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="truncate max-w-md">
                        <div className="font-medium text-xs text-slate-900 dark:text-white truncate">{r.title}</div>
                        <div className="text-[11px] text-slate-500">{r.country} · By {r.missionaryName}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {filteredResources.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Missionary Resources
              </div>
              <div className="space-y-1">
                {filteredResources.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => handleSelect('resources', res.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/30 text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-purple-500 shrink-0" />
                      <div className="truncate max-w-md">
                        <div className="font-medium text-xs text-slate-900 dark:text-white truncate">{res.title}</div>
                        <div className="text-[11px] text-slate-500">{res.category} · {res.fileType} ({res.fileSize})</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[10px]">↓</kbd> to navigate</span>
            <span>Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[10px]">ESC</kbd> to close</span>
          </div>
          <span className="text-blue-600 dark:text-blue-400 font-medium">PRAYERCLOUD Global Directory</span>
        </div>
      </div>
    </div>
  );
};
