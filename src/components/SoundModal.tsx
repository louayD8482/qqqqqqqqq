import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Volume1, 
  Sparkles, 
  X, 
  Check, 
  Play, 
  Smartphone, 
  BellRing,
  Music,
  CheckCircle2
} from 'lucide-react';
import { 
  CustomSoundMode, 
  SOUND_OPTIONS, 
  playBeadSound, 
  playCompletionChime, 
  getSavedSoundVolume, 
  saveSoundVolume, 
  triggerHapticFeedback 
} from '../utils/audio';

interface SoundModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSound: CustomSoundMode;
  onSelectSound: (sound: CustomSoundMode) => void;
  vibrationEnabled: boolean;
  onToggleVibration: (enabled: boolean) => void;
  onShowNotification: (msg: string) => void;
}

export const SoundModal: React.FC<SoundModalProps> = ({
  isOpen,
  onClose,
  currentSound,
  onSelectSound,
  vibrationEnabled,
  onToggleVibration,
  onShowNotification
}) => {
  const [selectedMode, setSelectedMode] = useState<CustomSoundMode>(currentSound);
  const [volume, setVolume] = useState<number>(() => getSavedSoundVolume());
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePreviewSound = (mode: CustomSoundMode, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPlayingPreview(mode);
    playBeadSound(mode, volume);
    if (vibrationEnabled) {
      triggerHapticFeedback(25);
    }
    setTimeout(() => {
      setPlayingPreview(null);
    }, 400);
  };

  const handleSelect = (mode: CustomSoundMode) => {
    setSelectedMode(mode);
    handlePreviewSound(mode);
  };

  const handleSave = () => {
    onSelectSound(selectedMode);
    saveSoundVolume(volume);
    const selectedMeta = SOUND_OPTIONS.find(s => s.mode === selectedMode);
    onShowNotification(`تم اعتماد: ${selectedMeta?.name || 'الصوت المختار'} بنجاح 📿`);
    onClose();
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    saveSoundVolume(newVol);
    playBeadSound(selectedMode, newVol);
  };

  const handlePreviewChime = () => {
    playCompletionChime(volume);
    triggerHapticFeedback([40, 30, 60, 30, 90]);
    onShowNotification('نغمة إتمام الورد والتكبير المباركة 🎵✨');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#0b121e] border-2 border-amber-500/40 rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden text-stone-100"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800/90 flex items-center justify-between bg-gradient-to-r from-[#121c2d] via-[#101927] to-[#0c1421]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#0e1624] flex items-center justify-center text-amber-400">
                <Volume2 size={20} className="drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-base sm:text-lg font-bold text-white font-serif flex items-center gap-1.5">
                <span>أصوات ونغمات السبحة</span>
                <Sparkles size={14} className="text-amber-400" />
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-400/80">
                اختر نغمة التسبيح المريحة لنفسك
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
            title="إغلاق"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Sound List & Settings */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-3.5 flex-1 pr-2 pl-2">

          {/* Volume Control Bar */}
          <div className="bg-[#121a29] border border-gray-800 rounded-2xl p-3 sm:p-3.5 space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-1.5 text-stone-200">
                {volume === 0 ? (
                  <VolumeX size={16} className="text-red-400" />
                ) : volume < 0.5 ? (
                  <Volume1 size={16} className="text-amber-400" />
                ) : (
                  <Volume2 size={16} className="text-amber-400" />
                )}
                <span>مستوى صوت التسبيح</span>
              </div>
              <span className="text-amber-400 font-mono font-bold text-xs bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                {Math.round(volume * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <button
                type="button"
                onClick={() => handlePreviewSound(selectedMode)}
                className="shrink-0 px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                title="استماع فوري"
              >
                <Play size={10} className="fill-amber-300" />
                <span>تجربة</span>
              </button>
            </div>
          </div>

          {/* Sound Modes Grid */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1 text-xs font-bold text-gray-400">
              <span>خيارات أصوات حبات السبحة (8 أصوات واقعية):</span>
              <span className="text-[10px] text-amber-400/70">اضغط للاختيار والتجربة</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {SOUND_OPTIONS.map((item) => {
                const isSelected = selectedMode === item.mode;
                const isPlaying = playingPreview === item.mode;

                return (
                  <div
                    key={item.mode}
                    onClick={() => handleSelect(item.mode)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 relative group select-none active:scale-[0.99] ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#17263c] to-[#121f33] border-amber-400/90 shadow-md shadow-amber-500/10 ring-1 ring-amber-400/40'
                        : 'bg-[#0f1725] border-gray-800 hover:border-gray-700 hover:bg-[#141e30]'
                    }`}
                  >
                    {/* Left: Icon and Details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-transform ${
                        isSelected 
                          ? 'bg-amber-400/20 border border-amber-400/50 scale-105' 
                          : 'bg-[#152033] border border-gray-700/60'
                      }`}>
                        <span>{item.icon}</span>
                      </div>

                      <div className="text-right min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-xs sm:text-sm font-bold truncate ${
                            isSelected ? 'text-amber-300' : 'text-stone-200'
                          }`}>
                            {item.name}
                          </h3>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-400 border border-gray-700 font-medium">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 truncate mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Play preview button */}
                      <button
                        type="button"
                        onClick={(e) => handlePreviewSound(item.mode, e)}
                        className={`min-w-[34px] min-h-[34px] rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          isPlaying
                            ? 'bg-amber-400 text-stone-950 scale-110 shadow-lg'
                            : 'bg-gray-800 hover:bg-gray-700 text-amber-300 hover:text-amber-200 border border-gray-700'
                        }`}
                        title={`استماع لصوت ${item.name}`}
                      >
                        <Play size={12} className={isPlaying ? 'fill-stone-950' : 'fill-amber-300'} />
                      </button>

                      {/* Selection Indicator */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-amber-400 text-stone-950 shadow-md' 
                          : 'border border-gray-700 text-transparent'
                      }`}>
                        <Check size={14} className={isSelected ? 'text-stone-950 stroke-[3]' : 'opacity-0'} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Audio Preferences */}
          <div className="bg-[#0e1624] border border-gray-800/80 rounded-2xl p-3 space-y-2.5">
            <h4 className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <Music size={14} className="text-amber-400" />
              <span>مؤثرات إضافية عند التسبيح:</span>
            </h4>

            {/* Completion Melody */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#131d2e] border border-gray-800">
              <div className="flex items-center gap-2">
                <BellRing size={16} className="text-emerald-400" />
                <div className="text-right">
                  <div className="text-xs font-bold text-stone-200">نغمة إتمام الورد (التكبير المبشر)</div>
                  <div className="text-[10px] text-gray-400">نغمة عذبة تُعزف تلقائياً عند إتمام 33 أو 100 تسبيحة</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handlePreviewChime}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Play size={11} className="fill-emerald-300" />
                <span>استماع</span>
              </button>
            </div>

            {/* Vibration Sync */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#131d2e] border border-gray-800">
              <div className="flex items-center gap-2">
                <Smartphone size={16} className="text-amber-400" />
                <div className="text-right">
                  <div className="text-xs font-bold text-stone-200">الاهتزاز اللمسي المتزامن (Haptic)</div>
                  <div className="text-[10px] text-gray-400">نبضة لمسية خفيفة مع كل نقرة صوتية</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newVal = !vibrationEnabled;
                  onToggleVibration(newVal);
                  if (newVal) triggerHapticFeedback(30);
                  onShowNotification(newVal ? 'تم تفعيل الاهتزاز 📳' : 'تم إيقاف الاهتزاز 📴');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shrink-0 ${
                  vibrationEnabled
                    ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-sm'
                    : 'bg-gray-800 text-gray-400 border-gray-700'
                }`}
              >
                {vibrationEnabled ? 'مفعّل 📳' : 'معطّل 📴'}
              </button>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-gray-800/90 bg-[#0e1624] flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]"
          >
            <CheckCircle2 size={18} />
            <span>حفظ واعتماد صوت التسبيح</span>
          </button>
        </div>

      </div>
    </div>
  );
};
