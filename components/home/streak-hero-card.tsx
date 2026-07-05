import React from "react";
import { View } from "react-native";
import { Text } from "../ui/text";
import StreakRing from "./streak-ring";
import StatPill from "./stat-pill";

interface StreakHeroCardProps {
  streak: number;
  bestStreak: number;
  totalDone: number;
  achievements: number;
  todayCompleted: number;
  todayScheduled: number;
}

export default function StreakHeroCard({
  streak,
  bestStreak,
  totalDone,
  achievements,
  todayCompleted,
  todayScheduled,
}: StreakHeroCardProps) {
  return (
    <View 
      style={{ backgroundColor: "#0D0D0D", borderColor: "#242728" }}
      className="mb-6 rounded-2xl border p-4 flex-row items-center justify-between"
    >
      {/* Left Side: Streak Ring */}
      <View className="items-center w-[120px] py-1 mr-4">
        <View className="relative items-center justify-center">
          <StreakRing streak={streak} completed={todayCompleted} scheduled={todayScheduled} />
          
          <View className="absolute bottom-[22px] items-center">
            <Text 
              style={{ color: streak > 0 ? "#59D499" : "#F4F4F6" }} 
              className="text-heading-xl font-extrabold leading-tight"
            >
              {streak}
            </Text>
            <Text className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">
              streak
            </Text>
          </View>
        </View>
      </View>

      {/* Right Side: StatPillList */}
      <View className="flex-1 gap-2">
        <StatPill label="Today" value={`${todayCompleted}/${todayScheduled} Done`} />
        <StatPill label="Best Streak" value={`${bestStreak} days`} isAccent />
        <StatPill label="Total Done" value={`${totalDone} times`} />
        <StatPill label="Awards" value={`${achievements} unlocked`} />
      </View>
    </View>
  );
}
