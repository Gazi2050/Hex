import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react-native";
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from "react-native-reanimated";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  showProgress?: boolean;
  progress?: number;
  valueClassName?: string;
}

export function StatCard({ label, value, icon: Icon, showProgress, progress, valueClassName }: StatCardProps) {
  const progressWidth = useSharedValue(0);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  useEffect(() => {
    if (showProgress && progress !== undefined) {
      progressWidth.value = withDelay(400, withTiming(progress, { duration: 600 }));
    }
  }, [showProgress, progress, progressWidth]);

  return (
    <View className="flex-1 bg-bg-surface/60 rounded-2xl p-3 border border-border-hairline">
      <View className="flex-row items-center gap-1.5 mb-2">
        <Icon size={14} color="#FFFFFF" strokeWidth={2.5} />
        <Text className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
          {label}
        </Text>
      </View>
      <Text className={cn("text-heading-sm font-bold text-text-primary", valueClassName)}>
        {value}
      </Text>
      {showProgress && progress !== undefined && (
        <View className="h-1.5 mt-3 rounded-full bg-bg-card overflow-hidden">
          <Animated.View
            className="h-full rounded-full bg-text-accent"
            style={animatedProgressStyle}
          />
        </View>
      )}
    </View>
  );
}
