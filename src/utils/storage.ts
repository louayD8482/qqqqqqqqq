import { UserSettings, DailyLog, DhikrItem } from '../types';
import { INITIAL_ADHKAR } from '../data/adhkar';

const SETTINGS_KEY = 'subha_user_settings';
const LOGS_KEY = 'subha_daily_logs';
const CUSTOM_ADHKAR_KEY = 'subha_custom_adhkar';
const CURRENT_SESSION_KEY = 'subha_current_session';

export const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  soundType: 'wood',
  vibrationEnabled: true,
  theme: 'emerald',
  language: 'ar',
  visualBeadsCount: 33,
  wakeLockEnabled: false,
  touchAnywhere: false,
  dailyGoal: 1000,
  autoAdvanceRoutine: true,
};

export function getStoredSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getStoredLogs(): Record<string, DailyLog> {
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function recordTasbeeh(dhikrId: string, countDelta: number = 1): { todayTotal: number; streak: number } {
  try {
    const today = getTodayDateString();
    const logs = getStoredLogs();
    const currentTodayLog = logs[today] || {
      date: today,
      totalCount: 0,
      dhikrBreakdown: {},
    };

    currentTodayLog.totalCount = Math.max(0, (currentTodayLog.totalCount || 0) + countDelta);
    currentTodayLog.dhikrBreakdown[dhikrId] = Math.max(0, (currentTodayLog.dhikrBreakdown[dhikrId] || 0) + countDelta);

    logs[today] = currentTodayLog;
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));

    const streak = calculateStreak(logs);
    return { todayTotal: currentTodayLog.totalCount, streak };
  } catch {
    return { todayTotal: 0, streak: 0 };
  }
}

export function calculateStreak(logs: Record<string, DailyLog>): number {
  const dates = Object.keys(logs)
    .filter(d => logs[d]?.totalCount > 0)
    .sort()
    .reverse();

  if (dates.length === 0) return 0;

  const today = getTodayDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  // If didn't do tasbeeh today or yesterday, streak is broken
  if (!dates.includes(today) && !dates.includes(yesterdayStr)) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date();
  
  // If not done today yet, start checking from yesterday
  if (!dates.includes(today)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    if (logs[dateStr] && logs[dateStr].totalCount > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function getCustomAdhkar(): DhikrItem[] {
  try {
    const raw = localStorage.getItem(CUSTOM_ADHKAR_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomAdhkar(items: DhikrItem[]): void {
  try {
    localStorage.setItem(CUSTOM_ADHKAR_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save custom adhkar', e);
  }
}

export function getAllAdhkar(): DhikrItem[] {
  const custom = getCustomAdhkar();
  return [...INITIAL_ADHKAR, ...custom];
}

export interface StoredSession {
  currentCount: number;
  target: number | 'infinity';
  activeDhikrId: string;
  smartRoutineId: string | null;
  routineStepIndex: number;
}

export function getStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveStoredSession(session: StoredSession): void {
  try {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save current session', e);
  }
}
