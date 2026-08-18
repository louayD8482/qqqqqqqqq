import React from 'react';
import { Volume2, VolumeX, Moon, Sun, BarChart3, BookOpen, Settings, Maximize2, Sparkles, Smartphone } from 'lucide-react';
import { UserSettings, AppTheme } from '../types';

interface HeaderProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  streak: number;
  onOpenAdhkar: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onOpenRoutines: () => void;
  onToggleFullscreen: () => void;
  onOpenInstall: () => void;
  isRTL: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  streak,
  onOpenAdhkar,
  onOpenStats,
  onOpenSettings,
  onOpenRoutines,
  onToggleFullscreen,
  onOpenInstall,
  isRTL,
}) => {
  const toggleTheme = () => {
    const nextTheme: AppTheme =
      settings.theme === 'emerald'
        ? 'dark'
        : settings.theme === 'dark'
        ? 'light'
        : settings.theme === 'light'
        ? 'amber'
        : 'emerald';
    onUpdateSettings({ theme: nextTheme });
  };

  const toggleLanguage = () => {
    onUpdateSettings({ language: settings.language === 'ar' ? 'en' : 'ar' });
  };

  const toggleSound = () => {
    onUpdateSettings({
      soundEnabled: !settings.soundEnabled,
      soundType: !settings.soundEnabled ? 'wood' : 'silent',
    });
  };

  return (
    <header className="w-full max-w-xl mx-auto px-4 py-3 safe-top flex items-center justify-between z-20 select-none">
      {/* App Logo & Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-amber-300 shadow-md shadow-emerald-950/20 flex items-center justify-center border border-emerald-400/30">
          <span className="text-xl font-bold font-serif leading-none">س</span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-bold tracking-tight text-emerald-950 dark:text-emerald-50">
              {isRTL ? 'سُبْحَة' : 'Subha'}
            </h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              {isRTL ? 'الذكية' : 'Pro'}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-none">
            {isRTL ? 'ألا بذكر الله تطمئن القلوب' : 'Electronic Tasbeeh'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Install on iPhone & Galaxy Button */}
        <button
          onClick={onOpenInstall}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/25 active:scale-95 transition-all"
          title={isRTL ? 'تثبيت على الآيفون والجالكسي' : 'Install on iPhone & Galaxy'}
        >
          <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden sm:inline">{isRTL ? 'تثبيت' : 'Install'}</span>
        </button>

        {/* Streak Counter */}
        {streak > 0 && (
          <div
            onClick={onOpenStats}
            role="button"
            tabIndex={0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25 cursor-pointer hover:bg-amber-500/25 transition-colors"
            title={isRTL ? `سلسلة الأيام المتتالية: ${streak} يوم` : `${streak} Day Streak`}
          >
            <span className="text-sm">🔥</span>
            <span>{streak}</span>
          </div>
        )}

        {/* Smart Routines / ختم الصلاة */}
        <button
          onClick={onOpenRoutines}
          className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all relative"
          title={isRTL ? 'وضع التسبيح الذكي والأوراد' : 'Smart Guided Routines'}
          aria-label="Smart Routines"
        >
          <Sparkles className="w-5 h-5 text-amber-500 dark:text-amber-400" />
        </button>

        {/* Adhkar Library */}
        <button
          onClick={onOpenAdhkar}
          className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
          title={isRTL ? 'مكتبة الأذكار المأثورة' : 'Dhikr Library'}
          aria-label="Dhikr Library"
        >
          <BookOpen className="w-5 h-5" />
        </button>

        {/* Statistics */}
        <button
          onClick={onOpenStats}
          className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
          title={isRTL ? 'الإحصائيات والهدف اليومي' : 'Statistics & Goals'}
          aria-label="Statistics"
        >
          <BarChart3 className="w-5 h-5" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
          title={settings.soundEnabled ? (isRTL ? 'كتم الصوت' : 'Mute Sound') : (isRTL ? 'تشغيل صوت الخرز' : 'Enable Sound')}
          aria-label="Toggle Sound"
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <VolumeX className="w-5 h-5 text-stone-400" />
          )}
        </button>

        {/* Focus / Fullscreen Mode */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
          title={isRTL ? 'وضع التركيز وملء الشاشة' : 'Focus Mode'}
          aria-label="Focus Mode"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* Theme Switch */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
          title={isRTL ? 'تغيير المظهر' : 'Change Theme'}
          aria-label="Toggle Theme"
        >
          {settings.theme === 'light' ? (
            <Sun className="w-5 h-5 text-amber-500" />
          ) : (
            <Moon className="w-5 h-5 text-emerald-400" />
          )}
        </button>

        {/* Settings Modal */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all"
          title={isRTL ? 'الإعدادات' : 'Settings'}
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Language switch */}
        <button
          onClick={toggleLanguage}
          className="px-2 py-1 rounded-lg text-xs font-bold text-stone-700 dark:text-stone-200 bg-stone-200/60 dark:bg-stone-800/80 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
          title="Switch Language / تغيير اللغة"
        >
          {settings.language === 'ar' ? 'EN' : 'عربي'}
        </button>
      </div>
    </header>
  );
};

