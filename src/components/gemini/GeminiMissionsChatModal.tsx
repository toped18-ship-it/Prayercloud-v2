import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  Search,
  MapPin,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  Globe2,
  ChevronDown,
  Shield,
  BookOpen,
  Compass,
  AlertTriangle,
  X,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import {
  geminiService,
  GeminiModelType,
  GroundingMode,
  GEMINI_PERSONAS,
  ChatHistoryItem,
  GroundingSource
} from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  modelUsed?: string;
  groundingMode?: GroundingMode;
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
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('missiologist');
  const [selectedModel, setSelectedModel] = useState<GeminiModelType>('gemini-3.5-flash');
  const [groundingMode, setGroundingMode] = useState<GroundingMode>('none');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activePersona = GEMINI_PERSONAS.find(p => p.id === selectedPersonaId) || GEMINI_PERSONAS[0];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: `Grace and peace in Jesus Christ! I am the **${activePersona.name}** at PrayerCloud.\n\nI can provide frontier missiological strategies, Scripture-saturated intercession points, real-time unreached people group research, and emergency security guidance.\n\nHow can we partner with you for the Great Commission today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: selectedModel,
      groundingMode: 'none'
    }
  ]);

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

      const response = await geminiService.sendMessage({
        history,
        message: text,
        model: selectedModel,
        personaId: selectedPersonaId,
        groundingMode: groundingMode
      });

      const aiMessage: Message = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: response.text,
        modelUsed: response.modelUsed,
        groundingMode: response.groundingMode,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (e: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `We encountered an issue processing your request: "${e?.message || 'Server timeout'}". Please verify your network connection and try again.`,
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
        text: `Conversation cleared. I am ready to assist as your **${activePersona.name}**. What would you like to explore?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
        groundingMode: 'none'
      }
    ]);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0e131f] border border-[#1e293b] rounded-2xl w-full max-w-4xl h-[90vh] max-h-[850px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#1e293b] bg-[#0b0f19] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-white tracking-wide">Gemini Missions Intelligence</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  {selectedModel}
                </span>
                {groundingMode === 'googleSearch' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
                    <Search className="w-2.5 h-2.5" /> Search Grounded
                  </span>
                )}
                {groundingMode === 'googleMaps' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" /> Maps Grounded
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate">{activePersona.roleTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleClearHistory}
              title="Clear Conversation"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-[#1e293b] rounded-xl transition-colors text-xs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-[#1e293b] rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Controls (Personas, Models & Grounding) */}
        <div className="p-2.5 sm:p-3 bg-[#0a0d15] border-b border-[#1a2234] flex items-center justify-between flex-wrap gap-2 text-xs">
          {/* Persona selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-medium text-slate-400 shrink-0">Role:</span>
            {GEMINI_PERSONAS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPersonaId(p.id)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedPersonaId === p.id
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                    : 'bg-[#151c2c] text-slate-400 hover:text-slate-200 hover:bg-[#1a2337]'
                }`}
              >
                {p.id === 'missiologist' && <Compass className="w-3 h-3" />}
                {p.id === 'intercessor' && <BookOpen className="w-3 h-3" />}
                {p.id === 'upg_analyst' && <Globe2 className="w-3 h-3" />}
                {p.id === 'persecution_responder' && <Shield className="w-3 h-3" />}
                {p.name}
              </button>
            ))}
          </div>

          {/* Model & Grounding tools */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Model switch */}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as GeminiModelType)}
              className="bg-[#151c2c] border border-[#222d42] rounded-lg px-2 py-1 text-xs text-slate-300 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="gemini-3.5-flash">gemini-3.5-flash (General)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast)</option>
            </select>

            {/* Grounding toggle */}
            <div className="flex items-center bg-[#151c2c] border border-[#222d42] rounded-lg p-0.5">
              <button
                onClick={() => setGroundingMode('none')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  groundingMode === 'none' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setGroundingMode('googleSearch')}
                title="Google Search Grounding"
                className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                  groundingMode === 'googleSearch' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-emerald-300'
                }`}
              >
                <Search className="w-3 h-3" /> Search
              </button>
              <button
                onClick={() => setGroundingMode('googleMaps')}
                title="Google Maps Grounding"
                className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 transition-colors ${
                  groundingMode === 'googleMaps' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                <MapPin className="w-3 h-3" /> Maps
              </button>
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#090c14]/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-md'
                  }`}
                >
                  {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                    <span className="font-semibold">{isUser ? currentUser?.fullName || 'You' : activePersona.name}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {!isUser && msg.modelUsed && (
                      <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20">
                        {msg.modelUsed}
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap break-words ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/10'
                        : 'bg-[#141b2a] text-slate-100 rounded-tl-none border border-[#222d42] shadow-sm'
                    }`}
                  >
                    {msg.text}

                    {/* Sources section if Search or Maps Grounding was used */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/60 space-y-1">
                        <div className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                          <Globe2 className="w-3 h-3" /> Grounded Citations & Sources:
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.sources.map((src, idx) => (
                            src.url ? (
                              <a
                                key={idx}
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0b1019] hover:bg-[#1a2335] text-slate-300 hover:text-white border border-[#29364d] rounded-md text-[10px] transition-colors"
                              >
                                <span>{src.title || 'Source'}</span>
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
                          ))}
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
                            <span>Copy</span>
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
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-[#141b2a] border border-[#222d42] p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-slate-400">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span>
                  {groundingMode === 'googleSearch'
                    ? 'Searching Google & generating missiological response...'
                    : groundingMode === 'googleMaps'
                    ? 'Consulting Google Maps & generating geographical briefing...'
                    : `${activePersona.name} is formulating response with ${selectedModel}...`}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pill Carousel */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-[#0b0f19] border-t border-[#1a2234] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-semibold text-slate-400 shrink-0 uppercase tracking-wider">Suggested:</span>
            {activePersona.suggestedPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 bg-[#151c2c] hover:bg-[#1f293d] border border-[#232f46] text-slate-300 hover:text-white rounded-full text-[11px] whitespace-nowrap transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-[#0a0d15] border-t border-[#1e293b]">
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
              placeholder={`Ask ${activePersona.name} (e.g. strategy for unreached tribes, prayer guides, persecution alerts)...`}
              disabled={isLoading}
              className="flex-1 bg-[#121826] border border-[#222d42] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 px-1">
            <span>Powered by Gemini 3.5 & 3.1 Pro with real-time Google Search and Maps Grounding.</span>
            <span>Shift + Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
};
