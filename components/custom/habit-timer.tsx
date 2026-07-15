import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Clock, CheckCircle2 } from "lucide-react-native";

function secondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

function formatTimer(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function timerColor(remaining: number): string {
  if (remaining > 43200) return "#59D499";
  if (remaining > 21600) {
    const t = (remaining - 21600) / 21600;
    const r = Math.round(89 + (251 - 89) * (1 - t));
    const g = Math.round(212 + (191 - 212) * (1 - t));
    const b = Math.round(153 + (36 - 153) * (1 - t));
    return `rgb(${r},${g},${b})`;
  }
  if (remaining > 3600) {
    const t = (remaining - 3600) / 18000;
    const r = Math.round(251 + (251 - 251) * (1 - t));
    const g = Math.round(191 + (113 - 191) * (1 - t));
    const b = Math.round(36 + (133 - 36) * (1 - t));
    return `rgb(${r},${g},${b})`;
  }
  return "#FB7185";
}

interface HabitTimerProps {
  repeatDays: boolean[];
  completedToday: boolean;
  color: string;
}

function HabitTimer({ repeatDays, completedToday, color }: HabitTimerProps) {
  const [remaining, setRemaining] = useState(secondsUntilMidnight);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(secondsUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayIndex = (new Date().getDay() + 6) % 7; // Monday is 0
  const isScheduledToday = repeatDays[todayIndex];

  if (!isScheduledToday) {
    return (
      <View className="flex-row items-center gap-1.5">
        <Clock size={14} color="#6A6B6C" />
        <Text className="font-mono text-sm" style={{ color: "#6A6B6C", letterSpacing: 0.5 }}>
          00:00:00
        </Text>
      </View>
    );
  }

  if (completedToday) {
    return (
      <View className="flex-row items-center gap-1.5">
        <CheckCircle2 size={14} color={color} />
        <Text className="font-mono text-sm font-bold" style={{ color, letterSpacing: 0.5 }}>
          Done
        </Text>
      </View>
    );
  }

  const displayColor = timerColor(remaining);

  return (
    <View className="flex-row items-center gap-1.5">
      <Clock size={14} color={displayColor} />
      <Text className="font-mono text-sm font-bold" style={{ color: displayColor, letterSpacing: 0.5 }}>
        {formatTimer(remaining)}
      </Text>
    </View>
  );
}

export { HabitTimer, timerColor };
