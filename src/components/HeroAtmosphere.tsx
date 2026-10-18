import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { UserProfile, PrayerTimeItem } from '../types';
import { formatNum, toBengaliNumber, BANGLADESH_CITIES, getApproximateHijriDate } from '../utils/islamicPrayerCalc';
import { HidayahCalligraphyLogo } from './HidayahCalligraphyLogo';
import { IslamicFinialLogo } from './IslamicFinialLogo';
import { getTranslation, Language } from '../utils/translations';

interface HeroAtmosphereProps {
  profile: UserProfile;
  prayerTimes: PrayerTimeItem[];
  useBnDigits: boolean;
  language: Language;
  onOpenAuth: () => void;
  onOpenPlanner: () => void;
}

export const HeroAtmosphere: React.FC<HeroAtmosphereProps> = ({
  profile,
  prayerTimes,
  useBnDigits,
  language,
  onOpenAuth,
  onOpenPlanner,
}) => {
  const t = getTranslation(language);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdownString, setCountdownString] = useState('');
  const [nextPrayer, setNextPrayer] = useState<PrayerTimeItem | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Find next prayer
      const nowTime = now.getTime();
      let found: PrayerTimeItem | null = null;

      for (const pt of prayerTimes) {
        if (pt.dateObj.getTime() > nowTime) {
          found = pt;
          break;
        }
      }

      // If past Isha today, next is Fajr tomorrow
      if (!found && prayerTimes.length > 0) {
        const tomorrowFajr = { ...prayerTimes[0] };
        const tomorrowDate = new Date(tomorrowFajr.dateObj);
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        tomorrowFajr.dateObj = tomorrowDate;
        found = tomorrowFajr;
      }

      setNextPrayer(found);

      if (found) {
        const diffMs = Math.max(0, found.dateObj.getTime() - nowTime);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
        const rawCountdown = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
        setCountdownString(useBnDigits ? toBengaliNumber(rawCountdown) : rawCountdown);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [prayerTimes, useBnDigits]);

  const currentCityObj = BANGLADESH_CITIES[profile.selectedCity] || BANGLADESH_CITIES.dhaka;
  const cityName = language === 'bn' ? currentCityObj.nameBn : currentCityObj.nameEn;
  const hijriDate = getApproximateHijriDate(currentTime, language === 'bn');

  const gregorianDate = currentTime.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#0c152a] via-[#091122] to-[#050914] text-white p-6 sm:p-8 lg:p-10 shadow-2xl">
      {/* Background Decorative Islamic Geometry & Soft Ambient Lighting */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top Atmosphere Bar: Bismillah, Hijri & Gregorian Dates */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-cyan-900/40 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <span className="font-amiri text-lg text-amber-300">
              {hijriDate}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-mono-tabular">
              {gregorianDate}
            </span>
          </div>

          <div className="text-right hidden sm:block">
            <div className="font-amiri text-sm text-cyan-200">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <div className="text-[11px] text-slate-400">
              {language === 'bn'
                ? '"পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে শুরু করছি"'
                : '"In the name of Allah, the Most Gracious, the Most Merciful"'}
            </div>
          </div>
        </div>

        {/* Centered Majestic Hidayah Arabic Calligraphy & Brand Logo Centerpiece */}
        <div className="mt-6 flex flex-col items-center justify-center text-center p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#14264e]/95 via-[#0d1d3d]/90 to-[#071329]/95 border border-cyan-400/50 shadow-[0_10px_40px_rgba(6,182,212,0.28)] backdrop-blur-md relative overflow-hidden group transition-all duration-300 hover:border-amber-400/70 hover:shadow-[0_0_50px_rgba(245,158,11,0.35)]">
          {/* Multi-spectral ambient backlight behind logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-r from-amber-500/30 via-emerald-400/20 to-cyan-400/30 blur-3xl pointer-events-none group-hover:scale-135 transition-transform duration-700" />

          {/* Interactive Realistic 3D Medallion Logo & Gilded Spire Finials */}
          <div className="flex items-center justify-center gap-4 relative z-10 mb-2">
            <IslamicFinialLogo size="md" withGlow={true} className="hidden sm:inline-flex opacity-90 hover:opacity-100 hover:scale-110 transition-all" />
            <div className="p-1.5 rounded-full ring-2 ring-amber-400/50 hover:ring-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.35)] bg-slate-950/60 transition-all">
              <HidayahCalligraphyLogo size="xl" withGlow={true} />
            </div>
            <IslamicFinialLogo size="md" withGlow={true} className="hidden sm:inline-flex opacity-90 hover:opacity-100 hover:scale-110 transition-all" />
          </div>

          <div className="relative z-10 space-y-2 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-500/50 text-[11px] font-semibold text-cyan-300 shadow-sm">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                <span>{t.heroBadge}</span>
              </span>
              <span className="text-[11px] text-amber-300/90 font-mono font-medium hidden xs:inline-block">
                {language === 'bn' ? 'সালাত ও কাজা ট্র্যাকার' : 'Salah & Qaza Tracker'}
              </span>
            </div>

            {/* Handcrafted Arabic Calligraphy for Hidayah with Diacritics */}
            <div className="flex items-center justify-center gap-2">
              <span className="font-amiri text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 tracking-wider drop-shadow-[0_2px_12px_rgba(245,158,11,0.4)]">
                هِــدَايَـــة
              </span>
              <span className="text-slate-500 text-lg">·</span>
              <span className="font-cinzel text-sm sm:text-base font-bold text-slate-200 tracking-widest uppercase">
                HIDAYAH · হিদায়াহ
              </span>
            </div>

            {/* Quranic Du'a Calligraphy for Salah */}
            <p className="font-amiri text-sm sm:text-base text-cyan-200/95 tracking-wide drop-shadow-sm font-medium">
              رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ
            </p>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">
              {language === 'bn'
                ? '“হে আমার পালনকর্তা! আমাকে নামাজ কায়েমকারী করুন এবং আমার বংশধরদের মধ্য থেকেও।”'
                : '“My Lord, make me steadfast in prayer, and also of my offspring. Our Lord, accept my prayer.”'}
            </p>
          </div>
        </div>

        {/* Hero Central Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Title & Mission */}
          <div className="lg:col-span-7 space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {t.heroTitlePrefix}{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-amber-200 bg-clip-text text-transparent drop-shadow-sm">
                {t.heroTitleHighlight}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-100 font-medium max-w-2xl leading-relaxed">
              {t.heroWelcome},{' '}
              <span className="text-cyan-300 font-bold">
                {profile.name || t.heroGuest}
              </span>
              । {t.heroDescription}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenPlanner}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 text-white text-xs sm:text-sm font-semibold hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
              >
                <span>{t.heroBtnRoutine}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                <span>{t.heroBtnChangeSettings}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Next Prayer Countdown Widget with Dynamic Waqt Atmosphere */}
          <div className="lg:col-span-5">
            {(() => {
              // Dynamic Waqt Theme Mapping
              const waqtId = nextPrayer?.id;
              const isFajr = waqtId === 'fajr';
              const isDhuhr = waqtId === 'dhuhr';
              const isAsr = waqtId === 'asr';
              const isMaghrib = waqtId === 'maghrib';

              const cardClasses = isFajr
                ? 'from-[#1c1d4a]/95 via-[#121438]/90 to-[#0a0d24]/95 border-indigo-400/50 shadow-[0_0_35px_rgba(99,102,241,0.25)]'
                : isDhuhr
                ? 'from-[#112d58]/95 via-[#0b1f3e]/90 to-[#071329]/95 border-sky-400/50 shadow-[0_0_35px_rgba(56,189,248,0.25)]'
                : isAsr
                ? 'from-[#351e0d]/95 via-[#231409]/90 to-[#120a05]/95 border-amber-400/50 shadow-[0_0_35px_rgba(245,158,11,0.25)]'
                : isMaghrib
                ? 'from-[#381121]/95 via-[#240b15]/90 to-[#14060c]/95 border-rose-400/50 shadow-[0_0_35px_rgba(244,63,94,0.25)]'
                : 'from-[#132244]/95 via-[#0e1b36]/90 to-[#091326]/95 border-cyan-400/50 shadow-[0_0_35px_rgba(6,182,212,0.25)]';

              const badgeClasses = isFajr
                ? 'bg-indigo-900/70 border-indigo-400/50 text-cyan-200'
                : isDhuhr
                ? 'bg-sky-900/70 border-sky-400/50 text-amber-200'
                : isAsr
                ? 'bg-amber-900/70 border-amber-400/50 text-amber-200'
                : isMaghrib
                ? 'bg-rose-900/70 border-rose-400/50 text-rose-200'
                : 'bg-cyan-900/70 border-cyan-400/50 text-cyan-200';

              const clockClasses = isFajr
                ? 'bg-[#0d102e] border-indigo-500/40 text-cyan-200 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                : isDhuhr
                ? 'bg-[#081832] border-sky-500/40 text-amber-300 shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                : isAsr
                ? 'bg-[#1b1007] border-amber-500/40 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                : isMaghrib
                ? 'bg-[#1e0912] border-rose-500/40 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                : 'bg-[#0a152e] border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]';

              return (
                <div className={`rounded-2xl border bg-gradient-to-b p-6 shadow-xl backdrop-blur-md relative overflow-hidden transition-all duration-500 ${cardClasses}`}>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      {t.heroCountdownTitle}
                    </span>
                    <span className="text-xs text-slate-200 flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-cyan-400" />
                      {cityName}
                    </span>
                  </div>

                  {nextPrayer ? (
                    <div className="mt-4 text-center">
                      <div className="text-xs text-slate-300 uppercase tracking-widest font-semibold">
                        {t.heroNextPrayer}
                      </div>
                      <div className="mt-1 text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-2">
                        <span className="drop-shadow-md">
                          {language === 'bn' ? nextPrayer.nameBn : nextPrayer.nameEn}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-lg border font-mono font-semibold ${badgeClasses}`}>
                          {nextPrayer.timeString}
                        </span>
                      </div>

                      {/* Big Live Ticking Clock with Waqt Dynamic Glow */}
                      <div className={`my-5 py-3.5 px-4 rounded-xl border ${clockClasses}`}>
                        <div className="text-[11px] text-slate-300 mb-1">{t.heroTimeRemaining}</div>
                        <div className="font-mono-tabular text-3xl sm:text-4xl font-extrabold tracking-widest drop-shadow-md">
                          {countdownString || '--:--:--'}
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 flex items-center justify-center gap-4">
                        <span>
                          {t.heroFard}: {formatNum(nextPrayer.rakatsFard, useBnDigits)} {t.heroRakat}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span>
                          {t.heroTotal}: {formatNum(nextPrayer.rakatsTotal, useBnDigits)} {t.heroRakat}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-slate-400">
                      {t.heroCalculating}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
