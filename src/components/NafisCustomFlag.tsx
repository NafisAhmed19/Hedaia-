import React from 'react';

interface NafisCustomFlagProps {
  className?: string;
}

export const NafisCustomFlag: React.FC<NafisCustomFlagProps> = ({ className = '' }) => {
  return (
    <span
      className={`inline-flex items-center justify-center align-middle hover:scale-110 transition-transform ${className}`}
      title="Nafis Ahmed Custom Geometric Flag Emblem (10% enhanced size for optimal clarity)"
      aria-label="Creator Custom Flag (Golden field with 5-8-11 concentric Yellow-Orange-Red rings and diagonal Green Semicircle)"
    >
      <svg
        viewBox="0 0 38 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[26px] h-[18px] sm:w-[28px] sm:h-[19px] rounded-[3px] shadow-[0_1px_4px_rgba(0,0,0,0.5)] overflow-hidden select-none border border-amber-300/60"
      >
        <defs>
          {/* Rich golden metallic flag background */}
          <linearGradient id="flagGoldRich" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="90%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* Deep vibrant Red gradient */}
          <linearGradient id="flagRedRich" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="60%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>

          {/* Saturated Orange gradient */}
          <linearGradient id="flagOrangeRich" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="60%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>

          {/* Radiant Yellow gradient */}
          <linearGradient id="flagYellowRich" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="60%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          {/* Pure Islamic Emerald Green gradient */}
          <linearGradient id="flagGreenRich" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="50%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#14532d" />
          </linearGradient>

          {/* Crisp shading filter */}
          <filter id="ringShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="0.6" stdDeviation="0.5" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* 1. Golden Flag Background */}
        <rect
          width="38"
          height="26"
          rx="3"
          fill="url(#flagGoldRich)"
          stroke="#fffbeb"
          strokeWidth="0.8"
        />

        {/* 2. Green Semicircle (সবুজ রঙের অর্ধবৃত্ত) alongside the outer red ring along the bottom-right diagonal */}
        <path
          d="M 21.0 23.6
             A 4.8 4.8 0 0 0 27.4 17.2
             Z"
          fill="url(#flagGreenRich)"
          stroke="#052e16"
          strokeWidth="0.5"
          filter="url(#ringShadow)"
        />

        {/* 3. Three Concentric Rings from exact same center (16, 13) */}
        {/* Outermost: Red Circle (radius = 11 units). Creates the 3-unit red circular roadway */}
        <circle
          cx="16"
          cy="13"
          r="11"
          fill="url(#flagRedRich)"
          stroke="#7f1d1d"
          strokeWidth="0.5"
          filter="url(#ringShadow)"
        />

        {/* Middle: Orange Circle (radius = 8 units). Difference between 5 and 8 is 3 units of orange circular roadway */}
        <circle
          cx="16"
          cy="13"
          r="8"
          fill="url(#flagOrangeRich)"
          stroke="#9a3412"
          strokeWidth="0.5"
        />

        {/* Innermost: Yellow Circle (radius = 5 units). The 5-unit center circle */}
        <circle
          cx="16"
          cy="13"
          r="5"
          fill="url(#flagYellowRich)"
          stroke="#a16207"
          strokeWidth="0.5"
        />

        {/* Specular starlight glint for realism */}
        <circle cx="15.2" cy="12.2" r="1.1" fill="#ffffff" opacity="0.9" />
      </svg>
    </span>
  );
};
