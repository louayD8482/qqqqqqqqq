import React, { useState } from 'react';
import { Share2, Sparkles, X, Heart, RotateCcw, MessageSquare, ExternalLink, HelpCircle, Download, FolderArchive, Loader2, Bell, Image as ImageIcon } from 'lucide-react';
import { IslamicQuote } from '../data/islamicQuotes';
import { requestNotificationPermission, sendLocalNotification } from '../utils/nativeNotifications';
import { AppAvatar } from './AppAvatar';
import { getSavedAvatar } from '../utils/avatarStorage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerNotification: (msg: string) => void;
  currentQuote?: IslamicQuote;
  onRefreshQuote?: () => void;
  onOpenWelcome?: () => void;
  avatarUrl?: string;
  onOpenAvatarModal?: () => void;
  onOpenSoundModal?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  triggerNotification,
  currentQuote,
  onRefreshQuote,
  onOpenWelcome,
  avatarUrl,
  onOpenAvatarModal,
  onOpenSoundModal,
}) => {
  const activeAvatar = avatarUrl || getSavedAvatar();
  if (!isOpen) return null;

  const [isExportingZip, setIsExportingZip] = useState(false);

  const handleDownloadZip = () => {
    try {
      setIsExportingZip(true);
      triggerNotification('جاري تنزيل ملف المشروع الشامل (app-complete.zip)... 📦');
      
      const a = document.createElement('a');
      a.href = `/app-complete.zip?t=${Date.now()}`;
      a.setAttribute('download', 'app-complete.zip');
      a.setAttribute('target', '_blank');
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
        setIsExportingZip(false);
        triggerNotification('تم بدء تنزيل ملف app-complete.zip بنجاح! 🎉📦');
      }, 1200);
    } catch (err) {
      console.error(err);
      setIsExportingZip(false);
      triggerNotification('يرجى استخدام خيار التصدير من القائمة.');
    }
  };

  const handleShareApp = async () => {
    const shareData = {
      title: 'تطبيق سبحة نور الإسلام',
      text: 'تطبيق مسبحة نور الإسلام - صدقة جارية عن لؤي بن حسين وعن والده رحمه الله وغفر له، أنصحكم باستخدامه والتسبيح به:',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fallback or user cancelled
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      triggerNotification('تم نسخ رابط التطبيق بنجاح! 📋✨');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans select-none animate-in fade-in duration-200" dir="rtl">
      
      {/* الحاوية الأساسية للنافذة */}
      <div className="bg-[#0f1624] border border-[#212e45] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative text-right max-h-[90vh] flex flex-col">
        
        {/* شريط العنوان العلوي */}
        <div className="bg-[#0b5c33] px-6 py-4 flex items-center justify-between shrink-0">
          {/* زر إغلاق النافذة (X) */}
          <button 
            onClick={onClose}
            className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
            title="إغلاق النافذة"
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* عنوان النافذة مع الأيقونة */}
          <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg">
            <span>إعدادات ومعلومات التطبيق</span>
            <span className="text-amber-400">✨</span>
          </div>
        </div>

        {/* محتوى النافذة القابل للتمرير */}
        <div className="p-5 sm:p-6 flex flex-col items-center text-center overflow-y-auto space-y-4">
          
          {/* شعار وأفتار التطبيق الفاخر الدائري */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-xl border-2 border-amber-400/80 ring-4 ring-emerald-500/30 mb-0.5 bg-[#0a111e] p-0.5">
            <AppAvatar
              src={activeAvatar}
              alt="شعار سبحة نور الإسلام"
              className="w-full h-full rounded-full"
              sizeClassName="w-full h-full"
              isCircle={true}
            />
          </div>

          {/* زر تخصيص ورفع صورة الأفتار */}
          {onOpenAvatarModal && (
            <button
              onClick={() => {
                onClose();
                onOpenAvatarModal();
              }}
              className="py-1.5 px-3.5 rounded-full bg-[#18263d] hover:bg-[#223554] border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95"
            >
              <ImageIcon size={12} />
              <span>تغيير / رفع صورة الأفتار 📷✨</span>
            </button>
          )}

          {/* شارة صدقة جارية */}
          <span className="bg-[#0b5c33]/30 text-[#22c55e] text-xs font-bold px-4 py-1.5 rounded-full border border-[#0b5c33]/50 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-current text-emerald-400" />
            <span>صدقة جارية</span>
          </span>

          {/* اسم التطبيق */}
          <h2 className="text-2xl font-black text-[#22c55e] font-serif">سبحة نور الإسلام</h2>

          {/* النص الخيري والتوضيحي */}
          <p className="text-gray-300 text-xs sm:text-sm leading-relaxed px-2 font-medium">
            صدقة جارية بإذن الله عن <strong className="text-white">لؤي بن حسين</strong> وعن <strong className="text-white">والده رحمه الله وغفر له</strong> ولجميع المسلمين والمسلمات الأحياء منهم والأموات.
          </p>

          {/* زر عرض الرسالة الترحيبية والتعريفية */}
          {onOpenWelcome && (
            <button
              onClick={() => {
                onClose();
                onOpenWelcome();
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <HelpCircle size={15} />
              <span>عرض الرسالة الترحيبية ودليل الاستخدام 📖</span>
            </button>
          )}

          {/* بطاقة الآية الكريمة / الحديث النبوي الشريف داخل الإعدادات */}
          {currentQuote && (
            <div className="w-full p-4 rounded-2xl bg-[#090f1a] border border-amber-500/30 text-center relative group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-amber-400/90 flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-400" />
                  <span>آية وحديث اليوم</span>
                </span>
                {onRefreshQuote && (
                  <button
                    onClick={() => {
                      onRefreshQuote();
                      triggerNotification('تم تحديث الآية / الحديث ✨');
                    }}
                    className="p-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-400 hover:text-amber-400 transition-colors text-[10px] flex items-center gap-1 cursor-pointer"
                    title="تغيير الآية / الحديث"
                  >
                    <RotateCcw size={11} />
                    <span>تغيير</span>
                  </button>
                )}
              </div>
              <p className="font-serif font-bold text-stone-100 text-sm sm:text-base leading-relaxed">
                «{currentQuote.text.replace(/^[«"]|[»"]$/g, '')}»
              </p>
              <p className="text-[11px] text-amber-400/90 font-medium mt-2">
                — {currentQuote.source}
              </p>
            </div>
          )}

          {/* قسم خاص: عن التطبيق والتواصل */}
          <div className="w-full p-4 rounded-2xl bg-[#121c2e] border border-[#223554] text-right space-y-3">
            <div className="flex items-center justify-between border-b border-gray-700/60 pb-2">
              <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <MessageSquare size={14} />
                <span>عن التطبيق والتواصل</span>
              </h3>
              <span className="text-[10px] text-gray-400 font-mono">v1.2</span>
            </div>

            {/* معلومات المطور */}
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span className="text-gray-400">مطور التطبيق:</span>
              <span className="text-amber-400 font-bold">لؤي بن حسين</span>
            </div>

            {/* أزرار المشاركة والتواصل والتحميل المدمجة معاً */}
            <div className="space-y-2.5 pt-1">
              {/* زر تخصيص أصوات السبحة */}
              {onOpenSoundModal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenSoundModal();
                  }}
                  className="w-full bg-[#1b2a42] hover:bg-[#253a5c] text-amber-300 hover:text-amber-200 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-amber-500/40 shadow-md active:scale-98 cursor-pointer text-xs sm:text-sm"
                >
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>تخصيص أصوات ونغمات السبحة (8 أصوات) 🔊</span>
                </button>
              )}

              {/* زر تفعيل إشعارات وتذكيرات التسبيح اليومية */}
              <button 
                onClick={async () => {
                  const granted = await requestNotificationPermission();
                  if (granted) {
                    sendLocalNotification('سبحة نور الإسلام 📿✨', {
                      body: 'تم تفعيل التنبيهات اليومية بنجاح! قال رسول الله ﷺ: «ألا بذكر الله تطمئن القلوب».',
                    });
                    triggerNotification('تم تفعيل إذن التنبيهات اليومية بنجاح! 🔔✨');
                  } else {
                    triggerNotification('يرجى السماح بالتنبيهات من إعدادات المتصفح/الجهاز.');
                  }
                }}
                className="w-full bg-[#1b2537] hover:bg-[#233148] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-amber-500/30 shadow-md active:scale-98 cursor-pointer text-xs sm:text-sm"
              >
                <Bell className="h-4 w-4 text-amber-400" />
                <span>تفعيل التنبيهات والأذكار اليومية 🔔</span>
              </button>

              {/* زر تحميل المشروع بالكامل بصيغة ZIP المخصص لـ iOS و Android */}
              <button 
                onClick={handleDownloadZip}
                disabled={isExportingZip}
                className="w-full bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-500 disabled:opacity-60 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-emerald-400/40 shadow-lg shadow-emerald-950/40 active:scale-98 cursor-pointer text-xs sm:text-sm text-center"
                title="تنزيل جميع ملفات المشروع والأكواد بالكامل لتوليد APK للأندرويد و IPA للآيفون"
              >
                {isExportingZip ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-200" />
                    <span>جاري تجهيز حزمة iOS & Android...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 text-emerald-200 shrink-0" />
                    <span>تحميل مشروع التطبيق الشامل (iOS & Android) 📦</span>
                  </>
                )}
              </button>

              {/* زر مشاركة التطبيق */}
              <button 
                onClick={handleShareApp} 
                className="w-full bg-[#1b2537] hover:bg-[#233148] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-gray-700/80 shadow-md active:scale-98 cursor-pointer text-xs sm:text-sm"
              >
                <Share2 className="h-4 w-4 text-amber-400" />
                <span>مشاركة التطبيق مع الأصدقاء</span>
              </button>

              {/* زر تابعني على سناب شات */}
              <a 
                href="https://snapchat.com/t/0TR6EleV" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-gray-950 font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-98 cursor-pointer text-xs sm:text-sm"
              >
                <span>تابعني على سناب شات</span>
                <span className="text-lg">👻</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
