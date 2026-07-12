import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { Check } from "@/components/icons";
import * as React from "react";
import { Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from "react-native-reanimated";

type CompletionToggleProps = {
  completed: boolean;
  onToggle: () => void;
  className?: string;
  size?: number;
};

function CompletionToggle({ completed, onToggle, className, size = 24 }: CompletionToggleProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (!completed) {
      scale.value = withSequence(
        withSpring(0.92, { damping: 30, stiffness: 300 }),
        withSpring(1.15, { damping: 12, stiffness: 180 }),
        withSpring(1, { damping: 20, stiffness: 200 })
      );
    } else {
      scale.value = withSequence(
        withSpring(0.92, { damping: 30, stiffness: 300 }),
        withSpring(1, { damping: 20, stiffness: 200 })
      );
    }
    onToggle();
  };

  return (
    <Pressable onPress={handlePress} style={{ width: size, height: size }} className={className}>
      <Animated.View
        className={cn(
          "h-full w-full items-center justify-center rounded-full border",
          completed
            ? "border-accent bg-accent"
            : "border-border-hairline bg-transparent"
        )}
        style={animatedStyle}
      >
        {completed && (
          <Icon as={Check} size={Math.round(size * 0.6)} className="text-text-inverse" />
        )}
      </Animated.View>
    </Pressable>
  );
}

export { CompletionToggle };
