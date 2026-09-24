import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Video,
  Mic,
  Volume2,
  Shield,
  Sparkles,
  Sliders,
  User,
  Monitor,
  Lock,
  Check,
  X,
  Camera,
  Play,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBranding } from '../../context/ThemeAndBrandingContext';

interface ZoomSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZoomSettingsModal: React.FC<ZoomSettingsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { isDarkMode, toggleDarkMode } = useBranding();
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'background' | 'security' | 'general' | 'profile'>('video');

  // Video Settings
  const [selectedCamera, setSelectedCamera] = useState('Integrated HD Camera');
  const [isHdEnabled, setIsHdEnabled] = useState(true);
  const [isMirrorEnabled, setIsMirrorEnabled] = useState(true);
  const [isLowLightAdjust, setIsLowLightAdjust] = useState(true);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);

  // Audio Settings
  const [selectedMic, setSelectedMic] = useState('Default - Internal Microphone');
  const [selectedSpeaker, setSelectedSpeaker] = useState('Default - Internal Speakers');
  const [micVolume, setMicVolume] = useState(85);
  const [speakerVolume, setSpeakerVolume] = useState(90);
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micLevelMeter, setMicLevelMeter] = useState(0);
  const [isNoiseSuppressionEnabled, setIsNoiseSuppressionEnabled] = useState(true);

  // Background Settings
  const [virtualBg, setVirtualBg] = useState<string>('none');

  // Security Settings
  const [isE2EEEnabled, setIsE2EEEnabled] = useState(true);
  const [requirePasscode, setRequirePasscode] = useState(true);
  const [enableWaitingRoom, setEnableWaitingRoom] = useState(true);

  useEffect(() => {
    if (isOpen && activeTab === 'video') {
      startCameraPreview();
    } else {
      stopCameraPreview();
    }

    return () => {
      stopCameraPreview();
    };
  }, [isOpen, activeTab]);

  const startCameraPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setPreviewStream(stream);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Video preview permission in sandbox:', err);
    }
  };

  const stopCameraPreview = () => {
    if (previewStream) {
      previewStream.getTracks().forEach(t => t.stop());
      setPreviewStream(null);
    }
  };

  // Mic test simulation
  useEffect(() => {
    let interval: any;
    if (isTestingMic) {
      interval = setInterval(() => {
        setMicLevelMeter(Math.floor(20 + Math.random() * 70));
      }, 150);
    } else {
      setMicLevelMeter(0);
    }
    return () => clearInterval(interval);
  }, [isTestingMic]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn select-none font-sans">
      <div className="w-full max-w-3xl bg-[#181e2b] dark:bg-[#161b26] rounded-3xl border border-[#262f43] shadow-2xl overflow-hidden flex flex-col md:flex-row text-white max-h-[85vh]">
        
        {/* Left Zoom Settings Sidebar Navigation */}
        <div className="w-full md:w-56 bg-[#131722] border-r border-[#262f43] p-4 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 px-2 pb-4 mb-2 border-b border-[#262f43]">
              <div className="w-7 h-7 rounded-xl bg-[#0e71eb] flex items-center justify-center text-white font-bold shadow-md">
                <Settings className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm tracking-tight">Zoom Settings</span>
            </div>

            <div className="space-y-1 text-xs font-semibold">
              {[
                { id: 'video', label: 'Video', icon: Video },
                { id: 'audio', label: 'Audio', icon: Mic },
                { id: 'background', label: 'Background & Effects', icon: Sparkles },
                { id: 'security', label: 'Security & E2EE', icon: Shield },
                { id: 'general', label: 'General & Theme', icon: Sliders },
                { id: 'profile', label: 'My Profile', icon: User }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-[#0e71eb] text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-[#1f2738]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#262f43] text-[11px] text-slate-500 px-2">
            Zoom Workplace v5.18 · PrayerCloud
          </div>
        </div>

        {/* Right Settings Content Area */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between bg-[#181e2b]">
          
          <div className="space-y-5">
            {/* Top Close */}
            <div className="flex items-center justify-between border-b border-[#262f43] pb-3">
              <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider text-xs">
                {activeTab.toUpperCase()} SETTINGS
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#262f43] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TAB: VIDEO */}
            {activeTab === 'video' && (
              <div className="space-y-4 text-xs">
                {/* Live Camera Preview Box */}
                <div className="w-full aspect-video bg-[#0f131d] rounded-2xl overflow-hidden border border-[#2f3950] relative flex items-center justify-center">
                  <video
                    ref={videoPreviewRef}
                    autoPlay
                    muted
                    playsInline
                    className={`w-full h-full object-cover ${isMirrorEnabled ? 'mirror' : ''}`}
                  />
                  {!previewStream && (
                    <div className="text-center p-4">
                      <Camera className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <span className="text-slate-400">Integrated HD Camera Preview Active</span>
                    </div>
                  )}
                  {isHdEnabled && (
                    <span className="absolute top-2 right-2 bg-[#0e71eb] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      HD 1080p
                    </span>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Camera Source</label>
                    <select
                      value={selectedCamera}
                      onChange={(e) => setSelectedCamera(e.target.value)}
                      className="w-full px-3 py-2 bg-[#1f2738] border border-[#2f3950] rounded-xl text-white focus:outline-none"
                    >
                      <option value="Integrated HD Camera">FaceTime / Integrated HD Camera (Built-in)</option>
                      <option value="External USB Cam">External 4K USB Camera</option>
                      <option value="Virtual Cam">OBS / Zoom Virtual Camera</option>
                    </select>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={isHdEnabled}
                        onChange={(e) => setIsHdEnabled(e.target.checked)}
                        className="rounded bg-[#1f2738] border-slate-600 text-[#0e71eb]"
                      />
                      <span>Enable HD Video Streaming (1080p)</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={isMirrorEnabled}
                        onChange={(e) => setIsMirrorEnabled(e.target.checked)}
                        className="rounded bg-[#1f2738] border-slate-600 text-[#0e71eb]"
                      />
                      <span>Mirror my video</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={isLowLightAdjust}
                        onChange={(e) => setIsLowLightAdjust(e.target.checked)}
                        className="rounded bg-[#1f2738] border-slate-600 text-[#0e71eb]"
                      />
                      <span>Adjust for low light in underground / night watches</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: AUDIO */}
            {activeTab === 'audio' && (
              <div className="space-y-5 text-xs">
                {/* Microphone Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-[#0e71eb]" />
                      <span>Microphone</span>
                    </span>
                    <button
                      onClick={() => setIsTestingMic(!isTestingMic)}
                      className="px-3 py-1 bg-[#262f43] hover:bg-[#343e54] text-white rounded-lg font-semibold"
                    >
                      {isTestingMic ? 'Stop Test' : 'Test Mic'}
                    </button>
                  </div>

                  <select
                    value={selectedMic}
                    onChange={(e) => setSelectedMic(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1f2738] border border-[#2f3950] rounded-xl text-white focus:outline-none"
                  >
                    <option value="Default - Internal Microphone">Default - Built-in Microphone</option>
                    <option value="USB Studio Mic">USB Studio Condenser Mic</option>
                    <option value="AirPods Pro">Bluetooth Headset / AirPods</option>
                  </select>

                  {/* Input Level Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Input Level:</span>
                      <span>{isTestingMic ? `${micLevelMeter}%` : 'Idle'}</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#0f131d] rounded-full overflow-hidden border border-[#2f3950]">
                      <div
                        style={{ width: `${micLevelMeter}%` }}
                        className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500 transition-all duration-100 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Speaker Section */}
                <div className="space-y-2 pt-2 border-t border-[#262f43]">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-[#0e71eb]" />
                      <span>Speaker</span>
                    </span>
                    <button
                      onClick={() => {
                        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                        audio.play().catch(() => {});
                      }}
                      className="px-3 py-1 bg-[#262f43] hover:bg-[#343e54] text-white rounded-lg font-semibold"
                    >
                      Test Speaker
                    </button>
                  </div>

                  <select
                    value={selectedSpeaker}
                    onChange={(e) => setSelectedSpeaker(e.target.value)}
                    className="w-full px-3 py-2 bg-[#1f2738] border border-[#2f3950] rounded-xl text-white focus:outline-none"
                  >
                    <option value="Default - Internal Speakers">Default - Built-in Speakers</option>
                    <option value="External Studio Monitors">External Studio Monitors</option>
                    <option value="AirPods Pro">Bluetooth Headphones</option>
                  </select>
                </div>

                {/* Noise suppression */}
                <div className="pt-2 border-t border-[#262f43]">
                  <label className="flex items-center gap-2.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={isNoiseSuppressionEnabled}
                      onChange={(e) => setIsNoiseSuppressionEnabled(e.target.checked)}
                      className="rounded bg-[#1f2738] border-slate-600 text-[#0e71eb]"
                    />
                    <span>Suppress background noise (AI Noise Cancellation)</span>
                  </label>
                </div>
              </div>
            )}

            {/* TAB: BACKGROUNDS */}
            {activeTab === 'background' && (
              <div className="space-y-4 text-xs">
                <p className="text-slate-400">
                  Select a virtual backdrop for your live intercession watches and field briefings.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'none', label: 'None (Default)', preview: 'bg-slate-800' },
                    { id: 'blur', label: 'Blur Background', preview: 'bg-slate-700' },
                    { id: 'Jerusalem', label: 'Jerusalem Overlook', preview: 'bg-amber-950/80' },
                    { id: 'Prayer Tower', label: '24/7 Prayer Tower', preview: 'bg-blue-950' },
                    { id: '10/40 Map', label: '10/40 Frontier Map', preview: 'bg-emerald-950' },
                    { id: 'Mountain Altar', label: 'Mountain Altar', preview: 'bg-indigo-950' }
                  ].map(bg => (
                    <button
                      key={bg.id}
                      onClick={() => setVirtualBg(bg.id)}
                      className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                        virtualBg === bg.id
                          ? 'border-[#0e71eb] bg-[#0e71eb]/20 ring-2 ring-[#0e71eb]'
                          : 'border-[#2f3950] bg-[#1f2738] hover:border-slate-500'
                      }`}
                    >
                      <div className={`w-full h-12 rounded-xl ${bg.preview} flex items-center justify-center text-xs font-semibold`}>
                        {bg.label.charAt(0)}
                      </div>
                      <span className="text-[11px] font-semibold">{bg.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-3">
                  <Shield className="w-8 h-8 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-emerald-300">Enhanced End-to-End Encryption (E2EE) Active</h4>
                    <p className="text-[11px] text-emerald-400/80">
                      All video streams, tactical chats, and audio rooms are encrypted with AES-256 GCM cryptographic ciphers.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="flex items-center justify-between p-3 bg-[#1f2738] rounded-xl border border-[#2f3950]">
                    <div>
                      <span className="font-semibold block text-slate-200">Require Meeting Passcode</span>
                      <span className="text-[11px] text-slate-400">Generates 6-digit numeric passcodes for watches</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={requirePasscode}
                      onChange={(e) => setRequirePasscode(e.target.checked)}
                      className="rounded text-[#0e71eb]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-[#1f2738] rounded-xl border border-[#2f3950]">
                    <div>
                      <span className="font-semibold block text-slate-200">Enable Waiting Room</span>
                      <span className="text-[11px] text-slate-400">Admit verified missionary personnel only</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableWaitingRoom}
                      onChange={(e) => setEnableWaitingRoom(e.target.checked)}
                      className="rounded text-[#0e71eb]"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* TAB: GENERAL */}
            {activeTab === 'general' && (
              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <label className="block text-slate-400 font-semibold">Color Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => !isDarkMode && toggleDarkMode()}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-semibold ${
                        isDarkMode ? 'border-[#0e71eb] bg-[#0e71eb]/20 text-white' : 'border-[#2f3950] bg-[#1f2738] text-slate-400'
                      }`}
                    >
                      <span>Zoom Dark (Recommended)</span>
                    </button>
                    <button
                      onClick={() => isDarkMode && toggleDarkMode()}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-semibold ${
                        !isDarkMode ? 'border-[#0e71eb] bg-[#0e71eb]/20 text-white' : 'border-[#2f3950] bg-[#1f2738] text-slate-400'
                      }`}
                    >
                      <span>Zoom Light Theme</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-[#262f43]">
                  <label className="flex items-center gap-2.5 cursor-pointer text-slate-300">
                    <input type="checkbox" defaultChecked className="rounded text-[#0e71eb]" />
                    <span>Start Zoom automatically on system boot</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer text-slate-300">
                    <input type="checkbox" defaultChecked className="rounded text-[#0e71eb]" />
                    <span>Always show meeting control bar</span>
                  </label>
                </div>
              </div>
            )}

            {/* TAB: PROFILE */}
            {activeTab === 'profile' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-4 p-4 bg-[#1f2738] rounded-2xl border border-[#2f3950]">
                  <div className="w-16 h-16 rounded-2xl bg-[#0e71eb] flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    {currentUser?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">{currentUser?.fullName || 'Operative'}</h4>
                    <p className="text-slate-400">{currentUser?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-900/60 text-blue-300 text-[10px] font-semibold rounded-full border border-blue-700">
                      {currentUser?.role || 'Missionary'} · Verified
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-slate-400">
                  <div className="flex justify-between py-1 border-b border-[#262f43]">
                    <span>Personal Meeting ID:</span>
                    <strong className="font-mono text-white">849 2049 1192</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#262f43]">
                    <span>Host Key:</span>
                    <strong className="font-mono text-white">104088</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#262f43]">
                    <span>Plan:</span>
                    <strong className="text-emerald-400">Zoom Enterprise Mission Unlimited</strong>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Dialog Done Button */}
          <div className="pt-4 mt-6 border-t border-[#262f43] flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#0e71eb] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all"
            >
              Done & Save Settings
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
