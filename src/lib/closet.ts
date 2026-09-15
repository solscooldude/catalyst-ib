import {
  defaultAppearance,
  normalizeAppearance,
  type AppearanceState,
} from "@/lib/appearance";
import { AUTH_SESSION_KEY, STORAGE_KEY } from "@/lib/constants";

export function closetKey(userId: string) {
  return `${STORAGE_KEY}:closet:${userId}`;
}

export function sessionAccountId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(AUTH_SESSION_KEY);
  } catch {
    return null;
  }
}

export function writeCloset(userId: string, appearance: AppearanceState) {
  if (typeof window === "undefined" || !userId) return;
  try {
    window.localStorage.setItem(closetKey(userId), JSON.stringify(appearance));
  } catch {
    /* quota */
  }
}

export function clearCloset(userId: string | null) {
  if (typeof window === "undefined" || !userId) return;
  try {
    window.localStorage.removeItem(closetKey(userId));
  } catch {
    /* private mode */
  }
}

export function readCloset(userId: string): AppearanceState | null {
  if (typeof window === "undefined" || !userId) return null;
  try {
    const raw = window.localStorage.getItem(closetKey(userId));
    if (!raw) return null;
    return normalizeAppearance(JSON.parse(raw) as Partial<AppearanceState>);
  } catch {
    return null;
  }
}

function unionOwned<T extends string>(
  ...lists: Array<readonly T[] | undefined>
): T[] {
  return [...new Set(lists.flatMap((list) => list ?? []))];
}

export type AppearanceLegacy = Partial<AppearanceState> & {
  ownedAccents?: AppearanceState["ownedAccents"];
  ownedBackgrounds?: AppearanceState["ownedBackgrounds"];
  ownedSparkTints?: AppearanceState["ownedSparkTints"];
  ownedGear?: AppearanceState["ownedGear"];
  ownedTrails?: AppearanceState["ownedTrails"];
  ownedFocusThemes?: AppearanceState["ownedFocusThemes"];
};

export function mergeAppearance(
  parsed: Partial<AppearanceState> | null | undefined,
  userId: string | null,
  legacy?: AppearanceLegacy | null,
): AppearanceState {
  const closet = userId ? readCloset(userId) : null;
  return normalizeAppearance({
    ...defaultAppearance,
    ...closet,
    ...legacy,
    ...parsed,
    ownedAccents: unionOwned(
      closet?.ownedAccents,
      legacy?.ownedAccents,
      parsed?.ownedAccents,
    ),
    ownedBackgrounds: unionOwned(
      closet?.ownedBackgrounds,
      legacy?.ownedBackgrounds,
      parsed?.ownedBackgrounds,
    ),
    ownedSparkTints: unionOwned(
      closet?.ownedSparkTints,
      legacy?.ownedSparkTints,
      parsed?.ownedSparkTints,
    ),
    ownedGear: unionOwned(
      closet?.ownedGear,
      legacy?.ownedGear,
      parsed?.ownedGear,
    ),
    ownedTrails: unionOwned(
      closet?.ownedTrails,
      legacy?.ownedTrails,
      parsed?.ownedTrails,
    ),
    ownedFocusThemes: unionOwned(
      closet?.ownedFocusThemes,
      legacy?.ownedFocusThemes,
      parsed?.ownedFocusThemes,
    ),
  });
}
