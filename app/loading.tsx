import { useEffect } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

function Dot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 })
        )
      ),
      -1,
      true
    );
  }, [opacity, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="h-2.5 w-2.5 rounded-full bg-accent mx-1.5"
    />
  );
}

export default function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-between bg-bg-canvas py-20">
      {/* Top spacing to push layout down */}
      <View />

      {/* Brand Section */}
      <View className="items-center">
        <Image
          source={require("../assets/logo_adaptive_foreground.png")}
          style={{ width: 128, height: 128 }}
          contentFit="contain"
        />
        <Text className="text-display-md text-text-primary font-bold mt-4 tracking-[0.25em] uppercase">
          Hex
        </Text>
        <Text className="text-body-sm text-text-muted mt-2 tracking-widest font-medium">
          Habit & Todo Tracker
        </Text>
      </View>

      {/* Pulse loading indicators */}
      <View className="flex-row items-center justify-center">
        <Dot delay={0} />
        <Dot delay={200} />
        <Dot delay={400} />
      </View>
    </View>
  );
}
