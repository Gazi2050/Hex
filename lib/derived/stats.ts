import type { Habit, HabitLog } from "../types";
import { getLocalDateString } from "../store";

// Calculate current streak for a single habit based on calendar dates
export function calculateCurrentStreak(habitId: string, logs: HabitLog[]): number {
  const habitLogs = logs.filter((l) => l.habitId === habitId);
  if (habitLogs.length === 0) return 0;

  const dates = new Set(habitLogs.map((l) => l.date));
  let currentStreak = 0;
  const today = new Date();

  // If completed today, start counting from today
  // If not completed today, check yesterday. If completed yesterday, start from yesterday. If not, streak is 0.
  let checkDate = new Date(today);
  let checkStr = getLocalDateString(checkDate);

  if (dates.has(checkStr)) {
    currentStreak++;
  } else {
    // Check yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);
    if (dates.has(yesterdayStr)) {
      checkDate = yesterday;
      currentStreak++;
    } else {
      return 0;
    }
  }

  // Count backwards day-by-day
  while (true) {
    checkDate.setDate(checkDate.getDate() - 1);
    const prevStr = getLocalDateString(checkDate);
    if (dates.has(prevStr)) {
      currentStreak++;
    } else {
      break;
    }
  }

  return currentStreak;
}

// Calculate best streak historically for a single habit
export function calculateBestStreak(habitId: string, logs: HabitLog[]): number {
  const habitLogs = logs.filter((l) => l.habitId === habitId);
  if (habitLogs.length === 0) return 0;

  // Sort unique dates ascending
  const sortedDates = Array.from(new Set(habitLogs.map((l) => l.date))).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  if (sortedDates.length === 0) return 0;

  let bestStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diffTime = Math.abs(curr.getTime() - prev.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentRun++;
    } else if (diffDays > 1) {
      if (currentRun > bestStreak) {
        bestStreak = currentRun;
      }
      currentRun = 1;
    }
  }

  if (currentRun > bestStreak) {
    bestStreak = currentRun;
  }

  return bestStreak;
}

// Global stats calculator
export function calculateGlobalStats(habits: Habit[], logs: HabitLog[]) {
  const today = new Date();
  const dayOfWeek = (today.getDay() + 6) % 7; // Monday is 0, Sunday is 6
  
  // Scheduled habits for today
  const scheduledToday = habits.filter((h) => h.repeatDays[dayOfWeek]);
  const completedTodayCount = scheduledToday.filter((h) => h.completedToday).length;

  const currentStreaks = habits.map((h) => calculateCurrentStreak(h.id, logs));
  const maxCurrentStreak = currentStreaks.length > 0 ? Math.max(...currentStreaks) : 0;

  const bestStreaks = habits.map((h) => calculateBestStreak(h.id, logs));
  const maxBestStreak = bestStreaks.length > 0 ? Math.max(...bestStreaks) : 0;

  const totalCompletions = logs.length;

  return {
    streak: maxCurrentStreak,
    bestStreak: maxBestStreak,
    todayCompleted: completedTodayCount,
    todayScheduled: scheduledToday.length,
    totalDone: totalCompletions,
  };
}
