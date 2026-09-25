import React, { useState } from 'react';
import {
  PenTool,
  Plus,
  Trash2,
  Calendar,
  BookOpen,
  Sparkles,
  Save,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { DevotionalJournalEntry, SUDailyDevotional } from '../../types';
import { bibleService } from '../../services/bibleService';

interface DevotionalJournalProps {
  initialDevotional?: SUDailyDevotional;
  onOpenPassage?: (book: string, chapter: number) => void;
}

export const DevotionalJournal: React.FC<DevotionalJournalProps> = ({
  initialDevotional,
  onOpenPassage
}) => {
  const [entries, setEntries] = useState<DevotionalJournalEntry[]>(() => bibleService.getJournalEntries());
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState(initialDevotional ? `Rhema Insight: ${initialDevotional.title}` : '');
  const [scriptureRef, setScriptureRef] = useState(
    initialDevotional ? `${initialDevotional.biblePassage.book} ${initialDevotional.biblePassage.chapter}:${initialDevotional.biblePassage.verses}` : ''
  );
  const [notes, setNotes] = useState('');
  const [actionPoint, setActionPoint] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !notes.trim()) return;

    const newEntry = bibleService.saveJournalEntry({
      devotionalId: initialDevotional?.id,
      date: new Date().toISOString().split('T')[0],
      title,
      scriptureReference: scriptureRef,
      notes,
      actionPoint
    });

    setEntries([newEntry, ...entries.filter(en => en.id !== newEntry.id)]);
    setTitle('');
    setNotes('');
    setActionPoint('');
    setScriptureRef('');
    setIsCreating(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDelete = (id: string) => {
    bibleService.deleteJournalEntry(id);
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Journal Header */}
      <div className="bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#0e71eb] text-xs font-bold mb-2">
            <PenTool className="w-3.5 h-3.5" />
            <span>Personal Rhema Journal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Devotional Reflections & Action Directives
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Capture what the Holy Spirit is speaking through Scripture Union devotionals and Bible readings.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2.5 bg-[#0e71eb] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Entry</span>
        </button>
      </div>

      {/* Success notification */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>Your reflection has been recorded into your spiritual journal.</span>
        </div>
      )}

      {/* Entry Creation Form */}
      {isCreating && (
        <form onSubmit={handleSave} className="bg-white dark:bg-[#161b26] rounded-3xl border border-blue-500/40 p-6 sm:p-8 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#262f43] pb-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Record Holy Spirit Insight</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Entry Title / Topic
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Walking in Obedience, Prayer for Pashtun..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a2130] border border-slate-200 dark:border-[#2a3449] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0e71eb]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Scripture Reference Anchor
              </label>
              <input
                type="text"
                value={scriptureRef}
                onChange={(e) => setScriptureRef(e.target.value)}
                placeholder="e.g. Acts 4:29-31, Romans 12:1-2"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a2130] border border-slate-200 dark:border-[#2a3449] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0e71eb]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Spiritual Reflections & Rhema Word
            </label>
            <textarea
              required
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What is God revealing to you today? What promises are you standing on?"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a2130] border border-slate-200 dark:border-[#2a3449] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0e71eb]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
              Practical Action Step / Mission Target
            </label>
            <input
              type="text"
              value={actionPoint}
              onChange={(e) => setActionPoint(e.target.value)}
              placeholder="What will you do in response to today's word?"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1a2130] border border-slate-200 dark:border-[#2a3449] text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0e71eb] hover:bg-blue-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Journal Entry</span>
            </button>
          </div>
        </form>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] space-y-3">
            <FileText className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="font-bold text-base text-slate-800 dark:text-slate-200">
              No Journal Entries Recorded Yet
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Record insights, answered prayers, and action directives as you read through Scripture Union devotionals.
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-[#0e71eb] text-white text-xs font-bold rounded-xl shadow"
            >
              Start First Entry
            </button>
          </div>
        ) : (
          entries.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {item.scriptureReference && (
                      <>
                        <span>·</span>
                        <span className="font-bold text-[#0e71eb]">{item.scriptureReference}</span>
                      </>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {item.title}
                  </h4>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {item.notes}
              </p>

              {item.actionPoint && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Action Directive:</span> {item.actionPoint}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
