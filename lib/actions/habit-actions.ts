import type { Habit, HabitLog } from "@/lib/types";
import { getLocalDateString } from "@/lib/store";

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
