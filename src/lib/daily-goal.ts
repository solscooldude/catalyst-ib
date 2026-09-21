export const MIN_DAILY_GOAL_MINUTES = 60;
export const MAX_DAILY_GOAL_MINUTES = 8 * 60;
export const DEFAULT_DAILY_GOAL_MINUTES = 60;
export const DAILY_GOAL_STEP_MINUTES = 30;
export const DAILY_GOAL_REWARD = 8;

export function clampDailyGoalMinutes(raw: unknown) {
  const n = Math.round(Number(raw));
  if (!Number.isFinite(n)) return DEFAULT_DAILY_GOAL_MINUTES;
  return Math.min(
    MAX_DAILY_GOAL_MINUTES,
    Math.max(MIN_DAILY_GOAL_MINUTES, n),
  );
}

export function formatDailyGoal(minutes: number) {
  const m = clampDailyGoalMinutes(minutes);
  const hours = m / 60;
  if (hours === 1) return "1 hour";
  if (Number.isInteger(hours)) return `${hours} hours`;
  return `${hours} hours`;
}
