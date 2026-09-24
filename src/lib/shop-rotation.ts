import { isStreakUnlockItem } from "@/lib/appearance";
import { dayKey } from "@/lib/care";

/** For-sale cap per sprite shop section — not a shop-wide SKU cap. */
export const SHOP_ROTATION_PER_SECTION = 4;

export function shopDayKey(now = new Date()) {
  return dayKey(now);
}

function hashSeed(input: string) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let n = Math.imul(t ^ (t >>> 15), 1 | t);
    n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], seed: string) {
  const next = [...items];
  const rng = mulberry32(hashSeed(seed));
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const swap = next[i];
    next[i] = next[j]!;
    next[j] = swap!;
  }
  return next;
}

export function rotateShopSection<
  T extends { id: string; cost: number; unlock?: string },
>(
  items: readonly T[],
  section: string,
  ownedIds: readonly string[],
  now = new Date(),
  limit = SHOP_ROTATION_PER_SECTION,
): T[] {
  const owned = new Set(ownedIds);
  const keep = new Set<string>();
  const rotating: T[] = [];

  for (const item of items) {
    if (isStreakUnlockItem(item)) continue;
    if (item.cost === 0 || owned.has(item.id)) {
      keep.add(item.id);
      continue;
    }
    rotating.push(item);
  }

  const day = shopDayKey(now);
  for (const item of shuffle(rotating, `${day}:${section}`).slice(0, limit)) {
    keep.add(item.id);
  }

  return items.filter((item) => keep.has(item.id));
}

export function shopRefreshCue(limit = SHOP_ROTATION_PER_SECTION) {
  return `${limit} for sale today · refreshes tomorrow`;
}
