import { DarkTheme, type Theme } from "@react-navigation/native";

export const THEME = {
  light: {
    background: "230 40% 98%",
    foreground: "220 45% 10%",
    card: "0 0% 100%",
    cardForeground: "220 45% 10%",
    popover: "0 0% 100%",
    popoverForeground: "220 45% 10%",
    primary: "153 59% 59%",
    primaryForeground: "0 0% 0%",
    secondary: "0 0% 96%",
    secondaryForeground: "220 45% 10%",
    muted: "0 0% 96%",
    mutedForeground: "0 0% 46%",
    accent: "153 59% 95%",
    accentForeground: "153 59% 20%",
    destructive: "0 84% 60%",
    destructiveForeground: "0 0% 100%",
    border: "0 0% 90%",
    input: "0 0% 90%",
    ring: "153 59% 59%",
    radius: "0.75rem",
  },
  dark: {
    background: "230 40% 10%",
    foreground: "220 45% 97%",
    card: "0 0% 5%",
    cardForeground: "220 45% 97%",
    popover: "0 0% 5%",
    popoverForeground: "220 45% 97%",
    primary: "153 59% 59%",
    primaryForeground: "0 0% 0%",
    secondary: "0 0% 9%",
    secondaryForeground: "220 45% 97%",
    muted: "0 0% 9%",
    mutedForeground: "0 0% 61%",
    accent: "153 59% 59%",
    accentForeground: "0 0% 0%",
    destructive: "0 100% 71%",
    destructiveForeground: "0 0% 0%",
    border: "0 2% 15%",
    input: "0 2% 15%",
    ring: "153 59% 59%",
    radius: "0.75rem",
  },
};

export const NAV_THEME: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#07080A",
    border: "#242728",
    card: "#0D0D0D",
    notification: "#FF6161",
    primary: "#59D499",
    text: "#F4F4F6",
  },
};

export type { Theme };
