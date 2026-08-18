import React from 'react';
import { motion } from 'motion/react';
import { X, BarChart3, Flame, Award, Calendar, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { DailyLog, DhikrItem } from '../types';
import { getTodayDateString } from '../utils/storage';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: Record<string, DailyLog>;
  dailyGoal: number;
  streak: number;
  adhkarList: DhikrItem[];
  isRTL: boolean;
}

export const StatisticsModal: React.FC<StatisticsModalProps> = ({
  isOpen,
  onClose,
  logs,
  dailyGoal,
  streak,
  adhkarList,
  isRTL,
}) => {
  if (!isOpen) return null;

  const todayStr = getTodayDateString();
  const todayLog = logs[todayStr] || { date: todayStr, totalCount: 0, dhikrBreakdown: {} };
  const todayCount = todayLog.totalCount;
  const goalPercent = Math.min(100, Math.round((todayCount / (dailyGoal || 1000)) * 100));

  // Compute all-time total count
  const allTimeTotal = (Object.values(logs) as DailyLog[]).reduce(
    (acc: number, log: DailyLog) => acc + (log.totalCount || 0),
    0
  );

  // Compute last 7 days data for chart
  const last7Days: { date: string; label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayName = d.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { weekday: 'short' });
    const count = logs[dateKey]?.totalCount || 0;
    last7Days.push({ date: dateKey, label: dayName, count });
  }

  const maxWeeklyCount = Math.max(...last7Days.map((d) => d.count), dailyGoal, 100);

  // Compute top dhikr breakdown across all logs
  const globalBreakdown: Record<string, number> = {};
  (Object.values(logs) as DailyLog[]).forEach((log: DailyLog) => {
    if (log.dhikrBreakdown) {
      Object.entries(log.dhikrBreakdown).forEach(([id, count]) => {
        globalBreakdown[id] = (globalBreakdown[id] || 0) + (Number(count) || 0);
      });
    }
  });

  const topDhikrs = Object.entries(globalBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => {
      const found = adhkarList.find((d) => d.id === id);
      const countNum = Number(count) || 0;
      return {
        id,
        text: found ? found.arabicText : id,
        count: countNum,
        percent: allTimeTotal > 0 ? Math.round((countNum / allTimeTotal) * 100) : 0,
      };
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-emerald-500/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {isRTL ? 'إحصائيات التسبيح وسجل الإنجاز' : 'Tasbeeh Statistics & Log'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isRTL ? 'متابعة أورادك اليومية وأرقامك القياسية' : 'Track your daily progress and milestones'}
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

        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          {/* 1. Daily Goal Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-amber-500/10 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  {isRTL ? 'الهدف اليومي' : 'Daily Goal'}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                {goalPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goalPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mt-2">
              <span>
                {isRTL ? 'تم إنجاز:' : 'Completed:'}{' '}
                <strong className="text-stone-800 dark:text-stone-200 font-sans">
                  {todayCount.toLocaleString()}
                </strong>{' '}
                {isRTL ? 'تسبيحة' : 'tasbeeh'}
              </span>
              <span>
                {isRTL ? 'الهدف:' : 'Goal:'}{' '}
                <strong className="text-stone-800 dark:text-stone-200 font-sans">
                  {dailyGoal.toLocaleString()}
                </strong>
              </span>
            </div>
          </div>

          {/* 2. Key Metrics Row (Streak, Today, Total) */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Streak */}
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-500 mb-1">
                <Flame className="w-4 h-4" />
                <span className="text-[11px] font-bold">{isRTL ? 'المتابعة' : 'Streak'}</span>
              </div>
              <div className="text-xl font-extrabold text-stone-900 dark:text-stone-100 font-sans">
                {streak}
              </div>
              <div className="text-[10px] text-stone-400">
                {isRTL ? 'أيام متتالية' : 'Days'}
              </div>
            </div>

            {/* Today's Total */}
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-[11px] font-bold">{isRTL ? 'اليوم' : 'Today'}</span>
              </div>
              <div className="text-xl font-extrabold text-stone-900 dark:text-stone-100 font-sans">
                {todayCount.toLocaleString()}
              </div>
              <div className="text-[10px] text-stone-400">
                {isRTL ? 'تسبيحة' : 'Counts'}
              </div>
            </div>

            {/* All-time Total */}
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 text-center">
              <div className="flex items-center justify-center gap-1 text-teal-600 dark:text-teal-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[11px] font-bold">{isRTL ? 'الإجمالي' : 'All-time'}</span>
              </div>
              <div className="text-xl font-extrabold text-stone-900 dark:text-stone-100 font-sans">
                {allTimeTotal.toLocaleString()}
              </div>
              <div className="text-[10px] text-stone-400">
                {isRTL ? 'تسبيحة' : 'Total'}
              </div>
            </div>
          </div>

          {/* 3. Weekly Activity Chart */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
            <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-4 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isRTL ? 'نشاط الأيام السبعة الماضية' : 'Past 7 Days Activity'}</span>
            </h3>

            <div className="flex items-end justify-between gap-2 h-32 pt-4 px-1 border-b border-stone-200 dark:border-stone-700">
              {last7Days.map((day) => {
                const heightPercent = Math.max(
                  6,
                  Math.round((day.count / (maxWeeklyCount || 100)) * 100)
                );
                const isToday = day.date === todayStr;

                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-10">
                      {day.count.toLocaleString()}
                    </div>

                    {/* Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={`w-full max-w-[28px] rounded-t-lg transition-colors ${
                        isToday
                          ? 'bg-emerald-600 dark:bg-emerald-500'
                          : day.count > 0
                          ? 'bg-emerald-400/60 dark:bg-emerald-700/60'
                          : 'bg-stone-200 dark:bg-stone-700'
                      }`}
                    />

                    {/* Day label */}
                    <span
                      className={`text-[10px] font-medium ${
                        isToday
                          ? 'font-bold text-emerald-700 dark:text-emerald-400'
                          : 'text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      {day.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Top Adhkar Breakdown */}
          {topDhikrs.length > 0 && (
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80">
              <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>{isRTL ? 'أكثر الأذكار تسبيحاً' : 'Most Recited Adhkar'}</span>
              </h3>

              <div className="space-y-2.5">
                {topDhikrs.map((item, idx) => (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-serif font-bold text-stone-900 dark:text-stone-100">
                        {item.text}
                      </span>
                      <span className="text-stone-500 dark:text-stone-400 font-sans font-semibold">
                        {item.count.toLocaleString()} ({item.percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
