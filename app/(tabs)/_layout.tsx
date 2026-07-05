import { Tabs } from "expo-router";
import { View } from "react-native";
import { FloatingTabBar } from "@/components/custom/floating-tab-bar";

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <FloatingTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="habits" />
        <Tabs.Screen name="progress" />
        <Tabs.Screen name="settings" />
      </Tabs>
    </View>
  );
}
