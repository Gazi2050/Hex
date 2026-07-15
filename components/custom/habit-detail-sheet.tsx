import { useEffect, useMemo } from "react";
import {
  Modal,
  Pressable,
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { useHabitStore, getLocalDateString } from "@/lib/store";
import { useUIStore } from "@/lib/ui-store";
import { calculateCurrentStreak, calculateBestStreak } from "@/lib/derived/stats";
import { Text } from "@/components/ui/text";
import { Flame, Trophy, Pencil } from "lucide-react-native";
import { MiniCubeHeatmap } from "@/components/custom/mini-cube-heatmap";
import { HabitIcon } from "@/components/custom/habit-icon";
import { HabitTypeBadge } from "@/components/custom/habit-type-badge";
import { HabitTimer } from "@/components/custom/habit-timer";

interface HabitDetailSheetProps {
  habitId: string | null;
  onClose: () => void;
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const DISMISS_DISTANCE = 100;
const DISMISS_VELOCITY = 800;

export function HabitDetailSheet({ habitId, onClose }: HabitDetailSheetProps) {
  const { width: windowWidth, height: screenHeight } = useWindowDimensions();
  const habits = useHabitStore((s) => s.habits);
  const logs = useHabitStore((s) => s.logs);
  const openEdit = useUIStore((s) => s.openEdit);
  const habit = habits.find((h) => h.id === habitId);
  const visible = !!habit;

  const currentStreak = habit ? calculateCurrentStreak(habit, logs) : 0;
  const bestStreak = habit ? calculateBestStreak(habit, logs) : 0;

  const chartWidth = useMemo(() => windowWidth - 48, [windowWidth]);

  const completedSet = useMemo(() => {
    if (!habit) return new Set<string>();
    return new Set(
      logs.filter((l) => l.habitId === habit.id).map((l) => l.date)
    );
  }, [habit, logs]);

  const translateY = useSharedValue(screenHeight);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 30, stiffness: 300, overshootClamping: true });
      backdropOpacity.value = withTiming(0.6, { duration: 300 });
    }
  }, [visible, translateY, backdropOpacity]);

  const dismiss = () => {
    "worklet";
    translateY.value = withTiming(screenHeight, { duration: 250 }, (finished) => {
      if (finished) runOnJS(onClose)();
    });
    backdropOpacity.value = withTiming(0, { duration: 250 });
  };

  const pan = Gesture.Pan()
    .activeOffsetY(10)
    .failOffsetX(20)
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
    })
    .onEnd((e) => {
      if (translateY.value > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) {
        dismiss();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 300, overshootClamping: true });
      }
    });

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleEdit = () => {
    onClose();
    if (habit) openEdit(habit.id);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={dismiss}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* Backdrop */}
        <Pressable onPress={dismiss} style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[StyleSheet.absoluteFill, { backgroundColor: "#000000" }, backdropStyle]}
          />
        </Pressable>

        {/* Drawer */}
        <GestureDetector gesture={pan}>
          <Animated.View
            style={drawerStyle}
            className="absolute bottom-0 left-0 right-0 bg-bg-surface border-t border-border-hairline rounded-t-3xl p-6"
          >
            <View className="w-12 h-1 bg-neutral-800 rounded-full self-center mb-5" />

            {habit && (
              <>
                <View className="flex-row items-center mb-6">
                  <View
                    style={{ backgroundColor: `${habit.color}15`, borderColor: habit.color }}
                    className="w-12 h-12 rounded-full border-2 items-center justify-center mr-3"
                  >
                    <HabitIcon
                      name={habit.iconName}
                      size={24}
                      color={habit.color}
                      strokeWidth={2.5}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-body-lg font-semibold text-text-primary">{habit.name}</Text>
                    <View className="self-start flex-row items-center gap-2 mt-1.5">
                      <View
                        style={{ backgroundColor: habit.color }}
                        className="px-2 py-0.5 rounded-md"
                      >
                        <Text
                          style={{ color: "#000000" }}
                          className="text-caption-sm font-bold"
                        >
                          {habit.frequency}×
                        </Text>
                      </View>
                      <HabitTypeBadge repeatDays={habit.repeatDays} color={habit.color} />
                    </View>
                  </View>
                  <View className="items-end">
                    <HabitTimer
                      repeatDays={habit.repeatDays}
                      completedToday={completedSet.has(getLocalDateString())}
                      color={habit.color}
                    />
                  </View>
                </View>

                <View className="flex-row gap-3 mb-6">
                  <View className="flex-1 bg-bg-surface-elevated rounded-xl p-3 border border-border-hairline">
                    <View className="flex-row items-center gap-1.5 mb-1">
                      <Flame size={14} color="#59D499" strokeWidth={2.5} />
                      <Text className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Current</Text>
                    </View>
                    <Text className="text-heading-sm font-bold text-text-accent">{currentStreak} days</Text>
                  </View>
                  <View className="flex-1 bg-bg-surface-elevated rounded-xl p-3 border border-border-hairline">
                    <View className="flex-row items-center gap-1.5 mb-1">
                      <Trophy size={14} color="#FFFFFF" strokeWidth={2.5} />
                      <Text className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Best</Text>
                    </View>
                    <Text className="text-heading-sm font-bold text-text-primary">{bestStreak} days</Text>
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="text-body-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
                    Schedule
                  </Text>
                  <View className="flex-row justify-between">
                    {DAY_LABELS.map((label, idx) => {
                      const storeIdx = idx === 0 ? 6 : idx - 1;
                      const active = habit.repeatDays[storeIdx];
                      return (
                        <View key={idx} className="items-center">
                          <View
                            className="w-10 h-10 rounded-xl items-center justify-center"
                            style={{
                              backgroundColor: active ? habit.color : "#131313",
                            }}
                          >
                            <Text
                              style={{ color: active ? "#000000" : "#9C9C9D" }}
                              className="font-bold text-body-sm"
                            >
                              {label}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>

                <View className="mb-6">
                  <Text className="text-body-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
                    Activity
                  </Text>
                  <MiniCubeHeatmap
                    completedSet={completedSet}
                    color={habit.color}
                    weeks={26}
                    width={chartWidth}
                  />
                </View>

                <Pressable
                  onPress={handleEdit}
                  className="h-14 items-center justify-center rounded-2xl bg-cta-bg active:bg-cta-pressed"
                >
                  <View className="flex-row items-center gap-2">
                    <Pencil size={16} color="#000000" strokeWidth={2.5} />
                    <Text className="text-button-md text-text-inverse font-bold">Edit Habit</Text>
                  </View>
                </Pressable>
              </>
            )}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}
