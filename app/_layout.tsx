import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { NAV_THEME } from "@/lib/theme";
import { ToastContainer } from "@ncrft/native-toast";
import { useCallback, useEffect, useState } from "react";
import LoadingScreen from "./loading";
import { HabitFormSheet } from "@/components/custom/habit-form-sheet";
import { DeleteHabitDialog } from "@/components/custom/delete-habit-dialog";
import { applyDemoData } from "@/lib/seed";
import "./global.css";

type LoadState = "loading" | "fading" | "done";

export default function RootLayout() {
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    const timer = setTimeout(() => setLoadState("fading"), 2200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!__DEV__) return;
    void applyDemoData().catch(() => {});
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

      {/* Habit create/edit form — pre-mounted overlay (smooth open + close) */}
      <HabitFormSheet />
      <DeleteHabitDialog />

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
