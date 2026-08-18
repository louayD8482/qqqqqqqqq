import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, ChevronLeft, ChevronRight, Sparkles, Check, Flame, Award, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { DhikrItem, UserSettings, SmartRoutine } from '../types';
import { VisualBeadRing } from './VisualBeadRing';
import { playBeadSound, playCompletionChime, triggerHapticFeedback } from '../utils/audio';
import confetti from 'canvas-confetti';

interface MainCounterProps {
  currentCount: number;
  target: number | 'infinity';
  activeDhikr: DhikrItem;
  adhkarList: DhikrItem[];
  settings: UserSettings;
  activeRoutine: SmartRoutine | null;
  routineStepIndex: number;
  onIncrement: () => void;
  onReset: () => void;
  onSelectDhikr: (dhikr: DhikrItem) => void;
  onSelectTarget: (target: number | 'infinity') => void;
  onNextRoutineStep?: () => void;
  onCancelRoutine?: () => void;
  todayTotal: number;
  dailyGoal: number;
  isRTL: boolean;
}

export const MainCounter: React.FC<MainCounterProps> = ({
  currentCount,
  target,
  activeDhikr,
  adhkarList,
  settings,
  activeRoutine,
  routineStepIndex,
  onIncrement,
  onReset,
  onSelectDhikr,
  onSelectTarget,
  onNextRoutineStep,
  onCancelRoutine,
  todayTotal,
  dailyGoal,
  isRTL,
}) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [justReachedTarget, setJustReachedTarget] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Targets options
  const targetOptions: (number | 'infinity')[] = [33, 99, 100, 1000, 'infinity'];

  // Handle tap/click with sound, vibration, ripple, and milestone check
  const handleTap = (e?: React.MouseEvent | React.TouchEvent) => {
    // Generate ripple coords
    if (buttonRef.current && e && 'clientX' in e) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRipples((prev) => [...prev.slice(-4), { id: Date.now(), x, y }]);
    } else {
      setRipples((prev) => [...prev.slice(-4), { id: Date.now(), x: 140, y: 140 }]);
    }

    // Audio & Haptics
    if (settings.soundEnabled) {
      playBeadSound(settings.soundType);
    }
    if (settings.vibrationEnabled) {
      triggerHapticFeedback(15);
    }

    // Target milestone checks
    const nextCount = currentCount + 1;
    const isTargetReached = target !== 'infinity' && nextCount >= target;

    if (isTargetReached) {
      playCompletionChime();
      triggerHapticFeedback([40, 60, 80]);
      setJustReachedTarget(true);
      setTimeout(() => setJustReachedTarget(false), 2000);

      // Trigger soft confetti celebration
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#fbbf24', '#34d399'],
        });
      } catch {
        // Safe fallback if canvas is restricted
      }

      // If active smart routine, automatically transition to next step
      if (activeRoutine && onNextRoutineStep && settings.autoAdvanceRoutine) {
        setTimeout(() => {
          onNextRoutineStep();
        }, 500);
      }
    }

    onIncrement();
  };

  // Keyboard navigation (Space, Enter, ArrowUp for counting)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space' || e.key === 'Enter' || e.key === 'ArrowUp') {
        e.preventDefault();
        handleTap();
      } else if (e.key === 'r' || e.key === 'R') {
        setShowResetConfirm(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCount, target, settings, activeRoutine]);

  // Navigate through Adhkar
  const currentIndex = adhkarList.findIndex((d) => d.id === activeDhikr.id);
  const handlePrevDhikr = () => {
    const prevIdx = (currentIndex - 1 + adhkarList.length) % adhkarList.length;
    onSelectDhikr(adhkarList[prevIdx]);
  };
  const handleNextDhikr = () => {
    const nextIdx = (currentIndex + 1) % adhkarList.length;
    onSelectDhikr(adhkarList[nextIdx]);
  };

  // Progress percentage calculation
  const progressPercent =
    target === 'infinity' ? 100 : Math.min(100, Math.round((currentCount / target) * 100));

  // Circular progress SVG values
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    target === 'infinity'
      ? 0
      : circumference - (Math.min(currentCount, target) / target) * circumference;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-between min-h-[calc(100vh-140px)] py-2 px-4 select-none">
      {/* 1. Smart Routine Status Banner (if active) */}
      <AnimatePresence mode="wait">
        {activeRoutine && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full mb-3 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-teal-500/15 border border-amber-500/30 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-950 dark:text-emerald-100">
                    {isRTL ? activeRoutine.titleAr : activeRoutine.titleEn}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                    {isRTL
                      ? `خطوة ${routineStepIndex + 1} من ${activeRoutine.steps.length}`
                      : `Step ${routineStepIndex + 1} of ${activeRoutine.steps.length}`}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-300">
                  {activeRoutine.steps[routineStepIndex]?.virtue || ''}
                </p>
              </div>
            </div>
            {onCancelRoutine && (
              <button
                onClick={onCancelRoutine}
                className="text-xs px-2.5 py-1 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-black/5 dark:hover:bg-white/10"
              >
                {isRTL ? 'إنهاء الورد' : 'Exit'}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Active Dhikr Display Card */}
      <div className="w-full flex items-center justify-between gap-2 px-2 py-1 mb-1">
        <button
          onClick={isRTL ? handleNextDhikr : handlePrevDhikr}
          className="p-2 rounded-xl text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 active:scale-95 transition-all"
          title={isRTL ? 'الذكر التالي' : 'Previous Dhikr'}
          aria-label="Previous Dhikr"
        >
          {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>

        <div className="flex-1 text-center min-h-[78px] flex flex-col justify-center items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDhikr.id + activeDhikr.arabicText}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50 font-serif leading-snug px-2">
                {activeDhikr.arabicText}
              </h2>
              {settings.language === 'en' && activeDhikr.englishTranslation && (
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                  {activeDhikr.englishTranslation}
                </p>
              )}
              {activeDhikr.virtue && (
                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium mt-1 line-clamp-1">
                  ✨ {activeDhikr.virtue}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={isRTL ? handlePrevDhikr : handleNextDhikr}
          className="p-2 rounded-xl text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10 active:scale-95 transition-all"
          title={isRTL ? 'الذكر السابق' : 'Next Dhikr'}
          aria-label="Next Dhikr"
        >
          {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </button>
      </div>

      {/* 3. Central Interactive Tasbeeh Bead Circle (The Master Counter) */}
      <div className="relative w-full flex items-center justify-center my-auto py-4">
        {/* Visual Bead Ring (Around the main button) */}
        <VisualBeadRing
          count={currentCount}
          totalBeads={settings.visualBeadsCount || 33}
          radius={135}
          theme={settings.theme}
        />

        {/* Master Tap Button */}
        <button
          ref={buttonRef}
          onClick={handleTap}
          className={`relative w-64 h-64 sm:w-72 sm:h-72 rounded-full flex flex-col items-center justify-center cursor-pointer transition-transform duration-75 active:scale-[0.97] outline-none select-none shadow-2xl focus:ring-4 focus:ring-emerald-500/30 overflow-hidden ${
            settings.theme === 'dark' || settings.theme === 'oled'
              ? 'bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border-4 border-stone-800 shadow-emerald-950/40 text-stone-100'
              : settings.theme === 'amber'
              ? 'bg-gradient-to-b from-amber-50 via-amber-100/70 to-amber-200/50 border-4 border-amber-300 shadow-amber-900/10 text-amber-950'
              : settings.theme === 'light'
              ? 'bg-gradient-to-b from-stone-50 via-emerald-50/40 to-stone-100 border-4 border-emerald-200/80 shadow-emerald-900/10 text-stone-900'
              : 'bg-gradient-to-b from-emerald-900/90 via-emerald-950 to-teal-950 border-4 border-emerald-500/40 shadow-emerald-950/60 text-emerald-50'
          }`}
          aria-label={isRTL ? `تسبيح: العداد الحالي ${currentCount}` : `Count: ${currentCount}`}
        >
          {/* Circular SVG Progress Rim */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1.5"
            viewBox="0 0 260 260"
          >
            {/* Background Track */}
            <circle
              cx="130"
              cy="130"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-10"
            />
            {/* Progress Stroke */}
            <motion.circle
              cx="130"
              cy="130"
              r={radius}
              fill="none"
              stroke={
                settings.theme === 'amber'
                  ? '#d97706'
                  : justReachedTarget
                  ? '#fbbf24'
                  : '#10b981'
              }
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            />
          </svg>

          {/* Interactive Tap Ripples */}
          {ripples.map((rip) => (
            <motion.span
              key={rip.id}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 2.8, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ left: rip.x, top: rip.y }}
              className="absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 pointer-events-none"
            />
          ))}

          {/* Target Milestone Badge */}
          <div className="text-xs font-semibold px-3 py-1 rounded-full mb-1 bg-black/10 dark:bg-white/10 backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
            <span>{isRTL ? 'الهدف:' : 'Target:'}</span>
            <span className="font-bold text-amber-500 dark:text-amber-300">
              {target === 'infinity' ? '∞' : target}
            </span>
          </div>

          {/* Master Counter Number */}
          <div
            className="text-6xl sm:text-7xl font-extrabold tracking-tight font-sans drop-shadow-sm select-none"
          >
            {currentCount}
          </div>

          {/* Target completion or progress percentage */}
          <div className="mt-1 text-xs font-medium text-stone-500 dark:text-stone-400 flex items-center gap-1">
            {target !== 'infinity' && (
              <>
                <span>{progressPercent}%</span>
                {progressPercent >= 100 && (
                  <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" />
                )}
              </>
            )}
            {target === 'infinity' && <span>{isRTL ? 'تسبيح مفتوح' : 'Open Count'}</span>}
          </div>

          <span className="text-[11px] text-stone-400/80 dark:text-stone-500 mt-2 font-medium tracking-wide">
            {isRTL ? 'المس للعد' : 'Tap to Count'}
          </span>
        </button>
      </div>

      {/* 4. Target Preset Selector Bar */}
      <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 my-2 py-1 overflow-x-auto">
        <span className="text-xs font-medium text-stone-500 dark:text-stone-400 ml-1">
          {isRTL ? 'الهدف:' : 'Goal:'}
        </span>
        {targetOptions.map((opt) => (
          <button
            key={String(opt)}
            onClick={() => onSelectTarget(opt)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all active:scale-95 ${
              target === opt
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20 border border-emerald-500'
                : 'bg-stone-200/70 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
            }`}
          >
            {opt === 'infinity' ? '∞' : opt}
          </button>
        ))}
      </div>

      {/* 5. Bottom Quick Actions (Reset & Daily Summary Bar) */}
      <div className="w-full flex items-center justify-between px-2 pt-2 border-t border-stone-200/60 dark:border-stone-800/60">
        {/* Reset Counter Button */}
        <div className="relative">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 active:scale-95 transition-all"
            title={isRTL ? 'إعادة التصفير' : 'Reset Counter'}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isRTL ? 'تصفير' : 'Reset'}</span>
          </button>

          {/* Reset Confirmation Tooltip Modal */}
          <AnimatePresence>
            {showResetConfirm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute bottom-10 start-0 z-30 w-52 p-3 rounded-2xl bg-white dark:bg-stone-900 shadow-xl border border-stone-200 dark:border-stone-700 text-center"
              >
                <p className="text-xs font-bold text-stone-800 dark:text-stone-100 mb-2">
                  {isRTL ? 'تصفير العداد الحالي؟' : 'Reset current count?'}
                </p>
                <div className="flex gap-1.5 justify-center">
                  <button
                    onClick={() => {
                      onReset();
                      setShowResetConfirm(false);
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white active:scale-95 transition-all"
                  >
                    {isRTL ? 'نعم، صفّر' : 'Yes, Reset'}
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 active:scale-95 transition-all"
                  >
                    {isRTL ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Daily Goal Mini Progress */}
        <div className="flex items-center gap-2">
          <div className="text-end">
            <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
              {isRTL ? 'تسبيحات اليوم:' : "Today's Tasbeeh:"}
            </div>
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
              {todayTotal.toLocaleString()} / {dailyGoal.toLocaleString()}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Award className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
