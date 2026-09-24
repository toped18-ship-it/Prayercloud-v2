import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Flame,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Clock,
  Compass,
  MapPin,
  Sparkles,
  HeartHandshake,
  ArrowRight,
  Radio,
  Eye
} from 'lucide-react';
import { Country, UnreachedPlace } from '../../types';
import { useBranding } from '../../context/ThemeAndBrandingContext';

interface LiveTickingEarthGlobeProps {
  countries: Country[];
  places: UnreachedPlace[];
  onSelectCountry: (code: string) => void;
  onSelectPlace?: (placeId: string) => void;
  onOpenCreatePrayer?: (context: string) => void;
}

interface HotspotPin {
  id: string;
  name: string;
  countryCode: string;
  lat: number;
  lng: number;
  population: string;
  unreachedPercent: number;
  religion: string;
  urgency: 'Extreme' | 'High' | 'Pioneer Needed';
  prayerFocus: string;
}

export const LiveTickingEarthGlobe: React.FC<LiveTickingEarthGlobeProps> = ({
  countries,
  places,
  onSelectCountry,
  onSelectPlace,
  onOpenCreatePrayer
}) => {
  const { branding } = useBranding();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotationAngle, setRotationAngle] = useState(0);
  
  // Admin-controlled settings
  const isRotating = branding.globeRotationPaused !== true;
  const soundEnabled = branding.globeTickingSound === true;
  const rotationSpeed = branding.globeSpeed === 0.5 ? 0.2 : branding.globeSpeed === 2 ? 0.9 : 0.4;

  const [currentTimeUtc, setCurrentTimeUtc] = useState<string>('');
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotPin | null>(null);
  const [intercessionCount, setIntercessionCount] = useState(14820);
  const [hasInterceded, setHasInterceded] = useState(false);

  // Audio Context ref for gentle ticking
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Key Strategic Frontier Hotspots
  const frontierHotspots: HotspotPin[] = [
    {
      id: 'pin-af',
      name: 'Kabul & Pashtun Highlands',
      countryCode: 'AF',
      lat: 34.5,
      lng: 69.2,
      population: '41.1M',
      unreachedPercent: 99.8,
      religion: 'Islam (Sunni)',
      urgency: 'Extreme',
      prayerFocus: 'Underground believers & secret Gospel radio broadcasts'
    },
    {
      id: 'pin-ye',
      name: 'Sanaa & Hadramawt Valley',
      countryCode: 'YE',
      lat: 15.3,
      lng: 44.2,
      population: '33.7M',
      unreachedPercent: 99.2,
      religion: 'Islam (Zaidi/Sunni)',
      urgency: 'Extreme',
      prayerFocus: 'Humanitarian peace & discovery of Bible in Arabic dialects'
    },
    {
      id: 'pin-in',
      name: 'Ganges Valley & Uttar Pradesh',
      countryCode: 'IN',
      lat: 26.8,
      lng: 80.9,
      population: '240M in region',
      unreachedPercent: 95.4,
      religion: 'Hinduism',
      urgency: 'Pioneer Needed',
      prayerFocus: 'Discovery Bible Studies in 100,000 unreached rural villages'
    },
    {
      id: 'pin-so',
      name: 'Mogadishu & Nomadic Horn',
      countryCode: 'SO',
      lat: 2.0,
      lng: 45.3,
      population: '17.6M',
      unreachedPercent: 99.9,
      religion: 'Islam (Shafi)',
      urgency: 'Extreme',
      prayerFocus: 'Digital scripture engagement and safety for disciples'
    },
    {
      id: 'pin-ir',
      name: 'Tehran & Zagros Tribes',
      countryCode: 'IR',
      lat: 35.7,
      lng: 51.4,
      population: '88.5M',
      unreachedPercent: 98.6,
      religion: 'Islam (Shia)',
      urgency: 'High',
      prayerFocus: 'Unprecedented house church multiplication movement'
    },
    {
      id: 'pin-kp',
      name: 'Pyongyang & Northern Provinces',
      countryCode: 'KP',
      lat: 39.0,
      lng: 125.7,
      population: '26.0M',
      unreachedPercent: 99.5,
      religion: 'Juche / Agnostic',
      urgency: 'Extreme',
      prayerFocus: 'Strength for faithful martyr church in hidden labor camps'
    },
    {
      id: 'pin-tr',
      name: 'Anatolian Heartland',
      countryCode: 'TR',
      lat: 39.9,
      lng: 32.8,
      population: '85.3M',
      unreachedPercent: 99.6,
      religion: 'Islam',
      urgency: 'Pioneer Needed',
      prayerFocus: 'Awakening across ancient Biblical cities of Antioch and Ephesus'
    },
    {
      id: 'pin-ng',
      name: 'Northern Sahel & Middle Belt',
      countryCode: 'NG',
      lat: 12.0,
      lng: 8.5,
      population: '220M (Nation)',
      unreachedPercent: 48.0,
      religion: 'Islam / Christian',
      urgency: 'Extreme',
      prayerFocus: 'Protection against violence and revival among Fulani & Hausa'
    },
    {
      id: 'pin-jp',
      name: 'Greater Tokyo & Tohoku',
      countryCode: 'JP',
      lat: 35.6,
      lng: 139.6,
      population: '124M',
      unreachedPercent: 98.5,
      religion: 'Shinto / Buddhism',
      urgency: 'High',
      prayerFocus: 'Breakthrough among youth experiencing isolation and secularism'
    }
  ];

  // Live ticking UTC Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcString = now.toUTCString().replace('GMT', 'UTC');
      setCurrentTimeUtc(utcString);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Audio Ticking Sound
  const playTickSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Gentle A5 click
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  // Continuous live ticking movement animation
  useEffect(() => {
    let animationFrameId: number;
    let lastTickTime = Date.now();

    const render = () => {
      if (isRotating) {
        setRotationAngle((prev) => (prev + rotationSpeed) % 360);

        // Gentle second-interval tick audio
        const now = Date.now();
        if (now - lastTickTime >= 1000) {
          lastTickTime = now;
          playTickSound();
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRotating, rotationSpeed, soundEnabled]);

  // Canvas Drawing for 3D Globe Projection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.42;

    ctx.clearRect(0, 0, width, height);

    // 1. Outer Atmospheric Glow
    const atmosGlow = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.3);
    atmosGlow.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
    atmosGlow.addColorStop(0.4, 'rgba(37, 99, 235, 0.15)');
    atmosGlow.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = atmosGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // 2. Earth Sphere Ocean Base
    const oceanGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
    oceanGrad.addColorStop(0, '#1e3a8a'); // deep navy blue
    oceanGrad.addColorStop(0.7, '#0f172a'); // dark abyss
    oceanGrad.addColorStop(1, '#020617'); // edge darkness
    ctx.fillStyle = oceanGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // 3. 10/40 Window Golden Belt Highlight (Between Lat 10°N and 40°N)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // Latitudinal lines for 10°N and 40°N
    const lat10Y = cy - radius * Math.sin((10 * Math.PI) / 180);
    const lat40Y = cy - radius * Math.sin((40 * Math.PI) / 180);

    const windowGrad = ctx.createLinearGradient(0, lat40Y, 0, lat10Y);
    windowGrad.addColorStop(0, 'rgba(245, 158, 11, 0.18)');
    windowGrad.addColorStop(0.5, 'rgba(234, 88, 12, 0.22)');
    windowGrad.addColorStop(1, 'rgba(245, 158, 11, 0.18)');
    ctx.fillStyle = windowGrad;
    ctx.fillRect(cx - radius, lat40Y, radius * 2, lat10Y - lat40Y);

    // 4. Latitude and Longitude Coordinate Rings (Ticking rotation grid)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1;

    // Equator
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius, radius * 0.25, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 10/40 Window Border Latitudes
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.ellipse(cx, lat10Y, Math.sqrt(radius * radius - (cy - lat10Y) ** 2), radius * 0.2, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx, lat40Y, Math.sqrt(radius * radius - (cy - lat40Y) ** 2), radius * 0.2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Rotating Longitude Meridians
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    for (let i = 0; i < 12; i++) {
      const angle = ((rotationAngle + i * 30) * Math.PI) / 180;
      const cosAngle = Math.cos(angle);
      if (cosAngle > 0) { // Only front-facing hemisphere
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius * cosAngle, radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // 5. Stylized Continents & Landmass Topography
    const continentPoints = [
      // Africa
      { lat: 10, lng: 20, size: 28 },
      { lat: 25, lng: 15, size: 25 },
      { lat: -15, lng: 25, size: 22 },
      // Middle East
      { lat: 25, lng: 45, size: 20 },
      { lat: 33, lng: 55, size: 22 },
      // South & East Asia
      { lat: 20, lng: 78, size: 28 },
      { lat: 35, lng: 105, size: 32 },
      { lat: 35, lng: 135, size: 18 },
      // Europe
      { lat: 50, lng: 15, size: 24 },
      // Americas
      { lat: 40, lng: -100, size: 30 },
      { lat: -15, lng: -55, size: 26 },
      // Australia
      { lat: -25, lng: 135, size: 20 }
    ];

    continentPoints.forEach((land) => {
      const lambda = ((land.lng - rotationAngle + 180) % 360) - 180; // Relative longitude to viewing angle
      const phi = (land.lat * Math.PI) / 180;
      const radLambda = (lambda * Math.PI) / 180;

      // Check if on visible hemisphere
      if (Math.cos(radLambda) > -0.2) {
        const x = cx + radius * Math.cos(phi) * Math.sin(radLambda);
        const y = cy - radius * Math.sin(phi);

        const landGrad = ctx.createRadialGradient(x, y, 2, x, y, land.size);
        landGrad.addColorStop(0, 'rgba(34, 197, 94, 0.4)');
        landGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.2)');
        landGrad.addColorStop(1, 'rgba(5, 150, 105, 0)');

        ctx.fillStyle = landGrad;
        ctx.beginPath();
        ctx.arc(x, y, land.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 6. Draw Hotspot Beacons & Pulsing Intercession Coordinates
    frontierHotspots.forEach((h) => {
      const lambda = ((h.lng - rotationAngle + 180) % 360) - 180;
      const phi = (h.lat * Math.PI) / 180;
      const radLambda = (lambda * Math.PI) / 180;

      // Front facing visibility
      if (Math.cos(radLambda) > 0.05) {
        const x = cx + radius * Math.cos(phi) * Math.sin(radLambda);
        const y = cy - radius * Math.sin(phi);

        // Outer ripple
        const pulse = (Math.sin(Date.now() / 250) + 1) * 3;
        ctx.strokeStyle = h.urgency === 'Extreme' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(245, 158, 11, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, 6 + pulse, 0, Math.PI * 2);
        ctx.stroke();

        // Inner solid core
        ctx.fillStyle = h.urgency === 'Extreme' ? '#ef4444' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Small label if facing mostly forward
        if (Math.cos(radLambda) > 0.4) {
          ctx.font = '10px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(h.name.split(' ')[0], x + 8, y + 3);
        }
      }
    });

    ctx.restore();

    // 7. Atmospheric Specular Rim & Terminator Ring
    const rimGrad = ctx.createRadialGradient(cx - radius * 0.4, cy - radius * 0.4, radius * 0.8, cx, cy, radius);
    rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    rimGrad.addColorStop(0.85, 'rgba(56, 189, 248, 0.15)');
    rimGrad.addColorStop(1, 'rgba(56, 189, 248, 0.5)');
    ctx.strokeStyle = rimGrad;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

  }, [rotationAngle]);

  const handleIntercedeAgreement = () => {
    if (!hasInterceded) {
      setIntercessionCount(prev => prev + 1);
      setHasInterceded(true);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-blue-950/80 to-slate-950 border border-blue-800/40 shadow-2xl p-6 sm:p-8 text-white">
      
      {/* Background Starry Glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar: Live Ticking Status & Clock */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-blue-900/40 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="font-bold">LIVE ROTATING 3D EARTH GLOBE · 24/7 GLOBAL PRAYER WATCH</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white mt-2">
            Intercession Command & Frontier Locus Grid
          </h2>
        </div>

        {/* Live Ticking Timezone Clock */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-blue-800/60 rounded-2xl px-4 py-2.5 shadow-lg">
          <Clock className="w-5 h-5 text-sky-400 animate-spin-slow" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Live Synchronized Ticking Watch
            </div>
            <div className="font-mono-data text-xs sm:text-sm font-bold text-sky-300">
              {currentTimeUtc || 'Synchronizing UTC Watch...'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Earth Canvas + Live Hotspot Inspector */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
        
        {/* Globe Visualization Area (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          
          <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={480}
              height={480}
              className="w-full h-full cursor-grab active:cursor-grabbing drop-shadow-[0_0_35px_rgba(56,189,248,0.25)]"
              onClick={() => {
                // Cycle through hotspots on canvas click
                const nextIdx = (frontierHotspots.findIndex(h => h.id === selectedHotspot?.id) + 1) % frontierHotspots.length;
                setSelectedHotspot(frontierHotspots[nextIdx]);
              }}
            />

            {/* Floating 10/40 Window Badge */}
            <div className="absolute top-4 left-4 bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1.5 shadow">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>10/40 Window Golden Belt Active</span>
            </div>
          </div>
        </div>

        {/* Frontier Locus Inspector & Prayer Agreement (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-slate-900/90 rounded-2xl border border-blue-900/60 p-5 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-bold text-sky-400">
                Frontier Beacon Spotlight
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedHotspot ? selectedHotspot.countryCode : 'Select Hotspot'}
              </span>
            </div>

            {selectedHotspot ? (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-white">
                    {selectedHotspot.name}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    selectedHotspot.urgency === 'Extreme' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {selectedHotspot.urgency}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Unreached Ratio</span>
                    <span className="font-bold text-red-400 text-sm">{selectedHotspot.unreachedPercent}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Dominant Religion</span>
                    <span className="font-semibold text-slate-200 text-xs">{selectedHotspot.religion}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px] block font-semibold mb-1">
                    Current Strategic Intercession Anchor:
                  </span>
                  <p className="text-xs text-blue-100 bg-blue-950/40 p-2.5 rounded-xl border border-blue-900/50 italic leading-relaxed">
                    "{selectedHotspot.prayerFocus}"
                  </p>
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleIntercedeAgreement}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow ${
                      hasInterceded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                    }`}
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>{hasInterceded ? 'Spiritual Agreement Recorded ✓' : 'I Pray for this Region Now'}</span>
                  </button>

                  <button
                    onClick={() => onSelectCountry(selectedHotspot.countryCode)}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <Globe className="w-8 h-8 text-sky-400 mx-auto animate-bounce" />
                <p className="text-xs text-slate-300 font-semibold">
                  Click any spinning beacon on the Earth or select from quick hotspots below:
                </p>
              </div>
            )}

            {/* Quick Hotspot Selector Chips */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Fast Frontier Switcher:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {frontierHotspots.slice(0, 6).map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHotspot(h)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      selectedHotspot?.id === h.id
                        ? 'bg-sky-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {h.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Global Cumulative Prayer Momentum */}
          <div className="bg-gradient-to-r from-blue-900/50 to-indigo-950/50 p-4 rounded-2xl border border-blue-800/40 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                Active Worldwide Intercessions Today
              </div>
              <div className="text-2xl font-bold font-mono-data text-white mt-0.5">
                {intercessionCount.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>195 Nations Covered</span>
              </span>
              <div className="text-[10px] text-slate-400 mt-0.5">Matthew 24:14 Agreement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
