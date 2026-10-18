import React from 'react';
import {
  Sparkles,
  UserCheck,
  UserPlus,
  BookOpen,
  MessageSquareHeart,
  Languages,
  RotateCcw,
} from 'lucide-react';
import { UserProfile } from '../types';
import { HidayahCalligraphyLogo } from './HidayahCalligraphyLogo';
import { getTranslation, Language } from '../utils/translations';

interface HeaderProps {
  profile: UserProfile;
  onOpenAuth: () => void;
  onOpenGuides: () => void;
  language: Language;
  onToggleLanguage: () => void;
  activeTab: 'calculator' | 'recovery' | 'daily' | 'hadith';
  setActiveTab: (tab: 'calculator' | 'recovery' | 'daily' | 'hadith') => void;
  onScrollToTop?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenAuth,
  onOpenGuides,
  language,
  onToggleLanguage,
  activeTab,
  setActiveTab,
  onScrollToTop,
}) => {
  const t = getTranslation(language);

  // Scroll strictly to the very top of the page when clicking the Logo / Brand name
  const handleScrollToTop = (e?: React.MouseEvent) => {
    e?.preventDefault();
    if (onScrollToTop) {
      onScrollToTop();
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  // Smooth scroll directly to the dashboard tab content
  const handleNavClick = (tab: 'calculator' | 'recovery' | 'daily' | 'hadith') => {
    setActiveTab(tab);
    setTimeout(() => {
      const el = document.getElementById('dashboard-content-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  // Smooth scroll directly to community feedback & join section
  const handleScrollToFeedback = () => {
    const el = document.getElementById('community-feedback-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/30 bg-[#0d172e]/95 backdrop-blur-lg shadow-[0_4px_25px_rgba(6,182,212,0.12)] transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Hidayah Arabic Calligraphy Logo & Brand Wordmark (Clicks to Top) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleScrollToTop}
            className="flex items-center gap-3 text-left group cursor-pointer"
            title={language === 'bn' ? 'একেবারে শুরুতে ফিরে যান' : 'Back to top'}
          >
            <HidayahCalligraphyLogo size="sm" withGlow={true} />
            <div>
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors block">
                {t.brandName}
              </span>
              <span className="hidden sm:inline-block text-[11px] text-cyan-400/90 font-medium">
                {t.brandSubtitle}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNavClick('calculator')}
            className={`transition-colors pb-1 cursor-pointer ${
              activeTab === 'calculator'
                ? 'text-cyan-300 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-white'
            }`}
          >
            {t.navLifetime}
          </button>
          <button
            onClick={() => handleNavClick('recovery')}
            className={`transition-colors pb-1 cursor-pointer ${
              activeTab === 'recovery'
                ? 'text-cyan-300 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-white'
            }`}
          >
            {t.navRecovery}
          </button>
          <button
            onClick={() => handleNavClick('daily')}
            className={`transition-colors pb-1 cursor-pointer ${
              activeTab === 'daily'
                ? 'text-cyan-300 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-white'
            }`}
          >
            {t.navDaily}
          </button>
          <button
            onClick={handleScrollToFeedback}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer text-slate-400"
          >
            <MessageSquareHeart className="h-3.5 w-3.5 text-amber-400" />
            <span>{t.navReviews}</span>
          </button>
          <button
            onClick={onOpenGuides}
            className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors cursor-pointer text-slate-400"
          >
            <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
            <span>{t.navFiqh}</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Language Toggle & Profile) */}
        <div className="flex items-center gap-2.5">
          {/* Complete Language Toggle Button (English <-> Bangla) */}
          <button
            type="button"
            onClick={() => onToggleLanguage()}
            title={language === 'bn' ? 'Switch entire app to English' : 'সম্পূর্ণ অ্যাপ বাংলায় রূপান্তর করুন'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/70 to-blue-950/70 text-cyan-200 hover:text-white hover:border-cyan-300 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)] text-xs font-semibold transition-all cursor-pointer"
          >
            <Languages className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-mono font-bold">{language === 'bn' ? 'ENG' : 'বাংলা'}</span>
          </button>

          {/* Direct Input/Restart Dialog Button */}
          <button
            type="button"
            onClick={onOpenAuth}
            title={language === 'bn' ? 'ইনপুট ডায়ালগ খুলুন / ডাটা এডিট করুন' : 'Open Input Dialog / Edit Data'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-cyan-500/40 bg-slate-900/80 text-cyan-300 hover:text-white hover:border-cyan-300 hover:bg-cyan-950/40 text-xs font-semibold transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{language === 'bn' ? 'ইনপুট' : 'Input'}</span>
          </button>

          {/* Profile / Auth Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 text-cyan-200 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all cursor-pointer whitespace-nowrap"
          >
            {profile.isLoggedIn ? (
              <>
                <UserCheck className="h-3.5 w-3.5 text-cyan-400" />
                <span className="truncate max-w-[90px] sm:max-w-[120px]">
                  {profile.name || (language === 'bn' ? 'মুসাফির' : 'Guest')}
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-cyan-400/90 font-mono-tabular">
                  {profile.currentAgeYears}y
                </span>
              </>
            ) : (
              <>
                <UserPlus className="h-3.5 w-3.5 text-cyan-400" />
                <span>{t.navLogin}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip with auto scroll */}
      <div className="flex md:hidden border-t border-slate-800/80 bg-[#060a14] px-2 py-1.5 gap-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => handleNavClick('calculator')}
          className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'calculator'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 font-bold'
              : 'text-slate-400'
          }`}
        >
          {t.navLifetime}
        </button>
        <button
          onClick={() => handleNavClick('recovery')}
          className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'recovery'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 font-bold'
              : 'text-slate-400'
          }`}
        >
          {t.navRecovery}
        </button>
        <button
          onClick={() => handleNavClick('daily')}
          className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
            activeTab === 'daily'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 font-bold'
              : 'text-slate-400'
          }`}
        >
          {t.navDaily}
        </button>
        <button
          onClick={handleScrollToFeedback}
          className="px-3 py-1 rounded-md whitespace-nowrap text-amber-300 hover:text-white cursor-pointer"
        >
          {t.navReviews}
        </button>
        <button
          onClick={onOpenGuides}
          className="px-3 py-1 rounded-md whitespace-nowrap text-slate-400 hover:text-cyan-300 cursor-pointer"
        >
          {t.navFiqh}
        </button>
      </div>
    </header>
  );
};
