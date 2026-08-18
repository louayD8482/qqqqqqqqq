import React from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, CheckCircle2, Play, ArrowRight, ArrowLeft } from 'lucide-react';
import { SmartRoutine } from '../types';
import { SMART_ROUTINES } from '../data/adhkar';

interface SmartRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartRoutine: (routine: SmartRoutine) => void;
  isRTL: boolean;
}

export const SmartRoutineModal: React.FC<SmartRoutineModalProps> = ({
  isOpen,
  onClose,
  onStartRoutine,
  isRTL,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-emerald-500/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {isRTL ? 'وضع التسبيح الذكي والأوراد' : 'Smart Guided Routines'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isRTL ? 'تسبيح منظم ينتقل تلقائيًا بين الأذكار بعد إتمام العدد' : 'Automatic transitions as you reach each count target'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Routines List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          {SMART_ROUTINES.map((routine) => {
            const totalCount = routine.steps.reduce((acc, s) => acc + s.target, 0);

            return (
              <div
                key={routine.id}
                className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 hover:border-emerald-500/50 transition-all hover:shadow-md group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif">
                        {isRTL ? routine.titleAr : routine.titleEn}
                      </h3>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                        {isRTL ? `المجموع: ${totalCount} تسبيحة` : `Total: ${totalCount}`}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      {isRTL ? routine.descriptionAr : routine.descriptionEn}
                    </p>
                  </div>
                </div>

                {/* Steps Preview */}
                <div className="space-y-1.5 my-3">
                  {routine.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-700/60"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-stone-800 dark:text-stone-200 font-serif">
                          {step.arabicText}
                        </span>
                      </div>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {step.target}×
                      </span>
                    </div>
                  ))}
                </div>

                {/* Start Button */}
                <button
                  onClick={() => {
                    onStartRoutine(routine);
                    onClose();
                  }}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 active:scale-[0.98] transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isRTL ? 'ابدأ هذا الورد الآن' : 'Start This Routine'}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
