import { View } from "react-native";
import { Infinity as InfinityIcon, CheckSquare } from "lucide-react-native";
import { Text } from "@/components/ui/text";

interface HabitTypeBadgeProps {
  repeatDays: boolean[];
  color: string;
  showLabel?: boolean;
}

export function HabitTypeBadge({
  repeatDays,
  color,
  showLabel = true,
}: HabitTypeBadgeProps) {
  const isHabit = repeatDays.filter(Boolean).length >= 4;
  const badgeColor = isHabit ? color : "#57C1FF";
  const Icon = isHabit ? InfinityIcon : CheckSquare;
  const label = isHabit ? "Habit" : "Task";

  return (
    <View
      style={{ borderColor: `${badgeColor}40` }}
      className="px-2 py-0.5 rounded-md border flex-row items-center gap-1"
    >
      <Icon size={10} color={badgeColor} strokeWidth={2.5} />
      {showLabel && (
        <Text
          style={{ color: badgeColor }}
          className="text-caption-sm font-bold uppercase tracking-wider"
        >
          {label}
        </Text>
      )}
    </View>
  );
}
