import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import { LifetimeSalahStats } from '../types';
import { formatNum, toBengaliNumber } from '../utils/islamicPrayerCalc';
import { CheckCircle2, AlertCircle, Sparkles, TrendingUp, Award, Layers } from 'lucide-react';

interface RechartsQazaRecoveryProgressProps {
  stats: LifetimeSalahStats;
  useBnDigits: boolean;
}

export const RechartsQazaRecoveryProgress: React.FC<RechartsQazaRecoveryProgressProps> = ({
  stats,
  useBnDigits,
}) => {
  // Total calculated Qaza history (original missed Qaza)
  const totalQazaRakats = Math.max(
    1,
    stats.recoveredRakats + stats.netRemainingRakats
  );
  const totalQazaDays = Math.max(
    1,
    stats.recoveredDays + stats.netRemainingDays
  );

  const recoveredRakats = stats.recoveredRakats;
  const recoveredDays = stats.recoveredDays;

  const remainingRakats = stats.netRemainingRakats;
  const remainingDays = stats.netRemainingDays;

  // Percentage completed
  const completedPercent = totalQazaRakats > 0
    ? parseFloat(((recoveredRakats / totalQazaRakats) * 100).toFixed(1))
    : 0;
  const remainingPercent = parseFloat(Math.max(0, 100 - completedPercent).toFixed(1));

  // Recharts Pie / Donut Data
  const pieData = [
    {
      name: 'আদায়কৃত কাজা (Completed)',
      value: Math.max(recoveredRakats, 0.01),
      actualValue: recoveredRakats,
      color: '#06b6d4',
      percent: completedPercent,
    },
    {
      name: 'অবশিষ্ট কাজা (Remaining Backlog)',
      value: Math.max(remainingRakats, 0.01),
      actualValue: remainingRakats,
      color: '#f59e0b',
      percent: remainingPercent,
    },
  ];

  // Waqt-by-Waqt Recovery Progress Data for Bar Chart
  const waqtRecoveryData = [
    {
      waqt: 'ফজর',
      recovered: recoveredDays * 2,
      remaining: remainingDays * 2,
      total: totalQazaDays * 2,
    },
    {
      waqt: 'যোহর',
      recovered: recoveredDays * 4,
      remaining: remainingDays * 4,
      total: totalQazaDays * 4,
    },
    {
      waqt: 'আসর',
      recovered: recoveredDays * 4,
      remaining: remainingDays * 4,
      total: totalQazaDays * 4,
    },
    {
      waqt: 'মাগরিব',
      recovered: recoveredDays * 3,
      remaining: remainingDays * 3,
      total: totalQazaDays * 3,
    },
    {
      waqt: 'ইশা ও বিতর',
      recovered: recoveredDays * 7,
      remaining: remainingDays * 7,
      total: totalQazaDays * 7,
    },
  ];

  // Custom Tooltip for Recharts Pie
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-cyan-500/40 bg-[#091122] p-3 text-xs shadow-2xl text-slate-200">
          <div className="font-semibold text-white mb-1">{data.name}</div>
          <div className="font-mono-tabular text-cyan-300">
            {formatNum(data.actualValue, useBnDigits)} রাকাত ({formatNum(data.percent, useBnDigits)}%)
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Recharts Bar
  const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-cyan-500/40 bg-[#091122] p-3 text-xs shadow-2xl text-slate-200">
          <div className="font-semibold text-white mb-1.5">{label} ওয়াক্তের হিসাব</div>
          <div className="text-emerald-400 font-mono-tabular">
            • আদায়কৃত: {formatNum(payload[0]?.value || 0, useBnDigits)} রাকাত
          </div>
          <div className="text-amber-400 font-mono-tabular">
            • বাকি: {formatNum(payload[1]?.value || 0, useBnDigits)} রাকাত
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#0c162d] via-[#091122] to-[#070d19] p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4" />
            রিকভারি প্রগ্রেস অ্যানালিটিক্স (Recharts Circular & Bar Visualizer)
          </span>
          <h3 className="text-xl font-bold text-white mt-1">
            মোট কাজা হিসেব অনুযায়ী আদায়ের অগ্রগতি
          </h3>
          <p className="text-xs text-slate-200 font-medium mt-1">
            লাইফটাইম হিসাবকৃত মোট <strong className="text-cyan-300 font-mono-tabular">{formatNum(totalQazaRakats, useBnDigits)}</strong> রাকাত কাজার বিপরীতে আপনার বর্তমান অবস্থা
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-400/50 bg-cyan-950/60 text-cyan-200 font-bold shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span>আদায়: {formatNum(completedPercent, useBnDigits)}%</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-400/50 bg-amber-950/60 text-amber-200 font-bold shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
            <span>বাকি: {formatNum(remainingPercent, useBnDigits)}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Circular Donut Chart on Left, Stacked Waqt Progress on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Recharts Circular Progress Donut Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[280px] h-[260px]">
            {/* Ambient glow */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none" />

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomPieTooltip />} />
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={76}
                  outerRadius={102}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={recoveredRakats > 0 && remainingRakats > 0 ? 3 : 0}
                  dataKey="value"
                  stroke="#080e1d"
                  strokeWidth={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Value Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                কাজা সম্পন্ন
              </span>
              <div className="font-mono-tabular text-4xl sm:text-5xl font-extrabold text-white tracking-tight my-0.5 drop-shadow-md">
                {formatNum(completedPercent, useBnDigits)}
                <span className="text-xl sm:text-2xl text-cyan-300 ml-0.5">%</span>
              </div>
              <div className="text-xs text-emerald-300 font-bold font-mono-tabular">
                +{formatNum(recoveredDays, useBnDigits)} দিন পূর্ণ
              </div>
              <div className="text-xs text-amber-200 mt-1 font-mono-tabular font-medium bg-slate-900/90 px-2 py-0.5 rounded border border-slate-700">
                বাকি {formatNum(remainingDays, useBnDigits)} দিন
              </div>
            </div>
          </div>

          <span className="text-xs text-slate-200 font-medium mt-1 text-center">
            সার্কুলার প্রগ্রেস (Recharts Donut)
          </span>
        </div>

        {/* Right Column: Waqt-by-Waqt Recharts Bar Progress & Detailed Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-cyan-400" />
                ওয়াক্তভিত্তিক কাজা আদায় বনাম অবশিষ্ট রাকাত
              </span>
              <span className="text-xs text-slate-300 font-medium">ওয়াক্তপ্রতি রাকাত ব্রেকডাউন</span>
            </div>

            {/* Recharts Stacked Horizontal Bar Chart */}
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={waqtRecoveryData}
                  layout="vertical"
                  margin={{ top: 5, right: 15, left: 35, bottom: 5 }}
                >
                  <XAxis
                    type="number"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(val) => (useBnDigits ? toBengaliNumber(val) : String(val))}
                  />
                  <YAxis
                    dataKey="waqt"
                    type="category"
                    stroke="#e2e8f0"
                    fontSize={12}
                    fontWeight={600}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar
                    dataKey="recovered"
                    name="আদায়কৃত"
                    stackId="a"
                    fill="#06b6d4"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="remaining"
                    name="অবশিষ্ট বাকি"
                    stackId="a"
                    fill="#f59e0b"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chart Legend */}
            <div className="flex items-center justify-end gap-4 text-xs text-slate-200 font-medium pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-cyan-400" />
                <span>আদায়কৃত রাকাত (<strong className="text-white font-mono-tabular">{formatNum(recoveredRakats, useBnDigits)}</strong>)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" />
                <span>বাকি কাজা রাকাত (<strong className="text-amber-300 font-mono-tabular">{formatNum(remainingRakats, useBnDigits)}</strong>)</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-cyan-400/40 bg-cyan-950/30 p-3.5 shadow-sm">
              <span className="text-slate-300 font-medium block">মোট কাজা হিসেব</span>
              <span className="text-base font-extrabold text-white font-mono-tabular mt-0.5 block">
                {formatNum(totalQazaRakats, useBnDigits)} রাকাত
              </span>
              <span className="text-xs text-cyan-300 font-semibold block font-mono-tabular mt-0.5">
                ({formatNum(totalQazaDays, useBnDigits)} দিন)
              </span>
            </div>

            <div className="rounded-xl border border-emerald-400/40 bg-emerald-950/30 p-3.5 shadow-sm">
              <span className="text-slate-300 font-medium block">ইতিমধ্যে আদায় হয়েছে</span>
              <span className="text-base font-extrabold text-emerald-300 font-mono-tabular mt-0.5 block">
                +{formatNum(recoveredRakats, useBnDigits)} রাকাত
              </span>
              <span className="text-xs text-emerald-300 font-semibold block font-mono-tabular mt-0.5">
                ({formatNum(recoveredDays, useBnDigits)} দিন পূর্ণ)
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl border border-amber-400/40 bg-amber-950/30 p-3.5 shadow-sm">
              <span className="text-slate-300 font-medium block">এখনও কাজা বাকি</span>
              <span className="text-base font-extrabold text-amber-300 font-mono-tabular mt-0.5 block">
                {formatNum(remainingRakats, useBnDigits)} রাকাত
              </span>
              <span className="text-xs text-amber-300 font-semibold block font-mono-tabular mt-0.5">
                ({formatNum(remainingDays, useBnDigits)} দিন বাকি)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
