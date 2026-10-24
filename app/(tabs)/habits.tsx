import React, { useState, useCallback } from "react";
import { View } from "react-native";
import {
  Sortable,
  SortableItem,
  type SortableRenderItemProps,
} from "react-native-reanimated-dnd";
import { GripVertical, Hexagon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useHabits } from "@/lib/hooks/useHabits";
import { useHabitStore } from "@/lib/store";
import { useUIStore } from "@/lib/ui-store";
import { HabitRow } from "@/components/custom/habit-row";
import { HabitDetailSheet } from "@/components/custom/habit-detail-sheet";
import type { Habit } from "@/lib/types";

const ITEM_HEIGHT = 72;

export default function HabitsScreen() {
  const insets = useSafeAreaInsets();
  const { sortedHabits, completedTodaySet, handleToggle } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [listHeight, setListHeight] = useState(0);
  const requestDelete = useUIStore((s) => s.requestDelete);
  const applyHabitsOrder = useHabitStore((s) => s.applyHabitsOrder);

  const handleDrop = useCallback(
    (_id: string, _position: number, allPositions?: Record<string, number>) => {
      if (allPositions) applyHabitsOrder(allPositions);
    },
    [applyHabitsOrder]
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
          containerHeight={listHeight > 0 ? listHeight : undefined}
        >
          <HabitRow
            habit={habit}
            completedToday={completedTodaySet.has(habit.id)}
            onToggle={handleToggle}
            onPress={(h) => setSelectedHabitId(h.id)}
            onLongPress={(h) => requestDelete(h.id)}
            className="h-[72px]"
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
    [handleDrop, handleToggle, requestDelete, completedTodaySet, listHeight]
  );

  return (
    <View
      className="flex-1 bg-bg-canvas"
      style={{ paddingTop: Math.max(insets.top, 20) }}
    >
      <View className="mb-6 items-center mt-2 px-4">
        <Text className="text-heading-xl text-text-primary font-bold">Habits</Text>
        <Text className="text-body-sm text-text-muted mt-1">
          All your tracked habits
        </Text>
      </View>

      <View
        className="flex-1 px-4"
        style={{ paddingBottom: insets.bottom + 120 }}
      >
        {sortedHabits.length > 0 ? (
          <View
            className="rounded-2xl border border-border-hairline overflow-hidden"
            style={{ height: sortedHabits.length * ITEM_HEIGHT }}
            onLayout={(e) => setListHeight(e.nativeEvent.layout.height)}
          >
            <Sortable
              data={sortedHabits}
              renderItem={renderItem}
              itemHeight={ITEM_HEIGHT}
              useFlatList={false}
              style={{ backgroundColor: "transparent" }}
              contentContainerStyle={{ backgroundColor: "transparent" }}
            />
          </View>
        ) : (
          <View className="rounded-2xl border border-border-hairline overflow-hidden">
            <View className="bg-bg-surface p-8 items-center justify-center">
              <Hexagon size={48} color="#6A6B6C" strokeWidth={1.5} className="mb-4" />
              <Text className="text-body-md text-text-muted text-center font-medium">
                No habits yet.
              </Text>
              <Text className="text-body-sm text-text-ash text-center mt-1 font-medium">
                Tap the + button to create a new habit!
              </Text>
            </View>
          </View>
        )}
      </View>

      <HabitDetailSheet habitId={selectedHabitId} onClose={() => setSelectedHabitId(null)} />
    </View>
  );
}
