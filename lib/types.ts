export type Habit = {
  id: string;
  name: string;
  description: string;
  color: string;
  iconName: string;
  repeatDays: boolean[];
  frequency: number;
  reminder: boolean;
  reminderTime?: string;
  priority: boolean;
  streak: number;
  bestStreak: number;
  completedToday: boolean;
  createdAt: string; // ISO string
};

export type HabitLog = {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO string
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlockedAt: string | null; // ISO string or null
};
