import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Phone,
  RotateCcw,
  Volume2,
  VolumeX,
  Lock,
  MessageSquare,
  Users,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Send,
  X,
  Sparkles,
  MonitorUp,
  Radio,
  User,
  Heart,
  Smile,
  Hand
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface WhatsAppCallRoomProps {
  roomTitle?: string;
  countryFocus?: string;
  initialCallType?: 'video' | 'audio';
  meetingId?: string;
  passcode?: string;
  onLeaveRoom: () => void;
}

export const WhatsAppCallRoom: React.FC<WhatsAppCallRoomProps> = ({
  roomTitle = 'Missionary Strategic Watch',
  countryFocus = '10/40 Window Frontier',
  initialCallType = 'video',
  onLeaveRoom
}) => {
  const { currentUser } = useAuth();

  // Call Mode: Video Call or Audio Call
  const [callType, setCallType] = useState<'video' | 'audio'>(initialCallType);
  
  // Audio & Video Media States
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(initialCallType === 'video');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [cameraSwitching, setCameraSwitching] = useState(false);
  const [hasCameraError, setHasCameraError] = useState(false);

  // Call Status & Timers
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected'>('connected');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<'remote' | 'local'>('remote');

  // Side Drawers
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [showParticipantsDrawer, setShowParticipantsDrawer] = useState(false);
  const [isPiPExpanded, setIsPiPExpanded] = useState(false);

  // In-call quick messages
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: string; text: string; time: string }[]>([
    { id: '1', sender: 'Deborah Grace', text: 'Amen! Standing in 24/7 prayer agreement.', time: 'Just now' },
    { id: '2', sender: 'Field Operative', text: 'Logistics corridor opened safely. Praise God!', time: '1m ago' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Floating Reactions
  const [reactions, setReactions] = useState<{ id: number; emoji: string; x: number }[]>([]);

  // DOM and Stream Refs
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const pipVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Participants Simulation for Group / Peer Watch
  const participants = [
    { id: 'remote-1', name: roomTitle || 'Deborah Grace Alabi', role: 'Field Director', location: countryFocus, isSpeaking: true, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
    { id: currentUser?.id || 'me', name: currentUser?.fullName || 'You', role: 'Intercessor', location: 'Command Hub', isSpeaking: !isMuted, avatar: currentUser?.avatarUrl || '' }
  ];

  // Timer Lifecycle
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Media Stream (Camera & Mic)
  useEffect(() => {
    initMediaStream(facingMode, isVideoOn);
    return () => {
      stopMediaTracks();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Format Duration seconds into MM:SS or HH:MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      const remainingMins = mins % 60;
      return `${hrs.toString().padStart(2, '0')}:${remainingMins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Start / Switch Media Stream with exact facingMode (front or back camera)
  const initMediaStream = async (mode: 'user' | 'environment', enableVideo: boolean) => {
    try {
      stopMediaTracks();
      setCameraSwitching(true);
      setHasCameraError(false);

      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: enableVideo
          ? {
              facingMode: { ideal: mode },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      // Attach to video elements
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(() => {});
      }
      if (pipVideoRef.current) {
        pipVideoRef.current.srcObject = stream;
        pipVideoRef.current.play().catch(() => {});
      }

      // Audio visualizer setup
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;
          source.connect(analyser);
          analyserRef.current = analyser;

          const updateVolume = () => {
            if (analyserRef.current) {
              const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
              analyserRef.current.getByteFrequencyData(dataArray);
              const avg = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
              setAudioLevel(avg);
            }
            if (localStreamRef.current?.active) {
              requestAnimationFrame(updateVolume);
            }
          };
          updateVolume();
        }
      } catch (e) {
        // audio analyzer fallback
      }

      setCameraSwitching(false);
    } catch (err: any) {
      console.warn('WhatsApp calling media device note:', err);
      setCameraSwitching(false);
      setHasCameraError(true);
    }
  };

  const stopMediaTracks = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
  };

  // Flip Camera Front <-> Back
  const handleFlipCamera = async () => {
    const nextFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextFacingMode);
    await initMediaStream(nextFacingMode, isVideoOn);
  };

  // Toggle Mute Audio
  const handleToggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(t => {
        t.enabled = isMuted; // Toggle state
      });
    }
    setIsMuted(!isMuted);
  };

  // Toggle Video On/Off
  const handleToggleVideo = async () => {
    const nextVideoState = !isVideoOn;
    setIsVideoOn(nextVideoState);
    if (nextVideoState) {
      await initMediaStream(facingMode, true);
    } else {
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach(t => t.stop());
      }
    }
  };

  // Switch between Video Call and Voice/Audio Call
  const handleSwitchCallType = async () => {
    if (callType === 'video') {
      setCallType('audio');
      setIsVideoOn(false);
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach(t => t.stop());
      }
    } else {
      setCallType('video');
      setIsVideoOn(true);
      await initMediaStream(facingMode, true);
    }
  };

  // Screen Sharing
  const handleToggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          initMediaStream(facingMode, isVideoOn);
        };
      } catch (e) {
        console.warn('Screen share dismissed', e);
      }
    } else {
      setIsScreenSharing(false);
      initMediaStream(facingMode, isVideoOn);
    }
  };

  // Trigger floating reaction
  const sendReaction = (emoji: string) => {
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji,
      x: 30 + Math.random() * 40
    };
    setReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2500);
  };

  // Send in-call chat message
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = {
      id: Date.now().toString(),
      sender: currentUser?.fullName || 'You',
      text: chatInput.trim(),
      time: 'Just now'
    };
    setChatMessages(prev => [...prev, msg]);
    setChatInput('');
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-[#0b141a] text-white select-none overflow-hidden font-sans ${isFullscreen ? 'p-0' : ''}`}>
      
      {/* Floating Animated Emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
        {reactions.map(r => (
          <div
            key={r.id}
            style={{ left: `${r.x}%` }}
            className="absolute bottom-28 text-3xl animate-floatUp pointer-events-none drop-shadow-lg"
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* TOP BAR: WhatsApp Call Header */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 sm:p-5 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between">
        
        {/* Left: Contact Info & Encryption Badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLeaveRoom}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition-all"
            title="Minimize / Leave"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight drop-shadow truncate max-w-[220px] sm:max-w-md">
                {roomTitle}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>End-to-end encrypted</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-emerald-400">{formatTime(callDuration)}</span>
              <span className="text-slate-400">· {countryFocus}</span>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Header Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Switch to Voice / Video Mode */}
          <button
            onClick={handleSwitchCallType}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold text-white flex items-center gap-1.5 transition-all active:scale-95 border border-white/15"
            title={callType === 'video' ? 'Switch to Audio Call' : 'Switch to Video Call'}
          >
            {callType === 'video' ? (
              <>
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Voice Call</span>
              </>
            ) : (
              <>
                <Video className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Video Call</span>
              </>
            )}
          </button>

          {/* In-Call Messages Toggle */}
          <button
            onClick={() => setShowChatDrawer(!showChatDrawer)}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all active:scale-95 relative ${
              showChatDrawer ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="In-call chat"
          >
            <MessageSquare className="w-4 h-4" />
            {chatMessages.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-black text-[9px] font-bold flex items-center justify-center">
                {chatMessages.length}
              </span>
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all active:scale-95 hidden sm:flex"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* MAIN CALL AREA */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#0b141a] via-[#111b21] to-[#0b141a]">
        
        {/* ===================== VIDEO CALL VIEW ===================== */}
        {callType === 'video' ? (
          <div className="w-full h-full relative flex items-center justify-center">
            
            {/* Primary Remote Video Feed */}
            <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
              <img
                src={participants[0].avatar}
                alt={participants[0].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

              {/* Remote Speaker Overlay Indicator */}
              <div className="absolute bottom-28 left-5 z-20 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold">{participants[0].name}</span>
                <span className="text-slate-400 text-[11px]">({participants[0].role})</span>
              </div>
            </div>

            {/* Self Camera Picture-in-Picture (PiP) Window */}
            <div
              className={`absolute z-30 transition-all duration-300 shadow-2xl overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-900 group ${
                isPiPExpanded
                  ? 'inset-4 sm:inset-10'
                  : 'bottom-28 right-4 sm:bottom-28 sm:right-6 w-32 sm:w-48 h-44 sm:h-64'
              }`}
            >
              {/* Local Live Camera Stream */}
              {isVideoOn ? (
                <>
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                  />
                  {cameraSwitching && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-xs text-white gap-2">
                      <RotateCcw className="w-5 h-5 text-emerald-400 animate-spin" />
                      <span>Switching camera...</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-[#1e2428] flex flex-col items-center justify-center text-slate-400 gap-2 p-2">
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-base">
                    {currentUser?.fullName?.[0] || 'Y'}
                  </div>
                  <span className="text-[11px] font-medium text-slate-300">Camera Off</span>
                </div>
              )}

              {/* Floating Quick Flip Camera Button inside PiP */}
              {isVideoOn && (
                <button
                  onClick={handleFlipCamera}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/70 hover:bg-emerald-600 text-white backdrop-blur-md shadow-lg transition-all active:scale-90"
                  title={`Flip Camera (Currently: ${facingMode === 'user' ? 'Front' : 'Back'})`}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-white" />
                </button>
              )}

              {/* PiP Caption */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] text-slate-200">
                <span className="font-semibold truncate">You ({facingMode === 'user' ? 'Front' : 'Back'})</span>
                {isMuted && <MicOff className="w-3 h-3 text-red-400" />}
              </div>
            </div>

          </div>
        ) : (
          
          /* ===================== WHATSAPP AUDIO CALL VIEW ===================== */
          <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center p-6 text-center space-y-7 animate-fadeIn">
            
            {/* WhatsApp Audio Wave Rings & Glowing Avatar */}
            <div className="relative flex items-center justify-center">
              {/* Outer Wave Rings */}
              <div className={`absolute w-56 h-56 rounded-full border border-emerald-500/20 animate-ping duration-1000 ${audioLevel > 15 ? 'opacity-100' : 'opacity-30'}`} />
              <div className={`absolute w-44 h-44 rounded-full border border-emerald-500/30 ${audioLevel > 10 ? 'scale-110' : 'scale-100'} transition-transform duration-300`} />
              <div className="absolute w-36 h-36 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />

              {/* Central Contact Avatar */}
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-emerald-500/50 shadow-2xl shadow-emerald-500/20 bg-slate-800">
                <img
                  src={participants[0].avatar}
                  alt={participants[0].name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Encrypted Lock Seal */}
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-600 border-2 border-[#0b141a] flex items-center justify-center text-white shadow-md">
                <Lock className="w-4 h-4" />
              </div>
            </div>

            {/* Caller Name & Subtitle */}
            <div className="space-y-1.5">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {roomTitle}
              </h3>
              <p className="text-sm font-medium text-emerald-400">
                Encrypted Voice Transmission · 🔒 End-to-End Encrypted
              </p>
              <p className="text-xs text-slate-400 font-mono">
                Duration: {formatTime(callDuration)}
              </p>
            </div>

            {/* Active Voice Equalizer Animation */}
            <div className="flex items-center justify-center gap-1.5 h-8">
              {[...Array(9)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    height: `${Math.max(6, Math.sin((i + audioLevel / 10) * 1.5) * 24 + 10)}px`
                  }}
                  className="w-1 rounded-full bg-gradient-to-t from-emerald-500 to-teal-300 transition-all duration-150"
                />
              ))}
            </div>

          </div>
        )}

        {/* SIDE IN-CALL CHAT DRAWER */}
        {showChatDrawer && (
          <div className="absolute top-20 right-4 bottom-28 w-80 sm:w-96 rounded-3xl bg-[#111b21]/95 backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col overflow-hidden z-40 animate-slideInRight">
            
            {/* Chat Drawer Header */}
            <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs text-white">In-Call Strategic Notes</span>
              </div>
              <button
                onClick={() => setShowChatDrawer(false)}
                className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages List */}
            <div className="flex-1 p-3.5 space-y-2.5 overflow-y-auto">
              {chatMessages.map(msg => (
                <div key={msg.id} className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-bold text-emerald-400">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-white/10 flex items-center gap-2 bg-black/40">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type prayer note..."
                className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/10 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors shadow"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

      </div>

      {/* BOTTOM CONTROL DOCK: Iconic WhatsApp Call Controller */}
      <div className="p-4 sm:p-6 bg-gradient-to-t from-black via-black/90 to-transparent flex flex-col items-center gap-3 z-30">
        
        {/* Quick Emoji Bar */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-lg">
          {['🙏', '❤️', '🔥', '🙌', '🛡️', '⚔️'].map(emoji => (
            <button
              key={emoji}
              onClick={() => sendReaction(emoji)}
              className="hover:scale-125 active:scale-95 transition-transform p-1"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Floating Action Pill */}
        <div className="px-4 py-3 rounded-full bg-[#182229]/95 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-3 sm:gap-4">
          
          {/* Mute / Unmute Microphone */}
          <button
            onClick={handleToggleMute}
            className={`p-3.5 sm:p-4 rounded-full transition-all active:scale-95 shadow-md ${
              isMuted
                ? 'bg-red-500/90 text-white ring-2 ring-red-500/30'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Camera On / Off (Video Call Mode) */}
          <button
            onClick={handleToggleVideo}
            className={`p-3.5 sm:p-4 rounded-full transition-all active:scale-95 shadow-md ${
              !isVideoOn
                ? 'bg-red-500/90 text-white ring-2 ring-red-500/30'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={isVideoOn ? 'Turn Camera Off' : 'Turn Camera On'}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Flip Camera Front <-> Back */}
          {isVideoOn && (
            <button
              onClick={handleFlipCamera}
              className={`p-3.5 sm:p-4 rounded-full bg-white/15 hover:bg-white/25 text-white transition-all active:scale-95 shadow-md ${
                cameraSwitching ? 'animate-spin text-emerald-400' : ''
              }`}
              title={`Switch to ${facingMode === 'user' ? 'Rear / Back Camera' : 'Front Selfie Camera'}`}
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}

          {/* Speakerphone Toggle */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`p-3.5 sm:p-4 rounded-full transition-all active:scale-95 shadow-md ${
              !isSpeakerOn
                ? 'bg-white/10 text-slate-400'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title={isSpeakerOn ? 'Speakerphone On' : 'Speakerphone Off'}
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={handleToggleScreenShare}
            className={`p-3.5 sm:p-4 rounded-full transition-all active:scale-95 shadow-md ${
              isScreenSharing
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-500/50'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            title="Share Tactical Field Screen"
          >
            <MonitorUp className="w-5 h-5" />
          </button>

          {/* Big Circular End Call Button (WhatsApp Signature Red) */}
          <button
            onClick={onLeaveRoom}
            className="p-4 sm:p-4.5 rounded-full bg-red-600 hover:bg-red-700 active:scale-90 text-white shadow-xl shadow-red-600/40 transition-all flex items-center justify-center ml-1 sm:ml-2"
            title="End WhatsApp Call"
          >
            <PhoneOff className="w-6 h-6 fill-white text-white" />
          </button>

        </div>

      </div>

    </div>
  );
};
