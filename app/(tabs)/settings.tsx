import { Alert, ScrollView, View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { useHabitStore } from "@/lib/store";
import { generateDemoData } from "@/lib/seed-demo";

export default function SettingsScreen() {
  const set = useHabitStore.setState;

  const handleLoadDemo = () => {
    Alert.alert(
      "Load Demo Data",
      "This will replace all your current data with sample habits and 60 days of history. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Load Demo",
          style: "destructive",
          onPress: () => {
            const { habits, logs, achievements } = generateDemoData();
            set({ habits, logs, achievements });
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your habits and history. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => set({ habits: [], logs: [], achievements: [] }),
        },
      ]
    );
  };

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

      <View className="mb-4 rounded-2xl border border-border-hairline bg-bg-surface p-4">
        <Text className="text-body-lg font-semibold text-text-primary">Developer</Text>
        <Pressable
          onPress={handleLoadDemo}
          className="mt-3 rounded-xl bg-accent px-4 py-3 items-center"
        >
          <Text className="text-body-sm font-bold text-inverse">
            Load Demo Data
          </Text>
        </Pressable>
        <Pressable
          onPress={handleClearData}
          className="mt-2 rounded-xl border border-feedback-danger px-4 py-3 items-center"
        >
          <Text className="text-body-sm font-bold text-feedback-danger">
            Clear All Data
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
