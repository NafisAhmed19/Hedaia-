// Comprehensive Internationalization (English <-> Bengali) Dictionary for Hidayah Salah Platform

export type Language = 'bn' | 'en';

const RAW_TRANSLATIONS = {
  bn: {
    brandName: 'HIDAYAH · হিদায়াহ',
    brandSubtitle: 'সালাত ও কাজা ক্যালকুলেটর',
    brandTagline: 'লাইফটাইম সালাত পরিমাপক ও কাজা রিকভারি প্ল্যাটফর্ম',
    navLifetime: 'লাইফটাইম হিসাব',
    navRecovery: 'কাজা রিকভারি রুটিন',
    navDaily: 'দৈনিক ওয়াক্ত ও অ্যালার্ম',
    navReviews: 'রিভিউ ও যুক্ত হোন',
    navFiqh: 'ফিকহ ও নিয়ম',
    navLogin: 'লগইন করুন',
    navProfile: 'প্রোফাইল',

    // Hero Atmosphere
    heroBadge: 'হিদায়াহ (Hidayah) · সালাত ও কাজা ক্যালকুলেটর',
    heroTitlePrefix: 'সালাত আপনার জীবনের',
    heroTitleHighlight: 'সর্বশ্রেষ্ঠ আমল',
    heroWelcome: 'স্বাগতম',
    heroGuest: 'সম্মানিত দ্বীনি ভাই/বোন',
    heroDescription:
      'জীবনে বিভিন্ন সময়ে অনিচ্ছাকৃতভাবে বা ব্যস্ততায় আমাদের যে নামাজগুলো ছুটে গেছে কিংবা আদায়ে কোনো ঘাটতি থাকার শঙ্কা রয়েছে—৫ বছর বয়স থেকে আজ পর্যন্ত সর্বোচ্চ সম্ভাব্য অপূর্ণতার ওপর ভিত্তি করে এই সতর্কতামূলক কাজা হিসাবটি প্রণয়ন করা হয়েছে, যাতে আল্লাহর রহমতে নামাজ ছুটে যাওয়ার দায় থেকে মুক্ত থাকা সম্ভব হয়।',
    heroBtnRoutine: 'কাজা রিকভারি রুটিন দেখুন',
    heroBtnChangeSettings: 'বয়স ও সেটিংস পরিবর্তন',
    heroCountdownTitle: 'পরবর্তী ওয়াক্তের কাউন্টডাউন',
    heroNextPrayer: 'পরবর্তী নামাজ',
    heroTimeRemaining: 'ওয়াক্ত শুরু হতে বাকি সময়',
    heroFard: 'ফরজ',
    heroTotal: 'মোট',
    heroRakat: 'রাকাত',
    heroCalculating: 'ওয়াক্ত গণনা করা হচ্ছে...',

    // View Switcher
    tab1: '১. লাইফটাইম হিসাব ও কাজা কাউন্ট',
    tab2: '২. সাজেস্টেড কাজা রুটিন ও প্ল্যানার',
    tab3: '৩. দৈনিক ওয়াক্ত ও ট্র্যাকার',
    activeRegionPrefix: 'বর্তমান সক্রিয় বিভাগ:',
    activeRegion1: '১. সামগ্রিক জীবনের সালাত ও সতর্কতামূলক কাজা হিসাব',
    activeRegion2: '২. সুশৃঙ্খল কাজা রিকভারি পরিকল্পনা ও দৈনিক চার্ট',
    activeRegion3: '৩. আজকের ৫ ওয়াক্তের সময়সূচি, লাইভ অ্যালার্ম ও হাদিস পাঠ',
    autoScrollReady: 'স্বয়ংক্রিয় স্ক্রল প্রস্তুত',

    // Setup / Onboarding Modal
    setupTitleNew: 'স্বাগতম! ব্যক্তিগত সালাত প্রোফাইল নির্ধারণ',
    setupTitleEdit: 'প্রোফাইল ও সালাত হিসাব পরিবর্তন',
    setupBadgeFirstTime: 'শুরুতেই পূরণীয়',
    setupSubtitle:
      'মুসাফির বা ডিফল্ট তথ্যের বদলে আপনার নাম, বয়স ও জেলা প্রদান করলে ড্যাশবোর্ডটি সরাসরি আপনার জীবনের জন্য প্রস্তুত হবে।',
    inputNameLabel: 'আপনার পুরো নাম / ডাকনাম',
    inputNamePlaceholder: 'যেমন: নাফিস আহমেদ',
    inputCityLabel: 'আপনার জেলা / অবস্থান',
    inputAgeMode: 'আপনার বর্তমান বয়স নির্ধারণ',
    inputAgeDirect: 'সরাসরি বয়স',
    inputAgeBirthDate: 'জন্মতারিখ',
    inputAgeYearsOld: 'বছর পূর্ণ হয়েছে',
    inputAgeNote:
      '* ৫ বছর বয়স থেকে শুরু করে আজ পর্যন্ত আপনার সামগ্রিক নামাজ ও সম্ভাব্য কাজার হিসাব নির্ধারিত হবে।',
    inputBirthDateLabel: 'জন্মতারিখ নির্বাচন করুন:',
    inputGenderLabel: 'লিঙ্গ (Gender)',
    genderMale: 'পুরুষ',
    genderFemale: 'মহিলা',
    femaleExemptionTitle: 'মাসিক বিশেষ দিনসমূহ (ছুট):',
    femaleExemptionDesc:
      'শরিয়াহ মোতাবেক মহিলাদের বিশেষ দিনগুলোতে সালাতের কোনো কাজা বা বাধ্যবাধকতা থাকে না (গড় ৭ দিন বাদ দেওয়া হয়)।',
    inputEmailLabel: 'ইমেইল (ঐচ্ছিক)',
    btnCreateDashboard: 'আমার ড্যাশবোর্ড তৈরি করুন',
    btnSaveChanges: 'পরিবর্তন সংরক্ষণ করুন',
    btnSuccessCreated: 'আলহামদুলিল্লাহ! ড্যাশবোর্ড প্রস্তুত হয়েছে...',

    // Language Toggle
    langSwitchLabel: 'ভাষা / Language',
    langToggleName: 'English এ দেখুন',

    // Feedback & Join
    feedbackSectionBadge: 'আমাদের সাথে থাকুন ও মতামত দিন',
    feedbackSectionTitle: 'মতামত ও হিদায়াহ পরিবারের সাথে যুক্ত হোন',
    feedbackSectionDesc:
      'আপনার প্রতিটি আন্তরিক পরামর্শ আমাদের অনুপ্রাণিত করে। একই সাথে সালাত সচেতনতা ও দ্বীনি কার্যক্রমে আমাদের সঙ্গী হওয়ার জন্য সাদর আমন্ত্রণ।',
    feedbackBoxTitle: 'আপনার মূল্যবান রিভিউ বা পরামর্শ',
    feedbackBoxDesc: 'অ্যাপের উন্নয়ন ও বরকত কামনায় আপনার মতামত জানান',
    feedbackRatingLabel: 'আপনার রেটিং দিন:',
    feedbackTypeLabel: 'মতামতের ধরন:',
    feedbackNameLabel: 'আপনার নাম (ঐচ্ছিক):',
    feedbackTextLabel: 'আপনার বিস্তারিত মতামত বা অভিজ্ঞতা:',
    feedbackTextPlaceholder: 'অ্যাপটি আপনার কেমন লাগছে বা কী কী নতুন সুবিধা যোগ করলে আরও ভালো হতো তা লিখুন...',
    feedbackBtnSubmit: 'রিভিউ জমা দিন',
    feedbackSubmittedSuccess: 'জাযাকাল্লাহু খাইরান! আপনার রিভিউ জমা হয়েছে।',
    feedbackRecentReviews: 'সাম্প্রতিক রিভিউসমূহ:',

    joinTitle: 'আমাদের সাথে যুক্ত হোন',
    joinSubtitle: 'হিদায়াহ পরিবারের দ্বীনি যাত্রার সহযাত্রী',
    joinDesc: 'নামাজের সচেতনতা বৃদ্ধি, একে অপরকে জামাতে নামাজের তাগিদ দেওয়া এবং দ্বীনি দাওয়াতের এই মহতী মিশনে আপনিও আমাদের সাথে সরাসরি যুক্ত হতে পারেন।',
    joinWeeklyDigestTitle: 'সাপ্তাহিক সালাত ডাইজেস্ট',
    joinWeeklyDigestDesc: 'প্রতি সপ্তাহে নতুন হাদিস, সালাতের ফজিলত ও আত্মশুদ্ধির উপদেশ',
    joinPartnerTitle: 'পারস্পরিক জবাবদিহিতা পার্টনার',
    joinPartnerDesc: 'দৈনিক ৫ ওয়াক্ত সালাতে পরস্পরকে উৎসাহ ও অনুপ্রেরণা প্রদান',
    joinNameLabel: 'আপনার পুরো নাম:',
    joinContactLabel: 'ইমেইল অথবা মোবাইল নম্বর:',
    joinRoleLabel: 'কী হিসেবে যুক্ত হতে চান:',
    joinBtnSubmit: 'যুক্ত হোন (Join Community)',
    joinSuccessTitle: 'আলহামদুলিল্লাহ! আপনি যুক্ত হয়েছেন',
    joinSuccessDesc: 'হিদায়াহ পরিবারের একজন গর্বিত সদস্য হিসেবে আপনাকে স্বাগতম। ইনশাআল্লাহ নিয়মিত দ্বীনি আপডেট আপনার কাছে পৌঁছে যাবে।',
    joinSpamFree: 'সম্পূর্ণ নিরাপদ ও স্প্যামমুক্ত',
    developerContact: 'ডেভেলপার যোগাযোগ: nafisahmeddn@gmail.com',

    // Alarm
    alarmWaqtArrived: 'ওয়াক্ত উপস্থিত',
    alarmNowPlaying: 'সুর বাজছে:',
    alarmMute: 'মিউট',
    alarmLater: 'পরে পড়ব',
    alarmPrayedDone: 'নামাজ পড়েছি',
  },
  en: {
    brandName: 'HIDAYAH',
    brandSubtitle: 'Salah & Qaza Calculator',
    brandTagline: 'Lifetime Salah Metric & Qaza Recovery Platform',
    navLifetime: 'Lifetime Calculator',
    navRecovery: 'Qaza Recovery Routine',
    navDaily: 'Daily Times & Alarm',
    navReviews: 'Reviews & Join',
    navFiqh: 'Fiqh & Guides',
    navLogin: 'Sign In',
    navProfile: 'Profile',

    // Hero Atmosphere
    heroBadge: 'Hidayah · Lifetime Salah & Qaza Recovery',
    heroTitlePrefix: 'Salah is the greatest deed of your',
    heroTitleHighlight: 'Whole Life',
    heroWelcome: 'Welcome',
    heroGuest: 'Honorable Brother/Sister',
    heroDescription:
      'Throughout our busy lives, prayers may have been unintentionally missed or incomplete. Based on an age-5 benchmark up to your current age, this cautionary Qaza calculation ensures spiritual peace of mind and accountability before Allah.',
    heroBtnRoutine: 'View Qaza Recovery Routine',
    heroBtnChangeSettings: 'Change Age & Settings',
    heroCountdownTitle: 'Next Prayer Countdown',
    heroNextPrayer: 'Next Prayer',
    heroTimeRemaining: 'Time remaining until start',
    heroFard: 'Fard',
    heroTotal: 'Total',
    heroRakat: 'Rakats',
    heroCalculating: 'Calculating prayer times...',

    // View Switcher
    tab1: '1. Lifetime Salah & Qaza Count',
    tab2: '2. Suggested Qaza Routine & Planner',
    tab3: '3. Daily Prayer Times & Tracker',
    activeRegionPrefix: 'Active Section:',
    activeRegion1: '1. Overall Lifetime Salah & Cautionary Qaza Metric',
    activeRegion2: '2. Disciplined Qaza Recovery Schedule & Daily Chart',
    activeRegion3: '3. Today’s 5 Prayers, Live Calming Athan & Hadiths',
    autoScrollReady: 'Direct Auto-scroll Ready',

    // Setup / Onboarding Modal
    setupTitleNew: 'Welcome! Setup Your Personal Salah Profile',
    setupTitleEdit: 'Edit Profile & Salah Calculation',
    setupBadgeFirstTime: 'Required First Step',
    setupSubtitle:
      'Instead of default guest data, enter your personal name, age, and city so the dashboard calculates precisely for your own life.',
    inputNameLabel: 'Your Full Name / Nickname',
    inputNamePlaceholder: 'e.g., Nafis Ahmed',
    inputCityLabel: 'Your District / City',
    inputAgeMode: 'Select Your Current Age',
    inputAgeDirect: 'Direct Age',
    inputAgeBirthDate: 'Birth Date',
    inputAgeYearsOld: 'Years Old',
    inputAgeNote:
      '* Calculated from age 5 up to your current age to establish an exhaustive, cautionary Salah audit.',
    inputBirthDateLabel: 'Select Date of Birth:',
    inputGenderLabel: 'Gender',
    genderMale: 'Male',
    genderFemale: 'Female',
    femaleExemptionTitle: 'Monthly Menstrual Exemption:',
    femaleExemptionDesc:
      'In Islamic jurisprudence, missed prayers during menstruation are entirely exempt from Qaza (7-day monthly average applied).',
    inputEmailLabel: 'Email (Optional)',
    btnCreateDashboard: 'Create & Setup My Dashboard',
    btnSaveChanges: 'Save Changes',
    btnSuccessCreated: 'Alhamdulillah! Dashboard is ready...',

    // Language Toggle
    langSwitchLabel: 'Language / ভাষা',
    langToggleName: 'বাংলায় দেখুন',

    // Feedback & Join
    feedbackSectionBadge: 'Stay Connected & Share Feedback',
    feedbackSectionTitle: 'User Reviews & Join Hidayah Community',
    feedbackSectionDesc:
      'Your sincere feedback inspires us continuously. You are warmly invited to join our mission for Salah awareness and spiritual growth.',
    feedbackBoxTitle: 'Your Valuable Review & Feedback',
    feedbackBoxDesc: 'Share your suggestions, review, or bug reports to bless this journey',
    feedbackRatingLabel: 'Your Rating:',
    feedbackTypeLabel: 'Category:',
    feedbackNameLabel: 'Your Name (Optional):',
    feedbackTextLabel: 'Your Detailed Feedback or Experience:',
    feedbackTextPlaceholder: 'Write how the app helped you, or what features you would love to see next...',
    feedbackBtnSubmit: 'Submit Review',
    feedbackSubmittedSuccess: 'Jazakallahu Khairan! Your review has been saved.',
    feedbackRecentReviews: 'Recent Community Reviews:',

    joinTitle: 'Join Our Community',
    joinSubtitle: 'Companion in Hidayah’s Spiritual Journey',
    joinDesc: 'Join our collective mission to encourage congregational Salah, share reminders, and grow spiritually together.',
    joinWeeklyDigestTitle: 'Weekly Salah Digest',
    joinWeeklyDigestDesc: 'Inspiring Hadiths, Salah virtues, and self-purification advice every week',
    joinPartnerTitle: 'Accountability Partner',
    joinPartnerDesc: 'Mutual motivation and reminders for all 5 daily prayers',
    joinNameLabel: 'Your Full Name:',
    joinContactLabel: 'Email or Mobile Number:',
    joinRoleLabel: 'How Would You Like to Join:',
    joinBtnSubmit: 'Join Community',
    joinSuccessTitle: 'Alhamdulillah! You Have Joined',
    joinSuccessDesc: 'Welcome as a member of the Hidayah family. Inspirational updates will be sent to you regularly.',
    joinSpamFree: '100% Safe & Spam-free',
    developerContact: 'Developer Contact: nafisahmeddn@gmail.com',

    // Alarm
    alarmWaqtArrived: 'Prayer Time Arrived',
    alarmNowPlaying: 'Playing Melody:',
    alarmMute: 'Mute',
    alarmLater: 'Pray Later',
    alarmPrayedDone: 'I Have Prayed',
  },
};

export type TranslationType = typeof RAW_TRANSLATIONS.bn;

export function getTranslation(lang?: string | null): TranslationType {
  if (lang === 'en') return RAW_TRANSLATIONS.en;
  return RAW_TRANSLATIONS.bn;
}

export const TRANSLATIONS: Record<string, TranslationType> & {
  bn: TranslationType;
  en: TranslationType;
} = new Proxy(RAW_TRANSLATIONS as any, {
  get(target, prop: string) {
    if (prop === 'en') return target.en;
    return target.bn;
  },
});

