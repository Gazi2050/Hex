import { Tabs } from "expo-router";
import { View } from "react-native";
import { FloatingTabBar } from "@/components/custom/floating-tab-bar";
import { HeaderPlusButton } from "@/components/custom/header-plus-button";

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
        <Tabs.Screen name="achievements" />
        <Tabs.Screen name="settings" />
      </Tabs>
      <HeaderPlusButton />
    </View>
  );
}
