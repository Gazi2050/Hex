import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { NAV_THEME } from "@/lib/theme";
import { ToastContainer } from "@ncrft/native-toast";
import { useCallback, useEffect, useState } from "react";
import LoadingScreen from "./loading";
import "./global.css";

type LoadState = "loading" | "fading" | "done";

export default function RootLayout() {
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    const timer = setTimeout(() => setLoadState("fading"), 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleFadeComplete = useCallback(() => {
    setLoadState("done");
  }, []);

  return (
    <ThemeProvider value={NAV_THEME}>
      <StatusBar style="light" />

      {/* Dashboard always mounted once fading starts so it's painted underneath */}
      {loadState !== "loading" && (
        <Stack screenOptions={{ headerShown: false }} />
      )}

      {/* Loading overlay sits on top, fades out, then unmounts */}
      {loadState !== "done" && (
        <LoadingScreen
          fading={loadState === "fading"}
          onFadeComplete={handleFadeComplete}
        />
      )}

      <PortalHost />
      <ToastContainer />
    </ThemeProvider>
  );
}
