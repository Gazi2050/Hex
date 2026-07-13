import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";

export default function SettingsScreen() {
  return (
    <ScrollView
      className="flex-1 bg-bg-canvas"
      contentContainerStyle={{ paddingBottom: 100, paddingTop: 64, paddingHorizontal: 16 }}
    >
      <View className="mb-6 items-center">
        <Text className="text-heading-xl text-text-primary font-bold">Settings</Text>
        <Text className="text-body-sm text-text-muted mt-1">Manage your preferences</Text>
      </View>

      <View className="rounded-2xl border border-border-hairline bg-bg-surface p-8 items-center justify-center">
        <Text className="text-body-lg font-semibold text-text-primary mb-2">Coming Soon</Text>
        <Text className="text-body-sm text-text-muted text-center">
          Exciting new features are on the way. Stay tuned!
        </Text>
      </View>
    </ScrollView>
  );
}
