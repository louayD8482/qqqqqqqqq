import React, { useState } from 'react';
import { User, Flame, Sparkles, Award, Calendar, CheckCircle2, TrendingUp, Edit2, Shield, Heart } from 'lucide-react';
import { TasbihStats } from '../types';

interface ProfileSectionProps {
  stats: TasbihStats;
  onUpdateDailyGoal: (newGoal: number) => void;
  triggerNotification: (msg: string) => void;
  isRTL: boolean;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  stats,
  onUpdateDailyGoal,
  triggerNotification,
  isRTL,
}) => {
  const [userName, setUserName] = useState(() => localStorage.getItem('subha_username') || 'لؤي');
  const [isEditingName, setIsEditingName] = useState(false);
  const [prayersCompletedCount, setPrayersCompletedCount] = useState(142);
  const [quranPagesCount, setQuranPagesCount] = useState(12);

  const saveUserName = () => {
    localStorage.setItem('subha_username', userName);
    setIsEditingName(false);
    triggerNotification(isRTL ? "تم تحديث اسم المستخدم بنجاح ✨" : "User profile updated ✨");
  };

  const streakDays = stats.streakDays > 0 ? stats.streakDays : 7;
  const historyEntries = Object.entries(stats.dailyHistory).slice(-7);

  return (
    <div className="space-y-4 select-none">
      {/* 1. User Identity Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/20 via-stone-900 to-[#111827] border border-amber-500/30 dark:border-amber-400/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-600 text-stone-950 text-2xl font-black flex items-center justify-center shadow-lg shadow-amber-600/30 border-2 border-amber-300">
              {userName.charAt(0) || 'ل'}
            </div>
            <div>
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-black/60 border border-amber-400 rounded-xl px-2.5 py-1 text-sm font-bold text-white outline-none"
                    autoFocus
                  />
                  <button
                    onClick={saveUserName}
                    className="px-3 py-1 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl"
                  >
                    {isRTL ? 'حفظ' : 'Save'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-stone-100">{userName}</h3>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-1 text-stone-400 hover:text-amber-400"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <p className="text-xs text-amber-200/80">
                {isRTL ? 'مستخدم نشط في تطبيق نور الإسلام' : 'Active Member of Noor Al-Islam'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current text-amber-500" />
                  {streakDays} {isRTL ? 'أيام متتالية' : 'days streak'}
                </span>
                <span className="text-stone-500 text-xs">•</span>
                <span className="text-[11px] text-emerald-400 font-semibold">
                  {isRTL ? 'الرياض' : 'Riyadh'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <Award className="w-6 h-6 text-amber-400 mx-auto mb-0.5" />
            <span className="text-[10px] text-amber-300 font-bold block">
              {isRTL ? 'رتبة المسبحين' : 'Rank: Musabbih'}
            </span>
          </div>
        </div>

        {/* 3 Core Stats Badges */}
        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-stone-800">
          <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-0.5">
              <Flame className="w-3.5 h-3.5" />
              <span className="text-base font-bold">{streakDays}</span>
            </div>
            <span className="text-[10px] text-stone-400">{isRTL ? 'سلسلة الأيام' : 'Day Streak'}</span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800">
            <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-base font-bold">{prayersCompletedCount}</span>
            </div>
            <span className="text-[10px] text-stone-400">{isRTL ? 'صلاة مؤداة' : 'Prayers Logged'}</span>
          </div>

          <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800">
            <div className="flex items-center justify-center gap-1 text-teal-400 mb-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-base font-bold">{quranPagesCount}</span>
            </div>
            <span className="text-[10px] text-stone-400">{isRTL ? 'صفحة مصحف' : 'Pages Read'}</span>
          </div>
        </div>
      </div>

      {/* 2. Total Tasbeeh Progress and Goals */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            <span>{isRTL ? 'إجمالي التسبيحات والأوراد' : 'Lifetime Tasbeeh Counts'}</span>
          </h3>
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
            {stats.totalLifetimeCounts.toLocaleString()} {isRTL ? 'تسبيحة' : 'tasbeeh'}
          </span>
        </div>

        {/* Daily Goal bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-stone-600 dark:text-stone-300">
              {isRTL ? 'الهدف اليومي المستهدف:' : 'Daily Target Progress:'}
            </span>
            <span className="font-mono text-amber-600 dark:text-amber-400">
              {stats.dailyHistory[new Date().toISOString().slice(0, 10)] || 0} / {stats.dailyGoal}
            </span>
          </div>
          <div className="h-3 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  (((stats.dailyHistory[new Date().toISOString().slice(0, 10)] || 0) / (stats.dailyGoal || 100)) * 100)
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Quick buttons to set goal */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs text-stone-500">{isRTL ? 'تعديل الهدف:' : 'Change Goal:'}</span>
          {[100, 300, 500, 1000].map((goal) => (
            <button
              key={goal}
              onClick={() => {
                onUpdateDailyGoal(goal);
                triggerNotification(isRTL ? `تم تحديد الهدف اليومي: ${goal}` : `Daily goal set to ${goal}`);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                stats.dailyGoal === goal
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Spiritual Milestones & Virtues */}
      <div className="p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-rose-500" />
          <span>{isRTL ? 'إنجازات وكنوز روحية محققة' : 'Spiritual Achievements'}</span>
        </h4>

        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/60">
            <span className="text-2xl">🌱</span>
            <div className="flex-1">
              <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {isRTL ? 'غراس الجنة' : 'Seedlings of Jannah'}
              </h5>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {isRTL ? 'أكثر من ٥٠٠ تسبيحة بالباقيات الصالحات' : 'More than 500 Tasbeeh logged'}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-500">✓ {isRTL ? 'مكتمل' : 'Done'}</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/60">
            <span className="text-2xl">🛡️</span>
            <div className="flex-1">
              <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {isRTL ? 'الحصن الحصين' : 'The Fortified Fortress'}
              </h5>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {isRTL ? 'المواظبة على أذكار الصباح والمساء لـ ٧ أيام' : 'Consistency on morning/evening adhkar for 7 days'}
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-500">✓ {isRTL ? 'مكتمل' : 'Done'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
