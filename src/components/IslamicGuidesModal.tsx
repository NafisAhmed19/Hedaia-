import React from 'react';
import { X, BookOpen, CheckCircle, HelpCircle, Heart, Sparkles } from 'lucide-react';

interface IslamicGuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IslamicGuidesModal: React.FC<IslamicGuidesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-cyan-500/30 bg-[#09101f] text-slate-100 shadow-[0_25px_60px_-15px_rgba(6,182,212,0.25)] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
              <BookOpen className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-white">কাজা নামাজের শরীয়তসম্মত নির্দেশিকা</h2>
              <p className="text-xs text-slate-400">সহিহ হাদিস ও নির্ভরযোগ্য ফিকহের আলোকে প্রয়োজনীয় বিধান</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm text-slate-300">
          {/* Hadith 1 */}
          <div className="rounded-xl border border-cyan-900/40 bg-cyan-950/20 p-4">
            <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider block mb-1">
              রাসুলুল্লাহ (সা.)-এর পবিত্র বাণী
            </span>
            <p className="italic text-white text-xs sm:text-sm leading-relaxed">
              "যে ব্যক্তি নামাজের কথা ভুলে যায় অথবা নামাজ না পড়ে ঘুমিয়ে থাকে, তার কাফফারা হলো যখনই মনে পড়বে তখনই তা আদায় করে নেওয়া।"
            </p>
            <span className="text-[11px] text-slate-400 block mt-2">— সহিহ বুখারি (৫৯৭), সহিহ মুসলিম (৬৮৪)</span>
          </div>

          {/* Qaza Rules */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white text-base flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-cyan-400" />
              <span>১. কোন কোন নামাজের কাজা আদায় করতে হয়?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              জীবনে যত নামাজ ছুটে গেছে তার শুধুমাত্র <strong>ফরজ ও ওয়াজিব (বিতর)</strong> নামাজের কাজা আদায় করতে হয়।
              সুন্নাত ও নফল নামাজের কোনো কাজা নেই। তাই প্রতিদিন মোট ১৭ রাকাত কাজা হিসাব করতে হয়:
            </p>
            <ul className="text-xs space-y-1 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-slate-200">
              <li>• ফজর: ২ রাকাত ফরজ</li>
              <li>• যোহর: ৪ রাকাত ফরজ</li>
              <li>• আসর: ৪ রাকাত ফরজ</li>
              <li>• মাগরিব: ৩ রাকাত ফরজ</li>
              <li>• ইশা ও বিতর: ৪ রাকাত ফরজ + ৩ রাকাত বিতর ওয়াজিব</li>
            </ul>
          </div>

          {/* How to make Niyyah */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-cyan-400" />
              <span>২. বহু বছরের কাজার নিয়ত কীভাবে করবেন?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              বহু বছরের কাজা থাকলে নির্দিষ্ট দিন বা তারিখ মনে রাখা সম্ভব নয়। তাই মনে মনে এভাবে নিয়ত করবেন:
            </p>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs sm:text-sm text-cyan-200 italic">
              "আমার জিম্মায় অতীত জীবনের সবচেয়ে প্রথম (অথবা শেষ) যে ফজরের ফরজ নামাজ বাকি আছে, তা আল্লাহর সন্তুষ্টির উদ্দেশ্যে আদায় করছি।"
            </div>
          </div>

          {/* Prohibited Times */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>৩. কোন কোন সময়ে কাজা নামাজ পড়া নিষেধ?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              দিনের যে কোনো সময় কাজা নামাজ আদায় করা যায়, তবে তিনটি নিষিদ্ধ সময় পরিহার করতে হবে:
            </p>
            <ul className="text-xs space-y-1 text-slate-300">
              <li>১. সূর্যোদয়ের সময় (সূর্য ওঠার প্রথম প্রায় ১৫-২০ মিনিট)।</li>
              <li>২. ঠিক দ্বিপ্রহরের সময় (সূর্য ঠিক মাথার ওপর থাকার সময়)।</li>
              <li>৩. সূর্যাস্তের সময় (সূর্য হলুদ হয়ে ডোবার ১৫-২০ মিনিট পূর্বে)।</li>
              <li className="text-amber-300 pt-1">
                * আসরের ফরজ পড়ার পর সূর্যাস্ত পর্যন্ত কোনো নামাজ পড়া অনুচিত, তাই আসরের কাজা আসরের ফরজের পূর্বে পড়ে নেওয়াই সর্বোত্তম।
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer"
          >
            বুঝেছি, বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
