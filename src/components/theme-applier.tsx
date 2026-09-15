"use client";

import { useEffect } from "react";
import { getSparkTint } from "@/lib/appearance";
import { applyUiTheme, useUiTheme } from "@/lib/ui-theme";
import { useCatalyst } from "@/lib/store";

export function ThemeApplier() {
  const { appearance, hydrated } = useCatalyst();
  const uiTheme = useUiTheme();

  useEffect(() => {
    applyUiTheme(uiTheme);
  }, [uiTheme]);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.dataset.accent = appearance.accent;
    if (uiTheme === "dark" || appearance.background === "aurora") {
      root.dataset.bg = appearance.background;
    } else {
      delete root.dataset.bg;
    }
    const tint = getSparkTint(appearance.sparkTint);
    root.style.setProperty("--spark-hi", tint.hi);
    root.style.setProperty("--spark-mid", tint.mid);
    root.style.setProperty("--spark-lo", tint.lo);
  }, [hydrated, appearance, uiTheme]);

  return null;
}
