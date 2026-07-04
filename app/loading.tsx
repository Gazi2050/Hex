import { useEffect } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function LoadingScreen() {
  const logoScale = useSharedValue(0.9);
  const logoOpacity = useSharedValue(0.5);
  const progress = useSharedValue(0);

  useEffect(() => {
    // Breathing logo animation
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: 1200 }),
        withTiming(0.93, { duration: 1200 })
      ),
      -1,
      true
    );

    logoOpacity.value = withRepeat(
      withSequence(
        withTiming(1.0, { duration: 1200 }),
        withTiming(0.6, { duration: 1200 })
      ),
      -1,
      true
    );

    // Sliding indicator progress bar
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );
  }, [logoScale, logoOpacity, progress]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const progressBarStyle = useAnimatedStyle(() => ({
    left: `${progress.value * 100}%`,
    transform: [{ translateX: -40 }], // half of indicator width
  }));

  return (
    <View className="flex-1 items-center justify-between bg-bg-canvas py-24">
      {/* Spacer to push down layout */}
      <View />

      {/* Brand Section */}
      <View className="items-center">
        <Animated.View style={logoAnimatedStyle} className="items-center justify-center">
          <Image
            source={require("../assets/logo_adaptive_foreground.png")}
            style={{ width: 140, height: 140 }}
            contentFit="contain"
          />
        </Animated.View>
        
        <Text className="text-display-md text-text-primary font-bold mt-6 tracking-[0.25em] uppercase">
          Hex
        </Text>
        
        <Text className="text-body-sm text-text-muted mt-2.5 tracking-[0.15em] font-semibold">
          Habits & Tasks Redefined
        </Text>
      </View>

      {/* Sleek Horizontal Loading Track */}
      <View className="items-center justify-center">
        <View 
          style={{ width: 160, height: 2, backgroundColor: "#242728", borderRadius: 999, overflow: "hidden" }}
          className="relative"
        >
          <Animated.View 
            style={[
              progressBarStyle, 
              { 
                position: "absolute",
                top: 0,
                width: 80, 
                height: 2, 
                backgroundColor: "#59D499", // mint accent
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );
}
