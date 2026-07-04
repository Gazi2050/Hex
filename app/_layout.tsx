import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { NAV_THEME } from "@/lib/theme";
import "./global.css";

export default function RootLayout() {
  return (
    <ThemeProvider value={NAV_THEME}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
      <PortalHost />
    </ThemeProvider>
  );
}
