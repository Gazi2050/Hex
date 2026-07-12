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
  const monthRate = useMemo(() => calculateMonthRate(habits, logs), [habits, logs]);
  const yearlyTrend = useMemo(() => calculateYearlyTrend(logs), [logs]);
  const totals = useMemo(() => calculateTotals(habits, logs), [habits, logs]);

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
              className="flex-1 rounded-2xl border border-border-hairline bg-bg-surface p-4 items-center"
            >
              <item.icon size={18} color="#FFFFFF" strokeWidth={2.5} />
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
              className="flex-1 rounded-2xl border border-border-hairline bg-bg-surface p-4 items-center"
            >
              <item.icon size={18} color="#FFFFFF" strokeWidth={2.5} />
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
      </View>

      {/* Month progress ring */}
      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-5 flex-row items-center">
        <MonthProgressRing rate={monthRate} />
        <View className="ml-5 flex-1">
          <Text className="font-bold text-xs" style={{ color: "#9C9C9D" }}>This Month</Text>
          <Text
            className="font-bold mt-1.5"
            style={{ fontSize: 28, lineHeight: 32, color: "#F4F4F6" }}
          >
            {Math.round(monthRate * 100)}%
          </Text>
          <Text className="font-bold mt-1" style={{ fontSize: 11, color: "#6A6B6C" }}>
            30-day completion rate
          </Text>
        </View>
      </View>

      {/* Yearly area chart */}
      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4">
        <Text className="font-bold mb-3" style={{ fontSize: 13, color: "#9C9C9D" }}>
          This Year
        </Text>
        <YearlyAreaChart data={yearlyTrend} width={chartWidth - 32} />
      </View>
    </ScrollView>
  );
}