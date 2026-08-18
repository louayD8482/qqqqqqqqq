import React, { useState } from 'react';
import { 
  Sparkles, Award, Download, Copy, Check, 
  Share2, FileText, Image as ImageIcon, Loader2 
} from 'lucide-react';
import subhaEmblemImg from '../assets/images/subha_icon.jpg';
import { 
  downloadStatsCardImage, 
  downloadTextReport, 
  shareStatsCard,
  StatsExportData 
} from '../utils/statsExport';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalToday: number;
  roundsCompleted: number;
  streakDays: number;
  dailyHistory?: Record<string, number>;
  currentDhikrTitle?: string;
  triggerNotification: (msg: string) => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  totalToday,
  roundsCompleted,
  streakDays,
  dailyHistory = {},
  currentDhikrTitle = 'سبحان الله وبحمده',
  triggerNotification,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  if (!isOpen) return null;

  const exportData: StatsExportData = {
    totalToday,
    roundsCompleted,
    streakDays,
    dailyHistory,
    currentDhikrTitle,
  };

  // Calculate 7-day total for display
  let weeklyTotal = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    weeklyTotal += dailyHistory[iso] || (i === 0 ? totalToday : 0);
  }

  const shareText = `الحمد لله رب العالمين 📿✨\nأتممت اليوم ${totalToday.toLocaleString('ar-SA')} تسبيحة وذكر في تطبيق (سبحة نور الإسلام).\n• إجمالي الأسبوع: ${weeklyTotal.toLocaleString('ar-SA')} تسبيحة\n• سلسلة المواظبة: ${streakDays} أيام متتالية\n«مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لا يَذْكُرُ رَبَّهُ، مَثَلُ الحَيِّ وَالمَيِّتِ»\n#تسبيح #أذكار #سبحة_نور_الإسلام`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    triggerNotification('تم نسخ نص الإنجاز جاهزاً للمشاركة 📋✨');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = async () => {
    try {
      setIsGeneratingImage(true);
      triggerNotification('جاري تصميم وتنزيل بطاقة الإنجاز كصورة 4K... 🖼️');
      await downloadStatsCardImage(exportData);
      triggerNotification('تم تنزيل بطاقة الإنجاز كصورة PNG بنجاح! 🖼️🎉');
    } catch (e) {
      console.error(e);
      triggerNotification('تعذر إنشاء الصورة، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadText = () => {
    try {
      triggerNotification('جاري تنزيل تقرير الإحصائيات النصي (.txt)... 📄');
      downloadTextReport(exportData);
      triggerNotification('تم تنزيل ملف التقرير النصي بنجاح! 📄🎉');
    } catch (e) {
      console.error(e);
      triggerNotification('تعذر إنشاء الملف النصي.');
    }
  };

  const handleNativeShare = async () => {
    setIsGeneratingImage(true);
    const shared = await shareStatsCard(exportData, handleCopyText);
    setIsGeneratingImage(false);
    if (shared) {
      triggerNotification('تم فتح نافذة المشاركة بنجاح 📲✨');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-[#0c1220] rounded-3xl border border-amber-500/40 p-5 sm:p-6 space-y-4 shadow-2xl relative select-none max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center justify-center font-bold text-sm cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center space-y-0.5">
          <h3 className="font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center justify-center gap-1.5">
            <Sparkles size={18} className="text-amber-500" />
            <span>مشاركة وتصدير الإحصائيات</span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            شارك ثواب وردك اليومي والأسبوعي لتشجيع غيرك على الذكر
          </p>
        </div>

        {/* Visual Shareable Badge Preview */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-950 via-stone-900 to-amber-950 border-2 border-amber-400/80 shadow-2xl text-center space-y-3 relative overflow-hidden">
          {/* Subtle Islamic Arc background */}
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

          {/* Logo & Title */}
          <div className="flex items-center justify-center gap-2">
            <img 
              src={subhaEmblemImg} 
              alt="سبحة نور الإسلام" 
              className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover shadow-md"
              loading="eager"
            />
            <div className="text-right">
              <h4 className="font-bold text-sm text-stone-100 leading-tight">سبحة نور الإسلام</h4>
              <p className="text-[10px] text-amber-400 font-medium">بطاقة الأجر اليومية والأسبوعية</p>
            </div>
          </div>

          <div className="py-2 border-y border-amber-500/20">
            <span className="text-[11px] text-stone-300 font-bold block mb-0.5">
              مجموع تسبيحات وذكر اليوم
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400">
              {totalToday.toLocaleString('ar-SA')}
            </div>
            <span className="text-[10px] sm:text-[11px] text-emerald-400 font-bold">تسبيحة وتهليلة واستغفار</span>
          </div>

          {/* Sub Stats Grid (Today, Weekly, Streak) */}
          <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[9px] text-stone-400 block">الدورات</span>
              <span className="font-bold text-emerald-400 font-mono text-xs sm:text-sm">{roundsCompleted}</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[9px] text-stone-400 block">الأسبوع</span>
              <span className="font-bold text-amber-300 font-mono text-xs sm:text-sm">{weeklyTotal.toLocaleString('ar-SA')}</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[9px] text-stone-400 block">المواظبة</span>
              <span className="font-bold text-rose-400 font-mono text-xs sm:text-sm">{streakDays} أيام</span>
            </div>
          </div>

          {/* Ayah or Hadith Footer */}
          <p className="text-[10px] sm:text-[11px] font-serif text-stone-300 italic pt-0.5">
            «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
          </p>
        </div>

        {/* 4 Action Export Buttons */}
        <div className="space-y-2 pt-1">
          
          {/* Main Primary Share */}
          <button
            onClick={handleNativeShare}
            disabled={isGeneratingImage}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
          >
            {isGeneratingImage ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
            <span>مشاركة البطاقة مع الأصدقاء (واتساب / تواصل)</span>
          </button>

          {/* Export as Image & Export as Text File */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleDownloadImage}
              disabled={isGeneratingImage}
              className="py-2.5 px-3 rounded-2xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <ImageIcon size={15} />
              <span>تنزيل كصورة (PNG)</span>
            </button>

            <button
              onClick={handleDownloadText}
              className="py-2.5 px-3 rounded-2xl bg-teal-600/15 hover:bg-teal-600/25 border border-teal-500/40 text-teal-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              <FileText size={15} />
              <span>تقرير نصي (.txt)</span>
            </button>
          </div>

          {/* Copy Text Button */}
          <button
            onClick={handleCopyText}
            className="w-full py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
            <span>{copied ? 'تم نسخ النص بنجاح!' : 'نسخ نص الإحصائيات'}</span>
          </button>

        </div>

      </div>
    </div>
  );
};

