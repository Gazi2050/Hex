import { Hexagon } from "lucide-react-native";
import { HABIT_ICONS } from "@/lib/habit-icons";

interface HabitIconProps {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function HabitIcon({
  name,
  size = 24,
  color,
  strokeWidth = 2,
}: HabitIconProps) {
  const Icon = HABIT_ICONS[name] ?? Hexagon;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}
