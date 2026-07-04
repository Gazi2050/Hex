import type { ThemeTokens } from "./types";

const primitives = {
  neutral: {
    50: "#F4F4F6",
    100: "#E8E8EA",
    200: "#CDCDCD",
    300: "#B0B0B1",
    400: "#9C9C9D",
    500: "#6A6B6C",
    600: "#434345",
    700: "#2A2A2C",
    800: "#18191A",
    900: "#0D0D0D",
  },
  green: {
    50: "#E8F8F0",
    100: "#C5EDD8",
    200: "#9EE0BD",
    300: "#74D3A0",
    400: "#59D499",
    500: "#3FB87E",
    600: "#2E9B66",
    700: "#1F7E50",
    800: "#13613C",
    900: "#0A4529",
  },
} as const;

const typography = {
  fontFamily: {
    headline: "Inter",
    body: "Inter",
    label: "Inter",
  },
} as const;

const semantic = {
  bg: {
    canvas: "#07080A",
    surface: "#0D0D0D",
    elevated: "#101111",
    card: "#121212",
  },
  text: {
    primary: "#F4F4F6",
    secondary: "#CDCDCD",
    muted: "#9C9C9D",
    ash: "#6A6B6C",
    stone: "#434345",
    inverse: "#000000",
    accent: "#59D499",
  },
  accent: {
    DEFAULT: "#59D499",
    soft: "rgba(89, 212, 153, 0.15)",
    pressed: "#3FB87E",
  },
  border: {
    hairline: "#242728",
    soft: "rgba(255, 255, 255, 0.08)",
    strong: "rgba(255, 255, 255, 0.16)",
  },
  feedback: {
    danger: "#FF6161",
    warning: "#FFC533",
    info: "#57C1FF",
  },
  cta: {
    bg: "#FFFFFF",
    pressed: "#E8E8E8",
  },
} as const;

export const themeTokens: ThemeTokens = {
  primitives,
  semantic,
  typography,
};

export const semanticTokenNames = {
  bg: ["canvas", "surface", "elevated", "card"],
  text: ["primary", "secondary", "muted", "ash", "stone", "inverse", "accent"],
  accent: ["DEFAULT", "soft", "pressed"],
  border: ["hairline", "soft", "strong"],
  feedback: ["danger", "warning", "info"],
  cta: ["bg", "pressed"],
} as const;
