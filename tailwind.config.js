const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        /* Surface ladder */
        bg: {
          canvas: "rgb(var(--color-bg-canvas) / <alpha-value>)",
          surface: "rgb(var(--color-bg-surface) / <alpha-value>)",
          elevated: "rgb(var(--color-bg-elevated) / <alpha-value>)",
          card: "rgb(var(--color-bg-card) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--color-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
          muted: "rgb(var(--color-text-muted) / <alpha-value>)",
          ash: "rgb(var(--color-text-ash) / <alpha-value>)",
          stone: "rgb(var(--color-text-stone) / <alpha-value>)",
          inverse: "rgb(var(--color-text-inverse) / <alpha-value>)",
          accent: "rgb(var(--color-text-accent) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--color-accent) / <alpha-value>)",
          soft: "rgb(var(--color-accent-soft) / <alpha-value>)",
          pressed: "rgb(var(--color-accent-pressed) / <alpha-value>)",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          hairline: "rgb(var(--color-border-hairline) / <alpha-value>)",
          soft: "rgb(var(--color-border-soft) / <alpha-value>)",
          strong: "rgb(var(--color-border-strong) / <alpha-value>)",
        },
        feedback: {
          danger: "rgb(var(--color-feedback-danger) / <alpha-value>)",
          warning: "rgb(var(--color-feedback-warning) / <alpha-value>)",
          info: "rgb(var(--color-feedback-info) / <alpha-value>)",
        },
        cta: {
          bg: "rgb(var(--color-cta-bg) / <alpha-value>)",
          pressed: "rgb(var(--color-cta-pressed) / <alpha-value>)",
        },
        /* shadcn compat */
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        headline: ["Inter", "System"],
        body: ["Inter", "System"],
        label: ["Inter", "System"],
      },
      fontSize: {
        /* DESIGN.md typography scale */
        "display-lg": ["48px", { lineHeight: "52.8px", fontWeight: "600" }],
        "heading-xl": ["28px", { lineHeight: "33.6px", fontWeight: "600" }],
        "heading-lg": ["24px", { lineHeight: "28.8px", fontWeight: "600" }],
        "heading-md": ["20px", { lineHeight: "26px", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "27px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "21px", fontWeight: "400" }],
        "caption-md": ["13px", { lineHeight: "18.2px", fontWeight: "400", letterSpacing: "0.1px" }],
        "caption-sm": ["12px", { lineHeight: "16.8px", fontWeight: "500", letterSpacing: "0.2px" }],
        "button-md": ["15px", { lineHeight: "21px", fontWeight: "500", letterSpacing: "0.2px" }],
        "button-sm": ["13px", { lineHeight: "18.2px", fontWeight: "500", letterSpacing: "0.2px" }],
        /* Legacy shadcn compat */
        headline: ["32px", { lineHeight: "40px", letterSpacing: "-0.4px" }],
        body: ["16px", { lineHeight: "24px", letterSpacing: "0px" }],
        label: ["14px", { lineHeight: "20px", letterSpacing: "0.1px" }],
      },
      borderRadius: {
        /* DESIGN.md radius scale */
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        /* shadcn compat */
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("tailwindcss-animate")],
};
