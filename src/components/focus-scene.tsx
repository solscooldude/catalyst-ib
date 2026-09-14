"use client";

import type { FocusThemeId } from "@/lib/appearance";
import { rocketProgress, rocketStageLabel } from "@/lib/focus-scene";
import { useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";

const STARS = Array.from({ length: 36 }, (_, index) => {
  const seed = ((index + 3) * 1664525 + 1013904223) >>> 0;
  return {
    x: (seed % 1000) / 10,
    y: ((seed >>> 10) % 1000) / 10,
    size: 1 + (seed % 2),
    delay: ((seed >>> 5) % 70) / 10,
  };
});

export function FocusScene({
  elapsedMs,
  demoMode,
  theme,
  caption = false,
  className,
}: {
  elapsedMs: number;
  demoMode: boolean;
  theme?: FocusThemeId;
  caption?: boolean;
  className?: string;
}) {
  const equipped = useCatalyst().appearance.focusTheme;
  const id = theme ?? equipped;
  if (id === "none") return null;

  const { t, stage } = rocketProgress(elapsedMs, demoMode);

  return (
    <div
      className={cn("focus-scene", className)}
      style={{ ["--focus-t" as string]: String(t) }}
      data-stage={stage}
      aria-hidden={!caption}
    >
      <div className="focus-void" />
      <div className="focus-stars">
        {STARS.map((star, index) => (
          <span
            key={index}
            className="focus-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
      <div className="focus-nebula" />
      <div className="focus-atmosphere" />
      <div className="focus-ground" />
      <div className="focus-plume" />
      {caption ? <p className="focus-caption">{rocketStageLabel(stage)}</p> : null}
    </div>
  );
}
