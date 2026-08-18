import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, Volume2, Copy, Check, Bookmark, Play, Pause } from 'lucide-react';
import { SURAHS_DATABASE, SurahItem } from '../data/islamicContent';

interface QuranSectionProps {
  onCopy: (text: string, id: number) => void;
  copiedId: number | null;
  triggerNotification: (msg: string) => void;
  isRTL: boolean;
}

export const QuranSection: React.FC<QuranSectionProps> = ({
  onCopy,
  copiedId,
  triggerNotification,
  isRTL,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<SurahItem>(SURAHS_DATABASE[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [bookmarkedSurahs, setBookmarkedSurahs] = useState<number[]>([1, 18, 67]);

  // Quick ayah lookup
  const [surahNumInput, setSurahNumInput] = useState('');
  const [ayahNumInput, setAyahNumInput] = useState('');
  const [lookupResult, setLookupResult] = useState<string | null>(null);

  const filteredSurahs = SURAHS_DATABASE.filter(
    (s) =>
      s.name.includes(searchQuery) ||
      s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.number).includes(searchQuery)
  );

  const handleLookup = () => {
    const sNum = parseInt(surahNumInput, 10);
    const found = SURAHS_DATABASE.find((s) => s.number === sNum);
    if (found) {
      setSelectedSurah(found);
      setLookupResult(`سورة ${found.name} (الآية ${ayahNumInput || '1'}): ${found.sampleVerse}`);
      triggerNotification(isRTL ? `تم الانتقال لسورة ${found.name} 📖` : `Opened Surah ${found.englishName}`);
    } else {
      triggerNotification(isRTL ? 'يرجى اختيار رقم سورة بين 1 و 114' : 'Please choose a Surah between 1 and 114');
    }
  };

  const toggleBookmark = (num: number) => {
    if (bookmarkedSurahs.includes(num)) {
      setBookmarkedSurahs((prev) => prev.filter((n) => n !== num));
      triggerNotification(isRTL ? 'تمت إزالة السورة من المحفوظات' : 'Removed from bookmarks');
    } else {
      setBookmarkedSurahs((prev) => [...prev, num]);
      triggerNotification(isRTL ? 'تم حفظ السورة في المفضلة ⭐' : 'Surah bookmarked ⭐');
    }
  };

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      triggerNotification(isRTL ? 'جاري الاستماع للآية المباركة 🔉' : 'Playing recitation 🔉');
    } else {
      triggerNotification(isRTL ? 'تم إيقاف التلاوة' : 'Recitation paused');
    }
  };

  return (
    <div className="space-y-4 select-none">
      {/* 1. Header Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-emerald-600/10 to-teal-600/10 border border-amber-500/30 dark:border-amber-400/20 shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                {isRTL ? 'المصحف الشريف وتفسير الآيات' : 'The Holy Quran & Tafsir'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isRTL ? '١١٤ سورة مع التفسير الميسر ومستكشف الآيات' : '114 Surahs with easy Tafsir & Ayah Explorer'}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
            {isRTL ? '٣٠ جزءاً' : '30 Juz'}
          </span>
        </div>

        {/* Quick Ayah Lookup Bar */}
        <div className="mt-4 p-3.5 rounded-2xl bg-stone-900/40 dark:bg-stone-950/60 border border-amber-500/20 space-y-2.5 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isRTL ? 'مستكشف الآيات والبحث السريع' : 'Quick Surah & Ayah Lookup'}</span>
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            <input
              type="number"
              min="1"
              max="114"
              value={surahNumInput}
              onChange={(e) => setSurahNumInput(e.target.value)}
              placeholder={isRTL ? 'رقم السورة (١-١١٤)' : 'Surah No.'}
              className="col-span-2 bg-stone-800/80 border border-stone-700/80 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-400"
            />
            <input
              type="number"
              min="1"
              value={ayahNumInput}
              onChange={(e) => setAyahNumInput(e.target.value)}
              placeholder={isRTL ? 'رقم الآية' : 'Ayah No.'}
              className="col-span-1 bg-stone-800/80 border border-stone-700/80 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-400 text-center"
            />
            <button
              onClick={handleLookup}
              className="col-span-2 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs shadow-md shadow-amber-600/20 active:scale-95 transition-all flex items-center justify-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isRTL ? 'جلب الآية' : 'Explore'}</span>
            </button>
          </div>

          {lookupResult && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 font-serif leading-relaxed">
              {lookupResult}
            </div>
          )}
        </div>
      </div>

      {/* 2. Active Surah Spotlight Display */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-stone-950 font-bold flex items-center justify-center text-sm shadow-md">
              {selectedSurah.number}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                  سورة {selectedSurah.name}
                </h3>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-normal">
                  ({selectedSurah.englishName})
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {selectedSurah.revelationType} • {selectedSurah.versesCount} {isRTL ? 'آية' : 'verses'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleBookmark(selectedSurah.number)}
              className={`p-2 rounded-xl border transition-all ${
                bookmarkedSurahs.includes(selectedSurah.number)
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-500'
                  : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400'
              }`}
              title={isRTL ? 'حفظ في المفضلة' : 'Bookmark Surah'}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-xl border transition-all ${
                isPlayingAudio
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500 animate-pulse'
                  : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
              }`}
              title={isRTL ? 'تلاوة الآية' : 'Play Recitation'}
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onCopy(selectedSurah.sampleVerse, selectedSurah.number + 5000)}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-amber-500 transition-all"
              title={isRTL ? 'نسخ الآيات' : 'Copy Verses'}
            >
              {copiedId === selectedSurah.number + 5000 ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Beautiful Quran Typography */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-stone-50 to-amber-50/30 dark:from-stone-950/60 dark:to-emerald-950/20 border border-amber-500/20 text-center space-y-3">
          <p className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-emerald-900 dark:text-amber-200 leading-loose tracking-wide">
            {selectedSurah.sampleVerse}
          </p>
          <div className="pt-2 border-t border-amber-500/15">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 block mb-1">
              {isRTL ? '💡 التفسير الميسر والمعنى الإجمالي:' : '💡 Simplified Meaning & Virtues:'}
            </span>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed max-w-lg mx-auto">
              {selectedSurah.tafsirSample}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Surah Selection Grid / List with search */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>{isRTL ? 'فهرس سور القرآن الكريم' : 'Surah Directory'}</span>
          </h3>
          <span className="text-xs text-stone-500">
            {filteredSurahs.length} {isRTL ? 'سورة' : 'surahs'}
          </span>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? 'ابحث باسم السورة (الفاتحة، الكهف، الملك...)' : 'Search by surah name...'}
            className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-2xl pr-9 pl-3 py-2.5 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Surahs List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
          {filteredSurahs.map((surah) => {
            const isSelected = selectedSurah.number === surah.number;
            return (
              <button
                key={surah.number}
                onClick={() => {
                  setSelectedSurah(surah);
                  setIsPlayingAudio(false);
                }}
                className={`p-3 rounded-2xl text-start flex items-center justify-between border transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-900 dark:text-amber-200 shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200/80 dark:border-stone-700/60 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'
                  }`}>
                    {surah.number}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      سورة {surah.name}
                    </h4>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400">
                      {surah.revelationType} • {surah.versesCount} آيات
                    </p>
                  </div>
                </div>
                {bookmarkedSurahs.includes(surah.number) && (
                  <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-current" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
