"use client";

import "@/app/focus-stage.css";
import type { FocusThemeId } from "@/lib/appearance";
import { STAGE_THEMES, isStageFocusTheme } from "@/lib/focus-stages";
import { useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";

const STARS = Array.from({ length: 42 }, (_, index) => {
  const seed = ((index + 11) * 1664525 + 1013904223) >>> 0;
  return {
    x: (seed % 1000) / 10,
    y: ((seed >>> 10) % 700) / 10,
    size: 1 + (seed % 2),
    delay: ((seed >>> 5) % 80) / 10,
  };
});

const SYMBOLS = ["x²", "Σ", "π", "√", "∫", "Δ", "θ", "∞", "f(x)", "n!"];

export function FocusStage({
  theme,
  className,
}: {
  theme?: FocusThemeId;
  className?: string;
}) {
  const equipped = useCatalyst().appearance.focusTheme;
  const id = theme ?? equipped;
  if (!isStageFocusTheme(id) || id === "none") return null;

  return (
    <div
      className={cn("focus-stage", `focus-stage-${id === "nightsky" ? "night" : id}`, className)}
      aria-hidden
    >
      {id === "nightsky" ? <NightSky /> : null}
      {id === "sea" ? <Sea /> : null}
      {id === "math" ? <MathDrift /> : null}
    </div>
  );
}

function NightSky() {
  return (
    <>
      {STARS.map((star, index) => (
        <span
          key={index}
          className="focus-stage-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      <span className="focus-stage-shoot" style={{ top: "22%", left: "10%" }} />
    </>
  );
}

function Sea() {
  return (
    <>
      <div className="focus-stage-wave" style={{ bottom: "8%" }} />
      <div className="focus-stage-wave focus-stage-wave-b" style={{ bottom: "-4%" }} />
      <div className="focus-stage-wave focus-stage-wave-c" style={{ bottom: "-16%" }} />
    </>
  );
}

function MathDrift() {
  return (
    <>
      {SYMBOLS.map((symbol, index) => (
        <span
          key={symbol}
          className="focus-stage-symbol"
          style={{
            left: `${8 + ((index * 17) % 84)}%`,
            top: `${12 + ((index * 23) % 70)}%`,
            fontSize: `${18 + (index % 4) * 6}px`,
            animationDelay: `${index * -1.8}s`,
          }}
        >
          {symbol}
        </span>
      ))}
    </>
  );
}

export function FocusStagePicker({
  value,
  owned,
  onPick,
}: {
  value: FocusThemeId;
  owned: (id: string) => boolean;
  onPick: (id: FocusThemeId, owned: boolean) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {STAGE_THEMES.map((item) => {
        const has = owned(item.id);
        const on = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onPick(item.id, has)}
            className={cn(
              "rounded-2xl px-3.5 py-3 text-left ring-1",
              on
                ? "bg-primary/15 text-zinc-900 ring-2 ring-primary dark:text-zinc-50"
                : "bg-white text-zinc-900 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700",
            )}
          >
            <p className="text-sm font-medium">{item.name}</p>
            <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">{item.blurb}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {item.cost === 0 ? "Free" : `${item.cost} tokens`}
              {has ? " · owned" : ""}
            </p>
          </button>
        );
      })}
    </div>
  );
}
