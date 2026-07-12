import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";

interface WeeklyBarChartProps {
  data: {
    day: string;
    pct: number;
    completed: number;
    scheduled: number;
  }[];
}

const BAR_HEIGHT = 46;
const MIN_BAR_HEIGHT = 16;
const BAR_RADIUS = 3;
const LABEL_COLOR = "#6A6B6C";

const AnimatedView = Animated.View;

function getBarColor(pct: number): string {
  if (pct === 0) return "#1c1c1e";
  if (pct < 0.25) return "#0e4429";
  if (pct < 0.5) return "#006d32";
  if (pct < 0.75) return "#26a641";
  return "#2fa84b";
}

function Bar({
  pct,
  index,
  show,
}: {
  pct: number;
  index: number;
  show: boolean;
}) {
  const targetH =
    pct > 0
      ? Math.max(pct * BAR_HEIGHT, MIN_BAR_HEIGHT)
      : MIN_BAR_HEIGHT;
  const color = getBarColor(pct);
  const label = Math.round(pct * 100);

  const sv = useSharedValue(0);

  useEffect(() => {
    if (show) {
      sv.value = withTiming(targetH, { duration: 600 });
    } else {
      sv.value = 0;
    }
  }, [show, targetH, sv]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: sv.value,
  }));

  return (
    <View className="flex-1 items-center" style={{ height: BAR_HEIGHT }}>
      <View
        style={{
          width: "100%",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <AnimatedView
          style={[
            {
              width: "100%",
              backgroundColor: color,
              borderTopLeftRadius: BAR_RADIUS,
              borderTopRightRadius: BAR_RADIUS,
              overflow: "hidden",
            },
            animatedStyle,
          ]}
        >
          <Text
            className="font-bold text-center"
            style={{
              fontSize: 10,
              color: pct > 0 ? "#FAEBD7" : "#6A6B6C",
              marginTop: 2,
            }}
          >
            {label}%
          </Text>
        </AnimatedView>
      </View>
    </View>
  );
}

export function WeeklyBarChart({ data }: WeeklyBarChartProps) {
  const [showBars, setShowBars] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShowBars(true), 100);
    return () => clearTimeout(id);
  }, []);

  return (
    <View className="gap-1.5">
      {/* Bars — flex-row, bottom-aligned */}
      <View className="flex-row items-end justify-between gap-1" style={{ height: BAR_HEIGHT }}>
        {data.map((d, i) => (
          <Bar key={i} pct={d.pct} index={i} show={showBars} />
        ))}
      </View>

      {/* Day labels */}
      <View className="flex-row justify-between gap-1">
        {data.map((d, i) => (
          <View key={i} className="flex-1 items-center">
            <Text className="font-bold" style={{ fontSize: 10, color: LABEL_COLOR }}>
              {d.day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}