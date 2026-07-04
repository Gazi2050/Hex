import { Text } from "@/components/ui/text";
import { ScrollView, View } from "react-native";

export default function ProgressScreen() {
  return (
    <ScrollView 
      className="flex-1 bg-bg-canvas" 
      contentContainerStyle={{ paddingBottom: 100, paddingTop: 64, paddingHorizontal: 16 }}
    >
      <View className="mb-6">
        <Text className="text-heading-xl text-text-primary">Progress</Text>
        <Text className="text-body-sm text-text-muted mt-1">Track your habit streaks and trends</Text>
      </View>

      {/* Demo Cards */}
      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4 shadow-sm">
        <Text className="text-body-lg font-semibold text-text-primary">Weekly Completion Rate</Text>
        <Text className="text-body-sm text-text-muted mt-1">You completed 84% of your habits this week.</Text>
      </View>

      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4 shadow-sm">
        <Text className="text-body-lg font-semibold text-text-primary">Longest Streak</Text>
        <Text className="text-body-sm text-text-muted mt-1">15 days (Drink Water habit)</Text>
      </View>
    </ScrollView>
  );
}
