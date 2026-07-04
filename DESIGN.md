## Overview

Hex is a local-first habit tracker for Android. No accounts, no cloud, no API — everything lives on-device. The design philosophy inherits from Raycast's marketing system: a single uninterrupted dark canvas, a subtle surface ladder for elevation (no drop shadows), hairline 1px borders, and Inter typography with `ss03` enabled. The app has exactly one mode — dark — and uses animation sparingly but deliberately to make interactions feel fluid and physical.

The core experience is a minimal, distraction-free habit list. There is no chrome beyond what the task demands: a list of habits, tap to complete, swipe for actions, and a gentle streak counter. Every visual element earns its place.

**Key Characteristics:**

- Single dark surface mode with a 4-step surface ladder: `canvas` → `surface` → `surface-elevated` → `surface-card`
- Hairline 1px borders carry every card and divider edge; no drop shadows anywhere
- Inter typography with `font-feature-settings: "calt", "kern", "liga", "ss03"` — the ss03 alternate `g` is part of the brand voice
- Multi-radius vocabulary: `sm` (6px) for streak badges, `md` (8px) for habit rows and buttons, `lg` (12px) for cards, `xl` (16px) for modals
- Accent color reserved for completion states and streak indicators — never used on chrome or non-interactive surfaces
- Animations are performance-conscious (native driver where possible) and communicate state changes: habit completion, streak milestones, page transitions
- No theme toggle — dark mode is the only mode

## Design Principles

1. **One surface, no noise.** Every pixel of chrome serves a purpose. If it doesn't help the user track or complete a habit, it doesn't exist.
2. **Completion as celebration.** The primary interaction (marking a habit done) must feel satisfying — a brief animation, a subtle accent glow, a streak counter increment.
3. **Progressive disclosure.** Show only what's relevant now. Past habits fade. Future habits wait quietly. Today is the focus.
4. **Physical feel.** Animations use spring physics (react-native-reanimated) rather than linear/ease curves. Interactions should feel like touching a real object.
5. **Local-first, private.** No loading spinners for network requests. No empty states that say "pull to refresh." Data is always available, always fast.

## Colors

### Surface Ladder

| Token               | Hex       | Use                                                              |
| ------------------- | --------- | ---------------------------------------------------------------- |
| `bg-canvas`         | `#07080A` | Full-screen background, the deepest surface                      |
| `bg-surface`        | `#0D0D0D` | Habit cards, bottom sheet backgrounds                            |
| `bg-surface-elevated` | `#101111` | Active habit row, pressed card state, input fields              |
| `bg-surface-card`   | `#121212` | Streak badge fill, keycap-style pill backgrounds                 |

### Accent (Completion)

| Token                  | Hex       | Use                                                     |
| ---------------------- | --------- | ------------------------------------------------------- |
| `accent`               | `#59D499` | Completed state: checkmark, streak glow, progress fill  |
| `accent-soft`          | `rgba(89, 212, 153, 0.15)` | Completion badge background, subtle glow backgrounds    |
| `accent-pressed`       | `#3FB87E` | Pressed/active completion state                         |

### Text

| Token            | Hex       | Use                                              |
| ---------------- | --------- | ------------------------------------------------ |
| `text-primary`   | `#F4F4F6` | Habit names, headlines, primary labels           |
| `text-secondary` | `#CDCDCD` | Habit descriptions, secondary labels             |
| `text-muted`     | `#9C9C9D` | Streak counts (default), metadata, timestamps    |
| `text-ash`       | `#6A6B6C` | Disabled text, empty states                      |
| `text-stone`     | `#434345` | Lowest-emphasis utility text                     |
| `text-inverse`   | `#000000` | Text on accent/white pill backgrounds            |
| `text-accent`    | `#59D499` | Active streak numbers, completion text           |

### Borders & Dividers

| Token             | Hex                           | Use                                              |
| ----------------- | ----------------------------- | ------------------------------------------------ |
| `border-hairline` | `#242728`                     | Card borders, habit row separators               |
| `border-soft`     | `rgba(255, 255, 255, 0.08)`  | Subtle inner dividers, over-surface separators   |
| `border-strong`   | `rgba(255, 255, 255, 0.16)`  | Input focus rings, elevated card borders         |

### Feedback Colors (reserved, minimal use)

| Token               | Hex       | Use                                              |
| ------------------- | --------- | ------------------------------------------------ |
| `feedback-danger`   | `#FF6161` | Delete confirmation, destructive actions         |
| `feedback-warning`  | `#FFC533` | Missed habit indicators, streak-at-risk          |
| `feedback-info`     | `#57C1FF` | Info tooltips, onboarding hints                  |

### CTA

| Token         | Hex       | Use                                              |
| ------------- | --------- | ------------------------------------------------ |
| `cta-bg`      | `#FFFFFF` | Primary button backgrounds (white pill)          |
| `cta-pressed` | `#E8E8E8` | Pressed state for primary button                 |

## Typography

### Font Family

**Inter** is the primary face. Enable `font-feature-settings: "calt", "kern", "liga", "ss03"` on the body to get the signature Raycast alternate `g` glyph. No monospace face needed — the app has no code surfaces.

### Scale

| Token              | Size  | Weight | Line Height | Letter Spacing | Use                                          |
| ------------------ | ----- | ------ | ----------- | -------------- | -------------------------------------------- |
| `display-lg`       | 48px  | 600    | 1.1         | 0              | Splash screen, empty-state headline          |
| `heading-xl`       | 28px  | 600    | 1.2         | 0              | Date headers ("Today", "Yesterday")          |
| `heading-lg`       | 24px  | 600    | 1.2         | 0              | Section titles                               |
| `heading-md`       | 20px  | 500    | 1.3         | 0              | Modal titles, sheet headers                  |
| `body-lg`          | 18px  | 400    | 1.5         | 0              | Habit names (primary list)                   |
| `body-md`          | 16px  | 400    | 1.5         | 0              | Habit descriptions, body text                |
| `body-sm`          | 14px  | 400    | 1.5         | 0              | Streak counters, metadata                    |
| `caption-md`       | 13px  | 400    | 1.4         | 0.1px          | Timestamps, secondary metadata               |
| `caption-sm`       | 12px  | 500    | 1.4         | 0.2px          | Badge text, chip labels                      |
| `button-md`        | 15px  | 500    | 1.4         | 0.2px          | Button labels                                |
| `button-sm`        | 13px  | 500    | 1.4         | 0.2px          | Small button labels, chip actions            |

### Typography Tokens (Tailwind)

- `font-headline` → heading text (xl, lg, md)
- `font-body` → body text (lg, md, sm)
- `font-label` → button and caption text
- `text-headline`, `text-body`, `text-label` → font-size + line-height + letter-spacing presets

## Spacing

Base unit: 4px grid.

| Token   | Value | Use                                          |
| ------- | ----- | -------------------------------------------- |
| `xxs`   | 4px   | Icon-to-label gap, inline chip padding       |
| `xs`    | 8px   | Tight element gap, list item inner padding   |
| `sm`    | 12px  | Card inner padding, button horizontal pad    |
| `md`    | 16px  | Standard gap, card padding, section padding  |
| `lg`    | 24px  | Section separation, card grid gap            |
| `xl`    | 32px  | Large section breaks                         |
| `xxl`   | 48px  | Top/bottom screen padding, modal padding     |
| `section` | 64px | Major content block separation               |

## Shapes

### Border Radius

| Token       | Value  | Use                                            |
| ----------- | ------ | ---------------------------------------------- |
| `none`      | 0px    | Full-bleed surfaces, screen backgrounds        |
| `xs`        | 4px    | Streak badge, inline chips                     |
| `sm`        | 6px    | Small buttons, keycap-style elements           |
| `md`        | 8px    | Habit rows, standard buttons, input fields     |
| `lg`        | 12px   | Cards, bottom sheets                           |
| `xl`        | 16px   | Modals, large cards                            |
| `full`      | 9999px | Pill buttons, streak pill, completion toggle   |

## Elevation & Depth

No drop shadows. Depth is built entirely from the surface-color ladder:

| Level | Treatment                                        | Use                                                     |
| ----- | ------------------------------------------------ | ------------------------------------------------------- |
| 0     | `bg-canvas` — deepest, no border                 | Screen background, empty areas                          |
| 1     | `bg-surface` + 1px `border-hairline`            | Habit cards, list items                                 |
| 2     | `bg-surface-elevated` + 1px `border-hairline`   | Active/pressed card, bottom sheet, modal background     |
| 3     | `bg-surface-card`                                | Inline elevated elements: streak badges, completion indicators |

## Animation System

All animations use `react-native-reanimated` with native driver enabled. The animation vocabulary is small and purposeful:

### Motion Tokens

| Token               | Easing / Config                                    | Use                                              |
| ------------------- | -------------------------------------------------- | ------------------------------------------------ |
| `spring-default`    | `{ damping: 20, stiffness: 200, mass: 1 }`        | Standard transitions: card press, list reorder   |
| `spring-bouncy`     | `{ damping: 12, stiffness: 180, mass: 1 }`        | Completion celebration: checkmark, streak pop    |
| `spring-snappy`     | `{ damping: 30, stiffness: 300, mass: 0.8 }`      | Modal open/close, sheet transitions              |
| `timing-fast`       | `{ duration: 150, easing: Easing.out(Easing.ease) }` | Micro-interactions: toggle, chip, badge         |
| `timing-smooth`     | `{ duration: 300, easing: Easing.inOut(Easing.ease) }` | Page transitions, fade in/out                   |

### Animation Rules

1. **Completion is the hero animation.** Tapping a habit to complete it triggers a spring-bouncy scale + opacity animation on the checkmark, a brief accent glow on the row background, and a counter increment with a micro pop.
2. **Streak milestones pulse.** When a habit reaches a streak milestone (7, 30, 100 days), the streak badge does a one-time spring-bouncy scale pulse.
3. **Page transitions use shared element where possible.** Navigating from the habit list to a habit detail shares the habit row as a transition element.
4. **List changes animate with LayoutAnimation or Reanimated layout animations.** Adding, removing, or reordering habits should never jump.
5. **No animation without purpose.** Never animate for decoration. Every motion communicates a state change.

## Components

### Habit Row (`habit-row`)

The core UI element. A horizontal row displaying one habit.

- **Default state:** `bg-surface`, 1px `border-hairline` bottom only, padding `sm` (12px) vertical / `md` (16px) horizontal, rounded `md` (8px)
- **Layout:** Completion toggle at left → habit name + description stack (center, flex-1) → streak badge at right
- **Pressed state:** background transitions to `bg-surface-elevated` with `spring-default` (150ms)
- **Completed state:** checkmark fills with `accent`, row background gets a subtle `accent-soft` overlay, habit name gets a strikethrough effect that fades in via `timing-fast`
- **Swipe left** reveals a delete action in `feedback-danger`
- **Swipe right** reveals an edit/snooze action
- **Long press** enters reorder mode with `spring-snappy` scale on the row

### Completion Toggle (`completion-toggle`)

- **Default state:** 24×24 circle, 1.5px `border-hairline`, transparent fill, rounded `full`
- **Completed state:** `accent` fill, white checkmark icon, `spring-bouncy` scale animation (0.8 → 1.15 → 1.0)
- **Pressed:** `spring-default` scale to 0.92
- **The toggle IS the primary interaction.** It must feel satisfying and responsive.

### Streak Badge (`streak-badge`)

- **Background:** `bg-surface-card`, padding `2px 8px`, rounded `xs` (4px)
- **Text:** `caption-sm` in `text-muted` for normal state, `text-accent` when streak is active or at a milestone
- **Milestone animation:** `spring-bouncy` scale pulse on 7/30/100/365 day milestones
- **Empty state (streak=0):** hidden entirely — no zero badge

### Habit Detail Sheet (`habit-detail`)

- **Trigger:** tap habit row (not the toggle)
- **Presentation:** bottom sheet, `bg-surface-elevated`, 1px `border-hairline` top, rounded `xl` (16px) top corners
- **Animation:** `spring-snappy` slide-up with backdrop opacity fade
- **Content:** habit name (editable), description, streak history (7-day mini calendar), completion time chart, edit/delete actions
- **Dismiss:** swipe down or tap backdrop

### Add Habit FAB (`fab`)

- **Background:** `cta-bg` (white pill), `text-inverse` (black) icon, 56×56 circle, rounded `full`
- **Position:** bottom-right, 24px from edges
- **Animation:** `spring-snappy` scale on press, `spring-bouncy` entrance animation on first app open
- **Action:** opens the add-habit modal

### Add/Edit Habit Modal (`habit-form`)

- **Background:** `bg-surface-elevated`, 1px `border-hairline`, rounded `xl` (16px), padding `xl` (32px)
- **Animation:** `spring-snappy` scale + fade entrance
- **Fields:** habit name (required), description (optional), scheduled days (chip toggle row), reminder time (optional)
- **CTA:** `cta-bg` (white pill) "Save" button, secondary "Cancel" text button

### Day Selector (`day-selector`)

- **Layout:** horizontal scrollable row of 7 day chips
- **Default chip:** `bg-surface`, 1px `border-hairline`, rounded `full`, `body-sm` in `text-secondary`
- **Selected chip:** `bg-surface-card`, 1px `border-strong`, `text-primary`
- **Today chip:** subtle `accent-soft` border glow
- **Animation:** `timing-fast` chip transition

### Empty State (`empty-state`)

- **First launch only.** After the first habit is created, this screen never appears again.
- **Content:** `display-lg` headline ("Start small"), `body-md` description, `cta-bg` (white pill) CTA
- **Animation:** fade + slight translateY entrance with `timing-smooth`

### Progress Ring (`progress-ring`)

- **Use:** daily completion summary (top of habit list) or habit detail view
- **Track:** `bg-surface`, stroke 3px
- **Fill:** `accent`, stroke 3px
- **Animation:** animated stroke-dashoffset on value change with `spring-snappy`

## Screens & Navigation

### Screen: Home (Today's Habits)

- **Top bar:** "Today" heading (`heading-xl`), date subtitle (`body-sm` in `text-muted`), progress ring at trailing edge
- **Body:** vertical scrollable list of `habit-row` components, grouped by completion status (pending → completed)
- **Empty:** `empty-state` component (first launch only)
- **Bottom:** `fab` component
- **Swipe-to-complete:** swipe right on a habit row to toggle completion (alternative to tap-on-toggle)

### Screen: Habit Detail

- Present as a bottom sheet from Home
- Streak calendar (7-day mini grid), weekly/monthly completion stats
- Edit habit, delete habit actions
- Back via swipe-down or close button

### Screen: All Habits (History)

- Accessible via tab or header action
- Grouped by date (Today, Yesterday, This Week, Earlier)
- Same `habit-row` component, non-interactive toggle (read-only)
- Tap to open detail sheet

### Navigation Structure

Tab-based (bottom tabs):
1. **Today** — active habits for today (primary screen)
2. **History** — past habit completion log

No more than 2 tabs. The app should feel like a single screen with a secondary view, not a multi-section app.

## Do's and Don'ts

### Do

- Render the entire app in one continuous dark mode. No light variant. No theme toggle.
- Use `cta-bg` (white pill) for exactly one primary action per screen. White is the universal action indicator.
- Build elevation from the surface-color ladder, never from drop shadows.
- Enable `font-feature-settings: "calt", "kern", "liga", "ss03"` on all text.
- Use spring animations for all interactive state changes. Linear and ease curves only for non-interactive transitions.
- Reserve `accent` (green) exclusively for completion states. Nothing else in the app uses this color.
- Keep the habit list as the primary surface. Other screens (detail, history, form) are secondary and accessed via overlay or tab.
- Store all data locally. No network indicators, no loading states for data fetches.

### Don't

- Don't introduce a light mode or theme toggle. Dark mode is the identity.
- Don't add drop shadows on cards or elevated surfaces.
- Don't use accent green on anything that isn't a completion state, streak, or progress indicator.
- Don't animate purely for decoration. Every animation must communicate state.
- Don't add features that require accounts, cloud sync, or network access.
- Don't add more than 2 bottom tabs. The app is a habit tracker, not a platform.
- Don't use flat (0px) borders on cards — always use 1px hairline borders.
- Don't use Inter without `ss03`. The typography loses its identity without it.

## Responsive Behavior

Android-only, portrait-first. The app targets phones (360–428dp width). No tablet or landscape optimization needed for v1.

## Animation Priority

1. Completion toggle (spring-bouncy, 200ms)
2. Streak milestone pulse (spring-bouncy, 300ms, one-shot)
3. FAB entrance (spring-bouncy, 400ms, on first render)
4. Bottom sheet / modal transitions (spring-snappy, 250ms)
5. List item add/remove (LayoutAnimation, 200ms)
6. Page transitions (timing-smooth, 300ms)
7. Chip/toggle transitions (timing-fast, 150ms)
8. Progress ring fill (spring-snappy, 400ms)
