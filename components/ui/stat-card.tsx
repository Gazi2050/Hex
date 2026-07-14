import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  showProgress?: boolean;
  progress?: number;
  valueClassName?: string;
}

export function StatCard({ label, value, icon: Icon, showProgress, progress, valueClassName }: StatCardProps) {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (showProgress && progress !== undefined) {
      const timer = setTimeout(() => setProgressValue(progress * 100), 400);
      return () => clearTimeout(timer);
    }
  }, [showProgress, progress]);

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
        <Progress
          value={progressValue}
          className="h-1.5 mt-3 bg-[#1c1c1e]"
          indicatorClassName="bg-[#59D499]"
        />
      )}
    </View>
  );
}
