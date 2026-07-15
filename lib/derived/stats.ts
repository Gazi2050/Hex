import type { Habit, HabitLog } from "../types";
import { getLocalDateString } from "../store";

export function calculateCurrentStreak(habit: Habit, logs: HabitLog[]): number {
  const dates = new Set(logs.filter((l) => l.habitId === habit.id).map((l) => l.date));
  if (dates.size === 0) return 0;

  const createdAtDate = habit.createdAtDate ?? habit.createdAt.slice(0, 10);
  const todayStr = getLocalDateString(new Date());

  let streak = 0;
  const checkDate = new Date();

  while (true) {
    const checkStr = getLocalDateString(checkDate);

    if (checkStr < createdAtDate) break;

    const dayOfWeek = (checkDate.getDay() + 6) % 7;
    const isScheduled = habit.repeatDays[dayOfWeek];

    if (!isScheduled) {
      // Non-scheduled day — skip, don't affect streak
    } else if (dates.has(checkStr)) {
      streak++;
    } else if (checkStr === todayStr) {
      // Today still in progress — skip, don't break
    } else {
      // Past scheduled day missed — streak broken
      break;
    }

    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

export function calculateBestStreak(habit: Habit, logs: HabitLog[]): number {
  const dates = new Set(logs.filter((l) => l.habitId === habit.id).map((l) => l.date));
  if (dates.size === 0) return 0;

  const createdAtDate = habit.createdAtDate ?? habit.createdAt.slice(0, 10);
  const todayStr = getLocalDateString(new Date());

  let bestStreak = 0;
  let currentRun = 0;

  const start = new Date(createdAtDate + "T00:00:00");
  const end = new Date(todayStr + "T00:00:00");

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = getLocalDateString(d);
    const dayOfWeek = (d.getDay() + 6) % 7;
    const isScheduled = habit.repeatDays[dayOfWeek];

    if (!isScheduled) continue;

    if (dates.has(dateStr)) {
      currentRun++;
      if (currentRun > bestStreak) bestStreak = currentRun;
    } else {
      currentRun = 0;
    }
  }

  return bestStreak;
}

// Calculate global stats based on "Perfect Days" (all scheduled tasks completed)
export function calculateGlobalStats(habits: Habit[], logs: HabitLog[]) {
  const today = new Date();
  const todayStr = getLocalDateString(today);
  const dayOfWeek = (today.getDay() + 6) % 7; // Monday is 0
  
  // Scheduled habits for today
  const scheduledToday = habits.filter((h) => h.repeatDays[dayOfWeek] && (h.createdAtDate ?? h.createdAt.slice(0, 10)) <= todayStr);
  const completedTodayCount = scheduledToday.filter((h) =>
    logs.some((l) => l.habitId === h.id && l.date === todayStr)
  ).length;

  // Determine if a specific date was a "Perfect Day"
  const isPerfectDay = (date: Date): boolean => {
    const dateStr = getLocalDateString(date);
    const dayOfWk = (date.getDay() + 6) % 7;
    
    const scheduled = habits.filter((h) => 
      h.repeatDays[dayOfWk] && (h.createdAtDate ?? h.createdAt.slice(0, 10)) <= dateStr
    );
    
    // If nothing was scheduled, it's considered a pass (perfect) as long as it's not before the user started
    if (scheduled.length === 0) return true;
    
    const completed = scheduled.filter((h) => 
      logs.some((l) => l.habitId === h.id && l.date === dateStr)
    );
    
    return completed.length === scheduled.length;
  };

  const firstHabitDateStr = habits.length > 0
    ? habits.reduce((min, h) => {
        const d = h.createdAtDate ?? h.createdAt.slice(0, 10);
        return d < min ? d : min;
      }, habits[0].createdAtDate ?? habits[0].createdAt.slice(0, 10))
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
