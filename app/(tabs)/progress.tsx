import { useMemo } from "react";
import { ScrollView, View, useWindowDimensions, Text as RNText } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useHabitStore } from "@/lib/store";
import { calculateGlobalStats } from "@/lib/derived/stats";
import {
  calculateWeeklyBars,
  calculateMonthRate,
  calculateYearlyTrend,
  calculateTotals,
} from "@/lib/derived/progress-stats";
import { WeeklyBarChart } from "@/components/progress/weekly-bar-chart";
import { MonthProgressRing } from "@/components/progress/month-progress-ring";
import { YearlyAreaChart } from "@/components/progress/yearly-area-chart";
import { Flame, Trophy, CheckCircle2, XCircle } from "lucide-react-native";

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const chartWidth = width - 32;

  const habits = useHabitStore((state) => state.habits);
  const logs = useHabitStore((state) => state.logs);

  const stats = useMemo(() => calculateGlobalStats(habits, logs), [habits, logs]);
  const weekBars = useMemo(() => calculateWeeklyBars(habits, logs), [habits, logs]);
  const monthData = useMemo(() => calculateMonthRate(habits, logs), [habits, logs]);
  const yearlyData = useMemo(() => calculateYearlyTrend(habits, logs), [habits, logs]);
  const totals = useMemo(() => calculateTotals(habits, logs), [habits, logs]);

  const weekValidDays = useMemo(() => weekBars.filter((d) => d.hasData).length, [weekBars]);
  const weekAvg = useMemo(() => {
    const valid = weekBars.filter((d) => d.hasData);
    return valid.length > 0
      ? valid.reduce((s, d) => s + d.pct, 0) / valid.length
      : null;
  }, [weekBars]);

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
        <View className="flex-row items-center mb-3">
          <RNText>
            <Text className="font-bold" style={{ fontSize: 13, color: "#9C9C9D" }}>
              This Week
            </Text>
            {weekBars.length > 0 && (
              <Text className="font-bold ml-2" style={{ fontSize: 10, color: "#6A6B6C" }}>
                {"  "}
                {new Date(weekBars[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                {" – "}
                {new Date(weekBars[weekBars.length - 1].date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </Text>
            )}
          </RNText>
        </View>
        <WeeklyBarChart data={weekBars} />
        <Text className="font-bold mt-4 text-center" style={{ fontSize: 11, color: "#6A6B6C" }}>
          {weekAvg !== null
            ? `${Math.round(weekAvg * 100)}% avg across ${weekValidDays} day${weekValidDays !== 1 ? "s" : ""}`
            : "No data this week"}
        </Text>
      </View>

      {/* Month progress ring */}
      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4">
        <View className="flex-row items-center mb-3">
          <RNText>
            <Text className="font-bold" style={{ fontSize: 13, color: "#9C9C9D" }}>
              This Month
            </Text>
            <Text className="font-bold ml-2" style={{ fontSize: 10, color: "#6A6B6C" }}>
              {"  "}
              {(() => {
                const today = new Date();
                const first = new Date(today.getFullYear(), today.getMonth(), 1);
                return `${first.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${today.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
              })()}
            </Text>
          </RNText>
        </View>
        <View className="items-center">
          <MonthProgressRing rate={monthData.rate} />
          <Text className="font-bold mt-4" style={{ fontSize: 11, color: "#6A6B6C" }}>
            {monthData.rate !== null
              ? `${Math.round(monthData.rate * 100)}% avg across ${monthData.validDays} day${monthData.validDays !== 1 ? "s" : ""}`
              : "No data this month"}
          </Text>
        </View>
      </View>

      {/* Yearly area chart */}
      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4">
        <View className="flex-row items-center mb-3">
          <RNText>
            <Text className="font-bold" style={{ fontSize: 13, color: "#9C9C9D" }}>
              This Year
            </Text>
            {yearlyData.months.length > 0 && (
              <Text className="font-bold ml-2" style={{ fontSize: 10, color: "#6A6B6C" }}>
                {"  "}
                {yearlyData.months[0].month} – {yearlyData.months[yearlyData.months.length - 1].month}
              </Text>
            )}
          </RNText>
        </View>
        <YearlyAreaChart data={yearlyData.months.map((m) => ({ month: m.month, rate: m.rate }))} width={chartWidth - 32} />
        <Text className="font-bold mt-5 text-center" style={{ fontSize: 11, color: "#6A6B6C" }}>
          {yearlyData.rate !== null
            ? `${Math.round(yearlyData.rate * 100)}% avg across ${yearlyData.totalCompleted + yearlyData.totalScheduled} tasks`
            : "No data this year"}
        </Text>
      </View>
    </ScrollView>
  );
}