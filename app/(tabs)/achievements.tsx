import { Text } from "@/components/ui/text";
import { ScrollView, View } from "react-native";

export default function AchievementsScreen() {
  return (
    <ScrollView 
      className="flex-1 bg-bg-canvas" 
      contentContainerStyle={{ paddingBottom: 100, paddingTop: 64, paddingHorizontal: 16 }}
    >
      <View className="mb-6">
        <Text className="text-heading-xl text-text-primary">Achievements</Text>
        <Text className="text-body-sm text-text-muted mt-1">Unlock milestones and badges</Text>
      </View>

      {/* Demo Cards */}
      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4 shadow-sm">
        <Text className="text-body-lg font-semibold text-text-primary">Early Bird</Text>
        <Text className="text-body-sm text-text-muted mt-1">Complete a habit before 8:00 AM</Text>
      </View>

      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4 shadow-sm">
        <Text className="text-body-lg font-semibold text-text-primary">Habit Master</Text>
        <Text className="text-body-sm text-text-muted mt-1">Maintain a 30-day streak on any habit</Text>
      </View>
    </ScrollView>
  );
}
