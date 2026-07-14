import { useCallback } from "react";
import { View } from "react-native";
import {
  Sortable,
  SortableItem,
  type SortableRenderItemProps,
} from "react-native-reanimated-dnd";
import { GripVertical } from "lucide-react-native";
import { useHabitStore } from "@/lib/store";
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
  const reorderPriorities = useHabitStore((s) => s.reorderPriorities);

  const handleMove = useCallback(
    (_id: string, from: number, to: number) => {
      reorderPriorities(from, to);
    },
    [reorderPriorities]
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
          onMove={handleMove}
        >
          <HabitRow
            habit={habit}
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
    [handleMove, onToggle, onPress, onLongPress]
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
