import React from 'react';

interface PrayerCloudLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'splash' | 'full';
  className?: string;
  showText?: boolean;
  animated?: boolean;
  variant?: 'emblem' | 'full';
}

const sizeMap = {
  xs: { emblemSize: 'w-6 h-6', text: 'text-xs' },
  sm: { emblemSize: 'w-9 h-9', text: 'text-sm' },
  md: { emblemSize: 'w-12 h-12', text: 'text-base' },
  lg: { emblemSize: 'w-16 h-16', text: 'text-xl' },
  xl: { emblemSize: 'w-24 h-24', text: 'text-2xl' },
  '2xl': { emblemSize: 'w-36 h-36', text: 'text-3xl' },
  splash: { emblemSize: 'w-56 h-56 sm:w-64 sm:h-64', text: 'text-4xl' },
  full: { emblemSize: 'w-full h-full', text: 'text-4xl' }
};

export const PrayerCloudLogo: React.FC<PrayerCloudLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  animated = false,
  variant = 'emblem'
}) => {
  const currentSize = sizeMap[size] || sizeMap.md;
  const isSplash = size === 'splash';

  const svgEmblem = (
    <div className={`relative flex items-center justify-center shrink-0 ${isSplash ? 'p-1' : ''}`}>
      {/* Dynamic 3D ambient aura for splash/animated states */}
      {(animated || isSplash) && (
        <div className="absolute inset-0 -m-6 bg-gradient-to-tr from-blue-600/35 via-amber-400/25 to-blue-400/35 rounded-full blur-2xl animate-pulse pointer-events-none" />
      )}

      <svg
        viewBox="90 55 350 375"
        className={`${currentSize.emblemSize} ${
          animated || isSplash
            ? 'animate-[bounce_4s_ease-in-out_infinite] transition-transform duration-700 hover:scale-105'
            : ''
        } ${className} shrink-0 drop-shadow-2xl overflow-visible block`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Deep Isometric Cast Shadow matching uploaded logo */}
          <filter id={`pc-3d-shadow-${size}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="-10" dy="16" stdDeviation="10" floodColor="#0a1026" floodOpacity="0.7" />
            <feDropShadow dx="-2" dy="6" stdDeviation="4" floodColor="#030712" floodOpacity="0.45" />
          </filter>

          {/* Royal Blue Front Face */}
          <linearGradient id={`blueFront-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="50%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>

          {/* Blue Top Bevel Highlight */}
          <linearGradient id={`blueTop-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="60%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* Blue Left 3D Extrusion Shadow */}
          <linearGradient id={`blueSide-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#172554" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Vivid Golden Yellow Front */}
          <linearGradient id={`yellowFront-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffcc00" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          {/* Yellow Top Facet Highlight */}
          <linearGradient id={`yellowTop-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Yellow 3D Bottom Depth Extrusion */}
          <linearGradient id={`yellowSide-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>

        <g filter={`url(#pc-3d-shadow-${size})`}>
          {/* 3D P Top Bar - Left Extruded Face */}
          <path d="M 125 115 L 145 80 L 155 80 L 138 122 Z" fill={`url(#blueSide-${size})`} />
          {/* 3D P Top Bar - Top Bevel */}
          <path d="M 145 80 L 295 80 Q 370 80 375 130 L 335 150 Q 325 118 280 118 L 138 118 Z" fill={`url(#blueTop-${size})`} />
          {/* 3D P Top Bar - Front Face */}
          <path d="M 135 118 L 295 118 Q 365 118 365 170 Q 365 220 310 220 L 255 220 L 255 260 L 315 260 Q 405 260 405 170 Q 405 75 295 75 L 135 75 Z" fill={`url(#blueFront-${size})`} />

          {/* Embossed Yellow 'PRAYER CLOUD' Text on Top Bar */}
          <text
            x="170"
            y="104"
            fill="#fde047"
            fontFamily="'Montserrat', 'Arial Black', sans-serif"
            fontSize="20"
            fontWeight="900"
            letterSpacing="2.2"
            transform="rotate(1.5 170 104)"
          >
            PRAYER CLOUD
          </text>

          {/* Blue Vertical Stem - Left 3D Extruded Block Shadow */}
          <path d="M 138 150 L 165 130 L 165 365 L 138 385 Z" fill={`url(#blueSide-${size})`} />
          {/* Blue Vertical Stem - Front Face Pillar */}
          <rect x="165" y="130" width="82" height="235" rx="3" fill={`url(#blueFront-${size})`} />
          {/* Blue Vertical Stem - Bottom 3D Facet */}
          <path d="M 138 385 L 165 365 L 247 365 L 220 385 Z" fill={`url(#blueSide-${size})`} />

          {/* 3D Yellow Interlocking C Structure */}
          {/* C Top Horizontal Arm */}
          <path d="M 247 140 L 390 140 L 390 220 L 325 220 L 325 185 L 247 185 Z" fill={`url(#yellowFront-${size})`} />
          <path d="M 225 155 L 247 140 L 390 140 L 370 155 Z" fill={`url(#yellowTop-${size})`} />

          {/* C Main Body Right Arch Curve */}
          <path d="M 247 140 Q 200 140 200 260 Q 200 380 320 380 L 395 380 L 395 285 L 330 285 Q 280 285 280 260 Q 280 230 330 230 L 330 140 Z" fill={`url(#yellowFront-${size})`} />
          
          {/* C 3D Left/Bottom Extrusions & Real-world Depth */}
          <path d="M 200 260 L 180 280 Q 180 405 300 405 L 395 405 L 395 380 L 320 380 Q 200 380 200 260 Z" fill={`url(#yellowSide-${size})`} />
          {/* C Gap/Notch on Bottom Arm */}
          <path d="M 330 285 L 350 265 L 395 265 L 395 285 Z" fill={`url(#yellowSide-${size})`} />
          <path d="M 320 380 L 300 405 L 395 405 L 395 380 Z" fill={`url(#yellowSide-${size})`} />

          {/* Blue Lower Loop Interlocking Return Piece */}
          <path d="M 255 250 L 315 250 Q 350 250 350 270 L 325 270 Q 325 260 295 260 L 255 260 Z" fill={`url(#blueFront-${size})`} />
        </g>
      </svg>
    </div>
  );

  if (variant === 'emblem' && !showText) {
    return svgEmblem;
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {svgEmblem}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-black font-display tracking-tight text-slate-900 dark:text-white ${currentSize.text}`}>
              PRAYER
            </span>
            <span className={`font-black font-display tracking-tight text-amber-500 ${currentSize.text}`}>
              CLOUD
            </span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
            Global Intercession Platform
          </span>
        </div>
      )}
    </div>
  );
};
export default PrayerCloudLogo;
