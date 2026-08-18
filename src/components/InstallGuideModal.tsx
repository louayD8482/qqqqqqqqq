import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, Download, Share2, PlusSquare, MoreVertical, CheckCircle2, ShieldCheck, Zap, WifiOff, Sparkles } from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRTL: boolean;
  deferredPrompt: any;
  onTriggerInstall: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  isRTL,
  deferredPrompt,
  onTriggerInstall,
}) => {
  const [activeTab, setActiveTab] = useState<'iphone' | 'galaxy'>('iphone');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-gradient-to-r from-emerald-600/10 via-teal-500/10 to-amber-500/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 border border-emerald-400/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                {isRTL ? 'تثبيت سُبحة على الآيفون والجالكسي' : 'Install on iPhone & Galaxy'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isRTL ? 'يعمل كتطبيق هاتف أصلي بدون شريط المتصفح وبدون إنترنت' : 'Runs like a native mobile app completely offline'}
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

        {/* Device Switcher Tabs */}
        <div className="p-3 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 flex gap-2">
          <button
            onClick={() => setActiveTab('iphone')}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'iphone'
                ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-md border border-stone-200/80 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <span></span>
            <span>{isRTL ? 'آيفون و iPad' : 'Apple iPhone & iPad'}</span>
          </button>
          <button
            onClick={() => setActiveTab('galaxy')}
            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'galaxy'
                ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-md border border-stone-200/80 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <span>📱</span>
            <span>{isRTL ? 'سامسونج جالكسي وأندرويد' : 'Samsung Galaxy & Android'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'iphone' ? (
            <div className="space-y-3.5">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  {isRTL
                    ? 'في الآيفون: افتح الرابط في متصفح Safari لإضافته في ثوانٍ'
                    : 'On iPhone: Open this link in Safari browser to add to home screen'}
                </span>
              </div>

              {/* iPhone Steps */}
              <div className="space-y-2.5">
                {/* Step 1 */}
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <span>{isRTL ? 'اضغط على زر المشاركة' : 'Tap the Share Button'}</span>
                      <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      {isRTL
                        ? 'موجود في أسفل شاشة متصفح Safari (أيقونة المربع مع السهم للأعلى ⬆️)'
                        : 'Located in Safari bottom toolbar (Square with up arrow ⬆️)'}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <span>{isRTL ? 'اختر «إضافة إلى الشاشة الرئيسية»' : 'Choose "Add to Home Screen"'}</span>
                      <PlusSquare className="w-4 h-4 text-amber-500" />
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      {isRTL
                        ? 'مرر قائمة الخيارات لأسفل حتى تجد «Add to Home Screen ➕»'
                        : 'Scroll down the share sheet and tap "Add to Home Screen ➕"'}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {isRTL ? 'اضغط «إضافة» (Add)' : 'Tap "Add" in Top Right'}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      {isRTL
                        ? 'سيظهر تطبيق «سُبحة» بأيقونته الخضراء والذهبية على شاشتك الرئيسية ويعمل كبرنامج كامل!'
                        : 'Subha will be installed to your home screen with no browser address bars!'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {/* Direct 1-Click Install Button for Android if browser supports it */}
              {deferredPrompt && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-700/20 text-center space-y-2">
                  <h4 className="text-sm font-bold">
                    {isRTL ? 'جهازك يدعم التثبيت المباشر بنقرة واحدة!' : 'Direct 1-Click Install Ready!'}
                  </h4>
                  <p className="text-xs text-emerald-100">
                    {isRTL ? 'اضغط أدناه لتثبيت التطبيق فوراً على هاتف الجالكسي' : 'Click below to install immediately to your Samsung Galaxy'}
                  </p>
                  <button
                    onClick={() => {
                      onTriggerInstall();
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isRTL ? 'تثبيت الآن على الجالكسي' : 'Install on Galaxy Now'}</span>
                  </button>
                </div>
              )}

              {/* Galaxy Steps */}
              <div className="space-y-2.5">
                {/* Step 1 */}
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <span>{isRTL ? 'اضغط قائمة الثلاث نقاط (⋮)' : 'Tap Menu (⋮)'}</span>
                      <MoreVertical className="w-4 h-4 text-emerald-600" />
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      {isRTL
                        ? 'في متصفح Chrome أو Samsung Internet أعلى/أسفل الشاشة'
                        : 'In Chrome or Samsung Internet browser menu'}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <span>{isRTL ? 'اختر «تثبيت التطبيق» أو «إضافة للشاشة الرئيسية»' : 'Select "Install app" or "Add to Home"'}</span>
                      <Download className="w-4 h-4 text-teal-600" />
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      {isRTL
                        ? 'أو اضغط أيقونة التثبيت (⬇️) في شريط العنوان'
                        : 'Or tap the install icon (⬇️) in the address bar'}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {isRTL ? 'جاهز واستمتع بالتطبيق' : 'Done & Ready'}
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      {isRTL
                        ? 'يعمل التطبيق بدون اتصال بالإنترنت مع دعم الاهتزاز واللمس السريع'
                        : 'Opens instantly with native haptic vibration and offline storage'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feature Highlights on Mobile */}
          <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200/70 dark:border-stone-700/70">
            <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-2">
              {isRTL ? 'مميزات التطبيق على الهاتف:' : 'Mobile Advantages:'}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 dark:text-stone-300">
              <div className="flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isRTL ? '١٠٠٪ بدون إنترنت' : '100% Offline'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>{isRTL ? 'فتح فوري وسريع' : 'Instant Launch'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>{isRTL ? 'حفظ تلقائي للعدد' : 'Auto Saves Count'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                <span>{isRTL ? 'بدون شريط متصفح' : 'Full Screen Native'}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
