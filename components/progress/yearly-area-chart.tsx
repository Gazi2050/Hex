import { useEffect, useMemo } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import { Text } from "@/components/ui/text";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface YearlyAreaChartProps {
  data: { month: string; rate: number | null }[];
  width: number;
}

const STROKE_COLOR = "#59D499";
const CHART_HEIGHT = 100;
const LABEL_COLOR = "#6A6B6C";

const pointXs = (chartWidth: number, count: number): number[] => {
  "worklet";
  const colW = chartWidth / count;
  const startX = colW / 2;
  const endX = chartWidth - colW / 2;
  const stepX = count > 1 ? (endX - startX) / (count - 1) : 0;
  return Array.from({ length: count }, (_, i) => startX + i * stepX);
};

const buildFromYs = (ys: readonly number[], chartWidth: number) => {
  "worklet";
  const xs = pointXs(chartWidth, ys.length);
  if (ys.length < 2) return { linePath: "", areaPath: "" };

  let lp = `M ${xs[0]},${ys[0]}`;
  for (let i = 0; i < ys.length - 1; i++) {
    lp += ` L ${xs[i + 1]},${ys[i + 1]}`;
  }

  const ap =
    lp +
    ` L ${xs[ys.length - 1]},${CHART_HEIGHT} ` +
    `L ${xs[0]},${CHART_HEIGHT} Z`;

  return { linePath: lp, areaPath: ap };
};

function pointYs(data: { month: string; rate: number | null }[], chartWidth: number): number[] {
  if (data.length === 0) return [];
  return data.map((d) => {
    const y = CHART_HEIGHT - 5 - (d.rate ?? 0) * (CHART_HEIGHT - 15);
    return y;
  });
}

function useMonthYSvs(targetYs: number[]) {
  // Always 12 hooks, always in same order — no conditional hooks
  const sv0 = useSharedValue(targetYs[0] ?? CHART_HEIGHT);
  const sv1 = useSharedValue(targetYs[1] ?? CHART_HEIGHT);
  const sv2 = useSharedValue(targetYs[2] ?? CHART_HEIGHT);
  const sv3 = useSharedValue(targetYs[3] ?? CHART_HEIGHT);
  const sv4 = useSharedValue(targetYs[4] ?? CHART_HEIGHT);
  const sv5 = useSharedValue(targetYs[5] ?? CHART_HEIGHT);
  const sv6 = useSharedValue(targetYs[6] ?? CHART_HEIGHT);
  const sv7 = useSharedValue(targetYs[7] ?? CHART_HEIGHT);
  const sv8 = useSharedValue(targetYs[8] ?? CHART_HEIGHT);
  const sv9 = useSharedValue(targetYs[9] ?? CHART_HEIGHT);
  const sv10 = useSharedValue(targetYs[10] ?? CHART_HEIGHT);
  const sv11 = useSharedValue(targetYs[11] ?? CHART_HEIGHT);

  const all = [sv0, sv1, sv2, sv3, sv4, sv5, sv6, sv7, sv8, sv9, sv10, sv11] as const;

  useEffect(() => {
    all.forEach((sv, i) => {
      sv.value = withTiming(targetYs[i] ?? CHART_HEIGHT, { duration: 600 });
    });
  }, [targetYs]);

  return all;
}

export function YearlyAreaChart({ data, width }: YearlyAreaChartProps) {
  const chartWidth = width;
  const targetYs = useMemo(() => pointYs(data, chartWidth), [data, chartWidth]);
  const ys = useMonthYSvs(targetYs);
  const n = data.length;

  const lineAnimatedProps = useAnimatedProps(() => {
    const yvals = ys.slice(0, n).map((sv) => sv.value);
    const paths = buildFromYs(yvals, chartWidth);
    return { d: paths.linePath };
  });

  const areaAnimatedProps = useAnimatedProps(() => {
    const yvals = ys.slice(0, n).map((sv) => sv.value);
    const paths = buildFromYs(yvals, chartWidth);
    return { d: paths.areaPath };
  });

  if (n === 0) return null;

  return (
    <View style={{ width: chartWidth, height: CHART_HEIGHT + 10 }}>
      <Svg width={chartWidth} height={CHART_HEIGHT} viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}>
        <Defs>
          <LinearGradient id="yearFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={STROKE_COLOR} stopOpacity={0.25} />
            <Stop offset="1" stopColor={STROKE_COLOR} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>
        <AnimatedPath animatedProps={areaAnimatedProps} fill="url(#yearFill)" />
        <AnimatedPath
          animatedProps={lineAnimatedProps}
          stroke={STROKE_COLOR}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>

      <View className="flex-row" style={{ marginTop: 2 }}>
        {data.map((d, i) => (
          <Text
            key={i}
            className="font-bold"
            style={{ flex: 1, fontSize: 8, color: LABEL_COLOR, textAlign: "center" }}
          >
            {d.month}
          </Text>
        ))}
      </View>
    </View>
  );
}
