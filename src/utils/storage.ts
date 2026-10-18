import { UserProfile, DailyLog, PrayerReminderSettings } from '../types';

const STORAGE_KEY_PROFILE = 'salah_app_user_profile';
const STORAGE_KEY_RECOVERIES = 'salah_app_recovered_days';
const STORAGE_KEY_DAILY_LOG = 'salah_app_today_log';
const STORAGE_KEY_HISTORY = 'salah_app_prayer_history';
const STORAGE_KEY_REMINDER = 'salah_app_reminder_settings';
const STORAGE_KEY_LANGUAGE = 'salah_app_language_pref';

export function getSavedLanguage(): 'bn' | 'en' {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LANGUAGE);
    if (raw === 'en' || raw === 'bn') return raw;
  } catch {
    // fallback
  }
  return 'bn';
}

export function saveLanguage(lang: 'bn' | 'en'): void {
  try {
    localStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
  } catch {
    // ignore
  }
}

export const DEFAULT_REMINDER_SETTINGS: PrayerReminderSettings = {
  enabled: true,
  soundEnabled: true,
  volume: 0.8,
  fajr: true,
  dhuhr: true,
  asr: true,
  maghrib: true,
  isha: true,
  alarmSoundType: 'adhan',
};

export function getReminderSettings(): PrayerReminderSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REMINDER);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return DEFAULT_REMINDER_SETTINGS;
}

export function saveReminderSettings(settings: PrayerReminderSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_REMINDER, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving reminder settings', err);
  }
}

export const DEFAULT_PROFILE: UserProfile = {
  id: 'user_1',
  name: '',
  email: '',
  birthDate: '2000-01-01',
  currentAgeYears: 24,
  currentAgeMonths: 0,
  currentAgeDays: 0,
  startAgeYears: 5, // user prompt specifically requested 5 years
  gender: 'male',
  femaleExemptionDaysPerMonth: 0,
  regularlyPrayedYears: 0, // estimated years prayed regularly
  dailyRecoveryRate: 1, // 1 waqt extra per day
  selectedCity: 'dhaka',
  isLoggedIn: false,
  hasCompletedOnboarding: false,
  createdAt: new Date().toISOString(),
};

export function getSavedProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    if (!parsed.hasCompletedOnboarding || parsed.name === 'মুসাফির' || !parsed.name) {
      return { ...DEFAULT_PROFILE, ...parsed, hasCompletedOnboarding: false };
    }
    return parsed;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving profile to localStorage', err);
  }
}

export function getRecoveredDays(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECOVERIES);
    return raw ? Math.max(0, parseInt(raw, 10)) : 0;
  } catch {
    return 0;
  }
}

export function saveRecoveredDays(days: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_RECOVERIES, String(Math.max(0, days)));
  } catch (err) {
    console.error('Error saving recovered days', err);
  }
}

export function getTodayLog(): DailyLog {
  const todayStr = new Date().toISOString().split('T')[0];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DAILY_LOG);
    if (raw) {
      const parsed: DailyLog = JSON.parse(raw);
      if (parsed.date === todayStr) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  return {
    date: todayStr,
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    recoveredQazaWaqts: {
      fajr: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0,
      witr: 0,
    },
  };
}

export function saveTodayLog(log: DailyLog): void {
  try {
    localStorage.setItem(STORAGE_KEY_DAILY_LOG, JSON.stringify(log));
    // Also sync into history
    const history = getPrayerHistory();
    history[log.date] = log;
    savePrayerHistory(history);
  } catch (err) {
    console.error('Error saving today log', err);
  }
}

export function getPrayerHistory(): Record<string, DailyLog> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading prayer history', err);
  }

  // Generate an initial realistic 30-day baseline if empty
  const initialHistory: Record<string, DailyLog> = {};
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Create a realistic habit pattern: higher completion in recent days
    // Days 0-6 (last 7 days): active streak with 5/5
    // Earlier days: occasional 4/5 or 5/5
    const isRecentStreak = i <= 6 && i > 0;
    const isToday = i === 0;

    let f = isRecentStreak ? true : (i % 7 !== 3);
    let dh = isRecentStreak ? true : (i % 5 !== 2);
    let a = isRecentStreak ? true : (i % 6 !== 1);
    let m = isRecentStreak ? true : true;
    let isha = isRecentStreak ? true : (i % 4 !== 0);

    if (isToday) {
      f = true;
      dh = true;
      a = false;
      m = false;
      isha = false;
    }

    initialHistory[dateStr] = {
      date: dateStr,
      fajr: f,
      dhuhr: dh,
      asr: a,
      maghrib: m,
      isha: isha,
      recoveredQazaWaqts: {
        fajr: 0,
        dhuhr: 0,
        asr: 0,
        maghrib: 0,
        isha: 0,
        witr: 0,
      },
    };
  }

  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(initialHistory));
  } catch {
    // ignore
  }

  return initialHistory;
}

export function savePrayerHistory(history: Record<string, DailyLog>): void {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  } catch (err) {
    console.error('Error saving prayer history', err);
  }
}

export function resetAllAppData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    localStorage.removeItem(STORAGE_KEY_RECOVERIES);
    localStorage.removeItem(STORAGE_KEY_DAILY_LOG);
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    localStorage.removeItem('salah_app_hide_startup_modal');
  } catch {
    // ignore
  }
}

