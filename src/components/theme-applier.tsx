"use client";

import { useEffect } from "react";
import { getSparkTint } from "@/lib/appearance";
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
    root.dataset.accent = appearance.accent;
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
