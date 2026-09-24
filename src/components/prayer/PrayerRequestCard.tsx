import React, { useState } from 'react';
import { HeartHandshake, MessageCircle, Clock, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, Send, Share2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { PrayerRequest } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storageService';

interface PrayerRequestCardProps {
  request: PrayerRequest;
  onUpdate?: () => void;
}

export const PrayerRequestCard: React.FC<PrayerRequestCardProps> = ({ request, onUpdate }) => {
  const { currentUser } = useAuth();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [hasPrayed, setHasPrayed] = useState(
    currentUser ? request.prayingUserIds.includes(currentUser.id) : false
  );
  const [localPrayedCount, setLocalPrayedCount] = useState(request.prayedCount);

  const handlePrayClick = () => {
    if (!currentUser) return;
    if (!hasPrayed) {
      storage.recordPrayerOffered(request.id, currentUser.id);
      setHasPrayed(true);
      setLocalPrayedCount(prev => prev + 1);

      // Light confetti celebration of spiritual agreement
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#0ea5e9', '#60a5fa', '#93c5fd']
      });

      if (onUpdate) onUpdate();
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    storage.addPrayerComment(request.id, {
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorRole: currentUser.role,
      text: commentText.trim()
    });

    setCommentText('');
    if (onUpdate) onUpdate();
  };

  const urgencyBg =
    request.urgency === 'Urgent'
      ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/40'
      : request.urgency === 'High'
      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40'
      : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Header Metadata */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${urgencyBg}`}>
              {request.urgency}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {request.category}
            </span>
            {request.targetCountry && (
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                · {request.targetCountry}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <Clock className="w-3 h-3" />
            <span>{new Date(request.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Title & Body */}
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 leading-snug">
          {request.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 whitespace-pre-line">
          {request.description}
        </p>

        {/* Answered praise report banner if any */}
        {request.isAnswered && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Praise Report — Prayer Answered!</span>
            </div>
            <p className="text-xs text-emerald-800 dark:text-emerald-300">
              {request.praiseReport}
            </p>
          </div>
        )}

        {/* Author information */}
        <div className="text-xs text-slate-500 mb-4 flex items-center gap-2">
          <span>Posted by:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {request.isAnonymous ? 'Anonymous Intercessor' : request.authorName}
          </span>
          {!request.isAnonymous && (
            <span className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded">
              {request.authorRole}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        
        {/* I Prayed Button */}
        <button
          onClick={handlePrayClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            hasPrayed
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-900'
          }`}
        >
          <HeartHandshake className={`w-4 h-4 ${hasPrayed ? 'animate-bounce' : ''}`} />
          <span>{hasPrayed ? 'Prayed in Agreement' : 'I Prayed'}</span>
          <span className="ml-1 px-1.5 py-0.2 text-[11px] font-mono bg-white/20 rounded">
            {localPrayedCount}
          </span>
        </button>

        {/* Comments Toggle */}
        <button
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <MessageCircle className="w-4 h-4 text-slate-400" />
          <span>{request.comments?.length || 0} Encouragements</span>
          {isCommentsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Comments Thread Accordion */}
      {isCommentsOpen && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-fadeIn">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {request.comments?.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-1">
                No prayers written yet. Be the first to leave a word of encouragement!
              </p>
            ) : (
              request.comments?.map((c, idx) => (
                <div key={`${c.id || 'comment'}-${idx}`} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 text-xs">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {c.authorName} <span className="text-slate-400 font-normal">({c.authorRole})</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{c.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Add comment form */}
          {currentUser && (
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write scripture or prayer encouragement..."
                className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
