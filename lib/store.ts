import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Habit, HabitLog, Achievement } from "./types";

export interface HabitState {
  habits: Habit[];
  logs: HabitLog[];
  achievements: Achievement[];
  priorityOrder: string[];
  habitsOrder: string[];
  addHabit: (habit: Omit<Habit, "id" | "streak" | "bestStreak" | "completedToday" | "createdAt">) => void;
  toggleHabit: (id: string, dateStr?: string) => void;
  updateHabit: (id: string, updates: Partial<Omit<Habit, "id" | "createdAt">>) => void;
  deleteHabit: (id: string) => void;
  unlockAchievement: (id: string) => void;
  reorderPriorities: (from: number, to: number) => void;
  reorderHabits: (from: number, to: number) => void;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "first_habit", title: "First Habit", description: "Created your first habit", unlockedAt: null },
  { id: "day_one", title: "Day One", description: "Completed your first habit", unlockedAt: null },
  { id: "streak_7", title: "Streak Master", description: "Reached a 7-day streak", unlockedAt: null },
  { id: "total_50", title: "Century Club", description: "Completed habits 50 times", unlockedAt: null },
];

export const getLocalDateString = (d = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const safeStorage = {
  getItem: async (name: string) => {
    try {
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string) => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch {
      console.warn("AsyncStorage setItem failed. Data will not persist after reload.");
    }
  },
  removeItem: async (name: string) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch {
      console.warn("AsyncStorage removeItem failed.");
    }
  },
};

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],
      logs: [],
      achievements: DEFAULT_ACHIEVEMENTS,
      priorityOrder: [],
      habitsOrder: [],

      addHabit: (newHabit) => {
        const id = Math.random().toString(36).substring(2, 9);
        const habit: Habit = {
          priority: false,
          ...newHabit,
          id,
          streak: 0,
          bestStreak: 0,
          completedToday: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => {
          const nextHabits = [...state.habits, habit];
          const achievements = state.achievements.map((a) => {
            if (a.id === "first_habit" && !a.unlockedAt) {
              return { ...a, unlockedAt: new Date().toISOString() };
            }
            return a;
          });
          return { habits: nextHabits, achievements, habitsOrder: [...state.habitsOrder, id] };
        });
      },

      toggleHabit: (habitId, dateStr) => {
        const finalDate = dateStr || getLocalDateString();
        set((state) => {
          const existingLogIndex = state.logs.findIndex(
            (l) => l.habitId === habitId && l.date === finalDate
          );

          let nextLogs = [...state.logs];
          let completed = false;

          if (existingLogIndex >= 0) {
            nextLogs.splice(existingLogIndex, 1);
            completed = false;
          } else {
            const newLog: HabitLog = {
              id: Math.random().toString(36).substring(2, 9),
              habitId,
              date: finalDate,
              timestamp: new Date().toISOString(),
            };
            nextLogs.push(newLog);
            completed = true;
          }

          const todayStr = getLocalDateString();
          const nextHabits = state.habits.map((h) => {
            if (h.id === habitId) {
              const completedToday = finalDate === todayStr ? completed : h.completedToday;
              return { ...h, completedToday };
            }
            return h;
          });

          const totalCompleted = nextLogs.length;
          const achievements = state.achievements.map((a) => {
            if (a.id === "day_one" && totalCompleted >= 1 && !a.unlockedAt) {
              return { ...a, unlockedAt: new Date().toISOString() };
            }
            if (a.id === "total_50" && totalCompleted >= 50 && !a.unlockedAt) {
              return { ...a, unlockedAt: new Date().toISOString() };
            }
            return a;
          });

          return { logs: nextLogs, habits: nextHabits, achievements };
        });
      },

      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...updates, id: h.id, createdAt: h.createdAt } : h
          ),
          priorityOrder:
            updates.priority === false
              ? state.priorityOrder.filter((pid) => pid !== id)
              : state.priorityOrder,
        }));
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          logs: state.logs.filter((l) => l.habitId !== id),
          priorityOrder: state.priorityOrder.filter((pid) => pid !== id),
          habitsOrder: state.habitsOrder.filter((hid) => hid !== id),
        }));
      },

      unlockAchievement: (id) => {
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id && !a.unlockedAt
              ? { ...a, unlockedAt: new Date().toISOString() }
              : a
          ),
        }));
      },

      reorderPriorities: (from, to) => {
        set((state) => {
          const order = [...state.priorityOrder];
          const [moved] = order.splice(from, 1);
          order.splice(to, 0, moved);
          return { priorityOrder: order };
        });
      },

      reorderHabits: (from, to) => {
        set((state) => {
          const order = [...state.habitsOrder];
          for (const habit of state.habits) {
            if (!order.includes(habit.id)) {
              order.push(habit.id);
            }
          }
          const [moved] = order.splice(from, 1);
          order.splice(to, 0, moved);
          return { habitsOrder: order };
        });
      },
    }),
    {
      name: "hex-habit-storage",
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
