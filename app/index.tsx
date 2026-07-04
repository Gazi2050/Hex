import { FAB } from "@/components/habits/fab";
import { HabitRow } from "@/components/habits/habit-row";
import { ProgressRing } from "@/components/habits/progress-ring";
import { Text } from "@/components/ui/text";
import { MOCK_HABITS, type Habit } from "@/lib/habits";
import { useState } from "react";
import { Alert, FlatList, View } from "react-native";

export default function Index() {
  const [habits, setHabits] = useState<Habit[]>(MOCK_HABITS);

  const completedCount = habits.filter((h) => h.completedToday).length;

  const handleToggle = (id: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, completedToday: !h.completedToday } : h
      )
    );
  };

  const handlePress = (habit: Habit) => {
    Alert.alert(habit.name, `Streak: ${habit.streak} days`);
  };

  const handleAdd = () => {
    Alert.alert("Coming soon", "Add habit form will open here.");
  };

  // Sort: pending first, then completed
  const sorted = [...habits].sort((a, b) => {
    if (a.completedToday === b.completedToday) return 0;
    return a.completedToday ? 1 : -1;
  });

  return (
    <View className="flex-1 bg-bg-canvas">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pb-3 pt-16">
        <View>
          <Text className="text-heading-xl text-text-primary">Today</Text>
          <Text className="text-body-sm text-text-muted mt-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <ProgressRing completed={completedCount} total={habits.length} />
      </View>

      {/* Habit List or Empty State */}
      {habits.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-display-lg text-text-primary text-center">
            Start small
          </Text>
          <Text className="text-body-md text-text-muted mt-3 text-center leading-6">
            Build habits that stick. One day at a time.
          </Text>
          <View className="mt-8 rounded-full bg-cta-bg px-6 py-3 active:bg-cta-pressed">
            <Text className="text-button-md text-text-inverse font-semibold">
              Create your first habit
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HabitRow
              habit={item}
              onToggle={handleToggle}
              onPress={handlePress}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <FAB onPress={handleAdd} />
    </View>
  );
}
