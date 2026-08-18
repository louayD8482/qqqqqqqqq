import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Minimize2, RotateCcw, Volume2, VolumeX, Sparkles, Check } from 'lucide-react';
import { DhikrItem, UserSettings } from '../types';
import { playBeadSound, playCompletionChime, triggerHapticFeedback } from '../utils/audio';

interface FocusFullscreenProps {
  isOpen: boolean;
  onClose: () => void;
  currentCount: number;
  target: number | 'infinity';
  activeDhikr: DhikrItem;
  settings: UserSettings;
  onIncrement: () => void;
  onReset: () => void;
  isRTL: boolean;
}

export const FocusFullscreen: React.FC<FocusFullscreenProps> = ({
  isOpen,
  onClose,
  currentCount,
  target,
  activeDhikr,
  settings,
  onIncrement,
  onReset,
  isRTL,
}) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  if (!isOpen) return null;

  const handleScreenTap = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;

    if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if ('touches' in e && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    setRipples((prev) => [...prev.slice(-5), { id: Date.now(), x: clientX, y: clientY }]);

    if (settings.soundEnabled) {
      playBeadSound(settings.soundType);
    }
    if (settings.vibrationEnabled) {
      triggerHapticFeedback(15);
    }

    const nextCount = currentCount + 1;
    if (target !== 'infinity' && nextCount >= target) {
      playCompletionChime();
      triggerHapticFeedback([40, 60, 80]);
    }

    onIncrement();
  };

  const progressPercent =
    target === 'infinity' ? 100 : Math.min(100, Math.round((currentCount / target) * 100));

  return (
    <div
      onClick={handleScreenTap}
      className={`fixed inset-0 z-50 flex flex-col justify-between p-6 cursor-pointer select-none overflow-hidden touch-none ${
        settings.theme === 'oled'
          ? 'bg-black text-white'
          : settings.theme === 'dark'
          ? 'bg-stone-950 text-stone-100'
          : settings.theme === 'amber'
          ? 'bg-amber-950 text-amber-50'
          : settings.theme === 'light'
          ? 'bg-emerald-50 text-stone-900'
          : 'bg-gradient-to-b from-emerald-950 via-stone-950 to-teal-950 text-emerald-50'
      }`}
    >
      {/* Tap Ripples */}
      {ripples.map((rip) => (
        <motion.span
          key={rip.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ left: rip.x, top: rip.y }}
          className="absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 pointer-events-none"
        />
      ))}

      {/* Top Bar (Exit, Dhikr Info, Reset) */}
      <div
        className="w-full flex items-center justify-between z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white active:scale-95 transition-all flex items-center gap-1.5 text-xs font-bold"
          title={isRTL ? 'إنهاء وضع التركيز' : 'Exit Focus'}
        >
          <Minimize2 className="w-5 h-5" />
          <span>{isRTL ? 'خروج' : 'Exit'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white active:scale-95 transition-all"
            title={isRTL ? 'إعادة التصفير' : 'Reset'}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Display (Dhikr & Giant Counter) */}
      <div className="my-auto text-center flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          key={activeDhikr.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 px-4"
        >
          <h1 className="text-3xl sm:text-4xl font-bold font-serif leading-snug drop-shadow-md text-amber-300">
            {activeDhikr.arabicText}
          </h1>
          {activeDhikr.virtue && (
            <p className="text-xs text-stone-300/80 mt-2 line-clamp-1 max-w-sm mx-auto">
              ✨ {activeDhikr.virtue}
            </p>
          )}
        </motion.div>

        {/* Giant Number */}
        <motion.div
          key={currentCount}
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="text-8xl sm:text-9xl font-black font-sans tracking-tight drop-shadow-2xl"
        >
          {currentCount}
        </motion.div>

        {/* Target Progress Status */}
        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-stone-400">
          <span>
            {isRTL ? 'الهدف:' : 'Target:'} {target === 'infinity' ? '∞' : target}
          </span>
          {target !== 'infinity' && (
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs">
              {progressPercent}%
            </span>
          )}
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="w-full text-center pb-4 pointer-events-none z-10">
        <p className="text-xs text-stone-400 font-medium tracking-wide">
          {isRTL ? 'المس في أي مكان على الشاشة للتسبيح' : 'Tap anywhere on screen to count'}
        </p>
      </div>
    </div>
  );
};
