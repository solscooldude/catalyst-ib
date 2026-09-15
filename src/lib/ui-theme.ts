import { useSyncExternalStore } from "react";

export type UiTheme = "light" | "dark";

export const UI_THEME_KEY = "catalyst-v1:ui-theme";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function normalizeUiTheme(raw?: string | null): UiTheme {
  return raw === "dark" ? "dark" : "light";
}

export function readStoredUiTheme(): UiTheme {
  if (typeof window === "undefined") return "light";
  try {
    return normalizeUiTheme(window.localStorage.getItem(UI_THEME_KEY));
  } catch {
    return "light";
  }
}

export function applyUiTheme(theme: UiTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
  try {
    window.localStorage.setItem(UI_THEME_KEY, theme);
  } catch {
    /* ignore quota */
  }
  emit();
}

export function setUiTheme(theme: UiTheme) {
  applyUiTheme(theme);
}

export function subscribeUiTheme(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useUiTheme() {
  return useSyncExternalStore(
    subscribeUiTheme,
    readStoredUiTheme,
    () => "light" as const,
  );
}
