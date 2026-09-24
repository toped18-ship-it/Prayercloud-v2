import React, { useState, useMemo } from 'react';
import { PrayerRequest } from '../types';
import { PrayerRequestCard } from '../components/prayer/PrayerRequestCard';
import { HeartHandshake, Search, Plus, Filter, Flame, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PrayerBoardPageProps {
  prayers: PrayerRequest[];
  onOpenCreatePrayer: () => void;
  onRefreshPrayers: () => void;
}

export const PrayerBoardPage: React.FC<PrayerBoardPageProps> = ({
  prayers,
  onOpenCreatePrayer,
  onRefreshPrayers
}) => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('All');
  const [filterAnsweredOnly, setFilterAnsweredOnly] = useState(false);

  const categories = ['All', 'Country Need', 'Missionary Request', 'Unreached Tribe', 'Emergency / Persecution', 'Personal'];
  const urgencies = ['All', 'Urgent', 'High', 'Normal'];

  const filteredPrayers = useMemo(() => {
    return prayers.filter((p) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const mTitle = p.title.toLowerCase().includes(q);
        const mDesc = p.description.toLowerCase().includes(q);
        const mCountry = p.targetCountry?.toLowerCase().includes(q);
        if (!mTitle && !mDesc && !mCountry) return false;
      }

      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedUrgency !== 'All' && p.urgency !== selectedUrgency) return false;
      if (filterAnsweredOnly && !p.isAnswered) return false;

      return true;
    });
  }, [prayers, searchQuery, selectedCategory, selectedUrgency, filterAnsweredOnly]);

  return (
    <div className="space-y-6 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Global Intercession & Prayer Board
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stand in spiritual agreement for frontline workers, unreached tribes, and national revivals.
          </p>
        </div>

        <button
          onClick={onOpenCreatePrayer}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Post Prayer Need</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prayer requests by keyword, country, or worker..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
              </select>
            </div>

            <div>
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              >
                {urgencies.map(u => <option key={u} value={u}>{u === 'All' ? 'All Urgencies' : u}</option>)}
              </select>
            </div>
          </div>

          {/* Answered praise report toggle */}
          <button
            onClick={() => setFilterAnsweredOnly(!filterAnsweredOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
              filterAnsweredOnly
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Answered Praise Reports ({prayers.filter(p => p.isAnswered).length})</span>
          </button>
        </div>
      </div>

      {/* Prayer Request Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPrayers.map((prayer) => (
          <PrayerRequestCard
            key={prayer.id}
            request={prayer}
            onUpdate={onRefreshPrayers}
          />
        ))}
      </div>
    </div>
  );
};
