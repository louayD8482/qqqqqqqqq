import React, { useState } from 'react';
import { Heart, Sparkles, Sun, Moon, Compass, Check, Copy, ArrowRight, Play } from 'lucide-react';
import { HISN_ALMUSLIM_CATEGORIES } from '../data/islamicContent';
import { DhikrItem } from '../types';

interface AdhkarSectionProps {
  onSelectDhikrForTasbih: (dhikr: DhikrItem) => void;
  onCopy: (text: string, id: number) => void;
  copiedId: number | null;
  triggerNotification: (msg: string) => void;
  isRTL: boolean;
}

export const AdhkarSection: React.FC<AdhkarSectionProps> = ({
  onSelectDhikrForTasbih,
  onCopy,
  copiedId,
  triggerNotification,
  isRTL,
}) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [completedDhikrs, setCompletedDhikrs] = useState<Record<string, boolean>>({});

  const currentCategory = HISN_ALMUSLIM_CATEGORIES[activeCategoryIndex];

  const handleToggleComplete = (key: string) => {
    setCompletedDhikrs((prev) => {
      const nextVal = !prev[key];
      if (nextVal) {
        triggerNotification(isRTL ? "أحسنت! تم احتساب الذكر وكتابة الأجر ✨" : "Dhikr completed! ✨");
      }
      return { ...prev, [key]: nextVal };
    });
  };

  const startTasbihWithDhikr = (item: { text: string; target: number; virtue: string }, idx: number) => {
    const dhikrItem: DhikrItem = {
      id: `hisn_${activeCategoryIndex}_${idx}`,
      arabicText: item.text,
      virtue: item.virtue,
      defaultTarget: item.target,
      category: 'morning_evening',
    };
    onSelectDhikrForTasbih(dhikrItem);
    triggerNotification(isRTL ? "تم تعيين الذكر في المسبحة الإلكترونية 📿" : "Dhikr loaded to Tasbeeh Counter 📿");
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'Moon':
        return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'Compass':
        return <Compass className="w-4 h-4 text-emerald-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  const completedCount = currentCategory.items.filter((_, idx) => completedDhikrs[`${activeCategoryIndex}_${idx}`]).length;

  return (
    <div className="space-y-4 select-none">
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-rose-600/10 to-amber-600/10 border border-amber-500/30 dark:border-amber-400/20 shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                {isRTL ? 'حصن المسلم والأذكار اليومية' : 'Hisn Al-Muslim & Daily Adhkar'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isRTL ? 'أذكار الصباح والمساء وأدعية الحصن الحصين' : 'Morning, evening, and daily prophetic supplications'}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
            {completedCount} / {currentCategory.items.length} {isRTL ? 'مكتمل' : 'done'}
          </span>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-1 mt-3 scrollbar-none">
          {HISN_ALMUSLIM_CATEGORIES.map((cat, idx) => {
            const isActive = activeCategoryIndex === idx;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategoryIndex(idx)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-600/20 scale-102'
                    : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                {getCategoryIcon(cat.icon)}
                <span>{isRTL ? cat.titleAr : cat.titleEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Adhkar List */}
      <div className="space-y-3">
        {currentCategory.items.map((item, idx) => {
          const key = `${activeCategoryIndex}_${idx}`;
          const isDone = completedDhikrs[key] ?? false;

          return (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                isDone
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                  {isRTL ? `التكرار: ${item.target} مرات` : `Target: ${item.target}x`}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onCopy(item.text, 8000 + idx)}
                    className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 hover:text-amber-500 transition-all text-xs"
                    title={isRTL ? 'نسخ الذكر' : 'Copy'}
                  >
                    {copiedId === 8000 + idx ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => startTasbihWithDhikr(item, idx)}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 font-bold text-[11px] transition-all flex items-center gap-1"
                    title={isRTL ? 'تسبيح في العداد' : 'Open in Counter'}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isRTL ? 'تسبيح' : 'Counter'}</span>
                  </button>
                </div>
              </div>

              {/* Text */}
              <p className="text-sm sm:text-base font-serif font-bold text-stone-900 dark:text-amber-100 leading-relaxed mb-3">
                "{item.text}"
              </p>

              {/* Virtue */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-stone-800/60 border border-amber-500/15 text-[11px] text-stone-600 dark:text-stone-300 mb-3">
                <span className="font-bold text-amber-800 dark:text-amber-400">{isRTL ? 'فضل الذكر: ' : 'Virtue: '}</span>
                {item.virtue}
              </div>

              {/* Mark Completed Button */}
              <button
                onClick={() => handleToggleComplete(key)}
                className={`w-full py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20'
                    : 'bg-stone-100 dark:bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{isDone ? (isRTL ? 'تمت القراءة بنجاح ✓' : 'Completed ✓') : (isRTL ? 'تمت القراءة' : 'Mark Done')}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
