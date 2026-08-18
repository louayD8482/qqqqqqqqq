import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Play, Search, Plus, Trash2, Check, Sparkles } from 'lucide-react';
import { DhikrItem } from '../types';

interface AdhkarLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  adhkarList: DhikrItem[];
  onSelectDhikr: (dhikr: DhikrItem) => void;
  onAddCustomDhikr: (item: Omit<DhikrItem, 'id'>) => void;
  onDeleteCustomDhikr?: (id: string) => void;
  isRTL: boolean;
}

export const AdhkarLibrary: React.FC<AdhkarLibraryProps> = ({
  isOpen,
  onClose,
  adhkarList,
  onSelectDhikr,
  onAddCustomDhikr,
  onDeleteCustomDhikr,
  isRTL,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>('');
  const [newVirtue, setNewVirtue] = useState<string>('');
  const [newTarget, setNewTarget] = useState<number>(33);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'prayer', labelAr: 'أذكار الصلاة', labelEn: 'Prayer' },
    { id: 'morning_evening', labelAr: 'الصباح والمساء', labelEn: 'Morning & Evening' },
    { id: 'istighfar', labelAr: 'الاستغفار', labelEn: 'Istighfar' },
    { id: 'salawat', labelAr: 'الصلاة على النبي ﷺ', labelEn: 'Salawat' },
    { id: 'custom', labelAr: 'أذكاري الخاصة', labelEn: 'My Custom' },
  ];

  const filteredAdhkar = adhkarList.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.arabicText.includes(searchQuery) ||
      (item.englishTranslation &&
        item.englishTranslation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.virtue && item.virtue.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    onAddCustomDhikr({
      arabicText: newText.trim(),
      virtue: newVirtue.trim() || undefined,
      defaultTarget: newTarget || 33,
      category: 'custom',
    });

    setNewText('');
    setNewVirtue('');
    setNewTarget(33);
    setShowAddModal(false);
    setSelectedCategory('custom');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[88vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-emerald-500/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {isRTL ? 'مكتبة الأذكار المأثورة' : 'Adhkar Library'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isRTL ? 'اختر الذكر لبدء التسبيح فوراً' : 'Select any Dhikr to start counting immediately'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="p-2 rounded-xl text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 active:scale-95 transition-all text-xs font-bold flex items-center gap-1"
              title={isRTL ? 'إضافة ذكر جديد' : 'Add Custom Dhikr'}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{isRTL ? 'إضافة ذكر' : 'Add'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Categories */}
        <div className="p-4 border-b border-stone-200/80 dark:border-stone-800/80 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? 'ابحث عن ذكر أو فضل...' : 'Search dhikr or virtue...'}
              className="w-full ps-9 pe-4 py-2 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {isRTL ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Adhkar Cards List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {filteredAdhkar.length === 0 ? (
            <div className="text-center py-10 text-stone-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-xs">{isRTL ? 'لا توجد أذكار مطابقة' : 'No matching Dhikr found'}</p>
            </div>
          ) : (
            filteredAdhkar.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif leading-relaxed">
                      {item.arabicText}
                    </h3>
                    {item.englishTranslation && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                        {item.englishTranslation}
                      </p>
                    )}
                    {item.virtue && (
                      <div className="flex items-center gap-1 mt-2 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.virtue}</span>
                      </div>
                    )}
                  </div>

                  {item.category === 'custom' && onDeleteCustomDhikr && (
                    <button
                      onClick={() => onDeleteCustomDhikr(item.id)}
                      className="text-stone-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      title={isRTL ? 'حذف هذا الذكر' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-700/60 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                    {isRTL ? 'الهدف المقترح:' : 'Recommended:'}{' '}
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {item.defaultTarget === 'infinity' ? '∞' : `${item.defaultTarget} مرة`}
                    </span>
                  </span>
                  <button
                    onClick={() => {
                      onSelectDhikr(item);
                      onClose();
                    }}
                    className="py-1.5 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{isRTL ? 'ابدأ التسبيح' : 'Start Counting'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Custom Dhikr Modal Form */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="absolute inset-0 z-20 bg-white dark:bg-stone-900 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-200 dark:border-stone-800">
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {isRTL ? 'إضافة ذكر أو دعاء مخصص' : 'Add Custom Dhikr / Dua'}
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateCustom} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {isRTL ? 'نص الذكر أو الدعاء' : 'Dhikr / Dua Text'} *
                    </label>
                    <textarea
                      required
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      placeholder={isRTL ? 'مثال: ربِّ اغفر لي ولوالديّ...' : 'e.g. Rabbi ghfir li wa liwalidayya...'}
                      rows={3}
                      className="w-full p-2.5 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {isRTL ? 'الفضل أو الملاحظة (اختياري)' : 'Virtue or Note (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={newVirtue}
                      onChange={(e) => setNewVirtue(e.target.value)}
                      placeholder={isRTL ? 'مثال: دعاء للوالدين وقضاء الحوائج' : 'e.g. Dua for parents'}
                      className="w-full p-2.5 text-xs rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {isRTL ? 'العدد المستهدف' : 'Target Count'}
                    </label>
                    <div className="flex gap-2">
                      {[33, 70, 100, 300, 1000].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setNewTarget(num)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            newTarget === num
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 transition-all"
                    >
                      {isRTL ? 'حفظ وإضافة الذكر' : 'Save & Add Dhikr'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-medium bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                    >
                      {isRTL ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
