import { Modal, Pressable, View } from "react-native";
import { router } from "expo-router";
import { useHabitStore, getLocalDateString } from "@/lib/store";
import { calculateCurrentStreak, calculateBestStreak } from "@/lib/derived/stats";
import { Text } from "@/components/ui/text";
import { Flame, Trophy, Pencil } from "lucide-react-native";

interface HabitDetailSheetProps {
  habitId: string | null;
  onClose: () => void;
}

function buildLast7Days(habitId: string, logs: { habitId: string; date: string }[]) {
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getLocalDateString(d);
    const dayOfWeek = (d.getDay() + 6) % 7;
    days.push({
      label: labels[dayOfWeek],
      completed: logs.some((l) => l.habitId === habitId && l.date === dateStr),
    });
  }
  return days;
}

export function HabitDetailSheet({ habitId, onClose }: HabitDetailSheetProps) {
  const habits = useHabitStore((s) => s.habits);
  const logs = useHabitStore((s) => s.logs);
  const habit = habits.find((h) => h.id === habitId);
  const visible = !!habit;

  const currentStreak = habit ? calculateCurrentStreak(habit.id, logs) : 0;
  const bestStreak = habit ? calculateBestStreak(habit.id, logs) : 0;
  const last7Days = habit ? buildLast7Days(habit.id, logs) : [];

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
                  <Text className="text-body-sm text-text-muted">{habit.description}</Text>
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
                  Last 7 Days
                </Text>
                <View className="flex-row justify-between">
                  {last7Days.map((day, idx) => (
                    <View key={idx} className="items-center">
                      <View
                        className="w-9 h-9 rounded-lg items-center justify-center mb-1"
                        style={{ backgroundColor: day.completed ? habit.color : "#131313" }}
                      >
                        {day.completed && <Text className="text-text-inverse font-bold">✓</Text>}
                      </View>
                      <Text className="text-caption-sm text-text-muted">{day.label}</Text>
                    </View>
                  ))}
                </View>
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
