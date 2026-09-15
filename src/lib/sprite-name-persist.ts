export const SPRITE_NAME_KEY = "catalyst-v1:sprite-name";
const DEFAULT_NAME = "Sprite";
const NAME_MAX = 16;

function isUnsetName(name: string) {
  return !name || /^(spark|sprite|flux)$/i.test(name);
}

function cleanName(raw?: string | null) {
  const trimmed = (raw ?? "").replace(/\s+/g, " ").trim().slice(0, NAME_MAX);
  if (!trimmed || /^flux$/i.test(trimmed)) return DEFAULT_NAME;
  return trimmed;
}

export function readDeviceSpriteName() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SPRITE_NAME_KEY);
    return raw ? cleanName(raw) : null;
  } catch {
    return null;
  }
}

export function writeDeviceSpriteName(raw?: string | null) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SPRITE_NAME_KEY, cleanName(raw));
  } catch {
    /* quota */
  }
}

export function pickPersistedSpriteName(
  stored?: string | null,
  device?: string | null,
) {
  const fromStore = stored ? cleanName(stored) : "";
  const fromDevice = device ? cleanName(device) : "";
  if (fromStore && !isUnsetName(fromStore)) return fromStore;
  if (fromDevice && !isUnsetName(fromDevice)) return fromDevice;
  return DEFAULT_NAME;
}
