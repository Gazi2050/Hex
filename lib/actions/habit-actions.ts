import type { Habit } from "@/lib/types";

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
