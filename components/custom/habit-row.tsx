import { CompletionToggle } from "@/components/custom/completion-toggle";
import { StreakBadge } from "@/components/custom/streak-badge";
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
      <CompletionToggle
        completed={habit.completedToday}
        onToggle={() => onToggle(habit.id)}
        className="mr-3"
      />
      <View className="flex-1">
        <Text
          className={cn(
            "text-body-lg",
            habit.completedToday ? "line-through text-text-muted" : "text-text-primary"
          )}
        >
          {habit.name}
        </Text>
        <Text className="text-body-sm text-text-secondary mt-0.5">
          {habit.description}
        </Text>
      </View>
      <StreakBadge streak={habit.streak} />
    </Pressable>
  );
}

export { HabitRow };
