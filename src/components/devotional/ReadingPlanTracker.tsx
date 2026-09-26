import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  BookOpen,
  Sparkles,
  Flame,
  ArrowRight,
  Award
} from 'lucide-react';
import { SU_READING_PLANS_2026 } from '../../data/devotionalsData';
import { bibleService } from '../../services/bibleService';

interface ReadingPlanTrackerProps {
  onSelectPassage: (passage: string) => void;
}

export const ReadingPlanTracker: React.FC<ReadingPlanTrackerProps> = ({
  onSelectPassage
}) => {
  const [completedDays, setCompletedDays] = useState<Record<number, boolean>>(() => {
    try {
      const data = localStorage.getItem('prayercloud_reading_plan_completed_days');
      return data ? JSON.parse(data) : { 268: true };
    } catch {
      return { 268: true };
    }
  });

  const streak = bibleService.getStreak();
  const todayStr = bibleService.getTodayDateString();

  const toggleDayComplete = (day: number) => {
    const updated = { ...completedDays, [day]: !completedDays[day] };
    setCompletedDays(updated);
    localStorage.setItem('prayercloud_reading_plan_completed_days', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      
      {/* Plan Header & Streak Overview */}
      <div className="bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>Scripture Union Bible in One Year</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Daily Scripture Systematic Reading Plan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Read through the entire Old and New Testament with Scripture Union's structured daily schedule.
            </p>
          </div>

          {/* Consecutive Streak Pill */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">
                Word Streak
              </div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {streak.currentStreak} Days Consecutive
              </div>
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-3 pt-2">
          {SU_READING_PLANS_2026.map((item) => {
            const isDone = completedDays[item.day];
            const isToday = item.date === todayStr;

            return (
              <div
                key={item.day}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isToday
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-sm'
                    : isDone
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-slate-50 dark:bg-[#1a2130] border-slate-200 dark:border-[#2a3449]'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <button
                    onClick={() => toggleDayComplete(item.day)}
                    className={`p-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-white">Day {item.day}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{item.date}</span>
                      {isToday && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-500 dark:text-amber-400 font-extrabold text-[10px] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Today's Plan
                        </span>
                      )}
                      <span className="text-amber-500 font-semibold hidden md:inline">({item.theme})</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-[#0e71eb]">{item.passage}</span>
                      <span>|</span>
                      <span>OT: {item.otReading}</span>
                      <span>|</span>
                      <span>NT: {item.ntReading}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectPassage(item.passage)}
                  className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] text-[#0e71eb] font-bold text-xs hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center gap-1 self-start sm:self-auto transition-colors"
                >
                  <span>Open in Bible</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
