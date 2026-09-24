import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Video,
  Mic,
  Volume2,
  Shield,
  Sliders,
  Check,
  X,
  Camera,
  RotateCcw,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBranding } from '../../context/ThemeAndBrandingContext';

interface CallSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CallSettingsModal: React.FC<CallSettingsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const { isDarkMode } = useBranding();
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'camera-switch' | 'security'>('video');

  // Video Settings
  const [selectedCamera, setSelectedCamera] = useState('Front Camera (Selfie)');
  const [preferredFacingMode, setPreferredFacingMode] = useState<'user' | 'environment'>('user');
  const [isHdEnabled, setIsHdEnabled] = useState(true);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);

  // Audio Settings
  const [micVolume, setMicVolume] = useState(85);
  const [speakerVolume, setSpeakerVolume] = useState(90);
  const [isNoiseSuppressionEnabled, setIsNoiseSuppressionEnabled] = useState(true);
  const [isEchoCancellationEnabled, setIsEchoCancellationEnabled] = useState(true);

  // Security Settings
  const [isE2EEEnabled, setIsE2EEEnabled] = useState(true);
  const [lowDataUsage, setLowDataUsage] = useState(false);

  useEffect(() => {
    if (isOpen && activeTab === 'video') {
      startCameraPreview(preferredFacingMode);
    } else {
      stopCameraPreview();
    }

    return () => {
      stopCameraPreview();
    };
  }, [isOpen, activeTab, preferredFacingMode]);

  const startCameraPreview = async (mode: 'user' | 'environment') => {
    try {
      stopCameraPreview();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
        audio: false
      });
      setPreviewStream(stream);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera preview note:', err);
    }
  };

  const stopCameraPreview = () => {
    if (previewStream) {
      previewStream.getTracks().forEach(t => t.stop());
      setPreviewStream(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-[#161b26] border border-[#262f43] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-[#262f43] flex items-center justify-between bg-[#121622]">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Call & Device Preferences</h3>
              <p className="text-[11px] text-slate-400">Manage camera, microphone, and encryption settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-[#262f43] bg-[#141a24] px-4">
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'video' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Camera & Video</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'audio' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Microphone & Audio</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'security' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Encryption & Security</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-white">
          
          {activeTab === 'video' && (
            <div className="space-y-4">
              {/* Camera Preview Box */}
              <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-700 h-48 flex items-center justify-center">
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${preferredFacingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] text-emerald-300 font-mono">
                  Live Preview: {preferredFacingMode === 'user' ? 'Front / Selfie' : 'Back / Rear Camera'}
                </div>
                <button
                  onClick={() => {
                    const nextMode = preferredFacingMode === 'user' ? 'environment' : 'user';
                    setPreferredFacingMode(nextMode);
                  }}
                  className="absolute bottom-2 right-2 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Switch to {preferredFacingMode === 'user' ? 'Back' : 'Front'}</span>
                </button>
              </div>

              {/* Camera Mode Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Default Camera Orientation</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPreferredFacingMode('user')}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      preferredFacingMode === 'user'
                        ? 'border-emerald-500 bg-emerald-950/30 text-white'
                        : 'border-slate-800 bg-[#121622] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">Front Camera (Selfie)</div>
                      <div className="text-[10px] text-slate-400">Best for personal intercession</div>
                    </div>
                    {preferredFacingMode === 'user' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredFacingMode('environment')}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      preferredFacingMode === 'environment'
                        ? 'border-emerald-500 bg-emerald-950/30 text-white'
                        : 'border-slate-800 bg-[#121622] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs">Back / Rear Camera</div>
                      <div className="text-[10px] text-slate-400">Best for field situation broadcast</div>
                    </div>
                    {preferredFacingMode === 'environment' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </button>
                </div>
              </div>

              {/* HD Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#121622] border border-[#242e42]">
                <div>
                  <div className="font-bold text-xs text-white">HD Video Quality</div>
                  <div className="text-[11px] text-slate-400">Stream high definition video when network permits</div>
                </div>
                <input
                  type="checkbox"
                  checked={isHdEnabled}
                  onChange={(e) => setIsHdEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">Microphone Input Level</span>
                  <span className="font-mono text-emerald-400">{micVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={micVolume}
                  onChange={(e) => setMicVolume(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">Speaker / Earpiece Volume</span>
                  <span className="font-mono text-emerald-400">{speakerVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={speakerVolume}
                  onChange={(e) => setSpeakerVolume(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#121622] border border-[#242e42]">
                <div>
                  <div className="font-bold text-xs text-white">AI Noise Suppression</div>
                  <div className="text-[11px] text-slate-400">Filters background noise and room echoes automatically</div>
                </div>
                <input
                  type="checkbox"
                  checked={isNoiseSuppressionEnabled}
                  onChange={(e) => setIsNoiseSuppressionEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <Lock className="w-4 h-4" />
                  <span>256-bit End-to-End Encryption Active</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  All peer-to-peer and group calls are secured with modern cryptographic keys generated locally on your device.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#121622] border border-[#242e42]">
                <div>
                  <div className="font-bold text-xs text-white">Low Data Usage for Calls</div>
                  <div className="text-[11px] text-slate-400">Reduces bandwidth in low-connectivity frontier regions</div>
                </div>
                <input
                  type="checkbox"
                  checked={lowDataUsage}
                  onChange={(e) => setLowDataUsage(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#262f43] bg-[#121622] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-colors"
          >
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  );
};
