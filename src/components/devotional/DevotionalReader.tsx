import React, { useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Copy,
  Check,
  Globe,
  PenTool,
  HelpCircle,
  ExternalLink,
  Flame,
  Award,
  Heart
} from 'lucide-react';
import { SUDailyDevotional, SUDevotionalEdition } from '../../types';
import { bibleService } from '../../services/bibleService';

interface DevotionalReaderProps {
  devotional: SUDailyDevotional;
  onSelectDevotional: (devotional: SUDailyDevotional) => void;
  onOpenBiblePassage: (book: string, chapter: number, verses?: string) => void;
  onOpenJournalNote: (devotional: SUDailyDevotional) => void;
  onToggleSplitBible?: () => void;
  isSplitView?: boolean;
}

export const DevotionalReader: React.FC<DevotionalReaderProps> = ({
  devotional,
  onSelectDevotional,
  onOpenBiblePassage,
  onOpenJournalNote
}) => {
  const [copiedKeyVerse, setCopiedKeyVerse] = useState(false);
  const [hasPrayedCommitment, setHasPrayedCommitment] = useState(false);

  const handleCopyKeyVerse = () => {
    navigator.clipboard.writeText(`"${devotional.keyVerse.text}" — ${devotional.keyVerse.reference}`);
    setCopiedKeyVerse(true);
    setTimeout(() => setCopiedKeyVerse(false), 2000);
  };

  const handleCommitPrayer = () => {
    setHasPrayedCommitment(true);
    bibleService.recordDevotionalRead(devotional.date);
  };

  const todayStr = bibleService.getTodayDateString();
  const isToday = devotional.date === todayStr;

  // Date step
  const handleDateStep = (direction: 'prev' | 'next') => {
    const targetDate = bibleService.shiftDate(devotional.date, direction === 'next' ? 1 : -1);
    const nextDevo = bibleService.getDevotionalByDate(targetDate, devotional.edition);
    onSelectDevotional(nextDevo);
    setHasPrayedCommitment(false);
  };

  const handleJumpToToday = () => {
    const todayDevo = bibleService.getTodayDevotional(devotional.edition);
    onSelectDevotional(todayDevo);
    setHasPrayedCommitment(false);
  };

  const handleDateChange = (newDateStr: string) => {
    if (!newDateStr) return;
    const targetDevo = bibleService.getDevotionalByDate(newDateStr, devotional.edition);
    onSelectDevotional(targetDevo);
    setHasPrayedCommitment(false);
  };

  const handleEditionChange = (newEdition: SUDevotionalEdition) => {
    const updated = bibleService.getDevotionalByDate(devotional.date, newEdition);
    onSelectDevotional(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* Date Navigation & Edition Bar */}
      <div className="bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold shrink-0">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                {devotional.edition || 'Daily Guide'}
              </span>
              {isToday ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 text-[10px] font-extrabold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Today's Reading
                </span>
              ) : (
                <button
                  onClick={handleJumpToToday}
                  className="px-2.5 py-0.5 rounded-full bg-[#0e71eb]/15 hover:bg-[#0e71eb]/25 border border-[#0e71eb]/30 text-[#0e71eb] dark:text-blue-400 text-[10px] font-extrabold flex items-center gap-1 transition-all"
                  title="Return to today's daily devotional"
                >
                  <Calendar className="w-3 h-3" />
                  <span>Jump to Today</span>
                </button>
              )}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>Scripture Union Worldwide</span>
              <span>·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Updates Daily</span>
            </div>
          </div>
        </div>

        {/* Edition selector and Date controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Edition switcher pills */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-[#1a2130] rounded-xl border border-slate-200 dark:border-[#2a3449] text-xs">
            {(['Daily Guide', 'Daily Power', 'Encounter with God'] as SUDevotionalEdition[]).map(ed => (
              <button
                key={ed}
                onClick={() => handleEditionChange(ed)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  (devotional.edition || 'Daily Guide') === ed
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {ed === 'Daily Guide' ? 'Daily Guide' : ed === 'Daily Power' ? 'Youth Power' : 'Encounter'}
              </button>
            ))}
          </div>

          {/* Stepper with Previous, Calendar Date Picker, and Next */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleDateStep('prev')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#1f2738] hover:bg-slate-200 dark:hover:bg-[#252f44] text-slate-600 dark:text-slate-300 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Date Display with Hidden native Datepicker for 1-click select */}
            <label className="relative flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-[#1a2130] hover:bg-slate-200 dark:hover:bg-[#222b3d] rounded-xl border border-slate-200 dark:border-[#2a3449] text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer transition-colors">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>
                {new Date(devotional.date + 'T12:00:00').toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <input
                type="date"
                value={devotional.date}
                onChange={e => handleDateChange(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
                title="Select any date"
              />
            </label>

            <button
              onClick={() => handleDateStep('next')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#1f2738] hover:bg-slate-200 dark:hover:bg-[#252f44] text-slate-600 dark:text-slate-300 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Devotional Body Card */}
      <div className="bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] p-6 sm:p-9 shadow-sm space-y-7 font-sans">
        
        {/* Title Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30">
              Daily Guide
            </span>
            <span>·</span>
            <span>SU Worldwide Daily Discipleship</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {devotional.title}
          </h1>
        </div>

        {/* 1. Opening Prayer (SU Standard Opening) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-blue-900 dark:text-blue-200 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Opening Prayer</span>
          </div>
          <p className="text-xs sm:text-sm italic leading-relaxed">
            "{devotional.openingPrayer}"
          </p>
        </div>

        {/* 2. Scripture Passage Banner & Interactive Open */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-blue-950 text-white border border-blue-900 shadow-md space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                Today's Bible Reading
              </div>
              <div className="text-xl font-black text-white mt-0.5">
                {devotional.biblePassage.book} {devotional.biblePassage.chapter}:{devotional.biblePassage.verses}
              </div>
            </div>

            <button
              onClick={() => onOpenBiblePassage(devotional.biblePassage.book, devotional.biblePassage.chapter, devotional.biblePassage.verses)}
              className="px-4 py-2 bg-[#0e71eb] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 self-start sm:self-auto hover:scale-105 active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Full Passage in Bible</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono-data bg-black/40 p-3.5 rounded-xl border border-white/10">
            {devotional.biblePassage.text}
          </p>
        </div>

        {/* 3. Key Memory Verse Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-300/60 dark:border-amber-500/30 text-slate-900 dark:text-white space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Key Memory Verse</span>
            </span>

            <button
              onClick={handleCopyKeyVerse}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
            >
              {copiedKeyVerse ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKeyVerse ? 'Copied!' : 'Copy Verse'}</span>
            </button>
          </div>

          <blockquote className="text-base sm:text-lg font-bold italic text-slate-900 dark:text-amber-100 leading-snug">
            "{devotional.keyVerse.text}"
          </blockquote>

          <div className="text-xs font-extrabold text-amber-700 dark:text-amber-400 text-right">
            — {devotional.keyVerse.reference}
          </div>
        </div>

        {/* 4. Scripture Union Reading Notes / Expository Meditation */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#262f43] pb-2">
            <BookOpen className="w-4 h-4 text-[#0e71eb]" />
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
              Meditation & Reading Notes
            </h3>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {devotional.readingNotes.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* 5. Scripture Union 4-Question Reflection Grid */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-500" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider">
              Practical Reflection Questions (P.R.A.Y.)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {devotional.reflectionQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1a2130] border border-slate-200 dark:border-[#2a3449] space-y-1.5"
              >
                <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Reflection #{idx + 1}
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {q}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Prayer of Commitment (Interactive Consecration) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/40 dark:via-[#16232b] dark:to-blue-950/30 border border-emerald-300/60 dark:border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-current text-emerald-500" />
              <span>Prayer of Commitment</span>
            </div>
            {hasPrayedCommitment && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-white flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Amen Recorded</span>
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-800 dark:text-emerald-100 italic leading-relaxed">
            "{devotional.prayerOfCommitment}"
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleCommitPrayer}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                hasPrayedCommitment
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 hover:scale-105 active:scale-95'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{hasPrayedCommitment ? 'I Have Prayed This Prayer ✓' : 'Say Amen & Record Daily Watch'}</span>
            </button>

            <button
              onClick={() => onOpenJournalNote(devotional)}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#28334a] font-bold text-xs flex items-center gap-2 transition-colors"
            >
              <PenTool className="w-3.5 h-3.5 text-[#0e71eb]" />
              <span>Record Rhema Journal Entry</span>
            </button>
          </div>
        </div>

        {/* 7. SU Global Prayer Network Focus */}
        <div className="p-5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/70 dark:border-purple-900/40 text-slate-900 dark:text-white space-y-2">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-wider">
            <Globe className="w-4 h-4" />
            <span>Scripture Union Worldwide Prayer Focus</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-purple-100 leading-relaxed">
            {devotional.suGlobalPrayerFocus}
          </p>
        </div>

        {/* 8. Bible in a Year Schedule */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#262f43] text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-[#0e71eb]" />
            <span className="font-bold text-slate-700 dark:text-slate-300">Bible in a Year:</span>
            <span>Morning: <strong>{devotional.oneYearBibleReading.morning}</strong></span>
            <span>·</span>
            <span>Evening: <strong>{devotional.oneYearBibleReading.evening}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {devotional.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1f2738] text-slate-600 dark:text-slate-400 text-[10px] font-semibold">
                #{tag}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
