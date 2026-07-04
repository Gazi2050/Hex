import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import * as React from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ProgressRingProps = {
  completed: number;
  total: number;
  className?: string;
};

function ProgressRing({ completed, total, className }: ProgressRingProps) {
  const percentage = total > 0 ? completed / total : 0;
  const strokeDasharray = 2 * Math.PI * 18;
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: strokeDasharray * (1 - progress.value),
  }));

  React.useEffect(() => {
    progress.value = withDelay(
      150,
      withSpring(percentage, { damping: 30, stiffness: 300 })
    );
  }, [percentage, progress]);

  return (
    <View className={cn("relative h-10 w-10 items-center justify-center", className)}>
      <Svg width={40} height={40} viewBox="0 0 40 40">
        {/* Track */}
        <Circle
          cx={20}
          cy={20}
          r={18}
          stroke="#242728"
          strokeWidth={3}
          fill="none"
        />
        {/* Fill */}
        <AnimatedCircle
          cx={20}
          cy={20}
          r={18}
          stroke="#59D499"
          strokeWidth={3}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          transform="rotate(-90 20 20)"
          animatedProps={animatedProps}
        />
      </Svg>
      <Text className="absolute text-caption-sm text-text-primary">
        {completed}/{total}
      </Text>
    </View>
  );
}

export { ProgressRing };
