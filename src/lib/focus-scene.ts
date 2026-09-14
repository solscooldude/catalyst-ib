import { DEMO_TOKEN_MS, REAL_TOKEN_MS } from "@/lib/constants";
import type { FocusThemeId } from "@/lib/appearance";

export type RocketStage = "liftoff" | "climb" | "space";
export type DayPhase = "afternoon" | "sunset" | "night";
export type RoomThemeId = "cat" | "desk" | "library";

export const ROOM_THEMES: readonly RoomThemeId[] = ["cat", "desk", "library"];

export const ROOM_PLATES: Record<
  RoomThemeId,
  Record<DayPhase, string>
> = {
  cat: {
    afternoon: "/api/plates/cat-afternoon.jpg",
    sunset: "/api/plates/cat-sunset.jpg",
    night: "/api/plates/cat-night.jpg",
  },
  desk: {
    afternoon: "/api/plates/desk-afternoon.jpg",
    sunset: "/api/plates/desk-sunset.jpg",
    night: "/api/plates/desk-night.jpg",
  },
  library: {
    afternoon: "/api/plates/lib-afternoon.jpg",
    sunset: "/api/plates/lib-sunset.jpg",
    night: "/api/plates/lib-night.jpg",
  },
};

export function isRoomFocusTheme(id: FocusThemeId | string): id is RoomThemeId {
  return id === "cat" || id === "desk" || id === "library";
}

export function studyEquivalentMs(elapsedMs: number, demoMode: boolean) {
  const scale = demoMode ? REAL_TOKEN_MS / DEMO_TOKEN_MS : 1;
  return Math.max(0, elapsedMs) * scale;
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export function dayCycle(
  elapsedMs: number,
  demoMode: boolean,
  plannedMs: number | null,
) {
  const span =
    plannedMs && plannedMs > 4000
      ? plannedMs
      : demoMode
        ? 90_000
        : 45 * 60_000;
  const t = clamp(elapsedMs / span);
  const afternoon = 1 - smoothstep(0.3, 0.48, t);
  const night = smoothstep(0.58, 0.76, t);
  const sunset = clamp(1 - afternoon - night);
  return {
    t,
    afternoon,
    sunset,
    night,
    lamp: smoothstep(0.62, 0.82, t),
    stars: night,
    phase: (night > 0.55
      ? "night"
      : sunset > 0.4
        ? "sunset"
        : "afternoon") as DayPhase,
  };
}

export function rocketProgress(elapsedMs: number, demoMode: boolean) {
  const minutes = studyEquivalentMs(elapsedMs, demoMode) / 60_000;
  if (minutes <= 20) {
    return { t: (minutes / 20) * 0.33, stage: "liftoff" as const };
  }
  if (minutes <= 60) {
    return { t: 0.33 + ((minutes - 20) / 40) * 0.33, stage: "climb" as const };
  }
  if (minutes <= 120) {
    return { t: 0.66 + ((minutes - 60) / 60) * 0.34, stage: "space" as const };
  }
  return { t: 1, stage: "space" as const };
}

export function rocketStageLabel(stage: RocketStage) {
  if (stage === "liftoff") return "Liftoff";
  if (stage === "climb") return "Climbing";
  return "Outer space";
}
