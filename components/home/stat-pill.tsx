import React from "react";
import { View } from "react-native";
import { Text } from "../ui/text";

interface StatPillProps {
  label: string;
  value: string;
  isAccent?: boolean;
}

export default function StatPill({ label, value, isAccent = false }: StatPillProps) {
  return (
    <View 
      style={{ 
        backgroundColor: "#121212",
        ...(isAccent ? { borderLeftWidth: 2, borderLeftColor: "#59D499" } : {})
      }} 
      className="rounded-md p-2.5 flex-col justify-center"
    >
      <Text className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">
        {label}
      </Text>
      <Text 
        className="text-body-sm font-bold mt-0.5"
        style={{ color: isAccent ? "#59D499" : "#F4F4F6" }}
      >
        {value}
      </Text>
    </View>
  );
}
