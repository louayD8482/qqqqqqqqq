import React, { useState } from 'react';
import { Sparkles, Heart, X } from 'lucide-react';
import { AppAvatar } from './AppAvatar';
import { getSavedAvatar } from '../utils/avatarStorage';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl?: string;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, avatarUrl }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const activeAvatar = avatarUrl || getSavedAvatar();

  if (!isOpen) return null;

  const handleStart = () => {
    if (dontShowAgain) {
      localStorage.setItem('subha_welcome_dismissed', 'true');
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in duration-200 font-sans"
      dir="rtl"
    >
      {/* Container with Islamic Glow & Border - Compact iOS Proportions */}
      <div className="w-full max-w-[380px] bg-[#0b101c] rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden relative flex flex-col text-right max-h-[88vh]">
        
        {/* Header with Emerald Gradient & App Avatar */}
        <div className="relative bg-gradient-to-b from-[#094d2a] via-[#0b3b22] to-[#0b101c] p-4 sm:p-5 text-center text-white shrink-0 overflow-hidden">
          {/* Ambient light circles */}
          <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="إغلاق"
          >
            <X size={15} />
          </button>

          {/* Official App Avatar with Gold & Emerald Circular Halo */}
          <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-br from-amber-300 via-amber-500 to-emerald-600 shadow-xl mb-2.5 ring-2 ring-amber-400/30">
            <AppAvatar
              src={activeAvatar}
              alt="سبحة نور الإسلام"
              className="w-full h-full rounded-full"
              sizeClassName="w-full h-full"
              isCircle={true}
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-serif text-white tracking-wide">
            سبحة نور الإسلام
          </h2>
          <p className="text-[11px] sm:text-xs text-emerald-300/90 mt-0.5 font-medium">
            مسبحة إلكترونية مباركة لذكر الله تعالى
          </p>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3">
          
          {/* Quranic Verse Callout */}
          <div className="p-3 rounded-2xl bg-[#111928] border border-amber-500/25 text-center relative overflow-hidden">
            <p className="text-amber-400 font-serif font-bold text-sm sm:text-base leading-relaxed">
              «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
            </p>
            <p className="text-[10px] text-stone-400 mt-0.5 font-medium">
              سورة الرعد • آية ٢٨
            </p>
          </div>

          {/* Core Charity Dedication Message */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-[#0c2a1a] to-[#0e1d2c] border border-emerald-500/35 text-right space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
              <Heart size={13} className="fill-current text-emerald-400 shrink-0" />
              <span>مشروع خيري • صدقة جارية</span>
            </div>
            <p className="text-xs text-stone-200 leading-relaxed font-normal">
              صدقة جارية عن <strong className="text-white font-bold">لؤي بن حسين</strong> وعن <strong className="text-white font-bold">والده رحمه الله وغفر له</strong>.
            </p>
          </div>

          {/* Don't show again preference toggle */}
          <label className="flex items-center gap-2 text-xs text-stone-400 cursor-pointer pt-0.5 select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded border-stone-700 bg-[#162033] text-amber-500 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
            />
            <span>عدم إظهار هذه الرسالة الترحيبية تلقائياً</span>
          </label>

          {/* Action Button */}
          <button
            onClick={handleStart}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
          >
            <span>بِسْمِ اللَّهِ نَبْدَأُ التَّسْبِيح</span>
            <Sparkles size={15} />
          </button>

        </div>
      </div>
    </div>
  );
};
