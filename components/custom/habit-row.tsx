import { Checkbox } from "@/components/ui/checkbox";
import { StreakBadge } from "@/components/custom/streak-badge";
import { HabitIcon } from "@/components/custom/habit-icon";
import { HabitTypeBadge } from "@/components/custom/habit-type-badge";
import { Text } from "@/components/ui/text";
import type { Habit } from "@/lib/types";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import * as React from "react";
import { Pressable, View } from "react-native";

type HabitRowProps = {
  habit: Habit;
  onToggle: (id: string) => void;
  onPress?: (habit: Habit) => void;
  onLongPress?: (habit: Habit) => void;
  handle?: React.ReactNode;
  className?: string;
};

function HabitRow({ habit, onToggle, onPress, onLongPress, handle, className }: HabitRowProps) {
  return (
    <Pressable
      onPress={() => onPress?.(habit)}
      onLongPress={
        onLongPress
          ? () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onLongPress(habit);
            }
          : undefined
      }
      delayLongPress={400}
      className={cn(
        "flex-row items-center border-b border-border-hairline bg-bg-surface px-4 py-3.5 active:bg-bg-elevated",
        className
      )}
    >
      {handle}
      <View
        style={{ backgroundColor: `${habit.color}15`, opacity: habit.completedToday ? 0.4 : 1 }}
        className="w-10 h-10 rounded-full items-center justify-center mr-2"
      >
        <HabitIcon
          name={habit.iconName}
          size={24}
          color={habit.color}
          strokeWidth={2.5}
        />
      </View>
      <View className="flex-1 mr-2">
        <Text
          className={cn(
            "text-body-lg",
            habit.completedToday ? "line-through text-text-muted" : "text-text-primary"
          )}
        >
          {habit.name}
        </Text>
        <View
          className="flex-row items-center -ml-1 gap-1.5 mt-1"
          style={{ opacity: habit.completedToday ? 0.5 : 1 }}
        >
          <HabitTypeBadge repeatDays={habit.repeatDays} color={habit.color} />
          <View
            style={{ backgroundColor: `${habit.color}15`, borderColor: `${habit.color}40` }}
            className="px-1.5 py-0.5 rounded-md border"
          >
            <Text
              style={{ color: habit.color }}
              className="text-caption-sm font-bold"
            >
              {habit.frequency}×
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            {habit.repeatDays.map((active, i) => (
              <View
                key={i}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 3.5,
                  backgroundColor: active ? habit.color : "#333335",
                }}
              />
            ))}
          </View>
        </View>
      </View>
      <StreakBadge streak={habit.streak} />
      <Checkbox
        checked={habit.completedToday}
        onCheckedChange={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onToggle(habit.id);
        }}
        className="h-8 w-8 rounded-full border-border-hairline ml-3"
        checkedClassName="border-accent"
        indicatorClassName="bg-accent rounded-full"
        iconClassName="text-text-inverse"
        iconSize={18}
      />
    </Pressable>
  );
}

export { HabitRow };
