/**
 * Verify 5-year demo data calculations.
 * Run: npx tsx scripts/verify-5year.ts
 */

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

type DayData = { date: string; completed: number; scheduled: number };
const allDays: DayData[] = [];

for (let y = 2022; y <= 2026; y++) {
  const endMonth = (y === 2026) ? 6 : 11;
  for (let m = 0; m <= endMonth; m++) {
    const dim = daysInMonth(y, m);
    const stopDay = (y === 2026 && m === 6) ? 13 : dim;
    const rand = seededRandom(y * 1000 + m * 42 + 7);

    for (let d = 1; d <= stopDay; d++) {
      const date = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      let completed = 0;
      for (let h = 0; h < 5; h++) {
        if (rand() < 0.72) completed++;
      }
      allDays.push({ date, completed, scheduled: 5 });
    }
  }
}

// ── Per year ──────────────────────────────────────────────────────────────────
const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

for (let y = 2022; y <= 2026; y++) {
  const yearDays = allDays.filter((d) => d.date.startsWith(String(y)));
  const validDays = yearDays.filter((d) => d.scheduled > 0);
  const dailyPcts = validDays.map((d) => d.completed / d.scheduled);
  const sum = dailyPcts.reduce((a, b) => a + b, 0);
  const avg = sum / dailyPcts.length;
  const totalCompleted = validDays.reduce((s, d) => s + d.completed, 0);
  const totalScheduled = validDays.reduce((s, d) => s + d.scheduled, 0);

  console.log(`${y}: ${(avg * 100).toFixed(1)}% avg · ${totalCompleted} completed · ${totalScheduled - totalCompleted} missed · ${validDays.length} days`);
}

console.log();

// ── Weekly (current) ──────────────────────────────────────────────────────────
const sun = new Date(today);
sun.setDate(sun.getDate() - sun.getDay());
sun.setHours(0, 0, 0, 0);

const weekDays: DayData[] = [];
for (let i = 0; i < 7; i++) {
  const d = new Date(sun);
  d.setDate(sun.getDate() + i);
  const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const found = allDays.find((x) => x.date === ds);
  if (found && ds <= todayStr) {
    const wd = d.toLocaleDateString("en-US", { weekday: "short" });
    const pct = found.completed / found.scheduled;
    console.log(`  ${ds} (${wd}): ${found.completed}/${found.scheduled} = ${(pct * 100).toFixed(1)}%`);
    weekDays.push(found);
  }
}
const wPcts = weekDays.map((d) => d.completed / d.scheduled);
const wSum = wPcts.reduce((a, b) => a + b, 0);
const wCompleted = weekDays.reduce((s, d) => s + d.completed, 0);
const wScheduled = weekDays.reduce((s, d) => s + d.scheduled, 0);
console.log(`Week avg: ${(wSum / wPcts.length * 100).toFixed(1)}% avg · ${wCompleted} completed · ${wScheduled - wCompleted} missed · ${weekDays.length} days`);
console.log();

// ── Monthly (July 2026) ───────────────────────────────────────────────────────
const julyDays = allDays.filter((d) => d.date.startsWith("2026-07") && d.date <= todayStr);
const jPcts = julyDays.map((d) => d.completed / d.scheduled);
const jSum = jPcts.reduce((a, b) => a + b, 0);
const jCompleted = julyDays.reduce((s, d) => s + d.completed, 0);
const jScheduled = julyDays.reduce((s, d) => s + d.scheduled, 0);
console.log(`July: ${(jSum / jPcts.length * 100).toFixed(1)}% avg · ${jCompleted} completed · ${jScheduled - jCompleted} missed · ${julyDays.length} days`);
