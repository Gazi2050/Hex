import { useCallback, useMemo } from "react";
import { useHabitStore } from "@/lib/store";
import { countCompleted } from "@/lib/actions/habit-actions";
import { toast } from "@ncrft/native-toast";

export function useHabits() {
  const habits = useHabitStore((state) => state.habits);
  const toggleHabit = useHabitStore((state) => state.toggleHabit);
  const priorityOrder = useHabitStore((state) => state.priorityOrder);
  const habitsOrder = useHabitStore((state) => state.habitsOrder);

  const handleToggle = useCallback((id: string) => {
    const habit = habits.find((h) => h.id === id);
    toggleHabit(id);
    if (habit && !habit.completedToday) {
      toast.success("Done");
    }
  }, [toggleHabit, habits]);

  const completedCount = useMemo(() => countCompleted(habits), [habits]);
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
    sortedHabits,
    priorityHabits,
    completedCount,
    handleToggle,
    totalCount: habits.length,
  };
}
