import { DEMO_TOKEN_MS, REAL_TOKEN_MS } from "@/lib/constants";

export type RocketStage = "liftoff" | "climb" | "space";

export function studyEquivalentMs(elapsedMs: number, demoMode: boolean) {
  const scale = demoMode ? REAL_TOKEN_MS / DEMO_TOKEN_MS : 1;
  return Math.max(0, elapsedMs) * scale;
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
