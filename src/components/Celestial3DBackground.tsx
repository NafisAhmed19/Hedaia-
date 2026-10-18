import React, { useEffect, useRef, useState } from 'react';

interface Star {
  x: number;
  y: number;
  z: number; // depth: 1 (near) to 3 (far)
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number; // in radians
  alpha: number;
  maxAlpha: number;
  decay: number;
  width: number;
  sparkleColor: string;
}

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  size: number;
  color: string;
}

export const Celestial3DBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    // Initialize 3D Stars
    const starCount = Math.min(180, Math.floor((width * height) / 8000));
    let stars: Star[] = [];

    const initStars = () => {
      stars = [];
      const starColors = ['#ffffff', '#bae6fd', '#7dd3fc', '#fef08a', '#e0f2fe', '#a7f3d0', '#fed7aa', '#ddd6fe'];
      for (let i = 0; i < starCount; i++) {
        const z = Math.random() * 2 + 1; // 1 to 3
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          size: (3.5 - z) * (Math.random() * 1.3 + 0.8),
          baseAlpha: Math.random() * 0.5 + 0.45,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    };

    initStars();

    // Shooting stars and stardust sparkles array
    let shootingStars: ShootingStar[] = [];
    let sparkles: SparkleParticle[] = [];
    let lastSpawnTime = 0;
    let lastScroll = window.scrollY;

    const spawnShootingStar = (fromScroll = false) => {
      const angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1); // ~45 degrees diagonal
      const startX = Math.random() * width * 0.9;
      const startY = Math.random() * (height * 0.45);
      const isGrandMeteor = Math.random() < 0.25;
      const meteorColors = ['#fef08a', '#38bdf8', '#34d399', '#c084fc', '#fed7aa'];
      const chosenColor = meteorColors[Math.floor(Math.random() * meteorColors.length)];

      shootingStars.push({
        x: startX,
        y: startY,
        length: (Math.random() * 120 + 90) * (isGrandMeteor ? 1.4 : 1),
        speed: (Math.random() * 8 + 12) * (fromScroll ? 1.3 : 1),
        angle,
        alpha: 1,
        maxAlpha: 1.0,
        decay: Math.random() * 0.012 + 0.009,
        width: isGrandMeteor ? 2.8 : Math.random() * 1.6 + 1.2,
        sparkleColor: chosenColor,
      });
    };

    let tick = 0;

    const render = (time: number) => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      const currentScroll = window.scrollY;
      const scrollDelta = Math.abs(currentScroll - lastScroll);
      lastScroll = currentScroll;

      // Dynamic shooting star trigger based on scroll or time
      if (time - lastSpawnTime > 2200 || (scrollDelta > 20 && Math.random() < 0.3)) {
        spawnShootingStar(scrollDelta > 20);
        lastSpawnTime = time;
      }

      // Draw Parallax 3D Stars
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.twinklePhase += star.twinkleSpeed;
        const currentAlpha = Math.max(
          0.1,
          star.baseAlpha + Math.sin(star.twinklePhase) * 0.35
        );

        // 3D Parallax Y-shift based on Z-depth
        const parallaxFactor = (4 - star.z) * 0.15;
        const starY = (star.y - currentScroll * parallaxFactor) % height;
        const normalizedY = starY < 0 ? height + starY : starY;

        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(star.x, normalizedY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow for foreground stars
        if (star.z < 1.6 && star.size > 1.8) {
          ctx.fillStyle = '#38bdf8';
          ctx.globalAlpha = currentAlpha * 0.25;
          ctx.beginPath();
          ctx.arc(star.x, normalizedY, star.size * 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Update & Draw Shooting Stars (তারা খসে যাওয়া) with Dazzling Sparkles
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.alpha -= ss.decay;

        if (ss.alpha <= 0 || ss.x > width + 200 || ss.y > height + 200) {
          shootingStars.splice(i, 1);
          continue;
        }

        // Spawn glittering stardust particles along the flight path
        if (Math.random() < 0.65) {
          sparkles.push({
            x: ss.x + (Math.random() * 6 - 3),
            y: ss.y + (Math.random() * 6 - 3),
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 1.2 + 0.5,
            alpha: ss.alpha * 0.9,
            decay: Math.random() * 0.025 + 0.02,
            size: Math.random() * 2 + 1,
            color: Math.random() < 0.5 ? '#ffffff' : ss.sparkleColor,
          });
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        // Gradient for shooting star streak
        const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        gradient.addColorStop(0, 'rgba(56, 189, 248, 0)');
        gradient.addColorStop(0.4, `rgba(56, 189, 248, ${ss.alpha * 0.4})`);
        gradient.addColorStop(0.8, `rgba(186, 230, 253, ${ss.alpha * 0.85})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = ss.width;
        ctx.lineCap = 'round';
        ctx.globalAlpha = ss.alpha;

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();

        // 1. Radiant luminous glow halo around the head
        const haloGrad = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, ss.width * 7);
        haloGrad.addColorStop(0, `rgba(255, 255, 255, ${ss.alpha})`);
        haloGrad.addColorStop(0.4, `rgba(56, 189, 248, ${ss.alpha * 0.7})`);
        haloGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.width * 7, 0, Math.PI * 2);
        ctx.fill();

        // 2. Sparkling Cross Starburst Flares (চমকানো আলোর রেখা)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        const flareLen = ss.width * 5.5;

        // Horizontal flare
        ctx.beginPath();
        ctx.moveTo(ss.x - flareLen, ss.y);
        ctx.lineTo(ss.x + flareLen, ss.y);
        ctx.stroke();

        // Vertical flare
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y - flareLen);
        ctx.lineTo(ss.x, ss.y + flareLen);
        ctx.stroke();

        // 3. Central blazing white spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, ss.width * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update & Draw Glittering Trailing Stardust Embers
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sp = sparkles[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.alpha -= sp.decay;

        if (sp.alpha <= 0) {
          sparkles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 3D Scroll transformations for Moon and Atmosphere
  const moonTranslateY = scrollY * 0.22;
  const moonTranslateX = Math.sin(scrollY * 0.003) * 25;
  const moonRotate = (scrollY * 0.04) % 360;
  const moonScale = Math.max(0.85, 1 - scrollY * 0.0003);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Dynamic Luminous Multi-Color Ambient Auroras for Spiritual Depth & Rich Dynamics */}
      <div className="absolute -top-24 left-1/5 w-[650px] h-[650px] rounded-full bg-cyan-400/22 blur-[130px] pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] rounded-full bg-amber-400/20 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[550px] h-[550px] rounded-full bg-emerald-500/18 blur-[140px] pointer-events-none" />
      <div className="absolute top-2/3 -right-24 w-[600px] h-[600px] rounded-full bg-indigo-500/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[550px] h-[550px] rounded-full bg-purple-500/18 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-[500px] h-[500px] rounded-full bg-rose-500/16 blur-[130px] pointer-events-none" />

      {/* Canvas for 3D Stars & Dynamic Shooting Stars */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Floating 3D Celestial Crescent Moon that reacts to scroll */}
      <div
        className="absolute top-10 right-6 sm:right-16 lg:right-28 transition-transform ease-out duration-100 will-change-transform opacity-95 select-none"
        style={{
          transform: `translate3d(${moonTranslateX}px, ${moonTranslateY}px, 0) rotate(${moonRotate * 0.3}deg) scale(${moonScale})`,
        }}
      >
        {/* Crescent Moon Visual with 3D Depth Glow */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44">
          {/* Luminous cyan & celestial moonlight halos */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-3xl transform scale-160 animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-sky-300/20 blur-xl" />

          {/* SVG Crescent Moon with subtle craters & gradient */}
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-[0_0_30px_rgba(56,189,248,0.6)]">
            <defs>
              <linearGradient id="celestialMoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#e0f2fe" />
                <stop offset="70%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              <radialGradient id="moonGlowRadial" cx="65%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.5" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Hilal (Crescent Moon) */}
            <path
              d="M 50 8
                 C 74 8, 92 26, 92 50
                 C 92 74, 74 92, 50 92
                 C 66 84, 76 68, 76 50
                 C 76 32, 66 16, 50 8 Z"
              fill="url(#celestialMoonGrad)"
            />

            {/* Inner highlight rim */}
            <path
              d="M 54 14
                 C 70 20, 80 34, 80 50
                 C 80 66, 70 80, 54 86"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.9"
            />

            {/* Subtle lunar craters */}
            <circle cx="72" cy="40" r="2.5" fill="#0369a1" opacity="0.3" />
            <circle cx="68" cy="55" r="3.2" fill="#0369a1" opacity="0.25" />
            <circle cx="75" cy="63" r="1.8" fill="#0369a1" opacity="0.3" />
          </svg>

          {/* Golden/White Sparkling Star near the Crescent */}
          <div
            className="absolute top-3 left-4 transform -translate-x-1"
            style={{
              animation: 'spin 18s linear infinite',
            }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-200 fill-amber-100 drop-shadow-[0_0_10px_rgba(253,224,71,0.9)]">
              <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Mosque Domes & Minarets Parallax Silhouette at the bottom */}
      <div
        className="absolute bottom-0 inset-x-0 h-44 opacity-25 transition-transform ease-out duration-100 will-change-transform select-none"
        style={{
          transform: `translate3d(0, ${Math.min(40, scrollY * 0.05)}px, 0)`,
        }}
      >
        <svg
          viewBox="0 0 1440 240"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-full text-[#081226] fill-current"
        >
          {/* Subtle multi-dome skyline */}
          <path d="M0,240 L0,180 Q60,180 80,140 Q100,180 160,180 L220,180 L220,90 Q225,80 230,90 L230,180 L380,180 Q440,130 500,180 L620,180 Q670,110 720,180 L840,180 L840,70 Q845,60 850,70 L850,180 L960,180 Q1020,120 1080,180 L1200,180 Q1240,150 1280,180 L1360,180 L1360,95 Q1365,85 1370,95 L1370,180 L1440,180 L1440,240 Z" />
        </svg>
      </div>

      {/* Atmospheric depth fog */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b1528]/15 to-[#0b1528]/45" />
    </div>
  );
};
