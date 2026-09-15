"use client";

import "@/app/focus-stage.css";
import type { FocusThemeId } from "@/lib/appearance";
import { SHOP_FOCUS_SCENES } from "@/lib/appearance";
import { isStageFocusTheme } from "@/lib/focus-stages";
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
  const id =
    (raw as string) === "waves"
      ? "sea"
      : (raw as string) === "aurora"
        ? "nightsky"
        : raw;

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

/** Two identical periods so a -50% translate loops as a continuous roll. */
const SEA_BODY =
  "M0 128C120 36 180 220 300 128C420 36 480 220 600 128C720 36 780 220 900 128C1020 36 1080 220 1200 128C1320 36 1380 220 1500 128C1620 36 1680 220 1800 128C1920 36 1980 220 2100 128C2220 36 2280 220 2400 128V220H0Z";
const SEA_CREST =
  "M0 128C120 36 180 220 300 128C420 36 480 220 600 128C720 36 780 220 900 128C1020 36 1080 220 1200 128C1320 36 1380 220 1500 128C1620 36 1680 220 1800 128C1920 36 1980 220 2100 128C2220 36 2280 220 2400 128";

const SEA_FLECKS = [
  { left: "8%", bottom: "18%", delay: "0s", size: 11 },
  { left: "22%", bottom: "12%", delay: "-1.4s", size: 7 },
  { left: "36%", bottom: "22%", delay: "-2.6s", size: 13 },
  { left: "51%", bottom: "9%", delay: "-0.8s", size: 8 },
  { left: "64%", bottom: "16%", delay: "-3.2s", size: 10 },
  { left: "78%", bottom: "11%", delay: "-1.9s", size: 6 },
  { left: "88%", bottom: "20%", delay: "-4.1s", size: 12 },
];

function Sea() {
  return (
    <>
      <div className="focus-sea-horizon" />
      <div className="focus-sea-glint" />
      <div className="focus-sea-caustic" />
      <SeaBand className="focus-sea-far" fill="rgb(8 42 86 / 0.82)" />
      <SeaBand className="focus-sea-mid" fill="rgb(10 64 112 / 0.78)" />
      <SeaBand className="focus-sea-near" fill="rgb(14 92 148 / 0.8)" foam />
      <SeaBand className="focus-sea-break" fill="rgb(7 48 86 / 0.92)" foam />
      <SeaBand className="focus-sea-lip" fill="rgb(186 230 253 / 0.22)" foam />
      {SEA_FLECKS.map((fleck, index) => (
        <span
          key={index}
          className="focus-sea-fleck"
          style={{
            left: fleck.left,
            bottom: fleck.bottom,
            width: fleck.size,
            height: Math.max(3, fleck.size * 0.38),
            animationDelay: fleck.delay,
          }}
        />
      ))}
    </>
  );
}

function SeaBand({
  className,
  fill,
  foam = false,
}: {
  className: string;
  fill: string;
  foam?: boolean;
}) {
  return (
    <div className={cn("focus-sea-swell", className)}>
      <svg
        className="focus-sea-roll"
        viewBox="0 0 2400 220"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d={SEA_BODY} fill={fill} />
        {foam ? (
          <path
            d={SEA_CREST}
            fill="none"
            stroke="rgb(241 250 255 / 0.7)"
            strokeWidth="9"
            strokeLinecap="round"
          />
        ) : null}
      </svg>
    </div>
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
      {SHOP_FOCUS_SCENES.map((item) => {
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
