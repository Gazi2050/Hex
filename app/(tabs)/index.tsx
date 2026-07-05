import React, { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useHabits } from "@/lib/hooks/useHabits";
import { useHabitStore } from "@/lib/store";
import { calculateGlobalStats } from "@/lib/derived/stats";
import { getContributionGraphData, getBarChartData } from "@/lib/derived/contribution";
import StreakHeroCard from "@/components/home/streak-hero-card";
import HistoryCard from "@/components/home/history-card";
import { HabitRow } from "@/components/custom/habit-row";
import { Hexagon } from "lucide-react-native";

export default function Index() {
  const insets = useSafeAreaInsets();
  const { sortedHabits, handleToggle } = useHabits();
  const habits = useHabitStore((state) => state.habits);
  const logs = useHabitStore((state) => state.logs);
  const achievements = useHabitStore((state) => state.achievements);

  const unlockedAchievementsCount = useMemo(() => {
    return achievements.filter((a) => a.unlockedAt !== null).length;
  }, [achievements]);

  // Dynamic derived stats
  const stats = useMemo(() => {
    return calculateGlobalStats(habits, logs);
  }, [habits, logs]);

  // Derived heatmap values (112 days / 16 weeks)
  const heatmapData = useMemo(() => {
    return getContributionGraphData(logs, 112);
  }, [logs]);

  // Derived bar chart values (last 14 days)
  const barData = useMemo(() => {
    return getBarChartData(logs, 14);
  }, [logs]);

  return (
    <View className="flex-1 bg-bg-canvas">
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ 
          paddingBottom: insets.bottom + 120, 
          paddingTop: Math.max(insets.top, 20), 
          paddingHorizontal: 16 
        }}
      >
        {/* 1. ScreenHeader */}
        <View className="mb-6 flex-row justify-between items-center mt-2">
          <View>
            <Text className="text-heading-xl text-text-primary font-bold">Today</Text>
            <Text className="text-body-sm text-text-muted mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>

        {/* 2. StreakHeroCard */}
        <StreakHeroCard
          streak={stats.streak}
          bestStreak={stats.bestStreak}
          totalDone={stats.totalDone}
          achievements={unlockedAchievementsCount}
          todayCompleted={stats.todayCompleted}
          todayScheduled={stats.todayScheduled}
        />

        {/* 3. HistoryCard */}
        <View>
          <HistoryCard heatmapData={heatmapData} barData={barData} />
        </View>

        {/* 4. HabitList */}
        <View className="mb-6">
          <Text className="text-body-sm font-semibold text-text-ash uppercase tracking-wider mb-3">
            Habits
          </Text>
          
          <View className="rounded-2xl border border-border-hairline overflow-hidden">
            {sortedHabits.length > 0 ? (
              sortedHabits.map((habit) => (
                <HabitRow
                  key={habit.id}
                  habit={habit}
                  onToggle={handleToggle}
                />
              ))
            ) : (
              <View style={{ backgroundColor: "#0D0D0D" }} className="p-8 items-center justify-center">
                <Hexagon size={48} color="#6A6B6C" strokeWidth={1.5} className="mb-4" />
                <Text className="text-body-md text-text-muted text-center font-medium">
                  No habits scheduled for today.
                </Text>
                <Text className="text-body-sm text-text-ash text-center mt-1 font-medium">
                  Tap the + button to create a new habit!
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
