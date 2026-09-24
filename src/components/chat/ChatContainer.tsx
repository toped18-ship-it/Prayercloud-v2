import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  Smile,
  Paperclip,
  Pin,
  Heart,
  Volume2,
  CheckCheck,
  Search,
  Users,
  Plus,
  Lock,
  Globe,
  Radio,
  Sparkles,
  Play,
  Pause,
  Video,
  Shield,
  Copy,
  Check,
  X,
  Phone,
  Settings
} from 'lucide-react';
import { ChatRoom, ChatMessage, User } from '../../types';
import { storage } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { VoiceNoteRecorder } from './VoiceNoteRecorder';
import { VideoConferenceRoom } from '../calls/VideoConferenceRoom';
import { CallSettingsModal } from '../calls/CallSettingsModal';

interface ChatContainerProps {
  initialRoomId?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({ initialRoomId }) => {
  const { currentUser } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string>(initialRoomId || 'room-global-strategy');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [roomFilter, setRoomFilter] = useState<'all' | 'strategy' | 'country' | 'direct'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newRoomModalOpen, setNewRoomModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Calling State inside Chatroom
  const [activeCallRoom, setActiveCallRoom] = useState<{
    roomTitle: string;
    countryFocus: string;
    initialCallType?: 'video' | 'audio';
    meetingId?: string;
    passcode?: string;
  } | null>(null);

  // Personal Watch Room ID (PMI)
  const pmiNumber = '849 2049 1192';
  const pmiPasscode = '104088';
  const [copiedPmi, setCopiedPmi] = useState(false);
  const [mobileChannelListOpen, setMobileChannelListOpen] = useState(false);
  const [showCallSettings, setShowCallSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const audioElementsRef = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    loadRooms();
    const handleStorage = () => {
      loadRooms();
      if (activeRoomId) {
        setMessages(storage.getMessages(activeRoomId));
      }
    };
    window.addEventListener('prayercloud_storage_update', handleStorage);
    return () => window.removeEventListener('prayercloud_storage_update', handleStorage);
  }, [activeRoomId]);

  useEffect(() => {
    if (activeRoomId) {
      setMessages(storage.getMessages(activeRoomId));
      scrollToBottom();
    }
  }, [activeRoomId]);

  const loadRooms = () => {
    const list = storage.getChatRooms();
    setRooms(list);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 120);
  };

  const copyPmiLink = () => {
    const link = `https://prayercloud.app/j/${pmiNumber.replace(/\s+/g, '')}\nMeeting ID: ${pmiNumber}\nPasscode: ${pmiPasscode}`;
    navigator.clipboard.writeText(link);
    setCopiedPmi(true);
    setTimeout(() => setCopiedPmi(false), 2500);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !currentUser || !activeRoomId) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      roomId: activeRoomId,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      senderCountry: currentUser.country,
      content: inputText.trim(),
      type: 'text',
      createdAt: new Date().toISOString(),
      reactions: []
    };

    storage.sendMessage(newMsg);
    setMessages(storage.getMessages(activeRoomId));
    setInputText('');
    scrollToBottom();
  };

  const handleSendVoiceNote = (audioUrl: string, durationSeconds: number) => {
    if (!currentUser || !activeRoomId) return;

    const voiceMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      roomId: activeRoomId,
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      senderRole: currentUser.role,
      senderCountry: currentUser.country,
      content: '🎤 Field Voice Transmission',
      type: 'voice_note',
      voiceNoteUrl: audioUrl,
      voiceDurationSeconds: durationSeconds,
      createdAt: new Date().toISOString(),
      reactions: []
    };

    storage.sendMessage(voiceMsg);
    setMessages(storage.getMessages(activeRoomId));
    setIsRecordingVoice(false);
    scrollToBottom();
  };

  const handleToggleAudioPlay = (msgId: string, url: string) => {
    if (playingAudioId === msgId) {
      audioElementsRef.current[msgId]?.pause();
      setPlayingAudioId(null);
    } else {
      if (playingAudioId && audioElementsRef.current[playingAudioId]) {
        audioElementsRef.current[playingAudioId].pause();
      }
      if (!audioElementsRef.current[msgId]) {
        audioElementsRef.current[msgId] = new Audio(url);
        audioElementsRef.current[msgId].onended = () => setPlayingAudioId(null);
      }
      audioElementsRef.current[msgId].play().catch(() => setPlayingAudioId(null));
      setPlayingAudioId(msgId);
    }
  };

  const handleAddReaction = (msgId: string, emoji: string) => {
    if (!currentUser) return;
    storage.addReactionToMessage(activeRoomId, msgId, emoji, currentUser.id);
    setMessages(storage.getMessages(activeRoomId));
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !currentUser) return;

    const newRoom: ChatRoom = {
      id: `room-${Date.now()}`,
      name: newRoomName.trim(),
      description: newRoomDesc.trim() || 'Strategy and prayer collaboration channel',
      type: 'strategy',
      isPrivate: false,
      memberIds: [currentUser.id],
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      lastMessage: 'Room created',
      lastMessageTime: 'Just now'
    };

    storage.createChatRoom(newRoom);
    loadRooms();
    setActiveRoomId(newRoom.id);
    setNewRoomName('');
    setNewRoomDesc('');
    setNewRoomModalOpen(false);
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId);

  const filteredRooms = rooms.filter(r => {
    if (roomFilter === 'strategy' && r.type !== 'strategy' && r.type !== 'global') return false;
    if (roomFilter === 'country' && r.type !== 'country') return false;
    if (roomFilter === 'direct' && r.type !== 'direct') return false;
    if (searchQuery) {
      return r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="h-[calc(100vh-135px)] sm:h-[calc(100vh-150px)] min-h-[500px] max-h-[920px] max-w-7xl mx-auto bg-white dark:bg-[#161b26] rounded-3xl border border-slate-200 dark:border-[#262f43] shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
      
      {/* Active Video & Voice Calling Overlay */}
      {activeCallRoom && (
        <VideoConferenceRoom
          roomTitle={activeCallRoom.roomTitle}
          countryFocus={activeCallRoom.countryFocus}
          initialCallType={activeCallRoom.initialCallType || 'video'}
          meetingId={activeCallRoom.meetingId}
          passcode={activeCallRoom.passcode}
          onLeaveRoom={() => setActiveCallRoom(null)}
        />
      )}

      {/* Sidebar: Channel & Room List (Responsive on Mobile) */}
      <div
        className={`${
          mobileChannelListOpen ? 'flex' : 'hidden'
        } md:flex w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-[#262f43] flex-col bg-slate-50/90 dark:bg-[#121622] shrink-0 absolute md:static inset-0 z-20 md:z-auto`}
      >
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-[#262f43] flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-500 animate-pulse" />
              <span>Missionary Channels</span>
            </h2>
            <p className="text-xs text-slate-500">Real-time frontier collaboration</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setNewRoomModalOpen(true)}
              className="p-1.5 bg-[#0e71eb] hover:bg-blue-600 text-white rounded-xl shadow transition-colors"
              title="Create New Strategy Room"
            >
              <Plus className="w-4 h-4" />
            </button>
            {mobileChannelListOpen && (
              <button
                onClick={() => setMobileChannelListOpen(false)}
                className="md:hidden p-1.5 bg-slate-200 dark:bg-[#1f2738] text-slate-700 dark:text-slate-300 rounded-xl"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-200 dark:border-[#262f43]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search channels..."
              className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#1a2130] border border-slate-200 dark:border-[#2a3449] rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-0.5">
            {(['all', 'strategy', 'country', 'direct'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setRoomFilter(filter)}
                className={`px-2 py-1 text-[11px] font-semibold rounded-lg capitalize transition-colors whitespace-nowrap ${
                  roomFilter === filter
                    ? 'bg-[#0e71eb] text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#1a2130]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Room List */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-2 space-y-1">
          {filteredRooms.map((room) => {
            const isActive = room.id === activeRoomId;
            return (
              <button
                key={room.id}
                onClick={() => {
                  setActiveRoomId(room.id);
                  setMobileChannelListOpen(false);
                }}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-start gap-3 ${
                  isActive
                    ? 'bg-[#0e71eb] text-white shadow-md shadow-blue-500/20'
                    : 'hover:bg-slate-100 dark:hover:bg-[#1a2130] text-slate-700 dark:text-slate-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-[#232d42] text-slate-600 dark:text-slate-300'
                }`}>
                  {room.type === 'country' ? '🌍' : room.type === 'strategy' ? '🎯' : '🌐'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs truncate">{room.name}</span>
                    <span className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      {room.lastMessageTime || ''}
                    </span>
                  </div>
                  <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {room.lastMessage || room.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* PMI Bottom Card inside Chat Sidebar */}
        <div className="p-3 m-2 bg-white dark:bg-[#161b26] rounded-2xl border border-slate-200 dark:border-[#262f43] text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-200">
              <Shield className="w-3.5 h-3.5 text-[#0e71eb]" />
              <span>Personal Room (PMI)</span>
            </span>
            <button onClick={copyPmiLink} className="text-[#0e71eb] hover:underline font-bold">
              {copiedPmi ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="font-mono text-slate-800 dark:text-slate-200 font-bold text-xs bg-slate-100 dark:bg-[#1a2130] p-1.5 rounded text-center">
            {pmiNumber}
          </div>
          <button
            type="button"
            onClick={() => setShowCallSettings(true)}
            className="w-full mt-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1a2130] hover:bg-slate-200 dark:hover:bg-[#242e44] text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-[#2a3449]"
            title="Configure Camera, Microphone and Call Preferences"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Call & Device Settings</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#161b26] overflow-hidden">
        
        {/* Active Room Top Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-200 dark:border-[#262f43] flex items-center justify-between gap-2 sm:gap-3 bg-white/50 dark:bg-[#121622]/60 backdrop-blur-sm shrink-0">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile Channel Switcher Button */}
            <button
              onClick={() => setMobileChannelListOpen(true)}
              className="md:hidden p-2 bg-slate-100 dark:bg-[#1f2738] hover:bg-slate-200 dark:hover:bg-[#2a3449] text-slate-700 dark:text-slate-200 rounded-xl shrink-0 transition-colors"
              title="Switch Channels"
            >
              <Radio className="w-4 h-4 text-blue-500" />
            </button>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 flex items-center justify-center text-emerald-600 font-bold shrink-0">
              {activeRoom?.type === 'country' ? '🌍' : '🔥'}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                {activeRoom?.name || 'Channel'}
              </h3>
              <p className="text-[11px] text-slate-500 truncate hidden xs:block sm:block">
                {activeRoom?.description || 'Active missionary coordination'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Video Call Icon */}
            <button
              onClick={() => setActiveCallRoom({
                roomTitle: `${activeRoom?.name || 'Channel'} Video Call`,
                countryFocus: activeRoom?.name || 'Global Unreached',
                initialCallType: 'video'
              })}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Start HD Video Call (Front & Back Camera)"
            >
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline">Video Call</span>
            </button>

            {/* Quick Voice Call Icon */}
            <button
              onClick={() => setActiveCallRoom({
                roomTitle: `${activeRoom?.name || 'Channel'} Voice Call`,
                countryFocus: activeRoom?.name || 'Global Unreached',
                initialCallType: 'audio'
              })}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Start Encrypted Voice Call"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Voice Call</span>
            </button>

            {/* Call & Device Settings Button */}
            <button
              type="button"
              onClick={() => setShowCallSettings(true)}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-[#1f2738] hover:bg-slate-200 dark:hover:bg-[#2a3449] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#2f3950] text-xs font-bold transition-all flex items-center gap-1.5"
              title="Call & Device Settings (Camera, Microphone & Quality)"
            >
              <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="hidden md:inline">Device Settings</span>
            </button>
          </div>
        </div>

        {/* Messages Scroll View */}
        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-6 space-y-4 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 text-[#0e71eb]" />
              <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">No transmissions yet in this channel</div>
              <p className="text-xs max-w-sm">Be the first to post a prayer point, voice note, or start a live video watch.</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMine = msg.senderId === currentUser?.id;

              return (
                <div
                  key={`${msg.id || 'msg'}-${index}`}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} group animate-fadeIn`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="font-semibold text-[11px] text-slate-700 dark:text-slate-300">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] text-[#0e71eb] font-medium">
                      ({msg.senderRole})
                    </span>
                    {msg.senderCountry && (
                      <span className="text-[10px] text-slate-400">· {msg.senderCountry}</span>
                    )}
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`max-w-xl p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isMine
                        ? 'bg-[#0e71eb] text-white rounded-tr-sm shadow-sm'
                        : 'bg-slate-100 dark:bg-[#1f2738] text-slate-900 dark:text-slate-100 rounded-tl-sm border border-slate-200/60 dark:border-[#2f3950]'
                    }`}
                  >
                    {msg.isPinned && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-amber-300 mb-1.5 pb-1 border-b border-white/20">
                        <Pin className="w-3 h-3 fill-amber-300" />
                        <span>Pinned Priority Transmission</span>
                      </div>
                    )}

                    {/* Text Message */}
                    {msg.type === 'text' && <p>{msg.content}</p>}

                    {/* Voice Note */}
                    {msg.type === 'voice_note' && msg.voiceNoteUrl && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleAudioPlay(msg.id, msg.voiceNoteUrl!)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform ${
                            isMine ? 'bg-white text-[#0e71eb]' : 'bg-[#0e71eb] text-white'
                          }`}
                        >
                          {playingAudioId === msg.id ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>
                        <div>
                          <div className="font-semibold text-xs flex items-center gap-1">
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Voice Transmission</span>
                          </div>
                          <span className="text-[10px] opacity-80">
                            {msg.voiceDurationSeconds ? `${msg.voiceDurationSeconds}s` : 'Audio note'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reaction Toolbar */}
                  <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {['🙏', '🔥', '🛡️', '❤️'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleAddReaction(msg.id, emoji)}
                        className="px-1.5 py-0.5 rounded-lg text-xs bg-slate-100 dark:bg-[#1f2738] hover:scale-125 transition-transform"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar & Action Controls */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-[#262f43] bg-white dark:bg-[#121622] space-y-3">
          {isRecordingVoice ? (
            <VoiceNoteRecorder
              onSendVoiceNote={handleSendVoiceNote}
              onCancel={() => setIsRecordingVoice(false)}
            />
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRecordingVoice(true)}
                className="p-2.5 text-slate-500 hover:text-[#0e71eb] hover:bg-blue-50 dark:hover:bg-[#1f2738] rounded-xl transition-colors shrink-0"
                title="Record Voice Transmission"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message #${activeRoom?.name || 'channel'}...`}
                className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-[#1f2738] border border-transparent focus:border-[#0e71eb] rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0e71eb]"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-[#0e71eb] hover:bg-blue-600 disabled:opacity-40 text-white rounded-xl shadow transition-colors shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* CREATE NEW ROOM MODAL */}
      {newRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#161b26] rounded-3xl border border-[#262f43] shadow-2xl p-6 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-[#262f43] pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0e71eb]" />
                <span>Create Channel</span>
              </h3>
              <button onClick={() => setNewRoomModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Channel Name</label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g. somalia-intercession-shield"
                  className="w-full px-3.5 py-2.5 bg-[#1f2738] border border-[#2f3950] rounded-xl text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  placeholder="Focus of this prayer and strategy channel..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-[#1f2738] border border-[#2f3950] rounded-xl text-white resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNewRoomModalOpen(false)}
                  className="flex-1 py-2.5 bg-[#232a3b] hover:bg-[#2f3950] text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0e71eb] hover:bg-blue-600 text-white font-bold rounded-xl shadow"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CALL & DEVICE SETTINGS MODAL */}
      <CallSettingsModal
        isOpen={showCallSettings}
        onClose={() => setShowCallSettings(false)}
      />

    </div>
  );
};
