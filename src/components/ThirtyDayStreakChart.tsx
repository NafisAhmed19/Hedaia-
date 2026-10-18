import React, { useState } from 'react';
import { DailyLog } from '../types';
import { formatNum, toBengaliNumber } from '../utils/islamicPrayerCalc';
import {
  Flame,
  Trophy,
  Calendar,
  CheckCircle2,
  Circle,
  Sparkles,
  BarChart3,
  ChevronRight,
  Info,
  Clock,
} from 'lucide-react';

interface ThirtyDayStreakChartProps {
  prayerHistory: Record<string, DailyLog>;
  useBnDigits: boolean;
  onUpdateDayLog: (dateStr: string, updatedLog: DailyLog) => void;
}

export const ThirtyDayStreakChart: React.FC<ThirtyDayStreakChartProps> = ({
  prayerHistory,
  useBnDigits,
  onUpdateDayLog,
}) => {
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  // Generate 30 days list from (today - 29 days) up to today
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const daysData = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const log: DailyLog = prayerHistory[dateStr] || {
      date: dateStr,
      fajr: false,
      dhuhr: false,
      asr: false,
      maghrib: false,
      isha: false,
      recoveredQazaWaqts: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, witr: 0 },
    };

    const count = [log.fajr, log.dhuhr, log.asr, log.maghrib, log.isha].filter(Boolean).length;
    const isFullDay = count === 5;
    const isToday = dateStr === todayStr;

    daysData.push({
      dateStr,
      dateObj: d,
      log,
      count,
      isFullDay,
      isToday,
      dayOfMonth: d.getDate(),
      monthBn: d.toLocaleDateString('bn-BD', { month: 'short' }),
      weekdayBn: d.toLocaleDateString('bn-BD', { weekday: 'narrow' }),
    });
  }

  // Calculate current active streak (consecutive days with 5/5 prayers ending today or yesterday)
  let currentStreak = 0;
  // Check from today backwards
  for (let i = daysData.length - 1; i >= 0; i--) {
    const day = daysData[i];
    if (day.isToday) {
      // For today, if already 5 or in progress, count if >= 1
      if (day.count >= 4) {
        currentStreak++;
      } else {
        // if today is still morning/afternoon, check if yesterday was full
        const yesterday = daysData[i - 1];
        if (yesterday && yesterday.isFullDay) {
          // keep evaluating
        } else {
          break;
        }
      }
    } else {
      if (day.isFullDay) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate best streak in the 30 days
  let bestStreak = 0;
  let tempStreak = 0;
  for (const day of daysData) {
    if (day.isFullDay) {
      tempStreak++;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }
  if (currentStreak > bestStreak) bestStreak = currentStreak;

  // Total waqts completed in the 30 days
  const totalWaqtsPrayed = daysData.reduce((acc, d) => acc + d.count, 0);
  const maxPossibleWaqts = 30 * 5; // 150
  const consistencyPercent = Math.round((totalWaqtsPrayed / maxPossibleWaqts) * 100);

  // Selected day details
  const activeSelected = selectedDateStr
    ? daysData.find((d) => d.dateStr === selectedDateStr) || daysData[daysData.length - 1]
    : daysData[daysData.length - 1];

  const handleToggleWaqt = (waqtKey: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha') => {
    if (!activeSelected) return;
    const updated: DailyLog = {
      ...activeSelected.log,
      [waqtKey]: !activeSelected.log[waqtKey],
    };
    onUpdateDayLog(activeSelected.dateStr, updated);
  };

  const getBarColor = (count: number) => {
    switch (count) {
      case 5:
        return 'bg-gradient-to-t from-cyan-500 via-teal-400 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
      case 4:
        return 'bg-gradient-to-t from-cyan-600 to-teal-500';
      case 3:
        return 'bg-gradient-to-t from-sky-600 to-cyan-500';
      case 2:
        return 'bg-gradient-to-t from-slate-600 to-sky-700';
      case 1:
        return 'bg-slate-600';
      case 0:
      default:
        return 'bg-slate-800/80 border border-slate-700/50';
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0c162d] via-[#091122] to-[#070d19] p-6 shadow-xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" />
            ধারাবাহিকতা ট্র্যাকার (Consistency Tracker)
          </span>
          <h3 className="text-xl font-bold text-white mt-1 flex items-center gap-2">
            <span>বিগত ৩০ দিনের সালাত স্ট্রিক চার্ট</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-400/50 text-cyan-300 font-mono-tabular font-bold">
              30-Day Streak
            </span>
          </h3>
          <p className="text-xs text-slate-200 font-medium mt-1">
            প্রতিদিনের ৫ ওয়াক্ত নামাজ আদায়ের ধারাবাহিকতা ও স্ট্রিক পর্যবেক্ষণ করুন
          </p>
        </div>

        {/* Status Callout Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-amber-400/50 bg-amber-950/40 text-amber-200 text-xs font-semibold shadow-sm">
            <Flame className="h-4 w-4 text-amber-400 animate-pulse" />
            <span>বর্তমান স্ট্রিক:</span>
            <span className="font-bold text-sm font-mono-tabular text-white">
              {formatNum(currentStreak, useBnDigits)} দিন
            </span>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-cyan-400/50 bg-cyan-950/40 text-cyan-200 text-xs font-semibold shadow-sm">
            <Trophy className="h-4 w-4 text-cyan-400" />
            <span>সর্বোচ্চ:</span>
            <span className="font-bold text-sm font-mono-tabular text-white">
              {formatNum(bestStreak, useBnDigits)} দিন
            </span>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-3.5 shadow-sm">
          <span className="text-slate-300 font-medium block">৩০ দিনে মোট ওয়াক্ত আদায়</span>
          <span className="text-lg font-extrabold text-white font-mono-tabular mt-0.5 block">
            {formatNum(totalWaqtsPrayed, useBnDigits)}{' '}
            <span className="text-xs text-slate-300 font-normal">/ {formatNum(maxPossibleWaqts, useBnDigits)}</span>
          </span>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-3.5 shadow-sm">
          <span className="text-slate-300 font-medium block">ধারাবাহিকতার হার</span>
          <span className="text-lg font-extrabold text-cyan-300 font-mono-tabular mt-0.5 block">
            {formatNum(consistencyPercent, useBnDigits)}%
          </span>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-3.5 shadow-sm">
          <span className="text-slate-300 font-medium block">পূর্ণ ৫ ওয়াক্ত দিন</span>
          <span className="text-lg font-extrabold text-emerald-300 font-mono-tabular mt-0.5 block">
            {formatNum(daysData.filter((d) => d.isFullDay).length, useBnDigits)} দিন
          </span>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-3.5 shadow-sm">
          <span className="text-slate-300 font-medium block">স্ট্রিক স্ট্যাটাস</span>
          <span className="text-sm font-bold text-cyan-300 flex items-center gap-1 mt-1">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            {consistencyPercent >= 80 ? 'ধারাবাহিক মুহাফিজ' : consistencyPercent >= 50 ? 'উন্নতিশীল' : 'যত্নশীল হোন'}
          </span>
        </div>
      </div>

      {/* 30-Day Bar Chart Visualizer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-200 font-medium">
          <span>বিগত ৩০ দিনের দৈনিক অগ্রগতি (০ - ৫ ওয়াক্ত)</span>
          <span className="text-xs text-cyan-300 font-semibold">যেকোনো বারে ক্লিক করে বিস্তারিত দেখুন বা এডিট করুন</span>
        </div>

        {/* The 30 Bars Container */}
        <div className="rounded-2xl border border-slate-800/90 bg-[#060b17] p-4 sm:p-5">
          <div className="h-44 flex items-end justify-between gap-1 sm:gap-1.5 pt-6 pb-2">
            {daysData.map((d, idx) => {
              const heightPercent = Math.max(10, (d.count / 5) * 100);
              const isSelected = selectedDateStr === d.dateStr;

              return (
                <button
                  key={d.dateStr}
                  type="button"
                  onClick={() => setSelectedDateStr(d.dateStr)}
                  className={`group relative flex-1 h-full flex flex-col justify-end items-center cursor-pointer transition-all focus:outline-none`}
                >
                  {/* Tooltip on Hover */}
                  <div className="pointer-events-none absolute -top-8 z-30 hidden group-hover:flex items-center justify-center whitespace-nowrap rounded-md bg-slate-900 border border-cyan-500/50 px-2 py-0.5 text-[10px] text-cyan-200 shadow-lg">
                    {d.dayOfMonth} {d.monthBn}: {formatNum(d.count, useBnDigits)}/৫ ওয়াক্ত
                  </div>

                  {/* Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-300 ${getBarColor(d.count)} ${
                      isSelected ? 'ring-2 ring-white scale-105 shadow-[0_0_12px_rgba(255,255,255,0.5)]' : ''
                    } ${d.isToday ? 'border-t-2 border-white' : ''}`}
                  />

                  {/* Indicator for today or full day */}
                  {d.isToday && (
                    <span className="absolute -bottom-2 h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Timeline Date Markers (Start, Middle, End) */}
          <div className="flex items-center justify-between text-xs text-slate-300 pt-3 border-t border-slate-800 font-mono-tabular font-medium">
            <span>{daysData[0].dayOfMonth} {daysData[0].monthBn} (৩০ দিন পূর্বে)</span>
            <span className="hidden sm:inline">
              {daysData[14].dayOfMonth} {daysData[14].monthBn} (১৫ দিন পূর্বে)
            </span>
            <span className="text-cyan-300 font-bold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
              আজ ({daysData[daysData.length - 1].dayOfMonth} {daysData[daysData.length - 1].monthBn})
            </span>
          </div>
        </div>

        {/* Color Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-200 font-medium pt-1">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-gradient-to-r from-teal-400 to-emerald-400" />
            <span>৫ ওয়াক্ত (পূর্ণ স্ট্রিক)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-teal-500" />
            <span>৪ ওয়াক্ত</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-sky-500" />
            <span>৩ ওয়াক্ত</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-slate-500" />
            <span>১-২ ওয়াক্ত</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-slate-800 border border-slate-600" />
            <span>০ ওয়াক্ত</span>
          </div>
        </div>
      </div>

      {/* Selected Day Inspector & Interactive Logger */}
      {activeSelected && (
        <div className="rounded-xl border border-cyan-400/40 bg-slate-900/90 p-4 sm:p-5 transition-all shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-700">
            <div>
              <span className="text-xs text-slate-300 font-medium">নির্বাচিত দিনের বিস্তারিত:</span>
              <h4 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                <Calendar className="h-4 w-4 text-cyan-400" />
                <span>
                  {activeSelected.dateObj.toLocaleDateString('bn-BD', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                {activeSelected.isToday && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-200 border border-cyan-400/60 font-bold">
                    আজকের দিন
                  </span>
                )}
              </h4>
            </div>

            <div className="text-xs text-slate-300 font-medium">
              মোট আদায়:{' '}
              <span className="text-cyan-300 font-extrabold text-sm font-mono-tabular">
                {formatNum(activeSelected.count, useBnDigits)} / ৫ ওয়াক্ত
              </span>
            </div>
          </div>

          {/* Waqt checkbuttons */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {(
              [
                { id: 'fajr', name: 'ফজর' },
                { id: 'dhuhr', name: 'যোহর' },
                { id: 'asr', name: 'আসর' },
                { id: 'maghrib', name: 'মাগরিব' },
                { id: 'isha', name: 'ইশা' },
              ] as const
            ).map((w) => {
              const isChecked = activeSelected.log[w.id];

              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => handleToggleWaqt(w.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    isChecked
                      ? 'border-emerald-400/60 bg-emerald-950/60 text-emerald-200 shadow-sm'
                      : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <span className="font-medium">{w.name}</span>
                  {isChecked ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-500" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-300 font-medium">
            <span>* কোনো দিনের নামাজ পরে আদায় করলে এখানে সরাসরি টিক দিয়ে স্ট্রিক আপডেট করতে পারবেন।</span>
          </div>
        </div>
      )}
    </div>
  );
};
