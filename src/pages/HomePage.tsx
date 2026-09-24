import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe,
  Flame,
  Video,
  HeartHandshake,
  Compass,
  ArrowRight,
  Radio,
  Clock,
  Shield,
  MessageSquare,
  FileText,
  MapPin,
  Sparkles,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Country, UnreachedPlace, PrayerRequest, MissionReport, EventMeeting } from '../types';
import { useAuth } from '../context/AuthContext';
import { useBranding } from '../context/ThemeAndBrandingContext';
import { InteractiveWorldMap } from '../components/map/InteractiveWorldMap';
import { LiveTickingEarthGlobe } from '../components/home/LiveTickingEarthGlobe';
import { UnreachedPeopleGallery } from '../components/home/UnreachedPeopleGallery';

interface HomePageProps {
  countries: Country[];
  places: UnreachedPlace[];
  prayers: PrayerRequest[];
  reports: MissionReport[];
  events: EventMeeting[];
  onNavigate: (page: string, param?: string) => void;
  onOpenCreatePrayer: () => void;
  onLaunchInstantMeeting?: (customTopic?: string, countryFocus?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  countries,
  places,
  prayers,
  reports,
  events,
  onNavigate,
  onOpenCreatePrayer
}) => {
  const { currentUser } = useAuth();
  const { branding } = useBranding();

  // Live Digital Clock
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculated global missional metrics
  const totalCountries = countries.length;
  const totalUnreachedPeopleGroups = useMemo(() => {
    return countries.reduce((acc, c) => acc + c.unreachedPeopleGroupsCount, 0);
  }, [countries]);

  const totalMissionaries = useMemo(() => {
    return countries.reduce((acc, c) => acc + c.activeMissionariesCount, 0);
  }, [countries]);

  const totalIntercessors = useMemo(() => {
    return countries.reduce((acc, c) => acc + c.activePrayerWarriorsCount, 0);
  }, [countries]);

  const urgentPrayers = prayers.filter(p => p.urgency === 'Urgent' || p.urgency === 'High').slice(0, 3);
  const liveWatches = events.filter(e => e.isLiveNow);

  return (
    <div className="space-y-8 pb-20 font-sans">
      
      {/* GRAND HERO BANNER: 24/7 Global Intercession & Frontier Mission Command */}
      <section className="bg-gradient-to-br from-[#121622] via-[#1a233a] to-[#0f172a] rounded-3xl border border-[#2a3754] text-white p-6 sm:p-9 shadow-2xl relative overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          {/* Left Text Zone */}
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>24/7 Global Watch Active</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-300">195 Sovereign Nations Monitored</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Global Intercession & <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                Frontier Mission Command
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Uniting missionary pioneers, underground intercessors, and crisis mobilizers. Tracking unreached people groups, spiritual breakthrough vectors, and real-time prayer shields across the 10/40 window.
            </p>

            {/* Quick Action Navigation */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('map')}
                className="px-5 py-2.5 bg-[#0e71eb] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Globe className="w-4 h-4" />
                <span>Explore 10/40 Window Map</span>
              </button>

              <button
                onClick={() => onNavigate('unreached-places')}
                className="px-4 py-2.5 bg-[#1f2738] hover:bg-[#262f43] text-slate-200 font-semibold text-xs rounded-xl border border-[#344263] transition-colors flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Unreached Hubs</span>
              </button>
            </div>
          </div>

          {/* Right Live Digital Clock & Strategic Status Tile */}
          <div className="bg-[#151b29]/90 border border-[#2c3750] rounded-2xl p-5 sm:p-6 backdrop-blur-md shrink-0 w-full lg:w-80 space-y-4 shadow-xl">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Global Clock</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">
                UTC LIVE
              </span>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>

            <div className="pt-3 border-t border-[#262f43] space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Watch Phase:</span>
                <span className="font-semibold text-amber-300">Frontier Intercession</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Active Intercessors:</span>
                <span className="font-mono font-bold text-emerald-400">{totalIntercessors.toLocaleString()} online</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Security Encryption:</span>
                <span className="text-blue-400 font-semibold flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  <span>AES-256 E2EE</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Global Missional Statistics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 -> 195 Sovereign Nations */}
        <button
          onClick={() => onNavigate('countries')}
          className="text-left bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] p-5 shadow-sm hover:border-[#0e71eb] transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-[#0e71eb] transition-colors">Sovereign Nations</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0e71eb] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-data text-slate-900 dark:text-white">
            {totalCountries}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>View all 195 nations</span>
            <ArrowRight className="w-3 h-3 text-[#0e71eb]" />
          </div>
        </button>

        {/* Metric 2 -> Unreached Groups (UPGs) */}
        <button
          onClick={() => onNavigate('unreached-places')}
          className="text-left bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] p-5 shadow-sm hover:border-amber-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-amber-500 transition-colors">Unreached (UPGs)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-data text-amber-600 dark:text-amber-400">
            {totalUnreachedPeopleGroups.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Explore frontier hubs</span>
            <ArrowRight className="w-3 h-3 text-amber-500" />
          </div>
        </button>

        {/* Metric 3 -> Active Missionaries */}
        <button
          onClick={() => onNavigate('missionary-hub')}
          className="text-left bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] p-5 shadow-sm hover:border-emerald-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-emerald-500 transition-colors">Active Missionaries</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-data text-emerald-600 dark:text-emerald-400">
            {totalMissionaries.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Pioneer field workers</span>
            <ArrowRight className="w-3 h-3 text-emerald-500" />
          </div>
        </button>

        {/* Metric 4 -> 24/7 Prayer Warriors */}
        <button
          onClick={() => onNavigate('prayer-requests')}
          className="text-left bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] p-5 shadow-sm hover:border-purple-500 transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-purple-500 transition-colors">Prayer Warriors</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono-data text-purple-600 dark:text-purple-400">
            {totalIntercessors.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Intercessors across nations</span>
            <ArrowRight className="w-3 h-3 text-purple-500" />
          </div>
        </button>
      </section>

      {/* Live Rotating 3D Earth Globe Section with Ticking Watch */}
      <section className="space-y-3">
        <LiveTickingEarthGlobe
          countries={countries}
          places={places}
          onSelectCountry={(code) => onNavigate('country', code)}
          onSelectPlace={(id) => onNavigate('unreached-places', id)}
          onOpenCreatePrayer={onOpenCreatePrayer}
        />
      </section>

      {/* Faces of the Unreached Peoples Gallery with Comprehensive Write-ups */}
      <section className="pt-2">
        <UnreachedPeopleGallery
          onSelectCountry={(code) => onNavigate('country', code)}
          onOpenCreatePrayer={onOpenCreatePrayer}
        />
      </section>

      {/* Interactive World Map Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Global Missional Heatmap & 10/40 Corridor
            </h2>
            <p className="text-xs text-slate-500">Click any country or unreached hub for live field statistics</p>
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="flex items-center gap-1 text-xs font-semibold text-[#0e71eb] hover:underline"
          >
            <span>Full Map View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <InteractiveWorldMap
          countries={countries}
          places={places}
          onSelectCountry={(code) => onNavigate('country', code)}
          onSelectPlace={(id) => onNavigate('unreached-places', id)}
        />
      </section>

      {/* Urgent Prayer Signals & Field Testimonies */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Urgent Prayer Signals */}
        <div className="p-6 bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Urgent Field Prayer Signals</span>
            </h3>
            <button
              onClick={() => onNavigate('prayer-requests')}
              className="text-xs text-[#0e71eb] hover:underline font-semibold"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {urgentPrayers.map((prayer) => (
              <div
                key={prayer.id}
                onClick={() => onNavigate('prayer-requests')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a2130] border border-slate-100 dark:border-[#2a3449] hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                    {prayer.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                    {prayer.urgency}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {prayer.description}
                </p>
                <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                  <span>Target: <strong>{prayer.targetCountry || 'Global'}</strong></span>
                  <span className="text-purple-400 font-semibold">{prayer.prayedCount} warriors praying</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missionary Field Testimonies */}
        <div className="p-6 bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Latest Breakthroughs & Reports</span>
            </h3>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs text-[#0e71eb] hover:underline font-semibold"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {reports.slice(0, 3).map((rep) => (
              <div
                key={rep.id}
                onClick={() => onNavigate('reports')}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1a2130] border border-slate-100 dark:border-[#2a3449] hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                    {rep.title}
                  </span>
                  <span className="text-slate-400 text-[11px]">{rep.country}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {rep.summary}
                </p>
                <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                  <span>By: <strong>{rep.missionaryName}</strong></span>
                  <span className="text-emerald-400 font-semibold">Verified Field Dispatch</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
};
