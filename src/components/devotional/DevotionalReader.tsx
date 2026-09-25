import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Share2,
  Bookmark,
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Copy,
  Check,
  Globe,
  Sliders,
  PenTool,
  HelpCircle,
  ExternalLink,
  Flame,
  Award
} from 'lucide-react';
import { SUDailyDevotional, SUDevotionalEdition } from '../../types';
import { SU_DAILY_DEVOTIONALS } from '../../data/devotionalsData';
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
  onOpenJournalNote,
  onToggleSplitBible,
  isSplitView = false
}) => {
  const [selectedEdition, setSelectedEdition] = useState<SUDevotionalEdition>(devotional.edition);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [isSerif, setIsSerif] = useState(false);
  const [copiedKeyVerse, setCopiedKeyVerse] = useState(false);
  const [hasPrayedCommitment, setHasPrayedCommitment] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(false);

  // Check speech synthesis support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesisSupported(true);
    }
  }, []);

  // Stop audio on devotional change
  useEffect(() => {
    if (speechSynthesisSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    setHasPrayedCommitment(false);
  }, [devotional, speechSynthesisSupported]);

  const handleToggleAudio = () => {
    if (!speechSynthesisSupported) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToRead = `${devotional.title}. Scripture reading from ${devotional.biblePassage.book} chapter ${devotional.biblePassage.chapter}. Key verse: ${devotional.keyVerse.text}. ${devotional.readingNotes.join(' ')} Prayer: ${devotional.prayerOfCommitment}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleCopyKeyVerse = () => {
    navigator.clipboard.writeText(`"${devotional.keyVerse.text}" — ${devotional.keyVerse.reference}`);
    setCopiedKeyVerse(true);
    setTimeout(() => setCopiedKeyVerse(false), 2000);
  };

  const handleCommitPrayer = () => {
    setHasPrayedCommitment(true);
    bibleService.recordDevotionalRead(devotional.date);
  };

  // Switch edition
  const handleEditionChange = (edition: SUDevotionalEdition) => {
    setSelectedEdition(edition);
    const matched = SU_DAILY_DEVOTIONALS.find(d => d.date === devotional.date && d.edition === edition) ||
                    SU_DAILY_DEVOTIONALS.find(d => d.edition === edition) || devotional;
    onSelectDevotional(matched);
  };

  // Date step
  const handleDateStep = (direction: 'prev' | 'next') => {
    const allDevos = SU_DAILY_DEVOTIONALS.filter(d => d.edition === selectedEdition);
    const currentIdx = allDevos.findIndex(d => d.id === devotional.id);
    if (direction === 'prev' && currentIdx > 0) {
      onSelectDevotional(allDevos[currentIdx - 1]);
    } else if (direction === 'next' && currentIdx < allDevos.length - 1) {
      onSelectDevotional(allDevos[currentIdx + 1]);
    }
  };

  const editions: SUDevotionalEdition[] = ['Daily Guide', 'Daily Power', 'Encounter with God'];

  const fontClass =
    fontSize === 'sm' ? 'text-xs sm:text-sm' :
    fontSize === 'lg' ? 'text-base sm:text-lg' :
    fontSize === 'xl' ? 'text-lg sm:text-xl' : 'text-sm sm:text-base';

  return (
    <div className="space-y-6">
      
      {/* Top Header Card: Scripture Union Branding, Editions & Date Navigator */}
      <div className="bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] p-5 sm:p-7 shadow-sm space-y-4">
        
        {/* Top meta strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#262f43] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-red-600 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                  SCRIPTURE UNION (SU)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                  Official Guide
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Daily Bread for Disciples & Frontier Missionaries · {devotional.authorOrSource}
              </div>
            </div>
          </div>

          {/* Quick Audio & Font Reading Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            {speechSynthesisSupported && (
              <button
                onClick={handleToggleAudio}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-slate-100 dark:bg-[#1f2738] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#252f44]'
                }`}
                title="Listen to today's devotional"
              >
                {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-500" />}
                <span>{isPlayingAudio ? 'Pause Audio' : 'Listen'}</span>
              </button>
            )}

            {/* Font size toggles */}
            <div className="flex items-center bg-slate-100 dark:bg-[#1f2738] rounded-xl p-0.5 border border-slate-200 dark:border-[#2f3950]">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 rounded-lg text-xs font-bold ${fontSize === 'sm' ? 'bg-white dark:bg-slate-700 text-[#0e71eb] shadow-xs' : 'text-slate-400'}`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 rounded-lg text-xs font-bold ${fontSize === 'base' ? 'bg-white dark:bg-slate-700 text-[#0e71eb] shadow-xs' : 'text-slate-400'}`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 rounded-lg text-xs font-bold ${fontSize === 'lg' ? 'bg-white dark:bg-slate-700 text-[#0e71eb] shadow-xs' : 'text-slate-400'}`}
              >
                A+
              </button>
            </div>

            {/* Serif font toggle */}
            <button
              onClick={() => setIsSerif(!isSerif)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                isSerif
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0e71eb] border-blue-400/40'
                  : 'bg-slate-100 dark:bg-[#1f2738] text-slate-600 dark:text-slate-400 border-transparent'
              }`}
              title="Toggle Serif Reading Font"
            >
              Serif
            </button>

            {/* Split view with Bible */}
            {onToggleSplitBible && (
              <button
                onClick={onToggleSplitBible}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 ${
                  isSplitView
                    ? 'bg-[#0e71eb] text-white border-[#0e71eb]'
                    : 'bg-slate-100 dark:bg-[#1f2738] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#252f44] border-slate-200 dark:border-[#2f3950]'
                }`}
                title="Toggle Side-by-Side Bible View"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isSplitView ? 'Close Split Bible' : 'Split Bible'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Edition Switcher & Date Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Edition tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {editions.map((ed) => (
              <button
                key={ed}
                onClick={() => handleEditionChange(ed)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedEdition === ed
                    ? 'bg-gradient-to-r from-[#0e71eb] to-blue-700 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-100 dark:bg-[#1a2130] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#252f44]'
                }`}
              >
                {ed}
              </button>
            ))}
          </div>

          {/* Date Selector and Stepper */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => handleDateStep('prev')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#1f2738] hover:bg-slate-200 dark:hover:bg-[#252f44] text-slate-600 dark:text-slate-300 transition-colors"
              title="Previous Devotional"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-[#1a2130] rounded-xl border border-slate-200 dark:border-[#2a3449] text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>{new Date(devotional.date + 'T00:00:00').toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>

            <button
              onClick={() => handleDateStep('next')}
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#1f2738] hover:bg-slate-200 dark:hover:bg-[#252f44] text-slate-600 dark:text-slate-300 transition-colors"
              title="Next Devotional"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Devotional Body Card */}
      <div className={`bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] p-6 sm:p-9 shadow-sm space-y-7 ${isSerif ? 'font-serif' : 'font-sans'}`}>
        
        {/* Title Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30">
              {devotional.edition}
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

          <div className={`space-y-4 ${fontClass} text-slate-700 dark:text-slate-300 leading-relaxed`}>
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
              Scripture Union Practical Questions (P.R.A.Y.)
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
