import { View } from "react-native";
import { StreakRing } from "@/components/ui/streak-ring";
import { StatCard } from "@/components/ui/stat-card";
import { Target, Trophy, Star, Zap } from "lucide-react-native";

interface StreakHeroCardProps {
  streak: number;
  bestStreak: number;
  xp: number;
  todayCompleted: number;
  todayScheduled: number;
  level: number;
  levelName: string;
  levelProgress?: number;
}

export default function StreakHeroCard({
  streak,
  bestStreak,
  xp,
  todayCompleted,
  todayScheduled,
  level,
  levelName,
  levelProgress,
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
        {/* Row 2 */}
        <View className="flex-row gap-3">
          <StatCard
            label="Level"
            value={`L${level} · ${levelName}`}
            icon={Star}
            showProgress={levelProgress !== undefined}
            progress={levelProgress}
            valueClassName="text-text-accent"
          />
          <StatCard 
            label="XP" 
            value={`${xp}`} 
            icon={Zap} 
          />
        </View>
      </View>
    </View>
  );
}
