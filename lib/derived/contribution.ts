import type { HabitLog } from "../types";
import { getLocalDateString } from "../store";

export function getContributionGraphData(
  logs: HabitLog[],
  numDays = 112
): { date: string; count: number }[] {
  const days = [];
  const start = new Date();
  start.setDate(start.getDate() - (numDays - 1));

  // Map counts per date YYYY-MM-DD
  const countsByDate: Record<string, number> = {};
  logs.forEach((log) => {
    countsByDate[log.date] = (countsByDate[log.date] || 0) + 1;
  });

  for (let i = 0; i < numDays; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dateStr = getLocalDateString(date);

    days.push({
      date: dateStr,
      count: countsByDate[dateStr] || 0,
    });
  }

  return days;
}

export function getBarChartData(
  logs: HabitLog[],
  numDays = 14
): { label: string; completions: number; dayOfMonth: number }[] {
  const days = [];
  const start = new Date();
  start.setDate(start.getDate() - (numDays - 1));

  const countsByDate: Record<string, number> = {};
  logs.forEach((log) => {
    countsByDate[log.date] = (countsByDate[log.date] || 0) + 1;
  });

  for (let i = 0; i < numDays; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const dateStr = getLocalDateString(date);

    const weekdayLabel = date.toLocaleDateString("en-US", { weekday: "short" }).substring(0, 1);

    days.push({
      label: weekdayLabel,
      completions: countsByDate[dateStr] || 0,
      dayOfMonth: date.getDate(),
    });
  }

  return days;
}
