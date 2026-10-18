import React from 'react';
import { LifetimeSalahStats } from '../types';
import { formatNum, toBengaliNumber } from '../utils/islamicPrayerCalc';
import { CheckCircle2, AlertCircle, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { Language } from '../utils/translations';

interface CircularQazaProgressProps {
  stats: LifetimeSalahStats;
  useBnDigits: boolean;
  language?: Language;
}

export const CircularQazaProgress: React.FC<CircularQazaProgressProps> = ({
  stats,
  useBnDigits,
  language = 'bn',
}) => {
  const isBn = language !== 'en';
  const total = Math.max(1, stats.totalObligatoryRakats);
  const regularlyPrayed = stats.prayedRakatsEstimate;
  const recovered = stats.recoveredRakats;
  const totalCompleted = Math.min(total, regularlyPrayed + recovered);
  const remainingBacklog = Math.max(0, stats.netRemainingRakats);

  // Percentages
  const completedPercent = Math.min(100, Math.max(0, parseFloat(((totalCompleted / total) * 100).toFixed(1))));
  const backlogPercent = Math.max(0, parseFloat((100 - completedPercent).toFixed(1)));
  const regularPercent = Math.min(100, parseFloat(((regularlyPrayed / total) * 100).toFixed(1)));
  const recoveredPercent = Math.min(100, parseFloat(((recovered / total) * 100).toFixed(1)));

  // SVG circular geometry
  const size = 260;
  const strokeWidth = 18;
  const center = size / 2;
  const radius = center - strokeWidth - 8;
  const circumference = 2 * Math.PI * radius;

  // Dash offsets
  // Completed arc starts at -90deg (top)
  const completedDash = (completedPercent / 100) * circumference;
  const remainingDash = circumference - completedDash;

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0c162d] via-[#091122] to-[#070d1a] p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-5 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" />
            {isBn ? 'সার্কুলার প্রগ্রেস চার্ট' : 'Circular Progress Chart'}
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            {isBn ? 'আদায়কৃত নামাজ বনাম অবশিষ্ট কাজা ব্যাকলগ' : 'Completed Prayers vs Remaining Backlog'}
          </h3>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-200 font-medium">
          <span className="inline-block h-2 w-2 rounded-full bg-cyan-400"></span>
          <span>{isBn ? 'সম্পন্ন' : 'Completed'}: <strong className="text-white">{formatNum(completedPercent, useBnDigits)}%</strong></span>
          <span className="text-slate-500">·</span>
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400"></span>
          <span>{isBn ? 'ব্যাকলগ' : 'Backlog'}: <strong className="text-amber-300">{formatNum(backlogPercent, useBnDigits)}%</strong></span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Circular Progress Bar SVG */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-[260px] h-[260px] flex items-center justify-center">
            {/* Ambient background glow */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

            <svg
              className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_16px_rgba(6,182,212,0.25)]"
              viewBox={`0 0 ${size} ${size}`}
            >
              <defs>
                {/* Gradient for Completed Arc */}
                <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>

                {/* Gradient for Remaining Backlog Arc */}
                <linearGradient id="backlogGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>

              {/* Base Background Circle Track */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#111c33"
                strokeWidth={strokeWidth}
                className="opacity-70"
              />

              {/* Remaining Backlog Track (Subtle warm amber) */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="url(#backlogGradient)"
                strokeWidth={strokeWidth - 4}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={0}
                strokeLinecap="round"
                opacity={0.45}
              />

              {/* Completed Arc (Active Vibrant Gradient) */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="url(#completedGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={`${completedDash} ${circumference}`}
                strokeDashoffset={0}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Inner Center Text / Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {isBn ? 'মোট আদায় সম্পন্ন' : 'Total Completed'}
              </span>
              <div className="font-mono-tabular text-4xl sm:text-5xl font-extrabold text-white tracking-tight my-1 drop-shadow-md">
                {formatNum(completedPercent, useBnDigits)}
                <span className="text-xl sm:text-2xl text-cyan-300 ml-0.5">%</span>
              </div>
              <div className="text-xs text-amber-300 font-bold">
                {formatNum(backlogPercent, useBnDigits)}% {isBn ? 'কাজা বাকি' : 'Qaza Remaining'}
              </div>
              <div className="text-xs text-slate-200 mt-1 font-mono-tabular font-semibold bg-slate-900/80 px-2 py-0.5 rounded-md border border-slate-700/60">
                {formatNum(totalCompleted, useBnDigits)} / {formatNum(total, useBnDigits)} {isBn ? 'রাকাত' : 'Rakats'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Metrics & Legend */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Card 1: Completed / Regular + Recovered */}
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {isBn ? 'আদায়কৃত মোট নামাজ' : 'Total Prayers Completed'}
                </span>
                <span className="text-xs font-mono-tabular font-bold text-emerald-300">
                  {formatNum(completedPercent, useBnDigits)}%
                </span>
              </div>
              <div className="text-2xl font-extrabold text-white font-mono-tabular">
                {formatNum(totalCompleted, useBnDigits)}{' '}
                <span className="text-xs font-medium text-emerald-300">{isBn ? 'রাকাত' : 'Rakats'}</span>
              </div>
              <div className="text-xs text-emerald-100/90 space-y-1 border-t border-emerald-900/50 pt-2 font-mono-tabular font-medium">
                <div>• {isBn ? 'নিয়মিত পড়া' : 'Regularly Prayed'}: <strong className="text-white">{formatNum(regularlyPrayed, useBnDigits)}</strong> {isBn ? 'রাকাত' : 'Rakats'} ({formatNum(regularPercent, useBnDigits)}%)</div>
                <div>• {isBn ? 'কাজা পূরণ' : 'Qaza Recovered'}: <strong className="text-emerald-300">+{formatNum(recovered, useBnDigits)}</strong> {isBn ? 'রাকাত' : 'Rakats'} ({formatNum(recoveredPercent, useBnDigits)}%)</div>
              </div>
            </div>

            {/* Card 2: Remaining Backlog */}
            <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  {isBn ? 'অবশিষ্ট কাজা ব্যাকলগ' : 'Remaining Qaza Backlog'}
                </span>
                <span className="text-xs font-mono-tabular font-bold text-amber-300">
                  {formatNum(backlogPercent, useBnDigits)}%
                </span>
              </div>
              <div className="text-2xl font-extrabold text-amber-300 font-mono-tabular">
                {formatNum(remainingBacklog, useBnDigits)}{' '}
                <span className="text-xs font-medium text-amber-200">{isBn ? 'রাকাত' : 'Rakats'}</span>
              </div>
              <div className="text-xs text-amber-100/90 space-y-1 border-t border-amber-900/50 pt-2 font-mono-tabular font-medium">
                <div>• {isBn ? 'বাকি দিন' : 'Remaining Days'}: <strong className="text-white">{formatNum(stats.netRemainingDays, useBnDigits)}</strong> {isBn ? 'দিন' : 'Days'}</div>
                <div>• {isBn ? 'বাকি ওয়াক্ত' : 'Remaining Waqts'}: <strong className="text-amber-300">{formatNum(stats.netRemainingDays * 5, useBnDigits)}</strong> {isBn ? 'ওয়াক্ত' : 'Waqts'}</div>
              </div>
            </div>
          </div>

          {/* Motivational Spiritual Callout */}
          <div className="rounded-xl border border-cyan-500/30 bg-slate-900/90 p-4 text-xs text-slate-100 flex items-start gap-3 shadow-md">
            <Sparkles className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-cyan-300 block mb-0.5">
                {isBn ? 'কাজা সম্পূর্ণ করার অনুপ্রেরণা' : 'Inspiration for Completing Qaza'}
              </span>
              {isBn
                ? 'বর্তমান গতি বজায় রাখলে ধীরে ধীরে সার্কুলার প্রগ্রেস বারের সবুজ/আকাশী অংশ বৃদ্ধি পাবে এবং কাজা ব্যাকলগ শূন্যে নেমে আসবে। প্রতিটি ওয়াক্তের সাথে অতিরিক্ত ওয়াক্ত আদায় করলে এই চার্ট স্বয়ংক্রিয়ভাবে আপডেট হয়।'
                : 'Maintaining your consistency will gradually turn the progress ring green and cyan until your Qaza backlog reaches zero. Praying extra with each waqt automatically updates this chart.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
