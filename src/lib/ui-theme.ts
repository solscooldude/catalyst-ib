import { useSyncExternalStore } from "react";

export type UiTheme = "light" | "dark";

export const UI_THEME_KEY = "catalyst-v1:ui-theme";

const listeners = new Set<() => void>();
let cached: UiTheme | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

export function normalizeUiTheme(raw?: string | null): UiTheme {
  return raw === "light" ? "light" : "dark";
}

export function readStoredUiTheme(): UiTheme {
  if (typeof window === "undefined") return "dark";
  if (cached !== null) return cached;
  try {
    cached = normalizeUiTheme(window.localStorage.getItem(UI_THEME_KEY));
  } catch {
    cached = "dark";
  }
  return cached;
}

export function applyUiTheme(theme: UiTheme, persist = true) {
  if (typeof document === "undefined") return;
  cached = theme;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
  if (persist) {
    try {
      window.localStorage.setItem(UI_THEME_KEY, theme);
    } catch {
      /* ignore quota */
    }
  }
  emit();
}

export function setUiTheme(theme: UiTheme) {
  applyUiTheme(theme, true);
}

export function restoreStoredUiTheme() {
  cached = null;
  applyUiTheme(readStoredUiTheme(), false);
}

export function subscribeUiTheme(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useUiTheme() {
  return useSyncExternalStore(
    subscribeUiTheme,
    readStoredUiTheme,
    () => "dark" as const,
  );
}
