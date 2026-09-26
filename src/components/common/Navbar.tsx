import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  BookOpen
} from 'lucide-react';
import { useBranding } from '../../context/ThemeAndBrandingContext';
import { PrayerCloudLogo } from './PrayerCloudLogo';
import { NotificationBell } from './NotificationBell';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, param?: string) => void;
  onOpenSearch: () => void;
  onRestartTour?: () => void;
  onLaunchInstantCall?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenSearch,
  onLaunchInstantCall
}) => {
  const { branding } = useBranding();
  
  const [presenceStatus, setPresenceStatus] = useState<'available' | 'in-meeting' | 'away' | 'dnd'>('available');
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
  };

  const getStatusDot = () => {
    switch (presenceStatus) {
      case 'available':
        return <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#121622]" />;
      case 'in-meeting':
        return <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse ring-2 ring-[#121622]" />;
      case 'away':
        return <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#121622]" />;
      case 'dnd':
        return <span className="w-2 h-2 rounded-full bg-purple-500 ring-2 ring-[#121622]" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full max-w-full bg-[#141823] border-b border-[#232b3d] text-white select-none transition-colors shadow-md overflow-x-hidden">
        
        {/* Main Workplace Header Bar - Compact & Streamlined */}
        <div className="max-w-[1700px] w-full mx-auto px-2 sm:px-4 flex items-center justify-between h-12 gap-1.5 sm:gap-2">
          
          {/* LEFT ZONE: App Brand & Navigation Chevrons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* App Brand & Navigation */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-1.5 sm:gap-2 text-left group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#0e121b] border border-[#253046] flex items-center justify-center p-0.5 shadow-sm shadow-blue-950/60 group-hover:scale-105 transition-transform shrink-0">
                <PrayerCloudLogo size="sm" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1">
                  <span className="font-black text-xs sm:text-sm tracking-tight text-white">
                    PRAYER
                  </span>
                  <span className="font-black text-xs sm:text-sm tracking-tight text-amber-400">
                    CLOUD
                  </span>
                  <span className="hidden xs:inline-block text-[9px] font-bold text-amber-400 uppercase tracking-wider bg-amber-950/80 px-1 py-0.2 rounded border border-amber-500/30">
                    Live
                  </span>
                </div>
                <div className="hidden sm:block text-[9px] text-slate-400 font-semibold leading-none truncate max-w-[160px]">
                  {branding.siteName || 'Global Intercession Platform'}
                </div>
              </div>
            </button>

            {/* Compact Window Back / Forward Chevrons */}
            <div className="hidden lg:flex items-center gap-0.5 ml-1 text-slate-400">
              <button
                onClick={() => window.history.back()}
                className="p-1 hover:text-white hover:bg-[#1e2536] rounded-md transition-colors"
                title="Back"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => window.history.forward()}
                className="p-1 hover:text-white hover:bg-[#1e2536] rounded-md transition-colors"
                title="Forward"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CENTER ZONE: Global Search Bar */}
          <div className="flex items-center gap-1.5 md:gap-3 flex-1 max-w-lg mx-1 sm:mx-3 justify-center min-w-0">
            <button
              onClick={onOpenSearch}
              className="w-full max-w-xs sm:max-w-sm flex items-center justify-between px-2.5 py-1 bg-[#1c2232] hover:bg-[#232b3d] border border-[#283247] rounded-lg text-xs text-slate-400 transition-all shadow-inner group min-w-0"
            >
              <div className="flex items-center gap-1.5 truncate min-w-0">
                <Search className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors shrink-0" />
                <span className="truncate text-[10px] sm:text-[11px]">Search prayers, nations, meetings...</span>
              </div>
              <div className="hidden md:flex items-center gap-0.5 text-[9px] bg-[#121622] text-slate-400 px-1 py-0.2 rounded border border-[#283247] shrink-0">
                <span>Ctrl</span>
                <span>K</span>
              </div>
            </button>
          </div>

          {/* RIGHT ZONE: Status & Quick Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* System Notifications Bell */}
            <NotificationBell onNavigate={handleNavClick} />

            {/* Quick SU Devotional & Bible Hub Button - Compact */}
            <button
              onClick={() => handleNavClick('devotionals')}
              className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shadow-xs ${
                currentPage === 'devotionals' || currentPage === 'bible' || currentPage === 'devotional-hub'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/20'
                  : 'bg-[#1c2232] hover:bg-[#232b3d] border border-[#283247] text-amber-400 hover:text-amber-300'
              }`}
              title="Scripture Union Daily Devotional & Holy Bible Hub"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Devotional</span>
            </button>

            {/* Quick Launch New Meeting Button - Compact */}
            <button
              onClick={() => onLaunchInstantCall ? onLaunchInstantCall() : handleNavClick('missionary-hub')}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 bg-[#f26d21] hover:bg-[#e05b11] text-white text-[11px] font-bold rounded-lg shadow-sm shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
              title="Launch Instant Meeting"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Call</span>
            </button>

            {/* Presence Status Dropdown - Compact */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="flex items-center gap-1 px-2 py-1 bg-[#1c2232] hover:bg-[#232b3d] border border-[#283247] rounded-lg text-[11px] font-semibold text-slate-300 transition-colors"
                title="Change Presence Status"
              >
                {getStatusDot()}
                <span className="hidden xl:inline capitalize text-[10px]">{presenceStatus.replace('-', ' ')}</span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>

              {showStatusMenu && (
                <div className="absolute top-9 right-0 w-40 bg-[#1c2232] border border-[#283247] rounded-xl shadow-2xl p-1.5 z-50 text-[11px] space-y-0.5 animate-fadeIn">
                  <div className="text-[9px] font-bold uppercase text-slate-400 px-2 py-0.5">Set Presence:</div>
                  {[
                    { id: 'available', label: 'Available 🟢', color: 'text-emerald-400' },
                    { id: 'in-meeting', label: 'In a Meeting 🔴', color: 'text-red-400' },
                    { id: 'away', label: 'Away 🟡', color: 'text-amber-400' },
                    { id: 'dnd', label: 'Do Not Disturb 🟣', color: 'text-purple-400' }
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setPresenceStatus(s.id as any);
                        setShowStatusMenu(false);
                      }}
                      className="w-full text-left px-2 py-1 rounded-md hover:bg-[#253046] font-medium transition-colors flex items-center justify-between"
                    >
                      <span className={s.color}>{s.label}</span>
                      {presenceStatus === s.id && <span className="text-blue-400 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </header>
    </>
  );
};
export default Navbar;
