import React from 'react';
import { BellRing, VolumeX, CheckCircle, X } from 'lucide-react';
import { prayerAlarmAudio, ATHAN_SOUND_PRESETS } from '../utils/prayerAlarmAudio';
import { PrayerReminderSettings } from '../types';
import { getTranslation, Language } from '../utils/translations';

interface ActivePrayerAlarmBannerProps {
  alarm: {
    waqtId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
    waqtName: string;
    timeString: string;
    cityName: string;
  } | null;
  settings: PrayerReminderSettings;
  language?: Language;
  onDismiss: () => void;
  onMarkPrayed: (waqtId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => void;
}

export const ActivePrayerAlarmBanner: React.FC<ActivePrayerAlarmBannerProps> = ({
  alarm,
  settings,
  language = 'bn',
  onDismiss,
  onMarkPrayed,
}) => {
  if (!alarm) return null;
  const t = getTranslation(language);

  const currentPreset =
    ATHAN_SOUND_PRESETS.find((p) => p.id === settings.alarmSoundType) ||
    ATHAN_SOUND_PRESETS[0];

  const handleStopSoundOnly = () => {
    prayerAlarmAudio.stop();
  };

  const handleDismiss = () => {
    prayerAlarmAudio.stop();
    onDismiss();
  };

  const handleMarkAsDone = () => {
    prayerAlarmAudio.stop();
    prayerAlarmAudio.playConfirmation();
    onMarkPrayed(alarm.waqtId);
    onDismiss();
  };

  return (
    <aside
      aria-label="Prayer Time Notification"
      className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] rounded-3xl border-2 border-cyan-400 bg-gradient-to-br from-[#0c1833] via-[#091124] to-[#040814] text-white shadow-[0_20px_50px_rgba(6,182,212,0.4)] p-5 animate-in slide-in-from-bottom-5 fade-in duration-300 backdrop-blur-xl"
    >
      {/* Glow pulse */}
      <div className="absolute -inset-0.5 rounded-3xl bg-cyan-500/20 blur-xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/25 border border-cyan-300 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.6)] animate-bounce">
              <BellRing className="h-6 w-6 text-cyan-300" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50">
                  {t.alarmWaqtArrived}
                </span>
                <span className="text-[11px] text-slate-400">
                  {alarm.cityName}
                </span>
              </div>
              <h4 className="text-lg font-extrabold text-white mt-0.5">
                {language === 'bn' ? (
                  <>এখন <span className="text-cyan-300">{alarm.waqtName}</span> নামাজের সময় ({alarm.timeString})</>
                ) : (
                  <>Time for <span className="text-cyan-300">{alarm.waqtName}</span> prayer ({alarm.timeString})</>
                )}
              </h4>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={language === 'bn' ? 'বন্ধ করুন' : 'Dismiss'}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Melody Information & Audio Wave Pulse */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-slate-300 font-medium">
              {t.alarmNowPlaying} <strong className="text-cyan-200">{currentPreset.titleBn}</strong> ({currentPreset.maqamName})
            </span>
          </div>

          <button
            type="button"
            onClick={handleStopSoundOnly}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-900 text-[11px] text-slate-300 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
          >
            <VolumeX className="h-3.5 w-3.5 text-slate-400" />
            <span>{t.alarmMute}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleDismiss}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer text-center"
          >
            {t.alarmLater}
          </button>

          <button
            type="button"
            onClick={handleMarkAsDone}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-900/40 transition-all cursor-pointer text-center"
          >
            <CheckCircle className="h-4 w-4" />
            <span>{t.alarmPrayedDone}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
