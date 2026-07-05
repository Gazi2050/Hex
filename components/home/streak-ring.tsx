import React, { useEffect } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const flameSource = require("../../assets/flame.apng");

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SPRING_SNAPPY = { damping: 30, stiffness: 300, mass: 0.8 };
const SPRING_BOUNCY = { damping: 12, stiffness: 180, mass: 1 };

interface StreakRingProps {
  streak: number;
  completed: number;
  scheduled: number;
}

export default function StreakRing({ streak, completed, scheduled }: StreakRingProps) {
  const radius = 48;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;

  const progress = useSharedValue(0);
  const flameScale = useSharedValue(0.8);

  useEffect(() => {
    const fraction = scheduled > 0 ? completed / scheduled : 0;
    progress.value = withSpring(fraction, SPRING_SNAPPY);
    
    flameScale.value = 0.8;
    flameScale.value = withSpring(1.0, SPRING_BOUNCY);
  }, [completed, scheduled, streak, progress, flameScale]);

  const animatedCircleProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - circumference * progress.value;
    return {
      strokeDashoffset,
    };
  });

  const flameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
    opacity: streak > 0 ? 1.0 : 0.35,
  }));

  return (
    <View className="relative items-center justify-center w-[116px] h-[116px]">
      <Svg width="116" height="116" viewBox="0 0 116 116">
        <Circle
          cx="58"
          cy="58"
          r={radius}
          stroke="#242728"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx="58"
          cy="58"
          r={radius}
          stroke="#59D499"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedCircleProps}
          strokeLinecap="round"
          fill="none"
          transform="rotate(-90 58 58)"
        />
      </Svg>
      
      {/* Centered APNG Flame (shifted up slightly for text) */}
      <View className="absolute items-center justify-center" style={{ top: 18, left: 30 }}>
        <Animated.View style={[flameAnimatedStyle, { width: 56, height: 56 }]}>
          <Image
            source={flameSource}
            style={{ width: "100%", height: "100%" }}
            contentFit="contain"
          />
        </Animated.View>
      </View>
    </View>
  );
}
