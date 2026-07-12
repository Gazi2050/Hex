import { useEffect } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface MonthProgressRingProps {
  rate: number;
}

const SIZE = 120;
const STROKE_WIDTH = 10;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TRACK_COLOR = "#1c1c1e";
const FILL_COLOR = "#59D499";

export function MonthProgressRing({ rate }: MonthProgressRingProps) {
  const clampedRate = Math.min(1, Math.max(0, rate));
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  useEffect(() => {
    progress.value = withDelay(
      300,
      withSpring(clampedRate, { damping: 24, stiffness: 120 })
    );
  }, [clampedRate, progress]);

  const pct = Math.round(clampedRate * 100);

  return (
    <View
      style={{ width: SIZE, height: SIZE }}
      className="items-center justify-center"
    >
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={TRACK_COLOR}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        <AnimatedCircle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          stroke={FILL_COLOR}
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          strokeLinecap="round"
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          animatedProps={animatedProps}
        />
      </Svg>

      <View className="absolute inset-0 items-center justify-center pb-1">
        <Text
          className="font-black text-center"
          style={{ fontSize: 32, lineHeight: 32, color: "#F4F4F6" }}
        >
          {pct}%
        </Text>
        <Text
          className="font-bold text-center mt-1"
          style={{ fontSize: 8, color: "#6A6B6C" }}
        >
          monthly
        </Text>
      </View>
    </View>
  );
}