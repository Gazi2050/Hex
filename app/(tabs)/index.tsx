import { Text } from "@/components/ui/text";
import { ScrollView, View } from "react-native";

export default function Index() {
  return (
    <ScrollView 
      className="flex-1 bg-bg-canvas" 
      contentContainerStyle={{ paddingBottom: 100, paddingTop: 64, paddingHorizontal: 16 }}
    >
      <View className="mb-6">
        <Text className="text-heading-xl text-text-primary">Today's Habits</Text>
        <Text className="text-body-sm text-text-muted mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>

      {/* Demo Cards */}
      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4 shadow-sm">
        <Text className="text-body-lg font-semibold text-text-primary">Drink Water</Text>
        <Text className="text-body-sm text-text-muted mt-1">Goal: 3L • 2L completed today</Text>
      </View>

      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4 shadow-sm">
        <Text className="text-body-lg font-semibold text-text-primary">Read a Book</Text>
        <Text className="text-body-sm text-text-muted mt-1">Goal: 20 pages • Not started yet</Text>
      </View>

      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4 shadow-sm">
        <Text className="text-body-lg font-semibold text-text-primary">Morning Workout</Text>
        <Text className="text-body-sm text-text-muted mt-1">Goal: 30 mins • Completed</Text>
      </View>
    </ScrollView>
  );
}
