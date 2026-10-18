import React, { useState, useEffect } from 'react';
import {
  MessageSquareHeart,
  UserPlus,
  Star,
  Send,
  CheckCircle2,
  Heart,
  Users,
  Mail,
  BookmarkCheck,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';
import { getTranslation, Language } from '../utils/translations';
import { NafisCustomFlag } from './NafisCustomFlag';

interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  category: string;
  comment: string;
  date: string;
}

const INITIAL_REVIEWS_BN: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'আব্দুল হাদী',
    rating: 5,
    category: 'প্রশংসা',
    comment: 'মাশাআল্লাহ! ৫ বছর বয়স থেকে হিসাব করে সতর্কতামূলক কাজা সালাতের রুটিন এবং সুরময় আজান রিমাইন্ডারটি আমার জীবনের নামাজে শৃঙ্খলা ফিরিয়ে এনেছে।',
    date: '২ দিন আগে',
  },
  {
    id: 'rev-2',
    name: 'তানজিলা তাসনিম',
    rating: 5,
    category: 'পরামর্শ',
    comment: 'শালীন ও বিনম্র ভাষায় নামাজের দায়িত্বমুক্তির যে ব্যাখ্যা দেওয়া হয়েছে তা অন্তরে গভীর নাড়া দিয়েছে। রিকভারি প্ল্যানারটি অসাধারণ!',
    date: '১ সপ্তাহ আগে',
  },
];

const INITIAL_REVIEWS_EN: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Abdul Hadi',
    rating: 5,
    category: 'Praise',
    comment: 'MashaAllah! The lifetime cautionary calculation from age 5 and soothing Athan alarm brought peaceful discipline to my daily prayers.',
    date: '2 days ago',
  },
  {
    id: 'rev-2',
    name: 'Tanzila Tasnim',
    rating: 5,
    category: 'Review',
    comment: 'The spiritual reassurance and disciplined Qaza recovery tracker gave me immense peace of mind. Truly invaluable!',
    date: '1 week ago',
  },
];

const STORAGE_KEY_FEEDBACK = 'hidayah_user_reviews_v1';
const STORAGE_KEY_JOINED = 'hidayah_community_joined_v1';

interface CommunityFeedbackAndJoinProps {
  profile: UserProfile;
  language: Language;
}

export const CommunityFeedbackAndJoin: React.FC<CommunityFeedbackAndJoinProps> = ({
  profile,
  language,
}) => {
  const t = getTranslation(language);

  // Feedback state
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FEEDBACK);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return language === 'bn' ? INITIAL_REVIEWS_BN : INITIAL_REVIEWS_EN;
  });

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackCategory, setFeedbackCategory] = useState<string>(
    language === 'bn' ? 'প্রশংসা' : 'Praise'
  );
  const [feedbackName, setFeedbackName] = useState<string>(profile.name || '');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);

  // Community Join state
  const [joinName, setJoinName] = useState<string>(profile.name || '');
  const [joinContact, setJoinContact] = useState<string>('');
  const [joinRole, setJoinRole] = useState<string>(
    language === 'bn' ? 'নিয়মিত সালাত পার্টনার' : 'Regular Prayer Partner'
  );
  const [joinSuccess, setJoinSuccess] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_JOINED) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (profile.name && !feedbackName) {
      setFeedbackName(profile.name);
    }
    if (profile.name && !joinName) {
      setJoinName(profile.name);
    }
  }, [profile.name]);

  // Handle Review Submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      name: feedbackName.trim() || (language === 'bn' ? 'বেনামী শুভাকাঙ্ক্ষী' : 'Anonymous Well-wisher'),
      rating,
      category: feedbackCategory,
      comment: feedbackText.trim(),
      date: language === 'bn' ? 'আজকে' : 'Today',
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setFeedbackText('');
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 5000);
  };

  // Handle Community Joining Submission
  const handleSubmitJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinContact.trim()) return;

    setJoinSuccess(true);
    try {
      localStorage.setItem(STORAGE_KEY_JOINED, 'true');
    } catch {
      // ignore
    }
  };

  const categories =
    language === 'bn'
      ? ['প্রশংসা', 'পরামর্শ', 'ফিচার অনুরোধ', 'সমস্যা বা বাগ']
      : ['Praise', 'Suggestion', 'Feature Request', 'Bug Report'];

  return (
    <section id="community-feedback-section" className="mt-14 space-y-8 scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs text-cyan-300">
          <Heart className="h-3.5 w-3.5 text-cyan-400 fill-cyan-400/20" />
          <span>{t.feedbackSectionBadge}</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t.feedbackSectionTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          {t.feedbackSectionDesc}
        </p>
      </div>

      {/* Dual Grid: Feedback Card + Community Join Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Card 1: Review & Feedback Box (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#0c162e] via-[#091122] to-[#050a16] p-6 sm:p-7 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300">
                <MessageSquareHeart className="h-5 w-5 text-cyan-400" />
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {t.feedbackBoxTitle}
                </h4>
                <p className="text-xs text-slate-400">{t.feedbackBoxDesc}</p>
              </div>
            </div>

            <span className="text-[11px] text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/60 font-semibold">
              {language === 'bn' ? 'রিভিউ বক্স' : 'Review Box'}
            </span>
          </div>

          {feedbackSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-3 animate-in fade-in duration-300">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold block">
                  {language === 'bn' ? 'জাযাকাল্লাহু খাইরান!' : 'Jazakallahu Khairan!'}
                </span>
                <span>{t.feedbackSubmittedSuccess}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
            {/* Star Rating Selector */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">
                {t.feedbackRatingLabel}
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 rounded-lg hover:scale-125 transition-transform cursor-pointer"
                    title={`${star} Star`}
                  >
                    <Star
                      className={`h-6 w-6 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-amber-300 font-semibold ml-2 text-xs">
                  {rating === 5
                    ? (language === 'bn' ? 'চমৎকার ও অনুপ্রেরণাদায়ী' : 'Excellent & Inspiring')
                    : rating === 4
                    ? (language === 'bn' ? 'খুব ভালো' : 'Very Good')
                    : rating === 3
                    ? (language === 'bn' ? 'সন্তোষজনক' : 'Satisfactory')
                    : (language === 'bn' ? 'উন্নয়ন প্রয়োজন' : 'Needs Improvement')}
                </span>
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">
                {t.feedbackTypeLabel}
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFeedbackCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      feedbackCategory === cat
                        ? 'border-cyan-400 bg-cyan-950/80 text-white font-bold shadow-sm'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Name input */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                {t.feedbackNameLabel}
              </label>
              <input
                type="text"
                value={feedbackName}
                onChange={(e) => setFeedbackName(e.target.value)}
                placeholder={t.inputNamePlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            {/* Feedback textarea */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                {t.feedbackTextLabel}
              </label>
              <textarea
                required
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={t.feedbackTextPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-600/30 hover:shadow-cyan-600/50 transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>{t.feedbackBtnSubmit}</span>
            </button>
          </form>

          {/* Recent Reviews Showcase */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
              {t.feedbackRecentReviews}
            </span>
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700 text-xs space-y-1 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{rev.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-200 border border-cyan-500/40 font-semibold">
                        {rev.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-100 text-xs leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                  <span className="text-[11px] text-slate-300 block text-right font-medium">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Community Join Option (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-amber-400/40 bg-gradient-to-br from-[#1b140b] via-[#100d17] to-[#070b16] p-6 sm:p-7 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-amber-950/60">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300">
                <Users className="h-5 w-5 text-amber-400" />
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-white">
                  {t.joinTitle}
                </h4>
                <p className="text-xs text-slate-200 font-medium">{t.joinSubtitle}</p>
              </div>
            </div>

            <span className="text-xs text-amber-200 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/50 font-bold">
              {language === 'bn' ? 'কমিউনিটি' : 'Community'}
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-200 leading-relaxed font-medium">
            <p>{t.joinDesc}</p>

            <div className="space-y-2 pt-1">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                <Mail className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">{t.joinWeeklyDigestTitle}</span>
                  <span className="text-xs text-slate-300">{t.joinWeeklyDigestDesc}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-700">
                <Users className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">{t.joinPartnerTitle}</span>
                  <span className="text-xs text-slate-300">{t.joinPartnerDesc}</span>
                </div>
              </div>
            </div>
          </div>

          {joinSuccess ? (
            <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-100 text-xs space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <BookmarkCheck className="h-5 w-5" />
                <span>{t.joinSuccessTitle}</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {t.joinSuccessDesc}
              </p>
              <div className="pt-2 text-[10px] text-slate-400">
                {t.developerContact}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitJoin} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {t.joinNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  placeholder={t.inputNamePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {t.joinContactLabel}
                </label>
                <input
                  type="text"
                  required
                  value={joinContact}
                  onChange={(e) => setJoinContact(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: yourname@gmail.com বা ০১৭১২...' : 'e.g. yourname@gmail.com or +880...'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  {t.joinRoleLabel}
                </label>
                <select
                  value={joinRole}
                  onChange={(e) => setJoinRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white focus:outline-none focus:border-amber-400 text-xs cursor-pointer"
                >
                  {language === 'bn' ? (
                    <>
                      <option value="নিয়মিত সালাত পার্টনার">নিয়মিত সালাত পার্টনার (দৈনিক উৎসাহের জন্য)</option>
                      <option value="দ্বীনি ভলান্টিয়ার">দ্বীনি ভলান্টিয়ার (অ্যাপ প্রচারে সাহায্যকারী)</option>
                      <option value="শুভাকাঙ্ক্ষী ও পরামর্শক">শুভাকাঙ্ক্ষী ও পরামর্শক</option>
                    </>
                  ) : (
                    <>
                      <option value="Regular Prayer Partner">Regular Prayer Partner (Daily encouragement)</option>
                      <option value="Volunteer">Volunteer (Help promote app)</option>
                      <option value="Well-wisher & Advisor">Well-wisher & Advisor</option>
                    </>
                  )}
                </select>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white font-semibold shadow-lg shadow-amber-600/30 hover:shadow-amber-600/50 transition-all cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>{t.joinBtnSubmit}</span>
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-amber-950/60 flex items-center justify-between text-[11px] text-slate-300">
            <span className="flex items-center gap-1 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              {t.joinSpamFree}
            </span>
            <span className="font-semibold text-slate-300">{t.brandName}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
