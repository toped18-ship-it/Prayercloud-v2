import React, { useEffect, useState } from 'react';
import { PrayerCloudLogo } from './PrayerCloudLogo';
import { Sparkles, Globe2, ShieldCheck, Radio } from 'lucide-react';

interface AppSplashScreenProps {
  onLoaded: () => void;
  minDurationMs?: number;
}

const statusStages = [
  { threshold: 0, text: 'INITIALIZING FRONTIER NETWORK...', icon: Radio },
  { threshold: 25, text: 'SYNCING REALTIME PRAYER NODES...', icon: Globe2 },
  { threshold: 55, text: 'CONNECTING 10/40 WINDOW DEMOGRAPHICS...', icon: Sparkles },
  { threshold: 80, text: 'SYNCHRONIZING INTERCESSION CHANNELS...', icon: ShieldCheck },
  { threshold: 96, text: 'READY FOR INTERCESSION', icon: ShieldCheck }
];

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({
  onLoaded,
  minDurationMs = 3600
}) => {
  const [progress, setProgress] = useState(8);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Smoother, calibrated progress tick
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / minDurationMs) * 100), 96);
      setProgress(pct);
    }, 60);

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          onLoaded();
        }, 500);
      }, 300);
    }, minDurationMs);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [minDurationMs, onLoaded]);

  const currentStatus =
    [...statusStages].reverse().find((s) => progress >= s.threshold) || statusStages[0];
  const CurrentIcon = currentStatus.icon;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070b14] text-white select-none transition-opacity duration-500 overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Animated Ambience */}
      <div className="absolute w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-16 animate-[pulse_3s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#070b14_90%)] pointer-events-none" />

      {/* Decorative Rotating Orbital Rings */}
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full border border-blue-500/20 animate-[spin_24s_linear_infinite] pointer-events-none flex items-center justify-center">
        <div className="w-2.5 h-2.5 bg-blue-400 rounded-full shadow-[0_0_12px_#60a5fa] -translate-y-40 sm:-translate-y-48" />
      </div>
      <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-amber-400/20 animate-[spin_18s_linear_infinite_reverse] pointer-events-none flex items-center justify-center">
        <div className="w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_10px_#f59e0b] translate-x-32 sm:translate-x-40" />
      </div>

      {/* Main 3D Brand Logo Container */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-4 max-w-md w-full">
        {/* Glowing 3D Glass Badge */}
        <div className="relative p-6 sm:p-8 bg-slate-900/70 rounded-3xl border border-blue-500/30 backdrop-blur-2xl shadow-2xl shadow-blue-950/90 transition-transform duration-500 hover:scale-105">
          {/* Subtle Corner Accents */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-amber-400 rounded-tl-lg" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-blue-400 rounded-tr-lg" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-blue-400 rounded-bl-lg" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-amber-400 rounded-br-lg" />

          <PrayerCloudLogo size="splash" animated />
        </div>

        {/* Brand Title and Tagline */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-3xl sm:text-4xl font-black font-display tracking-wider">
            <span className="text-white drop-shadow-md">PRAYER</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 drop-shadow-md">
              CLOUD
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-blue-200/80 tracking-widest font-bold uppercase font-mono">
            Global 10/40 Window Intercession Platform
          </p>
        </div>

        {/* Calibrated Smooth Progress Bar */}
        <div className="w-full max-w-xs space-y-2.5 pt-2">
          <div className="h-2 w-full bg-slate-900/90 rounded-full p-0.5 border border-blue-500/30 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-amber-400 to-blue-400 rounded-full transition-all duration-150 ease-out shadow-[0_0_16px_rgba(245,158,11,0.6)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span className="inline-flex items-center gap-1.5 text-blue-300 font-semibold tracking-wide truncate max-w-[210px]">
              <CurrentIcon className="w-3 h-3 text-amber-400 shrink-0 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="truncate">{currentStatus.text}</span>
            </span>
            <span className="font-bold text-amber-400 text-xs shrink-0 pl-2">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
