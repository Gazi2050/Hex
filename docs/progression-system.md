# Progression System — Hex

> Design document for the level, XP, and achievement system.
> This describes logic and intent, not implementation code.

---

## Table of Contents

1. [Overview](#overview)
2. [XP System](#xp-system)
3. [Level Curve](#level-curve)
4. [100 Levels (Fire Theme)](#100-levels)
5. [100 Achievements](#100-achievements)
6. [Achievement Checking Logic](#achievement-checking-logic)
7. [Integration Points](#integration-points)
8. [Appendix: Edge Cases & Design Decisions](#appendix)

---

## Overview

The progression system lives alongside the existing habit-tracking core. It does not replace streaks, logs, or habits — it wraps them in a gamified progression layer that runs on top.

**Two independent progress axes:**
- **Levels** — derived from XP, monotonically increasing, 1–100, named by fire theme.
- **Achievements** — checkboxes, 100 total, each with fixed XP reward, unlocked once permanently.

The home screen streak card shows the user's current level and level name.
The Achievements tab lists all 100 achievements with locked/unlocked state and progress hints.

### Data it reads (read-only from habit store)
- `habits[]` — count, repeatDays, creation dates
- `logs[]` — habitId, date, timestamp
- `achievements[]` — id, unlockedAt (null = locked)

### Data it contributes
- `xp: number` (derived, not stored — recomputed from logs + achievements)
- `level: number` (derived from xp)
- `newlyUnlockedAchievements: string[]` (computed post-action)

---

## XP System

### XP Sources

| Action | XP Gained | Frequency |
|--------|-----------|-----------|
| Complete a habit (toggle on) | +10 | Many times/day |
| Achieve a perfect day | +25 | Once/day max |
| Unlock an achievement | +`xpReward` (varies) | Once per achievement |

**No XP is lost.** No decay, no penalties for missed days, no "streak protection" purchases. XP only goes up.

### XP Calculation

XP is **derived state**, not stored. It is recomputed from two sources:

```
Total XP = Sum(completion XP) + Sum(perfect day XP) + Sum(achievement XP rewards)
```

Where:
- **Completion XP** = `logs.length * 10`
- **Perfect day XP** = `count of distinct calendar dates where every habit scheduled for that day has a log entry * 25`
- **Achievement XP** = sum of `xpReward` for all achievements where `unlockedAt !== null`

### Perfect Day Definition

A "perfect day" means: for a given calendar date, every habit whose `repeatDays` includes that day's weekday has at least one log entry for that date.

- For a future day or a day with no habits scheduled: not a perfect day.
- For a day where some habits are scheduled and all are completed: perfect day.
- For a day where 0 habits are scheduled: not a perfect day (vacuously true would inflate counts).

### Implementation note on recomputation

Since XP is derived, it is recalculated on every action (or when the app loads). This is cheap: `logs.length` is O(1), achievement count is at most 100, and perfect-day checks need iteration but benefit from indexing logs by date + scheduled habits. Implementation should cache the result per action frame (useMemo in React, or recompute in store subscriber).

---

## Level Curve

### Formula

```
Cumulative XP to reach level N = floor(500 × (2^((N - 1) / 10) - 1))
```

- Level 1: 0 XP (starting point)
- Level 2: ~36 XP (~3-4 completions)
- Level 10: ~433 XP (~1 week of light use)
- Level 20: ~1,373 XP (~2-3 weeks)
- Level 50: ~14,691 XP (~2-3 months daily)
- Level 100: ~476,816 XP (~1+ year of consistent use)

### Curve Shape

The curve is exponential with a base of 2 over 10-level tiers:

- Each tier (10 levels) requires roughly 2× the cumulative XP of the previous tier.
- L1–10: quick, achievable in the first week (onboarding feels rewarding).
- L11–30: steady, sustains the first month.
- L31–50: slowing, rewards multi-month commitment.
- L51–80: the true midgame grind.
- L81–100: endgame, takes many months of daily use + achievement hunting.

### XP Table (Sample)

| Level | Cumulative XP | XP to next level |
|-------|---------------|------------------|
| 1 | 0 | 36 |
| 5 | ~148 | ~41 |
| 10 | ~433 | ~58 |
| 15 | ~768 | ~72 |
| 20 | ~1,373 | ~112 |
| 30 | ~3,720 | ~243 |
| 40 | ~9,407 | ~548 |
| 50 | ~14,691 | ~695 |
| 60 | ~28,295 | ~1,509 |
| 70 | ~69,740 | ~3,838 |
| 80 | ~174,401 | ~9,673 |
| 90 | ~350,909 | ~16,757 |
| 100 | ~476,816 | — (max) |

### Determining Level from XP

Given `totalXP` (a number), find the highest `N` where `xpForLevel(N) <= totalXP`.
If `xpForLevel(100) <= totalXP`, level = 100 (capped).

This is a reverse lookup into the same exponential formula. A simple while-loop from 1 to 100 is fast enough (100 iterations max). Binary search also fine.

---

## 100 Levels

### Naming Theme: Fire

The fire theme pairs with the existing streak-ring flame animation and the metaphor of "keeping your habit fire burning." Each 10-level tier represents a stage of fire's lifecycle.

10 tiers × 10 names each = 100.

### Tier 1 — Spark (L1–10) — beginning

| Level | Name | Design intent |
|-------|------|---------------|
| 1 | Cinder | The first surviving remnant of something that burned before. The user is starting or restarting. |
| 2 | Spark | A single point of ignition. Minimal visible output but immense potential. |
| 3 | Ashling | A tiny ember that clings to life. Fragile but present. |
| 4 | Kindling | The material that feeds a new fire. The user is gathering habits. |
| 5 | Tinderscout | Someone who finds the right materials to start fires. The user is exploring what habits work. |
| 6 | Matchhead | A single strike can ignite it. The user is ready to burn. |
| 7 | Flintborn | Born from the spark of flint on steel. Effort created this fire. |
| 8 | Strike | The decisive action. The fire is now self-sustaining. |
| 9 | First Glow | The fire casts its first light. Others can see it. |
| 10 | First Flame | A real flame, no longer just sparks. The user has established consistency. |

### Tier 2 — Ember (L11–20) — catching hold

| Level | Name | Design intent |
|-------|------|---------------|
| 11 | Coal Walker | Someone who tends the coals. The user maintains habits without fanfare. |
| 12 | Heat Seeker | Moving toward more warmth. The user is motivated by growing momentum. |
| 13 | Soot Sprite | Small but persistent. Charred particles that carry fire onward. |
| 14 | Emberkeeper | Guards the embers from dying. Reliability is forming. |
| 15 | Ash Warden | Watches over the remains of past fires. The user recognizes their progress. |
| 16 | Cinderheart | A core of persistent warmth. The habit fire is internalized. |
| 17 | Coalcrafter | Shapes the fuel. The user is optimizing their routine. |
| 18 | Bedded Ember | Settled heat that burns long. Consistency over intensity. |
| 19 | Hearth Tender | The one who keeps the home fire alive. Dependable. |
| 20 | Ember Bright | Glowing ember that lights a room. The user's progress is visible. |

### Tier 3 — Flame (L21–30) — visible fire

| Level | Name | Design intent |
|-------|------|---------------|
| 21 | Flame Bearer | Carries the fire forward. The user is an active habit-keeper. |
| 22 | Wicklighter | Ignites the wick. Precision and patience. |
| 23 | Torch Carrier | Lighting the path ahead for others. The user is becoming a role model. |
| 24 | Lamplighter | One who lights lamps one by one. Methodical habit-building. |
| 25 | Flame Dancer | Moves gracefully with fire. The user's habit system flows naturally. |
| 26 | Beaconlit | Shines as a beacon. Others notice the user's consistency. |
| 27 | Wickward | The keeper of the wick. Focus on the small things that keep habits alive. |
| 28 | Candleward | Guardian of candlelight. Steady, calm, persistent. |
| 29 | Braziersson | Born of the brazier. Communal warmth — the user inspires others by example. |
| 30 | Steady Flame | Not the biggest fire, but it never goes out. True reliability. |

### Tier 4 — Blaze (L31–40) — spreading

| Level | Name | Design intent |
|-------|------|---------------|
| 31 | Blaze Walker | Walks through fire. The user handles disruption without breaking habits. |
| 32 | Wildspark | Fire that jumps ahead. The user is growing faster than expected. |
| 33 | Brushfire | Quick, spreading, energetic. The user's habit system is expanding. |
| 34 | Flamestorm | Fire with its own weather. The user's consistency creates its own momentum. |
| 35 | Blazewind | Wind-fed fire. External challenges only strengthen the user's resolve. |
| 36 | Firetrail | A burning path behind. Each habit leaves a mark. |
| 37 | Flashpoint | The moment everything ignites. The user has reached critical consistency. |
| 38 | Sparkfall | Showers of sparks. Ideas and habits multiply. |
| 39 | Firetide | Fire like a rising tide. Methodical, unavoidable progress. |
| 40 | Roaring Blaze | Loud, powerful, impossible to ignore. The user's discipline is self-evident. |

### Tier 5 — Inferno (L41–50) — powerful

| Level | Name | Design intent |
|-------|------|---------------|
| 41 | Inferno Lord | Commander of great fire. Months of sustained effort. |
| 42 | Firebrand | A burning piece of wood that starts new fires. The user's example lights others. |
| 43 | Pyrewalker | One who walks the pyre. Unflinching commitment. |
| 44 | Charborn | Reborn from charcoal. The user has rebuilt habits after a loss. |
| 45 | Cinderkin | Kin to the ember. Deep-burning, familial commitment. |
| 46 | Flameforged | Tempered in fire. Adversity made the user's habits stronger. |
| 47 | Emberfist | Fire in hand. The user has agency over their habits, not the reverse. |
| 48 | Pyromancer | Master of fire's will. The user shapes their habit system intentionally. |
| 49 | Infernomancer | Beyond pyromancer. Deep understanding of what sustains fire. |
| 50 | True Inferno | An inferno that needs no tending. Habits are fully automatic. |

### Tier 6 — Pyre (L51–60) — ritual

| Level | Name | Design intent |
|-------|------|---------------|
| 51 | Pyre Tender | Builds and maintains the ritual pyre. Daily practice is ceremonial. |
| 52 | Bonfire Keeper | Sustains the gathering fire. The user's habits anchor their community. |
| 53 | Flame Witness | Has seen what fire can do. Perspective from long-term tracking. |
| 54 | Ash Priest | Reads meaning in the remains. The user reflects on past streaks wisely. |
| 55 | Pyre Singer | Fire songs that sustain community. Encouragement for others. |
| 56 | Emberchanter | Charms the ember into flame. The user can reignite after setbacks. |
| 57 | Coal Druid | One with the sleeping fire. Patience with slow progress. |
| 58 | Flameburden | Carries the weight of great fire. Responsibility for one's system. |
| 59 | Pyre Lord | Master of the great fire. Leadership through sustained example. |
| 60 | Eternal Pyre | A fire built to last forever. The user's habits will survive disruption. |

### Tier 7 — Bonfire (L61–70) — beacon/community

| Level | Name | Design intent |
|-------|------|---------------|
| 61 | Bonfiremaster | Commands the gathering flame. The user has built something communal. |
| 62 | Beaconfire | A fire that signals across distances. The user's progress is widely visible. |
| 63 | Signal Keeper | Maintains the signal fire. Never lets the message go dark. |
| 64 | Gatherflame | Flame that draws people. Others come to the user for motivation. |
| 65 | Hearthmaster | Master of the heart of the home. Habits as the center of daily life. |
| 66 | Fire Speaker | Speaks the language of fire. Deep intuition about what sustains habits. |
| 67 | Flame Council | One voice among fires. The user has joined an elite tier of consistent people. |
| 68 | Bonewise | So old the bones remember. Near-atomic habit integration. |
| 69 | Ashenward | Protective of the final remains. The user values even the smallest ember of progress. |
| 70 | Great Bonfire | A bonfire that defines its landscape. The user's habits define their daily life. |

### Tier 8 — Wildfire (L71–80) — uncontrollable

| Level | Name | Design intent |
|-------|------|---------------|
| 71 | Wildfire | Fire beyond control. The user's discipline has become unstoppable. |
| 72 | Stormfire | Fire born of lightning. Sudden breakthroughs from accumulated consistency. |
| 73 | Fire Cyclone | Spinning column of flame. Energy that feeds itself endlessly. |
| 74 | Flame Rush | A surge of fire across the land. Rapid expansion of habit domains. |
| 75 | Firewall | An impassable wall of flame. No excuse penetrates. |
| 76 | Blaze Rider | Rides the leading edge of fire. Momentum is the user's natural state. |
| 77 | Wildflame | Untamed, pure, alive. Instinctive consistency without willpower. |
| 78 | Firebreath | Exhales flame. The user's very presence ignites action. |
| 79 | Untamed Blaze | Beyond domestication. Nothing contains the user's drive. |
| 80 | Wildfire King | Crowned by flame. Uncontested in the domain of consistency. |

### Tier 9 — Phoenix (L81–90) — rebirth/mastery

| Level | Name | Design intent |
|-------|------|---------------|
| 81 | Phoenix Born | Born from the ashes of an old self. Major transformation achieved. |
| 82 | Reborn Ember | The ember that started the second fire. Resilient recovery. |
| 83 | Ash Risen | Standing again after burning completely. The user has overcome significant breaks. |
| 84 | Phoenixkin | Kin to the immortal bird. Habits renew themselves effortlessly. |
| 85 | Wingflame | Fire that flies. The user's influence transcends their own practice. |
| 86 | Fire Reborn | Not the same fire as before — better. Iterative self-improvement proven. |
| 87 | Ashen Phoenix | Rises from finer ash. Each setback creates a cleaner restart. |
| 88 | Flameplume | A feather of pure flame. Immortal, beautiful, permanent. |
| 89 | Emberwing | Wings of ember dust. Light enough to rise, hot enough to ignite. |
| 90 | Phoenix Lord | Lord of rebirth and renewal. Mastery through countless cycles. |

### Tier 10 — Eternal (L91–100) — legendary

| Level | Name | Design intent |
|-------|------|---------------|
| 91 | Eternal Flame | A fire that never dies. Perpetual consistency across years. |
| 92 | Ageless Fire | Burns beyond time. Habits that have lasted through life changes. |
| 93 | Undying Ember | The ember that survives all extinguishing. Unkillable resolve. |
| 94 | Sun Touched | Touched by the source of all fire. Near-legendary status. |
| 95 | Star Core | The burning heart of a star. Decades of discipline concentrated. |
| 96 | Solarborn | Born of the sun. Primordial, fundamental consistency. |
| 97 | Solarflare | A release of immense energy. The user's capacity has become explosive. |
| 98 | Sunheart | A heart of pure fusion. Self-sustaining, massive output. |
| 99 | Supernova | The final, brilliant explosion. A life defined by habit. |
| 100 | Singularity | Where the rules break down. Beyond gamification — pure identity. |

---

## 100 Achievements

### Classification

100 achievements in 11 categories. Every achievement has:
- `id` — stable snake_case string, never changes after shipping
- `title` — short name (under 30 chars)
- `description` — one-sentence unlock condition
- `xpReward` — XP granted on unlock (scales with difficulty)
- `category` — grouping for display

### Rarity & XP Scale

| Achievement type | XP range | Count |
|-----------------|----------|-------|
| Onboarding | 50–200 | 5 |
| Streak milestones | 50–20,000 | 15 |
| Best streak milestones | 100–50,000 | 10 |
| Total completions | 50–50,000 | 10 |
| Perfect days | 50–50,000 | 10 |
| Habit crafter | 50–25,000 | 10 |
| Consistency | 50–1,000 | 10 |
| Time-based | 100–1,000 | 10 |
| Comeback | 50–1,000 | 5 |
| Special dates | 150–1,000 | 5 |
| Mastery | 300–15,000 | 10 |

Total XP available from achievements: ~568,000

### Category 1: Onboarding (5)

| id | Title | Description | XP |
|----|-------|-------------|-----|
| `first_habit` | First Habit | Created your first habit | 50 |
| `first_completion` | Day One | Completed a habit for the first time | 50 |
| `first_streak` | Spark Lit | Reached a 3-day streak on any habit | 100 |
| `first_perfect_day` | Flawless | Completed every scheduled habit in a single day | 100 |
| `first_week` | Week One | Tracked habits for 7 consecutive days | 200 |

**Check logic:**
- `first_habit`: `habits.length >= 1`
- `first_completion`: `logs.length >= 1`
- `first_streak`: any habit has `currentStreak >= 3`
- `first_perfect_day`: any date exists where all scheduled habits have logs
- `first_week`: the user's earliest and latest log dates span >= 7 days

### Category 2: Current Streak (15)

| id | Title | Description | XP |
|----|-------|-------------|-----|
| `streak_3` | Three's Company | 3-day streak on any habit | 50 |
| `streak_7` | Week Warrior | 7-day streak on any habit | 100 |
| `streak_14` | Fortnight Fire | 14-day streak on any habit | 200 |
| `streak_21` | Habit Formed | 21-day streak on any habit | 300 |
| `streak_30` | Monthly Burn | 30-day streak on any habit | 500 |
| `streak_45` | Midnight Oil | 45-day streak on any habit | 700 |
| `streak_60` | Two-Month Torch | 60-day streak on any habit | 900 |
| `streak_90` | Quartered Blaze | 90-day streak on any habit | 1,500 |
| `streak_100` | Centenary Flame | 100-day streak on any habit | 2,000 |
| `streak_150` | Stead Inferno | 150-day streak on any habit | 3,000 |
| `streak_200` | Double Century | 200-day streak on any habit | 4,000 |
| `streak_250` | Pyre Aspirant | 250-day streak on any habit | 5,000 |
| `streak_300` | Eternal Wick | 300-day streak on any habit | 7,000 |
| `streak_365` | Year of Fire | 365-day streak on any habit | 10,000 |
| `streak_500` | Mythkeeper | 500-day streak on any habit | 20,000 |

**Check logic:** For each habit, compute `currentStreak` from `logs` (consecutive days backward from today). If any habit's streak >= threshold, unlocked.

### Category 3: Best Streak (10)

| id | Title | Description | XP |
|----|-------|-------------|-----|
| `best_7` | Personal Best | Best-ever streak of 7 days on any habit | 100 |
| `best_30` | Personal Record | Best-ever streak of 30 days on any habit | 300 |
| `best_100` | Century Club | Best-ever streak of 100 days on any habit | 1,000 |
| `best_180` | Half-Year Hero | Best-ever streak of 180 days on any habit | 2,000 |
| `best_250` | Quarter Mill | Best-ever streak of 250 days on any habit | 3,000 |
| `best_365` | Year Walker | Best-ever streak of 365 days on any habit | 5,000 |
| `best_500` | Half Millennium | Best-ever streak of 500 days on any habit | 7,000 |
| `best_700` | Doubly Devoted | Best-ever streak of 700 days on any habit | 10,000 |
| `best_1000` | Millennial Flame | Best-ever streak of 1000 days on any habit | 15,000 |
| `best_3650` | Decade of Fire | Best-ever streak of 3650 days on any habit | 50,000 |

**Check logic:** For each habit, compute `bestStreak` from `logs` (longest consecutive-date run across all dates, not just ending today). Track each habit's best, then compare thresholds against the max.

### Category 4: Total Completions (10)

| id | Title | Description | XP |
|----|-------|-------------|-----|
| `total_10` | Getting Warmed | 10 total completions across all habits | 50 |
| `total_50` | Half Century | 50 total completions | 100 |
| `total_100` | Century Mark | 100 total completions | 200 |
| `total_250` | Burning Bright | 250 total completions | 500 |
| `total_500` | Blazing | 500 total completions | 1,000 |
| `total_1000` | Kilofire | 1,000 total completions | 2,000 |
| `total_2500` | Inferno | 2,500 total completions | 5,000 |
| `total_5000` | Pyre Walker | 5,000 total completions | 10,000 |
| `total_10000` | Ten Torch | 10,000 total completions | 20,000 |
| `total_25000` | Eternal Burn | 25,000 total completions | 50,000 |

**Check logic:** `logs.length >= threshold`. That's it.

### Category 5: Perfect Days (10)

| id | Title | Description | XP |
|----|-------|-------------|-----|
| `perfect_1` | Flawless Day | Achieved 1 perfect day | 50 |
| `perfect_3` | Hat Trick | Achieved 3 perfect days total | 100 |
| `perfect_7` | Perfect Week | Achieved 7 perfect days total | 500 |
| `perfect_14` | Fortnight Flawless | Achieved 14 perfect days total | 1,000 |
| `perfect_30` | Monthly Crown | Achieved 30 perfect days total | 2,000 |
| `perfect_50` | Half-Centurion | Achieved 50 perfect days total | 3,000 |
| `perfect_100` | Centurion | Achieved 100 perfect days total | 5,000 |
| `perfect_200` | Iron Discipline | Achieved 200 perfect days total | 10,000 |
| `perfect_365` | Year of Perfection | Achieved 365 perfect days total | 20,000 |
| `perfect_500` | Untouchable | Achieved 500 perfect days total | 50,000 |

**Check logic:** Count distinct calendar dates where all habits with `repeatDays[dayOfWeek] = true` have a log. If that count >= threshold, unlocked.

### Category 6: Habit Crafter (10)

| id | Title | Description | XP |
|----|-------|-------------|-----|
| `habits_1` | Architect | Created 1 habit | 50 |
| `habits_3` | Builder | Created 3 habits | 100 |
| `habits_5` | Designer | Created 5 habits | 200 |
| `habits_10` | Engineer | Created 10 habits | 500 |
| `habits_15` | Craftsman | Created 15 habits | 1,000 |
| `habits_20` | Visionary | Created 20 habits | 2,000 |
| `habits_25` | Mastermind | Created 25 habits | 3,000 |
| `habits_35` | Schema | Created 35 habits | 5,000 |
| `habits_50` | Habit Forge | Created 50 habits | 10,000 |
| `habits_100` | Habit Empire | Created 100 habits | 25,000 |

**Check logic:** `habits.length >= threshold`. Counts total habits ever created, not currently active (if deleteHabit reduces the count, this needs special consideration — see Appendix).

### Category 7: Consistency (10)

| id | Title | Description | XP |
|----|-------|-------------|-----|
| `all_weekdays` | Workday Warrior | Completed habits on all 5 weekdays in a single week | 200 |
| `all_weekend` | Weekend Warrior | Completed habits on both Saturday and Sunday in a single weekend | 200 |
| `full_week` | Seven Day Cycle | Completed at least one habit on all 7 days of a single week | 500 |
| `early_bird` | Early Bird | Completed a habit before 7:00 AM | 100 |
| `night_owl` | Night Owl | Completed a habit after 10:00 PM | 100 |
| `lunch_break` | Midday Strike | Completed a habit between 12:00 PM and 1:00 PM | 50 |
| `saturday_sweeper` | Saturday Sweeper | Completed every scheduled habit on a Saturday | 200 |
| `sunday_setup` | Sunday Setup | Completed every scheduled habit on a Sunday | 200 |
| `workweek_streak` | Workweek Warrior | Completed at least one habit on 5 consecutive weekdays | 300 |
| `no_skip_month` | Unbroken | Completed at least one habit every day for 30 calendar days | 1,000 |

**Check logic detail:**
- `all_weekdays`: Find any ISO week (Monday–Sunday) where at least one log exists for Monday, Tuesday, Wednesday, Thursday, and Friday.
- `all_weekend`: Same for Saturday and Sunday in any weekend.
- `full_week`: All 7 days of any ISO week have at least one log.
- `early_bird`: Any log's timestamp has hour < 7.
- `night_owl`: Any log's timestamp has hour >= 22.
- `lunch_break`: Any log's timestamp has hour >= 12 and hour < 13.
- `saturday_sweeper`, `sunday_setup`: These are single-day perfect-day variants for weekend days. Distinct from `first_perfect_day` because they're weekend-specific.
- `workweek_streak`: 5 consecutive weekdays (Mon–Fri) each with at least one log, allowing weekend gap before/after.
- `no_skip_month`: 30 consecutive calendar dates each with at least one log.

### Category 8: Time-Based (10)

| id | Title | Description | XP |
|----|-------|-------------|-----|
| `dawn_patrol` | Dawn Patrol | Completed a habit before 6:00 AM | 150 |
| `midnight_oil` | Midnight Oil | Completed a habit after midnight (12:00–5:00 AM) | 100 |
| `golden_hour` | Golden Hour | Completed a habit during sunset hour (varies, use 5:00–7:00 PM heuristic) | 100 |
| `monday_motivation` | Monday Motivation | Completed a habit on a Monday before 9:00 AM | 200 |
| `friday_feeling` | Friday Feeling | Completed every scheduled habit on a Friday | 200 |
| `new_year_first` | New Year Spark | Completed a habit on January 1st | 500 |
| `leap_day` | Leap Year Loyal | Completed a habit on February 29th | 1,000 |
| `summer_solstice` | Midsummer Fire | Completed a habit on June 21st | 300 |
| `winter_solstice` | Midwinter Ember | Completed a habit on December 21st | 300 |
| `equinox` | Equinox Ember | Completed a habit on March 20th or September 22nd | 300 |

**Check logic:** Each needs to check log timestamps and dates. `dawn_patrol` = hour < 6. `midnight_oil` = hour between 0 and 5. `golden_hour` = hour between 17 and 19. `monday_motivation` = day is Monday AND hour < 9. `friday_feeling` = day is Friday AND every scheduled habit for that day is done. The date-specific ones (solstice, new_year, leap_day, equinox) check the log's date string matches the specific calendar date.

### Category 9: Comeback (5)

| id | Title | Description | XP |
|----|-------|-------------|-----|
| `comeback_3` | Quick Return | Returned to the app after a 3-day break | 50 |
| `comeback_7` | Week Gap Comeback | Returned after a 7-day break | 100 |
| `comeback_14` | Fortnight Return | Returned after a 14-day break | 200 |
| `comeback_30` | Phoenix Rising | Returned after a 30-day break | 500 |
| `comeback_90` | Long Sleep | Returned after a 90-day break | 1,000 |

**Check logic:** Find the most recent gap in logs of >= N days. If there exists a gap of threshold days followed by a new log, unlocked. Specifically: sort log dates ascending, find consecutive-date gaps. If any gap >= threshold AND a log exists after the gap, unlocked. These are one-time achievements for the largest gap ever recovered from, not awarded repeatedly.

### Category 10: Special Dates (5)

| id | Title | Description | XP |
|----|-------|-------------|-----|
| `halloween` | Samhain Flame | Completed a habit on October 31st | 200 |
| `christmas` | Yule Fire | Completed a habit on December 25th | 200 |
| `new_year_eve` | Year-End Blaze | Completed a habit on December 31st | 300 |
| `valentine` | Heart Flame | Completed a habit on February 14th | 150 |
| `independence` | Freedom Flame | Completed a habit on July 4th | 150 |

**Check logic:** Each checks if any log's date string matches the specific date (month-day only, year-agnostic). One-shot — if multiple years match, it's still just unlocked once.

### Category 11: Mastery (10)

| id | Title | Description | XP |
|----|-------|-------------|-----|
| `seven_heaven` | Seven Heaven | 7 habits active simultaneously | 500 |
| `perfect_week_streak` | Flawless Week | 7 consecutive perfect days (in a row, not total) | 2,000 |
| `perfect_month` | Flawless Month | 30 consecutive perfect days | 5,000 |
| `streak_sage` | Streak Sage | 5 habits each with a 30+ day current streak | 3,000 |
| `streak_god` | Streak God | 10 habits each with a 30+ day current streak | 10,000 |
| `variety_queen` | Variety Queen | Completed 5 different habits in a single day | 300 |
| `variety_king` | Variety King | Completed 10 different habits in a single day | 500 |
| `long_haul` | Long Haul | Any habit active for 6 months | 5,000 |
| `decade_habit` | Decade Habit | Any habit active for 1 year | 15,000 |
| `completionist` | Completionist | Unlocked 50 other achievements | 10,000 |

**Check logic detail:**
- `seven_heaven`: `habits.length >= 7`
- `perfect_week_streak`: 7 consecutive dates where each is a perfect day. This is the consecutive version of Category 5's cumulative perfect days.
- `perfect_month`: Same as above but 30 consecutive perfect days.
- `streak_sage`: Count habits where `currentStreak >= 30`. If count >= 5, unlocked.
- `streak_god`: Same but count >= 10.
- `variety_queen`: Any single date where the number of distinct `habitId`s in logs >= 5.
- `variety_king`: Same but >= 10.
- `long_haul`: Any habit's first log date to today spans at least 6 months (182 days). Or: `habits` where `createdAt` is at least 6 months ago and has at least some recent activity.
- `decade_habit`: Same but 365 days.
- `completionist`: Count unlocked achievements excluding this one. If >= 50, unlocked.

---

## Achievement Checking Logic

### When to Check

Achievement checks run on every action that could change state:

1. **After `toggleHabit`** — may unlock: any completion-based, streak-based, perfect-day, time-based, consistency, comeback, or mastery achievement.
2. **After `addHabit`** — may unlock: `first_habit`, any habit-crafter achievement, `seven_heaven`.
3. **After `deleteHabit`** — may affect habit-crafter count, but should NOT lock already-unlocked achievements. Achievements are permanent once unlocked.
4. **On app launch** (cold start) — to retroactively unlock any achievements the user already qualifies for. This is a one-time sync, not a per-launch recomputation of all 100 checks (capped by storing checksum).

### Algorithm

```
function checkAchievements(state: HabitState): string[] {
  const alreadyUnlocked = new Set(state.achievements.filter(a => a.unlockedAt).map(a => a.id));
  const newlyUnlocked: string[] = [];

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    if (alreadyUnlocked.has(def.id)) continue;
    if (def.check(state)) {
      newlyUnlocked.push(def.id);
    }
  }

  return newlyUnlocked;
}
```

The checker is a **pure function** over state. It receives the current `habits`, `logs`, and `achievements` and returns an array of achievement IDs newly unlocked.

### Efficiency

For 100 achievements, many checks are simple (compare count to threshold). The expensive ones are:

- Current streak calculations: O(habits × streak_depth). Capped at 500 days.
- Perfect day counting: O(dates_with_logs × habits_per_day). Potentially O(N²) worst case. Mitigate by only checking dates that have at least one log.
- Consecutive perfect day streaks: similar to above.

Recommendation: run the checker in a microtask/requestIdleCallback, not synchronously on the toggling path. Show a toast for each newly unlocked achievement on the next render.

### Idempotency

Running the same checker twice with the same state returns the same results. Achievements already unlocked are skipped. This makes the app-launch sync safe: run the checker on load, any newly-unlocked IDs get timestamped and XP added.

---

## Integration Points

### Store

The HabitStore needs these additions:

1. **Store `xp: number`** — Stored, not derived. Reason: recalculating perfect-day XP from 500+ logs on every read is expensive. Update XP incrementally: on toggle, add +10; on perfect day, add +25; on achievement unlock, add +xpReward. On app launch, recalculate from scratch (logs + achievements) as a one-time sync to catch any drift.
2. **Achievement unlock handler** — after `toggleHabit`/`addHabit` completes, call the checker. If new achievements found, set `unlockedAt` and grant XP.
3. **No level stored** — Level is always derived from XP via the exponential formula.

### Derived Stats

The existing `calculateGlobalStats` function gains:

- `xp: number` — current total XP
- `level: number` — current level (1–100)
- `xpToNextLevel: number` — XP remaining to reach next level (null if max)
- `levelName: string` — name of current level (e.g. "Blaze Walker")
- `nextLevelName: string` — name of next level (or null if max)
- `achievementProgress: { unlocked: number, total: number }` — e.g. (3/100)

### UI: Home Screen Streak Card

Replace the "Total Done" stat with Level info:

**Label:** `LEVEL`
**Value:** `L42 · Blaze Walker`

Optional: compact XP bar showing progress to next level.

### UI: Achievements Tab

The Achievements tab currently shows demo data. It should become a full scrolling list of all 100 achievements, grouped by category, with:

- A header showing level badge + XP bar.
- Each achievement: icon (locked/unlocked), title, description, XP reward.
- Unlocked achievements show a completion date and XP badge.
- Locked achievements show a hint via the description.
- Categories as section headers.

### UI: Level-Up Animation

On level-up (detected by comparing pre-action level to post-action level), show a toast/sheet with:
- `LEVEL UP!`
- Previous level name → new level name with fire animation
- XP gained total
- Mini flame burst (using the existing APNG streak ring aesthetic)

---

## Appendix

### Edge Cases

**Q: What if a user deletes a habit that had achievements?**
A: Achievements are permanent. Deleting a habit does not lock achievements, reduce XP, or lower level. The `habitCount` for crafter achievements counts total habits ever created, not net active. Store a `totalCreated: number` counter separate from `habits.length` (addHabit increments it, deleteHabit does not decrement it).

**Q: What if a user deletes ALL logs?**
A: XP drops (since completion XP is recalculated). Level may drop. This is intentional — if you clear data, progression reflects current reality. However: achievements remain unlocked and their XP rewards stay. So a reset deletes only completion-based and perfect-day XP, not achievement XP. The level may drop significantly but never lower than what achievement XP alone supports.

**Q: What about timezone issues with perfect days?**
A: The existing `getLocalDateString(date)` uses the device's local timezone. All perfect-day logic uses this same local-date window. No UTC conversion needed — consistency matters more than accuracy.

**Q: Can achievements be unlocked multiple times?**
A: No. Each achievement has an `unlockedAt: string | null`. Once set, the checker skips it. The achievement is permanently in the "unlocked" set.

### Retroactive Unlock Behavior

On first ship of this system, existing users may instantly unlock many achievements. The app-launch sync handles this:

1. Load all existing logs + habits + achievements.
2. Run checker from scratch.
3. For each newly-unlocked ID: set `unlockedAt` and grant +XP.
4. Recalculate level.

This may cascade into multiple level-ups at once. The UI should handle this by showing the final level immediately, with a summary notification ("You unlocked 8 achievements!") rather than 8 separate toasts.

### Design Decisions

**Why not store derived XP?**
Stored XP avoids per-read recomputation of perfect-day state. But it drifts: if logs are deleted or imported, stored XP diverges from actual. Solution: store XP for fast reads, but provide a "Recalculate XP" function (triggered on app update or manual) that recomputes from scratch.

**Why 10 XP per completion, not variable per habit?**
Simplicity. Variable XP per habit (harder habits = more XP) adds complexity to store, UI, and user understanding. If future iterations want this, add a `difficulty` field to Habit and multiply `completion XP = 10 × difficulty`. For v1, flat rate.

**Why 100 levels and 100 achievements specifically?**
100 is a natural cap for gamified systems — it's the first three-digit number, maps to the common "Level 100" soft cap in RPGs, and 100 achievements gives enough granularity for onboarding, midgame, and endgame without overwhelming.

**Why the fire theme?**
The app already uses a flame APNG in the streak ring (components/home/streak-ring.tsx). The fire theme extends this visual vocabulary consistently. Streak = keeping the fire alive. Level = how intense the fire is. Achievement = what the fire can do. The alternative cosmic or martial themes would require new visual assets and dilute the brand.

### Unused Achievement Ideas (for future expansion)

- Seasonal: complete a habit on the first day of each season.
- Social: share a streak, invite a friend.
- Data depth: log at least one habit at 10 different hours of the day.
- Streak save: complete a habit with < 1 hour before midnight after not doing it all day.
- Incremental: reach each level milestone (L10, L20, etc.) — currently implicit in the level system itself, not an achievement.
