/**
 * Verification script for the unified calculation model.
 * Uses the 100-day demo data to compute expected results manually
 * and compare against what our functions would produce.
 *
 * Run: npx tsx scripts/verify-calc.ts
 */

const DEMO_DATA = [
  { date: "2026-04-05", completed: 2, scheduled: 2 },
  { date: "2026-04-06", completed: 1, scheduled: 3 },
  { date: "2026-04-07", completed: 0, scheduled: 6 },
  { date: "2026-04-08", completed: 0, scheduled: 2 },
  { date: "2026-04-09", completed: 0, scheduled: 3 },
  { date: "2026-04-10", completed: 3, scheduled: 6 },
  { date: "2026-04-11", completed: 2, scheduled: 6 },
  { date: "2026-04-12", completed: 0, scheduled: 2 },
  { date: "2026-04-13", completed: 2, scheduled: 4 },
  { date: "2026-04-14", completed: 0, scheduled: 4 },
  { date: "2026-04-15", completed: 1, scheduled: 2 },
  { date: "2026-04-16", completed: 2, scheduled: 6 },
  { date: "2026-04-17", completed: 4, scheduled: 5 },
  { date: "2026-04-18", completed: 0, scheduled: 5 },
  { date: "2026-04-19", completed: 6, scheduled: 6 },
  { date: "2026-04-20", completed: 0, scheduled: 3 },
  { date: "2026-04-21", completed: 0, scheduled: 0 },
  { date: "2026-04-22", completed: 0, scheduled: 4 },
  { date: "2026-04-23", completed: 1, scheduled: 2 },
  { date: "2026-04-24", completed: 1, scheduled: 4 },
  { date: "2026-04-25", completed: 2, scheduled: 3 },
  { date: "2026-04-26", completed: 2, scheduled: 2 },
  { date: "2026-04-27", completed: 5, scheduled: 6 },
  { date: "2026-04-28", completed: 3, scheduled: 5 },
  { date: "2026-04-29", completed: 1, scheduled: 6 },
  { date: "2026-04-30", completed: 0, scheduled: 2 },
  { date: "2026-05-01", completed: 3, scheduled: 4 },
  { date: "2026-05-02", completed: 2, scheduled: 3 },
  { date: "2026-05-03", completed: 3, scheduled: 5 },
  { date: "2026-05-04", completed: 1, scheduled: 5 },
  { date: "2026-05-05", completed: 2, scheduled: 3 },
  { date: "2026-05-06", completed: 4, scheduled: 5 },
  { date: "2026-05-07", completed: 1, scheduled: 3 },
  { date: "2026-05-08", completed: 0, scheduled: 2 },
  { date: "2026-05-09", completed: 1, scheduled: 3 },
  { date: "2026-05-10", completed: 4, scheduled: 5 },
  { date: "2026-05-11", completed: 4, scheduled: 5 },
  { date: "2026-05-12", completed: 2, scheduled: 6 },
  { date: "2026-05-13", completed: 2, scheduled: 2 },
  { date: "2026-05-14", completed: 6, scheduled: 6 },
  { date: "2026-05-15", completed: 0, scheduled: 4 },
  { date: "2026-05-16", completed: 3, scheduled: 3 },
  { date: "2026-05-17", completed: 0, scheduled: 0 },
  { date: "2026-05-18", completed: 4, scheduled: 4 },
  { date: "2026-05-19", completed: 0, scheduled: 6 },
  { date: "2026-05-20", completed: 4, scheduled: 4 },
  { date: "2026-05-21", completed: 2, scheduled: 3 },
  { date: "2026-05-22", completed: 6, scheduled: 6 },
  { date: "2026-05-23", completed: 2, scheduled: 2 },
  { date: "2026-05-24", completed: 0, scheduled: 2 },
  { date: "2026-05-25", completed: 1, scheduled: 4 },
  { date: "2026-05-26", completed: 0, scheduled: 0 },
  { date: "2026-05-27", completed: 0, scheduled: 2 },
  { date: "2026-05-28", completed: 2, scheduled: 2 },
  { date: "2026-05-29", completed: 3, scheduled: 3 },
  { date: "2026-05-30", completed: 2, scheduled: 3 },
  { date: "2026-05-31", completed: 3, scheduled: 6 },
  { date: "2026-06-01", completed: 6, scheduled: 6 },
  { date: "2026-06-02", completed: 2, scheduled: 3 },
  { date: "2026-06-03", completed: 3, scheduled: 4 },
  { date: "2026-06-04", completed: 0, scheduled: 5 },
  { date: "2026-06-05", completed: 1, scheduled: 2 },
  { date: "2026-06-06", completed: 0, scheduled: 0 },
  { date: "2026-06-07", completed: 1, scheduled: 6 },
  { date: "2026-06-08", completed: 0, scheduled: 0 },
  { date: "2026-06-09", completed: 0, scheduled: 2 },
  { date: "2026-06-10", completed: 1, scheduled: 2 },
  { date: "2026-06-11", completed: 2, scheduled: 3 },
  { date: "2026-06-12", completed: 1, scheduled: 3 },
  { date: "2026-06-13", completed: 4, scheduled: 6 },
  { date: "2026-06-14", completed: 3, scheduled: 5 },
  { date: "2026-06-15", completed: 2, scheduled: 2 },
  { date: "2026-06-16", completed: 3, scheduled: 5 },
  { date: "2026-06-17", completed: 2, scheduled: 2 },
  { date: "2026-06-18", completed: 0, scheduled: 2 },
  { date: "2026-06-19", completed: 0, scheduled: 4 },
  { date: "2026-06-20", completed: 3, scheduled: 3 },
  { date: "2026-06-21", completed: 2, scheduled: 3 },
  { date: "2026-06-22", completed: 1, scheduled: 2 },
  { date: "2026-06-23", completed: 0, scheduled: 6 },
  { date: "2026-06-24", completed: 0, scheduled: 0 },
  { date: "2026-06-25", completed: 0, scheduled: 2 },
  { date: "2026-06-26", completed: 1, scheduled: 3 },
  { date: "2026-06-27", completed: 1, scheduled: 5 },
  { date: "2026-06-28", completed: 0, scheduled: 2 },
  { date: "2026-06-29", completed: 2, scheduled: 5 },
  { date: "2026-06-30", completed: 2, scheduled: 5 },
  { date: "2026-07-01", completed: 5, scheduled: 6 },
  { date: "2026-07-02", completed: 1, scheduled: 3 },
  { date: "2026-07-03", completed: 2, scheduled: 2 },
  { date: "2026-07-04", completed: 2, scheduled: 2 },
  { date: "2026-07-05", completed: 2, scheduled: 2 },
  { date: "2026-07-06", completed: 1, scheduled: 6 },
  { date: "2026-07-07", completed: 0, scheduled: 0 },
  { date: "2026-07-08", completed: 0, scheduled: 3 },
  { date: "2026-07-09", completed: 3, scheduled: 3 },
  { date: "2026-07-10", completed: 1, scheduled: 6 },
  { date: "2026-07-11", completed: 2, scheduled: 2 },
  { date: "2026-07-12", completed: 4, scheduled: 6 },
  { date: "2026-07-13", completed: 1, scheduled: 4 },
];

// ─── Model: Average of daily percentages ──────────────────────────────────────
// Rule: daily% = completed/scheduled if scheduled>0, else excluded.
// Period avg = sum(daily%) / count(valid days).

function dailyPct(d: typeof DEMO_DATA[number]): number | null {
  if (d.scheduled === 0) return null;
  return d.completed / d.scheduled;
}

function avgRate(dates: typeof DEMO_DATA): number | null {
  const rates = dates.map(dailyPct).filter((r): r is number => r !== null);
  if (rates.length === 0) return null;
  return rates.reduce((a, b) => a + b, 0) / rates.length;
}

// ─── Today = 2026-07-13 (last day in the data) ─────────────────────────────────

// --- WEEKLY: This week is Jul 12–Jul 18 (Sun–Sat). Today is Jul 13 (Mon). ---
// Only days ≤ today count: Jul 12 (Sun) and Jul 13 (Mon).
// Jul 12: 4/6 = 66.7%. Jul 13: 1/4 = 25%.
// Future days (Jul 14–18): excluded.
const weekData = DEMO_DATA.filter((d) => {
  const [, m, day] = d.date.split("-").map(Number);
  return m === 7 && day >= 12 && day <= 13;
});
const weekRate = avgRate(weekData);
console.log("=== WEEKLY ===");
console.log(`Days: ${weekData.map((d) => d.date).join(", ")}`);
weekData.forEach((d) => {
  const p = dailyPct(d);
  console.log(`  ${d.date}: ${d.completed}/${d.scheduled} = ${p !== null ? (p * 100).toFixed(1) + "%" : "excluded"}`);
});
console.log(`Week avg = sum(daily%) / ${weekData.filter((d) => d.scheduled > 0).length} = ${weekRate !== null ? (weekRate * 100).toFixed(1) + "%" : "no data"}`);
console.log();

// --- MONTHLY: July 1–13 ---
const julyData = DEMO_DATA.filter((d) => d.date.startsWith("2026-07"));
const julyRate = avgRate(julyData);
console.log("=== MONTHLY (July) ===");
let julyValidCount = 0;
let julySum = 0;
julyData.forEach((d) => {
  const p = dailyPct(d);
  if (p !== null) { julyValidCount++; julySum += p; }
});
console.log(`Valid days: ${julyValidCount}`);
console.log(`Sum of daily%: ${(julySum * 100).toFixed(1)}%`);
console.log(`July avg = ${(julySum * 100).toFixed(1)} / ${julyValidCount} = ${julyRate !== null ? (julyRate * 100).toFixed(1) + "%" : "no data"}`);
console.log();

// --- YEARLY: All data (Apr 5 – Jul 13, 2026) ---
const yearlyRate = avgRate(DEMO_DATA);
console.log("=== YEARLY ===");
const validDays = DEMO_DATA.filter((d) => d.scheduled > 0);
const excludedDays = DEMO_DATA.filter((d) => d.scheduled === 0);
let yearlySum = 0;
validDays.forEach((d) => { yearlySum += d.completed / d.scheduled; });
console.log(`Total days in data: ${DEMO_DATA.length}`);
console.log(`Excluded (scheduled=0): ${excludedDays.length} days`);
excludedDays.forEach((d) => console.log(`  ${d.date}`));
console.log(`Valid days: ${validDays.length}`);
console.log(`Sum of daily%: ${(yearlySum * 100).toFixed(1)}%`);
console.log(`Yearly avg = ${(yearlySum * 100).toFixed(1)} / ${validDays.length} = ${yearlyRate !== null ? (yearlyRate * 100).toFixed(1) + "%" : "no data"}`);
console.log();

// --- Per-month breakdown ---
console.log("=== PER-MONTH BREAKDOWN ===");
const months = ["Apr", "May", "Jun", "Jul"];
months.forEach((m) => {
  const prefix = m === "Apr" ? "2026-04" : m === "May" ? "2026-05" : m === "Jun" ? "2026-06" : "2026-07";
  const mData = DEMO_DATA.filter((d) => d.date.startsWith(prefix));
  const rate = avgRate(mData);
  const valid = mData.filter((d) => d.scheduled > 0);
  const sum = valid.reduce((s, d) => s + d.completed / d.scheduled, 0);
  console.log(`  ${m}: ${(sum * 100).toFixed(1)}% / ${valid.length} days = ${rate !== null ? (rate * 100).toFixed(1) + "%" : "—"}`);
});
