import React from 'react';

interface HidayahCalligraphyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withGlow?: boolean;
}

export const HidayahCalligraphyLogo: React.FC<HidayahCalligraphyLogoProps> = ({
  size = 'md',
  className = '',
  withGlow = true,
}) => {
  const sizeMap = {
    sm: { width: 40, height: 40 },
    md: { width: 52, height: 52 },
    lg: { width: 78, height: 78 },
    xl: { width: 104, height: 104 },
  };

  const { width, height } = sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer select-none group/logo ${className}`}
      style={{ width, height }}
      aria-label="Hidayah Realistic 3D Islamic Medallion Logo"
    >
      {/* Dynamic multi-layered ambient celestial aura */}
      {withGlow && (
        <>
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 via-yellow-400/40 to-cyan-400/30 blur-lg pointer-events-none scale-110 group-hover/logo:scale-135 group-hover/logo:blur-xl group-hover/logo:from-amber-400/50 group-hover/logo:via-yellow-300/60 group-hover/logo:to-cyan-300/50 transition-all duration-500" />
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500/20 via-amber-400/25 to-blue-500/20 blur-md pointer-events-none opacity-70 group-hover/logo:opacity-100 transition-opacity duration-500" />
        </>
      )}

      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_16px_rgba(245,158,11,0.5)]"
      >
        <defs>
          {/* Photorealistic 24K Royal Gilded Gold Gradients */}
          <linearGradient id="goldOuterRing" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="12%" stopColor="#fef08a" />
            <stop offset="28%" stopColor="#f59e0b" />
            <stop offset="48%" stopColor="#fbbf24" />
            <stop offset="68%" stopColor="#b45309" />
            <stop offset="85%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <linearGradient id="goldInnerRim" x1="90%" y1="100%" x2="10%" y2="0%">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="25%" stopColor="#b45309" />
            <stop offset="50%" stopColor="#fef08a" />
            <stop offset="75%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Deep Royal Lapis Lazuli & Celestial Sapphire Medallion Background */}
          <radialGradient id="celestialLapisBg" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#1e3a68" />
            <stop offset="35%" stopColor="#122549" />
            <stop offset="70%" stopColor="#08142b" />
            <stop offset="100%" stopColor="#030814" />
          </radialGradient>

          {/* 3D Realistic Curved Crescent Metallic Gradient */}
          <linearGradient id="crescent3D" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="15%" stopColor="#fef9c3" />
            <stop offset="35%" stopColor="#facc15" />
            <stop offset="65%" stopColor="#d97706" />
            <stop offset="88%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* High-glint Star Jewel Radiant Flare */}
          <radialGradient id="starJewelGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Mosque Dome Silhouette Gradient */}
          <linearGradient id="mosqueDomeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#0284c7" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.05" />
          </linearGradient>

          {/* Realistic 3D Relief Shadow Filters */}
          <filter id="realistic3dShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
          </filter>

          <filter id="embossHighlight" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="-1" stdDeviation="0.8" floodColor="#ffffff" floodOpacity="0.65" />
          </filter>
        </defs>

        {/* 1. Outer 3D Beveled Ring - Heavy Gold Coin / Medallion Rim */}
        <circle cx="60" cy="60" r="57" fill="url(#goldOuterRing)" filter="url(#realistic3dShadow)" />

        {/* Outer Milled / Coin-edge Knurling Teeth (Realistic fine notches) */}
        {[...Array(32)].map((_, i) => {
          const angle = (i * 360) / 32;
          const rad = (angle * Math.PI) / 180;
          const x1 = 60 + Math.cos(rad) * 54.5;
          const y1 = 60 + Math.sin(rad) * 54.5;
          const x2 = 60 + Math.cos(rad) * 57;
          const y2 = 60 + Math.sin(rad) * 57;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#78350f"
              strokeWidth="1.2"
              opacity="0.75"
            />
          );
        })}

        {/* 2. Middle Recessed Gold Step */}
        <circle cx="60" cy="60" r="52" fill="url(#goldInnerRim)" />
        <circle cx="60" cy="60" r="50.5" stroke="#fffbeb" strokeWidth="0.8" opacity="0.9" />

        {/* 3. Deep Celestial Lapis Lazuli Core Medallion */}
        <circle cx="60" cy="60" r="49" fill="url(#celestialLapisBg)" />

        {/* Delicate Sacred Geometry 8-Pointed Star Lattice in background (Subtle watermark) */}
        <g opacity="0.18" stroke="#fef08a" strokeWidth="0.75">
          <rect x="30" y="30" width="60" height="60" rx="3" fill="none" />
          <rect x="30" y="30" width="60" height="60" rx="3" fill="none" transform="rotate(45 60 60)" />
          <circle cx="60" cy="60" r="28" fill="none" strokeDasharray="2 3" />
        </g>

        {/* Gilded Mosque Silhouette in Background */}
        <g opacity="0.45">
          {/* Mosque Central Dome */}
          <path
            d="M 40 76
               C 40 63, 48 57, 60 52
               C 72 57, 80 63, 80 76 Z"
            fill="url(#mosqueDomeGrad)"
            stroke="#fef08a"
            strokeWidth="0.6"
          />
          {/* Dome Finial Spire */}
          <line x1="60" y1="52" x2="60" y2="44" stroke="#fef08a" strokeWidth="1" strokeLinecap="round" />
          <circle cx="60" cy="44" r="1.2" fill="#fef08a" />

          {/* Left Minaret */}
          <path d="M 28 78 L 28 58 L 31 54 L 34 58 L 34 78 Z" fill="#0f2648" stroke="#fef08a" strokeWidth="0.5" />
          <line x1="31" y1="54" x2="31" y2="49" stroke="#fef08a" strokeWidth="0.8" />
          <circle cx="31" cy="49" r="0.8" fill="#fef08a" />

          {/* Right Minaret */}
          <path d="M 86 78 L 86 58 L 89 54 L 92 58 L 92 78 Z" fill="#0f2648" stroke="#fef08a" strokeWidth="0.5" />
          <line x1="89" y1="54" x2="89" y2="49" stroke="#fef08a" strokeWidth="0.8" />
          <circle cx="89" cy="49" r="0.8" fill="#fef08a" />
        </g>

        {/* 4. Realistic 3D Gilded Islamic Crescent (Hilal) with Specular Bevel */}
        <g filter="url(#realistic3dShadow)">
          {/* Outer sweeping crescent body */}
          <path
            d="M 68 22
               C 36 24, 20 48, 26 76
               C 31 96, 56 102, 78 96
               C 86 94, 92 88, 95 84
               C 88 88, 77 89, 68 87
               C 48 83, 37 68, 41 49
               C 44 34, 55 25, 68 22 Z"
            fill="url(#crescent3D)"
          />

          {/* Top highlight ridge along outer curve */}
          <path
            d="M 66 23
               C 38 26, 23 48, 28 75
               C 32 93, 54 100, 75 95"
            stroke="#ffffff"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.9"
            fill="none"
          />

          {/* Inner ridge specular reflection */}
          <path
            d="M 64 26
               C 53 30, 44 40, 42 53
               C 40 68, 50 81, 66 85"
            stroke="#fef08a"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.75"
            fill="none"
          />
        </g>

        {/* 5. Realistic 3D Radiant 8-Pointed Islamic Star Jewel (Rub el Hizb) */}
        <g filter="url(#realistic3dShadow)">
          {/* Radiant Flare Behind Star */}
          <circle cx="78" cy="42" r="14" fill="url(#starJewelGlow)" />

          {/* 8-Pointed Star Solid Beveled Shape */}
          <path
            d="M 78 28
               L 81.5 35.5
               L 89 33
               L 85.5 40
               L 92 44.5
               L 84.5 47
               L 83 55
               L 78 49
               L 73 55
               L 71.5 47
               L 64 44.5
               L 70.5 40
               L 67 33
               L 74.5 35.5 Z"
            fill="url(#crescent3D)"
            stroke="#ffffff"
            strokeWidth="0.7"
          />

          {/* Star Central Facet Diamond Core */}
          <polygon
            points="78,36 82.5,42 78,48 73.5,42"
            fill="#ffffff"
            opacity="0.95"
          />
          <circle cx="78" cy="42" r="2.2" fill="#fffbeb" />

          {/* Subtle Cross Shimmer */}
          <line x1="78" y1="30" x2="78" y2="54" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
          <line x1="66" y1="42" x2="90" y2="42" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" opacity="0.85" />
        </g>

        {/* 6. Handcrafted Classical Thuluth Arabic Calligraphy for "هداية" (Hidayah) */}
        <g filter="url(#realistic3dShadow)">
          {/* Main Flourish Baseline & Ha (هـ) */}
          <path
            d="M 44 76
               C 42 66, 49 59, 57 62
               C 60 63, 62 66, 61 69
               C 59 72, 54 73, 51 70
               C 49 68, 50 65, 53 66
               C 55 67, 55 69, 53 70
               C 51 71, 50 70, 51 68
               C 52 66, 55 66, 56 68
               C 57 71, 53 76, 46 78
               C 50 79, 61 79, 72 78 Z"
            fill="url(#crescent3D)"
            stroke="#fef08a"
            strokeWidth="0.4"
          />

          {/* Dal (د) connecting smoothly */}
          <path
            d="M 64 78
               C 67 73, 71 66, 73 63
               C 74 61, 76 62, 75 63
               C 73 67, 70 74, 75 76
               C 77 77, 81 77, 83 76
               C 83 78, 80 79, 74 79
               C 69 79, 66 79, 64 78 Z"
            fill="url(#crescent3D)"
            stroke="#fef08a"
            strokeWidth="0.4"
          />

          {/* Vertical Ascender Alif (ا) with graceful serif */}
          <path
            d="M 79 77
               L 80 48
               C 80 44, 77 43, 76 42
               C 78 41, 82 41, 83 43
               C 83 45, 82.5 52, 82 77 Z"
            fill="url(#crescent3D)"
            stroke="#fef08a"
            strokeWidth="0.4"
          />

          {/* Ya and Ta Marbutah (ـيـة) flourishing upwards */}
          <path
            d="M 81 78
               C 85 78, 90 77, 93 74
               C 96 71, 97 67, 95 64
               C 93 61, 89 62, 88 64
               C 87 66, 90 69, 93 67
               C 94 65, 93 64, 91 64
               C 89 64, 89 65, 91 66
               C 94 62, 91 56, 89 53
               C 88 51, 90 50, 91 51
               C 94 54, 98 62, 98 68
               C 98 75, 92 79, 85 79 Z"
            fill="url(#crescent3D)"
            stroke="#fef08a"
            strokeWidth="0.4"
          />

          {/* Nuqta (Dots) and Harakat Diacritics in 3D Gold */}
          {/* Kasrah under Ha */}
          <line x1="46" y1="83" x2="52" y2="87" stroke="url(#crescent3D)" strokeWidth="1.6" strokeLinecap="round" />
          {/* Two dots of Ya (ـيـ) */}
          <circle cx="84" cy="84" r="1.5" fill="url(#crescent3D)" stroke="#ffffff" strokeWidth="0.3" />
          <circle cx="88" cy="84" r="1.5" fill="url(#crescent3D)" stroke="#ffffff" strokeWidth="0.3" />
          {/* Two dots of Ta Marbutah (ـة) */}
          <circle cx="88" cy="46" r="1.3" fill="url(#crescent3D)" stroke="#ffffff" strokeWidth="0.3" />
          <circle cx="92" cy="47" r="1.3" fill="url(#crescent3D)" stroke="#ffffff" strokeWidth="0.3" />
        </g>

        {/* Specular Highlight Sheen Arc across the top-left rim */}
        <path
          d="M 24 38 C 34 22, 50 14, 68 14"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.65"
          fill="none"
        />
        <circle cx="36" cy="24" r="1.8" fill="#ffffff" opacity="0.9" />
      </svg>
    </div>
  );
};
