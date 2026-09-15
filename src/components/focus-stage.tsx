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

const SYMBOLS = ["x²", "Σ", "π", "√", "∫", "Δ", "θ", "∞", "f(x)", "n!", "∑", "λ"];

export function FocusStage({
  theme,
  className,
}: {
  theme?: FocusThemeId;
  className?: string;
}) {
  const equipped = useCatalyst().appearance.focusTheme;
  const raw = theme ?? equipped;
  const id = (raw as string) === "waves" ? "sea" : raw;

  if (id === "none" || !isStageFocusTheme(id)) {
    return (
      <div
        className={cn("focus-stage focus-stage-spotlight", className)}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn(
        "focus-stage",
        `focus-stage-${id === "nightsky" ? "night" : id}`,
        className,
      )}
      aria-hidden
    >
      {id === "nightsky" ? <NightSky /> : null}
      {id === "sea" ? <Sea /> : null}
      {id === "aurora" ? <Aurora /> : null}
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
      <span
        className="focus-stage-shoot"
        style={{ top: "58%", left: "42%", animationDelay: "5.5s" }}
      />
    </>
  );
}

function Aurora() {
  return (
    <>
      <div className="focus-stage-ribbon focus-stage-ribbon-a" />
      <div className="focus-stage-ribbon focus-stage-ribbon-b" />
      <div className="focus-stage-ribbon focus-stage-ribbon-c" />
      <div className="focus-stage-ribbon focus-stage-ribbon-d" />
      <div className="focus-stage-ribbon focus-stage-ribbon-e" />
    </>
  );
}

function Sea() {
  return (
    <>
      <div className="focus-stage-swell" />
      <div className="focus-stage-caustic" />
      <div className="focus-stage-wave" style={{ bottom: "18%" }} />
      <div className="focus-stage-wave focus-stage-wave-b" style={{ bottom: "4%" }} />
      <div className="focus-stage-wave focus-stage-wave-c" style={{ bottom: "-10%" }} />
      <div className="focus-stage-wave focus-stage-wave-d" style={{ bottom: "28%" }} />
      <SeaWave className="focus-stage-wave-svg" bottom="12%" fill="rgb(12 74 128 / 0.55)" />
      <SeaWave
        className="focus-stage-wave-svg focus-stage-wave-svg-b"
        bottom="-2%"
        fill="rgb(8 47 92 / 0.7)"
      />
      <SeaWave
        className="focus-stage-wave-svg focus-stage-wave-svg-foam"
        bottom="22%"
        fill="rgb(186 230 253 / 0.28)"
      />
      <div className="focus-stage-foam" style={{ bottom: "26%" }} />
    </>
  );
}

function SeaWave({
  className,
  bottom,
  fill,
}: {
  className: string;
  bottom: string;
  fill: string;
}) {
  return (
    <svg
      className={className}
      style={{ bottom }}
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 92c80-28 140 28 220 8 90-22 140-48 230-18 88 28 150 8 220-16 86-28 150 22 230 6 70-14 140-36 300 12v76H0Z"
        fill={fill}
      />
    </svg>
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
  const current = (value as string) === "waves" ? "sea" : value;
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {STAGE_THEMES.map((item) => {
        const has = owned(item.id) || item.cost === 0;
        const on = current === item.id;
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