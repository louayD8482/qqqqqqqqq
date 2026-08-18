import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  RotateCcw, Volume2, VolumeX, Smartphone, Moon, Sun, 
  Plus, Check, ChevronDown, Sparkles, Settings, 
  BarChart3, Droplets, Disc, HelpCircle, Bell
} from 'lucide-react';
import { StatsView } from './components/StatsView';
import { ShareCardModal } from './components/ShareCardModal';
import { SettingsModal } from './components/SettingsModal';
import { CelebrationConfetti } from './components/CelebrationConfetti';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeModal } from './components/WelcomeModal';
import { AvatarModal } from './components/AvatarModal';
import { SoundModal } from './components/SoundModal';
import { AppAvatar } from './components/AppAvatar';
import { ISLAMIC_QUOTES } from './data/islamicQuotes';
import { playBeadSound, playCompletionChime, triggerHapticFeedback, CustomSoundMode } from './utils/audio';
import { getSavedAvatar } from './utils/avatarStorage';
import { requestNotificationPermission, sendLocalNotification } from './utils/nativeNotifications';

interface DhikrPreset {
  id: string;
  text: string;
  transliteration?: string;
  target: number;
  virtue?: string;
}

const DEFAULT_PRESETS: DhikrPreset[] = [
  { id: '1', text: 'سُبْحَانَ اللَّهِ', target: 33, virtue: 'غراس الجنة وتمحو الخطايا' },
  { id: '2', text: 'الْحَمْدُ لِلَّهِ', target: 33, virtue: 'تملأ الميزان' },
  { id: '3', text: 'اللَّهُ أَكْبَرُ', target: 34, virtue: 'أحب الكلام إلى الله' },
  { id: '4', text: 'لَا إِلَهَ إِلَّا اللَّهُ', target: 100, virtue: 'أفضل الذكر وخير ما قال النبيون' },
  { id: '5', text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', target: 100, virtue: 'مغفرة للذنوب وتفريج للهموم' },
  { id: '6', text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ', target: 10, virtue: 'من صلى عليّ صلاة صلى الله عليه بها عشراً' },
  { id: '7', text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', target: 33, virtue: 'كنز من كنوز الجنة' },
  { id: '8', text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ', target: 100, virtue: 'كلمتان خفيفتان على اللسان ثقيلتان في الميزان' },
];

export default function App() {
  // Avatar state (الافتار وشعار التطبيق بدقة 4K مع إمكانية رفع صورة مخصصة)
  const [avatarUrl, setAvatarUrl] = useState<string>(() => getSavedAvatar());

  // Splash screen state (يظهر شاشة البداية الأنيقة بهوية التطبيق)
  const [showSplash, setShowSplash] = useState(true);

  // Welcome modal state (رسالة ترحيبية راقية)
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(() => {
    const dismissed = localStorage.getItem('subha_welcome_dismissed');
    return !dismissed;
  });

  // Navigation Tabs: 'tasbeeh' | 'stats'
  const [activeTab, setActiveTab] = useState<'tasbeeh' | 'stats'>('tasbeeh');

  // Theme & Sound & Vibration Settings
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('subha_theme');
    return saved ? saved === 'dark' : true;
  });

  const [soundMode, setSoundMode] = useState<CustomSoundMode>(() => {
    const saved = localStorage.getItem('subha_sound_mode');
    return (saved as CustomSoundMode) || 'wood';
  });

  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('subha_vibration');
    return saved ? saved === 'true' : true;
  });

  // Dhikr State
  const [presets, setPresets] = useState<DhikrPreset[]>(() => {
    const saved = localStorage.getItem('subha_custom_presets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_PRESETS;
      }
    }
    return DEFAULT_PRESETS;
  });

  const [selectedDhikr, setSelectedDhikr] = useState<DhikrPreset>(presets[0]);
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(presets[0].target);
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);
  
  // Daily Stats & History
  const [totalToday, setTotalToday] = useState<number>(() => {
    const saved = localStorage.getItem('subha_today_total');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [dailyHistory, setDailyHistory] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('subha_daily_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return {};
      }
    }
    return {};
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('subha_streak_days');
    return saved ? parseInt(saved, 10) : 1;
  });

  // UI Modals / Notifications
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [newDhikrText, setNewDhikrText] = useState('');
  const [newDhikrTarget, setNewDhikrTarget] = useState(33);
  const [notification, setNotification] = useState<string | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  // Rotating Daily Ayah / Hadith Quote
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * ISLAMIC_QUOTES.length));

  const currentQuote = ISLAMIC_QUOTES[quoteIndex] || ISLAMIC_QUOTES[0];

  const handleRefreshQuote = useCallback(() => {
    setQuoteIndex((prev) => (prev + 1) % ISLAMIC_QUOTES.length);
  }, []);

  const showNotificationMessage = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 2500);
  }, []);

  // Persist Settings
  useEffect(() => {
    localStorage.setItem('subha_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('subha_sound_mode', soundMode);
  }, [soundMode]);

  useEffect(() => {
    localStorage.setItem('subha_vibration', String(vibrationEnabled));
  }, [vibrationEnabled]);

  useEffect(() => {
    localStorage.setItem('subha_today_total', String(totalToday));
    const todayKey = new Date().toISOString().split('T')[0];
    setDailyHistory((prev) => {
      const updated = { ...prev, [todayKey]: totalToday };
      localStorage.setItem('subha_daily_history', JSON.stringify(updated));
      return updated;
    });
  }, [totalToday]);

  useEffect(() => {
    localStorage.setItem('subha_streak_days', String(streakDays));
  }, [streakDays]);

  // Online / Offline Status Listener
  useEffect(() => {
    const handleOnline = () => {
      showNotificationMessage('أنت متصل بالإنترنت الآن 🟢');
    };
    const handleOffline = () => {
      showNotificationMessage('يعمل التطبيق الآن بدون إنترنت بنجاح 100% 📿📶');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showNotificationMessage]);

  // قفل مؤقت لمنع التكرار السريع جداً في أجزاء من الثانية (Debounce Lock)
  const isProcessingRef = useRef(false);

  // دالة الضغط على زر التسبيح (تضمن زيادة العداد بمقدار 1 حصراً ودون أي تضاعف)
  const handleTasbihClick = useCallback(() => {
    // إذا كانت العملية قيد التنفيذ، تجاهل الضغطة المتداخلة لمنع الدبل
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    // فتح قفل الضغط بعد 80 جزء من الثانية بلطف
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 80);

    // تشغيل الصوت والاهتزاز
    playBeadSound(soundMode);
    triggerHapticFeedback(vibrationEnabled ? 25 : 0);

    // زيادة العداد بمقدار 1 حصراً ودون أي تضاعف
    setCount((prevCount) => {
      const nextCount = prevCount + 1;

      // التحقق من اكتمال الهدف المحدد
      if (target > 0 && nextCount >= target) {
        triggerHapticFeedback(vibrationEnabled ? [50, 40, 70, 40, 100] : 0);
        playCompletionChime();
        setShowConfetti(true);
        setRoundsCompleted((r) => r + 1);
        showNotificationMessage(`ما شاء الله! أتممت الورد (${target}) 🎉✨`);
        return 0; // إعادة التصفير للدورة الجديدة
      }

      return nextCount;
    });

    // زيادة إجمالي تسبيحات اليوم بمقدار 1 حصراً
    setTotalToday((prevTotal) => prevTotal + 1);

  }, [soundMode, vibrationEnabled, target, showNotificationMessage]);

  // Reset Counter
  const handleReset = () => {
    setCount(0);
    triggerHapticFeedback(vibrationEnabled ? 40 : 0);
    showNotificationMessage('تمت إعادة ضبط العداد');
  };

  // Select Preset Dhikr
  const handleSelectPreset = (preset: DhikrPreset) => {
    setSelectedDhikr(preset);
    setTarget(preset.target);
    setCount(0);
    setShowPresetsMenu(false);
    showNotificationMessage(`تم اختيار: ${preset.text}`);
  };

  // Add Custom Dhikr
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDhikrText.trim()) return;

    const newPreset: DhikrPreset = {
      id: `custom_${Date.now()}`,
      text: newDhikrText.trim(),
      target: Number(newDhikrTarget) || 33,
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem('subha_custom_presets', JSON.stringify(updated));
    setSelectedDhikr(newPreset);
    setTarget(newPreset.target);
    setCount(0);
    setNewDhikrText('');
    setShowAddCustom(false);
    setShowPresetsMenu(false);
    showNotificationMessage('تمت إضافة الذكر بنجاح ✨');
  };

  // Progress Calculation
  const progressPercent = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 100;
  const strokeDashoffset = 565.48 - (565.48 * progressPercent) / 100;

  return (
    <div 
      className={`min-h-screen w-full ${isDarkMode ? 'bg-[#05080e]' : 'bg-stone-200'} flex items-center justify-center font-sans select-none overflow-x-hidden transition-colors duration-300`}
      dir="rtl"
    >
      {/* 0. شاشة الترحيب والبداية بشعار وأفتار التطبيق الفاخر */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} avatarUrl={avatarUrl} />}

      {/* Confetti Particle Shower on Target Completion */}
      <CelebrationConfetti 
        active={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />

      {/* 1. Floating Banner Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-bold border border-amber-300/40 animate-in fade-in slide-in-from-top-3 duration-200">
          <Sparkles size={16} className="shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main iPhone/Android Mobile Frame Container */}
      <div className={`w-full max-w-[430px] min-h-screen sm:min-h-[92vh] sm:max-h-[96vh] sm:rounded-[36px] sm:border sm:border-stone-800/80 sm:shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col justify-between relative ${isDarkMode ? 'bg-[#090d16] text-stone-100' : 'bg-stone-50 text-stone-900'} transition-colors duration-300 overflow-hidden`}>

      {/* 2. Header with App Avatar & Circular Controls (Native Safe Area Compliant for iOS & Android) */}
      <header className="w-full bg-[#0e1624]/95 backdrop-blur-md px-2 sm:px-3 py-2 sm:py-2.5 safe-top-header flex items-center justify-between border-b border-gray-800/80 font-sans sticky top-0 z-30 shadow-md max-w-full overflow-hidden">
        
        {/* 1. الجهة اليمنى: أفتار التطبيق الدائري الفاخر وبجانبه الاسم */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-right shrink-0 min-w-0">
          
          {/* صورة الـ Avatar الدائرية الفاخرة بدقة 4K مع مساحة لمس موسعة 44px */}
          <button
            onClick={() => setShowAvatarModal(true)}
            className="min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] p-0.5 flex items-center justify-center relative flex-shrink-0 cursor-pointer focus:outline-none select-none group active:scale-95 transition-transform touch-manipulation"
            title="تخصيص وعرض شعار وأفتار السبحة 4K"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-amber-500 to-emerald-500 shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-all ring-2 ring-amber-400/40">
              <AppAvatar
                src={avatarUrl}
                alt="سبحة نور الإسلام"
                className="w-full h-full rounded-full bg-[#0b1320]"
                sizeClassName="w-full h-full"
                isCircle={true}
                showBadge
              />
            </div>
          </button>

          {/* اسم التطبيق الصافي والأنيق */}
          <div className="flex flex-col text-right">
            <h1 className="text-white font-bold text-xs sm:text-sm md:text-base whitespace-nowrap tracking-tight font-serif drop-shadow-sm leading-tight">
              سبحة نور الإسلام
            </h1>
            <span className="text-[9px] sm:text-[10px] text-amber-400/80 font-medium hidden xs:inline-block">
              ألا بذكر الله تطمئن القلوب
            </span>
          </div>

        </div>

        {/* 2. الجهة اليسرى: أفتارات الأيقونات الدائرية مع مساحة لمس غير مرئية (Touch Target 44px) لسهولة وسلاسة الضغط */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          
          {/* 1. أفتار دائري مكبر للتنبيهات والإشعارات مع مساحة لمس 44px */}
          <button
            onClick={async () => {
              const granted = await requestNotificationPermission();
              if (granted) {
                sendLocalNotification('سبحة نور الإسلام 📿✨', {
                  body: 'تم تفعيل التنبيهات المباركة بنجاح! قال رسول الله ﷺ: «ألا بذكر الله تطمئن القلوب».',
                });
                playCompletionChime();
                showNotificationMessage('تم تفعيل التنبيهات وإرسال إشعار تجريبي 🔔✨');
              } else {
                showNotificationMessage('يرجى السماح بالتنبيهات من إعدادات جهازك 🔔');
              }
            }}
            title="تفعيل وتجربة الإشعارات والتذكير اليومي"
            className="min-w-[42px] min-h-[42px] sm:min-w-[46px] sm:min-h-[46px] p-1 flex items-center justify-center cursor-pointer focus:outline-none select-none group active:scale-95 transition-all touch-manipulation"
          >
            <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-full bg-gradient-to-b from-[#1e304f] to-[#0e1726] hover:from-[#263e66] hover:to-[#131f33] border border-amber-500/50 hover:border-amber-400 p-0.5 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-all">
              <div className="w-full h-full rounded-full flex items-center justify-center bg-[#131f33]/70 group-hover:bg-[#131f33]/40 transition-colors relative">
                <Bell className="h-4.5 w-4.5 sm:h-5 sm:w-5 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)] group-hover:scale-110 transition-transform text-amber-300" />
                <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-emerald-400 border border-[#0e1624] shadow-sm animate-pulse" />
              </div>
            </div>
          </button>

          {/* 2. أفتار دائري مكبر للاهتزاز مع مساحة لمس 44px */}
          <button
            onClick={() => {
              setVibrationEnabled(!vibrationEnabled);
              if (!vibrationEnabled) triggerHapticFeedback(30);
              showNotificationMessage(!vibrationEnabled ? 'تم تفعيل الاهتزاز 📳' : 'تم إيقاف الاهتزاز 📴');
            }}
            title={vibrationEnabled ? "الاهتزاز مفعل (اضغط للإيقاف)" : "الاهتزاز متوقف (اضغط للتفعيل)"}
            className="min-w-[42px] min-h-[42px] sm:min-w-[46px] sm:min-h-[46px] p-1 flex items-center justify-center cursor-pointer focus:outline-none select-none group active:scale-95 transition-all touch-manipulation"
          >
            <div className={`w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-full p-0.5 flex items-center justify-center shadow-md group-hover:scale-105 transition-all ${
              vibrationEnabled
                ? 'bg-gradient-to-b from-[#25395a] to-[#121d30] border border-amber-500/50 hover:border-amber-400 text-amber-400'
                : 'bg-gradient-to-b from-[#1b2434] to-[#101724] border border-gray-700/70 hover:border-gray-600 text-gray-400'
            }`}>
              <div className="w-full h-full rounded-full flex items-center justify-center bg-[#131f33]/70 group-hover:bg-[#131f33]/40 transition-colors relative">
                <Smartphone className={`h-4 w-4 sm:h-4.5 sm:w-4.5 transition-transform ${vibrationEnabled ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] group-hover:scale-110' : 'text-gray-400'}`} />
                {!vibrationEnabled && (
                  <span className="absolute w-4.5 h-0.5 bg-red-400/90 rotate-45 rounded-full shadow-sm" />
                )}
              </div>
            </div>
          </button>

          {/* 4. أفتار دائري مكبر للوضع الليلي / النهاري مع مساحة لمس 44px */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
            className="min-w-[42px] min-h-[42px] sm:min-w-[46px] sm:min-h-[46px] p-1 flex items-center justify-center cursor-pointer focus:outline-none select-none group active:scale-95 transition-all touch-manipulation"
          >
            <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-full bg-gradient-to-b from-[#1c2c48] to-[#0e1726] hover:from-[#24395c] hover:to-[#131f33] border border-amber-500/40 hover:border-amber-400 p-0.5 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-all">
              <div className="w-full h-full rounded-full flex items-center justify-center bg-[#131f33]/70 group-hover:bg-[#131f33]/40 transition-colors">
                {isDarkMode ? (
                  <Sun className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.7)] group-hover:rotate-90 transition-transform duration-500" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </div>
            </div>
          </button>

          {/* 5. أفتار دائري مكبر للإعدادات والتصدير (أخضر زمردي ملكي) مع مساحة لمس 44px */}
          <button
            onClick={() => setShowSettingsModal(true)}
            title="إعدادات التطبيق والتصدير"
            className="min-w-[42px] min-h-[42px] sm:min-w-[46px] sm:min-h-[46px] p-1 flex items-center justify-center cursor-pointer focus:outline-none select-none group active:scale-95 transition-all touch-manipulation"
          >
            <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-full bg-gradient-to-b from-[#0e4f2c] to-[#062a17] hover:from-[#13683a] hover:to-[#093a20] border border-emerald-500/60 hover:border-emerald-400 p-0.5 flex items-center justify-center text-emerald-300 shadow-md shadow-emerald-950/50 group-hover:scale-105 transition-all">
              <div className="w-full h-full rounded-full flex items-center justify-center bg-[#07331c]/60 group-hover:bg-[#07331c]/30 transition-colors">
                <Settings className="h-4 w-4 sm:h-4.5 sm:w-4.5 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)] group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
          </button>

          {/* 6. أفتار دائري مكبر للمساعدة والدليل مع مساحة لمس 44px */}
          <button
            onClick={() => setShowWelcomeModal(true)}
            title="المساعدة ودليل الاستخدام"
            className="min-w-[42px] min-h-[42px] sm:min-w-[46px] sm:min-h-[46px] p-1 flex items-center justify-center cursor-pointer focus:outline-none select-none group active:scale-95 transition-all touch-manipulation"
          >
            <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-full bg-gradient-to-b from-[#1c2c48] to-[#0e1726] hover:from-[#24395c] hover:to-[#131f33] border border-amber-500/40 hover:border-amber-400 p-0.5 flex items-center justify-center text-amber-300 shadow-md group-hover:scale-105 transition-all">
              <div className="w-full h-full rounded-full flex items-center justify-center bg-[#131f33]/70 group-hover:bg-[#131f33]/40 transition-colors">
                <HelpCircle className="h-4 w-4 sm:h-4.5 sm:w-4.5 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </button>

        </div>
      </header>

      {/* 3. Navigation View Switcher (Tasbeeh & Stats) */}
      <div className="px-4 pt-3 max-w-md mx-auto w-full">
        <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md p-1 rounded-2xl border border-stone-200 dark:border-stone-800 flex shadow-sm">
          <button
            onClick={() => setActiveTab('tasbeeh')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'tasbeeh'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-600 dark:text-stone-400 hover:text-amber-500'
            }`}
          >
            <span>📿</span>
            <span>السبحة الإلكترونية</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-600 dark:text-stone-400 hover:text-amber-500'
            }`}
          >
            <BarChart3 size={14} />
            <span>سجل الورد والإحصائيات</span>
          </button>
        </div>
      </div>

      {/* 4. Active Tab Content Canvas */}
      <main className="flex-1 flex flex-col items-center justify-start p-4 max-w-md mx-auto w-full">
        
        {/* TAB 1: Smart Tasbeeh Counter */}
        {activeTab === 'tasbeeh' && (
          <div className="w-full space-y-5 flex flex-col items-center animate-in fade-in duration-300">
            {/* Selected Dhikr Selector Card */}
            <div className="w-full">
              <button
                onClick={() => setShowPresetsMenu(true)}
                className="w-full p-4 rounded-3xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-lg hover:border-amber-500/40 transition-all flex items-center justify-between text-right group cursor-pointer"
              >
                <div className="flex-1">
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold block mb-0.5">
                    الذكر المختار • الهدف: {target > 0 ? target : 'مفتوح'}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-serif leading-relaxed">
                    {selectedDhikr.text}
                  </h2>
                  {selectedDhikr.virtue && (
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1">
                      <Sparkles size={12} className="text-amber-500 shrink-0" />
                      <span>{selectedDhikr.virtue}</span>
                    </p>
                  )}
                </div>
                <div className="p-2 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-500 group-hover:text-amber-500 transition-colors mr-2">
                  <ChevronDown size={18} />
                </div>
              </button>
            </div>

            {/* Big Circular Tactile Tasbeeh Button */}
            <div className="relative flex items-center justify-center my-2">
              {/* Circular Progress Ring */}
              <svg className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90 transform" viewBox="0 0 200 200">
                {/* Background Track */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  className="text-stone-200 dark:text-stone-800/80 stroke-current"
                  strokeWidth="6"
                  fill="transparent"
                />
                {/* Active Progress */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  className="text-amber-500 stroke-current transition-all duration-150 ease-out"
                  strokeWidth="6"
                  strokeDasharray="565.48"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              {/* Center Touch Button - Golden Glowing Circular Tasbeeh exactly matching user reference */}
              <button
                id="tasbih-button"
                type="button"
                onClick={handleTasbihClick}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
                onTouchStart={() => setIsPressed(true)}
                onTouchEnd={() => setIsPressed(false)}
                onTouchCancel={() => setIsPressed(false)}
                className={`absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-[#ffb703] via-[#ffa200] to-[#e85d04] shadow-[0_0_50px_rgba(255,183,3,0.45)] border-2 border-amber-300/80 ring-4 ring-amber-400/40 transition-all duration-100 cursor-pointer select-none touch-manipulation active:scale-95 active:brightness-95 active:ring-8 active:ring-amber-300/60 ${
                  isPressed ? 'scale-95 brightness-95 ring-8 ring-amber-300/60 shadow-[0_0_65px_rgba(255,183,3,0.65)]' : 'scale-100 hover:scale-[1.02]'
                }`}
              >
                {/* Subtle soft inner ambient radial lighting */}
                <div className="absolute inset-0 bg-radial from-white/20 via-transparent to-black/10 pointer-events-none" />

                {/* Big Bold Black Counter Number */}
                <span 
                  id="tasbih-counter" 
                  className="relative z-10 text-6xl sm:text-7xl font-black font-mono tracking-tight leading-none text-stone-950 select-none drop-shadow-sm"
                >
                  {count}
                </span>
                
                {/* Clean Dark Text: اضغط للتسبيح */}
                <span className="relative z-10 text-sm sm:text-base font-extrabold text-stone-950 mt-2.5 tracking-wide select-none drop-shadow-xs">
                  اضغط للتسبيح
                </span>

                {/* Translucent Dark Pill Badge: 0 / 33 */}
                <div className="relative z-10 mt-2.5 px-4 py-1 rounded-full bg-black/15 border border-black/10 text-stone-950 font-black text-xs sm:text-sm font-mono shadow-inner tracking-wider select-none">
                  {count} / {target > 0 ? target : '∞'}
                </div>
              </button>
            </div>

            {/* Target Buttons & Reset Controls */}
            <div className="w-full flex items-center justify-between gap-2 px-1">
              {/* Target Quick Selectors */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 p-1 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
                {[33, 99, 100, 0].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTarget(t);
                      setCount(0);
                      showNotificationMessage(`الهدف: ${t === 0 ? 'مفتوح' : t}`);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      target === t
                        ? 'bg-amber-500 text-stone-950 shadow-sm'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    {t === 0 ? 'مفتوح' : t}
                  </button>
                ))}
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-red-500 hover:border-red-500/40 text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
                title="إعادة ضبط العداد"
              >
                <RotateCcw size={14} />
                <span>تصفير</span>
              </button>
            </div>

            {/* Stats Strip: Rounds & Total */}
            <div className="w-full grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-center shadow-sm">
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-0.5">
                  الدورات المكتملة
                </span>
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">
                  {roundsCompleted}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 text-center shadow-sm">
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block mb-0.5">
                  إجمالي تسبيحات اليوم
                </span>
                <span id="total-today" className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {totalToday}
                </span>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Daily Streak & Weekly Stats & Share Card */}
        {activeTab === 'stats' && (
          <StatsView
            totalToday={totalToday}
            roundsCompleted={roundsCompleted}
            streakDays={streakDays}
            dailyHistory={dailyHistory}
            onShareBadge={() => setShowShareModal(true)}
            triggerNotification={showNotificationMessage}
          />
        )}

      </main>

      {/* 5. Presets Drawer / Modal */}
      {showPresetsMenu && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl border border-stone-200 dark:border-stone-800 p-5 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <AppAvatar src={avatarUrl} alt="أذكار" className="rounded-lg border border-amber-500/40" sizeClassName="w-7 h-7" />
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                  قائمة الأذكار والتسبيحات
                </h3>
              </div>
              <button
                onClick={() => setShowPresetsMenu(false)}
                className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Presets List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {presets.map((item) => {
                const isSelected = selectedDhikr.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPreset(item)}
                    className={`w-full p-3.5 rounded-2xl text-right transition-all flex items-center justify-between border cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 font-bold shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700/60 text-stone-800 dark:text-stone-200 hover:border-amber-400'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-serif">{item.text}</p>
                      {item.virtue && (
                        <p className="text-[11px] font-sans text-stone-500 dark:text-stone-400 mt-0.5">
                          {item.virtue}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 mr-2">
                      <span className="text-xs bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded-lg text-stone-700 dark:text-stone-300 font-mono">
                        {item.target}
                      </span>
                      {isSelected && <Check size={16} className="text-amber-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Add Custom Dhikr Button */}
            {!showAddCustom ? (
              <button
                onClick={() => setShowAddCustom(true)}
                className="w-full py-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-stone-200 dark:border-stone-700 cursor-pointer"
              >
                <Plus size={16} />
                <span>إضافة ذكر مخصص</span>
              </button>
            ) : (
              <form onSubmit={handleAddCustom} className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-2.5">
                <input
                  type="text"
                  placeholder="اكتب نص الذكر (مثال: رَبِّ اغْفِرْ لِي)"
                  value={newDhikrText}
                  onChange={(e) => setNewDhikrText(e.target.value)}
                  className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="الهدف (مثال: 33)"
                    value={newDhikrTarget}
                    onChange={(e) => setNewDhikrTarget(Number(e.target.value))}
                    className="w-24 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500"
                    min={1}
                  />
                  <button
                    type="submit"
                    className="flex-1 bg-amber-500 text-stone-950 font-bold rounded-xl text-xs py-2 hover:bg-amber-400 transition cursor-pointer"
                  >
                    حفظ وإضافة
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddCustom(false)}
                    className="px-3 bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 6. 4K App Avatar & Photo Customizer Modal */}
      <AvatarModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatar={avatarUrl}
        onAvatarChange={(newUrl) => setAvatarUrl(newUrl)}
        onNotify={showNotificationMessage}
      />

      {/* 7. Sound & Acoustic Rosary Modal (مركز أصوات ونغمات المسبحة الفاخرة) */}
      <SoundModal
        isOpen={showSoundModal}
        onClose={() => setShowSoundModal(false)}
        currentSound={soundMode}
        onSelectSound={(newMode) => setSoundMode(newMode)}
        vibrationEnabled={vibrationEnabled}
        onToggleVibration={(enabled) => setVibrationEnabled(enabled)}
        onShowNotification={showNotificationMessage}
      />

      {/* 8. Settings & App Info Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        triggerNotification={showNotificationMessage}
        currentQuote={currentQuote}
        onRefreshQuote={handleRefreshQuote}
        onOpenWelcome={() => setShowWelcomeModal(true)}
        avatarUrl={avatarUrl}
        onOpenAvatarModal={() => setShowAvatarModal(true)}
        onOpenSoundModal={() => setShowSoundModal(true)}
      />

      {/* 8. Welcome Greeting & Guide Modal */}
      <WelcomeModal
        isOpen={showWelcomeModal && !showSplash}
        onClose={() => setShowWelcomeModal(false)}
        avatarUrl={avatarUrl}
      />

      {/* 9. Share Achievement Card Modal */}
      <ShareCardModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        totalToday={totalToday}
        roundsCompleted={roundsCompleted}
        streakDays={streakDays}
        dailyHistory={dailyHistory}
        currentDhikrTitle={selectedDhikr.text}
        triggerNotification={showNotificationMessage}
      />

      </div>
    </div>
  );
}
