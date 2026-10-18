export interface UserProfile {
  id: string;
  name: string;
  email: string;
  birthDate: string; // YYYY-MM-DD
  currentAgeYears: number;
  currentAgeMonths: number;
  currentAgeDays: number;
  startAgeYears: number; // default 5 years as requested
  gender: 'male' | 'female';
  femaleExemptionDaysPerMonth: number; // e.g. 7 days average per month if female
  regularlyPrayedYears: number; // estimated years user was regular
  customQazaDays?: number; // optional manual override
  dailyRecoveryRate: number; // how many days of qaza to pray daily (default 1)
  targetCompletionMonths?: number;
  selectedCity: string;
  isLoggedIn: boolean;
  hasCompletedOnboarding?: boolean;
  createdAt: string;
}

export interface WaqtBreakdown {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
  witr: number;
}

export interface LifetimeSalahStats {
  totalDaysLived: number;
  totalRakatsSinceBirth: number;
  obligatoryDays: number; // days since age 5 (or startAge)
  totalObligatoryRakats: number;
  totalObligatoryWaqts: number;
  prayedDaysEstimate: number;
  prayedRakatsEstimate: number;
  missedDays: number;
  missedRakats: number;
  missedWaqts: number;
  breakdown: WaqtBreakdown;
  recoveredRakats: number;
  recoveredDays: number;
  netRemainingDays: number;
  netRemainingRakats: number;
}

export interface PrayerTimeItem {
  id: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'tahajjud';
  nameBn: string;
  nameEn: string;
  rakatsFard: number;
  rakatsSunnah: number;
  rakatsTotal: number;
  timeString: string;
  dateObj: Date;
  isNext?: boolean;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  recoveredQazaWaqts: {
    fajr: number;
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
    witr: number;
  };
}

export type DailyPrayerHistory = Record<string, DailyLog>;

export interface PrayerReminderSettings {
  enabled: boolean;
  soundEnabled: boolean;
  volume: number; // 0 to 1
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  alarmSoundType: 'madinah' | 'makkah' | 'quds' | 'dawnChime' | 'harmonic' | 'adhan' | 'softBell' | 'chime';
  leadTimeMinutes?: number; // 0 for exact time, or minutes before
}

export interface WaqtHadithItem {
  waqtId: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  waqtNameBn: string;
  title: string;
  arabicText?: string;
  banglaTranslation: string;
  narrator?: string;
  reference: string;
  virtueDescription: string;
}
