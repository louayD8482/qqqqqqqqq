import React, { useState, useRef } from 'react';
import { Sparkles, Upload, Image as ImageIcon, RotateCcw, Check, X, ShieldCheck } from 'lucide-react';
import { AppAvatar } from './AppAvatar';
import { PRESET_AVATARS, DEFAULT_AVATAR_URL, saveCustomAvatar, resetToDefaultAvatar } from '../utils/avatarStorage';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onAvatarChange: (newAvatarUrl: string) => void;
  onNotify: (message: string) => void;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  onAvatarChange,
  onNotify,
}) => {
  const [selectedPreview, setSelectedPreview] = useState<string>(currentAvatar);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onNotify('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP) 📷');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      if (base64Data) {
        setSelectedPreview(base64Data);
        saveCustomAvatar(base64Data);
        onAvatarChange(base64Data);
        setIsUploading(false);
        onNotify('تم رفع وحفظ صورتك الشخصية كأفتار للتطبيق بنجاح! 🎉✨');
      }
    };
    reader.onerror = () => {
      setIsUploading(false);
      onNotify('حدث خطأ أثناء قراءة الصورة، يرجى المحاولة مرة أخرى.');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (url: string, name: string) => {
    setSelectedPreview(url);
    saveCustomAvatar(url);
    onAvatarChange(url);
    onNotify(`تم تطبيق أفتار: ${name} ✨`);
  };

  const handleResetDefault = () => {
    resetToDefaultAvatar();
    setSelectedPreview(DEFAULT_AVATAR_URL);
    onAvatarChange(DEFAULT_AVATAR_URL);
    onNotify('تمت استعادة الشعار والأفتار الرسمي للسبحة 📿✨');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 font-sans select-none" dir="rtl">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#101a2d] to-[#0a101d] text-white rounded-3xl border-2 border-amber-400/70 p-5 sm:p-6 space-y-4 shadow-2xl shadow-emerald-950/80 relative text-center max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-colors z-10"
          title="إغلاق"
        >
          <X size={16} />
        </button>

        {/* Header Title */}
        <div className="pt-1">
          <h3 className="text-xl sm:text-2xl font-bold text-amber-300 font-serif flex items-center justify-center gap-2">
            <span>أفتار وهوية التطبيق</span>
            <Sparkles size={18} className="text-amber-400 fill-amber-400" />
          </h3>
          <p className="text-[11px] text-emerald-400 font-bold mt-0.5">
            عرض وتخصيص صورة الشعار والأفتار بدقة 4K الفائقة 📿
          </p>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto space-y-4 pr-1 pl-1">
          
          {/* Main 4K Avatar Display (Circular Emblem) */}
          <div className="relative mx-auto w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden shadow-2xl border-4 border-amber-400/90 ring-4 ring-emerald-500/40 group bg-[#070d18] p-1">
            <AppAvatar
              src={selectedPreview}
              alt="أفتار التطبيق 4K"
              className="w-full h-full rounded-full"
              sizeClassName="w-full h-full"
              isCircle={true}
            />
            {/* 4K Badge */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-amber-300">
              <Sparkles size={10} />
              <span>4K ULTRA HD</span>
            </div>
          </div>

          {/* Upload Custom Image Button */}
          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer border border-emerald-400/30"
            >
              <Upload size={16} />
              <span>{isUploading ? 'جاري رفع الصورة...' : 'رفع صورة مخصصة من جهازك 📷'}</span>
            </button>
            <p className="text-[10px] text-stone-400">
              يمكنك اختيار أي صورة من الاستوديو لتصبح أفتار التطبيق الرئيسي
            </p>
          </div>

          {/* Preset Avatars Selection */}
          <div className="bg-[#121c2e] p-3 rounded-2xl border border-gray-700/60 text-right space-y-2">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <ImageIcon size={13} />
              <span>أو اختر من تصاميم الأفتار الإسلامية الفاخرة:</span>
            </span>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {PRESET_AVATARS.map((preset) => {
                const isSelected = selectedPreview === preset.url;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.url, preset.name)}
                    className={`p-2 rounded-xl border flex flex-col items-center text-center gap-1.5 transition cursor-pointer relative ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/20 shadow-md shadow-amber-500/10'
                        : 'border-gray-700/80 bg-[#0d1624] hover:bg-[#16233a]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-400/40 p-0.5 bg-[#080d16]">
                      <AppAvatar
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full rounded-full"
                        sizeClassName="w-full h-full"
                        isCircle={true}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-stone-200 line-clamp-1">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 left-1 bg-amber-400 text-stone-950 rounded-full p-0.5 shadow">
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reset to Default */}
          <button
            onClick={handleResetDefault}
            className="w-full py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700/80 border border-stone-600/40 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>استعادة الأفتار الرسمي الأصلي</span>
          </button>

          {/* Hadith Note */}
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 text-center">
            <p className="text-[11px] text-amber-200/90 font-serif leading-relaxed">
              «مَثَلُ الَّذِي يَذْكُرُ رَبَّهُ وَالَّذِي لا يَذْكُرُ رَبَّهُ، مَثَلُ الحَيِّ وَالمَيِّتِ»
            </p>
          </div>

        </div>

        {/* Bottom Done Button */}
        <div className="pt-1">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/30 active:scale-98 transition cursor-pointer"
          >
            تم • العودة للتسبيح المبارك
          </button>
        </div>

      </div>
    </div>
  );
};
