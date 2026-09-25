import React from 'react';
import {
  Globe,
  Compass,
  MessageSquare,
  MapPin,
  BookOpen
} from 'lucide-react';

interface BottomNavbarProps {
  currentPage: string;
  onNavigate: (page: string, param?: string) => void;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  currentPage,
  onNavigate
}) => {
  const navTabs = [
    { id: 'home', label: 'Home', icon: Globe },
    { id: 'devotionals', label: 'Devotional & Bible', icon: BookOpen, badge: 'SU Daily' },
    { id: 'missionary-hub', label: 'Missionary Hub', icon: Compass, badge: 'Hub' },
    { id: 'chat', label: 'Chatroom', icon: MessageSquare, badge: 'Live' },
    { id: 'countries', label: 'Countries', icon: MapPin },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#121622]/95 backdrop-blur-lg border-t border-[#202738] shadow-2xl select-none transition-all w-full max-w-full overflow-x-hidden"
      aria-label="Bottom Global Navigation"
    >
      <div className="max-w-[1700px] mx-auto px-1.5 sm:px-4 py-1.5 flex items-center justify-between sm:justify-center gap-1 sm:gap-3 overflow-x-auto no-scrollbar">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            currentPage === tab.id ||
            (tab.id === 'conferences' && (currentPage === 'calls' || currentPage === 'events')) ||
            (tab.id === 'missionary-hub' && (currentPage === 'hub')) ||
            (tab.id === 'chat' && (currentPage === 'chatroom'));

          return (
            <button
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className={`relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl text-[11px] sm:text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-[#1a2130]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 sm:w-4 sm:h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.badge && tab.badge === 'Live' && (
                  <span className="absolute -top-1 -right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </div>
              <span className="whitespace-nowrap leading-none tracking-tight">{tab.label}</span>
              {tab.badge && (
                <span className={`hidden sm:inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded-full leading-tight ${
                  tab.badge === 'Live' ? 'bg-red-600 text-white' : 'bg-emerald-700/80 text-emerald-100'
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

