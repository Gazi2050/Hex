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

    const scheduled = habits.filter(
      (h) => h.repeatDays[dayOfWeek] && h.createdAt.slice(0, 10) <= dateStr
    );
    const completed = scheduled.filter((h) =>
      logSet.has(`${h.id}|${dateStr}`)
    ).length;

    result.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: dateStr,
      pct: scheduled.length > 0 ? completed / scheduled.length : 0,
      completed,
      scheduled: scheduled.length,
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

    const scheduled = habits.filter(
      (h) => h.repeatDays[dayOfWeek] && h.createdAt.slice(0, 10) <= dateStr
    );
    totalScheduled += scheduled.length;
    totalCompleted += scheduled.filter((h) =>
      logSet.has(`${h.id}|${dateStr}`)
    ).length;
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
    const scheduled = habits.filter(
      (h) => h.repeatDays[dayOfWeek] && h.createdAt.slice(0, 10) <= dateStr
    );
    totalMissed += scheduled.filter(
      (h) => !logSet.has(`${h.id}|${dateStr}`)
    ).length;
  }

  return { totalCompleted, totalMissed };
}

export function calculateYearlyTrend(
  logs: HabitLog[]
): { month: string; count: number }[] {
  const result: { month: string; count: number }[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();

    const count = logs.filter((l) => {
      const [ly, lm] = l.date.split("-").map(Number);
      return ly === year && lm - 1 === month;
    }).length;

    result.push({
      month: d.toLocaleDateString("en-US", { month: "short" }),
      count,
    });
  }

  return result;
}
