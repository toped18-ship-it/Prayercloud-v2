import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Highlighter,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Share2,
  Sliders,
  Filter,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import { BIBLE_BOOKS, BIBLE_TRANSLATIONS } from '../../data/bibleData';
import { bibleService } from '../../services/bibleService';
import { BibleBookMeta, BibleChapterData, BibleHighlight } from '../../types';

interface IntegratedBibleReaderProps {
  initialBook?: string;
  initialChapter?: number;
  highlightPassageVerse?: string;
  onClose?: () => void;
  isEmbeddedInHub?: boolean;
}

export const IntegratedBibleReader: React.FC<IntegratedBibleReaderProps> = ({
  initialBook = 'Acts',
  initialChapter = 4,
  highlightPassageVerse,
  onClose,
  isEmbeddedInHub = true
}) => {
  const [selectedBook, setSelectedBook] = useState<string>(initialBook);
  const [selectedChapter, setSelectedChapter] = useState<number>(initialChapter);
  const [selectedTranslation, setSelectedTranslation] = useState<string>('NIV');
  const [searchQuery, setSearchQuery] = useState('');
  const [isBookPickerOpen, setIsBookPickerOpen] = useState(false);
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | 'OT' | 'NT'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [isSerif, setIsSerif] = useState(false);
  
  // Highlighting & selection
  const [highlights, setHighlights] = useState<BibleHighlight[]>(() => bibleService.getHighlights());
  const [activeHighlightColor, setActiveHighlightColor] = useState<'amber' | 'emerald' | 'blue' | 'purple' | 'rose'>('amber');
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | null>(null);
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);

  // Audio Speech state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Sync with prop changes
  useEffect(() => {
    if (initialBook) setSelectedBook(initialBook);
    if (initialChapter) setSelectedChapter(initialChapter);
  }, [initialBook, initialChapter]);

  // Current book metadata
  const currentBookMeta: BibleBookMeta = useMemo(() => {
    return BIBLE_BOOKS.find(b => b.name.toLowerCase() === selectedBook.toLowerCase()) || BIBLE_BOOKS[43]; // Default Acts
  }, [selectedBook]);

  // Chapter data
  const chapterData: BibleChapterData = useMemo(() => {
    return bibleService.getChapter(currentBookMeta.name, selectedChapter, selectedTranslation);
  }, [currentBookMeta.name, selectedChapter, selectedTranslation]);

  // Filtered books list
  const filteredBooks = useMemo(() => {
    return BIBLE_BOOKS.filter(b => {
      if (testamentFilter !== 'ALL' && b.testament !== testamentFilter) return false;
      if (categoryFilter !== 'ALL' && b.category !== categoryFilter) return false;
      return true;
    });
  }, [testamentFilter, categoryFilter]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    return bibleService.searchVerses(searchQuery, selectedTranslation);
  }, [searchQuery, selectedTranslation]);

  const handleNextChapter = () => {
    if (selectedChapter < currentBookMeta.chaptersCount) {
      setSelectedChapter(selectedChapter + 1);
    } else {
      const currentIdx = BIBLE_BOOKS.findIndex(b => b.id === currentBookMeta.id);
      if (currentIdx < BIBLE_BOOKS.length - 1) {
        setSelectedBook(BIBLE_BOOKS[currentIdx + 1].name);
        setSelectedChapter(1);
      }
    }
  };

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
    } else {
      const currentIdx = BIBLE_BOOKS.findIndex(b => b.id === currentBookMeta.id);
      if (currentIdx > 0) {
        const prevBook = BIBLE_BOOKS[currentIdx - 1];
        setSelectedBook(prevBook.name);
        setSelectedChapter(prevBook.chaptersCount);
      }
    }
  };

  const handleToggleHighlight = (verseNum: number) => {
    const existing = highlights.find(
      h => h.book === currentBookMeta.name && h.chapter === selectedChapter && h.verse === verseNum
    );

    if (existing) {
      bibleService.removeHighlight(currentBookMeta.name, selectedChapter, verseNum);
    } else {
      bibleService.saveHighlight({
        book: currentBookMeta.name,
        chapter: selectedChapter,
        verse: verseNum,
        color: activeHighlightColor
      });
    }
    setHighlights(bibleService.getHighlights());
  };

  const handleCopyVerse = (verseNum: number, text: string) => {
    navigator.clipboard.writeText(`"${text}" (${currentBookMeta.name} ${selectedChapter}:${verseNum} ${selectedTranslation})`);
    setCopiedVerse(verseNum);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const handleToggleChapterAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const allText = `${currentBookMeta.name} chapter ${selectedChapter}. ` +
        chapterData.verses.map(v => `Verse ${v.verse}. ${v.text}`).join(' ');
      const utterance = new SpeechSynthesisUtterance(allText);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const fontClass =
    fontSize === 'sm' ? 'text-xs sm:text-sm leading-relaxed' :
    fontSize === 'lg' ? 'text-base sm:text-lg leading-relaxed' :
    fontSize === 'xl' ? 'text-lg sm:text-xl leading-relaxed' : 'text-sm sm:text-base leading-relaxed';

  const getHighlightBg = (verseNum: number) => {
    const hl = highlights.find(
      h => h.book === currentBookMeta.name && h.chapter === selectedChapter && h.verse === verseNum
    );
    if (!hl) return '';
    switch (hl.color) {
      case 'amber':
        return 'bg-amber-100 dark:bg-amber-950/60 rounded-md px-1 border-l-2 border-amber-500';
      case 'emerald':
        return 'bg-emerald-100 dark:bg-emerald-950/60 rounded-md px-1 border-l-2 border-emerald-500';
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-950/60 rounded-md px-1 border-l-2 border-blue-500';
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-950/60 rounded-md px-1 border-l-2 border-purple-500';
      case 'rose':
        return 'bg-rose-100 dark:bg-rose-950/60 rounded-md px-1 border-l-2 border-rose-500';
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Control Bar: Book/Chapter Picker, Translation Selector, Search, Audio */}
      <div className="bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] p-4 sm:p-5 shadow-sm space-y-3">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Book & Chapter Quick Launcher */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsBookPickerOpen(!isBookPickerOpen)}
              className="px-4 py-2 bg-[#0e71eb] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>{currentBookMeta.name} {selectedChapter}</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Change Book</span>
            </button>

            {/* Translation Picker */}
            <select
              value={selectedTranslation}
              onChange={(e) => setSelectedTranslation(e.target.value)}
              className="px-3 py-2 bg-slate-100 dark:bg-[#1f2738] border border-slate-200 dark:border-[#2f3950] rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0e71eb]"
            >
              {BIBLE_TRANSLATIONS.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            {/* Audio Listen Chapter */}
            <button
              onClick={handleToggleChapterAudio}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                isPlayingAudio
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-[#1f2738] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#252f44]'
              }`}
              title="Listen to chapter audio"
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-500" />}
            </button>
          </div>

          {/* Quick Search & Font Customizer */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scripture..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#1a2130] border border-slate-200 dark:border-[#2a3449] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e71eb]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Font sizing */}
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

            {/* Serif button */}
            <button
              onClick={() => setIsSerif(!isSerif)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border ${
                isSerif ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0e71eb] border-blue-400/40' : 'bg-slate-100 dark:bg-[#1f2738] text-slate-600 dark:text-slate-400 border-transparent'
              }`}
            >
              Serif
            </button>
          </div>
        </div>

        {/* Highlighter Color Palette Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-[#262f43] text-xs text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-[11px]">
            <Highlighter className="w-3.5 h-3.5 text-amber-500" />
            <span>Highlight Color:</span>
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'amber', bg: 'bg-amber-400' },
              { id: 'emerald', bg: 'bg-emerald-400' },
              { id: 'blue', bg: 'bg-blue-400' },
              { id: 'purple', bg: 'bg-purple-400' },
              { id: 'rose', bg: 'bg-rose-400' }
            ].map(c => (
              <button
                key={c.id}
                onClick={() => setActiveHighlightColor(c.id as any)}
                className={`w-5 h-5 rounded-full ${c.bg} transition-transform ${
                  activeHighlightColor === c.id ? 'scale-125 ring-2 ring-slate-900 dark:ring-white' : 'opacity-70 hover:opacity-100'
                }`}
                title={`Select ${c.id} highlight`}
              />
            ))}
          </div>
          <span className="text-[10px] text-slate-400 ml-auto hidden sm:inline">
            Click any verse number to highlight or copy
          </span>
        </div>

      </div>

      {/* Book & Chapter Full Modal / Drawer */}
      {isBookPickerOpen && (
        <div className="bg-white dark:bg-[#161b26] rounded-3xl border border-blue-500/40 p-5 sm:p-7 shadow-2xl space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#262f43] pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#0e71eb]" />
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Select Book & Chapter
              </h3>
            </div>
            <button
              onClick={() => setIsBookPickerOpen(false)}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-[#1f2738] text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Testament & Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['ALL', 'OT', 'NT'].map(t => (
              <button
                key={t}
                onClick={() => setTestamentFilter(t as any)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  testamentFilter === t
                    ? 'bg-[#0e71eb] text-white'
                    : 'bg-slate-100 dark:bg-[#1f2738] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#252f44]'
                }`}
              >
                {t === 'ALL' ? 'All 66 Books' : t === 'OT' ? 'Old Testament (39)' : 'New Testament (27)'}
              </button>
            ))}
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-60 overflow-y-auto p-1">
            {filteredBooks.map(b => (
              <button
                key={b.id}
                onClick={() => {
                  setSelectedBook(b.name);
                  setSelectedChapter(1);
                }}
                className={`p-2 rounded-xl text-xs font-semibold text-center transition-all truncate ${
                  selectedBook === b.name
                    ? 'bg-[#0e71eb] text-white font-bold shadow-md'
                    : 'bg-slate-50 dark:bg-[#1a2130] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#232c3f]'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>

          {/* Chapter numbers for current book */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#262f43]">
            <div className="text-xs font-bold uppercase text-slate-400">
              Select Chapter in {currentBookMeta.name} ({currentBookMeta.chaptersCount} chapters):
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
              {Array.from({ length: currentBookMeta.chaptersCount }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => {
                    setSelectedChapter(num);
                    setIsBookPickerOpen(false);
                  }}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                    selectedChapter === num
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                      : 'bg-slate-100 dark:bg-[#1f2738] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#252f44]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search Results Dropdown if query active */}
      {searchQuery.trim().length >= 2 && (
        <div className="bg-white dark:bg-[#161b26] rounded-3xl border border-blue-500/40 p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-100 dark:border-[#262f43] pb-2">
            <span>Found {searchResults.length} verses matching "{searchQuery}"</span>
            <button onClick={() => setSearchQuery('')} className="text-[#0e71eb] font-semibold hover:underline">
              Clear Search
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {searchResults.map((res, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedBook(res.book);
                  setSelectedChapter(res.chapter);
                  setSearchQuery('');
                }}
                className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a2130] hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer border border-slate-100 dark:border-[#262f43] text-xs space-y-1 transition-colors"
              >
                <div className="font-bold text-[#0e71eb]">
                  {res.book} {res.chapter}:{res.verse}
                </div>
                <p className="text-slate-700 dark:text-slate-300 line-clamp-2">
                  {res.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bible Chapter Reader Canvas */}
      <div className={`bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] p-6 sm:p-9 shadow-sm space-y-6 ${isSerif ? 'font-serif' : 'font-sans'}`}>
        
        {/* Chapter Title & Navigation Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#262f43] pb-4">
          <button
            onClick={handlePrevChapter}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1f2738] hover:bg-slate-200 dark:hover:bg-[#252f44] text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous Chapter</span>
          </button>

          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {currentBookMeta.name} {selectedChapter}
            </h2>
            <span className="text-xs text-slate-400 font-semibold">
              {selectedTranslation} · {currentBookMeta.category}
            </span>
          </div>

          <button
            onClick={handleNextChapter}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1f2738] hover:bg-slate-200 dark:hover:bg-[#252f44] text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <span className="hidden sm:inline">Next Chapter</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Verses Flow */}
        <div className={`space-y-4 ${fontClass} text-slate-800 dark:text-slate-200`}>
          {chapterData.verses.map((v) => {
            const isHighlighted = highlights.some(
              h => h.book === currentBookMeta.name && h.chapter === selectedChapter && h.verse === v.verse
            );

            return (
              <div
                key={v.verse}
                className={`group flex items-start gap-2.5 p-2 rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-[#1a2130] ${getHighlightBg(v.verse)}`}
              >
                {/* Verse number pill */}
                <button
                  onClick={() => handleToggleHighlight(v.verse)}
                  className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md transition-colors shrink-0 select-none ${
                    isHighlighted
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-[#0e71eb] bg-blue-50 dark:bg-blue-950/60 group-hover:bg-blue-100'
                  }`}
                  title="Click to toggle highlight"
                >
                  {v.verse}
                </button>

                {/* Verse Text */}
                <p className="flex-1 leading-relaxed">
                  {v.text}
                </p>

                {/* Quick copy verse action on hover */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
                  <button
                    onClick={() => handleCopyVerse(v.verse, v.text)}
                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-[#252f44] text-slate-600 dark:text-slate-300 hover:text-white transition-colors"
                    title="Copy verse"
                  >
                    {copiedVerse === v.verse ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleToggleHighlight(v.verse)}
                    className="p-1.5 rounded-lg bg-slate-200 dark:bg-[#252f44] text-amber-500 hover:text-amber-400 transition-colors"
                    title="Highlight verse"
                  >
                    <Highlighter className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Chapter Stepper Bar */}
        <div className="pt-6 border-t border-slate-100 dark:border-[#262f43] flex items-center justify-between text-xs">
          <button
            onClick={handlePrevChapter}
            className="text-[#0e71eb] font-bold hover:underline flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Read {selectedChapter > 1 ? `${currentBookMeta.name} ${selectedChapter - 1}` : 'Previous Book'}</span>
          </button>

          <button
            onClick={handleNextChapter}
            className="text-[#0e71eb] font-bold hover:underline flex items-center gap-1"
          >
            <span>Read {selectedChapter < currentBookMeta.chaptersCount ? `${currentBookMeta.name} ${selectedChapter + 1}` : 'Next Book'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
