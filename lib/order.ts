export function orderFromPositions(
  positions: Record<string, number>
): string[] {
  return Object.entries(positions)
    .sort((a, b) => a[1] - b[1])
    .map(([id]) => id);
}

export function mergeOrder(primary: string[], previous: string[]): string[] {
  const next = [...new Set(primary)];
  const seen = new Set(next);
  for (const id of previous) {
    if (!seen.has(id)) {
      next.push(id);
      seen.add(id);
    }
  }
  return next;
}
