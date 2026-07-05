import { View } from "react-native";
import { StreakRing } from "@/components/ui/streak-ring";
import { StatCard } from "@/components/ui/stat-card";
import { Target, Trophy } from "lucide-react-native";

interface StreakHeroCardProps {
  streak: number;
  bestStreak: number;
  todayCompleted: number;
  todayScheduled: number;
}

export default function StreakHeroCard({
  streak,
  bestStreak,
  todayCompleted,
  todayScheduled,
}: StreakHeroCardProps) {
  const pct = todayScheduled > 0 ? todayCompleted / todayScheduled : 0;

  return (
    <View className="mb-6 rounded-[32px] border border-border-hairline bg-bg-elevated pt-5 px-5 pb-5 items-center">
      <StreakRing streak={streak} completed={todayCompleted} scheduled={todayScheduled} />

      <View className="w-full mt-4 gap-3">
        {/* Row 1 */}
        <View className="flex-row gap-3">
          <StatCard
            label="Today"
            value={`${todayCompleted} / ${todayScheduled}`}
            icon={Target}
            showProgress
            progress={pct}
          />
          <StatCard 
            label="Best Streak" 
            value={`${bestStreak} days`} 
            icon={Trophy} 
          />
        </View>
      </View>
    </View>
  );
}
