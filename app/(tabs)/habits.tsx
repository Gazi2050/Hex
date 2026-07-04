import { Text } from "@/components/ui/text";
import { ScrollView, View } from "react-native";

export default function HabitsScreen() {
  return (
    <ScrollView
      className="flex-1 bg-bg-canvas"
      contentContainerStyle={{ paddingBottom: 100, paddingTop: 64, paddingHorizontal: 16 }}
    >
      <View className="mb-6">
        <Text className="text-heading-xl text-text-primary">Habits</Text>
        <Text className="text-body-sm text-text-muted mt-1">All your tracked habits</Text>
      </View>

      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4">
        <Text className="text-body-lg font-semibold text-text-primary">Meditate</Text>
        <Text className="text-body-sm text-text-muted mt-1">Goal: 10 mins daily • 5-day streak</Text>
      </View>

      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4">
        <Text className="text-body-lg font-semibold text-text-primary">Journaling</Text>
        <Text className="text-body-sm text-text-muted mt-1">Goal: 1 entry daily • 3-day streak</Text>
      </View>

      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4">
        <Text className="text-body-lg font-semibold text-text-primary">Cold Shower</Text>
        <Text className="text-body-sm text-text-muted mt-1">Goal: Every morning • 12-day streak</Text>
      </View>
    </ScrollView>
  );
}
