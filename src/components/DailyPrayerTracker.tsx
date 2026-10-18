import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  CheckCircle2,
  Circle,
  MapPin,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  Calendar,
  BellRing,
  BookOpen,
  Volume2,
  X,
  ShieldCheck,
} from 'lucide-react';
import { PrayerTimeItem, DailyLog, PrayerReminderSettings, WaqtHadithItem } from '../types';
import { BANGLADESH_CITIES, formatNum } from '../utils/islamicPrayerCalc';
import { ThirtyDayStreakChart } from './ThirtyDayStreakChart';
import { WaqtHadithCelebrationModal } from './WaqtHadithCelebrationModal';
import { PrayerReminderModal } from './PrayerReminderModal';
import { WAQT_HADITHS } from '../utils/waqtHadithsData';
import { prayerAlarmAudio } from '../utils/prayerAlarmAudio';
import { Language } from '../utils/translations';

interface DailyPrayerTrackerProps {
  prayerTimes: PrayerTimeItem[];
  dailyLog: DailyLog;
  prayerHistory: Record<string, DailyLog>;
  selectedCity: string;
  onChangeCity: (city: string) => void;
  onTogglePrayerToday: (prayerKey: keyof Omit<DailyLog, 'date' | 'recoveredQazaWaqts'>) => void;
  onUpdateDayLog: (dateStr: string, updatedLog: DailyLog) => void;
  useBnDigits: boolean;
  language?: Language;
  reminderSettings: PrayerReminderSettings;
  onSaveReminderSettings: (settings: PrayerReminderSettings) => void;
}

export const DailyPrayerTracker: React.FC<DailyPrayerTrackerProps> = ({
  prayerTimes,
  dailyLog,
  prayerHistory,
  selectedCity,
  onChangeCity,
  onTogglePrayerToday,
  onUpdateDayLog,
  useBnDigits,
  language = 'bn',
  reminderSettings,
  onSaveReminderSettings,
}) => {
  const isBn = language !== 'en';
  const [selectedHadithModal, setSelectedHadithModal] = useState<{
    hadith: WaqtHadithItem;
    isJustCompleted: boolean;
  } | null>(null);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [activeAlarmNotification, setActiveAlarmNotification] = useState<{
    waqtName: string;
    timeString: string;
  } | null>(null);
  const firedAlarmsRef = useRef<Set<string>>(new Set());

  // Real-time background interval: Check every 10 seconds for waqt alarm triggers
  useEffect(() => {
    if (!reminderSettings.enabled) return;

    const checkAlarmTime = () => {
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

        const alarmKey = `${todayStr}_${key}_${pHours}:${pMinutes}`;
        if (
          currentHours === pHours &&
          currentMinutes === pMinutes &&
          !firedAlarmsRef.current.has(alarmKey)
        ) {
          firedAlarmsRef.current.add(alarmKey);
          // Play the configured sweet alarm sound
          prayerAlarmAudio.playChime(reminderSettings.alarmSoundType, reminderSettings.volume);
          setActiveAlarmNotification({
            waqtName: pt.nameBn,
            timeString: pt.timeString,
          });

          // Send browser native notification if permitted
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification(`হিদায়াহ - ${pt.nameBn} নামাজের ওয়াক্ত`, {
                body: `এখন ${pt.nameBn} সালাতের সময় হয়েছে (${pt.timeString})। নামাজের প্রস্তুতি গ্রহণ করুন।`,
              });
            } catch {
              // ignore
            }
          }
        }
      });
    };

    checkAlarmTime();
    const interval = setInterval(checkAlarmTime, 10000);
    return () => clearInterval(interval);
  }, [reminderSettings, prayerTimes]);

  const currentCity = BANGLADESH_CITIES[selectedCity] || BANGLADESH_CITIES.dhaka;

  const getIcon = (id: string) => {
    switch (id) {
      case 'fajr':
        return <Sunrise className="h-5 w-5 text-amber-300" />;
      case 'sunrise':
        return <Sun className="h-5 w-5 text-amber-400" />;
      case 'dhuhr':
        return <Sun className="h-5 w-5 text-sky-400" />;
      case 'asr':
        return <Sunset className="h-5 w-5 text-orange-400" />;
      case 'maghrib':
        return <Sunset className="h-5 w-5 text-rose-400" />;
      case 'isha':
      default:
        return <Moon className="h-5 w-5 text-indigo-400" />;
    }
  };

  const getLogKey = (id: string): ('fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') | null => {
    if (['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].includes(id)) {
      return id as 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
    }
    return null;
  };

  const todayCompletedCount = [
    dailyLog.fajr,
    dailyLog.dhuhr,
    dailyLog.asr,
    dailyLog.maghrib,
    dailyLog.isha,
  ].filter(Boolean).length;

  const handlePrayerExecution = (logKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => {
    const willBeCompleted = !dailyLog[logKey];
    onTogglePrayerToday(logKey);

    if (willBeCompleted) {
      // Play confirmation harmonic sound
      prayerAlarmAudio.playConfirmation();
      // Show Hadith celebration modal for this waqt
      const hadith = WAQT_HADITHS[logKey];
      if (hadith) {
        setSelectedHadithModal({
          hadith,
          isJustCompleted: true,
        });
      }
    }
  };

  const handleOpenHadithOnly = (logKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => {
    const hadith = WAQT_HADITHS[logKey];
    if (hadith) {
      setSelectedHadithModal({
        hadith,
        isJustCompleted: false,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Clock className="h-4 w-4" />
            <span>{isBn ? 'আজকের নামাজের সময়সূচি ও দৈনিক ট্র্যাকার' : 'Today’s Prayer Schedule & Daily Tracker'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {isBn ? 'দৈনিক ওয়াক্ত ও লাইভ সময়' : 'Daily Waqts & Live Timetable'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {isBn
              ? 'ওয়াক্তমত নামাজ আদায় করে টিক দিন এবং সাথে সাথে ওই ওয়াক্তের বিশেষ হাদিস ও ফজিলত পাঠ করুন।'
              : 'Mark prayers as completed and read inspiring Hadiths and virtues for each specific waqt.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Reminder Alarm Settings Button */}
          <button
            onClick={() => setIsReminderOpen(true)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
              reminderSettings.enabled
                ? 'border-cyan-500/40 bg-cyan-950/40 text-cyan-200 hover:border-cyan-400'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <BellRing className={`h-4 w-4 ${reminderSettings.enabled ? 'text-cyan-400' : 'text-slate-500'}`} />
            <span>
              {reminderSettings.enabled
                ? isBn ? 'অ্যালার্ম চালু' : 'Alarm Active'
                : isBn ? 'অ্যালার্ম বন্ধ' : 'Alarm Off'}
            </span>
          </button>

          {/* City Selector */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-xl">
            <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="text-xs text-slate-400">{isBn ? 'স্থান:' : 'City:'}</span>
            <select
              value={selectedCity}
              onChange={(e) => onChangeCity(e.target.value)}
              className="bg-transparent text-xs text-white font-medium focus:outline-none cursor-pointer"
            >
              {Object.entries(BANGLADESH_CITIES).map(([key, val]) => (
                <option key={key} value={key} className="bg-slate-900 text-white">
                  {isBn ? `${val.nameBn} (${val.nameEn})` : `${val.nameEn} (${val.nameBn})`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Live Alarm Notification Banner (when waqt arrives) */}
      {activeAlarmNotification && (
        <div className="flex items-center justify-between p-4 rounded-2xl border border-amber-500/50 bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-amber-950/40 text-amber-200 shadow-xl shadow-amber-950/30 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 animate-pulse">
              <BellRing className="h-5 w-5" />
            </span>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isBn ? 'ওয়াক্তের সময় হয়েছে' : 'Prayer Time Has Arrived'}</span>
              </div>
              <p className="text-sm font-bold text-white mt-0.5">
                {isBn ? (
                  <>এখন <strong className="text-amber-300">{activeAlarmNotification.waqtName}</strong> নামাজের ওয়াক্ত শুরু হয়েছে ({activeAlarmNotification.timeString})</>
                ) : (
                  <>Waqt for <strong className="text-amber-300">{activeAlarmNotification.waqtName}</strong> has commenced ({activeAlarmNotification.timeString})</>
                )}
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                {isBn
                  ? 'সুরময় অ্যালার্ম বেজে উঠেছে — নামাজের জন্য প্রস্তুত হোন এবং আদায় শেষে টিক দিন।'
                  : 'Harmonic alarm has rung — prepare for prayer and check it off once completed.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveAlarmNotification(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isBn ? 'নোটিফিকেশন বন্ধ করুন' : 'Dismiss Notification'}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Daily Progress summary banner */}
      <div className="rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-cyan-950/30 via-slate-900/60 to-blue-950/30 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-900/40 text-cyan-300 border border-cyan-500/30">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {isBn ? 'আজকের নামাজ সম্পন্ন হয়েছে:' : 'Today’s Completed Prayers:'}{' '}
              <span className="text-cyan-300 font-mono-tabular">
                {formatNum(todayCompletedCount, useBnDigits)} / {formatNum(5, useBnDigits)} {isBn ? 'ওয়াক্ত' : 'Waqts'}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {todayCompletedCount === 5
                ? isBn
                  ? 'মাশাআল্লাহ! আজকের সমস্ত ফরজ নামাজ আদায় হয়েছে। কোনো কাজা যোগ হয়নি!'
                  : 'MashaAllah! All 5 obligatory prayers completed today. Zero Qaza added!'
                : isBn
                  ? 'প্রতিটি ওয়াক্ত আদায়ের পর টিক দিন এবং তাৎক্ষণিক হাদিস পাঠ করুন।'
                  : 'Check off each prayer upon completion to read its specific Hadith.'}
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-cyan-400 font-mono-tabular">
            {formatNum(todayCompletedCount * 20, useBnDigits)}%
          </span>
        </div>
      </div>

      {/* Prayer Time Cards Grid with Dynamic Waqt Color Identities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {prayerTimes.map((pt) => {
          const logKey = getLogKey(pt.id);
          const isCompleted = logKey ? dailyLog[logKey] : false;

          // Dynamic Waqt-specific Color Palette Mapping
          const cardStyle = isCompleted
            ? 'border-emerald-400/60 bg-gradient-to-b from-[#0e2f27] via-[#09211b] to-[#051410] shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:border-emerald-300'
            : pt.isNext
            ? pt.id === 'fajr'
              ? 'border-indigo-400 bg-gradient-to-b from-[#202354] via-[#14173d] to-[#0c0e29] shadow-[0_0_30px_rgba(99,102,241,0.4)] ring-2 ring-indigo-400/60'
              : pt.id === 'dhuhr'
              ? 'border-sky-400 bg-gradient-to-b from-[#143566] via-[#0c2448] to-[#07162e] shadow-[0_0_30px_rgba(56,189,248,0.4)] ring-2 ring-sky-400/60'
              : pt.id === 'asr'
              ? 'border-amber-400 bg-gradient-to-b from-[#3a220e] via-[#261609] to-[#150c05] shadow-[0_0_30px_rgba(245,158,11,0.4)] ring-2 ring-amber-400/60'
              : pt.id === 'maghrib'
              ? 'border-rose-400 bg-gradient-to-b from-[#3d1324] via-[#280c17] to-[#16060c] shadow-[0_0_30px_rgba(244,63,94,0.4)] ring-2 ring-rose-400/60'
              : 'border-cyan-400 bg-gradient-to-b from-[#142850] via-[#0d1d3c] to-[#071228] shadow-[0_0_30px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400/60'
            : pt.id === 'fajr'
            ? 'border-indigo-500/35 bg-gradient-to-b from-[#161a3e] to-[#0a0d24] hover:border-indigo-400 hover:shadow-[0_4px_20px_rgba(99,102,241,0.25)]'
            : pt.id === 'sunrise'
            ? 'border-amber-500/35 bg-gradient-to-b from-[#281c0e] to-[#140e07] hover:border-amber-400 hover:shadow-[0_4px_20px_rgba(245,158,11,0.25)]'
            : pt.id === 'dhuhr'
            ? 'border-sky-500/35 bg-gradient-to-b from-[#0f284a] to-[#08162b] hover:border-sky-400 hover:shadow-[0_4px_20px_rgba(56,189,248,0.25)]'
            : pt.id === 'asr'
            ? 'border-amber-500/35 bg-gradient-to-b from-[#2a1a0c] to-[#140c06] hover:border-amber-400 hover:shadow-[0_4px_20px_rgba(245,158,11,0.25)]'
            : pt.id === 'maghrib'
            ? 'border-rose-500/35 bg-gradient-to-b from-[#2f101d] to-[#17080e] hover:border-rose-400 hover:shadow-[0_4px_20px_rgba(244,63,94,0.25)]'
            : 'border-blue-500/35 bg-gradient-to-b from-[#101e42] to-[#070e22] hover:border-blue-400 hover:shadow-[0_4px_20px_rgba(59,130,246,0.25)]';

          const badgeStyle = pt.id === 'fajr'
            ? 'bg-indigo-500 text-white'
            : pt.id === 'dhuhr'
            ? 'bg-sky-500 text-slate-950'
            : pt.id === 'asr'
            ? 'bg-amber-500 text-slate-950'
            : pt.id === 'maghrib'
            ? 'bg-rose-500 text-white'
            : 'bg-cyan-500 text-slate-950';

          return (
            <div
              key={pt.id}
              className={`relative overflow-hidden rounded-2xl border transition-all duration-300 p-5 hover:-translate-y-1 ${cardStyle}`}
            >
              {pt.isNext && (
                <div className={`absolute top-0 right-0 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-bl-lg shadow-sm ${badgeStyle}`}>
                  {isBn ? 'পরবর্তী ওয়াক্ত' : 'Next Prayer'}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    {getIcon(pt.id)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      <span>{isBn ? pt.nameBn : pt.nameEn}</span>
                      <span className="text-xs text-slate-300 font-medium">
                        ({isBn ? pt.nameEn : pt.nameBn})
                      </span>
                    </h3>
                    <span className="text-xs text-slate-200 font-mono-tabular font-semibold">
                      {isBn ? 'ফরজ' : 'Fard'} {formatNum(pt.rakatsFard, useBnDigits)} · {isBn ? 'মোট' : 'Total'} {formatNum(pt.rakatsTotal, useBnDigits)} {isBn ? 'রাকাত' : 'Rakats'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xl font-extrabold text-white font-mono-tabular drop-shadow-sm">
                    {pt.timeString}
                  </span>
                </div>
              </div>

              {/* Action Buttons for 5 Fard Prayers */}
              {logKey && (
                <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between gap-2">
                  {/* Read Hadith button */}
                  <button
                    type="button"
                    onClick={() => handleOpenHadithOnly(logKey)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:text-amber-300 hover:border-amber-400 text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                    title={isBn ? 'এই ওয়াক্তের হাদিস ও ফজিলত পড়ুন' : 'Read Hadiths for this prayer'}
                  >
                    <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                    <span>{isBn ? 'হাদিস পড়ুন' : 'Read Hadith'}</span>
                  </button>

                  {/* Mark as Prayed Checkmark */}
                  <button
                    type="button"
                    onClick={() => handlePrayerExecution(logKey)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ${
                      isCompleted
                        ? 'bg-emerald-950 border border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'bg-slate-900 border border-slate-600 text-slate-200 hover:text-white hover:border-cyan-400'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>{isBn ? 'আদায় হয়েছে' : 'Prayed'}</span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-4 w-4 text-slate-400" />
                        <span>{isBn ? 'পড়েছি (টিক দিন)' : 'Mark Done'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 30-Day Streak Visualization Chart */}
      <ThirtyDayStreakChart
        prayerHistory={prayerHistory}
        useBnDigits={useBnDigits}
        onUpdateDayLog={onUpdateDayLog}
      />

      {/* Waqt Hadith Celebration Modal */}
      <WaqtHadithCelebrationModal
        isOpen={selectedHadithModal !== null}
        hadith={selectedHadithModal?.hadith || null}
        isJustCompleted={selectedHadithModal?.isJustCompleted ?? false}
        onClose={() => setSelectedHadithModal(null)}
      />

      {/* Prayer Reminder Modal */}
      <PrayerReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        settings={reminderSettings}
        onSaveSettings={onSaveReminderSettings}
        prayerTimes={prayerTimes}
        cityName={currentCity.nameBn}
      />
    </div>
  );
};
