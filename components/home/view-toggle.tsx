import React, { useEffect } from "react";
import { View, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Text } from "../ui/text";

const SPRING_SNAPPY = { damping: 30, stiffness: 300, mass: 0.8 };

interface ViewToggleProps {
  activeTab: "heatmap" | "chart";
  onTabSwitch: (tab: "heatmap" | "chart") => void;
}

export default function ViewToggle({ activeTab, onTabSwitch }: ViewToggleProps) {
  const toggleX = useSharedValue(activeTab === "heatmap" ? 0 : 88);

  useEffect(() => {
    toggleX.value = withSpring(activeTab === "heatmap" ? 0 : 88, SPRING_SNAPPY);
  }, [activeTab, toggleX]);

  const switcherThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: toggleX.value }],
  }));

  return (
    <View 
      style={{ backgroundColor: "#121212", width: 180, height: 36 }}
      className="rounded-full flex-row relative items-center p-0.5 border border-border-hairline"
    >
      {/* Sliding Thumb background */}
      <Animated.View 
        style={[
          switcherThumbStyle,
          { width: 88, height: 30, backgroundColor: "#101111" }
        ]}
        className="absolute rounded-full border border-border-hairline left-0.5"
      />
      <Pressable 
        onPress={() => onTabSwitch("heatmap")} 
        className="flex-1 items-center justify-center z-10"
      >
        <Text 
          className="font-semibold text-body-sm"
          style={{ color: activeTab === "heatmap" ? "#F4F4F6" : "#9C9C9D" }}
        >
          Heatmap
        </Text>
      </Pressable>
      <Pressable 
        onPress={() => onTabSwitch("chart")} 
        className="flex-1 items-center justify-center z-10"
      >
        <Text 
          className="font-semibold text-body-sm"
          style={{ color: activeTab === "chart" ? "#F4F4F6" : "#9C9C9D" }}
        >
          Chart
        </Text>
      </Pressable>
    </View>
  );
}
