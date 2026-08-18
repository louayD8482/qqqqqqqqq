import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, X, Sparkles, Check, Heart, BookOpen } from 'lucide-react';
import { playCompletionChime, triggerHapticFeedback } from '../utils/audio';
import { DhikrItem } from '../types';

interface GiftBannerProps {
  onAcceptGift?: (giftDhikr: DhikrItem) => void;
  isRTL: boolean;
}

// Daily spiritual gifts (Authentic Hadiths and high-reward Adhkar)
const DAILY_GIFTS = [
  {
    title: 'كنز من كنوز الجنة',
    titleEn: 'A Treasure from Paradise',
    hadith: '«لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ»',
    hadithEn: '"La hawla wa la quwwata illa billah"',
    meaning: 'كنز تحت العرش، دواء لتسعة وتسعين داء أيسرها الهمّ.',
    meaningEn: 'A treasure from beneath the Throne and a cure for 99 ailments.',
    target: 100,
    rewardCount: 100,
  },
  {
    title: 'تعدل ساعات من الذكر المتواصل',
    titleEn: 'Equals Hours of Continuous Dhikr',
    hadith: '«سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ»',
    hadithEn: '"Subhanallahi wa bihamdihi, \'adada khalqihi, wa rida nafsihi, wa zinata \'arshihi, wa midada kalimatih"',
    meaning: 'أعظم أذكار المضاعفة وزناً وأجراً كما علّم النبي ﷺ أم المؤمنين جويرية رضي الله عنها.',
    meaningEn: 'One of the most heavily rewarded forms of glorification taught by the Prophet ﷺ.',
    target: 3,
    rewardCount: 3,
  },
  {
    title: 'حبيبتان إلى الرحمن',
    titleEn: 'Beloved to the Most Merciful',
    hadith: '«سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ»',
    hadithEn: '"Subhanallahi wa bihamdihi, Subhanallahil-Azeem"',
    meaning: 'كلمتان خفيفتان على اللسان، ثقيلتان في الميزان، حبيبتان إلى الرحمن.',
    meaningEn: 'Two phrases light on the tongue, heavy on the scale, beloved to the Most Merciful.',
    target: 100,
    rewardCount: 100,
  },
  {
    title: 'مغفرة الذنوب وإن كانت مثل زبد البحر',
    titleEn: 'Forgiveness of all Sins',
    hadith: '«سُبْحَانَ اللَّهِ وَبِحَمْدِهِ»',
    hadithEn: '"Subhanallahi wa bihamdihi"',
    meaning: 'من قالها مائة مرة حين يصبح وحين يمسي حُطّت خطاياه وإن كانت مثل زبد البحر.',
    meaningEn: 'Whoever recites it 100 times will have their sins forgiven even if like the foam of the sea.',
    target: 100,
    rewardCount: 100,
  }
];

export const GiftBanner: React.FC<GiftBannerProps> = ({ onAcceptGift, isRTL }) => {
  // حالة للتحكم في ظهور أو إخفاء صندوق الهدايا
  const [showGift, setShowGift] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('hideGift') !== 'true';
  });

  // Modal to show the gift content once accepted
  const [isGiftRevealed, setIsGiftRevealed] = useState(false);
  const [giftIndex, setGiftIndex] = useState(0);

  useEffect(() => {
    // Pick today's gift based on day of month
    const day = new Date().getDate();
    setGiftIndex(day % DAILY_GIFTS.length);
  }, []);

  // إذا تم الضغط على "لا أريد"، نقوم بتغيير الحالة إلى false فيختفي العنصر تماماً
  const handleDismissGift = () => {
    setShowGift(false);
    // حفظ الخيار في الـ localStorage لكي لا تظهر مجدداً
    localStorage.setItem('hideGift', 'true');
  };

  // إذا تم الضغط على "نعم، أريد"، نفتح صندوق الهدية المباركة
  const handleAcceptGift = () => {
    triggerHapticFeedback([40, 50, 40]);
    playCompletionChime();
    setIsGiftRevealed(true);
  };

  const handleApplyGiftToCounter = () => {
    const gift = DAILY_GIFTS[giftIndex];
    if (onAcceptGift) {
      const newDhikrItem: DhikrItem = {
        id: `gift_${giftIndex}`,
        arabicText: gift.hadith,
        englishTranslation: gift.hadithEn,
        virtue: gift.meaning,
        defaultTarget: gift.target,
        category: 'daily',
      };
      onAcceptGift(newDhikrItem);
    }
    setIsGiftRevealed(false);
    setShowGift(false);
    localStorage.setItem('hideGift', 'true');
  };

  if (!showGift && !isGiftRevealed) return null; // لا تقم برسم العنصر أبداً إذا تم إخفاؤه

  const currentGift = DAILY_GIFTS[giftIndex];

  return (
    <>
      {/* 1. الشريط الرئيسي للهدية (Gift Banner) */}
      <AnimatePresence>
        {showGift && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="gift-container"
          >
            <div className="gift-content">
              <div className="flex items-center gap-2.5 w-full">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 flex-1 text-start">
                  {isRTL ? '🎁 لديك هدية ذكر جديدة اليوم! هل تريد استلامها؟' : '🎁 You have a new daily gift! Would you like to claim it?'}
                </span>
              </div>
              
              <div className="gift-buttons">
                <button className="btn-accept" onClick={handleAcceptGift}>
                  <Sparkles className="w-4 h-4 inline-block" />
                  <span>{isRTL ? 'نعم، أريد' : 'Claim Gift'}</span>
                </button>
                <button className="btn-reject" onClick={handleDismissGift}>
                  <X className="w-4 h-4 inline-block" />
                  <span>{isRTL ? 'لا أريد' : 'Dismiss'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. نافذة استلام الهدية المباركة (Gift Reveal Modal) */}
      <AnimatePresence>
        {isGiftRevealed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden relative"
            >
              {/* Top Accent Pattern */}
              <div className="h-2 w-full bg-gradient-to-r from-amber-400 via-emerald-500 to-teal-400" />

              <div className="p-6 text-center space-y-4">
                {/* Icon celebration */}
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-500 text-stone-950 flex items-center justify-center shadow-xl shadow-amber-500/30 border-2 border-amber-200">
                  <Gift className="w-8 h-8 animate-pulse" />
                </div>

                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20 mb-2">
                    {isRTL ? '✨ هدية اليوم المباركة' : '✨ Blessed Gift of the Day'}
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    {isRTL ? currentGift.title : currentGift.titleEn}
                  </h3>
                </div>

                {/* Hadith Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-b from-stone-50 to-amber-50/50 dark:from-stone-800/80 dark:to-emerald-950/20 border border-stone-200 dark:border-stone-700/80 space-y-2.5">
                  <p className="text-base sm:text-lg font-serif font-bold text-emerald-900 dark:text-emerald-300 leading-relaxed">
                    {currentGift.hadith}
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {isRTL ? currentGift.meaning : currentGift.meaningEn}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={handleApplyGiftToCounter}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isRTL ? 'ابدأ التسبيح به الآن في العداد' : 'Start Counting This Dhikr Now'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsGiftRevealed(false);
                      setShowGift(false);
                      localStorage.setItem('hideGift', 'true');
                    }}
                    className="w-full py-2.5 rounded-2xl text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium transition-all"
                  >
                    {isRTL ? 'حفظ وإغلاق' : 'Save & Close'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GiftBanner;
