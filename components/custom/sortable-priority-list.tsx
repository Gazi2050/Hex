import { useCallback, useMemo } from "react";
import { View } from "react-native";
import {
  Sortable,
  SortableItem,
  type SortableRenderItemProps,
} from "react-native-reanimated-dnd";
import { GripVertical } from "lucide-react-native";
import { useHabitStore } from "@/lib/store";
import { buildCompletedTodaySet } from "@/lib/actions/habit-actions";
import { HabitRow } from "@/components/custom/habit-row";
import type { Habit } from "@/lib/types";

const ITEM_HEIGHT = 76;

interface SortablePriorityListProps {
  habits: Habit[];
  onToggle: (id: string) => void;
  onPress: (habit: Habit) => void;
  onLongPress: (habit: Habit) => void;
}

export function SortablePriorityList({
  habits,
  onToggle,
  onPress,
  onLongPress,
}: SortablePriorityListProps) {
  const applyPriorityOrder = useHabitStore((s) => s.applyPriorityOrder);
  const logs = useHabitStore((s) => s.logs);
  const completedTodaySet = useMemo(
    () => buildCompletedTodaySet(logs),
    [logs]
  );

  const handleDrop = useCallback(
    (_id: string, _position: number, allPositions?: Record<string, number>) => {
      if (allPositions) applyPriorityOrder(allPositions);
    },
    [applyPriorityOrder]
  );

  const renderItem = useCallback(
    (props: SortableRenderItemProps<Habit>) => {
      const { item: habit, id, ...sortableProps } = props;
      return (
        <SortableItem
          key={id}
          id={id}
          data={habit}
          {...sortableProps}
          onDrop={handleDrop}
          containerHeight={habits.length * ITEM_HEIGHT}
        >
          <HabitRow
            habit={habit}
            completedToday={completedTodaySet.has(habit.id)}
            onToggle={onToggle}
            onPress={onPress}
            onLongPress={onLongPress}
            className="h-[76px]"
            handle={
              <SortableItem.Handle>
                <View className="items-center justify-center mr-1" style={{ width: 24, height: 40 }}>
                  <GripVertical size={14} color="#4A4B4C" strokeWidth={2.5} />
                </View>
              </SortableItem.Handle>
            }
          />
        </SortableItem>
      );
    },
    [handleDrop, onToggle, onPress, onLongPress, completedTodaySet, habits.length]
  );

  return (
    <View className="rounded-2xl border border-border-hairline overflow-hidden">
      <Sortable
        data={habits}
        renderItem={renderItem}
        itemHeight={ITEM_HEIGHT}
        useFlatList={false}
        style={{ backgroundColor: "transparent" }}
        contentContainerStyle={{ backgroundColor: "transparent" }}
      />
    </View>
  );
}
