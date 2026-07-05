import React, { useMemo } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useHabits } from "@/lib/hooks/useHabits";
import { useHabitStore } from "@/lib/store";
import { calculateGlobalStats } from "@/lib/derived/stats";
import StreakHeroCard from "@/components/home/streak-hero-card";
import { HabitRow } from "@/components/custom/habit-row";
import { Hexagon } from "lucide-react-native";

export default function Index() {
  const insets = useSafeAreaInsets();
  const { sortedHabits, handleToggle } = useHabits();
  const habits = useHabitStore((state) => state.habits);
  const logs = useHabitStore((state) => state.logs);
  const achievements = useHabitStore((state) => state.achievements);
  const loadDemoData = useHabitStore((state) => state.loadDemoData);

  // Dynamic derived stats
  const stats = useMemo(() => {
    return calculateGlobalStats(habits, logs);
  }, [habits, logs]);

  const unlockedAchievementsCount = useMemo(() => {
    return achievements.filter((a) => a.unlockedAt !== null).length;
  }, [achievements]);

  const totalXP = useMemo(() => {
    return (stats.totalDone * 15) + (unlockedAchievementsCount * 50);
  }, [stats.totalDone, unlockedAchievementsCount]);

  const levelInfo = useMemo(() => {
    const xp = totalXP;
    if (xp < 100) {
      return {
        level: 1,
        levelName: "Cinder",
        progress: xp / 100,
      };
    } else if (xp < 300) {
      return {
        level: 2,
        levelName: "Ember",
        progress: (xp - 100) / 200,
      };
    } else if (xp < 600) {
      return {
        level: 3,
        levelName: "Spark",
        progress: (xp - 300) / 300,
      };
    } else if (xp < 1000) {
      return {
        level: 4,
        levelName: "Flame",
        progress: (xp - 600) / 400,
      };
    } else {
      return {
        level: 5,
        levelName: "Blaze",
        progress: 1.0,
      };
    }
  }, [totalXP]);

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
          xp={totalXP}
          todayCompleted={stats.todayCompleted}
          todayScheduled={stats.todayScheduled}
          level={levelInfo.level}
          levelName={levelInfo.levelName}
          levelProgress={levelInfo.progress}
        />

        {/* 3. TaskList */}
        <View className="mb-6">
          <Text className="text-body-sm font-semibold text-text-ash uppercase tracking-wider mb-3">
            Tasks
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
              <View className="bg-bg-surface p-8 items-center justify-center">
                <Hexagon size={48} color="#6A6B6C" strokeWidth={1.5} className="mb-4" />
                <Text className="text-body-md text-text-muted text-center font-medium">
                  No tasks scheduled for today.
                </Text>
                <Text className="text-body-sm text-text-ash text-center mt-1 font-medium">
                  Tap the + button to create a new habit!
                </Text>
                
                <TouchableOpacity 
                  onPress={loadDemoData}
                  className="mt-6 bg-text-accent px-6 py-3 rounded-xl active:opacity-80"
                >
                  <Text className="text-bg-canvas font-bold text-body-md text-center">
                    Load Demo Data
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
