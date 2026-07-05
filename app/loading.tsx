import { Text } from "@/components/ui/text";
import { Image } from "expo-image";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { CLAMP } = Extrapolation;

export default function LoadingScreen() {
  const insets = useSafeAreaInsets();

  const logoScale = useSharedValue(0.92);
  const logoOpacity = useSharedValue(0.6);

  useEffect(() => {
    const t = { duration: 1600, easing: Easing.inOut(Easing.ease) };

    logoScale.value = withRepeat(withTiming(1, t), -1, true);
    logoOpacity.value = withRepeat(withTiming(1, t), -1, true);
  }, [logoScale, logoOpacity]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));



  return (
    <View
      className="flex-1 bg-bg-canvas"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 24 }}
    >
      <View className="flex-1 items-center justify-center px-8">
        <View className="items-center mb-12">
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

        <View
          style={{ marginTop: 40, height: 116 }}
          className="items-center justify-center"
        >
          <Image
            source={require("../assets/flame.apng")}
            style={{ width: 160, height: 160 }}
            contentFit="contain"
          />
        </View>
      </View>
    </View>
  );
}
