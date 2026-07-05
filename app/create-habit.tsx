import { View, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHabitStore } from "@/lib/store";
import { toast } from "@ncrft/native-toast";
import { ArrowLeft } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { HabitForm } from "@/components/habit-form";

export default function CreateHabitScreen() {
  const insets = useSafeAreaInsets();
  const addHabit = useHabitStore((state) => state.addHabit);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-bg-canvas"
    >
      <View className="flex-1" style={{ paddingTop: Math.max(insets.top, 20) }}>
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-border-hairline">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full active:opacity-70"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <ArrowLeft size={20} color="#000000" strokeWidth={3} />
          </Pressable>
          <Text className="text-body-lg font-semibold text-text-primary">
            Create Habit
          </Text>
          <View className="w-10" />
        </View>

        <HabitForm
          onSubmit={(values) => {
            addHabit(values);
            toast.success("Habit created");
            router.back();
          }}
          submitLabel="Create Habit"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
