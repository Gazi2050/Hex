import { useCallback, useMemo } from "react";
import { useHabitStore } from "@/lib/store";
import { sortByPendingFirst, countCompleted } from "@/lib/actions/habit-actions";
import { toast } from "@ncrft/native-toast";

export function useHabits() {
  const habits = useHabitStore((state) => state.habits);
  const toggleHabit = useHabitStore((state) => state.toggleHabit);

  const handleToggle = useCallback((id: string) => {
    const habit = habits.find((h) => h.id === id);
    toggleHabit(id);
    if (habit && !habit.completedToday) {
      toast.success("Done");
    }
  }, [toggleHabit, habits]);

  const completedCount = useMemo(() => countCompleted(habits), [habits]);
  const sortedHabits = useMemo(() => sortByPendingFirst(habits), [habits]);
  const priorityHabits = useMemo(
    () => sortByPendingFirst(habits.filter((h) => h.priority)).slice(0, 3),
    [habits]
  );

  return {
    habits,
    sortedHabits,
    priorityHabits,
    completedCount,
    handleToggle,
    totalCount: habits.length,
  };
}
