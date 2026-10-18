import React from 'react';
import { X, CheckCircle2, BookOpen, Sparkles, Heart, Quote, ArrowRight } from 'lucide-react';
import { WaqtHadithItem } from '../types';

interface WaqtHadithCelebrationModalProps {
  hadith: WaqtHadithItem | null;
  isOpen: boolean;
  onClose: () => void;
  isJustCompleted?: boolean;
}

export const WaqtHadithCelebrationModal: React.FC<WaqtHadithCelebrationModalProps> = ({
  hadith,
  isOpen,
  onClose,
  isJustCompleted = true,
}) => {
  if (!isOpen || !hadith) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-amber-500/40 bg-gradient-to-b from-[#0e1a2f] via-[#091222] to-[#060c18] text-slate-100 shadow-[0_25px_65px_-15px_rgba(245,158,11,0.25)] p-6 sm:p-8 overflow-hidden">
        {/* Decorative ambient halo */}
        <div className="absolute -top-20 -right-20 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
              {isJustCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <BookOpen className="h-5 w-5 text-amber-400" />
              )}
            </span>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {isJustCompleted ? 'নামাজ সম্পন্ন মুবারকবাদ' : 'ওয়াক্ত হাদিস ও ফজিলত'}
              </span>
              <h3 className="text-lg font-bold text-white">
                {hadith.waqtNameBn} নামাজের বিশেষ হাদিস
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-5 space-y-5">
          {/* If just marked completed, show celebration banner */}
          {isJustCompleted && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                মাশাআল্লাহ! আপনি আজকের <strong className="text-white">{hadith.waqtNameBn}</strong> ফরজ নামাজ আদায় করেছেন।
              </span>
            </div>
          )}

          {/* Arabic Hadith Quote Box */}
          {hadith.arabicText && (
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-slate-900/60 to-amber-950/20 p-4 text-center">
              <p
                dir="rtl"
                className="font-cinzel text-lg sm:text-xl font-bold text-amber-200/95 leading-loose tracking-wide"
              >
                {hadith.arabicText}
              </p>
            </div>
          )}

          {/* Bangla Translation */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Quote className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {hadith.banglaTranslation}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              {hadith.narrator && <span>বর্ণনাকারী: {hadith.narrator}</span>}
              <span className="font-semibold text-amber-300 font-mono-tabular">
                রেফারেন্স: {hadith.reference}
              </span>
            </div>
          </div>

          {/* Spiritual Reflection / Virtue */}
          <div className="rounded-xl border border-cyan-900/40 bg-[#06101d] p-3.5 text-xs text-slate-300 space-y-1">
            <span className="text-[11px] font-semibold text-cyan-300 flex items-center gap-1.5">
              <Heart className="h-3 w-3 text-cyan-400" />
              এই ওয়াক্তের তাৎপর্য:
            </span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {hadith.virtueDescription}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500">
            প্রতিটি ওয়াক্তের আমল কবুল হোক
          </span>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-semibold text-xs shadow-lg shadow-amber-950/40 transition-all cursor-pointer"
          >
            <span>বুঝেছি, আলহামদুলিল্লাহ</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
