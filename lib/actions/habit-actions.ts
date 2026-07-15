import type { Habit, HabitLog } from "@/lib/types";
import { getLocalDateString } from "@/lib/store";

export function toggleHabitCompletion(habits: Habit[], id: string): Habit[] {
  return habits.map((h) =>
    h.id === id ? { ...h, completedToday: !h.completedToday } : h
  );
}

export function countCompleted(habits: Habit[]): number {
  return habits.filter((h) => h.completedToday).length;
}

export function sortByPendingFirst(habits: Habit[]): Habit[] {
  return [...habits].sort((a, b) => {
    if (a.completedToday === b.completedToday) return 0;
    return a.completedToday ? 1 : -1;
  });
}

export function buildCompletedTodaySet(logs: HabitLog[]): Set<string> {
  const today = getLocalDateString();
  const set = new Set<string>();
  for (const l of logs) {
    if (l.date === today) set.add(l.habitId);
  }
  return set;
}

export function isCompletedToday(habitId: string, logs: HabitLog[]): boolean {
  const today = getLocalDateString();
  return logs.some((l) => l.habitId === habitId && l.date === today);
}

export function countCompletedToday(habits: Habit[], logs: HabitLog[]): number {
  const set = buildCompletedTodaySet(logs);
  return habits.filter((h) => set.has(h.id)).length;
}
