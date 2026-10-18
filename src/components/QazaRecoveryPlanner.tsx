import React, { useState } from 'react';
import {
  CalendarClock,
  Sparkles,
  CheckCircle,
  Plus,
  Minus,
  RotateCcw,
  Target,
  Flame,
  ArrowRight,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Clock,
  Check,
} from 'lucide-react';
import { UserProfile, LifetimeSalahStats } from '../types';
import { calculateRecoveryPlan, formatNum, toBengaliNumber } from '../utils/islamicPrayerCalc';
import { RechartsQazaRecoveryProgress } from './RechartsQazaRecoveryProgress';
import { Language } from '../utils/translations';

interface QazaRecoveryPlannerProps {
  profile: UserProfile;
  stats: LifetimeSalahStats;
  useBnDigits: boolean;
  language?: Language;
  onLogRecoveryDays: (daysToAdd: number) => void;
  onResetRecovery: () => void;
}

export const QazaRecoveryPlanner: React.FC<QazaRecoveryPlannerProps> = ({
  profile,
  stats,
  useBnDigits,
  language = 'bn',
  onLogRecoveryDays,
  onResetRecovery,
}) => {
  const isBn = language !== 'en';
  const [selectedRate, setSelectedRate] = useState<number>(profile.dailyRecoveryRate || 1);
  const [targetYears, setTargetYears] = useState<number>(3);
  const [logSuccessMessage, setLogSuccessMessage] = useState<string | null>(null);

  const plan = calculateRecoveryPlan(stats.netRemainingDays, selectedRate);

  // Quick preset targets
  const handlePaceChange = (rate: number) => {
    setSelectedRate(rate);
  };

  const handleTargetYearChange = (years: number) => {
    setTargetYears(years);
    const totalDays = years * 365.25;
    const rate = Math.max(0.2, parseFloat((stats.netRemainingDays / totalDays).toFixed(2)));
    setSelectedRate(rate);
  };

  const handleLogDay = (days: number) => {
    onLogRecoveryDays(days);
    const msg = days > 0
      ? isBn
        ? `আলহামদুলিল্লাহ! ${formatNum(days, useBnDigits)} দিনের কাজা (${formatNum(days * 17, useBnDigits)} রাকাত) সফলভাবে সম্পন্ন হয়েছে!`
        : `Alhamdulillah! ${formatNum(days, useBnDigits)} day(s) of Qaza (${formatNum(days * 17, useBnDigits)} rakats) logged successfully!`
      : isBn
        ? `কাজা হিসাব থেকে ${formatNum(Math.abs(days), useBnDigits)} দিন কমানো হয়েছে।`
        : `Reduced ${formatNum(Math.abs(days), useBnDigits)} day(s) from Qaza log.`;
    setLogSuccessMessage(msg);
    setTimeout(() => {
      setLogSuccessMessage(null);
    }, 4000);
  };

  const endDateString = plan.projectedEndDate.toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <Target className="h-4 w-4" />
            <span>{isBn ? 'সাজেস্টেড রুটিন ও রিকভারি প্ল্যানার' : 'Suggested Routine & Recovery Planner'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {isBn ? 'ধারাবাহিক রুটিনে কাজা আদায় ও দায়িত্বমুক্তির পরিকল্পনা' : 'Structured Routine for Qaza Recovery & Debt Clearance'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 font-medium mt-1 max-w-2xl leading-relaxed">
            {isBn
              ? 'প্রতিদিন সহজ ও ভারসাম্যপূর্ণ রুটিনে সামান্য কিছু অতিরিক্ত কাজা রাকাত আদায় করে জীবনের সম্ভাব্য অপূর্ণতাগুলো পূরণ করার এবং নামাজ ছুটে যাওয়ার দায় থেকে আল্লাহর রহমতে মুক্ত থাকার একটি আন্তরিক প্রচেষ্টা।'
              : 'A sincere effort to fulfill potential life prayer deficiencies by systematically praying a few extra Qaza rakats daily with ease and balance.'}
          </p>
        </div>

        {/* Total remaining badge */}
        <div className="rounded-xl border border-amber-400/50 bg-amber-950/40 px-4 py-2.5 text-right shadow-sm">
          <span className="text-xs text-amber-200 font-bold block">{isBn ? 'মোট কাজা বাকি' : 'Total Qaza Remaining'}</span>
          <span className="text-lg font-extrabold text-amber-300 font-mono-tabular">
            {formatNum(stats.netRemainingDays, useBnDigits)} {isBn ? 'দিন' : 'Days'}
          </span>
          <span className="text-xs text-slate-200 block font-mono-tabular font-medium">
            ({formatNum(stats.netRemainingRakats, useBnDigits)} {isBn ? 'রাকাত' : 'Rakats'})
          </span>
        </div>
      </div>

      {/* Success Banner */}
      {logSuccessMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-200 text-xs sm:text-sm animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          <span>{logSuccessMessage}</span>
        </div>
      )}

      {/* Recharts Qaza Recovery Circular Progress & Stacked Bar Analytics */}
      <RechartsQazaRecoveryProgress stats={stats} useBnDigits={useBnDigits} />

      {/* Routine Pace Selection */}
      <div className="rounded-2xl border border-slate-800 bg-[#09101f] p-6 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-cyan-400" />
            <span>{isBn ? '১. আপনার পছন্দসই কাজা আদায়ের গতি নির্ধারণ করুন' : '1. Choose Your Preferred Recovery Pace'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isBn ? 'আপনি প্রতিদিন কত দ্রুত কাজা আদায় করতে সক্ষম তা বাছাই করুন' : 'Select how fast you would like to complete your missed prayers'}
          </p>
        </div>

        {/* Pace Preset Buttons with Dynamic Color Themes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Rate 1 - Emerald & Jade Tone */}
          <button
            type="button"
            onClick={() => handlePaceChange(1)}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer hover:-translate-y-0.5 shadow-sm ${
              selectedRate === 1
                ? 'border-emerald-400 bg-gradient-to-b from-[#0e2c22] to-[#071913] shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                : 'border-slate-700/80 bg-[#0e1b36] hover:border-emerald-400 hover:bg-[#12243d]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${selectedRate === 1 ? 'text-emerald-300' : 'text-slate-300'}`}>{isBn ? '১ গুণ গতি (জনপ্রিয়)' : '1x Pace (Popular)'}</span>
              {selectedRate === 1 && <Check className="h-4 w-4 text-emerald-400" />}
            </div>
            <div className="mt-2 text-lg font-extrabold text-white font-mono-tabular">
              {isBn ? 'প্রতি ওয়াক্তে ১ কাজা' : '1 Qaza with Each Waqt'}
            </div>
            <div className="text-xs text-slate-200 font-medium mt-1">
              {isBn ? 'দিনে ১৭ রাকাত কাজা = ১ দিনের কাজা শেষ' : '17 rakats/day = 1 day cleared daily'}
            </div>
          </button>

          {/* Rate 2 - Cyan & Sky Tone */}
          <button
            type="button"
            onClick={() => handlePaceChange(2)}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer hover:-translate-y-0.5 shadow-sm ${
              selectedRate === 2
                ? 'border-cyan-400 bg-gradient-to-b from-[#102748] to-[#08172c] shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                : 'border-slate-700/80 bg-[#0e1b36] hover:border-cyan-400 hover:bg-[#12243d]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${selectedRate === 2 ? 'text-cyan-300' : 'text-slate-300'}`}>{isBn ? '২ গুণ দ্রুত গতি' : '2x Pace (Fast)'}</span>
              {selectedRate === 2 && <Check className="h-4 w-4 text-cyan-400" />}
            </div>
            <div className="mt-2 text-lg font-extrabold text-white font-mono-tabular">
              {isBn ? 'প্রতি ওয়াক্তে ২ কাজা' : '2 Qazas with Each Waqt'}
            </div>
            <div className="text-xs text-slate-200 font-medium mt-1">
              {isBn ? 'দিনে ৩৪ রাকাত কাজা = ২ দিনের কাজা শেষ' : '34 rakats/day = 2 days cleared daily'}
            </div>
          </button>

          {/* Rate 0.5 - Indigo & Violet Tone */}
          <button
            type="button"
            onClick={() => handlePaceChange(0.5)}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer hover:-translate-y-0.5 shadow-sm ${
              selectedRate === 0.5
                ? 'border-indigo-400 bg-gradient-to-b from-[#1c1d48] to-[#0d0f28] shadow-[0_0_20px_rgba(99,102,241,0.35)]'
                : 'border-slate-700/80 bg-[#0e1b36] hover:border-indigo-400 hover:bg-[#12243d]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold ${selectedRate === 0.5 ? 'text-indigo-300' : 'text-slate-300'}`}>{isBn ? 'সহজ গতি (অর্ধেক)' : 'Gentle Pace (Half)'}</span>
              {selectedRate === 0.5 && <Check className="h-4 w-4 text-indigo-400" />}
            </div>
            <div className="mt-2 text-lg font-extrabold text-white font-mono-tabular">
              {isBn ? '২ দিনে ১ কাজা' : '1 Qaza every 2 days'}
            </div>
            <div className="text-xs text-slate-200 font-medium mt-1">
              {isBn ? 'দিনে ৮-৯ রাকাত কাজা = চাপমুক্ত রুটিন' : '8-9 rakats/day = Relaxed routine'}
            </div>
          </button>

          {/* Custom Target by Year - Amber & Gold Tone */}
          <div className="p-3.5 rounded-xl border border-amber-500/35 bg-gradient-to-b from-[#22160a] to-[#120c05] shadow-sm">
            <span className="text-xs font-bold text-amber-200 block mb-1">
              {isBn ? 'টার্গেট বছর অনুযায়ী গতি' : 'Target Completion Years'}
            </span>
            <div className="flex gap-1.5 mt-2">
              {[1, 2, 3, 5].map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => handleTargetYearChange(yr)}
                  className={`flex-1 py-1 text-xs rounded font-bold transition-colors cursor-pointer ${
                    targetYears === yr
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-200 hover:text-white'
                  }`}
                >
                  {formatNum(yr, useBnDigits)}y
                </button>
              ))}
            </div>
            <span className="text-xs text-amber-300 mt-2 block font-mono-tabular font-medium">
              {isBn ? 'দৈনিক হার:' : 'Daily rate:'} {formatNum(selectedRate, useBnDigits)} {isBn ? 'দিন/দিন' : 'day/day'}
            </span>
          </div>
        </div>

        {/* Projected Completion Highlight Card */}
        <div className="rounded-2xl border border-cyan-400/40 bg-gradient-to-r from-[#122345] via-[#0d1a36] to-[#09152b] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>{isBn ? 'প্রত্যাশিত সমাপ্তির তারিখ (Projected Milestone)' : 'Projected Completion Milestone'}</span>
            </div>
            <div className="mt-1.5 text-xl sm:text-2xl font-black text-white">
              {isBn ? 'ইনশাআল্লাহ,' : 'InshaAllah, by'} <span className="text-cyan-300 drop-shadow-sm">{endDateString}</span>
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed mt-1">
              {isBn
                ? `যদি আপনি প্রতিদিন নিয়মিত ${formatNum(plan.extraRakatsPerDay, useBnDigits)} রাকাত করে অতিরিক্ত কাজা আদায় করেন, তবে প্রায় ${formatNum(plan.estimatedDaysNeeded, useBnDigits)} দিনের মধ্যে সমস্ত নামাজ সম্পন্ন হয়ে যাবে।`
                : `By performing ${formatNum(plan.extraRakatsPerDay, useBnDigits)} extra Qaza rakats daily, all missed prayers will be completed in approximately ${formatNum(plan.estimatedDaysNeeded, useBnDigits)} days.`}
            </p>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-xs text-slate-300 font-semibold block">{isBn ? 'প্রতি মাসে পুনরুদ্ধার' : 'Monthly Recovery'}</span>
            <span className="text-xl font-black text-emerald-300 font-mono-tabular drop-shadow-sm">
              +{formatNum(plan.monthlyRecoveredDays, useBnDigits)} {isBn ? 'দিনের কাজা' : 'Days Qaza'}
            </span>
          </div>
        </div>
      </div>

      {/* Suggested Daily Waqt Schedule Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#09101f] p-6 space-y-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyan-400" />
          <span>{isBn ? '২. প্রতিদিনের ওয়াক্তভিত্তিক কাজা আদায় রুটিন (সাজেশন)' : '2. Suggested Daily Waqt Schedule for Qaza'}</span>
        </h3>
        <p className="text-xs text-slate-400">
          {isBn
            ? 'প্রতিদিনের নিয়মিত নামাজের সাথে সাথে নিচের সহজ নিয়মে কাজা আদায় করুন:'
            : 'Perform your Qaza prayers alongside daily obligatory prayers using this simple routine:'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 pt-2">
          {/* Fajr Routine - Dawn Indigo & Morning Cyan */}
          <div className="rounded-xl border border-indigo-400/40 bg-gradient-to-b from-[#181d45] via-[#101435] to-[#090d24] p-4 space-y-2 hover:border-cyan-300 hover:bg-[#1e2456] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(99,102,241,0.3)] transition-all duration-300 shadow-md">
            <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold">
              <Sunrise className="h-4 w-4 text-cyan-400" />
              <span>{isBn ? 'ফজরের ওয়াক্ত' : 'Fajr Waqt'}</span>
            </div>
            <div className="text-xs text-white font-medium">
              + {formatNum(plan.fajrExtra, useBnDigits)} {isBn ? 'রাকাত ফজর কাজা' : 'Rakats Fajr Qaza'}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isBn
                ? `আজকের ফজরের ফরজ শেষ করে পূর্বে ছুটে যাওয়া ${formatNum(selectedRate, useBnDigits)} দিনের ফজর কাজা পড়ে নিন।`
                : `After today's Fajr Fard, pray ${formatNum(selectedRate, useBnDigits)} missed Fajr Qaza.`}
            </p>
          </div>

          {/* Dhuhr Routine - Midday Solar Azure & Sunburst Gold */}
          <div className="rounded-xl border border-sky-400/40 bg-gradient-to-b from-[#102b52] via-[#0b1f3c] to-[#061428] p-4 space-y-2 hover:border-sky-300 hover:bg-[#153768] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(56,189,248,0.3)] transition-all duration-300 shadow-md">
            <div className="flex items-center gap-2 text-sky-200 text-xs font-semibold">
              <Sun className="h-4 w-4 text-amber-300" />
              <span>{isBn ? 'যোহরের ওয়াক্ত' : 'Dhuhr Waqt'}</span>
            </div>
            <div className="text-xs text-white font-medium">
              + {formatNum(plan.dhuhrExtra, useBnDigits)} {isBn ? 'রাকাত যোহর কাজা' : 'Rakats Dhuhr Qaza'}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isBn
                ? 'যোহরের ফরজ আদায়ের পূর্বে বা পরে সুযোগমতো ৪ রাকাত কাজা আদায় করে নিন।'
                : 'Offer 4 rakats of Dhuhr Qaza either before or after Dhuhr Fard prayer.'}
            </p>
          </div>

          {/* Asr Routine - Warm Golden Amber & Terracotta */}
          <div className="rounded-xl border border-amber-400/40 bg-gradient-to-b from-[#2e1d0d] via-[#1f1308] to-[#120a04] p-4 space-y-2 hover:border-amber-300 hover:bg-[#3c2611] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(245,158,11,0.3)] transition-all duration-300 shadow-md">
            <div className="flex items-center gap-2 text-amber-200 text-xs font-semibold">
              <Sunset className="h-4 w-4 text-amber-400" />
              <span>{isBn ? 'আসরের ওয়াক্ত' : 'Asr Waqt'}</span>
            </div>
            <div className="text-xs text-white font-medium">
              + {formatNum(plan.asrExtra, useBnDigits)} {isBn ? 'রাকাত আসর কাজা' : 'Rakats Asr Qaza'}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isBn
                ? 'আসরের ফরজের আগেই কাজা পড়ে নেওয়া উত্তম, কারণ আসরের ফরজের পর নফল বা কাজা পড়া মাকরুহ।'
                : 'Best to pray Asr Qaza before the Fard prayer, as prayers after Asr Fard are Makruh.'}
            </p>
          </div>

          {/* Maghrib Routine - Sunset Crimson Ruby & Twilight Dusk */}
          <div className="rounded-xl border border-rose-400/40 bg-gradient-to-b from-[#34121f] via-[#230b14] to-[#13050b] p-4 space-y-2 hover:border-rose-300 hover:bg-[#451829] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(244,63,94,0.3)] transition-all duration-300 shadow-md">
            <div className="flex items-center gap-2 text-rose-200 text-xs font-semibold">
              <Sunset className="h-4 w-4 text-rose-400" />
              <span>{isBn ? 'মাগরিবের ওয়াক্ত' : 'Maghrib Waqt'}</span>
            </div>
            <div className="text-xs text-white font-medium">
              + {formatNum(plan.maghribExtra, useBnDigits)} {isBn ? 'রাকাত মাগরিব কাজা' : 'Rakats Maghrib Qaza'}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isBn
                ? 'মাগরিবের ৩ রাকাত ফরজ ও ২ রাকাত সুন্নাত আদায় করে ৩ রাকাত কাজা মাগরিব পড়ুন।'
                : 'After Maghrib Fard and Sunnah, offer 3 rakats of missed Maghrib Qaza.'}
            </p>
          </div>

          {/* Isha Routine - Deep Midnight Cobalt & Sacred Amethyst */}
          <div className="rounded-xl border border-blue-400/40 bg-gradient-to-b from-[#102046] via-[#0a1530] to-[#050c1c] p-4 space-y-2 hover:border-cyan-300 hover:bg-[#162a5b] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(59,130,246,0.3)] transition-all duration-300 shadow-md">
            <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold">
              <Moon className="h-4 w-4 text-cyan-400" />
              <span>{isBn ? 'ইশার ওয়াক্ত' : 'Isha Waqt'}</span>
            </div>
            <div className="text-xs text-white font-medium">
              + {formatNum(plan.ishaExtra + plan.witrExtra, useBnDigits)} {isBn ? 'রাকাত (ইশা + বিতর)' : 'Rakats (Isha + Witr)'}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isBn
                ? 'ইশার ফরজের সাথে ৪ রাকাত ফরজ কাজা ও ৩ রাকাত বিতর ওয়াজিব কাজা সম্পন্ন করুন।'
                : 'Along with Isha, pray 4 rakats missed Fard and 3 rakats missed Wajib Witr.'}
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Daily Log Button */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0c162c] to-[#080f20] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="h-5 w-5 text-cyan-400" />
              <span>{isBn ? '৩. কাজা আদায়ের হিসাব রেকর্ড করুন' : '3. Log Completed Qaza Prayers'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isBn
                ? 'যখনই কাজা নামাজ আদায় করবেন, নিচে ক্লিক করে আপনার অ্যাকাউন্টে যোগ করে নিন'
                : 'Whenever you complete Qaza prayers, click below to update your recovery count'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleLogDay(1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-950 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{isBn ? 'আজকের ১ দিনের কাজা (+১৭ রাকাত) সম্পন্ন' : '+1 Day Qaza Done (+17 Rakats)'}</span>
            </button>

            <button
              onClick={() => handleLogDay(7)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isBn ? '১ সপ্তাহ (+৭ দিন)' : '+1 Week (+7 Days)'}</span>
            </button>

            <button
              onClick={() => handleLogDay(-1)}
              disabled={stats.recoveredDays <= 0}
              title={isBn ? 'ভুল হলে ১ দিন কমাতে পারেন' : 'Reduce 1 day if logged by mistake'}
              className="px-2.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-rose-400 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <Minus className="h-4 w-4" />
            </button>

            <button
              onClick={onResetRecovery}
              title={isBn ? 'পুনরুদ্ধার হিসাব রিসেট' : 'Reset Qaza Recovery Log'}
              className="p-2.5 rounded-xl border border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Current Lifetime Recovery Snapshot */}
        <div className="mt-5 pt-4 border-t border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-xl bg-slate-900/80 border border-slate-700/80 p-3">
            <span className="text-slate-300 font-medium block">{isBn ? 'মোট আদায়কৃত দিন' : 'Total Days Recovered'}</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono-tabular mt-0.5 block">
              {formatNum(stats.recoveredDays, useBnDigits)} {isBn ? 'দিন' : 'Days'}
            </span>
          </div>
          <div className="rounded-xl bg-slate-900/80 border border-slate-700/80 p-3">
            <span className="text-slate-300 font-medium block">{isBn ? 'মোট আদায়কৃত রাকাত' : 'Total Rakats Recovered'}</span>
            <span className="text-base font-extrabold text-cyan-300 font-mono-tabular mt-0.5 block">
              {formatNum(stats.recoveredRakats, useBnDigits)} {isBn ? 'রাকাত' : 'Rakats'}
            </span>
          </div>
          <div className="rounded-xl bg-slate-900/80 border border-slate-700/80 p-3">
            <span className="text-slate-300 font-medium block">{isBn ? 'অবশিষ্ট দিন' : 'Remaining Days'}</span>
            <span className="text-base font-extrabold text-amber-300 font-mono-tabular mt-0.5 block">
              {formatNum(stats.netRemainingDays, useBnDigits)} {isBn ? 'দিন' : 'Days'}
            </span>
          </div>
          <div className="rounded-xl bg-slate-900/80 border border-slate-700/80 p-3">
            <span className="text-slate-300 font-medium block">{isBn ? 'অবশিষ্ট রাকাত' : 'Remaining Rakats'}</span>
            <span className="text-base font-extrabold text-amber-400 font-mono-tabular mt-0.5 block">
              {formatNum(stats.netRemainingRakats, useBnDigits)} {isBn ? 'রাকাত' : 'Rakats'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
