import React, { useState, useEffect } from 'react';
import {
  Compass,
  Globe,
  Radio,
  HeartHandshake,
  MapPin,
  MessageSquare,
  Sparkles,
  Flame,
  Shield,
  Clock,
  Layers,
  Calendar
} from 'lucide-react';
import { Country, UnreachedPlace, PrayerRequest, MissionReport, EventMeeting, MissionaryResource, MeetingRecording } from '../types';
import { WorldMapPage } from './WorldMapPage';
import { ConferencesPage } from './ConferencesPage';
import { PrayerBoardPage } from './PrayerBoardPage';
import { CountriesDirectoryPage } from './CountriesDirectoryPage';
import { ChatContainer } from '../components/chat/ChatContainer';

export interface MissionaryHubPageProps {
  countries: Country[];
  places?: UnreachedPlace[];
  prayers: PrayerRequest[];
  reports?: MissionReport[];
  events: EventMeeting[];
  recordings?: MeetingRecording[];
  resources?: MissionaryResource[];
  onNavigate: (page: string, param?: string) => void;
  onOpenCreatePrayer: (context?: string) => void;
  onRefreshPrayers?: () => void;
  initialRoomId?: string;
  initialTab?: 'map' | 'watches' | 'prayers' | 'countries' | 'chat' | string;
}

export const MissionaryHubPage: React.FC<MissionaryHubPageProps> = ({
  countries = [],
  places = [],
  prayers = [],
  events = [],
  recordings = [],
  onNavigate,
  onOpenCreatePrayer,
  onRefreshPrayers = () => {},
  initialRoomId,
  initialTab = 'map'
}) => {
  // Normalize initial tab
  const getValidTab = (tabStr?: string): 'map' | 'watches' | 'prayers' | 'countries' | 'chat' => {
    if (tabStr === 'watches' || tabStr === 'conferences' || tabStr === 'events' || tabStr === 'calls') return 'watches';
    if (tabStr === 'prayers' || tabStr === 'prayer-requests' || tabStr === 'board') return 'prayers';
    if (tabStr === 'countries' || tabStr === 'nations') return 'countries';
    if (tabStr === 'chat' || tabStr === 'chatroom') return 'chat';
    return 'map';
  };

  const [activeTab, setActiveTab] = useState<'map' | 'watches' | 'prayers' | 'countries' | 'chat'>(() => getValidTab(initialTab));

  useEffect(() => {
    if (initialTab) {
      setActiveTab(getValidTab(initialTab));
    }
  }, [initialTab]);

  const liveWatchesCount = events.filter(e => e.isLiveNow).length;
  const urgentPrayersCount = prayers.filter(p => p.urgency === 'Urgent' || p.urgency === 'High').length;
  const totalUPGs = countries.reduce((acc, c) => acc + (c.unreachedPeopleGroupsCount || 0), 0);

  return (
    <div className="w-full max-w-full space-y-6 pb-20 font-sans animate-fadeIn">
      
      {/* MISSIONARY HUB HEADER & COMMAND BANNER */}
      <div className="bg-gradient-to-br from-[#121622] via-[#1a233a] to-[#0f172a] rounded-3xl border border-[#2a3754] text-white p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Frontier Mobilization Center</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-300">10/40 Window</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Missionary Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Command console unifying the <strong>Frontier Map</strong>, <strong>Live Watches</strong>, <strong>Prayer Board</strong>, <strong>195 Sovereign Nations</strong>, and <strong>Chatroom</strong> for strategic pioneer gospel advance.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <div className="text-lg sm:text-xl font-extrabold text-white font-mono">{countries.length}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Nations</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <div className="text-lg sm:text-xl font-extrabold text-amber-400 font-mono">{totalUPGs.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">UPG Tribes</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <div className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono">{liveWatchesCount || events.length}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Live Watches</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
              <div className="text-lg sm:text-xl font-extrabold text-red-400 font-mono">{urgentPrayersCount || prayers.length}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Urgent Shields</div>
            </div>
          </div>
        </div>

        {/* MISSIONARY HUB NAVIGATION TABS */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none pb-1">
          
          {/* TAB 1: Frontier Map */}
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'map'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-2 ring-blue-400/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Frontier Map</span>
          </button>

          {/* TAB 2: Live Watches */}
          <button
            onClick={() => setActiveTab('watches')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 relative ${
              activeTab === 'watches'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-400/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Live Watches</span>
            {liveWatchesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* TAB 3: Prayer Board */}
          <button
            onClick={() => setActiveTab('prayers')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'prayers'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30 ring-2 ring-rose-400/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Prayer Board</span>
            {urgentPrayersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
                {urgentPrayersCount}
              </span>
            )}
          </button>

          {/* TAB 4: Countries Directory */}
          <button
            onClick={() => setActiveTab('countries')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'countries'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 ring-2 ring-purple-400/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Countries (195)</span>
          </button>

          {/* TAB 5: Team Chat */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'chat'
                ? 'bg-[#0e71eb] text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chatroom</span>
          </button>

        </div>
      </div>

      {/* ACTIVE TAB VIEW CONTENT */}
      <div className="transition-all">
        {activeTab === 'map' && (
          <div className="space-y-4">
            <WorldMapPage
              countries={countries}
              places={places}
              onSelectCountry={(code) => onNavigate('country', code)}
              onSelectPlace={(placeId) => onNavigate('unreached-places', placeId)}
              onOpenCreatePrayer={(ctx) => onOpenCreatePrayer(ctx)}
            />
          </div>
        )}

        {activeTab === 'watches' && (
          <div className="space-y-4">
            <ConferencesPage
              events={events}
              recordings={recordings}
              onNavigate={onNavigate}
            />
          </div>
        )}

        {activeTab === 'prayers' && (
          <div className="space-y-4">
            <PrayerBoardPage
              prayers={prayers}
              onOpenCreatePrayer={() => onOpenCreatePrayer()}
              onRefreshPrayers={onRefreshPrayers}
            />
          </div>
        )}

        {activeTab === 'countries' && (
          <div className="space-y-4">
            <CountriesDirectoryPage
              countries={countries}
              onSelectCountry={(code) => onNavigate('country', code)}
            />
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-4">
            <ChatContainer initialRoomId={initialRoomId} />
          </div>
        )}
      </div>

    </div>
  );
};

export default MissionaryHubPage;
