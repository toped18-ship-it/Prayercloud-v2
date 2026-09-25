import React from 'react';
import {
  Globe,
  Compass,
  MapPin,
  BookOpen,
  FileText
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
    { id: 'reports', label: 'Breakthroughs', icon: FileText },
    { id: 'countries', label: '195 Nations', icon: MapPin },
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
            (tab.id === 'missionary-hub' && (currentPage === 'hub' || currentPage === 'map' || currentPage === 'chat' || currentPage === 'chatroom' || currentPage === 'conferences' || currentPage === 'calls' || currentPage === 'prayer-requests')) ||
            (tab.id === 'devotionals' && (currentPage === 'devotional-hub' || currentPage === 'bible' || currentPage === 'devotional'));

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
              </div>
              <span className="whitespace-nowrap leading-none tracking-tight">{tab.label}</span>
              {tab.badge && (
                <span className="hidden sm:inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded-full leading-tight bg-emerald-700/80 text-emerald-100">
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
