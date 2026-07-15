import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Habit, HabitLog, Achievement } from "@/lib/types";
import { useHabitStore, getLocalDateString } from "@/lib/store";
import { calculateCurrentStreak, calculateBestStreak } from "@/lib/derived/stats";

export const SEED_FLAG_KEY = "hex-demo-seeded";

const DAY_RANGE = 180;
const CREATION_BUFFER = 10;
const PRNG_SEED = 42;

function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type DemoHabitSpec = {
  id: string;
  name: string;
  iconName: string;
  color: string;
  repeatDays: boolean[];
  priority: boolean;
  targetRate: number;
};

const DEMO_HABIT_SPECS: DemoHabitSpec[] = [
  { id: "demo-1", name: "Drink Water", iconName: "Droplets", color: "#57C1FF", repeatDays: [true, true, true, true, true, true, true], priority: true, targetRate: 0.80 },
  { id: "demo-2", name: "Morning Workout", iconName: "Dumbbell", color: "#FB7185", repeatDays: [true, true, true, true, true, false, false], priority: false, targetRate: 0.50 },
  { id: "demo-3", name: "Read 20min", iconName: "BookOpen", color: "#A78BFA", repeatDays: [true, true, true, true, true, true, true], priority: true, targetRate: 0.65 },
  { id: "demo-4", name: "Meditate", iconName: "Brain", color: "#59D499", repeatDays: [true, true, true, true, true, true, true], priority: false, targetRate: 0.45 },
  { id: "demo-5", name: "Sleep Before 11pm", iconName: "Moon", color: "#FBBF24", repeatDays: [true, true, true, true, true, true, true], priority: false, targetRate: 0.40 },
  { id: "demo-6", name: "Journal", iconName: "Pencil", color: "#F97316", repeatDays: [true, true, true, true, true, false, false], priority: false, targetRate: 0.55 },
  { id: "demo-7", name: "Walk 5k Steps", iconName: "Footprints", color: "#94A3B8", repeatDays: [true, true, true, true, true, true, true], priority: false, targetRate: 0.70 },
];

function buildRepeatDescription(repeatDays: boolean[]): string {
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const active = repeatDays
    .map((on, i) => (on ? dayNames[i] : null))
    .filter((d): d is string => d !== null);
  return active.length === 7
    ? "Every day \u2022 1x/day"
    : `${active.join(", ")} \u2022 1x/day`;
}

function generateDemoState(): {
  habits: Habit[];
  logs: HabitLog[];
  achievements: Achievement[];
  priorityOrder: string[];
  habitsOrder: string[];
} {
  const prng = mulberry32(PRNG_SEED);
  const now = new Date();

  const creationDate = new Date(now);
  creationDate.setDate(creationDate.getDate() - (DAY_RANGE + CREATION_BUFFER));
  const createdAtIso = creationDate.toISOString();
  const createdAtDateStr = getLocalDateString(creationDate);

  const habits: Habit[] = DEMO_HABIT_SPECS.map((spec) => ({
    id: spec.id,
    name: spec.name,
    description: buildRepeatDescription(spec.repeatDays),
    color: spec.color,
    iconName: spec.iconName,
    repeatDays: spec.repeatDays,
    frequency: 1,
    reminder: false,
    priority: spec.priority,
    streak: 0,
    bestStreak: 0,
    createdAt: createdAtIso,
    createdAtDate: createdAtDateStr,
  }));

  const logs: HabitLog[] = [];

  for (const spec of DEMO_HABIT_SPECS) {
    for (let i = 0; i < DAY_RANGE; i++) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      const dayOfWeek = (day.getDay() + 6) % 7;
      if (!spec.repeatDays[dayOfWeek]) continue;
      if (prng() < spec.targetRate) {
        const dateStr = getLocalDateString(day);
        const hour = Math.floor(prng() * 24);
        const minute = Math.floor(prng() * 60);
        day.setHours(hour, minute, 0, 0);
        logs.push({
          id: `${spec.id}|${dateStr}`,
          habitId: spec.id,
          date: dateStr,
          timestamp: day.toISOString(),
        });
      }
    }
  }

  for (const habit of habits) {
    habit.streak = calculateCurrentStreak(habit.id, logs);
    habit.bestStreak = calculateBestStreak(habit.id, logs);
  }

  const sortedByTime = [...logs].sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp)
  );
  const firstLogTs = sortedByTime.length > 0 ? sortedByTime[0].timestamp : null;
  const fiftiethLogTs =
    sortedByTime.length >= 50 ? sortedByTime[49].timestamp : null;
  const anyStreak7 = habits.some((h) => h.streak >= 7 || h.bestStreak >= 7);
  const streak7Ts = anyStreak7
    ? new Date(
        creationDate.getTime() + 7 * 24 * 60 * 60 * 1000
      ).toISOString()
    : null;

  const achievements: Achievement[] = [
    { id: "first_habit", title: "First Habit", description: "Created your first habit", unlockedAt: createdAtIso },
    { id: "day_one", title: "Day One", description: "Completed your first habit", unlockedAt: firstLogTs },
    { id: "streak_7", title: "Streak Master", description: "Reached a 7-day streak", unlockedAt: streak7Ts },
    { id: "total_50", title: "Century Club", description: "Completed habits 50 times", unlockedAt: fiftiethLogTs },
  ];

  const priorityOrder = DEMO_HABIT_SPECS.filter((s) => s.priority).map((s) => s.id);
  const habitsOrder = DEMO_HABIT_SPECS.map((s) => s.id);

  return { habits, logs, achievements, priorityOrder, habitsOrder };
}

function waitHydrated(): Promise<void> {
  if (useHabitStore.persist.hasHydrated()) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const unsub = useHabitStore.persist.onFinishHydration(() => {
      unsub();
      resolve();
    });
  });
}

export async function applyDemoData(): Promise<boolean> {
  try {
    console.log("[seed] applyDemoData started");

    await waitHydrated();
    console.log("[seed] hydration complete");

    const flag = await AsyncStorage.getItem(SEED_FLAG_KEY);
    const habitCount = useHabitStore.getState().habits.length;
    console.log("[seed] flag check: hex-demo-seeded =", JSON.stringify(flag));
    console.log("[seed] habits in store:", habitCount);

    if (flag === "1" && habitCount > 0) {
      console.log("[seed] SKIPPED: already seeded with data");
      return false;
    }

    const data = generateDemoState();
    console.log("[seed] generating demo data...");
    useHabitStore.setState(data);
    await AsyncStorage.setItem(SEED_FLAG_KEY, "1");
    console.log(
      "[seed] DONE: wrote",
      data.habits.length,
      "habits,",
      data.logs.length,
      "logs"
    );

    return true;
  } catch (e) {
    console.warn("[seed] ERROR:", e);
    throw e;
  }
}
