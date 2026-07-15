import { useCallback, useMemo } from "react";
import { useHabitStore } from "@/lib/store";
import {
  buildCompletedTodaySet,
  countCompletedToday,
} from "@/lib/actions/habit-actions";

export function useHabits() {
  const habits = useHabitStore((state) => state.habits);
  const logs = useHabitStore((state) => state.logs);
  const toggleHabit = useHabitStore((state) => state.toggleHabit);
  const priorityOrder = useHabitStore((state) => state.priorityOrder);
  const habitsOrder = useHabitStore((state) => state.habitsOrder);

  const handleToggle = useCallback((id: string) => {
    toggleHabit(id);
  }, [toggleHabit]);

  const completedTodaySet = useMemo(
    () => buildCompletedTodaySet(logs),
    [logs]
  );

  const completedCount = useMemo(
    () => countCompletedToday(habits, logs),
    [habits, logs]
  );

  const sortedHabits = useMemo(() => {
    const ordered = [...habits].sort((a, b) => {
      const aIdx = habitsOrder.indexOf(a.id);
      const bIdx = habitsOrder.indexOf(b.id);
      if (aIdx === -1 && bIdx === -1) return 0;
      if (aIdx === -1) return 1;
      if (bIdx === -1) return -1;
      return aIdx - bIdx;
    });
    return ordered;
  }, [habits, habitsOrder]);

  const priorityHabits = useMemo(() => {
    const priorities = habits.filter((h) => h.priority);
    const ordered = [...priorities].sort((a, b) => {
      const aIdx = priorityOrder.indexOf(a.id);
      const bIdx = priorityOrder.indexOf(b.id);
      if (aIdx === -1 && bIdx === -1) return 0;
      if (aIdx === -1) return 1;
      if (bIdx === -1) return -1;
      return aIdx - bIdx;
    });
    return ordered.slice(0, 3);
  }, [habits, priorityOrder]);

  return {
    habits,
    logs,
    sortedHabits,
    priorityHabits,
    completedTodaySet,
    completedCount,
    handleToggle,
    totalCount: habits.length,
  };
}
