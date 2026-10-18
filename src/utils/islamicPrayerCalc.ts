import { UserProfile, LifetimeSalahStats, PrayerTimeItem } from '../types';

// Convert English numerals to Bengali digits
export function toBengaliNumber(num: number | string): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/[0-9]/g, (d) => banglaDigits[parseInt(d, 10)]);
}

// Format numbers with comma separators
export function formatNum(num: number, useBn = true): string {
  const rounded = Math.round(num);
  const formatted = rounded.toLocaleString('en-US');
  return useBn ? toBengaliNumber(formatted) : formatted;
}

// Calculate precise age from birth date
export function calculateAge(birthDateStr: string): { years: number; months: number; days: number; totalDays: number } {
  const birth = new Date(birthDateStr);
  const today = new Date();
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffTime = Math.max(0, today.getTime() - birth.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalDays: Math.max(0, totalDays),
  };
}

// Core lifetime calculation
export function calculateLifetimeSalah(
  profile: UserProfile,
  totalRecoveredDays = 0
): LifetimeSalahStats {
  const age = calculateAge(profile.birthDate);
  const totalDaysLived = age.totalDays;

  // Total rakats if calculated for the whole life from birth (as requested by user)
  // 17 Fard & Wajib rakats per day (2+4+4+3+4+3)
  const totalRakatsSinceBirth = totalDaysLived * 17;

  // Obligation starts from age 5 (or user defined startAgeYears)
  const startDays = Math.round(profile.startAgeYears * 365.25);
  let obligatoryDays = Math.max(0, totalDaysLived - startDays);

  // Female exemption (approx 7 days/month during menstrual cycles)
  if (profile.gender === 'female' && profile.femaleExemptionDaysPerMonth > 0) {
    const monthsOfObligation = obligatoryDays / 30.4375;
    const exemptDays = Math.round(monthsOfObligation * profile.femaleExemptionDaysPerMonth);
    obligatoryDays = Math.max(0, obligatoryDays - exemptDays);
  }

  // Days user already prayed regularly
  const prayedDaysEstimate = Math.min(obligatoryDays, Math.round(profile.regularlyPrayedYears * 365.25));
  const prayedRakatsEstimate = prayedDaysEstimate * 17;

  // Missed days
  let missedDays = Math.max(0, obligatoryDays - prayedDaysEstimate);
  if (profile.customQazaDays !== undefined && profile.customQazaDays >= 0) {
    missedDays = profile.customQazaDays;
  }

  const missedRakats = missedDays * 17;
  const missedWaqts = missedDays * 5;

  const totalObligatoryRakats = obligatoryDays * 17;
  const totalObligatoryWaqts = obligatoryDays * 5;

  // Remaining after current recoveries
  const netRemainingDays = Math.max(0, missedDays - totalRecoveredDays);
  const netRemainingRakats = netRemainingDays * 17;

  // Waqt breakdown for missed (or remaining)
  const breakdown = {
    fajr: netRemainingDays * 2,    // 2 Farz
    dhuhr: netRemainingDays * 4,   // 4 Farz
    asr: netRemainingDays * 4,     // 4 Farz
    maghrib: netRemainingDays * 3, // 3 Farz
    isha: netRemainingDays * 4,    // 4 Farz
    witr: netRemainingDays * 3,    // 3 Wajib
  };

  return {
    totalDaysLived,
    totalRakatsSinceBirth,
    obligatoryDays,
    totalObligatoryRakats,
    totalObligatoryWaqts,
    prayedDaysEstimate,
    prayedRakatsEstimate,
    missedDays,
    missedRakats,
    missedWaqts,
    breakdown,
    recoveredRakats: totalRecoveredDays * 17,
    recoveredDays: totalRecoveredDays,
    netRemainingDays,
    netRemainingRakats,
  };
}

// Plan calculation for recovery
export interface RecoveryPlan {
  dailyRate: number; // how many days recovered per active day (e.g. 1 means 1 extra waqt with every daily waqt)
  extraRakatsPerDay: number; // e.g. 17 rakats
  estimatedDaysNeeded: number;
  projectedEndDate: Date;
  monthlyRecoveredDays: number;
  fajrExtra: number;
  dhuhrExtra: number;
  asrExtra: number;
  maghribExtra: number;
  ishaExtra: number;
  witrExtra: number;
}

export function calculateRecoveryPlan(remainingDays: number, dailyRate: number): RecoveryPlan {
  const safeRate = Math.max(0.2, dailyRate);
  const estimatedDaysNeeded = Math.ceil(remainingDays / safeRate);
  
  const projectedEndDate = new Date();
  projectedEndDate.setDate(projectedEndDate.getDate() + estimatedDaysNeeded);

  return {
    dailyRate: safeRate,
    extraRakatsPerDay: Math.round(safeRate * 17),
    estimatedDaysNeeded,
    projectedEndDate,
    monthlyRecoveredDays: Math.round(safeRate * 30),
    fajrExtra: Math.round(safeRate * 2),
    dhuhrExtra: Math.round(safeRate * 4),
    asrExtra: Math.round(safeRate * 4),
    maghribExtra: Math.round(safeRate * 3),
    ishaExtra: Math.round(safeRate * 4),
    witrExtra: Math.round(safeRate * 3),
  };
}

// City coordinates for accurate Bangladesh prayer calculation
export interface CityCoords {
  nameBn: string;
  nameEn: string;
  lat: number;
  lng: number;
  timeOffsetMinutes: number; // relative to Dhaka
}

export const BANGLADESH_CITIES: Record<string, CityCoords> = {
  dhaka: { nameBn: 'ঢাকা', nameEn: 'Dhaka', lat: 23.8103, lng: 90.4125, timeOffsetMinutes: 0 },
  chittagong: { nameBn: 'চট্টগ্রাম', nameEn: 'Chattogram', lat: 22.3569, lng: 91.7832, timeOffsetMinutes: -5 },
  sylhet: { nameBn: 'সিলেট', nameEn: 'Sylhet', lat: 24.8949, lng: 91.8687, timeOffsetMinutes: -6 },
  rajshahi: { nameBn: 'রাজশাহী', nameEn: 'Rajshahi', lat: 24.3636, lng: 88.6241, timeOffsetMinutes: 7 },
  khulna: { nameBn: 'খুলনা', nameEn: 'Khulna', lat: 22.8456, lng: 89.5403, timeOffsetMinutes: 4 },
  barishal: { nameBn: 'বরিশাল', nameEn: 'Barishal', lat: 22.7010, lng: 90.3535, timeOffsetMinutes: 1 },
  rangpur: { nameBn: 'রংপুর', nameEn: 'Rangpur', lat: 25.7439, lng: 89.2752, timeOffsetMinutes: 5 },
  mymensingh: { nameBn: 'ময়মনসিংহ', nameEn: 'Mymensingh', lat: 24.7471, lng: 90.4203, timeOffsetMinutes: 0 },
};

// Calculate approximate daily prayer times for today based on city
export function getDailyPrayerTimes(cityKey = 'dhaka', baseDate = new Date()): PrayerTimeItem[] {
  const city = BANGLADESH_CITIES[cityKey] || BANGLADESH_CITIES.dhaka;
  const offset = city.timeOffsetMinutes;

  // Base Dhaka approximate timings for standard Islamic calendar seasons
  // Using an astronomical base curve with minute offset
  const now = new Date(baseDate);
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // Seasonal variation in minutes
  const seasonalFajr = Math.round(18 * Math.sin((dayOfYear + 70) * (2 * Math.PI / 365)));
  const seasonalMaghrib = Math.round(25 * Math.sin((dayOfYear - 80) * (2 * Math.PI / 365)));

  // Nominal times in hours:minutes (24h)
  const fajrMin = 4 * 60 + 40 - seasonalFajr + offset;
  const sunriseMin = 6 * 60 + 0 - seasonalFajr + offset;
  const dhuhrMin = 12 * 60 + 0 + offset;
  const asrMin = 15 * 60 + 45 + Math.round(seasonalMaghrib * 0.5) + offset;
  const maghribMin = 18 * 60 + 0 + seasonalMaghrib + offset;
  const ishaMin = 19 * 60 + 15 + seasonalMaghrib + offset;
  const tahajjudMin = 3 * 60 + 30 + offset;

  const makeDate = (totalMinutes: number) => {
    const d = new Date(baseDate);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    d.setHours(hrs, mins, 0, 0);
    return d;
  };

  const formatTime = (d: Date) => {
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    const strHours = hours < 10 ? '0' + hours : hours;
    return `${strHours}:${strMinutes} ${ampm}`;
  };

  const times: PrayerTimeItem[] = [
    {
      id: 'fajr',
      nameBn: 'ফজর',
      nameEn: 'Fajr',
      rakatsFard: 2,
      rakatsSunnah: 2,
      rakatsTotal: 4,
      dateObj: makeDate(fajrMin),
      timeString: formatTime(makeDate(fajrMin)),
    },
    {
      id: 'sunrise',
      nameBn: 'সূর্যোদয় (ইশরাক)',
      nameEn: 'Sunrise',
      rakatsFard: 0,
      rakatsSunnah: 2,
      rakatsTotal: 2,
      dateObj: makeDate(sunriseMin),
      timeString: formatTime(makeDate(sunriseMin)),
    },
    {
      id: 'dhuhr',
      nameBn: 'যোহর',
      nameEn: 'Dhuhr',
      rakatsFard: 4,
      rakatsSunnah: 6,
      rakatsTotal: 10,
      dateObj: makeDate(dhuhrMin),
      timeString: formatTime(makeDate(dhuhrMin)),
    },
    {
      id: 'asr',
      nameBn: 'আসর',
      nameEn: 'Asr',
      rakatsFard: 4,
      rakatsSunnah: 0,
      rakatsTotal: 4,
      dateObj: makeDate(asrMin),
      timeString: formatTime(makeDate(asrMin)),
    },
    {
      id: 'maghrib',
      nameBn: 'মাগরিব',
      nameEn: 'Maghrib',
      rakatsFard: 3,
      rakatsSunnah: 2,
      rakatsTotal: 5,
      dateObj: makeDate(maghribMin),
      timeString: formatTime(makeDate(maghribMin)),
    },
    {
      id: 'isha',
      nameBn: 'ইশা ও বিতর',
      nameEn: 'Isha & Witr',
      rakatsFard: 4,
      rakatsSunnah: 5, // 2 Sunnah + 3 Witr Wajib
      rakatsTotal: 9,
      dateObj: makeDate(ishaMin),
      timeString: formatTime(makeDate(ishaMin)),
    },
  ];

  // Determine which is next prayer
  const currentTime = now.getTime();
  let nextFound = false;
  for (const t of times) {
    if (t.dateObj.getTime() > currentTime) {
      t.isNext = true;
      nextFound = true;
      break;
    }
  }
  // If all passed today, next is Fajr tomorrow
  if (!nextFound && times.length > 0) {
    times[0].isNext = true;
  }

  return times;
}

// Convert Gregorian to approximate Hijri date
export function getApproximateHijriDate(date = new Date(), isBn = true): string {
  // Approximate Hijri conversion for Bangladesh
  try {
    const locale = isBn ? 'bn-BD-u-ca-islamic-umalqura' : 'en-US-u-ca-islamic-umalqura';
    const intlFormat = new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return intlFormat.format(date);
  } catch {
    return isBn ? 'হিজরি ১৪৪৭' : '1447 AH';
  }
}
