"use client";

import "@/app/focus-stage.css";
import type { FocusThemeId } from "@/lib/appearance";
import { STAGE_THEMES, isStageFocusTheme } from "@/lib/focus-stages";
import { TaskOption } from "@/components/task-option";
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
          <TaskOption
            key={item.id}
            title={item.name}
            detail={`${item.blurb} · ${item.cost === 0 ? "Free" : `${item.cost} tokens`}${has ? " · owned" : ""}`}
            selected={on}
            onSelect={() => onPick(item.id, has)}
          />
        );
      })}
    </div>
  );
}
