export function dayKey(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function yesterdayKey(now = new Date()) {
  const next = new Date(now);
  next.setDate(next.getDate() - 1);
  return dayKey(next);
}

export const FEED_COST = 1;
export const FEED_DAILY_LIMIT = 3;
export const LOGIN_TOKEN = 1;
export const STREAK_REWARD_DAY = 7;
export const QUIZ_TOKEN = 1;

export function streakLoginPrize(streakDays: number) {
  return Math.max(1, streakDays);
}

export const STREAK_GEAR = [
  "streak-hood",
  "streak-mantle",
  "streak-crown",
] as const;

export const STREAK_TRAIL = "week" as const;

export type StreakUnlockId =
  | (typeof STREAK_GEAR)[number]
  | typeof STREAK_TRAIL;

export function isStreakUnlockId(id: string): id is StreakUnlockId {
  return (
    id === STREAK_TRAIL ||
    (STREAK_GEAR as readonly string[]).includes(id)
  );
}

export function streakGearForWeek(streakDays: number) {
  if (streakDays < STREAK_REWARD_DAY || streakDays % STREAK_REWARD_DAY !== 0) {
    return null;
  }
  const week = streakDays / STREAK_REWARD_DAY;
  return STREAK_GEAR[(week - 1) % STREAK_GEAR.length] ?? STREAK_GEAR[0];
}

export function streakThresholdForGear(id: (typeof STREAK_GEAR)[number]) {
  const index = STREAK_GEAR.indexOf(id);
  return (index + 1) * STREAK_REWARD_DAY;
}

export type StreakAward = {
  id: StreakUnlockId;
  kind: "gear" | "trail";
  name: string;
  days: number;
};

export function normalizeStreakAwardsShown(
  raw: unknown,
  ownedIds: readonly string[] = [],
): StreakUnlockId[] {
  if (Array.isArray(raw)) {
    return [
      ...new Set(
        raw.filter(
          (id): id is StreakUnlockId =>
            typeof id === "string" && isStreakUnlockId(id),
        ),
      ),
    ];
  }
  return [
    ...new Set(
      ownedIds.filter((id): id is StreakUnlockId => isStreakUnlockId(id)),
    ),
  ];
}

export function normalizePendingStreakAward(raw: unknown): StreakAward | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Partial<StreakAward>;
  if (!item.id || !isStreakUnlockId(item.id)) return null;
  if (item.kind !== "gear" && item.kind !== "trail") return null;
  const name = String(item.name ?? "").trim();
  const days = Math.max(STREAK_REWARD_DAY, Math.round(Number(item.days) || 0));
  if (!name) return null;
  return { id: item.id, kind: item.kind, name, days };
}

export {
  QUIZ_BANK,
  QUIZ_LENGTH,
  pickQuiz,
  quizAssignment,
  quizItemCaption,
  type QuizItem,
} from "@/lib/quiz-bank";
