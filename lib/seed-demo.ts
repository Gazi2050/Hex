import type { Habit, HabitLog, Achievement } from "./types";

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function dateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function habitIdForName(name: string): string {
  return `seed-${name.toLowerCase().replace(/\s+/g, "-")}`;
}

const HABIT_DEFS = [
  {
    name: "Meditate",
    description: "Morning meditation for 10 minutes",
    repeatDays: [true, true, true, true, true, true, true],
    pattern: (dayOffset: number) => {
      // 53/60 days — missed roughly 7 days scattered
      const misses = [5, 12, 28, 34, 41, 50, 55];
      return !misses.includes(dayOffset);
    },
  },
  {
    name: "Drink Water",
    description: "Drink 8 glasses of water",
    repeatDays: [true, true, true, true, true, true, true],
    pattern: (dayOffset: number) => {
      // 56/60 days — rarely misses
      const misses = [8, 22, 39, 52];
      return !misses.includes(dayOffset);
    },
  },
  {
    name: "Read",
    description: "Read for 20 minutes",
    repeatDays: [true, true, true, true, true, false, false], // weekdays
    pattern: (dayOffset: number) => {
      // 38/45 weekdays — missed ~7 weekdays
      const misses = [3, 15, 24, 33, 40, 47, 53];
      return !misses.includes(dayOffset);
    },
  },
  {
    name: "Journal",
    description: "Write a daily journal entry",
    repeatDays: [true, false, true, false, true, false, false], // Mon/Wed/Fri
    pattern: (dayOffset: number) => {
      // 21/27 scheduled days — missed ~6
      const misses = [7, 16, 25, 32, 44, 51];
      return !misses.includes(dayOffset);
    },
  },
];

const TOTAL_DAYS = 10;

export function generateDemoData(): {
  habits: Habit[];
  logs: HabitLog[];
  achievements: Achievement[];
} {
  const now = new Date();
  const habits: Habit[] = [];
  const logs: HabitLog[] = [];

  let logId = 0;

  for (const def of HABIT_DEFS) {
    const id = habitIdForName(def.name);
    const createdAt = daysAgo(TOTAL_DAYS);
    createdAt.setHours(8, 0, 0, 0);

    const habit: Habit = {
      id,
      name: def.name,
      description: def.description,
      color: "#59D499",
      iconName: "circle",
      repeatDays: def.repeatDays,
      frequency: 1,
      reminder: true,
      reminderTime: "08:00",
      streak: 0,
      bestStreak: 0,
      completedToday: false,
      createdAt: createdAt.toISOString(),
    };
    habits.push(habit);

    for (let dayOffset = 0; dayOffset < TOTAL_DAYS; dayOffset++) {
      const day = daysAgo(dayOffset);
      const dayOfWeek = (day.getDay() + 6) % 7;

      if (!def.repeatDays[dayOfWeek]) continue;
      if (!def.pattern(dayOffset)) continue;

      logs.push({
        id: `seed-log-${logId++}`,
        habitId: id,
        date: dateStr(day),
        timestamp: day.toISOString(),
      });
    }
  }

  const isToday = (offset: number) => offset === 0;

  habits.forEach((h) => {
    const todayStr = dateStr(now);
    h.completedToday = logs.some(
      (l) => l.habitId === h.id && l.date === todayStr
    );
  });

  const achievements: Achievement[] = [
    { id: "first_habit", title: "First Habit", description: "Created your first habit", unlockedAt: daysAgo(9).toISOString() },
    { id: "day_one", title: "Day One", description: "Completed your first habit", unlockedAt: daysAgo(9).toISOString() },
    { id: "streak_7", title: "Streak Master", description: "Reached a 7-day streak", unlockedAt: daysAgo(2).toISOString() },
    { id: "total_50", title: "Century Club", description: "Completed habits 50 times", unlockedAt: null },
    { id: "streak_14", title: "Fortnight Fire", description: "Reached a 14-day streak", unlockedAt: null },
    { id: "streak_30", title: "Monthly Burn", description: "Reached a 30-day streak", unlockedAt: null },
    { id: "total_100", title: "Century Club", description: "100 total completions", unlockedAt: null },
    { id: "perfect_1", title: "Flawless Day", description: "Completed every scheduled habit in a day", unlockedAt: daysAgo(4).toISOString() },
    { id: "perfect_7", title: "Perfect Week", description: "7 perfect days total", unlockedAt: null },
    { id: "habits_3", title: "Builder", description: "Created 3 habits", unlockedAt: daysAgo(8).toISOString() },
    { id: "first_week", title: "Week One", description: "Tracked habits for 7 consecutive days", unlockedAt: daysAgo(3).toISOString() },
  ];

  return { habits, logs, achievements };
}
