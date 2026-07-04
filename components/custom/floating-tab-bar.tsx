import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useRef } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import { ListTodo, LineChart, Trophy } from "lucide-react-native";

const TAB_CONFIG: Record<string, { icon: LucideIcon; label: string }> = {
  index: { icon: ListTodo, label: "Habits" },
  progress: { icon: LineChart, label: "Progress" },
  achievements: { icon: Trophy, label: "Achievements" },
};

function TabBarItem({
  routeName,
  isFocused,
  onPress,
  onLongPress,
}: {
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const scale = useSharedValue(1);
  const prevFocused = useRef(isFocused);

  useEffect(() => {
    if (isFocused && !prevFocused.current) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 300 }, () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 250 });
      });
    }
    prevFocused.current = isFocused;
  }, [isFocused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const config = TAB_CONFIG[routeName];
  if (!config) return null;
  const { icon: IconComponent } = config;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="items-center justify-center px-5 py-1"
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
    >
      <Animated.View
        className={cn(
          "items-center justify-center rounded-full px-4 py-2",
          isFocused ? "bg-accent/10" : ""
        )}
        style={animatedStyle}
      >
        <IconComponent
          size={22}
          color={isFocused ? "#59D499" : "#8B9DA3"}
          strokeWidth={isFocused ? 2.5 : 2}
        />
      </Animated.View>
    </Pressable>
  );
}

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 items-center"
      style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      pointerEvents="box-none"
    >
      <Animated.View
        className="flex-row items-center rounded-full border border-border-hairline bg-bg-surface/95 px-2 py-1.5"
        style={{
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        }}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabBarItem
              key={route.key}
              routeName={route.name}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </Animated.View>
    </View>
  );
}
