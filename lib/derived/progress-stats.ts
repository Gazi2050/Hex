import type { Habit, HabitLog } from "../types";
import { getLocalDateString } from "../store";

/** Calculates the completion rate (0–1) for a single day, or null if nothing was scheduled. */
function dailyPercent(
  date: Date,
  habits: Habit[],
  logSet: Set<string>
): { pct: number | null; completed: number; scheduled: number } {
  const dateStr = getLocalDateString(date);
  const dayOfWeek = (date.getDay() + 6) % 7;

  let scheduled = 0;
  let completed = 0;

  for (const h of habits) {
    if (h.repeatDays[dayOfWeek] && h.createdAt.slice(0, 10) <= dateStr) {
      scheduled += h.frequency;
      if (logSet.has(`${h.id}|${dateStr}`)) completed += 1;
    }
  }

  return {
    pct: scheduled > 0 ? completed / scheduled : null,
    completed,
    scheduled,
  };
}

/**
 * Averages an array of (pct | null) values.
 * null values are excluded from both numerator and denominator.
 * Returns null if no valid values exist.
 */
function avgRate(values: (number | null)[]): number | null {
  const valid = values.filter((v): v is number => v !== null);
  return valid.length > 0
    ? valid.reduce((a, b) => a + b, 0) / valid.length
    : null;
}

export function calculateWeeklyBars(
  habits: Habit[],
  logs: HabitLog[]
): {
  day: string;
  date: string;
  pct: number;
  completed: number;
  scheduled: number;
  hasData: boolean;
}[] {
  const result: ReturnType<typeof calculateWeeklyBars>[number][] = [];
  const logSet = new Set(logs.map((l) => `${l.habitId}|${l.date}`));

  const today = new Date();
  const todayStr = getLocalDateString(today);
  const daysSinceSunday = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - daysSinceSunday);
  sunday.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    const dateStr = getLocalDateString(d);

    if (dateStr > todayStr) {
      result.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: dateStr,
        pct: 0,
        completed: 0,
        scheduled: 0,
        hasData: false,
      });
      continue;
    }

    const dp = dailyPercent(d, habits, logSet);
    result.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: dateStr,
      pct: dp.pct ?? 0,
      completed: dp.completed,
      scheduled: dp.scheduled,
      hasData: dp.pct !== null,
    });
  }

  return result;
}

export function calculateMonthRate(
  habits: Habit[],
  logs: HabitLog[]
): {
  rate: number | null;
  completed: number;
  scheduled: number;
  validDays: number;
} {
  if (habits.length === 0)
    return { rate: null, completed: 0, scheduled: 0, validDays: 0 };

  const logSet = new Set(logs.map((l) => `${l.habitId}|${l.date}`));
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const rates: (number | null)[] = [];
  let totalCompleted = 0;
  let totalScheduled = 0;

  for (let d = new Date(firstOfMonth); d <= today; d.setDate(d.getDate() + 1)) {
    const dp = dailyPercent(new Date(d), habits, logSet);
    rates.push(dp.pct);
    totalCompleted += dp.completed;
    totalScheduled += dp.scheduled;
  }

  return {
    rate: avgRate(rates),
    completed: totalCompleted,
    scheduled: totalScheduled,
    validDays: rates.filter((r) => r !== null).length,
  };
}

export function calculateTotals(
  habits: Habit[],
  logs: HabitLog[]
): { totalCompleted: number; totalMissed: number } {
  const totalCompleted = logs.length;

  if (habits.length === 0) return { totalCompleted, totalMissed: 0 };

  const logSet = new Set(logs.map((l) => `${l.habitId}|${l.date}`));

  const firstDateStr = habits
    .reduce((min, h) => (h.createdAt < min ? h.createdAt : min), habits[0].createdAt)
    .slice(0, 10);

  const start = new Date(firstDateStr + "T00:00:00");
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  let totalMissed = 0;

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = getLocalDateString(d);
    const dayOfWeek = (d.getDay() + 6) % 7;

    for (const h of habits) {
      if (h.repeatDays[dayOfWeek] && h.createdAt.slice(0, 10) <= dateStr) {
        totalMissed += h.frequency;
        if (logSet.has(`${h.id}|${dateStr}`)) totalMissed -= 1;
      }
    }
  }

  return { totalCompleted, totalMissed };
}

export function calculateYearlyTrend(
  habits: Habit[],
  logs: HabitLog[]
): {
  months: { month: string; rate: number | null; completed: number; scheduled: number }[];
  rate: number | null;
  totalCompleted: number;
  totalScheduled: number;
} {
  const logSet = new Set(logs.map((l) => `${l.habitId}|${l.date}`));
  const now = new Date();
  const year = now.getFullYear();

  const allRates: (number | null)[] = [];
  let totalCompleted = 0;
  let totalScheduled = 0;
  const months: { month: string; rate: number | null; completed: number; scheduled: number }[] = [];

  for (let m = 0; m < 12; m++) {
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const stopDay = m === now.getMonth() ? now.getDate() : daysInMonth;

    const monthRates: (number | null)[] = [];
    let monthCompleted = 0;
    let monthScheduled = 0;

    for (let day = 1; day <= stopDay; day++) {
      const d = new Date(year, m, day);
      const dp = dailyPercent(d, habits, logSet);
      monthRates.push(dp.pct);
      allRates.push(dp.pct);
      monthCompleted += dp.completed;
      monthScheduled += dp.scheduled;
    }

    months.push({
      month: new Date(year, m, 1).toLocaleDateString("en-US", { month: "short" }),
      rate: avgRate(monthRates),
      completed: monthCompleted,
      scheduled: monthScheduled,
    });

    totalCompleted += monthCompleted;
    totalScheduled += monthScheduled;
  }

  return {
    months,
    rate: avgRate(allRates),
    totalCompleted,
    totalScheduled,
  };
}
