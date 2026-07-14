import { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
  BackHandler,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useUIStore } from "@/lib/ui-store";
import { useHabitStore } from "@/lib/store";
import { toast } from "@ncrft/native-toast";
import { Text } from "@/components/ui/text";
import { HabitForm } from "@/components/habit-form";

const OPEN_DURATION = 280;
const CLOSE_DURATION = 300;

export function HabitFormSheet() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const formOpen = useUIStore((s) => s.formOpen);
  const formMode = useUIStore((s) => s.formMode);
  const editId = useUIStore((s) => s.editId);
  const nonce = useUIStore((s) => s.nonce);
  const closeForm = useUIStore((s) => s.closeForm);

  const habits = useHabitStore((s) => s.habits);
  const addHabit = useHabitStore((s) => s.addHabit);
  const updateHabit = useHabitStore((s) => s.updateHabit);

  const habit = formMode === "edit" ? habits.find((h) => h.id === editId) : undefined;

  const translateY = useSharedValue(height);

  // Content is pre-mounted (mounts behind the loading screen, so free).
  // Open/close = pure translateY animation, no mount cost → instant + smooth.
  useEffect(() => {
    if (formOpen) {
      translateY.value = withTiming(0, { duration: OPEN_DURATION });
    } else {
      translateY.value = withTiming(height, { duration: CLOSE_DURATION });
    }
  }, [formOpen, height, translateY]);

  // Android hardware back closes the sheet instead of navigating.
  useEffect(() => {
    if (!formOpen) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      closeForm();
      return true;
    });
    return () => sub.remove();
  }, [formOpen, closeForm]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const isEdit = formMode === "edit" && !!habit;
  const existingPriorityCount = habits.filter((h) => {
    if (!h.priority) return false;
    if (formMode === "edit") return h.id !== editId;
    return true;
  }).length;

  return (
    <Animated.View
      pointerEvents={formOpen ? "auto" : "none"}
      style={[StyleSheet.absoluteFill, { zIndex: 50 }, sheetStyle]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-bg-canvas"
      >
          <View className="flex-1" style={{ paddingTop: Math.max(insets.top, 20) }}>
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-border-hairline">
              <Pressable
                onPress={closeForm}
                className="w-10 h-10 items-center justify-center rounded-full active:opacity-70"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <ArrowLeft size={20} color="#000000" strokeWidth={3} />
              </Pressable>
              <Text className="text-body-lg font-semibold text-text-primary">
                {isEdit ? "Edit Habit" : "Create Habit"}
              </Text>
              <View className="w-10" />
            </View>

            <HabitForm
              resetSignal={nonce}
              initialValues={
                isEdit && habit
                  ? {
                      name: habit.name,
                      description: habit.description,
                      color: habit.color,
                      iconName: habit.iconName,
                      repeatDays: habit.repeatDays,
                      frequency: habit.frequency,
                      reminder: habit.reminder,
                      reminderTime: habit.reminderTime,
                      priority: habit.priority,
                    }
                  : undefined
              }
              onSubmit={(values) => {
                if (isEdit && editId) {
                  updateHabit(editId, values);
                  toast.success("Habit updated");
                } else {
                  addHabit(values);
                  toast.success("Habit created");
                }
                closeForm();
              }}
              submitLabel={isEdit ? "Save Changes" : "Create Habit"}
              existingPriorityCount={existingPriorityCount}
            />
          </View>
        </KeyboardAvoidingView>
    </Animated.View>
  );
}
