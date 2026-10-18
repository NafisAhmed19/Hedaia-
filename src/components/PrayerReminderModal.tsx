import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  BellRing,
  Volume2,
  Sparkles,
  Check,
  Play,
  Square,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  ShieldCheck,
  Radio,
  Sliders,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { PrayerReminderSettings, PrayerTimeItem } from '../types';
import {
  prayerAlarmAudio,
  ATHAN_SOUND_PRESETS,
  CalmingAthanSoundType,
} from '../utils/prayerAlarmAudio';

interface PrayerReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PrayerReminderSettings;
  onSaveSettings: (settings: PrayerReminderSettings) => void;
  prayerTimes?: PrayerTimeItem[];
  cityName?: string;
}

export const PrayerReminderModal: React.FC<PrayerReminderModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  prayerTimes = [],
  cityName,
}) => {
  const [localSettings, setLocalSettings] = useState<PrayerReminderSettings>({ ...settings });
  const [playingPresetId, setPlayingPresetId] = useState<string | null>(null);
  const [notificationPerm, setNotificationPerm] = useState<NotificationPermission>('default');
  const [savedBadge, setSavedBadge] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPerm(Notification.permission);
    }
  }, [isOpen]);

  useEffect(() => {
    setLocalSettings({ ...settings });
  }, [settings]);

  if (!isOpen) return null;

  // Toggle playing a sample of a preset
  const handleTogglePlay = (presetId: CalmingAthanSoundType) => {
    if (playingPresetId === presetId) {
      prayerAlarmAudio.stop();
      setPlayingPresetId(null);
    } else {
      prayerAlarmAudio.stop();
      setPlayingPresetId(presetId);
      prayerAlarmAudio.playChime(presetId, localSettings.volume);
      setTimeout(() => {
        setPlayingPresetId((curr) => (curr === presetId ? null : curr));
      }, 4500);
    }
  };

  // Request browser notification permission
  const handleRequestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotificationPerm(perm);
      if (perm === 'granted') {
        try {
          new Notification('হিদায়াহ - নামাজ অ্যালার্ম সক্রিয়', {
            body: 'আলহামদুলিল্লাহ! ওয়াক্তের সঠিক সময়ে আপনার ডিভাইসে নোটিফিকেশন পৌঁছে যাবে।',
          });
        } catch {
          // ignore
        }
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    prayerAlarmAudio.stop();
    onSaveSettings(localSettings);
    setSavedBadge(true);
    setTimeout(() => {
      setSavedBadge(false);
      onClose();
    }, 400);
  };

  const handleClose = () => {
    prayerAlarmAudio.stop();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-[#0c162e] via-[#091122] to-[#050a16] text-slate-100 shadow-[0_25px_65px_-15px_rgba(6,182,212,0.3)] p-5 sm:p-7 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <BellRing className="h-6 w-6 text-cyan-400" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">নামাজ রিমাইন্ডার ও অ্যালার্ম সেটিংস</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
                  হাই-কোয়ালিটি অ্যালার্ম
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                নির্বাচিত শহরের ক্যালকুলেটেড ওয়াক্ত অনুযায়ী সঠিক সময়ে সুরময় সতর্কবার্তা
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-6 text-xs text-slate-300">
          {/* 1. Master Toggle & Status */}
          <div className="flex items-center justify-between p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/25">
            <div>
              <span className="text-sm font-semibold text-white block">
                অ্যালার্ম সাউন্ড ও পুশ রিমাইন্ডার
              </span>
              <span className="text-slate-400 text-[11px] block mt-0.5">
                ওয়াক্তের নির্ধারিত মিনিটে ব্রাউজারে স্বয়ংক্রিয়ভাবে সুরময় আজান অ্যালার্ম বেজে উঠবে
              </span>
            </div>
            <button
              type="button"
              onClick={() =>
                setLocalSettings({ ...localSettings, enabled: !localSettings.enabled })
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                localSettings.enabled ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  localSettings.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 2. Calming Athan Sounds Selection */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-white flex items-center gap-1.5 text-xs sm:text-sm">
                  <Radio className="h-4 w-4 text-cyan-400" />
                  প্রশান্তিময় আজান ও অ্যালার্ম সুর নির্বাচন
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  আপনার রুচি ও আত্মশুদ্ধির ভাবনার সাথে মানানসই সুরটি বেছে নিন
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 pt-2">
              {ATHAN_SOUND_PRESETS.map((preset) => {
                const isSelected = localSettings.alarmSoundType === preset.id;
                const isPlaying = playingPresetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() =>
                      setLocalSettings({
                        ...localSettings,
                        alarmSoundType: preset.id,
                      })
                    }
                    className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-cyan-500/80 bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-cyan-950/40 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <div
                          className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-500'
                              : 'border-slate-600 bg-slate-800'
                          }`}
                        >
                          {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-white">
                            {preset.titleBn}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800/60 text-cyan-300 font-mono-tabular">
                            {preset.maqamName}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {preset.description}
                        </p>
                      </div>
                    </div>

                    {/* Preview / Stop Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePlay(preset.id);
                      }}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer ${
                        isPlaying
                          ? 'border-amber-500/60 bg-amber-950/60 text-amber-200 animate-pulse'
                          : 'border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 hover:text-white'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Square className="h-3 w-3 fill-amber-300 text-amber-300" />
                          <span>থামান</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 fill-cyan-400 text-cyan-400" />
                          <span>শুনুন</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Volume range slider */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-slate-400 mb-1.5 text-[11px]">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span>অ্যালার্ম সাউন্ডের মাত্রা (Volume):</span>
                </span>
                <span className="text-white font-mono-tabular font-semibold">
                  {Math.round(localSettings.volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={localSettings.volume}
                onChange={(e) =>
                  setLocalSettings({ ...localSettings, volume: parseFloat(e.target.value) })
                }
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* 3. City-based Calculated Prayer Schedule Live Preview */}
          {prayerTimes.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-[#091122] p-4 space-y-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{cityName ? `${cityName}-এর` : 'নির্বাচিত শহরের'} আজকের অ্যালার্ম সূচি:</span>
                </span>
                <span className="text-cyan-400 text-[10px]">অটো-ক্যালকুলেটেড ওয়াক্ত</span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                {prayerTimes
                  .filter((p) => p.id !== 'sunrise')
                  .map((p) => {
                    const key = p.id as 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
                    const isEnabled = localSettings[key];
                    return (
                      <div
                        key={p.id}
                        className={`p-2 rounded-xl border ${
                          isEnabled
                            ? 'border-cyan-500/40 bg-cyan-950/30 text-slate-200'
                            : 'border-slate-800/80 bg-slate-900/30 text-slate-500 opacity-60'
                        }`}
                      >
                        <span className="font-semibold block">{p.nameBn}</span>
                        <span className="font-mono-tabular font-bold text-white block mt-0.5">
                          {p.timeString}
                        </span>
                        <span className="text-[9px] text-cyan-400 mt-0.5 block">
                          {isEnabled ? 'সক্রিয়' : 'বন্ধ'}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* 4. Individual Prayer Toggles */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <span className="font-semibold text-white block text-xs">
              কোন কোন ওয়াক্তে অ্যালার্ম চান?
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'fajr', label: 'ফজর', icon: Sunrise },
                { id: 'dhuhr', label: 'যোহর', icon: Sun },
                { id: 'asr', label: 'আসর', icon: Sunset },
                { id: 'maghrib', label: 'মাগরিব', icon: Sunset },
                { id: 'isha', label: 'ইশা ও বিতর', icon: Moon },
              ].map((waqt) => {
                const Icon = waqt.icon;
                const isChecked = localSettings[waqt.id as keyof PrayerReminderSettings] as boolean;
                return (
                  <button
                    key={waqt.id}
                    type="button"
                    onClick={() =>
                      setLocalSettings({
                        ...localSettings,
                        [waqt.id]: !isChecked,
                      })
                    }
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                      isChecked
                        ? 'border-cyan-500/60 bg-cyan-950/40 text-white font-medium'
                        : 'border-slate-800 bg-slate-900/40 text-slate-500 hover:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`h-3.5 w-3.5 ${isChecked ? 'text-cyan-400' : 'text-slate-600'}`} />
                      <span>{waqt.label}</span>
                    </div>
                    <div
                      className={`h-4 w-4 rounded-md border flex items-center justify-center ${
                        isChecked
                          ? 'border-cyan-500 bg-cyan-500 text-slate-950'
                          : 'border-slate-700 bg-slate-800'
                      }`}
                    >
                      {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Browser Desktop Push Notification Permission */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-white font-semibold flex items-center gap-1.5 text-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                ব্রাউজার ব্যাকগ্রাউন্ড পুশ নোটিফিকেশন
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                ট্যাব ব্যাকগ্রাউন্ডে বা মিনিমাইজ করা থাকলেও ওয়াক্তের সময় পপআপ বার্তা পাঠাবে
              </span>
            </div>

            {notificationPerm === 'granted' ? (
              <span className="px-3 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5 self-start sm:self-auto">
                <CheckCircle2 className="h-3.5 w-3.5" />
                অনুমোদিত (Active)
              </span>
            ) : (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="px-3.5 py-1.5 rounded-xl border border-cyan-500/50 bg-cyan-950 text-cyan-200 hover:bg-cyan-900 text-[11px] font-semibold transition-colors cursor-pointer self-start sm:self-auto"
              >
                অনুমোদন দিন (Allow)
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-600/30 hover:shadow-cyan-600/50 transition-all cursor-pointer"
            >
              {savedBadge ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>সংরক্ষিত হয়েছে!</span>
                </>
              ) : (
                <span>সেটিংস সংরক্ষণ করুন</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
