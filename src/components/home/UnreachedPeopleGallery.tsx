import React, { useState, useMemo } from 'react';
import {
  Flame,
  Globe,
  Heart,
  Users,
  Search,
  ArrowRight,
  Shield,
  BookOpen,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2,
  ExternalLink,
  MapPin,
  ImageOff
} from 'lucide-react';
import { UNREACHED_PLACES_DATA } from '../../data/unreachedPlacesData';
import { UnreachedPlace } from '../../types';

interface UnreachedPeopleGalleryProps {
  onSelectCountry?: (countryCode: string) => void;
  onOpenCreatePrayer?: () => void;
}

export const UnreachedPeopleGallery: React.FC<UnreachedPeopleGalleryProps> = ({
  onSelectCountry,
  onOpenCreatePrayer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReligion, setSelectedReligion] = useState<string>('All');
  const [prayedGroups, setPrayedGroups] = useState<Record<string, boolean>>({});
  const [selectedGroupModal, setSelectedGroupModal] = useState<UnreachedPlace | null>(null);

  // Religions list for filtering
  const religions = ['All', 'Islam', 'Buddhism', 'Hinduism', 'Ethnic'];

  const filteredGroups = useMemo(() => {
    return UNREACHED_PLACES_DATA.filter((group) => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.languages.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesReligion =
        selectedReligion === 'All' ||
        group.mainReligion.toLowerCase().includes(selectedReligion.toLowerCase());

      return matchesSearch && matchesReligion;
    });
  }, [searchTerm, selectedReligion]);

  const handlePrayClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPrayedGroups(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Mission Statement */}
      <div className="bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-600 dark:text-amber-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
              <span>Frontier Peoples Initiative</span>
              <span className="text-slate-400">·</span>
              <span>10/40 Window Priority</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Faces of the Unreached Peoples Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Ethnolinguistic groups with no indigenous community of believing Christians capable of engaging them without outside assistance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCreatePrayer}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Raise Prayer Shield</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-[#262f43] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by group name, country, or language..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-[#1a2130] border border-slate-200 dark:border-[#2a3449] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e71eb]"
            />
          </div>

          {/* Religion Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {religions.map((rel) => (
              <button
                key={rel}
                onClick={() => setSelectedReligion(rel)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedReligion === rel
                    ? 'bg-[#0e71eb] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-[#1a2130] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#252f44]'
                }`}
              >
                {rel}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid with Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => {
          const isPrayed = prayedGroups[group.id];

          return (
            <div
              key={group.id}
              onClick={() => setSelectedGroupModal(group)}
              className="bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] hover:border-amber-500/60 dark:hover:border-amber-500/60 transition-all overflow-hidden flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-xl group"
            >
              {/* Photo Image Banner */}
              <div className="relative w-full h-44 bg-slate-900 overflow-hidden">
                <img
                  src={group.photoUrl || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop'}
                  alt={group.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                {/* Top Badges on Photo */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide uppercase bg-amber-500/90 backdrop-blur-md text-white shadow-sm">
                    {group.gospelAccessStatus || 'Unreached'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelectCountry) onSelectCountry(group.countryCode);
                    }}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-white border border-white/20 hover:bg-slate-900 flex items-center gap-1 shadow-sm transition-colors"
                  >
                    <span>{group.countryName}</span>
                    <Globe className="w-3 h-3 text-sky-400" />
                  </button>
                </div>

                {/* Bottom Overlay Title on Photo */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-lg text-white drop-shadow-md group-hover:text-amber-300 transition-colors">
                    {group.name}
                  </h3>
                  <div className="text-xs text-slate-200 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-sky-300" />
                      {(group.population || 0).toLocaleString()} souls
                    </span>
                    <span>·</span>
                    <span className="text-amber-300 font-medium">{group.mainReligion}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Key Missional Metrics */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-[#1a2130] p-3 rounded-xl border border-slate-100 dark:border-[#262f43] text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Evangelical %</span>
                      <p className="font-mono font-bold text-red-500 dark:text-red-400">
                        {group.percentEvangelical}%
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Scripture</span>
                      <p className="font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {group.bibleAvailability || 'Translation Needed'}
                      </p>
                    </div>
                  </div>

                  {/* Prayer Request Snippet */}
                  {group.prayerRequests && group.prayerRequests.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Prayer Focus</span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2">
                        "{group.prayerRequests[0]}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-[#262f43] flex items-center justify-between">
                  <button
                    onClick={(e) => handlePrayClick(group.id, e)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isPrayed
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-[#1f2738] text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-600'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isPrayed ? 'fill-current' : ''}`} />
                    <span>{isPrayed ? 'Standing in Prayer' : 'Pray Now'}</span>
                  </button>

                  <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold group-hover:text-slate-200">
                    <span>Full Profile</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#0e71eb]" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILED MODAL */}
      {selectedGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] shadow-2xl overflow-hidden text-slate-900 dark:text-white max-h-[90vh] flex flex-col">
            
            {/* Modal Image Hero Header */}
            <div className="relative w-full h-56 bg-slate-900 shrink-0">
              <img
                src={selectedGroupModal.photoUrl || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop'}
                alt={selectedGroupModal.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161b26] via-[#161b26]/50 to-black/40" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedGroupModal(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors"
              >
                ✕
              </button>

              {/* Title & Badge on Banner */}
              <div className="absolute bottom-4 left-6 right-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/90 text-white text-xs font-bold shadow">
                  <span>{selectedGroupModal.gospelAccessStatus}</span>
                  <span>·</span>
                  <span>{selectedGroupModal.countryName}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 drop-shadow-md">
                  {selectedGroupModal.name}
                </h3>
              </div>
            </div>

            {/* Modal Content Scrollable Area */}
            <div className="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1">
              
              {/* Quick Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-[#1a2130] rounded-xl border border-slate-100 dark:border-[#262f43]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Population</div>
                  <div className="font-bold text-sm sm:text-base mt-0.5">
                    {(selectedGroupModal.population || 0).toLocaleString()}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-[#1a2130] rounded-xl border border-slate-100 dark:border-[#262f43]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Evangelical</div>
                  <div className="font-bold text-sm sm:text-base text-red-500 mt-0.5">
                    {selectedGroupModal.percentEvangelical}%
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-[#1a2130] rounded-xl border border-slate-100 dark:border-[#262f43]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Primary Religion</div>
                  <div className="font-semibold text-xs sm:text-sm mt-0.5 truncate">
                    {selectedGroupModal.mainReligion}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-[#1a2130] rounded-xl border border-slate-100 dark:border-[#262f43]">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Scripture</div>
                  <div className="font-semibold text-xs sm:text-sm mt-0.5 truncate">
                    {selectedGroupModal.bibleAvailability || 'Portions'}
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Languages Spoken</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedGroupModal.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-900 rounded-lg text-xs font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Strategic Recommendations / Missional Context */}
              {selectedGroupModal.strategicRecommendations && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <div className="font-bold text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Frontier Strategy & Engagement Vectors</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedGroupModal.strategicRecommendations}
                  </p>
                </div>
              )}

              {/* Risk Notes */}
              {selectedGroupModal.riskNotes && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-1">
                  <div className="font-bold text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    <span>Field Security & Risk Factors</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedGroupModal.riskNotes}
                  </p>
                </div>
              )}

              {/* Prayer Points */}
              {selectedGroupModal.prayerRequests && selectedGroupModal.prayerRequests.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Intercession Directives</h4>
                  <ul className="space-y-2">
                    {selectedGroupModal.prayerRequests.map((req, idx) => (
                      <li
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a2130] border border-slate-100 dark:border-[#262f43] text-xs flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#262f43]">
                <button
                  onClick={() => {
                    if (onSelectCountry) onSelectCountry(selectedGroupModal.countryCode);
                    setSelectedGroupModal(null);
                  }}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#1f2738] hover:bg-slate-200 dark:hover:bg-[#252f44] text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <span>View {selectedGroupModal.countryName} Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    handlePrayClick(selectedGroupModal.id, { stopPropagation: () => {} } as any);
                    setSelectedGroupModal(null);
                  }}
                  className="px-5 py-2 bg-[#0e71eb] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Intercede Now</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
