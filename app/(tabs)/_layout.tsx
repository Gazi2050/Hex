import { Tabs } from "expo-router";
import { FloatingTabBar } from "@/components/custom/floating-tab-bar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="habits" />
      <Tabs.Screen name="progress" />
      <Tabs.Screen name="achievements" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
