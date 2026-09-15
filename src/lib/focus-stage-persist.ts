import type { FocusThemeId } from "@/lib/appearance";
import { isStageFocusTheme } from "@/lib/focus-stages";

export const FOCUS_STAGE_KEY = "catalyst-v1:focus-stage";

export function readDeviceFocusStage(): FocusThemeId | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(FOCUS_STAGE_KEY);
    if (raw === "waves") return "sea";
    if (raw === "aurora") return "nightsky";
    if (raw && isStageFocusTheme(raw)) return raw;
  } catch {
    /* private mode */
  }
  return null;
}

export function writeDeviceFocusStage(id: FocusThemeId) {
  if (typeof window === "undefined") return;
  if (!isStageFocusTheme(id)) return;
  try {
    window.localStorage.setItem(FOCUS_STAGE_KEY, id);
  } catch {
    /* quota */
  }
}
