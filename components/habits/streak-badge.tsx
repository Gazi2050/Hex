import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import * as React from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from "react-native-reanimated";

type StreakBadgeProps = {
  streak: number;
  className?: string;
};

function StreakBadge({ streak, className }: StreakBadgeProps) {
  const scale = useSharedValue(1);
  const isMilestone =
    streak > 0 &&
    (streak % 7 === 0 || streak === 30 || streak === 100 || streak === 365);

  React.useEffect(() => {
    if (isMilestone) {
      scale.value = withSequence(
        withSpring(1.3, { damping: 12, stiffness: 180 }),
        withSpring(1, { damping: 20, stiffness: 200 })
      );
    }
  }, [streak, isMilestone, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (streak === 0) return null;

  return (
    <Animated.View
      className={cn(
        "rounded-xs bg-bg-card px-2 py-0.5",
        streak >= 7 ? "bg-accent/20" : "",
        className
      )}
      style={animatedStyle}
    >
      <Text className={cn("text-caption-sm", streak >= 7 ? "text-accent" : "text-text-muted")}>
        {streak} day{streak !== 1 ? "s" : ""}
      </Text>
    </Animated.View>
  );
}

export { StreakBadge };
