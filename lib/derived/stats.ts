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

// Calculate global stats based on "Perfect Days" (all scheduled tasks completed)
export function calculateGlobalStats(habits: Habit[], logs: HabitLog[]) {
  const today = new Date();
  const todayStr = getLocalDateString(today);
  const dayOfWeek = (today.getDay() + 6) % 7; // Monday is 0, Sunday is 6
  
  // Scheduled habits for today
  const scheduledToday = habits.filter((h) => h.repeatDays[dayOfWeek] && h.createdAt.slice(0, 10) <= todayStr);
  const completedTodayCount = scheduledToday.filter((h) => h.completedToday).length;

  // Determine if a specific date was a "Perfect Day"
  const isPerfectDay = (date: Date): boolean => {
    const dateStr = getLocalDateString(date);
    const dayOfWk = (date.getDay() + 6) % 7;
    
    const scheduled = habits.filter((h) => 
      h.repeatDays[dayOfWk] && h.createdAt.slice(0, 10) <= dateStr
    );
    
    // If nothing was scheduled, it's considered a pass (perfect) as long as it's not before the user started
    if (scheduled.length === 0) return true;
    
    const completed = scheduled.filter((h) => 
      logs.some((l) => l.habitId === h.id && l.date === dateStr)
    );
    
    return completed.length === scheduled.length;
  };

  const firstHabitDateStr = habits.length > 0 
    ? habits.reduce((min, h) => (h.createdAt < min ? h.createdAt : min), habits[0].createdAt).slice(0, 10)
    : todayStr;

  let globalStreak = 0;
  
  if (habits.length > 0) {
    let checkDate = new Date(today);
    let checkStr = getLocalDateString(checkDate);

    // If today is perfect, start streak from today. Otherwise, check yesterday.
    if (isPerfectDay(checkDate)) {
      globalStreak++;
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (getLocalDateString(yesterday) >= firstHabitDateStr && isPerfectDay(yesterday)) {
        checkDate = yesterday;
        globalStreak++;
      }
    }

    // If we have a streak started, count backwards
    if (globalStreak > 0) {
      while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        checkStr = getLocalDateString(checkDate);
        
        if (checkStr < firstHabitDateStr) break; // Don't count before first habit
        
        if (isPerfectDay(checkDate)) {
          globalStreak++;
        } else {
          break;
        }
      }
    }
  }

  // Calculate best global streak
  let bestGlobalStreak = globalStreak; // At least current streak
  let currentRun = 0;
  
  if (habits.length > 0) {
    const start = new Date(firstHabitDateStr);
    const end = new Date(todayStr);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (isPerfectDay(d)) {
        currentRun++;
        if (currentRun > bestGlobalStreak) {
          bestGlobalStreak = currentRun;
        }
      } else {
        currentRun = 0;
      }
    }
  }

  const totalCompletions = logs.length;

  return {
    streak: globalStreak,
    bestStreak: bestGlobalStreak,
    todayCompleted: completedTodayCount,
    todayScheduled: scheduledToday.length,
    totalDone: totalCompletions,
    level: 1,
    levelName: "Cinder",
    levelProgress: 0,
  };
}
