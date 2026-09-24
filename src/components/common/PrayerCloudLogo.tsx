import React from 'react';

interface PrayerCloudLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'splash';
  className?: string;
  showText?: boolean;
  animated?: boolean;
  variant?: 'emblem' | 'full';
}

const sizeMap = {
  xs: { box: 24, text: 'text-xs', emblemSize: 'w-6 h-6' },
  sm: { box: 36, text: 'text-sm', emblemSize: 'w-9 h-9' },
  md: { box: 48, text: 'text-base', emblemSize: 'w-12 h-12' },
  lg: { box: 64, text: 'text-xl', emblemSize: 'w-16 h-16' },
  xl: { box: 96, text: 'text-2xl', emblemSize: 'w-24 h-24' },
  '2xl': { box: 128, text: 'text-3xl', emblemSize: 'w-32 h-32' },
  splash: { box: 180, text: 'text-4xl', emblemSize: 'w-44 h-44' }
};

export const PrayerCloudLogo: React.FC<PrayerCloudLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  animated = false,
  variant = 'emblem'
}) => {
  const currentSize = sizeMap[size] || sizeMap.md;

  const svgContent = (
    <svg
      viewBox="0 0 512 512"
      className={`${currentSize.emblemSize} ${animated ? 'animate-pulse' : ''} ${className} shrink-0 drop-shadow-lg`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft Ambient Cast Shadow */}
        <filter id={`pc-filter-${size}`} x="-20%" y="-20%" width="150%" height="150%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="-4" dy="12" stdDeviation="10" floodColor="#090d24" floodOpacity="0.45" />
        </filter>

        {/* 3D Blue Front Face */}
        <linearGradient id={`blueFront-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2535d9" />
          <stop offset="100%" stopColor="#151fa4" />
        </linearGradient>

        {/* 3D Blue Top Facet Highlight */}
        <linearGradient id={`blueTop-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4358fa" />
          <stop offset="100%" stopColor="#2b3ce6" />
        </linearGradient>

        {/* 3D Blue Side Shadow Extrusion */}
        <linearGradient id={`blueSide-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f175e" />
          <stop offset="100%" stopColor="#080c35" />
        </linearGradient>

        {/* 3D Yellow Front Face */}
        <linearGradient id={`yellowFront-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd200" />
          <stop offset="100%" stopColor="#e5ad00" />
        </linearGradient>

        {/* 3D Yellow Top Facet */}
        <linearGradient id={`yellowTop-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffeb60" />
          <stop offset="100%" stopColor="#ffd200" />
        </linearGradient>

        {/* 3D Yellow Side Shadow Extrusion */}
        <linearGradient id={`yellowSide-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b38200" />
          <stop offset="100%" stopColor="#6e5000" />
        </linearGradient>
      </defs>

      <g filter={`url(#pc-filter-${size})`}>
        {/* Blue 3D Extruded Top Facets */}
        <path d="M 160 135 L 185 110 L 330 110 Q 380 110 395 140 L 365 155 Q 350 135 320 135 L 160 135 Z" fill={`url(#blueTop-${size})`} />
        
        {/* Blue Left Stem Back Side Depth */}
        <path d="M 160 135 L 160 345 L 190 325 L 190 135 Z" fill={`url(#blueSide-${size})`} />
        
        {/* Blue Main Left Stem Front Face */}
        <rect x="185" y="190" width="75" height="155" rx="3" fill={`url(#blueFront-${size})`} />
        <path d="M 160 205 L 185 190 L 185 345 L 160 355 Z" fill={`url(#blueSide-${size})`} />

        {/* Blue Top Looping Bar */}
        <path d="M 180 130 L 330 130 Q 375 130 375 175 Q 375 220 330 220 L 285 220 L 285 250 L 335 250 Q 410 250 410 175 Q 410 95 330 95 L 180 95 Z" fill={`url(#blueFront-${size})`} />
        <path d="M 155 130 L 180 95 L 330 95 Q 410 95 410 175 L 385 190 Q 380 120 320 120 L 155 120 Z" fill={`url(#blueTop-${size})`} />

        {/* Embossed Yellow 'PRAYER CLOUD' Lettering along upper blue beam */}
        <text
          x="210"
          y="118"
          fill="#ffd200"
          fontFamily="'Montserrat', 'Arial Black', sans-serif"
          fontSize="21"
          fontWeight="900"
          letterSpacing="2.5"
          transform="rotate(2 210 118)"
        >
          PRAYER CLOUD
        </text>

        {/* 3D Yellow Interlocking C Letter */}
        {/* C Top Horizontal Bar */}
        <path d="M 270 195 L 405 195 L 405 265 L 340 265 L 340 230 L 270 230 Z" fill={`url(#yellowFront-${size})`} />
        <path d="M 255 205 L 270 195 L 405 195 L 390 205 Z" fill={`url(#yellowTop-${size})`} />

        {/* C Main Arch Interlocking Through P */}
        <path d="M 270 195 Q 235 195 235 280 Q 235 375 345 375 L 405 375 L 405 295 L 345 295 Q 305 295 305 280 Q 305 265 340 265 L 340 195 Z" fill={`url(#yellowFront-${size})`} />
        
        {/* C Outer Side Extrusion Depth */}
        <path d="M 235 280 L 220 295 Q 220 395 325 395 L 405 395 L 405 375 L 340 375 Q 235 375 235 280 Z" fill={`url(#yellowSide-${size})`} />
        
        {/* C Cutouts & Lip Depth */}
        <path d="M 345 295 L 360 280 L 405 280 L 405 295 Z" fill={`url(#yellowSide-${size})`} />
        <path d="M 340 375 L 320 395 L 405 395 L 405 375 Z" fill={`url(#yellowSide-${size})`} />

        {/* Blue Lower Arm interlocking back */}
        <path d="M 285 245 L 335 245 Q 365 245 365 265 L 340 265 Q 340 255 315 255 L 285 255 Z" fill={`url(#blueFront-${size})`} />
      </g>
    </svg>
  );

  if (variant === 'emblem' && !showText) {
    return svgContent;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {svgContent}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className={`font-black font-display tracking-tight text-slate-900 dark:text-white ${currentSize.text}`}>
              PRAYER
            </span>
            <span className={`font-black font-display tracking-tight text-amber-500 ${currentSize.text}`}>
              CLOUD
            </span>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
            10/40 Frontier Intercession
          </span>
        </div>
      )}
    </div>
  );
};
