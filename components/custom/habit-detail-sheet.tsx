import { useMemo } from "react";
import { Modal, Pressable, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { useHabitStore } from "@/lib/store";
import { calculateCurrentStreak, calculateBestStreak } from "@/lib/derived/stats";
import { Text } from "@/components/ui/text";
import { Flame, Trophy, Pencil } from "lucide-react-native";
import { MiniCubeHeatmap } from "@/components/custom/mini-cube-heatmap";

interface HabitDetailSheetProps {
  habitId: string | null;
  onClose: () => void;
}

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function HabitDetailSheet({ habitId, onClose }: HabitDetailSheetProps) {
  const { width: windowWidth } = useWindowDimensions();
  const habits = useHabitStore((s) => s.habits);
  const logs = useHabitStore((s) => s.logs);
  const habit = habits.find((h) => h.id === habitId);
  const visible = !!habit;

  const currentStreak = habit ? calculateCurrentStreak(habit.id, logs) : 0;
  const bestStreak = habit ? calculateBestStreak(habit.id, logs) : 0;

  const chartWidth = useMemo(() => windowWidth - 48, [windowWidth]);

  const completedSet = useMemo(() => {
    if (!habit) return new Set<string>();
    return new Set(
      logs.filter((l) => l.habitId === habit.id).map((l) => l.date)
    );
  }, [habit, logs]);

  const handleEdit = () => {
    onClose();
    if (habit) router.push(`/edit-habit/${habit.id}` as any);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable onPress={onClose} className="flex-1 bg-black/60 justify-end">
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-bg-surface border-t border-border-hairline rounded-t-3xl p-6"
        >
          <View className="w-12 h-1 bg-neutral-800 rounded-full self-center mb-5" />

          {habit && (
            <>
              <View className="flex-row items-center mb-6">
                <View
                  style={{ backgroundColor: `${habit.color}15`, borderColor: habit.color }}
                  className="w-12 h-12 rounded-full border-2 items-center justify-center mr-3"
                >
                  <Text style={{ color: habit.color }} className="text-body-lg font-bold">
                    {habit.iconName.charAt(0)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-body-lg font-semibold text-text-primary">{habit.name}</Text>
                  <View
                    style={{ backgroundColor: habit.color }}
                    className="self-start mt-1.5 px-2 py-0.5 rounded-md"
                  >
                    <Text
                      style={{ color: "#000000" }}
                      className="text-caption-sm font-bold"
                    >
                      {habit.frequency}×
                    </Text>
                  </View>
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
                    const active = habit.repeatDays[idx];
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
        </Pressable>
      </Pressable>
    </Modal>
  );
}
