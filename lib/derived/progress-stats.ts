import type { Habit, HabitLog } from "../types";
import { getLocalDateString } from "../store";

/** Calculates the completion rate (0–1) for a single day, or null if nothing was scheduled. */
export function dailyPercent(
  date: Date,
  habits: Habit[],
  logSet: Set<string>
): { pct: number | null; completed: number; scheduled: number; missed: number } {
  const dateStr = getLocalDateString(date);
  const todayStr = getLocalDateString(new Date());
  const dayOfWeek = (date.getDay() + 6) % 7; // Monday is 0

  let scheduled = 0;
  let completed = 0;

  for (const h of habits) {
    const habitCreatedDate = h.createdAtDate ?? h.createdAt.slice(0, 10);
    if (h.repeatDays[dayOfWeek] && habitCreatedDate <= dateStr) {
      scheduled += 1;
      if (logSet.has(`${h.id}|${dateStr}`)) completed += 1;
    }
  }

  // A day only counts toward "missed" once it is fully in the past.
  // Today (and future days) are never missed — the day isn't over yet.
  const isPast = dateStr < todayStr;

  return {
    pct: scheduled > 0 ? completed / scheduled : null,
    completed,
    scheduled,
    missed: isPast ? scheduled - completed : 0,
  };
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
  missed: number;
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
        missed: 0,
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
      missed: dp.missed,
      hasData: dp.pct !== null,
    });
  }

  return result;
}

export function calculatePeriodRate(
  habits: Habit[],
  logs: HabitLog[],
  startDate: Date,
  endDate: Date
): {
  rate: number | null;
  completed: number;
  scheduled: number;
  missed: number;
  validDays: number;
} {
  if (habits.length === 0)
    return { rate: null, completed: 0, scheduled: 0, missed: 0, validDays: 0 };

  const logSet = new Set(logs.map((l) => `${l.habitId}|${l.date}`));

  let totalCompleted = 0;
  let totalScheduled = 0;
  let totalMissed = 0;
  let sumPct = 0;
  let validDays = 0;

  for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
    const dp = dailyPercent(new Date(d), habits, logSet);
    if (dp.pct !== null) {
      sumPct += dp.pct;
      validDays++;
    }
    totalCompleted += dp.completed;
    totalScheduled += dp.scheduled;
    totalMissed += dp.missed;
  }

  return {
    rate: validDays > 0 ? sumPct / validDays : null,
    completed: totalCompleted,
    scheduled: totalScheduled,
    missed: totalMissed,
    validDays,
  };
}

export function calculateMonthRate(
  habits: Habit[],
  logs: HabitLog[]
): {
  rate: number | null;
  completed: number;
  scheduled: number;
  missed: number;
  validDays: number;
} {
  if (habits.length === 0)
    return { rate: null, completed: 0, scheduled: 0, missed: 0, validDays: 0 };

  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + 1);
  endDate.setHours(0, 0, 0, 0);

  return calculatePeriodRate(habits, logs, firstOfMonth, endDate);
}

export function calculateTotals(
  habits: Habit[],
  logs: HabitLog[]
): { totalCompleted: number; totalMissed: number } {
  const totalCompleted = logs.length;

  if (habits.length === 0) return { totalCompleted, totalMissed: 0 };

  const logSet = new Set(logs.map((l) => `${l.habitId}|${l.date}`));

  const firstDateStr = habits
    .reduce((min, h) => {
      const d = h.createdAtDate ?? h.createdAt.slice(0, 10);
      return d < min ? d : min;
    }, habits[0].createdAtDate ?? habits[0].createdAt.slice(0, 10));

  // Only count misses for fully-past days. Today is never missed — the day
  // isn't over yet, so incomplete habits are still "in progress".
  const start = new Date(firstDateStr + "T00:00:00");
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(23, 59, 59, 999);

  let totalMissed = 0;

  for (let d = new Date(start); d <= yesterday; d.setDate(d.getDate() + 1)) {
    totalMissed += dailyPercent(new Date(d), habits, logSet).missed;
  }

  return { totalCompleted, totalMissed };
}

export function calculateYearlyTrend(
  habits: Habit[],
  logs: HabitLog[]
): {
  months: { month: string; rate: number | null; completed: number; scheduled: number; missed: number }[];
  rate: number | null;
  totalCompleted: number;
  totalScheduled: number;
  totalMissed: number;
} {
  const now = new Date();
  const year = now.getFullYear();

  let totalCompleted = 0;
  let totalScheduled = 0;
  let totalMissed = 0;
  let yrSumPct = 0;
  let yrValidDays = 0;
  const months: { month: string; rate: number | null; completed: number; scheduled: number; missed: number }[] = [];

  for (let m = 0; m < 12; m++) {
    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const stopDay = m === now.getMonth() ? now.getDate() : daysInMonth;

    const isFutureMonth = m > now.getMonth();

    if (isFutureMonth) {
      months.push({
        month: new Date(year, m, 1).toLocaleDateString("en-US", { month: "short" }),
        rate: null,
        completed: 0,
        scheduled: 0,
        missed: 0,
      });
      continue;
    }

    const monthStart = new Date(year, m, 1);
    const monthEnd = new Date(year, m, stopDay + 1);

    const mr = calculatePeriodRate(habits, logs, monthStart, monthEnd);

    months.push({
      month: new Date(year, m, 1).toLocaleDateString("en-US", { month: "short" }),
      rate: mr.rate,
      completed: mr.completed,
      scheduled: mr.scheduled,
      missed: mr.missed,
    });

    if (mr.validDays > 0 && mr.rate !== null) {
      yrSumPct += mr.rate * mr.validDays;
      yrValidDays += mr.validDays;
    }
    totalCompleted += mr.completed;
    totalScheduled += mr.scheduled;
    totalMissed += mr.missed;
  }

  return {
    months,
    rate: yrValidDays > 0 ? yrSumPct / yrValidDays : null,
    totalCompleted,
    totalScheduled,
    totalMissed,
  };
}
