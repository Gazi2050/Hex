import { useEffect } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

const TRACK_WIDTH = 160;
const INDICATOR_WIDTH = 56;

export default function LoadingScreen() {
  const insets = useSafeAreaInsets();

  const logoScale = useSharedValue(0.92);
  const logoOpacity = useSharedValue(0.6);
  const progress = useSharedValue(0);

  useEffect(() => {
    const t = { duration: 1600, easing: Easing.inOut(Easing.ease) };

    logoScale.value = withRepeat(withTiming(1, t), -1, true);
    logoOpacity.value = withRepeat(withTiming(1, t), -1, true);
    progress.value = withRepeat(withTiming(1, t), -1, true);
  }, [logoScale, logoOpacity, progress]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: progress.value * (TRACK_WIDTH - INDICATOR_WIDTH) },
    ],
  }));

  return (
    <View
      className="flex-1 items-center justify-between bg-bg-canvas"
      style={{ paddingTop: insets.top + 64, paddingBottom: insets.bottom + 40 }}
    >
      <View />

      <View className="items-center">
        <Animated.View
          style={logoAnimatedStyle}
          className="items-center justify-center"
        >
          <Image
            source={require("../assets/logo_adaptive_foreground.png")}
            style={{ width: 140, height: 140 }}
            contentFit="contain"
          />
        </Animated.View>

        <Text className="mt-6 text-display-lg font-bold uppercase tracking-[0.25em] text-text-primary">
          Hex
        </Text>

        <Text className="mt-2.5 text-body-sm font-semibold tracking-[0.15em] text-text-muted">
          Habits & Tasks Redefined
        </Text>
      </View>

      <View className="items-center justify-center">
        <View
          className="overflow-hidden rounded-full"
          style={{
            width: TRACK_WIDTH,
            height: 2,
            backgroundColor: "rgb(var(--color-border-hairline) / 0.5)",
          }}
        >
          <Animated.View
            style={[
              indicatorStyle,
              {
                width: INDICATOR_WIDTH,
                height: 2,
                backgroundColor: "#59D499",
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}
