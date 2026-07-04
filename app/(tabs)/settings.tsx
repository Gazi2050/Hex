import { Text } from "@/components/ui/text";
import { ScrollView, View } from "react-native";

export default function SettingsScreen() {
  return (
    <ScrollView
      className="flex-1 bg-bg-canvas"
      contentContainerStyle={{ paddingBottom: 100, paddingTop: 64, paddingHorizontal: 16 }}
    >
      <View className="mb-6">
        <Text className="text-heading-xl text-text-primary">Settings</Text>
        <Text className="text-body-sm text-text-muted mt-1">Manage your preferences</Text>
      </View>

      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4">
        <Text className="text-body-lg font-semibold text-text-primary">Notifications</Text>
        <Text className="text-body-sm text-text-muted mt-1">Daily reminders at 8:00 AM</Text>
      </View>

      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4">
        <Text className="text-body-lg font-semibold text-text-primary">Appearance</Text>
        <Text className="text-body-sm text-text-muted mt-1">Dark mode • System font</Text>
      </View>

      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4">
        <Text className="text-body-lg font-semibold text-text-primary">Account</Text>
        <Text className="text-body-sm text-text-muted mt-1">Manage your profile and data</Text>
      </View>
    </ScrollView>
  );
}
