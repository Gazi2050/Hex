# AGENTS.md

## Project Overview

**Hex** — an Expo SDK 54 mobile app using expo-router, NativeWind v4, and a shadcn/ui-inspired component system with a custom design token architecture.

- **Stack**: React 19.1, React Native 0.81.5, TypeScript 5.9, Expo Router ~6
- **Package manager**: pnpm
- **Platform targets**: iOS, Android, Web (static export via Metro)

## Essential Commands

```bash
pnpm dev          # Start Expo dev server (expo start)
pnpm android      # Expo dev targeting Android
pnpm ios          # Expo dev targeting iOS
pnpm web          # Expo dev targeting web
pnpm lint         # ESLint via expo lint
```

## Code Organization

```
app/               # expo-router file-based routes
  _layout.tsx      # Root layout (providers, theme, navigation)
  index.tsx        # Home screen
  global.css       # Tailwind directives + CSS custom properties (light/dark)
components/
  ui/              # shadcn/ui-style components (Button, Text, etc.)
lib/
  theme.ts         # React Navigation theme (NAV_THEME)
  utils.ts         # cn() utility (clsx + tailwind-merge)
  design-tokens/
    types.ts       # TypeScript types for tokens
    tokens.ts      # Token values (primitives, semantic light/dark, typography)
    index.ts       # Re-export barrel
docs/
  theme-system.md  # Theme system documentation
```

## Path Aliases

`@/*` maps to project root (`./*`) — configured in `tsconfig.json`. This is **not** `src/`.

## Theme System (Critical)

This project has a **token-first theme model** with three synchronized layers:

### Token Source of Truth: `lib/design-tokens/tokens.ts`
- **Primitive tokens** (`primitives.primary.*`, `secondary.*`, `tertiary.*`, `neutral.*`) — raw palette values, hex strings
- **Semantic tokens** (`semantic.bg.*`, `text.*`, `border.*`, `action.*`, `feedback.*`) — intent-based, separate light/dark values
- **Typography tokens** (`typography.fontFamily`, `fontSize`, etc.)

### Tailwind Wiring: `tailwind.config.js`
- Primitive colors exposed as `primitive-{palette}-{scale}` (e.g., `bg-primitive-secondary-900`)
- Semantic colors exposed as `{category}-{variant}` (e.g., `bg-canvas`, `text-text-primary`, `border-border-subtle`)
- Typography: `font-headline`/`text-headline`, `font-body`/`text-body`, `font-label`/`text-label`
- Dark mode via `class` strategy — NativeWind toggles `.dark` on root

### CSS Variables: `app/global.css`
- Light values under `:root`, dark values under `.dark:root`
- HSL-based shadcn variables (`--background`, `--primary`, etc.) for shadcn component compatibility
- RGB-based semantic variables (`--color-bg-canvas`, `--color-text-primary`, etc.) for the custom token system

### Dark Mode
Fallback to dark if no preference: `app/_layout.tsx:16` — `setColorScheme("dark")` when `colorScheme` is `undefined`.

## Conventions

- **UI components** follow shadcn/ui patterns: `cva` variants, `cn()` class merging, `forwardRef`-style
- **Text** component uses `TextClassContext` (React context) to allow parent components (like Button) to inject text styling into children
- **Semantic tokens preferred over primitives** in screen/feature code — documented rule in `docs/theme-system.md`
- **No raw hex colors** in UI files — add new values to tokens first
- **`asChild` pattern** via `@rn-primitives/slot` for component composition
- **`cn()`** combines `clsx` + `tailwind-merge` for conditional class merging

## Gotchas

1. **Token synchronization**: Tokens exist in three places (`tokens.ts`, `tailwind.config.js`, `global.css`). Changes to any color require updating all three.

2. **The `@/` alias is project root**, not `src/`. Imports like `@/lib/utils` resolve to `/lib/utils.ts` at the project root.

3. **NativeWind requires `jsxImportSource: "nativewind"`** in `babel.config.js`. Don't remove this — it breaks NativeWind class processing.

4. **Metro uses `withNativeWind`** wrapper (`metro.config.js`) pointing to `./app/global.css` as the input CSS file.

5. **Web builds use static output** (`"output": "static"` in `app.json`) with Metro bundler.

6. **New Architecture + React Compiler** are both enabled in `app.json` experiments. Be aware of React Compiler rules (no side effects in render, etc.).

7. **`components.json`** is the shadcn/ui config — use it as reference for component paths and aliases. Components are added under `@/components/ui`.
