export interface DhikrItem {
  id: string;
  arabicText: string;
  transliteration?: string;
  englishTranslation?: string;
  virtue?: string; // فضل الذكر
  defaultTarget: number | 'infinity';
  category: 'daily' | 'prayer' | 'morning_evening' | 'istighfar' | 'salawat' | 'custom';
  source?: string;
}

export interface RoutineStep {
  dhikrId: string;
  arabicText: string;
  target: number;
  virtue?: string;
}

export interface SmartRoutine {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  steps: RoutineStep[];
  completionDuaAr?: string;
  completionDuaEn?: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  totalCount: number;
  dhikrBreakdown: Record<string, number>;
}

export type SoundType = 'wood' | 'crystal' | 'tick' | 'silent';
export type AppTheme = 'emerald' | 'dark' | 'oled' | 'light' | 'amber';
export type AppLanguage = 'ar' | 'en';

export interface UserSettings {
  soundEnabled: boolean;
  soundType: SoundType;
  vibrationEnabled: boolean;
  theme: AppTheme;
  language: AppLanguage;
  visualBeadsCount: 33 | 99 | 11;
  wakeLockEnabled: boolean;
  touchAnywhere: boolean;
  dailyGoal: number;
  autoAdvanceRoutine: boolean;
}

export interface TasbihStats {
  todayTotal: number;
  dailyGoal: number;
  streakDays: number;
  totalLifetimeCounts: number;
  dailyHistory: Record<string, number>;
  dhikrBreakdown: Record<string, number>;
}
