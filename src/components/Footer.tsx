import React from 'react';
import { Mail, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { HidayahCalligraphyLogo } from './HidayahCalligraphyLogo';
import { NafisCustomFlag } from './NafisCustomFlag';
import { Language } from '../utils/translations';

interface FooterProps {
  language?: Language;
}

export const Footer: React.FC<FooterProps> = ({ language = 'bn' }) => {
  const isBn = language !== 'en';

  return (
    <footer className="relative z-20 mt-24 border-t border-cyan-700/40 bg-[#040713] text-slate-300 shadow-[0_-15px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Spiritual Note with Hidayah Arabic Calligraphy Logo */}
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <HidayahCalligraphyLogo size="md" withGlow={true} />
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-cinzel text-lg font-bold text-white tracking-wider">
                  HIDAYAH · হিদায়াহ
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-semibold">
                  {isBn ? 'সালাত ট্র্যাকার' : 'Salah Tracker'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-md leading-relaxed">
                {isBn
                  ? 'আল্লাহ তাআলা আমাদের সমস্ত ওয়াক্তমত ও কাজা নামাজ একনিষ্ঠভাবে আদায় করার তাওফিক দান করুন। আমিন।'
                  : 'May Allah grant us the devotion to fulfill all our timely and Qaza prayers with sincerity. Ameen.'}
              </p>
            </div>
          </div>

          {/* Creator Attribution with Custom Flag Badge */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 shadow-md">
              <span className="text-slate-400">{isBn ? 'ক্রিয়েটর:' : 'Creator:'}</span>
              <span className="font-bold text-white tracking-wide">{isBn ? 'নাফিস আহমেদ' : 'Nafis Ahmed'}</span>
              {/* Custom Designed Creator Flag Emoji Icon */}
              <NafisCustomFlag className="ml-1" />
            </div>

            <a
              href="mailto:nafisahmeddn@gmail.com"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-950/70 border border-cyan-500/50 text-cyan-200 hover:text-white hover:border-cyan-400 hover:bg-cyan-900/80 transition-all shadow-md"
            >
              <Mail className="h-4 w-4 text-cyan-400" />
              <span className="font-mono-tabular font-medium text-xs">nafisahmeddn@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Bottom copyright and dedication row - 100% Crisp & High Contrast */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()}{' '}
            <strong className="text-slate-200">
              {isBn ? 'হিদায়াহ (Hidayah)' : 'Hidayah'}
            </strong>{' '}
            · {isBn ? 'সালাত ও কাজা ক্যালকুলেটর · সর্বস্বত্ব সংরক্ষিত' : 'Salah & Qaza Calculator · All rights reserved'}
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span className="text-slate-300">
              {isBn ? 'বিসমিল্লাহর বরকতে তৈরি' : 'Built with the blessings of Bismillah'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-cyan-300 font-semibold">{isBn ? 'নাফিস আহমেদ' : 'Nafis Ahmed'}</span>
            <NafisCustomFlag />
          </div>
        </div>
      </div>
    </footer>
  );
};
