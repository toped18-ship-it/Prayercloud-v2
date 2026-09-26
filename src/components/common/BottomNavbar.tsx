import React from 'react';
import {
  Globe,
  Compass,
  MessageSquare,
  MapPin,
  BookOpen,
  User,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface BottomNavbarProps {
  currentPage: string;
  onNavigate: (page: string, param?: string) => void;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  currentPage,
  onNavigate
}) => {
  const { currentUser, isAdmin } = useAuth();

  const navTabs = [
    ...(isAdmin
      ? [{ id: 'admin', label: 'Admin', icon: ShieldCheck, badge: 'HQ', isAdminTab: true }]
      : []),
    { id: 'user-profile', label: 'Profile', icon: User, isProfile: true },
    { id: 'home', label: 'Home', icon: Globe },
    { id: 'devotionals', label: 'Devotional', icon: BookOpen, badge: 'Daily' },
    { id: 'missionary-hub', label: 'Hub', icon: Compass },
    { id: 'chat', label: 'Chat', icon: MessageSquare, badge: 'Live' },
    { id: 'countries', label: 'Countries', icon: MapPin }
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#10141f]/95 backdrop-blur-lg border-t border-[#1f2738] shadow-xl select-none transition-all w-full max-w-full overflow-x-hidden"
      aria-label="Bottom Navigation"
    >
      <div className="max-w-[1400px] mx-auto px-1.5 sm:px-3 py-1 flex items-center justify-between sm:justify-center gap-1 sm:gap-2.5 overflow-x-auto no-scrollbar">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            currentPage === tab.id ||
            (tab.id === 'user-profile' && (currentPage === 'profile' || currentPage === 'user-profile')) ||
            (tab.id === 'devotionals' && (currentPage === 'bible' || currentPage === 'devotional-hub')) ||
            (tab.id === 'missionary-hub' && (currentPage === 'hub' || currentPage === 'map' || currentPage === 'prayer-requests' || currentPage === 'calls')) ||
            (tab.id === 'chat' && (currentPage === 'chatroom'));

          const isAdminTab = (tab as any).isAdminTab;

          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className={`relative flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl text-[10px] sm:text-[11px] font-semibold transition-all shrink-0 ${
                isActive
                  ? isAdminTab
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30 scale-[1.02]'
                    : 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                  : isAdminTab
                  ? 'text-amber-400 bg-amber-950/40 border border-amber-500/30 hover:bg-amber-900/50 hover:text-amber-200'
                  : 'text-slate-400 hover:text-white hover:bg-[#18202f]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                {tab.isProfile && currentUser ? (
                  currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName}
                      className={`w-4 h-4 rounded-full object-cover ${
                        isActive ? 'ring-2 ring-white shadow-xs' : 'ring-1 ring-blue-400/50'
                      }`}
                    />
                  ) : (
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                      isActive ? 'bg-amber-400 text-slate-900 ring-1 ring-white' : 'bg-blue-500/90 text-white'
                    }`}>
                      {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )
                ) : (
                  <Icon className={`w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 ${isActive ? (isAdminTab ? 'text-slate-950' : 'text-white') : (isAdminTab ? 'text-amber-400' : 'text-slate-400')}`} />
                )}

                {tab.badge && tab.badge === 'Live' && (
                  <span className="absolute -top-1 -right-1 flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                  </span>
                )}
              </div>

              <span className="whitespace-nowrap leading-tight tracking-tight text-[10px] sm:text-[11px]">{tab.label}</span>

              {tab.badge && tab.badge !== 'Live' && (
                <span className={`hidden sm:inline-block text-[8px] font-bold px-1 py-0.2 rounded-full leading-none ${
                  isAdminTab ? 'bg-slate-900 text-amber-300' : 'bg-blue-950 text-blue-300 border border-blue-800/60'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
export default BottomNavbar;
