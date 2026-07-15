import { useMemo } from "react";
import { View } from "react-native";
import { getLocalDateString } from "@/lib/store";
import { mixHex } from "@/lib/color";

interface MiniCubeHeatmapProps {
  completedSet: Set<string>;
  color: string;
  weeks?: number;
  width: number;
}

const GUTTER = 3;
const RADIUS = 2;
const INACTIVE_FILL = "#1c1c1e";
const TODAY_BORDER = "#e6e6e6";

export function MiniCubeHeatmap({
  completedSet,
  color,
  weeks = 26,
  width,
}: MiniCubeHeatmapProps) {
  const completedBorder = useMemo(
    () => mixHex(color, "#000000", 0.3),
    [color]
  );

  const cellSize = Math.floor((width - (weeks - 1) * GUTTER) / weeks);

  const columns = useMemo(() => {
    const today = new Date();
    const todayStr = getLocalDateString(today);
    const dayOfWeek = (today.getDay() + 6) % 7; // Monday is 0
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - dayOfWeek);
    const startMonday = new Date(thisMonday);
    startMonday.setDate(thisMonday.getDate() - (weeks - 1) * 7);

    const cols: {
      isToday: boolean;
      completed: boolean;
    }[][] = [];

    for (let w = 0; w < weeks; w++) {
      const week: { isToday: boolean; completed: boolean }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startMonday);
        date.setDate(startMonday.getDate() + w * 7 + d);
        const dateStr = getLocalDateString(date);
        week.push({
          isToday: dateStr === todayStr,
          completed: completedSet.has(dateStr),
        });
      }
      cols.push(week);
    }
    return cols;
  }, [weeks, completedSet]);

  if (cellSize <= 0) return null;

  return (
    <View className="flex-row" style={{ gap: GUTTER }}>
      {columns.map((week, wIdx) => (
        <View key={wIdx} style={{ gap: GUTTER }}>
          {week.map((day, dIdx) => {
            let borderColor: string | undefined;
            let borderWidth = 0;

            if (day.isToday && !day.completed) {
              borderColor = TODAY_BORDER;
              borderWidth = 1;
            } else if (day.completed) {
              borderColor = completedBorder;
              borderWidth = 1;
            }

            return (
              <View
                key={dIdx}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: RADIUS,
                  backgroundColor: day.completed ? color : INACTIVE_FILL,
                  borderColor,
                  borderWidth,
                }}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}
