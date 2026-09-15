"use client";

import { useEffect } from "react";
import { getAccentShade, getSparkTint } from "@/lib/appearance";
import { applyUiTheme, readStoredUiTheme } from "@/lib/ui-theme";
import { useCatalyst } from "@/lib/store";

export function ThemeApplier() {
  const { appearance, hydrated } = useCatalyst();

  useEffect(() => {
    applyUiTheme(readStoredUiTheme(), false);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    const shade = getAccentShade(appearance.accent, appearance.accentShade);
    root.dataset.accent = appearance.accent;
    root.dataset.accentShade = appearance.accentShade;
    root.style.setProperty("--primary", shade.hex);
    root.style.setProperty("--ring", shade.hex);
    root.style.setProperty("--chart-1", shade.hex);
    root.style.setProperty("--sidebar-primary", shade.hex);
    root.style.setProperty("--sidebar-ring", shade.hex);
    root.style.setProperty("--primary-foreground", shade.fg);
    root.style.setProperty("--sidebar-primary-foreground", shade.fg);
    if (appearance.background === "void") {
      delete root.dataset.bg;
    } else {
      root.dataset.bg = appearance.background;
    }
    const tint = getSparkTint(appearance.sparkTint);
    root.style.setProperty("--spark-hi", tint.hi);
    root.style.setProperty("--spark-mid", tint.mid);
    root.style.setProperty("--spark-lo", tint.lo);
  }, [hydrated, appearance]);

  return null;
}
