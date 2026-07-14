import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useHabits } from "@/lib/hooks/useHabits";
import { useUIStore } from "@/lib/ui-store";
import { HabitRow } from "@/components/custom/habit-row";
import { HabitDetailSheet } from "@/components/custom/habit-detail-sheet";
import { Hexagon } from "lucide-react-native";

export default function HabitsScreen() {
  const insets = useSafeAreaInsets();
  const { sortedHabits, handleToggle } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const requestDelete = useUIStore((s) => s.requestDelete);

  return (
    <View className="flex-1 bg-bg-canvas">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 120,
          paddingTop: Math.max(insets.top, 20),
          paddingHorizontal: 16,
        }}
      >
        <View className="mb-6 items-center mt-2">
          <Text className="text-heading-xl text-text-primary font-bold">Habits</Text>
          <Text className="text-body-sm text-text-muted mt-1">
            All your tracked habits
          </Text>
        </View>

        <View className="rounded-2xl border border-border-hairline overflow-hidden">
          {sortedHabits.length > 0 ? (
            sortedHabits.map((habit) => (
              <HabitRow
                key={habit.id}
                habit={habit}
                onToggle={handleToggle}
                onPress={(h) => setSelectedHabitId(h.id)}
                onLongPress={(h) => requestDelete(h.id)}
              />
            ))
          ) : (
            <View className="bg-bg-surface p-8 items-center justify-center">
              <Hexagon size={48} color="#6A6B6C" strokeWidth={1.5} className="mb-4" />
              <Text className="text-body-md text-text-muted text-center font-medium">
                No habits yet.
              </Text>
              <Text className="text-body-sm text-text-ash text-center mt-1 font-medium">
                Tap the + button to create a new habit!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <HabitDetailSheet habitId={selectedHabitId} onClose={() => setSelectedHabitId(null)} />
    </View>
  );
}
