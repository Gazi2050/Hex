import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { Plus } from "@/components/icons";
import * as React from "react";
import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from "react-native-reanimated";

type FABProps = {
  onPress: () => void;
  className?: string;
};

function FAB({ onPress, className }: FABProps) {
  const scale = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 180 }));
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      className={cn("absolute bottom-6 right-6", className)}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        className="h-14 w-14 items-center justify-center rounded-full bg-cta-bg active:bg-cta-pressed"
      >
        <Icon as={Plus} size={24} className="text-text-inverse" />
      </Pressable>
    </Animated.View>
  );
}

export { FAB };
