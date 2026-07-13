import { useHabitStore } from "./store";
import type { Habit, HabitLog } from "./types";
import { getLocalDateString } from "./store";

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const HABIT_DEFS = [
  { name: "Morning Run", color: "#59D499", freq: 1 },
  { name: "Read 30 Pages", color: "#57C1FF", freq: 1 },
  { name: "Drink 2L Water", color: "#A78BFA", freq: 1 },
  { name: "Study Code", color: "#FB7185", freq: 1 },
  { name: "Gym Session", color: "#FBBF24", freq: 1 },
];

const EVERY_DAY = [true, true, true, true, true, true, true];

export function seedDemoData() {
  const habits: Habit[] = HABIT_DEFS.map((def, i) => ({
    id: `demo-habit-${i}`,
    name: def.name,
    description: `Every day · ${def.freq}x/day`,
    color: def.color,
    iconName: "Hexagon",
    repeatDays: EVERY_DAY as boolean[],
    frequency: def.freq,
    reminder: false,
    priority: i < 3,
    streak: 0,
    bestStreak: 0,
    completedToday: false,
    createdAt: "2022-01-01T00:00:00.000Z",
  }));

  const logs: HabitLog[] = [];
  let logIdx = 0;

  // Jan 2022 through July 2026
  for (let y = 2022; y <= 2026; y++) {
    const endMonth = (y === 2026) ? 6 : 11; // 2026: only Jan–Jul (Jul is index 6, July 13 is the last day)
    for (let m = 0; m <= endMonth; m++) {
      const dim = daysInMonth(y, m);
      const stopDay = (y === 2026 && m === 6) ? 13 : dim; // Stop at Jul 13 for 2026
      const rand = seededRandom(y * 1000 + m * 42 + 7);

      for (let d = 1; d <= stopDay; d++) {
        const date = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

        for (let h = 0; h < habits.length; h++) {
          const r = rand();
          // ~72% completion rate per habit per day
          if (r < 0.72) {
            logs.push({
              id: `demo-log-${logIdx++}`,
              habitId: habits[h].id,
              date,
              timestamp: `${date}T09:00:00.000Z`,
            });
          }
        }
      }
    }
  }

  const todayStr = getLocalDateString();
  const todayLogHabitIds = new Set(
    logs.filter((l) => l.date === todayStr).map((l) => l.habitId)
  );
  habits.forEach((h) => {
    h.completedToday = todayLogHabitIds.has(h.id);
  });

  useHabitStore.setState({
    habits,
    logs,
    achievements: useHabitStore.getState().achievements,
  });

  console.log(
    `Seeded ${habits.length} habits, ${logs.length} logs across Jan 2022 – Jul 2026.`
  );
}
