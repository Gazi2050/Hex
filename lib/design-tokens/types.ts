export type ThemeMode = "dark";

export type Primitives = {
  neutral: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>;
  green: Record<50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>;
};

export type ThemeTypography = {
  fontFamily: {
    headline: string;
    body: string;
    label: string;
  };
};

export type SemanticColors = {
  bg: {
    canvas: string;
    surface: string;
    elevated: string;
    card: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    ash: string;
    stone: string;
    inverse: string;
    accent: string;
  };
  accent: {
    DEFAULT: string;
    soft: string;
    pressed: string;
  };
  border: {
    hairline: string;
    soft: string;
    strong: string;
  };
  feedback: {
    danger: string;
    warning: string;
    info: string;
  };
  cta: {
    bg: string;
    pressed: string;
  };
};

export type ThemeTokens = {
  primitives: Primitives;
  semantic: SemanticColors;
  typography: ThemeTypography;
};
