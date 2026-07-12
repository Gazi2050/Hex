import { CompletionToggle } from "@/components/custom/completion-toggle";
import { StreakBadge } from "@/components/custom/streak-badge";
import { HabitIcon } from "@/components/custom/habit-icon";
import { HabitTypeBadge } from "@/components/custom/habit-type-badge";
import { Text } from "@/components/ui/text";
import type { Habit } from "@/lib/types";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Pressable, View } from "react-native";

type HabitRowProps = {
  habit: Habit;
  onToggle: (id: string) => void;
  onPress?: (habit: Habit) => void;
  className?: string;
};

function HabitRow({ habit, onToggle, onPress, className }: HabitRowProps) {
  return (
    <Pressable
      onPress={() => onPress?.(habit)}
      className={cn(
        "flex-row items-center border-b border-border-hairline bg-bg-surface px-4 py-3 active:bg-bg-elevated",
        habit.completedToday ? "opacity-70" : "",
        className
      )}
    >
      <View
        style={{ backgroundColor: `${habit.color}15` }}
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
      >
        <HabitIcon
          name={habit.iconName}
          size={24}
          color={habit.color}
          strokeWidth={2.5}
        />
      </View>
      <View className="flex-1">
        <Text
          className={cn(
            "text-body-lg",
            habit.completedToday ? "line-through text-text-muted" : "text-text-primary"
          )}
        >
          {habit.name}
        </Text>
        <View className="flex-row items-center gap-2 mt-1">
          <HabitTypeBadge repeatDays={habit.repeatDays} color={habit.color} />
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
          <View className="flex-row items-center gap-1">
            {habit.repeatDays.map((active, i) => (
              <View
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: active ? habit.color : "#2a2a2c",
                }}
              />
            ))}
          </View>
        </View>
      </View>
      <StreakBadge streak={habit.streak} />
      <CompletionToggle
        completed={habit.completedToday}
        onToggle={() => onToggle(habit.id)}
        size={32}
        className="ml-3"
      />
    </Pressable>
  );
}

export { HabitRow };
