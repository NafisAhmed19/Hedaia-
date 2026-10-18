import React from 'react';

interface IslamicFinialLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withGlow?: boolean;
}

export const IslamicFinialLogo: React.FC<IslamicFinialLogoProps> = ({
  size = 'md',
  className = '',
  withGlow = true,
}) => {
  const sizeMap = {
    sm: { width: 34, height: 48 },
    md: { width: 50, height: 70 },
    lg: { width: 72, height: 100 },
    xl: { width: 100, height: 138 },
  };

  const { width, height } = sizeMap[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 select-none ${className}`}
      style={{ width, height }}
      aria-label="Realistic 3D Islamic Dome Finial & Crescent Spire"
    >
      {/* Ambient warm celestial golden glow */}
      {withGlow && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-amber-500/15 via-yellow-400/30 to-cyan-400/25 blur-lg pointer-events-none transform -translate-y-1 scale-125" />
      )}

      <svg
        viewBox="0 0 100 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_16px_rgba(245,158,11,0.45)]"
      >
        <defs>
          {/* Photorealistic 24K Royal Gilded Gold Gradients */}
          <linearGradient id="finial3DGold" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="18%" stopColor="#fef08a" />
            <stop offset="42%" stopColor="#f59e0b" />
            <stop offset="72%" stopColor="#d97706" />
            <stop offset="90%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Deep Mosque Dome Base */}
          <linearGradient id="domeBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e3a68" />
            <stop offset="50%" stopColor="#0d1f3b" />
            <stop offset="100%" stopColor="#040b17" />
          </linearGradient>

          {/* Star radiant sparkle radial */}
          <radialGradient id="starShineRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* 3D Depth Shadow */}
          <filter id="finial3dShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.75" />
          </filter>
        </defs>

        {/* 1. Miniature Mosque Dome Base with 3D Depth */}
        <path
          d="M 12 136
             C 12 120, 30 112, 50 110
             C 70 112, 88 120, 88 136 Z"
          fill="url(#domeBaseGrad)"
          stroke="url(#finial3DGold)"
          strokeWidth="1.6"
          filter="url(#finial3dShadow)"
        />

        {/* Dome decorative golden rim */}
        <ellipse cx="50" cy="110" rx="14" ry="4" fill="url(#finial3DGold)" />
        <ellipse cx="50" cy="109.5" rx="9" ry="2.2" fill="#ffffff" opacity="0.8" />

        {/* 2. Main Spire Rod */}
        <line
          x1="50"
          y1="110"
          x2="50"
          y2="38"
          stroke="url(#finial3DGold)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Specular highlight along rod */}
        <line
          x1="48.8"
          y1="108"
          x2="48.8"
          y2="40"
          stroke="#ffffff"
          strokeWidth="1.3"
          opacity="0.85"
          strokeLinecap="round"
        />

        {/* 3. Three Traditional Decreasing 3D Golden Spheres */}
        {/* Sphere 1 (Bottom largest) */}
        <circle cx="50" cy="100" r="6" fill="url(#finial3DGold)" filter="url(#finial3dShadow)" />
        <circle cx="47.8" cy="97.8" r="2" fill="#ffffff" opacity="0.9" />

        {/* Ribbed ring collar */}
        <ellipse cx="50" cy="90" rx="8" ry="2.5" fill="url(#finial3DGold)" stroke="#fffbeb" strokeWidth="0.8" />

        {/* Sphere 2 (Middle) */}
        <circle cx="50" cy="80" r="5" fill="url(#finial3DGold)" filter="url(#finial3dShadow)" />
        <circle cx="48" cy="78" r="1.6" fill="#ffffff" opacity="0.9" />

        {/* Sphere 3 (Top smallest beneath crescent) */}
        <circle cx="50" cy="64" r="4" fill="url(#finial3DGold)" filter="url(#finial3dShadow)" />
        <circle cx="48.5" cy="62.5" r="1.3" fill="#ffffff" opacity="0.9" />

        {/* Crescent collar dish */}
        <ellipse cx="50" cy="55" rx="7" ry="2" fill="url(#finial3DGold)" />

        {/* 4. Realistic Curved Islamic Crescent (Hilal) */}
        <path
          d="M 50 55
             C 28 53, 14 38, 18 16
             C 19.5 13, 22.5 13.5, 23.5 16.5
             C 27.5 32, 38 42, 50 42
             C 62 42, 72.5 32, 76.5 16.5
             C 77.5 13.5, 80.5 13, 82 16
             C 86 38, 72 53, 50 55 Z"
          fill="url(#finial3DGold)"
          stroke="#fffbeb"
          strokeWidth="1.2"
          filter="url(#finial3dShadow)"
        />

        {/* Specular Inner Curve Highlight */}
        <path
          d="M 26 19
             C 30 31, 39 39.5, 50 40
             C 61 39.5, 70 31, 74 19"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* 5. Center Apex Rod into the crescent bowl */}
        <line
          x1="50"
          y1="42"
          x2="50"
          y2="20"
          stroke="url(#finial3DGold)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <circle cx="50" cy="20" r="2.2" fill="url(#finial3DGold)" />

        {/* 6. Radiant 8-Pointed Star Jewel */}
        <circle cx="50" cy="14" r="13" fill="url(#starShineRadial)" opacity="0.75" />

        <path
          d="M 50 2
             L 53.5 9.5
             L 61 7
             L 57 14
             L 63 18.5
             L 56 20
             L 54 28
             L 50 21
             L 46 28
             L 44 20
             L 37 18.5
             L 43 14
             L 39 7
             L 46.5 9.5 Z"
          fill="url(#finial3DGold)"
          stroke="#ffffff"
          strokeWidth="0.8"
          filter="url(#finial3dShadow)"
        />

        {/* Star Center Diamond Core */}
        <circle cx="50" cy="14" r="2.5" fill="#ffffff" />
        <line x1="50" y1="5" x2="50" y2="23" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.95" />
        <line x1="41" y1="14" x2="59" y2="14" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.95" />
      </svg>
    </div>
  );
};
