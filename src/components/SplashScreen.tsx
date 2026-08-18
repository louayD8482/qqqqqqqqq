import React, { useEffect, useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { AppAvatar } from './AppAvatar';
import { getSavedAvatar } from '../utils/avatarStorage';

interface SplashScreenProps {
  onFinish: () => void;
  avatarUrl?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, avatarUrl }) => {
  const [fadeState, setFadeState] = useState<'entering' | 'visible' | 'exiting'>('entering');
  const activeAvatar = avatarUrl || getSavedAvatar();

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFadeState('visible');
    }, 40);

    const timer2 = setTimeout(() => {
      setFadeState('exiting');
    }, 1300);

    const timer3 = setTimeout(() => {
      onFinish();
    }, 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className={`fixed inset-0 z-[100] bg-[#070b13] flex flex-col items-center justify-center p-4 text-center select-none cursor-pointer transition-opacity duration-300 ease-out ${
        fadeState === 'exiting' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      dir="rtl"
    >
      {/* Ambient Lighting & Islamic Geometric Glow */}
      <div className="absolute w-72 h-72 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none -top-10" />
      <div className="absolute w-64 h-64 rounded-full bg-amber-500/15 blur-3xl pointer-events-none -bottom-10" />

      {/* Main Container - Compact iOS Proportion */}
      <div className="relative z-10 flex flex-col items-center animate-in zoom-in-95 duration-400 max-w-xs px-4">
        
        {/* Prominent Official App Circular Avatar - 4K High Definition */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-br from-amber-300 via-amber-500 to-emerald-600 shadow-2xl shadow-emerald-950/80 mb-4 ring-4 ring-amber-500/30">
          <div className="w-full h-full rounded-full overflow-hidden bg-[#090e18] relative shadow-inner p-0.5">
            <AppAvatar
              src={activeAvatar}
              alt="شعار سبحة نور الإسلام"
              className="w-full h-full rounded-full"
              sizeClassName="w-full h-full"
              isCircle={true}
            />
          </div>
          
          {/* Subtle Golden Sparkle Badge */}
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-stone-950 shadow-md border-2 border-[#070b13]">
            <Sparkles size={13} className="fill-stone-950" />
          </div>
        </div>

        {/* Application Title */}
        <h1 className="text-2xl font-black text-stone-100 font-serif tracking-wide mb-1 flex items-center gap-1.5">
          <span>سبحة نور الإسلام</span>
          <Sparkles className="text-amber-400 w-4 h-4" />
        </h1>

        <p className="text-xs text-emerald-400 font-medium mb-3">
          مسبحة إلكترونية مباركة • صدقة جارية
        </p>

        {/* Dedication Tag */}
        <div className="inline-flex items-center gap-1.5 bg-[#0b5c33]/30 border border-[#0b5c33]/60 text-[#22c55e] text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm">
          <Heart size={11} className="fill-current text-emerald-400" />
          <span>عن لؤي بن حسين ولوالده رحمه الله</span>
        </div>

        {/* Loading Indicator */}
        <div className="mt-5 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
