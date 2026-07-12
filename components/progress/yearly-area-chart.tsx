import { useEffect, useMemo } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { Text } from "@/components/ui/text";

interface YearlyAreaChartProps {
  data: { month: string; completed: number }[];
  width: number;
}

const STROKE_COLOR = "#59D499";
const CHART_HEIGHT = 100;
const LABEL_COLOR = "#6A6B6C";

const AnimatedView = Animated.View;

export function YearlyAreaChart({ data, width }: YearlyAreaChartProps) {
  const chartWidth = width;
  const totalHeight = CHART_HEIGHT + 10;

  const { linePath, areaPath } = useMemo(() => {
    if (data.length === 0) return { linePath: "", areaPath: "" };

    const maxVal = Math.max(...data.map((d) => d.completed), 1);
    const colW = chartWidth / data.length;
    const startX = colW / 2;
    const endX = chartWidth - colW / 2;
    const stepX = (endX - startX) / (data.length - 1);

    const points = data.map((d, i) => ({
      x: startX + i * stepX,
      y: CHART_HEIGHT - (d.completed / maxVal) * (CHART_HEIGHT - 10) - 5,
    }));

    if (points.length < 2) return { linePath: "", areaPath: "" };

    let lp = `M ${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const midX = (curr.x + next.x) / 2;
      const midY = (curr.y + next.y) / 2;
      const cp1x = (midX + curr.x) / 2;
      const cp2x = (midX + next.x) / 2;

      lp += ` Q ${cp1x},${curr.y} ${midX},${midY}`;
      lp += ` Q ${cp2x},${next.y} ${next.x},${next.y}`;
    }

    const ap =
      lp +
      ` L ${points[points.length - 1].x},${CHART_HEIGHT}` +
      ` L ${points[0].x},${CHART_HEIGHT} Z`;

    return { linePath: lp, areaPath: ap };
  }, [data, chartWidth]);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(10);

  useEffect(() => {
    opacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(200, withTiming(0, { duration: 600 }));
  }, [opacity, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (data.length === 0) return null;

  return (
    <AnimatedView style={[animStyle, { width: chartWidth, height: totalHeight }]}>
      <Svg width={chartWidth} height={CHART_HEIGHT} viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}>
        <Defs>
          <LinearGradient id="yearFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={STROKE_COLOR} stopOpacity={0.25} />
            <Stop offset="1" stopColor={STROKE_COLOR} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>
        <Path d={areaPath} fill="url(#yearFill)" />
        <Path
          d={linePath}
          stroke={STROKE_COLOR}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>

      {/* Month labels */}
      <View className="flex-row" style={{ marginTop: 2 }}>
        {data.map((d, i) => (
          <Text
            key={i}
            className="font-bold"
            style={{
              flex: 1,
              fontSize: 8,
              color: LABEL_COLOR,
              textAlign: "center",
            }}
          >
            {d.month}
          </Text>
        ))}
      </View>
    </AnimatedView>
  );
}