import React, { useState } from 'react';
import {
  Calendar,
  Calculator,
  CheckCircle2,
  AlertCircle,
  Clock,
  Compass,
  Layers,
  ChevronDown,
  Info,
  TrendingDown,
  Sparkles,
  Award,
  Heart,
} from 'lucide-react';
import { UserProfile, LifetimeSalahStats } from '../types';
import { formatNum, calculateAge } from '../utils/islamicPrayerCalc';
import { CircularQazaProgress } from './CircularQazaProgress';
import { Language } from '../utils/translations';

interface LifetimeCalculatorProps {
  profile: UserProfile;
  stats: LifetimeSalahStats;
  useBnDigits: boolean;
  language?: Language;
  onUpdateCustomQaza?: (days: number) => void;
  onOpenAuth: () => void;
  onOpenRecoveryTab: () => void;
}

export const LifetimeCalculator: React.FC<LifetimeCalculatorProps> = ({
  profile,
  stats,
  useBnDigits,
  language = 'bn',
  onOpenAuth,
  onOpenRecoveryTab,
}) => {
  const isBn = language !== 'en';
  const [showFardExplanation, setShowFardExplanation] = useState(false);
  const ageDetail = calculateAge(profile.birthDate);

  const percentageCompleted = stats.totalObligatoryRakats > 0
    ? Math.min(100, Math.round(((stats.prayedRakatsEstimate + stats.recoveredRakats) / stats.totalObligatoryRakats) * 100))
    : 0;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Calculator className="h-4 w-4" />
            <span>{isBn ? 'লাইফটাইম সালাত পরিমাপক ড্যাশবোর্ড' : 'Lifetime Salah Measurement Dashboard'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {isBn ? 'বয়স ও ৫ ওয়াক্ত নামাজের সামগ্রিক হিসাব' : 'Overall Lifetime Salah & Age Calculation'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 font-medium mt-1 max-w-2xl leading-relaxed">
            {isBn
              ? `আপনার বয়স ${formatNum(profile.currentAgeYears, useBnDigits)} বছর (${formatNum(ageDetail.totalDays, useBnDigits)} দিন)। ৫ বছর বয়স থেকে শুরু করে আজ পর্যন্ত আপনার জীবনের ফরজ ও ওয়াজিব নামাজের স্পষ্ট হিসাব।`
              : `Your age is ${formatNum(profile.currentAgeYears, useBnDigits)} years (${formatNum(ageDetail.totalDays, useBnDigits)} days). A comprehensive calculation of obligatory (Fard & Wajib) prayers from age 5 to date.`}
          </p>
        </div>

        <button
          onClick={onOpenAuth}
          className="self-start sm:self-auto text-xs px-3.5 py-2 rounded-xl border border-slate-600 bg-slate-900 text-cyan-300 hover:border-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer font-semibold shadow-sm"
        >
          {isBn ? 'বয়স বা তথ্য পরিবর্তন' : 'Edit Profile / Age'}
        </button>
      </div>

      {/* The Two Main Core Requested Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FIRST REQUESTED COUNTER: Lifetime Total rakats based on whole age */}
        <div className="relative overflow-hidden rounded-2xl border border-cyan-400/50 bg-gradient-to-br from-[#122348] via-[#0d1c3a] to-[#09152b] p-6 shadow-xl hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:-translate-y-1 transition-all duration-300 group">
          <div className="absolute top-0 right-0 p-4 opacity-15 group-hover:opacity-25 pointer-events-none transition-opacity duration-300">
            <Calendar className="h-28 w-28 text-cyan-300" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {isBn ? 'কাউন্ট ১: সামগ্রিক জীবনের নামাজ' : 'Count 1: Lifetime Total Prayers'}
            </span>
            <span className="text-xs text-slate-200 font-semibold bg-slate-900 px-3 py-1 rounded-lg border border-slate-600 shadow-sm">
              {isBn ? 'জন্ম থেকে আজ পর্যন্ত' : 'From Birth to Date'}
            </span>
          </div>

          <div className="mt-4">
            <div className="text-xs text-slate-100 font-medium">
              {isBn
                ? 'বর্তমান বয়স অনুযায়ী প্রতিদিন ৫ ওয়াক্ত (১৭ রাকাত) করে মোট নামাজ:'
                : 'Total prayers based on 5 daily prayers (17 rakats/day) since birth:'}
            </div>
            <div className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-mono-tabular tracking-tight drop-shadow-sm">
              {formatNum(stats.totalRakatsSinceBirth, useBnDigits)}{' '}
              <span className="text-lg sm:text-xl font-semibold text-cyan-300">{isBn ? 'রাকাত' : 'Rakats'}</span>
            </div>
            <div className="text-xs text-slate-200 mt-1.5 font-medium">
              {isBn ? 'ইন টোটাল ওয়াক্ত:' : 'Total Waqts:'}{' '}
              <span className="text-white font-mono-tabular font-bold">
                {formatNum(stats.totalDaysLived * 5, useBnDigits)}
              </span>{' '}
              {isBn ? 'ওয়াক্ত' : 'Waqts'} (<strong className="text-cyan-200">{formatNum(stats.totalDaysLived, useBnDigits)}</strong> {isBn ? 'দিন' : 'Days'})
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-700 text-xs text-slate-200 font-medium flex items-center justify-between">
            <span>{isBn ? 'জীবন অতিবাহিত:' : 'Time Lived:'}</span>
            <span className="font-bold text-white font-mono-tabular">
              {isBn
                ? `${formatNum(ageDetail.years, useBnDigits)} বছর ${formatNum(ageDetail.months, useBnDigits)} মাস ${formatNum(ageDetail.days, useBnDigits)} দিন`
                : `${formatNum(ageDetail.years, useBnDigits)}y ${formatNum(ageDetail.months, useBnDigits)}m ${formatNum(ageDetail.days, useBnDigits)}d`}
            </span>
          </div>
        </div>

        {/* SECOND REQUESTED COUNTER: Missed / Remaining Rakats from age 5 to current age */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-400/60 bg-gradient-to-br from-[#2a1d10]/95 via-[#1c152a] to-[#121930] p-6 shadow-xl hover:border-amber-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:-translate-y-1 transition-all duration-300 group">
          <div className="absolute top-0 right-0 p-4 opacity-15 group-hover:opacity-25 pointer-events-none transition-opacity duration-300">
            <AlertCircle className="h-28 w-28 text-amber-400" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <TrendingDown className="h-4 w-4" />
              {isBn ? 'কাউন্ট ২: অবশিষ্ট বাকি / কাজা নামাজ' : 'Count 2: Remaining Qaza Prayers'}
            </span>
            <span className="text-xs text-amber-200 font-bold bg-amber-950/80 px-3 py-1 rounded-lg border border-amber-500/50 shadow-sm">
              {isBn ? '৫ বছর বয়স থেকে গণনা' : 'Calculated from Age 5'}
            </span>
          </div>

          <div className="mt-4">
            <div className="text-xs text-slate-100 font-medium">
              {isBn
                ? '৫ বছর থেকে আজ পর্যন্ত প্রতিদিন ৫ ওয়াক্ত হিসেবে মোট যত রাকাত কাজা বাকি:'
                : 'Estimated remaining Qaza rakats from age 5 until today:'}
            </div>
            <div className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-amber-300 font-mono-tabular tracking-tight drop-shadow-sm">
              {formatNum(stats.netRemainingRakats, useBnDigits)}{' '}
              <span className="text-lg sm:text-xl font-semibold text-amber-200">{isBn ? 'রাকাত বাকি' : 'Rakats Left'}</span>
            </div>
            <div className="text-xs text-amber-200 mt-1.5 font-medium">
              {isBn ? 'বাকি ওয়াক্ত:' : 'Remaining Waqts:'}{' '}
              <span className="text-white font-mono-tabular font-bold">
                {formatNum(stats.netRemainingDays * 5, useBnDigits)}
              </span>{' '}
              {isBn ? 'ওয়াক্ত' : 'Waqts'} (<strong className="text-amber-200">{formatNum(stats.netRemainingDays, useBnDigits)}</strong> {isBn ? 'দিন' : 'Days'})
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-amber-900/60 flex items-center justify-between text-xs">
            <span className="text-slate-200 font-medium">{isBn ? 'রিকভারি শুরু করতে:' : 'To start recovery:'}</span>
            <button
              onClick={onOpenRecoveryTab}
              className="text-amber-300 hover:text-white font-bold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
            >
              {isBn ? 'সাজেস্টেড রুটিন দেখুন →' : 'View Suggested Routine →'}
            </button>
          </div>
        </div>
      </div>

      {/* Circular Progress Bar Chart (Visualizing Completed vs Backlog) */}
      <CircularQazaProgress stats={stats} useBnDigits={useBnDigits} language={language} />

      {/* Progress & Milestone Overview Bar */}
      <div className="rounded-2xl border border-slate-700/80 bg-[#0e1b36] p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-cyan-400" />
              <span>{isBn ? 'জীবনের নামাজের অগ্রগতি ও আদায়ের হার' : 'Lifetime Salah Progress & Completion Rate'}</span>
            </h3>
            <p className="text-xs text-slate-200 font-medium mt-1">
              {isBn
                ? `মোট বাধ্যবাধকতা (${formatNum(stats.totalObligatoryRakats, useBnDigits)} রাকাত) এর বিপরীতে আপনার বর্তমান অবস্থা`
                : `Your status compared to total obligation (${formatNum(stats.totalObligatoryRakats, useBnDigits)} rakats)`}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold font-mono-tabular text-cyan-300 drop-shadow-sm">
              {formatNum(percentageCompleted, useBnDigits)}%
            </span>
            <span className="text-xs text-slate-300 ml-1 font-medium">{isBn ? 'সম্পন্ন' : 'Completed'}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3.5 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-700/80 flex shadow-inner">
          <div
            style={{ width: `${percentageCompleted}%` }}
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
          />
        </div>

        {/* Sub metrics grid with dynamic colorful presence */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="rounded-xl bg-gradient-to-b from-[#10244c] to-[#0a1733] border border-cyan-400/40 p-3.5 shadow-sm hover:border-cyan-300 transition-colors">
            <span className="text-cyan-200/90 font-medium block">{isBn ? 'মোট ওয়াজিব দিন' : 'Total Obligatory Days'}</span>
            <span className="text-base font-bold text-white font-mono-tabular mt-1 block drop-shadow-sm">
              {formatNum(stats.obligatoryDays, useBnDigits)} {isBn ? 'দিন' : 'Days'}
            </span>
          </div>
          <div className="rounded-xl bg-gradient-to-b from-[#0d2d22] to-[#071d16] border border-emerald-400/40 p-3.5 shadow-sm hover:border-emerald-300 transition-colors">
            <span className="text-emerald-200/90 font-medium block">{isBn ? 'নিয়মিত আদায় করেছেন' : 'Regularly Prayed'}</span>
            <span className="text-base font-bold text-emerald-300 font-mono-tabular mt-1 block drop-shadow-sm">
              {formatNum(stats.prayedRakatsEstimate, useBnDigits)} {isBn ? 'রাকাত' : 'Rakats'}
            </span>
          </div>
          <div className="rounded-xl bg-gradient-to-b from-[#1b1c48] to-[#101233] border border-indigo-400/40 p-3.5 shadow-sm hover:border-indigo-300 transition-colors">
            <span className="text-indigo-200/90 font-medium block">{isBn ? 'কাজা পূরণ করেছেন' : 'Qaza Recovered'}</span>
            <span className="text-base font-bold text-indigo-300 font-mono-tabular mt-1 block drop-shadow-sm">
              {formatNum(stats.recoveredRakats, useBnDigits)} {isBn ? 'রাকাত' : 'Rakats'}
            </span>
          </div>
          <div className="rounded-xl bg-gradient-to-b from-[#2d1b0d] to-[#1c1007] border border-amber-400/40 p-3.5 shadow-sm hover:border-amber-300 transition-colors">
            <span className="text-amber-200/90 font-medium block">{isBn ? 'এখনও বাকি রয়েছে' : 'Still Remaining'}</span>
            <span className="text-base font-bold text-amber-300 font-mono-tabular mt-1 block drop-shadow-sm">
              {formatNum(stats.netRemainingRakats, useBnDigits)} {isBn ? 'রাকাত' : 'Rakats'}
            </span>
          </div>
        </div>
      </div>

      {/* Waqt-by-Waqt Detailed Breakdown Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            <span>{isBn ? 'ওয়াক্তভিত্তিক কাজা নামাজের বিস্তারিত ব্রেকডাউন' : 'Waqt-by-Waqt Qaza Prayer Breakdown'}</span>
          </h3>
          <button
            onClick={() => setShowFardExplanation(!showFardExplanation)}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <Info className="h-3.5 w-3.5" />
            <span>
              {showFardExplanation
                ? isBn ? 'ব্যাখ্যা লুকান' : 'Hide Explanation'
                : isBn ? '১৭ রাকাত কেন?' : 'Why 17 Rakats?'}
            </span>
          </button>
        </div>

        {showFardExplanation && (
          <div className="rounded-xl border border-cyan-900/50 bg-cyan-950/20 p-4 text-xs text-slate-300 space-y-2 animate-in fade-in">
            <p className="font-semibold text-cyan-300">
              {isBn ? 'ইসলামী শরীয়তের বিধান: কাজা কেন শুধুমাত্র ১৭ রাকাত?' : 'Islamic Shariah Rule: Why Qaza is 17 Rakats?'}
            </p>
            <p className="leading-relaxed">
              {isBn
                ? 'নামাজ মিস হলে কেবলমাত্র ফরজ ও ওয়াজিব নামাজের কাজা আদায় করতে হয়। সুন্নাত বা নফল নামাজের কোনো কাজা নেই (ফজরের সুন্নাত ব্যতিরেকে ওয়াক্ত থাকাকালীন)। দৈনিক ১৭ রাকাতের হিসাব: ফজর (২ ফরজ) + যোহর (৪ ফরজ) + আসর (৪ ফরজ) + মাগরিব (৩ ফরজ) + ইশা (৪ ফরজ) + বিতর (৩ ওয়াজিব) = মোট ১৭ রাকাত।'
                : 'When a prayer is missed, only Fard and Wajib prayers must be made up. Sunnah and Nafl prayers do not require Qaza (with the exception of Fajr sunnah during its waqt). Daily 17 Rakats: Fajr (2 Fard) + Dhuhr (4 Fard) + Asr (4 Fard) + Maghrib (3 Fard) + Isha (4 Fard) + Witr (3 Wajib) = 17 Rakats total.'}
            </p>
          </div>
        )}

        {/* 6 Waqt Cards with Celestial Dawn-to-Night Dynamic Color Identity */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Fajr - Mystic Dawn Indigo & Morning Cyan */}
          <div className="rounded-xl border border-indigo-400/50 bg-gradient-to-b from-[#181d45] via-[#101435] to-[#090d24] p-4 text-center hover:border-cyan-300 hover:bg-[#1f2558] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(99,102,241,0.35)] transition-all duration-300 cursor-pointer shadow-md group">
            <span className="text-xs font-bold text-indigo-100 group-hover:text-white transition-colors">{isBn ? 'ফজর' : 'Fajr'}</span>
            <div className="mt-1 text-xs text-cyan-300 font-bold">{isBn ? '২ রাকাত ফরজ' : '2 Rakats Fard'}</div>
            <div className="mt-2.5 text-xl font-extrabold text-white font-mono-tabular drop-shadow-sm">
              {formatNum(stats.breakdown.fajr, useBnDigits)}
            </div>
            <div className="text-xs text-cyan-200 font-medium mt-0.5">{isBn ? 'রাকাত বাকি' : 'Rakats Left'}</div>
            <div className="mt-2 text-xs text-white bg-indigo-950 py-1 rounded-lg border border-indigo-400/60 font-bold font-mono-tabular">
              {formatNum(stats.netRemainingDays, useBnDigits)} {isBn ? 'ওয়াক্ত' : 'Waqts'}
            </div>
          </div>

          {/* Dhuhr - Midday Solar Azure & Sunburst Gold */}
          <div className="rounded-xl border border-sky-400/50 bg-gradient-to-b from-[#102b52] via-[#0b1f3c] to-[#061428] p-4 text-center hover:border-sky-300 hover:bg-[#16386a] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(56,189,248,0.35)] transition-all duration-300 cursor-pointer shadow-md group">
            <span className="text-xs font-bold text-sky-100 group-hover:text-white transition-colors">{isBn ? 'যোহর' : 'Dhuhr'}</span>
            <div className="mt-1 text-xs text-amber-300 font-bold">{isBn ? '৪ রাকাত ফরজ' : '4 Rakats Fard'}</div>
            <div className="mt-2.5 text-xl font-extrabold text-white font-mono-tabular drop-shadow-sm">
              {formatNum(stats.breakdown.dhuhr, useBnDigits)}
            </div>
            <div className="text-xs text-sky-200 font-medium mt-0.5">{isBn ? 'রাকাত বাকি' : 'Rakats Left'}</div>
            <div className="mt-2 text-xs text-white bg-sky-950 py-1 rounded-lg border border-sky-400/60 font-bold font-mono-tabular">
              {formatNum(stats.netRemainingDays, useBnDigits)} {isBn ? 'ওয়াক্ত' : 'Waqts'}
            </div>
          </div>

          {/* Asr - Golden Hour Warm Amber & Terracotta */}
          <div className="rounded-xl border border-amber-400/50 bg-gradient-to-b from-[#2e1d0d] via-[#1f1308] to-[#120a04] p-4 text-center hover:border-amber-300 hover:bg-[#3d2711] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(245,158,11,0.35)] transition-all duration-300 cursor-pointer shadow-md group">
            <span className="text-xs font-bold text-amber-100 group-hover:text-white transition-colors">{isBn ? 'আসর' : 'Asr'}</span>
            <div className="mt-1 text-xs text-amber-300 font-bold">{isBn ? '৪ রাকাত ফরজ' : '4 Rakats Fard'}</div>
            <div className="mt-2.5 text-xl font-extrabold text-white font-mono-tabular drop-shadow-sm">
              {formatNum(stats.breakdown.asr, useBnDigits)}
            </div>
            <div className="text-xs text-amber-200 font-medium mt-0.5">{isBn ? 'রাকাত বাকি' : 'Rakats Left'}</div>
            <div className="mt-2 text-xs text-white bg-amber-950 py-1 rounded-lg border border-amber-400/60 font-bold font-mono-tabular">
              {formatNum(stats.netRemainingDays, useBnDigits)} {isBn ? 'ওয়াক্ত' : 'Waqts'}
            </div>
          </div>

          {/* Maghrib - Sunset Crimson Ruby & Twilight Dusk */}
          <div className="rounded-xl border border-rose-400/50 bg-gradient-to-b from-[#34121f] via-[#230b14] to-[#13050b] p-4 text-center hover:border-rose-300 hover:bg-[#46192a] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(244,63,94,0.35)] transition-all duration-300 cursor-pointer shadow-md group">
            <span className="text-xs font-bold text-rose-100 group-hover:text-white transition-colors">{isBn ? 'মাগরিব' : 'Maghrib'}</span>
            <div className="mt-1 text-xs text-rose-300 font-bold">{isBn ? '৩ রাকাত ফরজ' : '3 Rakats Fard'}</div>
            <div className="mt-2.5 text-xl font-extrabold text-white font-mono-tabular drop-shadow-sm">
              {formatNum(stats.breakdown.maghrib, useBnDigits)}
            </div>
            <div className="text-xs text-rose-200 font-medium mt-0.5">{isBn ? 'রাকাত বাকি' : 'Rakats Left'}</div>
            <div className="mt-2 text-xs text-white bg-rose-950 py-1 rounded-lg border border-rose-400/60 font-bold font-mono-tabular">
              {formatNum(stats.netRemainingDays, useBnDigits)} {isBn ? 'ওয়াক্ত' : 'Waqts'}
            </div>
          </div>

          {/* Isha - Deep Celestial Midnight Cobalt */}
          <div className="rounded-xl border border-blue-400/50 bg-gradient-to-b from-[#102046] via-[#0a1530] to-[#050c1c] p-4 text-center hover:border-cyan-300 hover:bg-[#172b5c] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(59,130,246,0.35)] transition-all duration-300 cursor-pointer shadow-md group">
            <span className="text-xs font-bold text-blue-100 group-hover:text-white transition-colors">{isBn ? 'ইশা' : 'Isha'}</span>
            <div className="mt-1 text-xs text-cyan-300 font-bold">{isBn ? '৪ রাকাত ফরজ' : '4 Rakats Fard'}</div>
            <div className="mt-2.5 text-xl font-extrabold text-white font-mono-tabular drop-shadow-sm">
              {formatNum(stats.breakdown.isha, useBnDigits)}
            </div>
            <div className="text-xs text-blue-200 font-medium mt-0.5">{isBn ? 'রাকাত বাকি' : 'Rakats Left'}</div>
            <div className="mt-2 text-xs text-white bg-blue-950 py-1 rounded-lg border border-blue-400/60 font-bold font-mono-tabular">
              {formatNum(stats.netRemainingDays, useBnDigits)} {isBn ? 'ওয়াক্ত' : 'Waqts'}
            </div>
          </div>

          {/* Witr - Sacred Royal Amethyst & Gilded Gold */}
          <div className="rounded-xl border border-purple-400/50 bg-gradient-to-b from-[#26103c] via-[#190a28] to-[#0e0517] p-4 text-center hover:border-amber-300 hover:bg-[#341752] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(168,85,247,0.35)] transition-all duration-300 cursor-pointer shadow-md group">
            <span className="text-xs font-bold text-purple-100 group-hover:text-white transition-colors">{isBn ? 'বিতর' : 'Witr'}</span>
            <div className="mt-1 text-xs text-amber-300 font-bold">{isBn ? '৩ রাকাত ওয়াজিব' : '3 Rakats Wajib'}</div>
            <div className="mt-2.5 text-xl font-extrabold text-white font-mono-tabular drop-shadow-sm">
              {formatNum(stats.breakdown.witr, useBnDigits)}
            </div>
            <div className="text-xs text-purple-200 font-medium mt-0.5">{isBn ? 'রাকাত বাকি' : 'Rakats Left'}</div>
            <div className="mt-2 text-xs text-white bg-purple-950 py-1 rounded-lg border border-purple-400/60 font-bold font-mono-tabular">
              {formatNum(stats.netRemainingDays, useBnDigits)} {isBn ? 'ওয়াক্ত' : 'Waqts'}
            </div>
          </div>
        </div>
      </div>

      {/* Respectful & Humble Methodology Callout Card */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0c172e] via-[#091122] to-[#060c18] p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
            <Heart className="h-5 w-5 text-cyan-400" />
          </span>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400 block">
              {isBn ? 'হিসাবের মূল উদ্দেশ্য ও বিনম্র ভাবনা' : 'Purpose of Calculation & Humble Perspective'}
            </span>
            <h4 className="text-base font-bold text-white">
              {isBn ? 'কেন সর্বোচ্চ সম্ভাব্য রাকাতের ভিত্তিতে এই কাজা হিসাব?' : 'Why is this Qaza estimate based on maximum potential deficit?'}
            </h4>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-300 space-y-3 leading-relaxed">
          <p>
            {isBn
              ? 'আমরা মানুষের জীবনে নানাবিধ ব্যস্ততা, অপারগতা বা পরিস্থিতির কারণে বিভিন্ন সময়ে নামাজ যথাযথভাবে আদায় করা সম্ভব নাও হতে পারে। অনেক সময় হয়তো কোনো ওয়াক্ত ছুটে যায়, আবার অনেক সময় নামাজ আদায় করলেও তা ত্রুটিহীনভাবে কবুল হওয়ার উপযুক্ত হয়েছিল কিনা—সে বিষয়েও মনে সংশয় বা শঙ্কা কাজ করতে পারে।'
              : 'Throughout our lives, various circumstances, busy routines, or oversights may lead to missed prayers. Sometimes waqts are missed unintentionally, and at other times we may worry whether our prayers were offered with proper perfection.'}
          </p>
          <p>
            {isBn
              ? 'সেই আত্মশুদ্ধিমূলক ও সতর্কতামূলক প্রেক্ষাপট বিবেচনা করেই—৫ বছর বয়স থেকে শুরু করে বর্তমান সময় পর্যন্ত পুরো জীবনযাত্রায় সর্বোচ্চ যত সংখ্যক রাকাত সালাতে অনিচ্ছাকৃত অপূর্ণতা বা বিচ্যুতি হওয়ার সম্ভাবনা থাকতে পারে, সেই সর্বোচ্চ সম্ভাব্য রাকাতের আদলেই মূলত এই কাজা হিসাবটি প্রস্তুত করা হয়েছে।'
              : 'With this mindful and cautious intention, this calculation estimates the maximum possible shortfall from age 5 to today so you can systematically recover your prayers and strive for complete freedom from debt before Allah.'}
          </p>
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-100 font-medium">
            {isBn
              ? 'ইনশাআল্লাহ, যদি আপনি নিয়মতান্ত্রিক ও ধারাবাহিক রুটিনে এই কাজাগুলো নিষ্ঠার সাথে সম্পন্ন করে যেতে পারেন, তবে আল্লাহর অসীম রহমতে কেয়ামতের দিন নামাজ ছুটে যাওয়ার দায়বদ্ধতা থেকে মুক্ত থাকার আশা রাখতে পারবেন। আর বর্তমানে ও ভবিষ্যতে নামাজের প্রতি অবিচল ও ধারাবাহিক (Consistent) হতে পারলে ইহকালে আত্মিক শান্তি এবং পরকালে অনন্ত সুন্দর আখিরাত নসিব হবে, ইনশাআল্লাহ।'
              : 'InshaAllah, with a disciplined and consistent daily routine, you can look forward to standing before Allah free from missed prayer liabilities by His infinite mercy, attaining peace in this world and eternal bliss in the Hereafter.'}
          </div>
        </div>
      </div>
    </div>
  );
};
