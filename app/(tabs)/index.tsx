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
  const loadDemoData = useHabitStore((state) => state.loadDemoData);

  // Dynamic derived stats
  const stats = useMemo(() => {
    return calculateGlobalStats(habits, logs);
  }, [habits, logs]);

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
          todayCompleted={stats.todayCompleted}
          todayScheduled={stats.todayScheduled}
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
