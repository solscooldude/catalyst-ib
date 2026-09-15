"use client";

import { Spark } from "@/components/spark";
import { cn } from "@/lib/cn";
import {
  FOCUS_THEMES,
  SHOP_FOCUS_SCENES,
  type FocusThemeId,
} from "@/lib/appearance";
import { isStageFocusTheme } from "@/lib/focus-stages";

const STAGE_THEMES = FOCUS_THEMES.filter((theme) => isStageFocusTheme(theme.id));

export function FocusStage({
  theme,
  sparkMood,
  sparkAsleep,
}: {
  theme: FocusThemeId;
  sparkMood: string;
  sparkAsleep: boolean;
}) {
  const stage = isStageFocusTheme(theme) ? theme : "none";
  const label =
    FOCUS_THEMES.find((item) => item.id === theme)?.label ?? "Quiet spotlight";

  return (
    <div
      className={cn("focus-stage", `focus-stage--${stage}`)}
      role="img"
      aria-label={`${label} behind Spark`}
    >
      <div className="focus-stage__field" aria-hidden>
        {stage === "nightsky" ? (
          <>
            <span className="focus-stage__star focus-stage__star--a" />
            <span className="focus-stage__star focus-stage__star--b" />
            <span className="focus-stage__star focus-stage__star--c" />
            <span className="focus-stage__star focus-stage__star--d" />
          </>
        ) : null}
        {stage === "sea" ? <span className="focus-stage__wave" /> : null}
        {stage === "math" ? (
          <>
            <span className="focus-stage__glyph focus-stage__glyph--a">π</span>
            <span className="focus-stage__glyph focus-stage__glyph--b">∑</span>
            <span className="focus-stage__glyph focus-stage__glyph--c">√</span>
          </>
        ) : null}
      </div>
      <div className="focus-stage__spark">
        <Spark mood={sparkMood} asleep={sparkAsleep} />
      </div>
    </div>
  );
}

export function FocusStagePicker({
  value,
  onChange,
}: {
  value: FocusThemeId;
  onChange: (id: FocusThemeId) => void;
}) {
  return (
    <div className="focus-stage-picker">
      {SHOP_FOCUS_SCENES.map((theme) => {
        const selected = value === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            className={cn("focus-stage-chip", selected && "is-selected")}
            aria-pressed={selected}
            onClick={() => onChange(theme.id)}
          >
            {theme.label}
          </button>
        );
      })}
    </div>
  );
}
