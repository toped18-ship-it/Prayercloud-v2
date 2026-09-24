import React, { useEffect, useState } from 'react';
import { PrayerCloudLogo } from './PrayerCloudLogo';

interface AppSplashScreenProps {
  onLoaded: () => void;
  minDurationMs?: number;
}

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({
  onLoaded,
  minDurationMs = 1400
}) => {
  const [progress, setProgress] = useState(15);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(stepInterval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 180);

    const timer = setTimeout(() => {
      setProgress(100);
      setIsFadingOut(true);
      setTimeout(() => {
        onLoaded();
      }, 350);
    }, minDurationMs);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, [minDurationMs, onLoaded]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient lighting glows */}
      <div className="absolute w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none -translate-y-12" />

      {/* Main 3D Brand Logo Container */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-4 animate-fadeIn">
        <div className="relative p-6 bg-slate-900/60 rounded-3xl border border-blue-500/30 backdrop-blur-xl shadow-2xl shadow-blue-950/80">
          <PrayerCloudLogo size="splash" animated />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-3xl font-black font-display tracking-tight">
            <span className="text-white">PRAYER</span>
            <span className="text-amber-400">CLOUD</span>
          </div>
          <p className="text-xs text-blue-200/80 tracking-wider font-semibold uppercase">
            Global 10/40 Window Intercession Platform
          </p>
        </div>

        {/* Progress Loading Bar */}
        <div className="w-56 space-y-2 pt-2">
          <div className="h-1.5 w-full bg-slate-800/90 rounded-full overflow-hidden border border-blue-500/20">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-blue-400 transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>CONNECTING LIVE NODES</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
