import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Award, Flame, TrendingUp, 
  Share2, Sparkles, CheckCircle2, ShieldCheck, Clock,
  FileText, Image as ImageIcon, Download, Loader2
} from 'lucide-react';
import { 
  downloadStatsCardImage, 
  downloadTextReport,
  StatsExportData 
} from '../utils/statsExport';

interface StatsViewProps {
  totalToday: number;
  roundsCompleted: number;
  streakDays: number;
  dailyHistory: Record<string, number>;
  onShareBadge: () => void;
  triggerNotification: (msg: string) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  totalToday,
  roundsCompleted,
  streakDays,
  dailyHistory,
  onShareBadge,
  triggerNotification,
}) => {
  const [isExportingImage, setIsExportingImage] = useState(false);

  // Generate last 7 days keys
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('ar-SA', { weekday: 'short' });
    return {
      date: iso,
      dayName,
      count: dailyHistory[iso] || 0,
      isToday: i === 6,
    };
  });

  const maxCountIn7Days = Math.max(...last7Days.map((d) => d.count), 100);
  const totalWeekly = last7Days.reduce((acc, d) => acc + d.count, 0);

  const exportData: StatsExportData = {
    totalToday,
    roundsCompleted,
    streakDays,
    dailyHistory,
  };

  const handleQuickDownloadImage = async () => {
    try {
      setIsExportingImage(true);
      triggerNotification('جاري تجهيز وتنزيل بطاقة الإحصائيات كصورة PNG... 🖼️');
      await downloadStatsCardImage(exportData);
      triggerNotification('تم تنزيل بطاقة الإحصائيات كصورة بنجاح! 🖼️🎉');
    } catch (e) {
      console.error(e);
      triggerNotification('تعذر إنشاء الصورة، يرجى المحاولة لاحقاً.');
    } finally {
      setIsExportingImage(false);
    }
  };

  const handleQuickDownloadText = () => {
    try {
      triggerNotification('جاري تجهيز وتنزيل تقرير الإحصائيات النصي... 📄');
      downloadTextReport(exportData);
      triggerNotification('تم تنزيل تقرير الإحصائيات (.txt) بنجاح! 📄🎉');
    } catch (e) {
      console.error(e);
      triggerNotification('تعذر إنشاء الملف النصي.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pb-20 select-none animate-in fade-in duration-300">
      
      {/* 1. Main Hero Metric Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Today Total */}
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
            <span className="text-xs font-bold">تسبيحات اليوم</span>
            <Sparkles size={16} className="text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
              {totalToday.toLocaleString('ar-EG')}
            </span>
            <p className="text-[10px] text-stone-400 mt-0.5">تسبيحة وذكر</p>
          </div>
        </div>

        {/* Continuous Streak */}
        <div className="p-4 rounded-3xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
            <span className="text-xs font-bold">سلسلة الأيام</span>
            <Flame size={16} className="text-rose-500 animate-pulse" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-rose-500">
              {streakDays} <span className="text-xs font-bold text-stone-400">يوم</span>
            </span>
            <p className="text-[10px] text-stone-400 mt-0.5">مواظبة مستمرة</p>
          </div>
        </div>

        {/* Rounds Completed */}
        <div className="col-span-2 sm:col-span-1 p-4 rounded-3xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
            <span className="text-xs font-bold">الدورات المكتملة</span>
            <Award size={16} className="text-emerald-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-500">
              {roundsCompleted}
            </span>
            <p className="text-[10px] text-stone-400 mt-0.5">ختمات الأوراد</p>
          </div>
        </div>
      </div>

      {/* 2. Weekly Bar Chart Activity */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} className="text-amber-500" />
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              نشاط التسبيح خلال الأسبوع
            </h3>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">
            المجموع: {totalWeekly.toLocaleString('ar-SA')} تسبيحة
          </span>
        </div>

        {/* Bars Container */}
        <div className="flex items-end justify-between gap-2 h-36 pt-4 px-1 border-b border-stone-200 dark:border-stone-800 pb-2">
          {last7Days.map((d, i) => {
            const heightPercent = Math.max(8, Math.round((d.count / maxCountIn7Days) * 100));
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[9px] font-mono text-stone-400 group-hover:text-amber-500 transition-colors">
                  {d.count > 0 ? d.count : ''}
                </span>
                <div 
                  className={`w-full max-w-[28px] rounded-t-xl transition-all duration-300 ${
                    d.isToday
                      ? 'bg-gradient-to-t from-amber-500 to-amber-400 shadow-md shadow-amber-500/20'
                      : d.count > 0
                      ? 'bg-emerald-500/60 hover:bg-emerald-500'
                      : 'bg-stone-200 dark:bg-stone-800'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className={`text-[10px] font-bold ${d.isToday ? 'text-amber-500' : 'text-stone-500'}`}>
                  {d.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Export & Share Achievement Bento Box */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-emerald-600/10 to-amber-600/20 border border-amber-500/30 dark:border-amber-400/20 shadow-lg space-y-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <h4 className="font-bold text-base text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-500" />
              <span>تصدير ومشاركة إحصائيات التسبيح</span>
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              صدّر تقريرك اليومي والأسبوعي كصورة فاخرة أو ملف نصي وشاركه للتذكير بالأجر
            </p>
          </div>

          <button
            onClick={onShareBadge}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Share2 size={15} />
            <span>عرض بطاقة المشاركة</span>
          </button>
        </div>

        {/* Quick Direct Export Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-amber-500/20">
          <button
            onClick={handleQuickDownloadImage}
            disabled={isExportingImage}
            className="py-2.5 px-3 rounded-2xl bg-white/60 dark:bg-stone-900/60 hover:bg-white dark:hover:bg-stone-900 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            {isExportingImage ? <Loader2 size={15} className="animate-spin" /> : <ImageIcon size={15} />}
            <span>حفظ كصورة (PNG)</span>
          </button>

          <button
            onClick={handleQuickDownloadText}
            className="py-2.5 px-3 rounded-2xl bg-white/60 dark:bg-stone-900/60 hover:bg-white dark:hover:bg-stone-900 border border-teal-500/30 text-teal-600 dark:text-teal-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <FileText size={15} />
            <span>تصدير ملف (.txt)</span>
          </button>
        </div>
      </div>

    </div>
  );
};

