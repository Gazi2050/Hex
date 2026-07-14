import * as React from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { themeTokens } from "@/lib/design-tokens";
import flameSource from "@/assets/flame.apng";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface StreakRingProps {
  streak: number;
  completed: number;
  scheduled: number;
}

function StreakRing({ streak, completed, scheduled }: StreakRingProps) {
  const percentage = scheduled > 0 ? Math.min(1, Math.max(0, completed / scheduled)) : 0;
  const { border, accent, text } = themeTokens.semantic;
  
  const size = 138;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  React.useEffect(() => {
    progress.value = withTiming(percentage, { duration: 300 });
  }, [percentage, progress]);

  return (
    <View
      className="relative items-center justify-center"
      style={{ width: size, height: size }}
      accessibilityLabel={`Streak ${streak} days, ${Math.round(percentage * 100)}% complete`}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={border.hairline}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Fill */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={accent.DEFAULT}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          animatedProps={animatedProps}
        />
      </Svg>

      <View
        className="absolute inset-0 items-center justify-center pb-5"
        pointerEvents="none"
      >
        <Image
          source={flameSource}
          style={{ width: 36, height: 36, marginBottom: -2 }}
          contentFit="contain"
        />
        <Text
          style={{
            color: streak > 0 ? accent.DEFAULT : text.primary,
            fontSize: 30,
            lineHeight: 30,
          }}
          className="font-black text-center"
        >
          {streak}
        </Text>
        <Text className="text-[10px] text-text-muted uppercase tracking-widest font-bold mt-1 text-center">
          day streak
        </Text>
      </View>
    </View>
  );
}

export { StreakRing };
