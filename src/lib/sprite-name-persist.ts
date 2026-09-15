export const SPRITE_NAME_KEY = "catalyst-v1:sprite-name";
const DEFAULT_NAME = "Spark";
const NAME_MAX = 16;

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
  const fromStore = cleanName(stored);
  const fromDevice = device ? cleanName(device) : DEFAULT_NAME;
  if (fromStore !== DEFAULT_NAME) return fromStore;
  if (fromDevice !== DEFAULT_NAME) return fromDevice;
  return DEFAULT_NAME;
}
