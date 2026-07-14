import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useEffect, useRef, useState } from "react";
import { Pressable, View, useWindowDimensions } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { LucideIcon } from "lucide-react-native";
import { Home, ListTodo, LineChart, Settings2, Plus } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import * as Haptics from "expo-haptics";
import { useUIStore } from "@/lib/ui-store";

// ─── Config ──────────────────────────────────────────────────────────────────

const TAB_CONFIG: Record<string, { icon: LucideIcon; label: string }> = {
  index:        { icon: Home,      label: "Today" },
  habits:       { icon: ListTodo,  label: "Habits" },
  progress:     { icon: LineChart, label: "Progress" },
  settings:     { icon: Settings2, label: "Settings" },
};

const SPRING_SNAPPY = { damping: 30, stiffness: 300, mass: 0.8 };

const BAR_HEIGHT    = 64;
const CIRCLE_SIZE   = 44;
const BAR_MARGIN    = 48; // 24px each side

const INACTIVE_COLOR    = "#9C9C9D";
const ACTIVE_ICON_COLOR = "#000000";

const PLUS_SIZE       = 56;
const PLUS_COLOR      = "#59D499"; // accent token — DESIGN.md:41
const PLUS_ICON_COLOR = "#000000";

// ─── Tab Toast ────────────────────────────────────────────────────────────────

function TabToast({ label }: { label: string }) {
  const opacity   = useSharedValue(0);
  const translateY = useSharedValue(6);

  useEffect(() => {
    // Chain: fade in → hold → fade out
    opacity.value = withSequence(
      withTiming(1, { duration: 180 }),
      withDelay(1000, withTiming(0, { duration: 200 }))
    );
    translateY.value = withSequence(
      withTiming(0, { duration: 180 }),
      withDelay(1000, withTiming(6, { duration: 200 }))
    );
  }, [label, opacity, translateY]);

  const toastStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={toastStyle}
      pointerEvents="none"
    >
      <View
        style={{
          backgroundColor: "#101111",
          borderWidth: 1,
          borderColor: "#242728",
          borderRadius: 9999,
          paddingHorizontal: 14,
          paddingVertical: 6,
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            color: "#F4F4F6",
            fontSize: 13,
            fontWeight: "500",
            letterSpacing: 0.3,
          }}
        >
          {label}
        </Text>
      </View>
    </Animated.View>
  );
}

// ─── Slot Item ────────────────────────────────────────────────────────────────

function SlotItem({
  IconComponent,
  isFocused,
  slotWidth,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
}: {
  IconComponent: LucideIcon;
  isFocused: boolean;
  slotWidth: number;
  onPress: () => void;
  onLongPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
}) {
  const iconOpacity = useSharedValue(isFocused ? 0 : 1);

  useEffect(() => {
    iconOpacity.value = withTiming(isFocused ? 0 : 1, { duration: 150 });
  }, [isFocused, iconOpacity]);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
  }));

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{
        width: slotWidth,
        height: BAR_HEIGHT,
        alignItems: "center",
        justifyContent: "center",
      }}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
    >
      <Animated.View style={iconStyle}>
        <IconComponent size={22} color={INACTIVE_COLOR} strokeWidth={2} />
      </Animated.View>
    </Pressable>
  );
}

// ─── Floating Tab Bar ─────────────────────────────────────────────────────────

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const isFirstRender = useRef(true);
  const openCreate = useUIStore((s) => s.openCreate);

  const barWidth  = screenWidth - BAR_MARGIN;
  const totalSlots = state.routes.length + 1; // 4 routes + 1 center action
  const slotWidth = barWidth / totalSlots;
  const circleTop = (BAR_HEIGHT - CIRCLE_SIZE) / 2;

  const getCircleX = (index: number) =>
    index < 2
      ? index * slotWidth + slotWidth / 2 - CIRCLE_SIZE / 2
      : (index + 1) * slotWidth + slotWidth / 2 - CIRCLE_SIZE / 2;

  // Shared values
  const circleX     = useSharedValue(getCircleX(state.index));
  const circleScale = useSharedValue(0.8);
  const circleBg    = useSharedValue(0); // 0 = #FFF, 1 = #E8E8E8 (pressed)
  const plusScale   = useSharedValue(1);

  // Toast: label shown above bar on tab switch
  const [toastLabel, setToastLabel] = useState("");
  const [toastKey, setToastKey] = useState(0);

  const handlePlusPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    openCreate();
  };

  // First-render bouncy entrance: 0.8 → 1.15 → 1.0
  useEffect(() => {
    circleScale.value = withSpring(1.15, { damping: 20, stiffness: 200 }, () => {
      circleScale.value = withSpring(1.0, { damping: 25, stiffness: 300 });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Slide circle + show toast on tab switch
  useEffect(() => {
    circleX.value = withSpring(getCircleX(state.index), SPRING_SNAPPY);
    circleScale.value = withSpring(0.85, SPRING_SNAPPY, () => {
      circleScale.value = withSpring(1.0, SPRING_SNAPPY);
    });

    // Show toast only on actual user-driven switches, not initial render
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      const label = TAB_CONFIG[state.routes[state.index]?.name]?.label ?? "";
      setToastLabel(label);
      setToastKey((k) => k + 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.index, slotWidth]);

  const circleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: circleX.value },
      { scale: circleScale.value },
    ],
    backgroundColor: interpolateColor(
      circleBg.value,
      [0, 1],
      ["#FFFFFF", "#E8E8E8"]
    ),
  }));

  const plusAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: plusScale.value }],
  }));

  const activeConfig = TAB_CONFIG[state.routes[state.index]?.name];
  const ActiveIcon   = activeConfig?.icon;

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        paddingBottom: Math.max(insets.bottom, 32),
        overflow: "visible",
      }}
      pointerEvents="box-none"
    >
      {/* Toast above bar */}
      {toastLabel ? (
        <TabToast key={toastKey} label={toastLabel} />
      ) : null}

      {/* Pill container */}
      <View
        style={{
          width: barWidth,
          height: BAR_HEIGHT,
          borderRadius: 9999,
          backgroundColor: "#101111",
          borderWidth: 1,
          borderColor: "#242728",
          flexDirection: "row",
          alignItems: "center",
          overflow: "visible",
        }}
      >
        {/* ── Sliding white circle ─────────────────────────────────────── */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: circleTop,
              left: 0,
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE / 2,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
            },
            circleAnimatedStyle,
          ]}
        >
          {ActiveIcon && (
            <ActiveIcon size={20} color={ACTIVE_ICON_COLOR} strokeWidth={2} />
          )}
        </Animated.View>

        {/* ── Icon slots (left: tabs 0-1) ─────────────────────────────── */}
        {state.routes.slice(0, 2).map((route, index) => {
          const config = TAB_CONFIG[route.name];
          if (!config) return null;

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
            navigation.emit({ type: "tabLongPress", target: route.key });
          };

          return (
            <SlotItem
              key={route.key}
              IconComponent={config.icon}
              isFocused={isFocused}
              slotWidth={slotWidth}
              onPress={onPress}
              onLongPress={onLongPress}
              onPressIn={
                isFocused
                  ? () => {
                      circleScale.value = withSpring(0.94, SPRING_SNAPPY);
                      circleBg.value    = withTiming(1, { duration: 150 });
                    }
                  : undefined
              }
              onPressOut={
                isFocused
                  ? () => {
                      circleScale.value = withSpring(1.0, SPRING_SNAPPY);
                      circleBg.value    = withTiming(0, { duration: 150 });
                    }
                  : undefined
              }
            />
          );
        })}

        {/* ── Center + button (flush, inline) ──────────────────────────── */}
        <Animated.View
          style={[
            plusAnimatedStyle,
            {
              width: PLUS_SIZE,
              height: PLUS_SIZE,
              borderRadius: PLUS_SIZE / 2,
              backgroundColor: PLUS_COLOR,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
            },
          ]}
        >
          <Pressable
            onPress={handlePlusPress}
            onPressIn={() => { plusScale.value = withSpring(0.92, SPRING_SNAPPY); }}
            onPressOut={() => { plusScale.value = withSpring(1.0, SPRING_SNAPPY); }}
            style={{ width: PLUS_SIZE, height: PLUS_SIZE, alignItems: "center", justifyContent: "center" }}
            accessibilityRole="button"
            accessibilityLabel="Create habit"
          >
            <Plus size={26} color={PLUS_ICON_COLOR} strokeWidth={2.75} />
          </Pressable>
        </Animated.View>

        {/* ── Icon slots (right: tabs 2-3) ────────────────────────────── */}
        {state.routes.slice(2).map((route, index) => {
          const config = TAB_CONFIG[route.name];
          if (!config) return null;

          const routeIndex = index + 2;
          const isFocused = state.index === routeIndex;

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
            navigation.emit({ type: "tabLongPress", target: route.key });
          };

          return (
            <SlotItem
              key={route.key}
              IconComponent={config.icon}
              isFocused={isFocused}
              slotWidth={slotWidth}
              onPress={onPress}
              onLongPress={onLongPress}
              onPressIn={
                isFocused
                  ? () => {
                      circleScale.value = withSpring(0.94, SPRING_SNAPPY);
                      circleBg.value    = withTiming(1, { duration: 150 });
                    }
                  : undefined
              }
              onPressOut={
                isFocused
                  ? () => {
                      circleScale.value = withSpring(1.0, SPRING_SNAPPY);
                      circleBg.value    = withTiming(0, { duration: 150 });
                    }
                  : undefined
              }
            />
          );
        })}
      </View>
    </View>
  );
}


