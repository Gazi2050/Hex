import { Text } from "@/components/ui/text";
import { ScrollView, View, Pressable } from "react-native";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";

export default function Index() {
  return (
    <ScrollView 
      className="flex-1 bg-bg-canvas" 
      contentContainerStyle={{ paddingBottom: 100, paddingTop: 64, paddingHorizontal: 16 }}
    >
      <View className="mb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-heading-xl text-text-primary">Today's Habits</Text>
          <Text className="text-body-sm text-text-muted mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/create-habit")}
          className="w-11 h-11 items-center justify-center rounded-full bg-bg-surface border border-border-hairline active:bg-bg-elevated"
        >
          <Plus size={20} color="#F4F4F6" strokeWidth={2} />
        </Pressable>
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
