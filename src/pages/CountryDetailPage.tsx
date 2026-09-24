import React, { useState } from 'react';
import {
  Country,
  UnreachedPlace,
  PrayerRequest
} from '../types';
import {
  ArrowLeft,
  Globe,
  Flame,
  ShieldAlert,
  Users,
  HeartHandshake,
  MessageSquare,
  BookOpen,
  Compass,
  MapPin,
  CheckCircle,
  Sparkles,
  Share2,
  PieChart,
  CheckCircle2,
  XCircle,
  Clock,
  Radio,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { storage } from '../services/storageService';

interface CountryDetailPageProps {
  country: Country;
  unreachedPlaces: UnreachedPlace[];
  prayers: PrayerRequest[];
  onBack: () => void;
  onSelectPlace: (placeId: string) => void;
  onJoinCountryChat: (countryCode: string) => void;
  onOpenCreatePrayer: (countryName: string) => void;
}

export const CountryDetailPage: React.FC<CountryDetailPageProps> = ({
  country,
  unreachedPlaces,
  prayers,
  onBack,
  onSelectPlace,
  onJoinCountryChat,
  onOpenCreatePrayer
}) => {
  const { currentUser } = useAuth();
  const [prayedPoints, setPrayedPoints] = useState<number[]>([]);

  const isUnreached = country.unreachedPopulationPercentage >= 50 || country.evangelicalPercentage < 2;

  const countryPrayers = prayers.filter(
    p => p.targetCountry?.toLowerCase() === country.name.toLowerCase() || p.targetCountry?.toLowerCase() === country.code.toLowerCase()
  );

  const handlePrayForPoint = (idx: number) => {
    if (!prayedPoints.includes(idx)) {
      setPrayedPoints(prev => [...prev, idx]);
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#10b981', '#60a5fa']
      });
      if (currentUser) {
        currentUser.prayersOfferedCount = (currentUser.prayersOfferedCount || 0) + 1;
        storage.updateUser(currentUser);
      }
    }
  };

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
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#161b26] rounded-xl border border-slate-200 dark:border-[#262f43] hover:bg-slate-50 dark:hover:bg-[#1f2738] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Countries Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenCreatePrayer(country.name)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0e71eb] hover:bg-blue-600 text-white font-semibold text-xs rounded-xl shadow transition-colors"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Submit Prayer Need for {country.name}</span>
          </button>

          <button
            onClick={() => onJoinCountryChat(country.code)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 dark:bg-[#1f2738] hover:bg-slate-800 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>Country Strategy Channel</span>
          </button>
        </div>
      </div>

      {/* Hero Dossier Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-[#10192e] via-[#162340] to-[#0d1424] text-white rounded-3xl border border-[#2b3a58] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl sm:text-6xl p-3 bg-white/10 rounded-2xl backdrop-blur-md shadow-lg">
              {country.flag}
            </span>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  {country.name}
                </h1>
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-white/15 rounded-lg border border-white/10">
                  ISO: {country.code} / {country.code3}
                </span>

                {/* Reach Status Badge */}
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${
                  isUnreached
                    ? 'bg-red-950 text-red-300 border border-red-700'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                }`}>
                  {isUnreached ? (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <span>UNREACHED NATION</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>REACHED NATION</span>
                    </>
                  )}
                </span>

                {country.isIn1040Window && (
                  <span className="text-xs font-bold px-3 py-1 bg-amber-500 text-slate-950 rounded-full shadow">
                    🔥 10/40 Window Nation
                  </span>
                )}
              </div>
              
              <p className="text-xs sm:text-sm text-blue-200 mt-2 max-w-2xl leading-relaxed">
                {country.continent} · Capital: {country.capitalCity} · {(country.population / 1000000).toFixed(2)} Million Total Population
              </p>
              
              {/* Automated Source Badge */}
              <div className="flex items-center gap-2 mt-2 text-[11px] text-emerald-400 font-medium">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Automatic Demographics & Religion Statistics Active (Managed via Admin Control Center)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm shrink-0">
            <div>
              <div className="text-[11px] text-blue-200 uppercase font-semibold">Security Index</div>
              <div className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>{country.securityLevel} Risk</span>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="text-[11px] text-blue-200 uppercase font-semibold">Intercessor Shield</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5 font-mono">
                {country.activePrayerWarriorsCount.toLocaleString()} Warriors
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Missional Demographics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Unreached Population</div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-600 dark:text-amber-400">
            {country.unreachedPopulationPercentage}%
          </div>
          <div className="text-[11px] text-slate-500">
            ~{Math.round((country.population * country.unreachedPopulationPercentage) / 100 / 1000000)}M souls unreached
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Unreached Groups (UPGs)</div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-red-500">
            {country.unreachedPeopleGroupsCount} Groups
          </div>
          <div className="text-[11px] text-slate-500">Requiring pioneer church planting</div>
        </div>

        <div className="p-5 bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Evangelical Believers</div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-blue-600 dark:text-blue-400">
            {country.evangelicalPercentage}%
          </div>
          <div className="text-[11px] text-slate-500">Total Christian: {country.christianPercentage}%</div>
        </div>

        <div className="p-5 bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] shadow-sm space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Field Missionaries</div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {country.activeMissionariesCount}
          </div>
          <div className="text-[11px] text-slate-500">Active registered workers</div>
        </div>

      </div>

      {/* RELIGION STATISTICS & DEMOGRAPHIC PROFILES CARD */}
      <div className="p-6 bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-[#262f43] pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#0e71eb]" />
              <span>Full Religion Demographics for {country.name}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Automatic breakdown of major faith traditions, minority groups, and evangelical Christian presence
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#0e71eb] text-xs font-bold border border-blue-200 dark:border-blue-900 self-start">
            100% Demographic Distribution
          </span>
        </div>

        {/* Visual Multi-Bar */}
        <div className="space-y-4">
          <div className="w-full h-4 bg-slate-100 dark:bg-[#1f2738] rounded-full overflow-hidden flex shadow-inner">
            {country.dominantReligions?.map((rel, idx) => (
              <div
                key={idx}
                style={{
                  width: `${rel.percentage}%`,
                  backgroundColor: getReligionBarColor(rel.religion)
                }}
                title={`${rel.religion}: ${rel.percentage}%`}
                className="h-full transition-all duration-700"
              />
            ))}
          </div>

          {/* Detailed Religion Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {country.dominantReligions?.map((rel, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 dark:bg-[#1a2130] rounded-2xl border border-slate-200 dark:border-[#2a3449] space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                    {rel.religion}
                  </span>
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: getReligionBarColor(rel.religion) }}
                  />
                </div>
                <div className="text-xl font-extrabold font-mono text-slate-900 dark:text-white">
                  {rel.percentage}%
                </div>
                <div className="text-[10px] text-slate-400">
                  ~{Math.round((country.population * rel.percentage) / 100 / 1000000)}M Adherents
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Language & Scripture Availability Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-[#232a3b] text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-[#1a2130] rounded-2xl border border-slate-200 dark:border-[#2a3449] space-y-1">
            <span className="text-slate-400 uppercase font-semibold text-[10px] block">Primary National Languages:</span>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {country.primaryLanguages.join(', ')}
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-[#1a2130] rounded-2xl border border-slate-200 dark:border-[#2a3449] space-y-1">
            <span className="text-slate-400 uppercase font-semibold text-[10px] block">Frontier Scripture & Audio Status:</span>
            <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Full Bible in National Language; Translation active for minority tribal dialects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Unreached Tribes in Country & Strategic Prayer Directives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col (2/3): Unreached People Groups & Villages */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Unreached Places */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  <span>Unreached Tribes, Cities & Regions in {country.name}</span>
                </h3>
                <p className="text-xs text-slate-500">Documented Gospel access status and strategic recommendations</p>
              </div>
            </div>

            {unreachedPlaces.length === 0 ? (
              <div className="p-6 bg-slate-50 dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] text-center text-xs text-slate-400">
                No specific localized tribes logged yet for {country.name}. Use Missionary Hub to submit field surveys.
              </div>
            ) : (
              <div className="space-y-3">
                {unreachedPlaces.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => onSelectPlace(place.id)}
                    className="p-5 bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] hover:border-amber-400/60 transition-all cursor-pointer space-y-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded border border-amber-300 dark:border-amber-800">
                            {place.type}
                          </span>
                          <h4 className="font-bold text-base text-slate-900 dark:text-white">
                            {place.name}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Country: {place.countryName} · Population: {(place.population / 1000000).toFixed(2)}M · Religion: {place.mainReligion}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
                          {place.percentEvangelical}% Evangelical
                        </div>
                        <div className="text-[10px] text-slate-400">Gospel Access: {place.gospelAccessStatus}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs p-3 bg-slate-50 dark:bg-[#1a2130] rounded-xl">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Languages:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{place.languages.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Scripture Status:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{place.bibleAvailability}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Missionary Presence:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{place.missionaryPresence}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300 italic bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200/40 dark:border-amber-900/40">
                      <strong>Strategy Note:</strong> {place.strategicRecommendations}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Mission Opportunities */}
          <div className="p-6 bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#0e71eb]" />
              <span>Frontier Mission Opportunities in {country.name}</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {country.missionOpportunities.map((opp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Col (1/3): Strategic Prayer Directives */}
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <HeartHandshake className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                National Prayer Directives
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Intercede specifically into these strategic prayer burdens for {country.name}.
            </p>

            <div className="space-y-3">
              {country.prayerPoints.map((pt, idx) => {
                const isPrayed = prayedPoints.includes(idx);
                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 dark:bg-[#1a2130] rounded-xl border border-slate-200 dark:border-[#2a3449] space-y-2.5"
                  >
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                      {pt}
                    </p>

                    <button
                      onClick={() => handlePrayForPoint(idx)}
                      className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isPrayed
                          ? 'bg-[#0e71eb] text-white'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-[#0e71eb] dark:text-blue-400 hover:bg-blue-100 border border-blue-200 dark:border-blue-900'
                      }`}
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>{isPrayed ? 'Prayed in Agreement ✓' : 'I Prayed for This Point'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Field Prayers for this Country */}
          {countryPrayers.length > 0 && (
            <div className="p-6 bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] space-y-3 shadow-sm">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Urgent Worker Prayers ({countryPrayers.length})
              </h4>
              <div className="space-y-2">
                {countryPrayers.map((cp) => (
                  <div key={cp.id} className="p-3 bg-slate-50 dark:bg-[#1a2130] rounded-xl text-xs space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white">{cp.title}</div>
                    <p className="text-slate-500 line-clamp-2">{cp.description}</p>
                    <div className="text-[10px] text-[#0e71eb] font-semibold pt-1">
                      {cp.prayedCount} Believers Prayed
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
