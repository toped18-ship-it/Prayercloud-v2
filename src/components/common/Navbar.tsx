import React, { useState, useEffect } from 'react';
import {
  Video,
  MessageSquare,
  Calendar,
  Globe,
  MapPin,
  HeartHandshake,
  FileText,
  Search,
  Settings,
  Shield,
  Moon,
  Sun,
  User,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Radio,
  Sliders,
  Sparkles,
  Command,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBranding } from '../../context/ThemeAndBrandingContext';

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
  onRestartTour,
  onLaunchInstantCall
}) => {
  const { currentUser, isAuthenticated, logout, isAdmin } = useAuth();
  const { branding, isDarkMode, toggleDarkMode } = useBranding();
  
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [presenceStatus, setPresenceStatus] = useState<'available' | 'in-meeting' | 'away' | 'dnd'>('available');
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const getStatusDot = () => {
    switch (presenceStatus) {
      case 'available':
        return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#121622]" />;
      case 'in-meeting':
        return <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse ring-2 ring-[#121622]" />;
      case 'away':
        return <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-[#121622]" />;
      case 'dnd':
        return <span className="w-2.5 h-2.5 rounded-full bg-purple-500 ring-2 ring-[#121622]" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full max-w-full bg-[#161b26] border-b border-[#262f43] text-white select-none transition-colors shadow-md overflow-x-hidden">
        
        {/* Main Workplace Header Bar */}
        <div className="max-w-[1700px] w-full mx-auto px-2.5 sm:px-5 flex items-center justify-between h-14 gap-2">
          
          {/* LEFT ZONE: App Brand & Navigation Chevrons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* App Brand & Navigation */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 sm:gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-[#0e71eb] flex items-center justify-center text-white font-black shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform shrink-0">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                    10/40 Watch
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold leading-none truncate max-w-[180px]">
                  {branding.siteName || 'Frontier Mission & Intercession Hub'}
                </div>
              </div>
            </button>

            {/* Window Back / Forward Chevrons */}
            <div className="hidden lg:flex items-center gap-0.5 ml-2 text-slate-400">
              <button
                onClick={() => window.history.back()}
                className="p-1 hover:text-white hover:bg-[#232a3b] rounded-lg transition-colors"
                title="Back"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => window.history.forward()}
                className="p-1 hover:text-white hover:bg-[#232a3b] rounded-lg transition-colors"
                title="Forward"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CENTER ZONE: Global Search Bar */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-xl mx-1 sm:mx-4 justify-center min-w-0">
            
            {/* Global Search Input */}
            <button
              onClick={onOpenSearch}
              className="w-full max-w-sm sm:max-w-md flex items-center justify-between px-2.5 sm:px-3.5 py-1.5 bg-[#1f2738] hover:bg-[#262f43] border border-[#2f3950] rounded-xl text-xs text-slate-400 transition-all shadow-inner group min-w-0"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 truncate min-w-0">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors shrink-0" />
                <span className="truncate text-[11px] sm:text-xs">Search prayers, countries, meetings...</span>
              </div>
              <div className="hidden md:flex items-center gap-0.5 text-[10px] bg-[#161b26] text-slate-400 px-1.5 py-0.5 rounded border border-[#2f3950] shrink-0">
                <span>Ctrl</span>
                <span>K</span>
              </div>
            </button>

          </div>

          {/* RIGHT ZONE: Status, Quick Call, Settings, Profile Avatar */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Quick Launch New Meeting Button */}
            <button
              onClick={() => onLaunchInstantCall ? onLaunchInstantCall() : handleNavClick('missionary-hub')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#f26d21] hover:bg-[#e05b11] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
              title="Launch Instant Meeting"
            >
              <Plus className="w-4 h-4" />
              <span>New Meeting</span>
            </button>

            {/* Presence Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1f2738] hover:bg-[#262f43] border border-[#2f3950] rounded-xl text-xs font-semibold text-slate-300 transition-colors"
                title="Change Presence Status"
              >
                {getStatusDot()}
                <span className="hidden xl:inline capitalize text-[11px]">{presenceStatus.replace('-', ' ')}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showStatusMenu && (
                <div className="absolute top-10 right-0 w-44 bg-[#1f2738] border border-[#2f3950] rounded-2xl shadow-2xl p-2 z-50 text-xs space-y-1 animate-fadeIn">
                  <div className="text-[10px] font-bold uppercase text-slate-400 px-2 py-1">Set Presence:</div>
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
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#2a3449] font-medium transition-colors flex items-center justify-between"
                    >
                      <span className={s.color}>{s.label}</span>
                      {presenceStatus === s.id && <span className="text-blue-400 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Avatar with Zoom Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#1f2738] transition-colors"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-[#0e71eb] text-white font-bold flex items-center justify-center text-xs shadow-md">
                    {currentUser?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5">
                    {getStatusDot()}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
              </button>

              {/* Profile Dropdown Box */}
              {profileDropdownOpen && (
                <div className="absolute top-11 right-0 w-64 bg-[#1f2738] border border-[#2f3950] rounded-2xl shadow-2xl p-3 z-50 text-xs space-y-2 animate-fadeIn">
                  <div className="p-2 bg-[#161b26] rounded-xl border border-[#2f3950]">
                    <div className="font-bold text-white text-sm truncate">{currentUser?.fullName || 'Operative'}</div>
                    <div className="text-[11px] text-slate-400 truncate">{currentUser?.email}</div>
                    <span className="inline-block mt-1 text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded font-semibold border border-blue-800">
                      {currentUser?.role || 'Missionary'} · Zoom Enterprise
                    </span>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        handleNavClick('user-profile');
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#2a3449] transition-colors flex items-center gap-2 text-slate-300"
                    >
                      <User className="w-4 h-4 text-blue-400" />
                      <span>My Profile & Statistics</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#2f3950]">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-950/50 text-red-400 font-semibold transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </header>
    </>
  );
};
