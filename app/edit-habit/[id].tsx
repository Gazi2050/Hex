import { useEffect } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useHabitStore } from "@/lib/store";
import { Text } from "@/components/ui/text";
import { toast } from "@ncrft/native-toast";
import { HabitForm } from "@/components/habit-form";

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const habits = useHabitStore((s) => s.habits);
  const updateHabit = useHabitStore((s) => s.updateHabit);
  const deleteHabit = useHabitStore((s) => s.deleteHabit);

  const habit = habits.find((h) => h.id === id);
  const existingPriorityCount = habits.filter((h) => h.priority && h.id !== id).length;

  useEffect(() => {
    if (id && !habit) router.back();
  }, [id, habit]);

  if (!habit) return null;

  const handleDelete = () => {
    Alert.alert(
      "Delete Habit",
      `"${habit.name}" and all its history will be permanently deleted.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteHabit(habit.id);
            toast.success("Habit deleted");
            router.back();
          },
        },
      ]
    );
  };

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
          <Text className="text-body-lg font-semibold text-text-primary">Edit Habit</Text>
          <View className="w-10" />
        </View>

        <HabitForm
          initialValues={{
            name: habit.name,
            description: habit.description,
            color: habit.color,
            iconName: habit.iconName,
            repeatDays: habit.repeatDays,
            frequency: habit.frequency,
            reminder: habit.reminder,
            reminderTime: habit.reminderTime,
            priority: habit.priority,
          }}
          onSubmit={(values) => {
            updateHabit(habit.id, values);
            toast.success("Habit updated");
            router.back();
          }}
          submitLabel="Save Changes"
          onDelete={handleDelete}
          existingPriorityCount={existingPriorityCount}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
