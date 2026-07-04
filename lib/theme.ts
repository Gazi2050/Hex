import { DarkTheme, type Theme } from "@react-navigation/native";

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
