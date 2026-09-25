import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  PenTool,
  Flame,
  Award,
  Globe,
  Sliders,
  Sparkles,
  Search,
  Columns,
  Maximize2,
  Heart,
  Share2,
  Bookmark
} from 'lucide-react';
import { SUDailyDevotional } from '../types';
import { SU_DAILY_DEVOTIONALS } from '../data/devotionalsData';
import { DevotionalReader } from '../components/devotional/DevotionalReader';
import { IntegratedBibleReader } from '../components/devotional/IntegratedBibleReader';
import { DevotionalJournal } from '../components/devotional/DevotionalJournal';
import { ReadingPlanTracker } from '../components/devotional/ReadingPlanTracker';

interface DevotionalHubPageProps {
  initialTab?: 'devotional' | 'bible' | 'split' | 'journal' | 'plan';
  onNavigate?: (page: string, param?: string) => void;
}

export const DevotionalHubPage: React.FC<DevotionalHubPageProps> = ({
  initialTab = 'devotional',
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'devotional' | 'bible' | 'split' | 'journal' | 'plan'>(initialTab);
  const [currentDevotional, setCurrentDevotional] = useState<SUDailyDevotional>(() => SU_DAILY_DEVOTIONALS[0]);
  
  // Bible navigation state
  const [bibleBook, setBibleBook] = useState<string>(currentDevotional.biblePassage.book || 'Acts');
  const [bibleChapter, setBibleChapter] = useState<number>(currentDevotional.biblePassage.chapter || 4);

  const handleOpenBiblePassage = (book: string, chapter: number) => {
    setBibleBook(book);
    setBibleChapter(chapter);
    setActiveTab('bible');
  };

  const handleOpenJournalNote = (devotional: SUDailyDevotional) => {
    setCurrentDevotional(devotional);
    setActiveTab('journal');
  };

  const handleSelectPassageFromPlan = (passageStr: string) => {
    // e.g. "Acts 4:23-31" or "John 7:37-39"
    const parts = passageStr.split(' ');
    const bookName = parts[0];
    const chapterAndVerses = parts[1] || '1';
    const chapterNum = parseInt(chapterAndVerses.split(':')[0], 10) || 1;
    
    setBibleBook(bookName);
    setBibleChapter(chapterNum);
    setActiveTab('bible');
  };

  const tabs = [
    { id: 'devotional', label: 'SU Daily Devotionals', icon: Flame, badge: 'Daily' },
    { id: 'bible', label: 'Holy Bible', icon: BookOpen, badge: '66 Books' },
    { id: 'split', label: 'Split Reader (Devo + Bible)', icon: Columns, badge: 'Dual' },
    { id: 'journal', label: 'Spiritual Journal', icon: PenTool },
    { id: 'plan', label: 'One-Year Bible Plan', icon: Award }
  ];

  return (
    <div className="space-y-6 pb-20 font-sans">
      
      {/* Top Banner: Devotional Command & Scripture Union Global Watch */}
      <div className="bg-gradient-to-br from-[#131926] via-[#1a233a] to-[#0f172a] rounded-3xl border border-[#2a3754] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold backdrop-blur-sm">
              <Flame className="w-3.5 h-3.5 fill-current animate-pulse text-amber-400" />
              <span>Scripture Union (SU) Global Devotional Hub</span>
              <span className="text-slate-400">·</span>
              <span className="text-blue-300">120+ Nations in the Word</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Daily Bread & Systematic Bible Hub
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Equipping frontier intercessors, missionaries, and disciples with Scripture Union daily guides, the complete Holy Bible, and personal Rhema journaling.
            </p>
          </div>

          {/* Quick Hub Stats */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            <div className="p-3.5 rounded-2xl bg-[#161c2b]/90 border border-[#2a3754] text-center min-w-[110px]">
              <div className="text-[10px] text-slate-400 font-bold uppercase">SU Editions</div>
              <div className="text-lg font-black text-amber-400 mt-0.5">3 Guides</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#161c2b]/90 border border-[#2a3754] text-center min-w-[110px]">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Bible Books</div>
              <div className="text-lg font-black text-sky-400 mt-0.5">66 Books</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#161c2b]/90 border border-[#2a3754] text-center min-w-[110px]">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Translations</div>
              <div className="text-lg font-black text-emerald-400 mt-0.5">5 Versions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Hub Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-[#262f43]">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#0e71eb] text-white shadow-lg shadow-blue-500/20 scale-[1.02]'
                  : 'bg-white dark:bg-[#161b26] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1f2738] border border-slate-200 dark:border-[#262f43]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-[#252f44] text-slate-500 dark:text-slate-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: SU Daily Devotional View */}
      {activeTab === 'devotional' && (
        <DevotionalReader
          devotional={currentDevotional}
          onSelectDevotional={setCurrentDevotional}
          onOpenBiblePassage={handleOpenBiblePassage}
          onOpenJournalNote={handleOpenJournalNote}
          onToggleSplitBible={() => setActiveTab('split')}
          isSplitView={false}
        />
      )}

      {/* Tab 2: Full Integrated Bible Reader */}
      {activeTab === 'bible' && (
        <IntegratedBibleReader
          initialBook={bibleBook}
          initialChapter={bibleChapter}
          isEmbeddedInHub={true}
        />
      )}

      {/* Tab 3: Dual Split Reader (Devotional on Left, Bible on Right) */}
      {activeTab === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-500">
                Left Pane: Scripture Union Daily Guide
              </span>
              <span className="text-xs text-slate-400">{currentDevotional.title}</span>
            </div>
            <DevotionalReader
              devotional={currentDevotional}
              onSelectDevotional={setCurrentDevotional}
              onOpenBiblePassage={(b, c) => {
                setBibleBook(b);
                setBibleChapter(c);
              }}
              onOpenJournalNote={handleOpenJournalNote}
              isSplitView={true}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-400">
                Right Pane: Integrated Holy Bible
              </span>
              <span className="text-xs text-slate-400">{bibleBook} {bibleChapter}</span>
            </div>
            <IntegratedBibleReader
              initialBook={bibleBook}
              initialChapter={bibleChapter}
              isEmbeddedInHub={true}
            />
          </div>
        </div>
      )}

      {/* Tab 4: Spiritual Journal & Notes */}
      {activeTab === 'journal' && (
        <DevotionalJournal
          initialDevotional={currentDevotional}
          onOpenPassage={handleOpenBiblePassage}
        />
      )}

      {/* Tab 5: Systematic Bible in a Year Reading Plan */}
      {activeTab === 'plan' && (
        <ReadingPlanTracker
          onSelectPassage={handleSelectPassageFromPlan}
        />
      )}

    </div>
  );
};
