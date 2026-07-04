import type { Habit } from "@/lib/types";

export const MOCK_HABITS: Habit[] = [
  {
    id: "1",
    name: "Morning Run",
    description: "30 minutes, before breakfast",
    streak: 12,
    completedToday: true,
    createdAt: new Date("2025-03-01"),
  },
  {
    id: "2",
    name: "Read 20 Pages",
    description: "Any book, any genre",
    streak: 7,
    completedToday: false,
    createdAt: new Date("2025-03-10"),
  },
  {
    id: "3",
    name: "Meditate",
    description: "10 minutes, focus on breath",
    streak: 0,
    completedToday: false,
    createdAt: new Date("2025-04-01"),
  },
];
