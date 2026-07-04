import { useState, useCallback, useMemo } from "react";
import type { Habit } from "@/lib/types";
import { MOCK_HABITS } from "@/lib/data/habits";
import {
  toggleHabitCompletion,
  countCompleted,
  sortByPendingFirst,
} from "@/lib/actions/habit-actions";

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);

  const handleToggle = useCallback((id: string) => {
    setHabits((prev) => toggleHabitCompletion(prev, id));
  }, []);

  const completedCount = useMemo(() => countCompleted(habits), [habits]);

  const sortedHabits = useMemo(() => sortByPendingFirst(habits), [habits]);

  return {
    habits,
    sortedHabits,
    completedCount,
    handleToggle,
    totalCount: habits.length,
  };
}
