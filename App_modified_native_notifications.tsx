/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Capacitor } from '@capacitor/core';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, 
  Moon, 
  BookOpen, 
  Heart, 
  Shield, 
  Compass, 
  Clock, 
  Calendar as CalendarIcon, 
  BookOpenCheck, 
  Bot, 
  Settings, 
  Info, 
  Share2, 
  Sparkles,
  ChevronRight,
  Copy,
  RotateCcw,
  Plus,
  Minus,
  Award,
  ArrowRight,
  RefreshCw,
  Play,
  Flame,
  CheckCircle2,
  Bell,
  Volume2,
  Globe,
  HardDrive,
  User,
  UserCheck,
  HeartHandshake,
  Search,
  Smartphone,
  RotateCw
} from 'lucide-react';

import { AppSettings } from './types';
import { getAccuratePrayerTimes, findCountryAndCity } from './data/prayerCities';
import { formatTime12 } from './utils/formatTime';
import SettingsModal from './components/SettingsModal';
import QuranSection from './components/QuranSection';
import TasbihSection from './components/TasbihSection';
import AzkarSection from './components/AzkarSection';
import QiblaSection from './components/QiblaSection';
import PrayerTimesSection from './components/PrayerTimesSection';
import KhatmaSection from './components/KhatmaSection';
import HadithSection from './components/HadithSection';
import AIChatSection from './components/AIChatSection';
import RuqyahSection from './components/RuqyahSection';
import VisualAdhanModal from './components/VisualAdhanModal';
import VerseOfTheDay from './components/VerseOfTheDay';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import ProfileSection from './components/ProfileSection';
import EhsanIslamicPlatformSection from './components/EhsanIslamicPlatformSection';
import WelcomeSplashScreen from './components/WelcomeSplashScreen';
import MakkahLiveRadioPlayer from './components/MakkahLiveRadioPlayer';
import UnifiedSearchFavoritesModal from './components/UnifiedSearchFavoritesModal';
import { ISLAMIC_AVATARS } from './assets/avatars';
import { requestAllPermissions, scheduleAllNativeNotifications, checkPermissionsStatus } from './utils/nativeNotifications';
import { playAdhanAudio, stopAdhanAudio, playPrePrayerChime, playIqamaChime } from './utils/adhanPlayer';
import { safeStorage } from './utils/safeStorage';

// @ts-ignore
import defaultLogo from './assets/images/app_logo_avatar_1787082876013.jpg';
// @ts-ignore
import defaultBanner from './assets/images/mosque_banner_1784263300816.jpg';

// Rich spiritual information for each prayer time alert
const PRAYERS_INFO = {
  Fajr: {
    arabicName: 'الفجر',
    supplication: 'اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً. اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور.',
    tip: 'صلاة الفجر تشهدها ملائكة الليل وملائكة النهار، واحرص على أدائها في وقتها لتكون في ذمة الله عز وجل طوال يومك.'
  },
  Dhuhr: {
    arabicName: 'الظهر',
    supplication: 'اللهم إني أعوذ بك من العجز والكسل، والجبن والهرم والبخل. اللهم اغفر لي خطيئتي وجهلي وإسرافي في أمري.',
    tip: 'صلاة الظهر هي أول صلاة صلاها جبريل بالنبي ﷺ، فاجعلها محطة لتجديد نشاطك الروحي والبدني في منتصف يومك.'
  },
  Asr: {
    arabicName: 'العصر',
    supplication: 'يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين.',
    tip: 'صلاة العصر هي الصلاة الوسطى التي خصها الله تعالى بالذكر في القرآن الكريم، فاحرص عليها لئلا يحبط عملك.'
  },
  Maghrib: {
    arabicName: 'المغرب',
    supplication: 'اللهم هذا إقبال ليلك وإدبار نهارك وأصوات دعاتك فاغفر لي. لا إله إلا الله وحده لا شريك له.',
    tip: 'صلاة المغرب هي وتر النهار، والوقت بعد صلاة المغرب من الأوقات المباركة، فاغتنمها في تلاوة القرآن وذكر الله.'
  },
  Isha: {
    arabicName: 'العشاء',
    supplication: 'اللهم رب السماوات ورب الأرض ورب العرش العظيم، ربنا ورب كل شيء، فالق الحب والنوى، ومنزل التوراة والإنجيل والفرقان.',
    tip: 'صلاة العشاء والصبح في جماعة تعدلان قيام الليل، فاحرص عليهما لتبيت ليلتك آمناً في كنف الرحمن سبحانه.'
  },
  Sunrise: {
    arabicName: 'الشروق',
    supplication: 'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور. أصبحنا وأصبح الملك لله والحمد لله.',
    tip: 'أشرقت الشمس فصلاة الضحى تبدأ بعد الشروق بقرابة ربع ساعة، وهي صلاة الأوابين وتعدل صدقة عن كل مفصل من مفاصل جسدك.'
  }
};

const getLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSearchFavModalOpen, setIsSearchFavModalOpen] = useState<boolean>(false);
  const [showWelcomeSplash, setShowWelcomeSplash] = useState<boolean>(() => {
    return safeStorage.getItem('noor_hide_welcome_splash') !== 'true';
  });
  const [activeAdhanAlert, setActiveAdhanAlert] = useState<{
    prayerName: string;
    arabicName: string;
    time: string;
    city: string;
    supplication: string;
    tip: string;
  } | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showShareToast, setShowShareToast] = useState<boolean>(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  // Lock orientation to portrait & detect landscape on mobile devices
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.screen && (window.screen.orientation as any)?.lock) {
        (window.screen.orientation as any).lock('portrait').catch(() => {});
      }
    } catch (e) {}

    const checkOrientation = () => {
      if (typeof window !== 'undefined') {
        const isTouchMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth < 768 && window.innerHeight < 480;
        const isLand = isTouchMobile && isSmallScreen && window.innerWidth > window.innerHeight;
        setIsLandscape(isLand);
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const stored = safeStorage.getItem('noor_settings');
    const defaults = {
      theme: 'dark',
      calculationMethod: 'UmmAlQura',
      latitude: null,
      longitude: null,
      country: 'مملكة البحرين',
      city: 'المنامة',
      adhanReminder: true,
      visualAdhanAlert: true,
      azkarReminder: true,
      soundEnabled: true,
      customAdhanSound: 'default',
      appName: 'نور الإسلام',
      dedicationText: 'صدقة جارية بإذن الله عن لؤي بن حسين وعن والده رحمه الله وغفر له وجميع المسلمين والمسلمات الأحياء منهم والأموات.',
      developerName: 'لؤي بن حسين',
      snapchatUrl: 'https://snapchat.com/t/vezdvWWb',
      appLogoUrl: defaultLogo,
      headerBgUrl: defaultBanner
    };
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        let modified = false;
        // Clean up old or invalid asset URLs from previous builds
        if (parsed.appLogoUrl && (parsed.appLogoUrl.includes('/src/assets/') || parsed.appLogoUrl.includes('1784263255295'))) {
          parsed.appLogoUrl = defaultLogo;
          modified = true;
        }
        if (parsed.headerBgUrl && (parsed.headerBgUrl.includes('/src/assets/') || parsed.headerBgUrl.includes('1784263300816'))) {
          parsed.headerBgUrl = defaultBanner;
          modified = true;
        }
        const finalSettings = { ...defaults, ...parsed };
        if (modified) {
          safeStorage.setItem('noor_settings', JSON.stringify(finalSettings));
        }
        return finalSettings;
      } catch (e) {
        return defaults;
      }
    }
    return defaults;
  });

  // Track the clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Native iOS / Android notification scheduling.
  // Browser Notification APIs are intentionally not used here; lock-screen reminders
  // are handled by Capacitor Local Notifications in nativeNotifications.ts.
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    requestAllPermissions().then((granted) => {
      if (granted) {
        getAccuratePrayerTimes(
          settings.country || 'مملكة البحرين',
          settings.city || 'المنامة',
          settings.calculationMethod
        ).then(res => {
          const prayers = [
            { name: 'Fajr', arabicName: 'الفجر', time: res.times.Fajr, isPassed: false, isNext: false },
            { name: 'Sunrise', arabicName: 'الشروق', time: res.times.Sunrise, isPassed: false, isNext: false },
            { name: 'Dhuhr', arabicName: 'الظهر', time: res.times.Dhuhr, isPassed: false, isNext: false },
            { name: 'Asr', arabicName: 'العصر', time: res.times.Asr, isPassed: false, isNext: false },
            { name: 'Maghrib', arabicName: 'المغرب', time: res.times.Maghrib, isPassed: false, isNext: false },
            { name: 'Isha', arabicName: 'العشاء', time: res.times.Isha, isPassed: false, isNext: false },
          ];
          scheduleAllNativeNotifications(prayers, settings);
        }).catch(err => console.warn(err));
      }
    });
  }, [settings.city, settings.adhanReminder, settings.azkarReminder, settings.prePrayerReminder, settings.iqamaReminder, settings.fridayKahfReminder, settings.tahajjudReminder]);

  // Foreground prayer checker: handles live in-app audio/visual alerts only.
  // No Web Notification API is used here.
  // Lock-screen/background reminders are scheduled natively by Capacitor.
  useEffect(() => {
    const triggeredKey = 'noor_triggered_adhan';
    
    const checkPrayerTimes = async () => {
      // Check if global settings for prayer notifications are enabled
      if (!settings.visualAdhanAlert && !settings.adhanReminder) return;

      const res = await getAccuratePrayerTimes(
        settings.country || 'مملكة البحرين',
        settings.city || 'المنامة',
        settings.calculationMethod
      );
      const times = res.times;

      const computedPrayers = [
        { name: 'Fajr', arabicName: 'الفجر', time: times.Fajr },
        { name: 'Sunrise', arabicName: 'الشروق', time: times.Sunrise },
        { name: 'Dhuhr', arabicName: 'الظهر', time: times.Dhuhr },
        { name: 'Asr', arabicName: 'العصر', time: times.Asr },
        { name: 'Maghrib', arabicName: 'المغرب', time: times.Maghrib },
        { name: 'Isha', arabicName: 'العشاء', time: times.Isha },
      ];

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentHHMM = `${hours}:${minutes}`;
      const todayStr = getLocalDateKey(now); // Local YYYY-MM-DD
      const preMinOffset = settings.prePrayerMinutes ?? 5;

      // Load already triggered list
      const triggeredStored = safeStorage.getItem(triggeredKey);
      let triggeredList: string[] = [];
      if (triggeredStored) {
        try {
          triggeredList = JSON.parse(triggeredStored);
        } catch (e) {
          triggeredList = [];
        }
      }

      // Filter and clean old items (older than today)
      triggeredList = triggeredList.filter(item => item.startsWith(todayStr));

      // Lock-screen reminders such as Friday Al-Kahf and Tahajjud are scheduled
      // natively by scheduleAllNativeNotifications().
      // Keep this foreground checker only for live in-app audio/visual behavior.
      computedPrayers.forEach((p) => {
        const [pHour, pMin] = p.time.split(':').map(Number);
        
        // A. Check Pre-Prayer Reminder (e.g. 5 minutes before prayer)
        if (p.name !== 'Sunrise' && (settings.prePrayerReminder !== false)) {
          let preTotalMin = pHour * 60 + pMin - preMinOffset;
          if (preTotalMin < 0) preTotalMin += 24 * 60;
          const preH = Math.floor(preTotalMin / 60);
          const preM = preTotalMin % 60;
          const preHHMM = `${String(preH).padStart(2, '0')}:${String(preM).padStart(2, '0')}`;

          if (currentHHMM === preHHMM) {
            const preTriggerId = `${todayStr}-pre-${p.name}-${preMinOffset}min`;
            if (!triggeredList.includes(preTriggerId)) {
              // Play soft pre-prayer chime alert
              if (settings.soundEnabled) {
                playPrePrayerChime();
              }
              triggeredList.push(preTriggerId);
              safeStorage.setItem(triggeredKey, JSON.stringify(triggeredList));
            }
          }
        }

        // B. Check Exact Prayer Time (Adhan Moment)
        if (p.time === currentHHMM) {
          const uniqueTriggerId = `${todayStr}-${p.name}-${p.time}`;
          if (!triggeredList.includes(uniqueTriggerId)) {
            const info = PRAYERS_INFO[p.name as keyof typeof PRAYERS_INFO];
            
            // Trigger authentic Adhan audio playback
            if (settings.soundEnabled || settings.adhanReminder) {
              playAdhanAudio(settings.selectedAdhanVoice || 'makkah', 1.0);
            }

            // Lock-screen notification is handled by the native scheduler.

            // In-App Visual Alert popup (Visual Adhan Alert)
            if (settings.visualAdhanAlert) {
              setActiveAdhanAlert({
                prayerName: p.name,
                arabicName: p.arabicName,
                time: p.time,
                city: settings.city,
                supplication: info?.supplication || '',
                tip: info?.tip || ''
              });
            }

            // Append to triggered list to prevent duplicate triggers in the same minute
            triggeredList.push(uniqueTriggerId);
            safeStorage.setItem(triggeredKey, JSON.stringify(triggeredList));
          }
        }

        // C. Check Post-Adhan / Iqama & Sunnah Follow-up Reminder (e.g. 10 minutes after adhan)
        if (p.name !== 'Sunrise' && (settings.iqamaReminder !== false)) {
          const iqamaOffset = settings.iqamaMinutes ?? 15;
          let postTotalMin = pHour * 60 + pMin + iqamaOffset;
          if (postTotalMin >= 24 * 60) postTotalMin -= 24 * 60;
          const postH = Math.floor(postTotalMin / 60);
          const postM = postTotalMin % 60;
          const postHHMM = `${String(postH).padStart(2, '0')}:${String(postM).padStart(2, '0')}`;

          if (currentHHMM === postHHMM) {
            const postTriggerId = `${todayStr}-post-iqama-${p.name}-${iqamaOffset}min`;
            if (!triggeredList.includes(postTriggerId)) {
              if (settings.soundEnabled) {
                playIqamaChime();
              }
              triggeredList.push(postTriggerId);
              safeStorage.setItem(triggeredKey, JSON.stringify(triggeredList));
            }
          }
        }
      });
    };

    checkPrayerTimes();
    const interval = setInterval(checkPrayerTimes, 30000);
    return () => clearInterval(interval);
  }, [settings.city, settings.country, settings.calculationMethod, settings.adhanReminder, settings.visualAdhanAlert, settings.soundEnabled, settings.selectedAdhanVoice, settings.prePrayerReminder, settings.prePrayerMinutes, settings.iqamaReminder, settings.iqamaMinutes, settings.fridayKahfReminder, settings.tahajjudReminder]);

  // Sync settings and apply dark theme
  useEffect(() => {
    safeStorage.setItem('noor_settings', JSON.stringify(settings));
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings]);

  // Global Keyboard shortcuts (Ctrl+K / Cmd+K to search, Esc to close modals or return home)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchFavModalOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        if (isSearchFavModalOpen) {
          setIsSearchFavModalOpen(false);
        } else if (isSettingsOpen) {
          setIsSettingsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFavModalOpen, isSettingsOpen]);

  const handleUpdateSettings = useCallback((newSettings: AppSettings) => {
    setSettings(newSettings);
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  }, []);

  const toggleLanguage = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      language: prev.language === 'en' ? 'ar' : 'en'
    }));
  }, []);

  const getHijriDate = useCallback(() => {
    try {
      const locale = settings.language === 'en' ? 'en-US-u-ca-islamic-umalqura' : 'ar-SA-u-ca-islamic-umalqura';
      return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(new Date());
    } catch (e) {
      return settings.language === 'en' ? '25 Rajab 1447 AH' : '٢٥ رجب ١٤٤٧ هـ';
    }
  }, [settings.language]);

  const getGregorianDate = useCallback(() => {
    const locale = settings.language === 'en' ? 'en-US' : 'ar-SA';
    return new Date().toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [settings.language]);

  // Persisted Daily Worship Tracker
  const [dailyPrayers, setDailyPrayers] = useState<{ [key: string]: boolean }>(() => {
    const saved = safeStorage.getItem('noor_daily_prayers_checked');
    const todayStr = getLocalDateKey(new Date());
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === todayStr) {
          return parsed.prayers;
        }
      } catch (e) {}
    }
    return {
      Fajr: false,
      Dhuhr: false,
      Asr: false,
      Maghrib: false,
      Isha: false,
      Duha: false,
      Witr: false,
      AzkarSabah: false,
      AzkarMasaa: false
    };
  });

  // Daily open streak counter
  const [streakDays, setStreakDays] = useState<number>(1);

  // Notification Permission Status
  const [notificationStatus, setNotificationStatus] = useState<string>('غير محدد');

  const checkInitialPermissions = async () => {
    try {
      const status = await checkPermissionsStatus();
      if (status === 'granted') {
        setNotificationStatus(settings.language === 'en' ? 'Enabled Successfully ✅' : 'مفعلة بنجاح ✅');
      } else if (status === 'denied') {
        setNotificationStatus(settings.language === 'en' ? 'Denied ❌' : 'مرفوضة ❌');
      } else {
        setNotificationStatus(settings.language === 'en' ? 'Not Configured' : 'غير محدد');
      }
    } catch {
      setNotificationStatus('غير محدد');
    }
  };

  const handleRequestNotificationPermissions = async () => {
    try {
      if (!Capacitor.isNativePlatform()) {
        setNotificationStatus(settings.language === 'en' ? 'Available in the iOS/Android app' : 'متاح داخل تطبيق iOS/Android');
        return;
      }
      const granted = await requestAllPermissions();
      if (granted) {
        setNotificationStatus(settings.language === 'en' ? 'Enabled Successfully ✅' : 'مفعلة بنجاح ✅');
        const { computedPrayers } = getNextPrayerInfo();
        await scheduleAllNativeNotifications(computedPrayers, settings);
      } else {
        setNotificationStatus(settings.language === 'en' ? 'Denied ❌' : 'مرفوضة ❌');
      }
    } catch (error) {
      console.log('Error requesting permissions:', error);
      setNotificationStatus('مرفوضة ❌');
    }
  };

  useEffect(() => {
    checkInitialPermissions();
  }, []);

  // Quick electronic Tasbih state
  const [quickTasbihCount, setQuickTasbihCount] = useState<number>(() => {
    const saved = safeStorage.getItem('noor_quick_tasbih_count');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [quickTasbihText, setQuickTasbihText] = useState<string>('سبحان الله وبحمده');

  // Random Inspirations Box
  const CURATED_INSPIRATIONS = [
    { text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", ref: "سورة الرعد • الآية ٢٨", type: "قرآن" },
    { text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", ref: "سورة الشرح • الآية ٦", type: "قرآن" },
    { text: "فَإِنِّي قَرِيبٌ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ", ref: "سورة البقرة • الآية ١٨٦", type: "قرآن" },
    { text: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ", ref: "سورة الضحى • الآية ٣", type: "قرآن" },
    { text: "احفظ الله يحفظك، احفظ الله تجده تجاهك", ref: "الحديث الشريف • رواه الترمذي", type: "حديث" },
    { text: "عجبًا لأمر المؤمن إن أمره كله خير، وليس ذاك لأحد إلا للمؤمن", ref: "الحديث الشريف • رواه مسلم", type: "حديث" }
  ];
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  // Daily open streak counter effect
  useEffect(() => {
    const lastOpen = safeStorage.getItem('noor_last_open_date');
    const todayStr = getLocalDateKey(new Date());
    const currentStreak = safeStorage.getItem('noor_streak_count');
    let streak = currentStreak ? parseInt(currentStreak, 10) : 1;
    
    if (lastOpen) {
      if (lastOpen !== todayStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().substring(0, 10);
        if (lastOpen === yesterdayStr) {
          streak += 1;
        } else {
          streak = 1;
        }
        safeStorage.setItem('noor_streak_count', streak.toString());
        safeStorage.setItem('noor_last_open_date', todayStr);
      }
    } else {
      safeStorage.setItem('noor_last_open_date', todayStr);
      safeStorage.setItem('noor_streak_count', '1');
    }
    setStreakDays(streak);
  }, []);

  // Toggle daily prayer item
  const toggleDailyPrayer = (key: string) => {
    const updated = { ...dailyPrayers, [key]: !dailyPrayers[key] };
    setDailyPrayers(updated);
    const todayStr = getLocalDateKey(new Date());
    safeStorage.setItem('noor_daily_prayers_checked', JSON.stringify({ date: todayStr, prayers: updated }));
  };

  // Increment quick electronic tasbih
  const incrementQuickTasbih = () => {
    const newCount = quickTasbihCount + 1;
    setQuickTasbihCount(newCount);
    safeStorage.setItem('noor_quick_tasbih_count', newCount.toString());
    
    // Add physical vibration feedback on every click
    if (navigator.vibrate) {
      navigator.vibrate(40);
    }

    if (settings.soundEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(960, ctx.currentTime);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.08);
        }
      } catch (e) {}
    }
  };

  const resetQuickTasbih = () => {
    setQuickTasbihCount(0);
    safeStorage.setItem('noor_quick_tasbih_count', '0');
  };

  const handleShareApp = async () => {
    const shareUrl = window.location.href;
    const shareTitle = settings.appName || (isEn ? 'Noor Al-Islam App' : 'تطبيق نور الإسلام');
    const shareMessage = isEn 
      ? `Noor Al-Islam: Comprehensive Islamic companion (Quran, Adhkar, Prayer Times, Tasbih, Ruqyah)\n${shareUrl}` 
      : `تطبيق نور الإسلام: رفيقك الروحي الشامل (القرآن الكريم، الأذكار، مواقيت الصلاة، التسبيح، الرقية الشرعية)\n${shareUrl}`;

    // 1. Try Native Web Share API if supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareMessage,
          url: shareUrl
        });
        return;
      } catch (err) {
        // User cancelled or share permission not available in iframe, continue to copy fallback
      }
    }

    // 2. Modern Clipboard API fallback
    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareMessage);
        copied = true;
      }
    } catch (e) {}

    // 3. Robust ExecCommand fallback for older iOS Safari / sandboxed iframes
    if (!copied) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = shareMessage;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        copied = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (err) {}
    }

    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3500);
  };

  const isEn = settings.language === 'en';

  // Dynamic Greeting Text
  const getDynamicGreeting = () => {
    const hrs = currentTime.getHours();
    if (isEn) {
      if (hrs < 12) return 'Morning of serenity and remembrance ☀️';
      if (hrs < 18) return 'Evening of forgiveness and gratitude 🌤️';
      return 'Blessed night adorned with remembrance 🌙';
    }
    if (hrs < 12) return 'صباح السكينة وطمأنينة الذكر ☀️';
    if (hrs < 18) return 'مساء الغفران والرضوان والشكر 🌤️';
    return 'ليل مبارك معطر بذكر اللّٰه 🌙';
  };

  // Cycle quote wheel
  const cycleQuote = useCallback(() => {
    setQuoteIndex(prev => (prev + 1) % CURATED_INSPIRATIONS.length);
  }, []);

  // Compute standard day prayer times
  const computedPrayers = useMemo(() => {
    const { city } = findCountryAndCity(settings.country, settings.city);
    const base = city.baseTimes;
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const seasonalShift = Math.round(20 * Math.sin((dayOfYear + 80) * 2 * Math.PI / 365));

    const formatAndShift = (timeStr: string, shiftMins: number) => {
      const [hStr, mStr] = timeStr.split(':');
      let h = parseInt(hStr);
      let m = parseInt(mStr) + shiftMins;
      if (m >= 60) {
        h += Math.floor(m / 60);
        m = m % 60;
      } else if (m < 0) {
        h -= Math.ceil(Math.abs(m) / 60);
        m = 60 - (Math.abs(m) % 60);
      }
      h = (h + 24) % 24;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    return [
      { name: 'Fajr', arabic: isEn ? 'Fajr' : 'الفجر', arabicName: isEn ? 'Fajr' : 'الفجر', time: formatAndShift(base.Fajr, seasonalShift), isPassed: false, isNext: false },
      { name: 'Sunrise', arabic: isEn ? 'Sunrise' : 'الشروق', arabicName: isEn ? 'Sunrise' : 'الشروق', time: formatAndShift(base.Sunrise, seasonalShift - 5), isPassed: false, isNext: false },
      { name: 'Dhuhr', arabic: isEn ? 'Dhuhr' : 'الظهر', arabicName: isEn ? 'Dhuhr' : 'الظهر', time: formatAndShift(base.Dhuhr, seasonalShift + 3), isPassed: false, isNext: false },
      { name: 'Asr', arabic: isEn ? 'Asr' : 'العصر', arabicName: isEn ? 'Asr' : 'العصر', time: formatAndShift(base.Asr, seasonalShift + 8), isPassed: false, isNext: false },
      { name: 'Maghrib', arabic: isEn ? 'Maghrib' : 'المغرب', arabicName: isEn ? 'Maghrib' : 'المغرب', time: formatAndShift(base.Maghrib, seasonalShift + 2), isPassed: false, isNext: false },
      { name: 'Isha', arabic: isEn ? 'Isha' : 'العشاء', arabicName: isEn ? 'Isha' : 'العشاء', time: formatAndShift(base.Isha, seasonalShift + 1), isPassed: false, isNext: false },
    ];
  }, [settings.country, settings.city, isEn]);

  // Calculate Next Prayer countdown with live seconds & progress
  const getNextPrayerInfo = useCallback(() => {
    const now = currentTime;
    const currentSecs = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    let nextPrayer = computedPrayers[0];
    let prevPrayer = computedPrayers[computedPrayers.length - 1];
    let minDiffSecs = 24 * 3600;

    for (let i = 0; i < computedPrayers.length; i++) {
      const p = computedPrayers[i];
      const [hStr, mStr] = p.time.split(':');
      const pSecs = parseInt(hStr) * 3600 + parseInt(mStr) * 60;
      let d = pSecs - currentSecs;
      if (d < 0) {
        d += 24 * 3600;
      }
      if (d < minDiffSecs) {
        minDiffSecs = d;
        nextPrayer = p;
        const prevIdx = (i - 1 + computedPrayers.length) % computedPrayers.length;
        prevPrayer = computedPrayers[prevIdx];
      }
    }

    const remHours = Math.floor(minDiffSecs / 3600);
    const remMins = Math.floor((minDiffSecs % 3600) / 60);
    const remSecs = minDiffSecs % 60;

    // Synchronized progress calculation
    const [prevH, prevM] = prevPrayer.time.split(':');
    const [nextH, nextM] = nextPrayer.time.split(':');
    let prevTotal = parseInt(prevH) * 3600 + parseInt(prevM) * 60;
    let nextTotal = parseInt(nextH) * 3600 + parseInt(nextM) * 60;
    if (nextTotal <= prevTotal) nextTotal += 24 * 3600;
    const totalIntervalSecs = Math.max(1, nextTotal - prevTotal);
    const elapsedSecs = Math.max(0, totalIntervalSecs - minDiffSecs);
    const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedSecs / totalIntervalSecs) * 100)));
    
    return {
      nextPrayer,
      remHours,
      remMins,
      remSecs,
      progressPercent,
      computedPrayers
    };
  }, [computedPrayers, currentTime]);

  const { nextPrayer, remHours, remMins, remSecs, progressPercent } = useMemo(() => {
    return getNextPrayerInfo();
  }, [getNextPrayerInfo]);

  // Live trigger function for Adhan & Visual alert screen (preview & live playback)
  const handleTriggerAdhanPreview = useCallback((targetPrayerName?: string) => {
    const target = (targetPrayerName ? computedPrayers.find(p => p.name.toLowerCase() === targetPrayerName.toLowerCase()) : null) || nextPrayer || computedPrayers[0];
    const prayerKey = (target.name.charAt(0).toUpperCase() + target.name.slice(1).toLowerCase()) as keyof typeof PRAYERS_INFO;
    const info = PRAYERS_INFO[prayerKey] || PRAYERS_INFO['Fajr'];

    setActiveAdhanAlert({
      prayerName: target.name,
      arabicName: target.arabicName,
      time: target.time,
      city: settings.city || 'المنامة',
      supplication: info?.supplication || PRAYERS_INFO.Fajr.supplication,
      tip: info?.tip || PRAYERS_INFO.Fajr.tip
    });
  }, [computedPrayers, nextPrayer, settings.city]);

  const handleNavigateToSection = useCallback((sectionId: string | null) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(`quick-tab-${sectionId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }, 50);
    }
  }, []);

  // Sections definitions for vertical layout memoized to prevent re-rendering when second tick changes
  const sections = useMemo(() => [
    {
      id: 'quran',
      title: isEn ? 'Holy Quran & Tafsir' : 'القرآن الكريم وتفسيره',
      desc: isEn ? 'Complete Holy Quran with audio recitation and easy Tafsir' : 'المصحف الشريف كاملاً بآياته والتفاسير الميسرة',
      icon: <BookOpen className="w-5 h-5" />,
      avatarUrl: ISLAMIC_AVATARS.quran,
      colorClass: 'from-emerald-600 to-teal-500',
      bgLight: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20',
      component: <QuranSection isEn={isEn} />
    },
    {
      id: 'tasbih',
      title: isEn ? 'Smart Digital Tasbih' : 'التسبيح الإلكتروني الذكي',
      desc: isEn ? 'Counter for Dhikr & Istighfar with custom goals & stats' : 'عداد للاستغفار والأذكار مع أهداف مخصصة وسجل كلي',
      icon: <Heart className="w-5 h-5 fill-current" />,
      avatarUrl: ISLAMIC_AVATARS.tasbih,
      colorClass: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-500/10 text-amber-800 border-amber-500/20',
      component: <TasbihSection soundEnabled={settings.soundEnabled} isEn={isEn} />
    },
    {
      id: 'azkar',
      title: isEn ? 'Hisn al-Muslim Adhkar' : 'أذكار حصن المسلم الشاملة',
      desc: isEn ? 'Morning & Evening adhkar, sleep, prayer & protective supplications' : 'أذكار الصباح والمساء، النوم، الصلاة، التسابيح والرقى',
      icon: <Shield className="w-5 h-5" />,
      avatarUrl: ISLAMIC_AVATARS.azkar,
      colorClass: 'from-emerald-700 to-emerald-600',
      bgLight: 'bg-emerald-700/10 text-emerald-900 border-emerald-700/20',
      component: <AzkarSection soundEnabled={settings.soundEnabled} isEn={isEn} />
    },
    {
      id: 'prayer-times',
      title: isEn ? 'Prayer Times & Tracker' : 'مواقيت الصلاة والتتبع',
      desc: isEn ? 'Accurate prayer schedules with daily prayer commitment checklist' : 'حساب دقيق لأوقات الصلاة مع تتبع التزام الصلوات يومياً',
      icon: <Clock className="w-5 h-5" />,
      avatarUrl: ISLAMIC_AVATARS.prayer,
      colorClass: 'from-sky-600 to-indigo-600',
      bgLight: 'bg-sky-500/10 text-sky-800 border-sky-500/20',
      component: (
        <PrayerTimesSection 
          settings={settings} 
          onUpdateSettings={handleUpdateSettings} 
          onTriggerAdhanPreview={handleTriggerAdhanPreview}
          isEn={isEn} 
        />
      )
    },
    {
      id: 'khatma',
      title: isEn ? 'Khatma Planner' : 'مُخطط الختمة والورد اليومي',
      desc: isEn ? 'Plan your Quran completion reading goal with interactive progress' : 'صمم خطتك لتكمل قراءة القرآن الكريم مع تقدم تفاعلي',
      icon: <BookOpenCheck className="w-5 h-5" />,
      avatarUrl: ISLAMIC_AVATARS.khatma,
      colorClass: 'from-purple-600 to-violet-600',
      bgLight: 'bg-purple-500/10 text-purple-800 border-purple-500/20',
      component: <KhatmaSection isEn={isEn} />
    },
    {
      id: 'hadith',
      title: isEn ? 'Prophetic Hadiths' : 'الأحاديث النبوية الشريفة',
      desc: isEn ? 'Riyadh as-Salihin and authentic Hadith selections' : 'رياض الصالحين والأحاديث المختارة من البخاري ومسلم',
      icon: <BookOpen className="w-5 h-5" />,
      avatarUrl: ISLAMIC_AVATARS.hadith,
      colorClass: 'from-teal-600 to-emerald-500',
      bgLight: 'bg-teal-500/10 text-teal-800 border-teal-500/20',
      component: <HadithSection isEn={isEn} />
    },
    {
      id: 'ruqyah',
      title: isEn ? 'Authentic Ruqyah' : 'الرقية الشرعية المطهرة',
      desc: isEn ? 'Verses & supplications for spiritual healing with audio player' : 'آيات وأدعية التحصين من الكتاب والسنة مع مشغل صوتي مريح',
      icon: <Shield className="w-5 h-5" />,
      avatarUrl: ISLAMIC_AVATARS.ruqyah,
      colorClass: 'from-teal-750 to-emerald-800',
      bgLight: 'bg-teal-750/10 text-teal-950 border-teal-750/20',
      component: <RuqyahSection isEn={isEn} />
    },
    {
      id: 'qibla',
      title: isEn ? 'Qibla Finder' : 'محدد اتجاه القبلة التفاعلي',
      desc: isEn ? 'Interactive Kaaba compass direction with precise alignment' : 'بوصلة الكعبة المشرفة بمحاذاة دقيقة ومحاكاة يدوية',
      icon: <Compass className="w-5 h-5" />,
      avatarUrl: ISLAMIC_AVATARS.qibla,
      colorClass: 'from-yellow-600 to-amber-500',
      bgLight: 'bg-yellow-500/10 text-yellow-800 border-yellow-500/20',
      component: <QiblaSection latitude={settings.latitude} longitude={settings.longitude} isEn={isEn} />
    },
    {
      id: 'profile',
      title: isEn ? 'Personal Profile & Analytics' : 'الملف الشخصي والبيانات الشاملة',
      desc: isEn ? 'Personal worship analytics, fasting tracker, badges and all-time tasbih count' : 'إحصائيات العبادة، تتبع الصيام التطوعي، سجل التسبيح والأوسمة الإيمانية',
      icon: <User className="w-5 h-5" />,
      avatarUrl: ISLAMIC_AVATARS.profile,
      colorClass: 'from-emerald-800 to-teal-700',
      bgLight: 'bg-emerald-800/10 text-emerald-950 border-emerald-800/20',
      component: <ProfileSection settings={settings} isEn={isEn} onNavigateSection={handleNavigateToSection} />
    },
    {
      id: 'ehsan-charity',
      title: isEn ? 'Ehsan Charity Platform' : 'منصة إحسان الخيرية',
      desc: isEn ? 'Official portal for charity donations, 2-minute spiritual audios & daily reflections' : 'بوابة البر والعمل الخيري المعتمدة، دقيقتان لآخرتك، ورسائل إيمانية متجددة',
      icon: <HeartHandshake className="w-5 h-5" />,
      avatarUrl: ISLAMIC_AVATARS.charity,
      colorClass: 'from-emerald-700 to-teal-800',
      bgLight: 'bg-emerald-600/10 text-emerald-900 border-emerald-600/20',
      component: <EhsanIslamicPlatformSection settings={settings} isEn={isEn} />
    },
    {
      id: 'ai-assistant',
      title: isEn ? 'AI Islamic Assistant' : 'مستشار نور الإسلام الذكي',
      desc: isEn ? 'Ask Islamic questions, worship guidance & supplications with AI' : 'اسأل عن العبادات، الفتاوى التعليمية والأدعية بالذكاء الاصطناعي',
      icon: <Bot className="w-5 h-5" />,
      avatarUrl: ISLAMIC_AVATARS.ai,
      colorClass: 'from-emerald-800 to-teal-900',
      bgLight: 'bg-emerald-900/10 text-emerald-950 border-emerald-900/20',
      component: <AIChatSection isEn={isEn} />
    }
  ], [isEn, settings, handleUpdateSettings, handleNavigateToSection]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeSection]);

  const currentActiveComponent = sections.find(s => s.id === activeSection)?.component || null;

  return (
    <div 
      id="app-root-container"
      className="min-h-screen bg-[#FCFAF6] dark:bg-[#070D0E] text-slate-800 dark:text-[#E2EAEB] transition-colors duration-500 flex flex-col font-sans islamic-pattern"
      dir={isEn ? "ltr" : "rtl"}
    >
      {/* Main Premium App Bar with iOS Native Safe-Area & Dynamic Island handling (Only shown inside the app, never on the welcome splash screen) */}
      {!showWelcomeSplash && (
        <header className="top-bar px-3 sm:px-8 py-2 flex items-center justify-between border-b border-[#EBE7DF] dark:border-[#142225]">
        
        {/* Left Side (LTR): Action Controls - [Globe] [Theme] [Profile] [Share] [Settings] */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* 1. Language Toggle Button */}
          <button
            id="language-toggle-btn"
            onClick={toggleLanguage}
            className="w-10 h-10 p-[2px] rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 shadow-md transition-all active:scale-90 hover:scale-105 cursor-pointer flex items-center justify-center shrink-0"
            title={isEn ? "Switch to Arabic" : "تغيير اللغة"}
            aria-label="Toggle Language"
          >
            <div className="w-full h-full rounded-full bg-[#061214] flex items-center justify-center">
              <Globe className="w-4 h-4 text-[#34D399]" />
            </div>
          </button>

          {/* 2. Dark/Light Theme Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="w-10 h-10 p-[2px] rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 shadow-md transition-all active:scale-90 hover:scale-105 cursor-pointer flex items-center justify-center shrink-0"
            title={isEn ? "Toggle theme" : "الإضاءة والمظهر"}
            aria-label="Toggle Theme"
          >
            <div className="w-full h-full rounded-full bg-[#061214] flex items-center justify-center">
              {settings.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#FACC15]" />
              ) : (
                <Moon className="w-4 h-4 text-[#FACC15]" />
              )}
            </div>
          </button>

          {/* 3. Profile / Stats Avatar Button */}
          <button
            id="header-profile-btn"
            onClick={() => handleNavigateToSection('profile')}
            className={`w-10 h-10 p-[2px] rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 shadow-md transition-all active:scale-90 hover:scale-105 cursor-pointer relative flex items-center justify-center shrink-0 ${
              activeSection === 'profile' ? 'ring-2 ring-amber-400 scale-105' : ''
            }`}
            title={isEn ? "Profile & Worship Statistics" : "الملف الشخصي وإحصائيات العبادة"}
            aria-label="Profile"
          >
            <div className="w-full h-full rounded-full bg-[#061214] overflow-hidden relative flex items-center justify-center">
              <img 
                src={ISLAMIC_AVATARS.profile} 
                alt="Profile" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-[#061214] rounded-full animate-pulse" />
          </button>

          {/* 4. Share App Button */}
          <button
            id="share-app-btn"
            onClick={handleShareApp}
            className="w-10 h-10 p-[2px] rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 shadow-md transition-all active:scale-90 hover:scale-105 cursor-pointer flex items-center justify-center shrink-0"
            title={isEn ? "Share App" : "مشاركة التطبيق"}
            aria-label="Share App"
          >
            <div className="w-full h-full rounded-full bg-[#061214] flex items-center justify-center">
              <Share2 className="w-4 h-4 text-[#FBBF24]" />
            </div>
          </button>

          {/* 5. Settings Button */}
          <button
            id="settings-modal-btn"
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 p-[2px] rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 shadow-md transition-all active:scale-90 hover:scale-105 cursor-pointer flex items-center justify-center shrink-0"
            title={isEn ? "Settings & Controls" : "الإعدادات والتخصيص"}
            aria-label="Settings"
          >
            <div className="w-full h-full rounded-full bg-[#061214] flex items-center justify-center">
              <Settings className="w-4 h-4 text-[#2DD4BF]" />
            </div>
          </button>

        </div>

        {/* Dynamic Hijri & Gregorian clock display (Hidden on small screens) */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center bg-[#F4EFE6]/70 dark:bg-[#0C1517] px-4.5 py-1.5 rounded-2xl border border-[#E9E1D2]/60 dark:border-[#1A2D31]/60">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-900 dark:text-emerald-300">
            <CalendarIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-kufi">🌙 {isEn ? "Hijri:" : "الهجري:"} {getHijriDate()}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-bold mt-0.5">
            <span>📅 {isEn ? "Gregorian:" : "الميلادي:"} {getGregorianDate()}</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="font-mono text-emerald-700 dark:text-amber-400 font-extrabold">{currentTime.toLocaleTimeString(isEn ? 'en-US' : 'ar-EG')}</span>
          </div>
        </div>

        {/* Right Side (LTR): Title and Mosque Logo with RTL text rendering */}
        <div 
          onClick={() => handleNavigateToSection(null)}
          className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer hover:opacity-95 active:scale-[0.98] transition-all group shrink-0"
          dir="rtl"
          title={isEn ? "Return to main menu" : "العودة للقائمة الرئيسية"}
        >
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-700/15 overflow-hidden border-2 border-emerald-500/40 group-hover:rotate-6 transition-all duration-300 shrink-0 bg-emerald-950">
            <img 
              src={settings.appLogoUrl || ISLAMIC_AVATARS.appLogo} 
              alt="Logo" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-emerald-950 dark:text-emerald-300 font-kufi tracking-tight leading-tight select-none">
              {settings.appName || (isEn ? "Noor Al-Islam" : "نور الإسلام")}
            </h1>
          </div>
        </div>
      </header>
      )}

      {/* Main Layout Grid with safe offset for fixed Header */}
      {!showWelcomeSplash && (
      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-3 pt-[calc(max(env(safe-area-inset-top,0px),0px)+4rem)] sm:pt-[calc(max(env(safe-area-inset-top,0px),0px)+4.25rem)]">
        <AnimatePresence mode="wait">
          {activeSection === null ? (
            <motion.div
              key="main-hub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-8"
            >
              
              {/* Luxury Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* 1. Main Left Area (Column Span 2) */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Breathtaking Dome-like Hero Banner matching Video exactly */}
                  <div 
                    id="header-hero-banner"
                    className="w-full rounded-3xl sm:rounded-[2.5rem] overflow-hidden relative shadow-xl border border-emerald-500/30 bg-gradient-to-b from-[#0A1D20] via-[#071517] to-[#040C0E] p-6 sm:p-8 flex flex-col items-center text-center space-y-4 text-white"
                  >
                    {/* Golden-emerald glowing ambient aura */}
                    <div className="absolute top-0 right-1/2 translate-x-1/2 w-64 h-64 bg-amber-400/10 blur-3xl pointer-events-none rounded-full" />
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:18px_18px] pointer-events-none" />
                    
                    {/* Top: Bismillah in Golden Line Frame */}
                    <div className="relative z-10 py-1.5 px-6 rounded-full border border-amber-400/40 bg-amber-400/10 backdrop-blur-md">
                      <p className="text-xs sm:text-sm font-amiri text-amber-300 font-black tracking-widest">
                        « بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ »
                      </p>
                    </div>

                    {/* Top Row: Dynamic Greeting Pill & Date Badges */}
                    <div className="relative z-10 flex flex-wrap items-center justify-center gap-2.5">
                      <span className="text-xs font-black tracking-wider text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-3.5 py-1 rounded-full border border-emerald-500/30 shadow-xs">
                        {getDynamicGreeting()}
                      </span>
                      
                      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/15 text-[11px] font-bold text-amber-300 shadow-xs">
                        <span className="text-emerald-300 font-bold whitespace-nowrap">🌙 {getHijriDate()}</span>
                        <span className="text-white/30">•</span>
                        <span className="text-sky-200 font-bold whitespace-nowrap">📅 {getGregorianDate()}</span>
                      </div>
                    </div>

                    {/* Center: Glowing Circular App Logo */}
                    <div className="relative z-10 my-1">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-amber-400/80 shadow-2xl shadow-amber-500/20 p-1 bg-gradient-to-br from-emerald-700 via-teal-900 to-slate-950 ring-4 ring-emerald-500/20">
                        <img 
                          src={settings.appLogoUrl || defaultLogo} 
                          alt="Logo" 
                          className="w-full h-full object-cover rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    {/* Bottom: Welcome Title & Spiritual Message */}
                    <div className="relative z-10 space-y-1.5 max-w-lg">
                      <h2 className="text-xl sm:text-2xl font-black font-kufi text-amber-300 drop-shadow-sm leading-tight">
                        {isEn ? "Welcome to Noor Al-Islam" : "أهلاً وسهلاً بك، في تطبيق نور الإسلام"}
                      </h2>
                      
                      <p className="text-xs sm:text-sm text-emerald-100/80 font-medium leading-relaxed font-sans">
                        {isEn 
                          ? "Welcome to your daily spiritual sanctuary. Enjoy prayer times, Quran recitation, adhkar, and smart Islamic assistant." 
                          : "مرحباً بك مجدداً في مساحتك الروحانية اليومية. استمتع بمواقيت الصلاة، تلاوة القرآن الكريم، والأذكار، والمستشار الذكي."}
                      </p>
                    </div>
                  </div>

                  {/* Verse of the Day Card */}
                  <VerseOfTheDay settings={settings} />

                  {/* App Sections Header */}
                  <div className="flex items-center justify-between pt-2 pb-2 border-b border-[#EBE7DF] dark:border-[#132326]">
                    <h3 className="text-base font-black text-emerald-950 dark:text-emerald-300 font-kufi flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>{isEn ? "App Sections & Islamic Services" : "أقسام التطبيق والخدمات الإسلامية"}</span>
                    </h3>
                    <span className="text-[11px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-xl font-extrabold border border-emerald-500/20">
                      {sections.length} {isEn ? "Sections" : "أقسام"}
                    </span>
                  </div>

                  {/* App Sections Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {sections.map((sec) => (
                      <button
                        key={sec.id}
                        id={`section-card-${sec.id}`}
                        onClick={() => handleNavigateToSection(sec.id)}
                        className={`w-full ${isEn ? 'text-left' : 'text-right'} p-4.5 bg-white dark:bg-[#0B1516] border border-[#EBE7DF] dark:border-[#132326] hover:border-emerald-500/40 dark:hover:border-amber-400/40 rounded-2xl sm:rounded-3xl transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg hover:scale-[1.015] active:scale-[0.99] flex items-center justify-between gap-4 group relative overflow-hidden`}
                      >
                        <div className={`absolute top-0 ${isEn ? 'left-0' : 'right-0'} w-1.5 h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          {/* 3D Islamic Avatar Box */}
                          <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl overflow-hidden border border-emerald-500/30 dark:border-emerald-500/20 shadow-md shadow-emerald-900/10 group-hover:scale-105 group-hover:rotate-2 group-hover:shadow-amber-500/20 transition-all duration-300 flex-shrink-0 relative bg-emerald-950">
                            {sec.avatarUrl ? (
                              <img 
                                src={sec.avatarUrl} 
                                alt={sec.title} 
                                className="w-full h-full object-cover" 
                                referrerPolicy="no-referrer" 
                              />
                            ) : (
                              <div className={`w-full h-full bg-gradient-to-tr ${sec.colorClass} text-white flex items-center justify-center`}>
                                {sec.icon}
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                          </div>

                          {/* Details */}
                          <div className="space-y-1 flex-1 min-w-0">
                            <h4 className="text-base font-black text-emerald-950 dark:text-emerald-300 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors font-kufi truncate">
                              {sec.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                              {sec.desc}
                            </p>
                          </div>
                        </div>

                        {/* Arrow Icon */}
                        <div className="w-8 h-8 rounded-full bg-[#FAF8F5] dark:bg-[#060B0C] flex items-center justify-center border border-[#E9E1D2]/50 dark:border-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-emerald-700 group-hover:text-white group-hover:border-transparent transition-all flex-shrink-0 shadow-xs">
                          <span className="font-extrabold text-xs transform group-hover:scale-110">{isEn ? '→' : '←'}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                </div>

                {/* 2. Right Sticky Sidebar Area (Column Span 1) */}
                <div className="space-y-6 sm:space-y-8 lg:sticky lg:top-28">
                  
                  {/* Digital Prayer Countdown Widget */}
                  <div className="bg-gradient-to-br from-[#122421] to-[#0A1617] text-white border-2 border-emerald-500/30 rounded-3xl sm:rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-80" />
                    <div className="absolute top-0 left-0 w-28 h-28 bg-emerald-500/15 blur-2xl pointer-events-none"></div>

                    {/* Countdown header */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span className="text-xs font-black text-emerald-200">{isEn ? "Live Prayer Countdown" : "العد التنازلي الحي للصلاة القادمة"}</span>
                      </div>
                      <span className="text-[10px] bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10 font-bold text-amber-300">{settings.city}</span>
                    </div>

                    {/* Big Digital Countdown numbers with live seconds */}
                    <div className="text-center py-2 space-y-2">
                      <span className="text-[11px] text-slate-300 font-bold block">{isEn ? "Next Prayer Insha'Allah:" : "الصلاة القادمة بإذن اللّٰه:"}</span>
                      <h4 className="text-2xl sm:text-3xl font-black text-amber-300 font-kufi">
                        {isEn ? `${nextPrayer.arabic} Prayer` : `صلاة ${nextPrayer.arabic}`}
                      </h4>
                      
                      {/* Live Ticking Time HH:MM:SS */}
                      <div className="text-3xl sm:text-4xl font-mono font-black text-white glow-gold py-1.5 tracking-wider bg-black/30 rounded-2xl border border-white/5 mx-2">
                        <span>{String(remHours).padStart(2, '0')}</span>
                        <span className="text-amber-400 mx-0.5 animate-pulse">:</span>
                        <span>{String(remMins).padStart(2, '0')}</span>
                        <span className="text-amber-400 mx-0.5 animate-pulse">:</span>
                        <span className="text-amber-300 font-mono">{String(remSecs).padStart(2, '0')}</span>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="pt-2 px-2 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-emerald-200/90 font-bold">
                          <span>{isEn ? "Progress to Adhan" : "التقدم نحو الأذان"}</span>
                          <span className="font-mono text-amber-300">{progressPercent}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-orange-400 rounded-full transition-all duration-1000 ease-linear shadow-xs"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <span className="text-[11px] text-emerald-200/80 block pt-1">
                        {isEn 
                          ? `${remHours}h ${remMins}m ${remSecs}s remaining (Adhan ${formatTime12(nextPrayer.time, isEn)})`
                          : `متبقي ${remHours} ساعة و ${remMins} دقيقة و ${remSecs} ثانية (الأذان ${formatTime12(nextPrayer.time, isEn)})`}
                      </span>
                    </div>

                    {/* Quick Settings Toggles for Adhan alert inside */}
                    <div className="mt-5 pt-3.5 border-t border-white/10 flex flex-col gap-2.5 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>{isEn ? "Visual & Audio Adhan alert" : "تنبيه مرئي ومسموع وقت دخول الأذان"}</span>
                        <button
                          id="prayer-quick-sound-toggle-home"
                          onClick={() => handleUpdateSettings({ ...settings, visualAdhanAlert: !settings.visualAdhanAlert })}
                          className={`p-2 rounded-xl transition-all cursor-pointer active:scale-95 ${
                            settings.visualAdhanAlert ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/10 text-emerald-200'
                          }`}
                          title={settings.visualAdhanAlert ? (isEn ? "Disable alert" : "تعطيل التنبيه المرئي") : (isEn ? "Enable alert" : "تفعيل التنبيه المرئي")}
                        >
                          <Bell className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Live Fullscreen Adhan Screen Preview Button on Home Card */}
                      <button
                        id="prayer-home-live-adhan-preview-btn"
                        type="button"
                        onClick={() => handleTriggerAdhanPreview(nextPrayer?.name || 'Asr')}
                        className="w-full py-2 px-3 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:bg-emerald-500/30 text-emerald-200 hover:text-white font-bold text-[11px] rounded-xl border border-emerald-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                        <span>{isEn ? "Live Adhan & Visual Alert Preview" : "معاينة شاشة وسماع الأذان الآن 🕌 (تجربة حية)"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Makkah Live Quran Radio Player */}
                  <MakkahLiveRadioPlayer isEn={isEn} />

                  {/* Daily Worship Tracker Checklist ("مسار الطاعات اليومي") */}
                  <div className="bg-white dark:bg-[#0B1516] border border-[#EBE7DF] dark:border-[#132326] rounded-3xl sm:rounded-[2.5rem] p-6 shadow-xs hover:shadow-sm transition-all">
                    
                    <div className="flex items-center justify-between pb-3.5 border-b border-[#EBE7DF] dark:border-[#132326] mb-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-black text-emerald-950 dark:text-emerald-300 font-kufi">{isEn ? "Daily Acts of Worship Tracker" : "مسار الطاعات والالتزام اليومي"}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-lg">{isEn ? "Daily Reset" : "تتجدد يوميًا"}</span>
                    </div>

                    {/* Prayer and Dhikr list with luxury checkboxes */}
                    <div className="space-y-2.5">
                      
                      {[
                        { key: 'Fajr', label: isEn ? 'Fajr Prayer on time' : 'صلاة الفجر في وقتها' },
                        { key: 'Dhuhr', label: isEn ? 'Dhuhr Prayer in congregation' : 'صلاة الظهر في جماعة' },
                        { key: 'Asr', label: isEn ? 'Asr Prayer and Sunnah' : 'صلاة العصر والسنّة البعدية' },
                        { key: 'Maghrib', label: isEn ? 'Maghrib Prayer and Wird' : 'صلاة المغرب وأورادها' },
                        { key: 'Isha', label: isEn ? 'Isha Prayer and Witr' : 'صلاة العشاء والوتر قيامًا' },
                        { key: 'Duha', label: isEn ? 'Duha Prayer' : 'صلاة الضحى (الأوابين)' },
                        { key: 'AzkarSabah', label: isEn ? 'Morning Adhkar' : 'قراءة أذكار الصباح كاملة' },
                        { key: 'AzkarMasaa', label: isEn ? 'Evening Adhkar' : 'قراءة أذكار المساء كاملة' },
                        { key: 'Fasting', label: isEn ? 'Voluntary Fasting (Mon/Thu/White Days)' : 'صيام التطوع (الإثنين/الخميس/الأيام البيض)' },
                      ].map((p) => {
                        const checked = dailyPrayers[p.key as keyof typeof dailyPrayers] || false;
                        return (
                          <div 
                            key={p.key}
                            onClick={() => toggleDailyPrayer(p.key)}
                            className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none active:scale-[0.99] ${
                              checked 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-900 dark:text-emerald-300 font-bold' 
                                : 'bg-[#FAF8F5]/60 dark:bg-[#060B0C] border-[#E9E1D2]/50 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-[#122427] text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            <span className="text-xs font-semibold">{p.label}</span>
                            <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                              checked 
                                ? 'bg-emerald-600 border-transparent text-white' 
                                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#060B0C]'
                            }`}>
                              {checked && <CheckCircle2 className="w-3.5 h-3.5 fill-current text-white" />}
                            </div>
                          </div>
                        );
                      })}

                    </div>
                  </div>

                </div>

              </div>

            </motion.div>
          ) : (
            <motion.div
              key="active-section-wrapper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Floating Back & Quick-Navigation Strip - Pixel Perfect Dark Luxury Theme */}
              <div className="bg-[#0B1516] border border-[#142326] p-3 sm:p-4 rounded-3xl shadow-xl sticky top-[58px] sm:top-[66px] z-30 mb-4 space-y-3">
                
                {/* Top Row: Current Section Title and Return Home button */}
                <div className="flex items-center justify-between gap-3">
                  
                  {/* Left Side (in RTL): Back to Home button with Arrow */}
                  <button
                    id="section-back-to-home"
                    onClick={() => handleNavigateToSection(null)}
                    className="flex items-center gap-2 px-4 py-2 sm:py-2.5 bg-[#060B0C] hover:bg-[#122427] text-slate-100 border border-[#1A2D31] font-bold text-xs sm:text-sm rounded-2xl transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
                    title={isEn ? "Return to main menu" : "العودة للقائمة الرئيسية"}
                  >
                    <span>{isEn ? "Home" : "الرئيسية"}</span>
                    <ArrowRight className={`w-4 h-4 text-slate-300 ${isEn ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Right Side (in RTL): Section Title and Green Icon */}
                  <div className="flex items-center gap-3 min-w-0">
                    <h2 className="text-base sm:text-xl font-black text-emerald-400 font-kufi truncate tracking-tight">
                      {sections.find(s => s.id === activeSection)?.title}
                    </h2>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center p-2.5 shadow-md shadow-emerald-950/40 shrink-0 border border-emerald-400/20 overflow-hidden">
                      {sections.find(s => s.id === activeSection)?.icon || <BookOpen className="w-5 h-5 text-white" />}
                    </div>
                  </div>

                </div>

                {/* Bottom Row: Horizontal Quick-Switch Scrollable Strip of All Sections */}
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none text-xs sm:text-sm">
                  
                  {/* Home tab pill */}
                  <button
                    id="quick-tab-home"
                    onClick={() => handleNavigateToSection(null)}
                    className="px-4 py-2 rounded-full font-kufi font-bold bg-[#060B0C] hover:bg-[#122427] text-slate-300 hover:text-white border border-[#1A2D31] transition-all shrink-0 cursor-pointer flex items-center gap-2 active:scale-95 text-xs sm:text-sm"
                  >
                    <span>{isEn ? "Home" : "الرئيسية"}</span>
                    <span className="text-sm">🏠</span>
                  </button>

                  {/* All 11 Sections tab pills */}
                  {sections.map((s) => {
                    const isActive = s.id === activeSection;
                    return (
                      <button
                        key={s.id}
                        id={`quick-tab-${s.id}`}
                        onClick={() => handleNavigateToSection(s.id)}
                        className={`px-4 sm:px-5 py-2 rounded-full font-kufi transition-all shrink-0 cursor-pointer flex items-center gap-2 active:scale-95 text-xs sm:text-sm ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black shadow-lg shadow-emerald-950/60 border-0'
                            : 'bg-[#060B0C] hover:bg-[#122427] text-slate-300 hover:text-emerald-300 border border-[#1A2D31] font-bold'
                        }`}
                      >
                        <span className="whitespace-nowrap">{s.title}</span>
                        <span className={isActive ? 'text-white' : 'text-emerald-400'}>
                          {s.icon}
                        </span>
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Active Component Render with fast, smooth transition */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${activeSection}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                  className="w-full"
                >
                  {currentActiveComponent}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      )}

      {/* Persistent Islamic footer dedication */}
      {!showWelcomeSplash && (
        <footer className="w-full bg-white dark:bg-[#050A0B] border-t border-[#EBE7DF] dark:border-[#132326] py-6 px-4 sm:px-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-3.5 font-sans mt-6">
          <div className="max-w-2xl mx-auto space-y-2 leading-relaxed font-semibold">
            <p className="text-sm sm:text-[15px] text-emerald-900 dark:text-emerald-300 font-extrabold font-amiri">
              {settings.dedicationText || "هذا التطبيق صدقة جارية بإذن اللّٰه تعالى عن لؤي بن حسين وعن والده رحمه اللّٰه وغفر له وجميع المسلمين والمسلمات الأحياء منهم والأموات."}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500">
              تم التطوير بحبّ وإتقان ليكون تطبيقاً سهلاً، جميلاً وسلساً للمستخدمين. تقبل الله طاعاتكم جميعاً.
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-900 max-w-xl mx-auto">
            <span>المطور: {settings.developerName || "لؤي بن حسين"}</span>
            <span>•</span>
            <span>© 2026 - جميع الحقوق محفوظة</span>
            <span>•</span>
            <button
              id="footer-privacy-policy-btn"
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              {isEn ? "Privacy Policy" : "سياسة الخصوصية"}
            </button>
            <span>•</span>
            <a href={settings.snapchatUrl || "https://snapchat.com/t/vezdvWWb"} target="_blank" rel="noreferrer" className="text-amber-600 dark:text-amber-400 font-extrabold hover:underline">
              تابعني على سناب شات 👻
            </a>
          </div>
        </footer>
      )}

      {/* Welcome Splash Screen on app open */}
      <AnimatePresence>
        {showWelcomeSplash && (
          <WelcomeSplashScreen
            settings={settings}
            isEn={isEn}
            onEnter={(secId) => {
              setShowWelcomeSplash(false);
              if (secId) {
                handleNavigateToSection(secId);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Settings Modal (including Developer & Dedication at top) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onTriggerAdhanPreview={handleTriggerAdhanPreview}
      />

      {/* Official App Store Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        isEn={isEn}
      />

      {/* Universal Search & Favorites Modal */}
      <UnifiedSearchFavoritesModal
        isOpen={isSearchFavModalOpen}
        onClose={() => setIsSearchFavModalOpen(false)}
        onNavigateSection={handleNavigateToSection}
        isEn={isEn}
      />

      {/* Visual Adhan Alert Modal popup */}
      <VisualAdhanModal
        isOpen={activeAdhanAlert !== null}
        onClose={() => setActiveAdhanAlert(null)}
        prayerName={activeAdhanAlert?.prayerName || 'Asr'}
        arabicName={activeAdhanAlert?.arabicName || 'العصر'}
        time={activeAdhanAlert?.time || '15:12'}
        city={activeAdhanAlert?.city || settings.city || 'المنامة'}
        country={settings.country || 'مملكة البحرين'}
        supplication={activeAdhanAlert?.supplication}
        tip={activeAdhanAlert?.tip}
        soundEnabled={settings.soundEnabled}
        selectedVoiceId={settings.selectedAdhanVoice || 'makkah'}
        onVoiceChange={(v) => handleUpdateSettings({ ...settings, selectedAdhanVoice: v })}
        allPrayers={computedPrayers.map(p => ({ name: p.name, arabicName: p.arabicName, time: p.time }))}
        isEn={isEn}
      />
      {/* Landscape Orientation Lock Screen overlay for mobile devices */}
      <AnimatePresence>
        {isLandscape && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-[#061214]/98 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center text-white select-none"
            dir={isEn ? "ltr" : "rtl"}
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-3xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center shadow-2xl">
                <Smartphone className="w-10 h-10 text-emerald-400 animate-pulse" />
              </div>
              <motion.div 
                animate={{ rotate: [0, -90, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg font-black"
              >
                <RotateCw className="w-4 h-4" />
              </motion.div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-amber-300 font-kufi mb-2">
              {isEn ? "Please Rotate Your Device to Portrait" : "يرجى تدوير الهاتف للوضع الرأسي 📱"}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-md font-amiri leading-relaxed">
              {isEn 
                ? "Noor Al-Islam is optimized to provide the most serene and beautiful experience in portrait orientation on iPhone and mobile devices." 
                : "تم تصميم تطبيق «نور الإسلام» ليعمل بأعلى دقة وجمال في الوضع الرأسي (العمودي) لجميع أجهزة الآيفون والهواتف الذكية."}
            </p>

            <button
              id="dismiss-landscape-btn"
              type="button"
              onClick={() => setIsLandscape(false)}
              className="mt-6 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-xs font-bold text-slate-200 transition-all cursor-pointer active:scale-95"
            >
              {isEn ? "Continue in Landscape" : "المتابعة بالوضع العرضي"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Notification Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 right-6 left-6 sm:left-auto sm:w-96 z-50 bg-emerald-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-3 backdrop-blur-lg"
          >
            <div className="p-2 bg-emerald-700/80 rounded-xl text-amber-300 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 text-xs">
              <p className="font-black text-amber-300 font-kufi">
                {isEn ? "Link Copied to Clipboard!" : "تم نسخ رابط التطبيق بنجاح!"}
              </p>
              <p className="text-emerald-100 font-medium mt-0.5">
                {isEn ? "May Allah reward you for spreading the benefit." : "جزاك اللّٰه خيراً ونفع الله بك في نشر الخير والبركة."}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
