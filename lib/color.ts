function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean,
    16
  );
  return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
}

function toHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v)));
  return `#${((1 << 24) | (clamp(r) << 16) | (clamp(g) << 8) | clamp(b))
    .toString(16)
    .slice(1)}`;
}

export function mixHex(a: string, b: string, weight: number): string {
  const w = Math.min(1, Math.max(0, weight));
  const [ar, ag, ab] = parseHex(a);
  const [br, bg, bb] = parseHex(b);
  return toHex(
    ar + (br - ar) * w,
    ag + (bg - ag) * w,
    ab + (bb - ab) * w
  );
}
