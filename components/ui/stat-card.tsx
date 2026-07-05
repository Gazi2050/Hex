import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react-native";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  showProgress?: boolean;
  progress?: number;
  valueClassName?: string;
}

export function StatCard({ label, value, icon: Icon, showProgress, progress, valueClassName }: StatCardProps) {
  return (
    <View className="flex-1 bg-bg-surface/60 rounded-2xl p-3 border border-border-hairline">
      <View className="flex-row items-center gap-1.5 mb-2">
        <Icon size={14} color="#FFFFFF" strokeWidth={2.5} />
        <Text className="text-[10px] text-text-muted font-bold uppercase tracking-wider">
          {label}
        </Text>
      </View>
      <Text className={cn("text-heading-sm font-bold text-text-primary", valueClassName)}>
        {value}
      </Text>
      {showProgress && progress !== undefined && (
        <View className="h-1.5 mt-3 rounded-full bg-bg-card overflow-hidden">
          <View
            className="h-full rounded-full bg-text-accent"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </View>
      )}
    </View>
  );
}
