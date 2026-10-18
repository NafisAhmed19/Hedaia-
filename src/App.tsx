import React, { useState, useEffect, useRef } from 'react';
import {
  Calculator,
  CalendarClock,
  Clock,
  BookOpen,
  Sparkles,
  UserCheck,
  CheckCircle,
  ShieldCheck,
  RotateCcw,
  Layers,
} from 'lucide-react';
import { UserProfile, DailyLog, PrayerReminderSettings } from './types';
import {
  getSavedProfile,
  saveProfile,
  getRecoveredDays,
  saveRecoveredDays,
  getTodayLog,
  saveTodayLog,
  getPrayerHistory,
  savePrayerHistory,
  getReminderSettings,
  saveReminderSettings,
  getSavedLanguage,
  saveLanguage,
  resetAllAppData,
  DEFAULT_PROFILE,
} from './utils/storage';
import {
  calculateLifetimeSalah,
  getDailyPrayerTimes,
  BANGLADESH_CITIES,
} from './utils/islamicPrayerCalc';
import { prayerAlarmAudio } from './utils/prayerAlarmAudio';
import { getTranslation, TRANSLATIONS, Language } from './utils/translations';

import { Header } from './components/Header';
import { HeroAtmosphere } from './components/HeroAtmosphere';
import { LifetimeCalculator } from './components/LifetimeCalculator';
import { QazaRecoveryPlanner } from './components/QazaRecoveryPlanner';
import { DailyPrayerTracker } from './components/DailyPrayerTracker';
import { AuthModal } from './components/AuthModal';
import { IslamicGuidesModal } from './components/IslamicGuidesModal';
import { Footer } from './components/Footer';
import { Celestial3DBackground } from './components/Celestial3DBackground';
import { ActivePrayerAlarmBanner } from './components/ActivePrayerAlarmBanner';
import { CommunityFeedbackAndJoin } from './components/CommunityFeedbackAndJoin';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => getSavedProfile());
  const [recoveredDays, setRecoveredDays] = useState<number>(() => getRecoveredDays());
  const [todayLog, setTodayLog] = useState<DailyLog>(() => getTodayLog());
  const [prayerHistory, setPrayerHistory] = useState<Record<string, DailyLog>>(() => getPrayerHistory());
  const [reminderSettings, setReminderSettings] = useState<PrayerReminderSettings>(() => getReminderSettings());
  const [language, setLanguage] = useState<Language>(() => getSavedLanguage());
  const [useBnDigits, setUseBnDigits] = useState<boolean>(() => getSavedLanguage() === 'bn');
  const [activeTab, setActiveTab] = useState<'calculator' | 'recovery' | 'daily' | 'hadith'>('calculator');

  const t = getTranslation(language);

  const handleToggleLanguage = (targetLang?: unknown) => {
    let next: Language;
    if (targetLang === 'en' || targetLang === 'bn') {
      next = targetLang;
    } else {
      next = language === 'bn' ? 'en' : 'bn';
    }
    setLanguage(next);
    saveLanguage(next);
    setUseBnDigits(next === 'bn');
  };

  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(() => {
    try {
      const hideStartup = localStorage.getItem('salah_app_hide_startup_modal');
      if (hideStartup === 'true' && profile.name && profile.hasCompletedOnboarding) {
        return false;
      }
    } catch {
      // ignore
    }
    // Default: Auto-open modal on app start / restart so user can easily enter or review preliminary data!
    return true;
  });
  const [isGuidesOpen, setIsGuidesOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [activeGlobalAlarm, setActiveGlobalAlarm] = useState<{
    waqtId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
    waqtName: string;
    timeString: string;
    cityName: string;
  } | null>(null);

  const firedGlobalAlarmsRef = useRef<Set<string>>(new Set());

  // Compute stats dynamically whenever profile or recovered days change
  const stats = calculateLifetimeSalah(profile, recoveredDays);
  const prayerTimes = getDailyPrayerTimes(profile.selectedCity);
  const currentCityObj = BANGLADESH_CITIES[profile.selectedCity] || BANGLADESH_CITIES.dhaka;

  // Global Real-Time Accurate Prayer Alarm Scheduler (runs across all tabs)
  useEffect(() => {
    if (!reminderSettings.enabled) return;

    const checkGlobalAlarm = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const todayStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

      prayerTimes.forEach((pt) => {
        if (pt.id === 'sunrise') return;
        const key = pt.id as 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
        if (!reminderSettings[key]) return;

        const pDate = pt.dateObj;
        const pHours = pDate.getHours();
        const pMinutes = pDate.getMinutes();

        const alarmKey = `${todayStr}_${profile.selectedCity}_${key}_${pHours}:${pMinutes}`;
        if (
          currentHours === pHours &&
          currentMinutes === pMinutes &&
          !firedGlobalAlarmsRef.current.has(alarmKey)
        ) {
          firedGlobalAlarmsRef.current.add(alarmKey);

          // Play calming Athan audio
          prayerAlarmAudio.playChime(reminderSettings.alarmSoundType, reminderSettings.volume);

          // Display global alarm alert banner
          setActiveGlobalAlarm({
            waqtId: key,
            waqtName: pt.nameBn,
            timeString: pt.timeString,
            cityName: currentCityObj.nameBn,
          });

          // Trigger native desktop push notification if granted
          if (
            typeof window !== 'undefined' &&
            'Notification' in window &&
            Notification.permission === 'granted'
          ) {
            try {
              new Notification(`হিদায়াহ - ${pt.nameBn} নামাজের ওয়াক্ত`, {
                body: `এখন ${currentCityObj.nameBn}-এ ${pt.nameBn} সালাতের সময় হয়েছে (${pt.timeString})। নামাজের প্রস্তুতি গ্রহণ করুন।`,
                icon: '/favicon.ico',
              });
            } catch {
              // ignore
            }
          }
        }
      });
    };

    checkGlobalAlarm();
    const interval = setInterval(checkGlobalAlarm, 10000);
    return () => clearInterval(interval);
  }, [reminderSettings, prayerTimes, profile.selectedCity, currentCityObj]);

  // Update profile
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  // Update reminder settings
  const handleSaveReminderSettings = (newSettings: PrayerReminderSettings) => {
    setReminderSettings(newSettings);
    saveReminderSettings(newSettings);
  };

  // Add/subtract recovered days
  const handleLogRecoveryDays = (daysToAdd: number) => {
    const updated = Math.max(0, recoveredDays + daysToAdd);
    setRecoveredDays(updated);
    saveRecoveredDays(updated);
  };

  const handleResetRecovery = () => {
    setShowResetModal(true);
  };

  const handleConfirmReset = () => {
    setRecoveredDays(0);
    saveRecoveredDays(0);
    setShowResetModal(false);
  };

  // Full app restart & fresh preliminary data entry
  const handleFullAppRestart = () => {
    resetAllAppData();
    setProfile(DEFAULT_PROFILE);
    setRecoveredDays(0);
    const freshLog: DailyLog = {
      date: new Date().toISOString().split('T')[0],
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
      recoveredQazaWaqts: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, witr: 0 },
    };
    setTodayLog(freshLog);
    setIsAuthOpen(true);
    setShowResetModal(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // Toggle today's prayer check
  const handleTogglePrayerToday = (prayerKey: keyof Omit<DailyLog, 'date' | 'recoveredQazaWaqts'>) => {
    const updated: DailyLog = {
      ...todayLog,
      [prayerKey]: !todayLog[prayerKey],
    };
    setTodayLog(updated);
    saveTodayLog(updated);

    const updatedHistory = {
      ...prayerHistory,
      [updated.date]: updated,
    };
    setPrayerHistory(updatedHistory);
    savePrayerHistory(updatedHistory);
  };

  // Update specific day log in 30-day streak chart
  const handleUpdateDayLog = (dateStr: string, updatedLog: DailyLog) => {
    const updatedHistory = {
      ...prayerHistory,
      [dateStr]: updatedLog,
    };
    setPrayerHistory(updatedHistory);
    savePrayerHistory(updatedHistory);

    if (dateStr === todayLog.date) {
      setTodayLog(updatedLog);
      saveTodayLog(updatedLog);
    }
  };

  // City selection change
  const handleChangeCity = (city: string) => {
    const updated = { ...profile, selectedCity: city };
    setProfile(updated);
    saveProfile(updated);
  };

  // Switch tab and smoothly scroll directly to the dashboard section
  const handleSwitchTab = (tab: 'calculator' | 'recovery' | 'daily' | 'hadith') => {
    setActiveTab(tab);
    setTimeout(() => {
      const el = document.getElementById('dashboard-content-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  // Scroll strictly to the very beginning of the page when clicking the top Hidayah logo
  const handleScrollToTop = () => {
    setActiveTab('calculator');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <div id="app-root-top" className="relative min-h-screen bg-[#0b1528] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3D Celestial Animated Background with Parallax Moon and Shooting Stars */}
      <Celestial3DBackground />

      {/* Top Bar navigation */}
      <Header
        profile={profile}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenGuides={() => setIsGuidesOpen(true)}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        activeTab={activeTab}
        setActiveTab={handleSwitchTab}
        onScrollToTop={handleScrollToTop}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 space-y-8">
        {/* Aesthetic Islamic Hero Section (Crescent Moon, Mosque Dome, Live Clock) */}
        <HeroAtmosphere
          profile={profile}
          prayerTimes={prayerTimes}
          useBnDigits={useBnDigits}
          language={language}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenPlanner={() => handleSwitchTab('recovery')}
        />

        {/* Dashboard Content Destination Section (Direct Auto-Scroll Target) */}
        <section id="dashboard-content-section" className="scroll-mt-20 space-y-6">
          {/* View Switcher Tabs (Desktop / Unified Bar) */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-cyan-500/30 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => handleSwitchTab('calculator')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'calculator'
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-700/60 bg-slate-900/60'
                }`}
              >
                <Calculator className="h-4 w-4" />
                <span>{t.tab1}</span>
              </button>

              <button
                onClick={() => handleSwitchTab('recovery')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'recovery'
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-700/60 bg-slate-900/60'
                }`}
              >
                <CalendarClock className="h-4 w-4" />
                <span>{t.tab2}</span>
              </button>

              <button
                onClick={() => handleSwitchTab('daily')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'daily'
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-slate-700/60 bg-slate-900/60'
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>{t.tab3}</span>
              </button>
            </div>

            <button
              onClick={() => setIsGuidesOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer shrink-0"
            >
              <BookOpen className="h-4 w-4 text-cyan-400" />
              <span>{t.navFiqh}</span>
            </button>
          </div>

          {/* Active Section Direct Arrival Indicator Pill */}
          <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-slate-400">{t.activeRegionPrefix}</span>
              <strong className="text-white font-semibold">
                {activeTab === 'calculator' && t.activeRegion1}
                {activeTab === 'recovery' && t.activeRegion2}
                {activeTab === 'daily' && t.activeRegion3}
              </strong>
            </div>
            <span className="text-[11px] text-cyan-400 font-mono-tabular hidden sm:inline-block">
              {t.autoScrollReady}
            </span>
          </div>

          {/* Tab Content */}
          {activeTab === 'calculator' && (
            <div className="animate-in fade-in duration-300">
              <LifetimeCalculator
                profile={profile}
                stats={stats}
                useBnDigits={useBnDigits}
                language={language}
                onOpenAuth={() => setIsAuthOpen(true)}
                onOpenRecoveryTab={() => handleSwitchTab('recovery')}
              />
            </div>
          )}

          {activeTab === 'recovery' && (
            <div className="animate-in fade-in duration-300">
              <QazaRecoveryPlanner
                profile={profile}
                stats={stats}
                useBnDigits={useBnDigits}
                language={language}
                onLogRecoveryDays={handleLogRecoveryDays}
                onResetRecovery={handleResetRecovery}
              />
            </div>
          )}

          {activeTab === 'daily' && (
            <div className="animate-in fade-in duration-300">
              <DailyPrayerTracker
                prayerTimes={prayerTimes}
                dailyLog={todayLog}
                prayerHistory={prayerHistory}
                selectedCity={profile.selectedCity}
                onChangeCity={handleChangeCity}
                onTogglePrayerToday={handleTogglePrayerToday}
                onUpdateDayLog={handleUpdateDayLog}
                useBnDigits={useBnDigits}
                language={language}
                reminderSettings={reminderSettings}
                onSaveReminderSettings={handleSaveReminderSettings}
              />
            </div>
          )}
        </section>

        {/* Feedback & Review Box + Community Join Section (একেবারে নিচের দিকে) */}
        <CommunityFeedbackAndJoin profile={profile} language={language} />
      </main>

      {/* Footer with creator Nafis Ahmed and email */}
      <Footer language={language} />

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onResetApp={handleFullAppRestart}
      />

      <IslamicGuidesModal
        isOpen={isGuidesOpen}
        onClose={() => setIsGuidesOpen(false)}
      />

      {/* Reset Confirmation Modal (avoid window.confirm) */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-rose-500/40 bg-gradient-to-b from-[#180a0a] via-[#100707] to-[#0a0404] p-6 text-slate-100 shadow-[0_20px_50px_rgba(244,63,94,0.3)] space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
                <RotateCcw className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">
                  {language === 'bn' ? 'রিসেট অপশন নির্বাচন করুন' : 'Select Reset Option'}
                </h3>
                <p className="text-xs text-rose-300">
                  {language === 'bn' ? 'পূর্বাবস্থায় ফেরানো সম্ভব নয়' : 'Cannot be undone'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'bn'
                ? 'আপনি কি কেবল কাজা রিকভারির রেকর্ড ০ করতে চান, নাকি সম্পূর্ণ অ্যাপ রিস্টার্ট করে নতুন হিসাব শুরু করতে চান?'
                : 'Do you want to reset recovered Qaza logs back to 0, or restart the entire app and start fresh?'}
            </p>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleFullAppRestart}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white font-bold text-xs shadow-lg shadow-rose-950/50 hover:shadow-rose-900/60 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>{language === 'bn' ? 'সম্পূর্ণ অ্যাপ রিস্টার্ট ও ডাটা মুছুন' : 'Restart Full App & Reset All Data'}</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmReset}
                className="w-full py-2 px-4 rounded-xl border border-rose-700/60 bg-rose-950/40 text-xs font-semibold text-rose-200 hover:bg-rose-900/50 transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'শুধু কাজা আদায়ের কাউন্ট ০ করুন' : 'Reset Only Qaza Recovery Count'}
              </button>

              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="w-full py-2 px-4 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-Time Floating Prayer Alarm Alert Banner */}
      <ActivePrayerAlarmBanner
        alarm={activeGlobalAlarm}
        settings={reminderSettings}
        language={language}
        onDismiss={() => setActiveGlobalAlarm(null)}
        onMarkPrayed={handleTogglePrayerToday}
      />
    </div>
  );
}
