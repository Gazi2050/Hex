import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useHabits } from "@/lib/hooks/useHabits";
import { useHabitStore } from "@/lib/store";
import { useUIStore } from "@/lib/ui-store";
import { calculateGlobalStats } from "@/lib/derived/stats";
import StreakHeroCard from "@/components/home/streak-hero-card";
import { SortablePriorityList } from "@/components/custom/sortable-priority-list";
import { HabitDetailSheet } from "@/components/custom/habit-detail-sheet";
import { Hexagon } from "lucide-react-native";

export default function Index() {
  const insets = useSafeAreaInsets();
  const { priorityHabits, handleToggle } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const habits = useHabitStore((state) => state.habits);
  const logs = useHabitStore((state) => state.logs);
  const requestDelete = useUIStore((s) => s.requestDelete);

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
        <View className="mb-4 items-center mt-2">
          <Text className="text-heading-xl text-text-primary font-bold">Today</Text>
          <Text className="text-body-sm text-text-muted mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
 
        <StreakHeroCard
          streak={stats.streak}
          bestStreak={stats.bestStreak}
          todayCompleted={stats.todayCompleted}
          todayScheduled={stats.todayScheduled}
        />

        <View className="mb-6">
          <Text className="text-body-sm font-semibold text-text-ash uppercase tracking-wider mb-3">
            Priorities
          </Text>
          
          {priorityHabits.length > 0 ? (
            <SortablePriorityList
              habits={priorityHabits}
              onToggle={handleToggle}
              onPress={(h) => setSelectedHabitId(h.id)}
              onLongPress={(h) => requestDelete(h.id)}
            />
          ) : (
            <View className="rounded-2xl border border-border-hairline overflow-hidden">
              <View className="bg-bg-surface p-8 items-center justify-center">
                <Hexagon size={48} color="#6A6B6C" strokeWidth={1.5} className="mb-4" />
                <Text className="text-body-md text-text-muted text-center font-medium">
                  No priority tasks today
                </Text>
                <Text className="text-body-sm text-text-ash text-center mt-1 font-medium">
                  Mark a habit as priority to pin it here
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <HabitDetailSheet habitId={selectedHabitId} onClose={() => setSelectedHabitId(null)} />
    </View>
  );
}
