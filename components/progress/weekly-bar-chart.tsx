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

const BAR_HEIGHT = 62;
const MIN_BAR_HEIGHT = 20;
const BAR_FILL = "#59D499";
const BAR_ZERO = "#1c1c1e";
const BAR_RADIUS = 4;
const LABEL_COLOR = "#6A6B6C";
const ZERO_TEXT_COLOR = "#9C9C9D";

const AnimatedView = Animated.View;

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
  const backgroundColor = pct > 0 ? BAR_FILL : BAR_ZERO;
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
          height: BAR_HEIGHT,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <AnimatedView
          style={[
            {
              width: "100%",
              backgroundColor,
              borderRadius: BAR_RADIUS,
              overflow: "hidden",
            },
            animatedStyle,
          ]}
        />
      </View>
      <Text
        className="font-bold text-center absolute"
        style={{
          fontSize: 10,
          color: pct > 0 ? "#000000" : ZERO_TEXT_COLOR,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        {label}%
      </Text>
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
      <View className="flex-row items-end justify-between gap-2" style={{ height: BAR_HEIGHT }}>
        {data.map((d, i) => (
          <Bar key={i} pct={d.pct} index={i} show={showBars} />
        ))}
      </View>

      {/* Day labels */}
      <View className="flex-row justify-between gap-2">
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