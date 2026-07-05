import React, { useState } from "react";
import { View, LayoutAnimation } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { ContributionGraph, BarChart } from "react-native-chart-kit/v2";
import { Text } from "../ui/text";
import ViewToggle from "./view-toggle";

interface HistoryCardProps {
  heatmapData: { date: string; count: number }[];
  barData: { label: string; completions: number; dayOfMonth: number }[];
}

export default function HistoryCard({ heatmapData, barData }: HistoryCardProps) {
  const [activeTab, setActiveTab] = useState<"heatmap" | "chart">("heatmap");
  const [width, setWidth] = useState(0);

  const opacity = useSharedValue(1);

  const handleTabSwitch = (tab: "heatmap" | "chart") => {
    if (tab === activeTab) return;
    
    opacity.value = withTiming(0, { duration: 100 }, () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setActiveTab(tab);
      opacity.value = withTiming(1, { duration: 150 });
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const onLayout = (event: any) => {
    const { width: containerWidth } = event.nativeEvent.layout;
    setWidth(containerWidth);
  };

  // Adjust chart width to sit comfortably inside the padding of the card
  // HistoryCard padding is p-4 (subtracting 32px total from width)
  const chartWidth = Math.max(0, width - 32);

  return (
    <View 
      onLayout={onLayout}
      style={{ backgroundColor: "#0D0D0D", borderColor: "#242728" }}
      className="rounded-2xl border p-4 mb-5"
    >
      {/* Top Header Row with Switcher */}
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-body-md font-bold text-text-primary">Activity</Text>
        <ViewToggle activeTab={activeTab} onTabSwitch={handleTabSwitch} />
      </View>

      <Animated.View style={animatedStyle}>
        {activeTab === "heatmap" ? (
          <View className="items-center">
            {chartWidth > 0 && (
              <ContributionGraph
                values={heatmapData}
                endDate={new Date()}
                numDays={112}
                width={chartWidth}
                height={160}
                accessor="count"
                cellSize={11}
                gutterSize={3}
                weekStartsOn={1}
                showMonthLabels
                showWeekdayLabels
                emptyColor="#0D0D0D"
                theme={{
                  background: "transparent",
                  plotBackground: "transparent",
                  weekdayLabel: { color: "#6A6B6C" },
                  monthLabel: { color: "#6A6B6C" },
                  emptyCell: { color: "#0D0D0D" },
                }}
                colors={[
                  "rgba(89, 212, 153, 0.15)",
                  "rgba(89, 212, 153, 0.50)",
                  "rgba(89, 212, 153, 0.80)",
                  "#59D499",
                ]}
              />
            )}
            
            {/* Bottom Legend */}
            <View className="flex-row items-center justify-end w-full mt-3 mb-2 gap-1.5 pr-2">
              <Text className="text-[10px] text-text-muted">Less</Text>
              <View style={{ backgroundColor: "#0D0D0D" }} className="w-2.5 h-2.5 rounded-[2px]" />
              <View style={{ backgroundColor: "rgba(89, 212, 153, 0.15)" }} className="w-2.5 h-2.5 rounded-[2px]" />
              <View style={{ backgroundColor: "rgba(89, 212, 153, 0.50)" }} className="w-2.5 h-2.5 rounded-[2px]" />
              <View style={{ backgroundColor: "#59D499" }} className="w-2.5 h-2.5 rounded-[2px]" />
              <Text className="text-[10px] text-text-muted">More</Text>
            </View>
          </View>
        ) : (
          <View className="pt-2 items-center">
            {chartWidth > 0 && (
              <BarChart
                data={barData}
                xKey="label"
                series={[{ yKey: "completions", color: "#59D499" }]}
                width={chartWidth}
                height={160}
                barRadius={4}
                showHorizontalGridLines={false}
                showYAxisLabels={false}
              />
            )}
          </View>
        )}
      </Animated.View>
    </View>
  );
}
