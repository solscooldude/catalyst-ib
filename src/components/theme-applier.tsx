"use client";

import { useEffect } from "react";
import {
  getAccentShade,
  getBackgroundShade,
  getSparkTint,
} from "@/lib/appearance";
import { applyUiTheme, readStoredUiTheme, useUiTheme } from "@/lib/ui-theme";
import { useCatalyst } from "@/lib/store";

const ROOM_VARS = [
  "--background",
  "--card",
  "--popover",
  "--secondary",
  "--muted",
  "--sidebar",
] as const;

function clearRoomVars(root: HTMLElement) {
  for (const key of ROOM_VARS) root.style.removeProperty(key);
}

export function ThemeApplier() {
  const { appearance, hydrated } = useCatalyst();
  const uiTheme = useUiTheme();

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
      delete root.dataset.bgShade;
      clearRoomVars(root);
    } else {
      root.dataset.bg = appearance.background;
      const wash = getBackgroundShade(
        appearance.background,
        appearance.backgroundShade,
      );
      if (wash) {
        root.dataset.bgShade = appearance.backgroundShade;
        const paper = uiTheme === "dark" ? wash.dark : wash.light;
        root.style.setProperty("--background", paper.bg);
        root.style.setProperty("--card", paper.card);
        root.style.setProperty("--popover", paper.card);
        root.style.setProperty("--secondary", paper.mute);
        root.style.setProperty("--muted", paper.mute);
        root.style.setProperty("--sidebar", paper.card);
      } else {
        delete root.dataset.bgShade;
        clearRoomVars(root);
      }
    }
    const tint = getSparkTint(appearance.sparkTint);
    root.style.setProperty("--spark-hi", tint.hi);
    root.style.setProperty("--spark-mid", tint.mid);
    root.style.setProperty("--spark-lo", tint.lo);
  }, [hydrated, appearance, uiTheme]);

  return null;
}
