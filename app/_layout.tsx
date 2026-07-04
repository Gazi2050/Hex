import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { NAV_THEME } from "@/lib/theme";
import { useState, useEffect } from "react";
import LoadingScreen from "./loading";
import "./global.css";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider value={NAV_THEME}>
      <StatusBar style="light" />
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Stack screenOptions={{ headerShown: false }} />
      )}
      <PortalHost />
    </ThemeProvider>
  );
}
