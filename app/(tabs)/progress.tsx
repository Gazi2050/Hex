import { useMemo, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  useWindowDimensions,
  Text as RNText,
  Pressable,
  ActivityIndicator,
  InteractionManager,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useHabitStore, getLocalDateString } from "@/lib/store";
import { calculateGlobalStats } from "@/lib/derived/stats";
import {
  calculateTotals,
  dailyPercent,
} from "@/lib/derived/progress-stats";
import { WeeklyBarChart } from "@/components/progress/weekly-bar-chart";
import { MonthProgressRing } from "@/components/progress/month-progress-ring";
import { YearlyAreaChart } from "@/components/progress/yearly-area-chart";
import {
  Flame,
  Trophy,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";

function avgRate(values: (number | null)[]): number | null {
  const valid = values.filter((v): v is number => v !== null);
  return valid.length > 0
    ? valid.reduce((a, b) => a + b, 0) / valid.length
    : null;
}

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const chartWidth = width - 32;

  const habits = useHabitStore((state) => state.habits);
  const logs = useHabitStore((state) => state.logs);

  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [yearOffset, setYearOffset] = useState(0);
  const [deferred, setDeferred] = useState(false);

  useEffect(() => {
    // Defer heavy calculations to after first paint so spinner can render
    const id = setTimeout(() => setDeferred(true), 50);
    return () => clearTimeout(id);
  }, []);

  const defaultStats = { streak: 0, bestStreak: 0, todayCompleted: 0, todayScheduled: 0, totalDone: 0, level: 1, levelName: "Cinder", levelProgress: 0 };
  const defaultTotals = { totalCompleted: 0, totalMissed: 0 };
  const stats = useMemo(() => (deferred ? calculateGlobalStats(habits, logs) : defaultStats), [deferred, habits, logs]);
  const totals = useMemo(() => (deferred ? calculateTotals(habits, logs) : defaultTotals), [deferred, habits, logs]);

  const yearlyData = useMemo(() => {
    if (!deferred) return { months: [] as { month: string; rate: number | null; completed: number; scheduled: number; missed: number }[], rate: null as number | null, totalCompleted: 0, totalScheduled: 0, totalMissed: 0 };
    const logSet = new Set(logs.map((l) => `${l.habitId}|${l.date}`));
    const now = new Date();
    const year = now.getFullYear() + yearOffset;

    const allRates: (number | null)[] = [];
    let totalCompleted = 0;
    let totalScheduled = 0;
    let totalMissed = 0;
    const months: { month: string; rate: number | null; completed: number; scheduled: number; missed: number }[] = [];

    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      const stopDay = yearOffset === 0 && m === now.getMonth() ? now.getDate() : daysInMonth;

      const monthRates: (number | null)[] = [];
      let monthCompleted = 0;
      let monthScheduled = 0;
      let monthMissed = 0;

      for (let day = 1; day <= stopDay; day++) {
        const d = new Date(year, m, day);
        const dp = dailyPercent(d, habits, logSet);
        monthRates.push(dp.pct);
        allRates.push(dp.pct);
        monthCompleted += dp.completed;
        monthScheduled += dp.scheduled;
        monthMissed += dp.missed;
      }

      months.push({
        month: new Date(year, m, 1).toLocaleDateString("en-US", { month: "short" }),
        rate: avgRate(monthRates),
        completed: monthCompleted,
        scheduled: monthScheduled,
        missed: monthMissed,
      });

      totalCompleted += monthCompleted;
      totalScheduled += monthScheduled;
      totalMissed += monthMissed;
    }

    return { months, rate: avgRate(allRates), totalCompleted, totalScheduled, totalMissed };
  }, [deferred, habits, logs, yearOffset]);

  // ── Weekly data (offset-aware) ──────────────────────────────────────────
  const weekBars = useMemo(() => {
    if (!deferred) return [];
    const logSet = new Set(logs.map((l) => `${l.habitId}|${l.date}`));
    const today = new Date();
    const todayStr = getLocalDateString(today);
    const sun = new Date(today);
    sun.setDate(sun.getDate() - sun.getDay()); // this week's Sunday
    sun.setDate(sun.getDate() + weekOffset * 7);
    sun.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(sun);
      d.setDate(sun.getDate() + i);
      const dateStr = getLocalDateString(d);
      const dp = dailyPercent(d, habits, logSet);
      const isFuture = dateStr > todayStr;
      return {
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: dateStr,
        pct: dp.pct ?? 0,
        completed: dp.completed,
        scheduled: dp.scheduled,
        missed: dp.missed,
        hasData: dp.pct !== null && !isFuture,
      };
    });
  }, [deferred, habits, logs, weekOffset]);

  const weekValidDays = useMemo(
    () => weekBars.filter((d) => d.hasData).length,
    [weekBars]
  );
  const weekAvg = useMemo(() => {
    const valid = weekBars.filter((d) => d.hasData);
    return valid.length > 0
      ? valid.reduce((s, d) => s + d.pct, 0) / valid.length
      : null;
  }, [weekBars]);
  const weekCompleted = useMemo(() => weekBars.reduce((s, d) => s + d.completed, 0), [weekBars]);
  const weekMissed = useMemo(() => weekBars.reduce((s, d) => s + d.missed, 0), [weekBars]);

  // ── Monthly data (offset-aware) ─────────────────────────────────────────
  const monthData = useMemo(() => {
    if (!deferred) return { rate: null, completed: 0, scheduled: 0, missed: 0, validDays: 0, firstDate: new Date(), lastDate: new Date() };
    const logSet = new Set(logs.map((l) => `${l.habitId}|${l.date}`));
    const today = new Date();
    const base = new Date(today);
    base.setMonth(base.getMonth() + monthOffset);
    const firstOfMonth = new Date(base.getFullYear(), base.getMonth(), 1);
    const daysInM = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    const stopDay =
      monthOffset === 0
        ? Math.min(today.getDate(), daysInM)
        : daysInM;

    const rates: (number | null)[] = [];
    let totalCompleted = 0;
    let totalScheduled = 0;
    let totalMissed = 0;

    for (let day = 1; day <= stopDay; day++) {
      const d = new Date(base.getFullYear(), base.getMonth(), day);
      const dp = dailyPercent(d, habits, logSet);
      rates.push(dp.pct);
      totalCompleted += dp.completed;
      totalScheduled += dp.scheduled;
      totalMissed += dp.missed;
    }

    return {
      rate: avgRate(rates),
      completed: totalCompleted,
      scheduled: totalScheduled,
      missed: totalMissed,
      validDays: rates.filter((r) => r !== null).length,
      firstDate: firstOfMonth,
      lastDate: new Date(base.getFullYear(), base.getMonth(), stopDay),
    };
  }, [deferred, habits, logs, monthOffset]);

  return (
    <ScrollView
      className="flex-1 bg-bg-canvas"
      contentContainerStyle={{
        paddingBottom: insets.bottom + 120,
        paddingTop: Math.max(insets.top, 20),
        paddingHorizontal: 16,
      }}
    >
      {/* Header */}
      <View className="mb-6 items-center mt-2">
        <Text className="text-heading-xl text-text-primary font-bold">Progress</Text>
        <Text className="text-body-sm text-text-muted mt-1">
          Track your habit streaks and trends
        </Text>
      </View>

      {!deferred ? (
        <View className="items-center justify-center" style={{ paddingTop: 120 }}>
          <ActivityIndicator size="large" color="#59D499" />
        </View>
      ) : (
        <>
          {/* Stats row — 2×2 grid of individual cards */}
          <View className="mb-4 gap-3">
            <View className="flex-row gap-3">
          {[
            { icon: Flame, label: "Current", value: `${stats.streak} days` },
            { icon: Trophy, label: "Longest", value: `${stats.bestStreak} days` },
          ].map((item, i) => (
            <View
              key={i}
              className="flex-1 rounded-2xl border border-border-hairline bg-bg-surface p-3 items-center"
            >
              <item.icon size={22} color="#59D499" strokeWidth={2.5} />
              <Text className="font-bold mt-2" style={{ fontSize: 10, color: "#6A6B6C" }}>
                {item.label}
              </Text>
              <Text className="text-heading-sm font-bold mt-1" style={{ color: "#F4F4F6" }}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
        <View className="flex-row gap-3">
          {[
            { icon: CheckCircle2, label: "Completed", value: `${totals.totalCompleted}` },
            { icon: XCircle, label: "Missed", value: `${totals.totalMissed}` },
          ].map((item, i) => (
            <View
              key={i}
              className="flex-1 rounded-2xl border border-border-hairline bg-bg-surface p-3 items-center"
            >
              <item.icon size={22} color="#59D499" strokeWidth={2.5} />
              <Text className="font-bold mt-2" style={{ fontSize: 10, color: "#6A6B6C" }}>
                {item.label}
              </Text>
              <Text className="text-heading-sm font-bold mt-1" style={{ color: "#F4F4F6" }}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Weekly bar chart */}
      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => setWeekOffset((w) => w - 1)}
              className="w-7 h-7 items-center justify-center rounded-sm border border-border-hairline bg-bg-surface/50 mr-0.5"
            >
              <ChevronLeft size={16} color="#9C9C9D" />
            </Pressable>
            <Pressable
              onPress={() => setWeekOffset((w) => Math.min(0, w + 1))}
              className="w-7 h-7 items-center justify-center rounded-sm border border-border-hairline bg-bg-surface/50 mr-2"
              disabled={weekOffset === 0}
            >
              <ChevronRight
                size={16}
                color={weekOffset === 0 ? "#3A3A3C" : "#9C9C9D"}
              />
            </Pressable>
            <RNText>
              <Text className="font-bold" style={{ fontSize: 13, color: "#9C9C9D" }}>
                {weekOffset === 0 ? "This Week" : "Week"}
              </Text>
              {weekBars.length > 0 && (
                <Text
                  className="font-bold ml-2"
                  style={{ fontSize: 10, color: "#6A6B6C" }}
                >
                  {"  "}
                  {new Date(weekBars[0].date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                  {" – "}
                  {new Date(weekBars[6].date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              )}
            </RNText>
          </View>
        </View>
        <WeeklyBarChart data={weekBars} />
        <Text
          className="font-bold mt-1 text-center"
          style={{ fontSize: 11, color: "#6A6B6C" }}
        >
          {weekAvg !== null
            ? `${Math.round(weekAvg * 100)}% avg · ${weekCompleted} completed · ${weekMissed} missed`
            : "No data this week"}
        </Text>
      </View>

      {/* Month progress ring */}
      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4">
        <View className="flex-row items-center mb-3">
          <Pressable
            onPress={() => setMonthOffset((m) => m - 1)}
            className="w-7 h-7 items-center justify-center rounded-sm border border-border-hairline bg-bg-surface/50 mr-0.5"
          >
            <ChevronLeft size={16} color="#9C9C9D" />
          </Pressable>
          <Pressable
            onPress={() => setMonthOffset((m) => Math.min(0, m + 1))}
            className="w-7 h-7 items-center justify-center rounded-sm border border-border-hairline bg-bg-surface/50 mr-2"
            disabled={monthOffset === 0}
          >
            <ChevronRight
              size={16}
              color={monthOffset === 0 ? "#3A3A3C" : "#9C9C9D"}
            />
          </Pressable>
          <RNText>
            <Text className="font-bold" style={{ fontSize: 13, color: "#9C9C9D" }}>
              {monthOffset === 0 ? "This Month" : monthData.firstDate.toLocaleDateString("en-US", { month: "long" })}
            </Text>
            <Text
              className="font-bold ml-2"
              style={{ fontSize: 10, color: "#6A6B6C" }}
            >
              {"  "}
              {monthData.firstDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              {" – "}
              {monthData.lastDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </Text>
          </RNText>
        </View>
        <View className="items-center">
          <MonthProgressRing rate={monthData.rate} />
          <Text
            className="font-bold mt-1"
            style={{ fontSize: 11, color: "#6A6B6C" }}
          >
            {monthData.rate !== null
              ? `${Math.round(monthData.rate * 100)}% avg · ${monthData.completed} completed · ${monthData.missed} missed`
              : "No data this month"}
          </Text>
        </View>
      </View>

      {/* Yearly area chart */}
      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4">
        <View className="flex-row items-center mb-3">
          <Pressable
            onPress={() => setYearOffset((y) => y - 1)}
            className="w-7 h-7 items-center justify-center rounded-sm border border-border-hairline bg-bg-surface/50 mr-0.5"
          >
            <ChevronLeft size={16} color="#9C9C9D" />
          </Pressable>
          <Pressable
            onPress={() => setYearOffset((y) => Math.min(0, y + 1))}
            className="w-7 h-7 items-center justify-center rounded-sm border border-border-hairline bg-bg-surface/50 mr-2"
            disabled={yearOffset === 0}
          >
            <ChevronRight
              size={16}
              color={yearOffset === 0 ? "#3A3A3C" : "#9C9C9D"}
            />
          </Pressable>
          <RNText>
            <Text className="font-bold" style={{ fontSize: 13, color: "#9C9C9D" }}>
              {yearOffset === 0 ? "This Year" : String(new Date().getFullYear() + yearOffset)}
            </Text>
            {yearlyData.months.length > 0 && (
              <Text
                className="font-bold ml-2"
                style={{ fontSize: 10, color: "#6A6B6C" }}
              >
                {"  "}
                {yearlyData.months[0].month} – {yearlyData.months[yearlyData.months.length - 1].month}
              </Text>
            )}
          </RNText>
        </View>
        <YearlyAreaChart
          data={yearlyData.months.map((m) => ({ month: m.month, rate: m.rate }))}
          width={chartWidth - 32}
        />
        <Text
          className="font-bold mt-5 text-center"
          style={{ fontSize: 11, color: "#6A6B6C" }}
        >
          {yearlyData.rate !== null
            ? `${Math.round(yearlyData.rate * 100)}% avg · ${yearlyData.totalCompleted} completed · ${yearlyData.totalMissed} missed`
            : "No data this year"}
        </Text>
      </View>
        </>
      )}
    </ScrollView>
  );
}
