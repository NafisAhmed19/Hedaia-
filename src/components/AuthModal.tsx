import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Calendar,
  Sparkles,
  Check,
  MapPin,
  Heart,
  ArrowRight,
  Languages,
  RotateCcw,
} from 'lucide-react';
import { UserProfile } from '../types';
import { BANGLADESH_CITIES, calculateAge, formatNum } from '../utils/islamicPrayerCalc';
import { HidayahCalligraphyLogo } from './HidayahCalligraphyLogo';
import { getTranslation, Language } from '../utils/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  language: Language;
  onToggleLanguage: () => void;
  onResetApp?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  language,
  onToggleLanguage,
  onResetApp,
}) => {
  const t = getTranslation(language);
  const isFirstTime = !profile.hasCompletedOnboarding || !profile.name || profile.name === 'মুসাফির';
  const [formData, setFormData] = useState<UserProfile>({
    ...profile,
    name: profile.name === 'মুসাফির' ? '' : profile.name,
  });
  const [ageMethod, setAgeMethod] = useState<'directAge' | 'birthDate'>('directAge');
  const [directAgeStr, setDirectAgeStr] = useState<string>(() => {
    if (!profile.hasCompletedOnboarding || !profile.currentAgeYears) {
      return '';
    }
    return String(profile.currentAgeYears);
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [hideOnStartup, setHideOnStartup] = useState<boolean>(() => {
    try {
      return localStorage.getItem('salah_app_hide_startup_modal') === 'true';
    } catch {
      return false;
    }
  });

  // Sync state whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...profile,
        name: profile.name === 'মুসাফির' ? '' : profile.name,
      });
      if (!profile.hasCompletedOnboarding || !profile.currentAgeYears) {
        setDirectAgeStr('');
      } else {
        setDirectAgeStr(String(profile.currentAgeYears));
      }
    }
  }, [isOpen, profile]);

  const handleToggleHideStartup = (checked: boolean) => {
    setHideOnStartup(checked);
    try {
      if (checked) {
        localStorage.setItem('salah_app_hide_startup_modal', 'true');
      } else {
        localStorage.removeItem('salah_app_hide_startup_modal');
      }
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  const handleBirthDateChange = (val: string) => {
    const age = calculateAge(val);
    setFormData((prev) => ({
      ...prev,
      birthDate: val,
      currentAgeYears: age.years,
      currentAgeMonths: age.months,
      currentAgeDays: age.days,
    }));
  };

  const handleDirectAgeChange = (val: string) => {
    // Only accept numeric characters, max 3 digits
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 3);
    setDirectAgeStr(cleaned);

    if (cleaned === '') {
      return;
    }

    const num = parseInt(cleaned, 10);
    if (!isNaN(num) && num > 0) {
      const approxDate = new Date();
      approxDate.setFullYear(approxDate.getFullYear() - num);
      setFormData((prev) => ({
        ...prev,
        birthDate: approxDate.toISOString().split('T')[0],
        currentAgeYears: num,
        currentAgeMonths: 0,
        currentAgeDays: 0,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fallbackName = language === 'bn' ? 'আল্লাহর বান্দা' : 'Servant of Allah';
    
    // Parse typed age or fallback smoothly
    let finalAge = parseInt(directAgeStr, 10);
    if (isNaN(finalAge) || finalAge <= 0) {
      finalAge = 20; // default fallback on submit if left empty
    } else {
      finalAge = Math.max(5, Math.min(120, finalAge));
    }

    const approxDate = new Date();
    approxDate.setFullYear(approxDate.getFullYear() - finalAge);

    const updated: UserProfile = {
      ...formData,
      name: formData.name.trim() || fallbackName,
      birthDate: formData.birthDate || approxDate.toISOString().split('T')[0],
      currentAgeYears: finalAge,
      isLoggedIn: true,
      hasCompletedOnboarding: true,
    };
    onSaveProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-[#0c162e] via-[#091122] to-[#050a16] text-slate-100 shadow-[0_25px_65px_-15px_rgba(6,182,212,0.35)] p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Hidayah Brand Header with Calligraphy Logo & Language Switcher */}
        <div className="flex flex-col items-center justify-center text-center pb-5 border-b border-cyan-500/20 relative">
          <div className="relative mb-2">
            <HidayahCalligraphyLogo size="lg" withGlow={true} />
          </div>

          <div className="space-y-1">
            <span className="font-cinzel text-xl sm:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)] block">
              {t.brandName}
            </span>
            <p className="text-xs text-cyan-300 font-medium">
              {t.brandTagline}
            </p>
          </div>

          {/* Top-Right Language Switcher & Close button */}
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleLanguage()}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-950/70 text-cyan-300 hover:text-white hover:border-cyan-300 text-xs font-semibold shadow-sm transition-all cursor-pointer"
              title={language === 'bn' ? 'Switch to English' : 'বাংলায় রূপান্তর করুন'}
            >
              <Languages className="h-3.5 w-3.5 text-cyan-400" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              title={language === 'bn' ? 'বন্ধ করুন / ড্যাশবোর্ডে প্রবেশ করুন' : 'Close / Go to Dashboard'}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Welcome Instructions Card */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-blue-950/60 border border-cyan-500/30 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
            <Sparkles className="h-5 w-5 text-cyan-400" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white">
                {isFirstTime ? t.setupTitleNew : t.setupTitleEdit}
              </h2>
              {isFirstTime && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-bold">
                  {t.setupBadgeFirstTime}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {t.setupSubtitle}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-5 text-xs text-slate-300">
          {/* Name & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-cyan-400" />
                {t.inputNameLabel} <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t.inputNamePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                {t.inputCityLabel} <span className="text-cyan-400">*</span>
              </label>
              <select
                value={formData.selectedCity}
                onChange={(e) => setFormData({ ...formData, selectedCity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                {Object.entries(BANGLADESH_CITIES).map(([k, v]) => (
                  <option key={k} value={k} className="bg-slate-900 text-white">
                    {language === 'bn' ? `${v.nameBn} (${v.nameEn})` : `${v.nameEn} (${v.nameBn})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Age Selection Mode */}
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-cyan-400" />
                {t.inputAgeMode} <span className="text-cyan-400">*</span>
              </span>

              <div className="flex rounded-xl bg-slate-900 p-0.5 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setAgeMethod('directAge')}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                    ageMethod === 'directAge'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.inputAgeDirect}
                </button>
                <button
                  type="button"
                  onClick={() => setAgeMethod('birthDate')}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                    ageMethod === 'birthDate'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t.inputAgeBirthDate}
                </button>
              </div>
            </div>

            {ageMethod === 'directAge' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={3}
                      value={directAgeStr}
                      placeholder="00"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => handleDirectAgeChange(e.target.value)}
                      className="w-28 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-lg font-bold text-cyan-300 font-mono-tabular text-center placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
                    />
                  </div>
                  <span className="text-sm text-slate-300 font-medium">
                    {t.inputAgeYearsOld}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {t.inputAgeNote}
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  {t.inputBirthDateLabel}
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => {
                    handleBirthDateChange(e.target.value);
                    const calculated = calculateAge(e.target.value);
                    setDirectAgeStr(String(calculated.years));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            )}
          </div>

          {/* Gender selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                {t.inputGenderLabel}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: 'male', femaleExemptionDaysPerMonth: 0 })}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    formData.gender === 'male'
                      ? 'border-cyan-400 bg-cyan-950/60 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.genderMale}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: 'female', femaleExemptionDaysPerMonth: 7 })}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    formData.gender === 'female'
                      ? 'border-cyan-400 bg-cyan-950/60 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white'
                  }`}
                >
                  {t.genderFemale}
                </button>
              </div>
            </div>

            {/* Optional Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                {t.inputEmailLabel}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Female Exemption if female */}
          {formData.gender === 'female' && (
            <div className="p-3.5 rounded-xl border border-pink-900/40 bg-pink-950/20 text-xs space-y-1">
              <span className="font-semibold text-pink-300 block">
                {t.femaleExemptionTitle}
              </span>
              <p className="text-[11px] text-slate-300">
                {t.femaleExemptionDesc}
              </p>
            </div>
          )}

          {/* Submit Button & Actions */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 hover:shadow-cyan-600/50 hover:scale-[1.01] transition-all cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="h-5 w-5" />
                  <span>{t.btnSuccessCreated}</span>
                </>
              ) : isFirstTime ? (
                <>
                  <span>{t.btnCreateDashboard}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <span>{t.btnSaveChanges}</span>
              )}
            </button>

            {/* Direct to dashboard button if user already has data */}
            {!isFirstTime && (
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-4 rounded-xl border border-slate-700 bg-slate-900/80 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'সরাসরি ড্যাশবোর্ডে প্রবেশ করুন' : 'Continue to Dashboard without changes'}
              </button>
            )}

            {/* Option to toggle auto-open on app startup */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={hideOnStartup}
                  onChange={(e) => handleToggleHideStartup(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                />
                <span>
                  {language === 'bn'
                    ? 'ভবিষ্যতে অ্যাপ রিস্টার্টে এটি অটোমেটিক দেখাবেন না'
                    : 'Do not auto-open on app restart'}
                </span>
              </label>

              {onResetApp && (
                <button
                  type="button"
                  onClick={onResetApp}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer self-start sm:self-auto hover:underline"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>{language === 'bn' ? 'সম্পূর্ণ অ্যাপ রিস্টার্ট' : 'Full App Restart'}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
