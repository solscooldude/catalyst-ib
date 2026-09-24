"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getAccentShade, getBackgroundShade } from "@/lib/appearance";
import { ROUTES } from "@/lib/routes";
import { applyUiTheme, restoreStoredUiTheme, useUiTheme } from "@/lib/ui-theme";
import { spriteBodyPalette } from "@/lib/sprite-species";
import { signatureGlowForStage } from "@/lib/stats";
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
  const pathname = usePathname();
  const { appearance, hydrated, spriteSpecies, careStage, extraMagical } = useCatalyst();
  const uiTheme = useUiTheme();
  const introLock = pathname === ROUTES.intro;

  useEffect(() => {
    if (introLock) {
      applyUiTheme("dark", false);
      return;
    }
    restoreStoredUiTheme();
  }, [introLock]);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    const shade = getAccentShade(appearance.accent, appearance.accentShade);
    const deep = getAccentShade(appearance.accent, "deep");
    root.dataset.accent = appearance.accent;
    root.dataset.accentShade = appearance.accentShade;
    root.style.setProperty("--primary", shade.hex);
    root.style.setProperty("--ring", shade.hex);
    root.style.setProperty("--chart-1", shade.hex);
    root.style.setProperty("--sidebar-primary", shade.hex);
    root.style.setProperty("--sidebar-ring", shade.hex);
    root.style.setProperty("--primary-foreground", shade.fg);
    root.style.setProperty("--sidebar-primary-foreground", shade.fg);
    root.style.setProperty("--accent-deep", deep.hex);
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
    const body = spriteBodyPalette(spriteSpecies, appearance.sparkTint);
    const glow = signatureGlowForStage(careStage) ? body.glow : body.fur;
    root.style.setProperty("--spark-hi", body.belly);
    root.style.setProperty("--spark-mid", body.fur);
    root.style.setProperty("--spark-lo", body.furDeep);
    root.style.setProperty("--spark-glow", glow);
    root.style.setProperty("--spark-glow-deep", body.glowDeep);
    root.dataset.extraMagical = extraMagical && careStage === "ethereal" ? "on" : "off";
  }, [hydrated, appearance, uiTheme, spriteSpecies, careStage, extraMagical]);

  return null;
}
