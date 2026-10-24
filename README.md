<p align="center">
  <img src="assets/app_logo.png" alt="Hex" width="180" />
</p>

<h1 align="center">Hex</h1>

<p align="center">The open-source habit tracker that sweats the details. Streaks, priority pins,<br />
buttery drag-to-reorder, and real progress charts — local-first, offline, no account.</p>

<p align="center">
  <a href="https://github.com/Gazi2050/Hex">Hex</a> ·
  <a href="DESIGN.md">Design system</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#getting-started">Getting started</a>
</p>

---

Open to run, open to shape. Hex keeps every habit, log, and streak **on your
device** — no backend, no login, no telemetry. Clone it, theme it, ship your
own build. The whole project ships under the [MIT license](LICENSE).

## Features

- **Local-first, offline** — habits and history live in on-device storage
  (Zustand + AsyncStorage) with versioned migrations. Delete the app, lose
  nothing but the app.
- **Today view** — a streak hero card with your current and best streak, today's
  completion ring, and up to 3 pinned priority tasks.
- **Habit library** — up to 8 habits, each with its own icon (60+ Lucide icons),
  color, repeat days, and weekly frequency.
- **Physics-based drag reordering** — reorder priorities and habits with
  spring-driven gestures; order is committed to storage only when you drop.
- **Progress** — weekly bar chart, monthly progress ring, and yearly area chart,
  with completed/missed totals and week/month/year navigation.
- **Habit detail sheet** — streak stats, a built-in timer, and a cube heatmap of
  your history.
- **Design system** — primitive → semantic → typography tokens driving
  NativeWind, with light and dark mode (dark as the fallback).
- **Polish** — animated floating tab bar with toasts, haptics on every
  interaction, gesture-driven sheets, and guarded limits (8 habits, 3
  priorities) with clear feedback.
- **Cross-platform** — iOS, Android, and a static web export.

## Tech stack

| Layer    | What it uses                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------ |
| App      | [Expo SDK 54](https://expo.dev), [React Native 0.81](https://reactnative.dev), [React 19](https://react.dev), [Expo Router 6](https://docs.expo.dev/router/introduction/) |
| Styling  | [NativeWind v4](https://www.nativewind.dev), [Tailwind CSS](https://tailwindcss.com), custom design tokens |
| State    | [Zustand](https://zustand.docs.pmnd.rs) + [AsyncStorage](https://github.com/react-native-async-storage/async-storage) (persisted, migrated) |
| Motion   | [Reanimated 4](https://docs.swmansion.com/react-native-reanimated/), Gesture Handler, patched [reanimated-dnd](https://github.com/Okazakee/react-native-reanimated-dnd) |
| UI       | shadcn/ui-style components, [`@rn-primitives`](https://rn-primitives.com), [Lucide](https://lucide.dev), react-native-svg |
| Tooling  | [pnpm](https://pnpm.io), [TypeScript](https://www.typescriptlang.org), ESLint (expo)             |

## Getting started

You'll need [pnpm](https://pnpm.io), Node 20+, and Android Studio and/or Xcode
for native builds. No environment variables, no API keys, no accounts.

```sh
git clone https://github.com/Gazi2050/Hex.git
cd Hex
pnpm install
```

**1. Start the dev server:**

```sh
pnpm dev
```

**2. Build and run on a device or emulator:**

```sh
pnpm android   # or: pnpm ios
```

Native modules (Reanimated, Gesture Handler, SVG) mean you need a development
build — `pnpm dev` + `pnpm android` handles that. For the web export, use
`pnpm web`. A production APK builds with `pnpm build:apk`.

Patches in `patches/` apply automatically on `pnpm install` — they tune the
drag-and-drop library for GPU-composited transforms and flicker-free
scrolling. Don't remove `pnpm-workspace.yaml`.

## Architecture

Data flows in one direction:

```
screens → lib/hooks/useHabits → lib/store (Zustand)
        → persist middleware (AsyncStorage, version 5 migrations)
        → lib/derived stats → charts & hero cards
```

- **`lib/store.ts`** owns habits, logs, achievement flags, and the two order
  arrays (`habitsOrder`, `priorityOrder`), capped and reconciled by migrations.
- **Drag reordering** runs entirely on the UI thread: item positions live in
  Reanimated shared values during the gesture and are committed to the store
  only in `onDrop` via `lib/order.ts`.
- **`lib/design-tokens`** is the single source of truth for color and
  typography, mirrored into Tailwind and CSS variables (see `DESIGN.md`).

## Repository layout

```
app/            expo-router screens: Today, Habits, Progress, Settings, create/edit
components/
  ui/           shadcn/ui-style primitives (Button, Text, Checkbox, …)
  custom/       feature components (habit row, sheets, floating tab bar, DnD list)
  home/         Today screen components (streak hero)
  progress/     charts (weekly bar, monthly ring, yearly area)
lib/
  store.ts      Zustand store + persistence + migrations
  design-tokens/  primitive, semantic, and typography tokens
  derived/      stats & progress calculations
  hooks/        useHabits (sorting, caps, completion)
patches/        pnpm patches for react-native-reanimated-dnd
.github/workflows/  release automation
assets/         app icon, splash, streak flame
DESIGN.md       full design system spec
AGENTS.md       codebase conventions and gotchas
```

## Releases

Pushing to `main` triggers [`.github/workflows/release-android.yml`](.github/workflows/release-android.yml):
it typechecks, lints, stamps the version, builds a release APK, and attaches
`hex_vX.Y.Z.apk` + checksums to an auto-created GitHub release. Docs-only
changes skip CI.

## Documentation

- [DESIGN.md](DESIGN.md): colors, typography, spacing, motion, components, screens
- [AGENTS.md](AGENTS.md): conventions, token sync rules, gotchas
- [Architecture](#architecture): how data flows from screen to storage

## License

[MIT](LICENSE)
