import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Habit, HabitLog, Achievement } from "./types";
import { mergeOrder, orderFromPositions } from "./order";

export interface HabitState {
  habits: Habit[];
  logs: HabitLog[];
  achievements: Achievement[];
  priorityOrder: string[];
  habitsOrder: string[];
  addHabit: (habit: Omit<Habit, "id" | "streak" | "bestStreak" | "createdAt" | "createdAtDate">) => void;
  toggleHabit: (id: string, dateStr?: string) => void;
  updateHabit: (id: string, updates: Partial<Omit<Habit, "id" | "createdAt">>) => void;
  deleteHabit: (id: string) => void;
  unlockAchievement: (id: string) => void;
  applyHabitsOrder: (positions: Record<string, number>) => void;
  applyPriorityOrder: (positions: Record<string, number>) => void;
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

const reconcileOrder = (order: string[] | undefined, ids: string[]): string[] => {
  const valid = (Array.isArray(order) ? order : []).filter(
    (id) => typeof id === "string" && ids.includes(id)
  );
  const next = [...new Set(valid)];
  for (const id of ids) {
    if (!next.includes(id)) next.push(id);
  }
  return next;
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

export const MAX_HABITS = 8;

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      habits: [],
      logs: [],
      achievements: DEFAULT_ACHIEVEMENTS,
      priorityOrder: [],
      habitsOrder: [],

      addHabit: (newHabit) => {
        if (get().habits.length >= MAX_HABITS) return;
        const id = Math.random().toString(36).substring(2, 9);
        const habit: Habit = {
          ...newHabit,
          priority: newHabit.priority ?? false,
          id,
          streak: 0,
          bestStreak: 0,
          createdAt: new Date().toISOString(),
          createdAtDate: getLocalDateString(),
        };
        set((state) => {
          const nextHabits = [...state.habits, habit];
          const achievements = state.achievements.map((a) => {
            if (a.id === "first_habit" && !a.unlockedAt) {
              return { ...a, unlockedAt: new Date().toISOString() };
            }
            return a;
          });
          return {
            habits: nextHabits,
            achievements,
            habitsOrder: [...state.habitsOrder, id],
            priorityOrder: habit.priority
              ? [...state.priorityOrder, id]
              : state.priorityOrder,
          };
        });
      },

      toggleHabit: (habitId, dateStr) => {
        const finalDate = dateStr || getLocalDateString();
        set((state) => {
          const existingLogIndex = state.logs.findIndex(
            (l) => l.habitId === habitId && l.date === finalDate
          );

          const nextLogs = [...state.logs];

          if (existingLogIndex >= 0) {
            nextLogs.splice(existingLogIndex, 1);
          } else {
            const newLog: HabitLog = {
              id: Math.random().toString(36).substring(2, 9),
              habitId,
              date: finalDate,
              timestamp: new Date().toISOString(),
            };
            nextLogs.push(newLog);
          }

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

          return { logs: nextLogs, achievements };
        });
      },

      updateHabit: (id, updates) => {
        set((state) => {
          const current = state.habits.find((h) => h.id === id);
          const wasPriority = current?.priority ?? false;
          const willBePriority = updates.priority ?? wasPriority;

          let priorityOrder = state.priorityOrder;
          if (!wasPriority && willBePriority) {
            priorityOrder = [...priorityOrder.filter((pid) => pid !== id), id];
          } else if (wasPriority && !willBePriority) {
            priorityOrder = priorityOrder.filter((pid) => pid !== id);
          }

          return {
            habits: state.habits.map((h) =>
              h.id === id ? { ...h, ...updates, id: h.id, createdAt: h.createdAt } : h
            ),
            priorityOrder,
          };
        });
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

      applyHabitsOrder: (positions) => {
        set((state) => {
          const habitIds = state.habits.map((h) => h.id);
          const ordered = orderFromPositions(positions);
          const order = mergeOrder(ordered, state.habitsOrder).filter((id) =>
            habitIds.includes(id)
          );
          for (const id of habitIds) {
            if (!order.includes(id)) order.push(id);
          }
          return { habitsOrder: order };
        });
      },

      applyPriorityOrder: (positions) => {
        set((state) => {
          const priorityIds = state.habits
            .filter((h) => h.priority)
            .map((h) => h.id);
          const ordered = orderFromPositions(positions);
          const order = mergeOrder(ordered, state.priorityOrder);
          for (const id of priorityIds) {
            if (!order.includes(id)) order.push(id);
          }
          return {
            priorityOrder: order.filter((id) => priorityIds.includes(id)),
          };
        });
      },
    }),
    {
      name: "hex-habit-storage",
      storage: createJSONStorage(() => safeStorage),
      version: 5,
      migrate: (persisted, version) => {
        if (!persisted || typeof persisted !== "object") return persisted;
        const state = persisted as {
          habits?: Array<Record<string, unknown>>;
          logs?: Array<Record<string, unknown>>;
          priorityOrder?: string[];
          habitsOrder?: string[];
          [k: string]: unknown;
        };
        if (version < 2 && Array.isArray(state.habits)) {
          state.habits = state.habits.map((h) => {
            if (h && typeof h === "object") {
              const { completedToday: _drop, ...rest } = h;
              return rest;
            }
            return h;
          });
        }
        if (version < 3) {
          if (Array.isArray(state.habits)) {
            state.habits = state.habits.filter(
              (h) => !(typeof h?.id === "string" && h.id.startsWith("demo-"))
            );
          }
          if (Array.isArray(state.logs)) {
            state.logs = state.logs.filter(
              (l) => !(typeof l?.habitId === "string" && l.habitId.startsWith("demo-"))
            );
          }
          if (Array.isArray(state.priorityOrder)) {
            state.priorityOrder = state.priorityOrder.filter(
              (id) => !id.startsWith("demo-")
            );
          }
          if (Array.isArray(state.habitsOrder)) {
            state.habitsOrder = state.habitsOrder.filter(
              (id) => !id.startsWith("demo-")
            );
          }
        }
        if (version < 4) {
          const habitIds = Array.isArray(state.habits)
            ? state.habits
                .map((h) => h?.id)
                .filter((id): id is string => typeof id === "string")
            : [];
          const priorityIds = Array.isArray(state.habits)
            ? state.habits
                .filter((h) => !!h?.priority)
                .map((h) => h?.id)
                .filter((id): id is string => typeof id === "string")
            : [];
          state.habitsOrder = reconcileOrder(state.habitsOrder, habitIds);
          state.priorityOrder = reconcileOrder(state.priorityOrder, priorityIds);
        }
        if (version < 5) {
          // Cap at MAX_HABITS: keep the first 8 in display order, drop the rest.
          const order = Array.isArray(state.habitsOrder)
            ? state.habitsOrder.filter((id): id is string => typeof id === "string")
            : [];
          const keep = new Set(order.slice(0, 8));
          if (Array.isArray(state.habits)) {
            state.habits = state.habits.filter(
              (h) => typeof h?.id === "string" && keep.has(h.id)
            );
          }
          if (Array.isArray(state.logs)) {
            state.logs = state.logs.filter(
              (l) => typeof l?.habitId === "string" && keep.has(l.habitId)
            );
          }
          state.habitsOrder = order.slice(0, 8);
          if (Array.isArray(state.priorityOrder)) {
            state.priorityOrder = state.priorityOrder.filter(
              (id) => typeof id === "string" && keep.has(id)
            );
          }
        }
        return state;
      },
      onRehydrateStorage: () => {
        return () => {
          AsyncStorage.removeItem("hex-demo-seeded").catch(() => {});
          AsyncStorage.removeItem("hex-demo-seeded-v2").catch(() => {});
        };
      },
    }
  )
);
