import type { Habit, HabitLog } from "../types";
import { getLocalDateString } from "../store";

function dateNDaysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

export function calculateWeeklyBars(
  habits: Habit[],
  logs: HabitLog[]
): { day: string; date: string; pct: number; completed: number; scheduled: number }[] {
  const result: { day: string; date: string; pct: number; completed: number; scheduled: number }[] = [];
  const logSet = new Set(logs.map((l) => `${l.habitId}|${l.date}`));

  const today = new Date();
  const daysSinceSunday = today.getDay(); // 0=Sun
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - daysSinceSunday);
  sunday.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    const dateStr = getLocalDateString(d);
    const dayOfWeek = (d.getDay() + 6) % 7; // 0=Mon, 1=Tue, ..., 6=Sun

    let scheduled = 0;
    let completed = 0;

    for (const h of habits) {
      if (h.repeatDays[dayOfWeek] && h.createdAt.slice(0, 10) <= dateStr) {
        scheduled += h.frequency;
        if (logSet.has(`${h.id}|${dateStr}`)) completed += 1;
      }
    }

    result.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: dateStr,
      pct: scheduled > 0 ? completed / scheduled : 0,
      completed,
      scheduled,
    });
  }

  return result;
}

export function calculateMonthRate(
  habits: Habit[],
  logs: HabitLog[]
): { rate: number; completed: number; scheduled: number } {
  if (habits.length === 0) return { rate: 0, completed: 0, scheduled: 0 };

  const logSet = new Set(logs.map((l) => `${l.habitId}|${l.date}`));
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  let totalScheduled = 0;
  let totalCompleted = 0;

  for (let d = new Date(firstOfMonth); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = getLocalDateString(new Date(d));
    const dayOfWeek = (d.getDay() + 6) % 7;

    for (const h of habits) {
      if (h.repeatDays[dayOfWeek] && h.createdAt.slice(0, 10) <= dateStr) {
        totalScheduled += h.frequency;
        if (logSet.has(`${h.id}|${dateStr}`)) totalCompleted += 1;
      }
    }
  }

  return {
    rate: totalScheduled > 0 ? totalCompleted / totalScheduled : 0,
    completed: totalCompleted,
    scheduled: totalScheduled,
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
): { months: { month: string; completed: number; scheduled: number }[]; totalCompleted: number; totalScheduled: number } {
  const logSet = new Set(logs.map((l) => `${l.habitId}|${l.date}`));
  const now = new Date();
  const year = now.getFullYear();

  let totalCompleted = 0;
  let totalScheduled = 0;
  const months: { month: string; completed: number; scheduled: number }[] = [];

  for (let m = 0; m < 12; m++) {
    let monthCompleted = 0;
    let monthScheduled = 0;

    const daysInMonth = new Date(year, m + 1, 0).getDate();
    const stopDay = m === now.getMonth() ? now.getDate() : daysInMonth;

    for (let day = 1; day <= stopDay; day++) {
      const d = new Date(year, m, day);
      const dateStr = getLocalDateString(d);
      const dayOfWeek = (d.getDay() + 6) % 7;

      for (const h of habits) {
        if (h.repeatDays[dayOfWeek] && h.createdAt.slice(0, 10) <= dateStr) {
          monthScheduled += h.frequency;
          if (logSet.has(`${h.id}|${dateStr}`)) monthCompleted += 1;
        }
      }
    }

    months.push({
      month: new Date(year, m, 1).toLocaleDateString("en-US", { month: "short" }),
      completed: monthCompleted,
      scheduled: monthScheduled,
    });

    totalCompleted += monthCompleted;
    totalScheduled += monthScheduled;
  }

  return { months, totalCompleted, totalScheduled };
}
