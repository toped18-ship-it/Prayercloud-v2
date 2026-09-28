import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  User as UserIcon,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  X,
  ExternalLink,
  Heart,
  BookOpen,
  Sparkles
} from 'lucide-react';
import {
  geminiService,
  ChatHistoryItem,
  GroundingSource
} from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  sources?: GroundingSource[];
  timestamp: string;
}

interface GeminiMissionsChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

export const GeminiMissionsChatModal: React.FC<GeminiMissionsChatModalProps> = ({
  isOpen,
  onClose,
  initialTopic
}) => {
  const { currentUser } = useAuth();
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const welcomeMessage: Message = {
    id: 'welcome-1',
    role: 'model',
    text: `Grace and peace to you in our Lord Jesus Christ! I am your **Prayer Companion**.\n\nWhether you need heartfelt prayer for your family, Scripture encouragement in a time of trial, or intercession strategies for unreached nations across the 10/40 window, I am here to stand in faith with you.\n\nHow can I pray with you or support you today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialTopic && isOpen) {
      setInputMessage(initialTopic);
    }
  }, [initialTopic, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build conversation history for multi-turn chat
      const history: ChatHistoryItem[] = messages
        .filter(m => m.id !== 'welcome-1')
        .map(m => ({ role: m.role, text: m.text }));

      // Use gentle pastoral intercessor persona and stable model with web grounding behind the scenes
      const response = await geminiService.sendMessage({
        history,
        message: text,
        model: 'gemini-3.5-flash',
        personaId: 'intercessor',
        groundingMode: 'googleSearch'
      });

      const companionMessage: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: response.text,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, companionMessage]);
    } catch (e: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `I am with you in spirit. We experienced a temporary connection delay: "${e?.message || 'Network timeout'}". Let us take a moment, check the connection, and pray together again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: `Conversation cleared. I am here as your **Prayer Companion**. What is on your heart today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  const suggestedPrayers = [
    '🙏 Pray for peace and comfort in difficult times',
    '🌍 Intercede for unreached nations & missionaries',
    '📖 Scripture promise for healing & strength',
    '🛡️ Protection & spiritual warfare prayer'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-[#0f1422] border border-[#232d42] rounded-3xl w-full max-w-2xl h-[88vh] max-h-[750px] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean Header - Spiritual & Warm (No Model/Settings Jargon) */}
        <div className="p-3.5 sm:p-4 border-b border-[#1f283c] bg-[#121828] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
              <Heart className="w-5 h-5 fill-white/20 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">Prayer Companion</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  Online
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                Scripture Guidance, Intercession & Spiritual Encouragement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleClearHistory}
              title="Clear Conversation"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-[#1d263b] rounded-xl transition-colors text-xs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-[#1d263b] rounded-xl transition-colors"
              title="Close Companion"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0e19]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 sm:gap-3 max-w-[90%] sm:max-w-[85%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-md'
                  }`}
                >
                  {isUser ? <UserIcon className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                <div className={`space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                    <span className="font-semibold">{isUser ? currentUser?.fullName || 'You' : 'Prayer Companion'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap break-words ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/10'
                        : 'bg-[#141b2a] text-slate-100 rounded-tl-none border border-[#222d42] shadow-sm'
                    }`}
                  >
                    {msg.text}

                    {/* Citations / Sources if referenced */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/60 space-y-1">
                        <div className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> Related Biblical & Mission References:
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.sources.map((src, idx) =>
                            src.url ? (
                              <a
                                key={idx}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0b1019] hover:bg-[#1a2335] text-slate-300 hover:text-white border border-[#29364d] rounded-md text-[10px] transition-colors"
                              >
                                <span>{src.title || 'Reference'}</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                              </a>
                            ) : (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0b1019] text-slate-400 border border-[#29364d] rounded-md text-[10px]"
                              >
                                {src.title}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {!isUser && (
                    <div className="flex items-center gap-2 pl-1">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 py-0.5 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Prayer</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-2.5 sm:gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#141b2a] border border-[#222d42] p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                <span>Interceding and reflecting on Scripture...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Intercessory Focus Prompts */}
        {messages.length <= 2 && (
          <div className="px-3.5 py-2 bg-[#0e1322] border-t border-[#1a2234] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-semibold text-slate-400 shrink-0 uppercase tracking-wider">Suggested:</span>
            {suggestedPrayers.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 bg-[#161c2d] hover:bg-[#202940] border border-[#232f46] text-slate-300 hover:text-white rounded-full text-[11px] whitespace-nowrap transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Clean Input Bar */}
        <div className="p-3 sm:p-4 bg-[#0c101d] border-t border-[#1e293b]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Share a prayer request, scripture question, or burden..."
              disabled={isLoading}
              className="flex-1 bg-[#131929] border border-[#232f46] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/80 transition-colors disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 shrink-0 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pray</span>
            </button>
          </form>
          <div className="mt-1.5 text-center text-[10px] text-slate-500">
            <span>Standing in faith with you • Grounded in the Holy Scriptures</span>
          </div>
        </div>
      </div>
    </div>
  );
};
