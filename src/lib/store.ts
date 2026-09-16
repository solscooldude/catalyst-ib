use client";

import {
  ACCENTS,
  BACKGROUNDS,
  FOCUS_THEMES,
  SPARK_AURAS,
  SPARK_GEAR,
  SPARK_TRAILS,
  SPARK_TINTS,
  normalizeAppearance,
  roomHasShades,
  type AccentId,
  type AccentShadeId,
  type AppearanceState,
  type BackgroundId,
} from "@/lib/appearance";
import {
  FEED_COST,
  FEED_DAILY_LIMIT,
  QUIZ_TOKEN,
  STREAK_REWARD_DAY,
  dayKey,
  streakGearForWeek,
  streakLoginPrize,
  yesterdayKey,
} from "@/lib/care";
import {
  COMPLETION_BONUS,
  DEMO_TIME_COMPRESS_MS,
  DEMO_TOKEN_BLOCK_MS,
  DEMO_TOKENS_PER_BLOCK,
  DEMO_UNLOCK_MS,
  MOCK_TASKS,
  REAL_TIME_COMPRESS_MS,
  REAL_TOKEN_MS,
  REAL_UNLOCK_MS,
  SUBJECTS,
  TASK_SUBJECT,
  UNLOCK_CATALOG,
  isNemesisId,
  type NemesisId,
  type SubjectId,
  type TaskId,
  TIER2_COST,
  TIER3_COST,
  type UnlockCatalogId,
  type UnlockTier,
  unlockTierSpendId,
} from "@/lib/constants";
import {
  normalizeMotivation,
  normalizeProfile,
  validateDiploma,
  type MotivationState,
} from "@/lib/ib";
import {
  AFTER_SCHOOL_PRESET,
  normalizeSchedule,
  normalizeWindow,
  validateWindow,
  type LockWindow,
} from "@/lib/schedule";
import { writeSessionRecap } from "@/lib/session-recap";
import {
  mergeSchoolTasks,
  mockTasksAsSchool,
  type SchoolTask,
} from "@/lib/school-tasks";
import { SAMPLE_CLASSROOM_TASKS } from "@/lib/classroom";
import { SAMPLE_MANAGEBAC_TASKS, parseManageBacImport } from "@/lib/managebac";
import { displaySpriteName, isDefaultSpriteName } from "@/lib/sprite-name";
import { clampDailyGoalMinutes } from "@/lib/daily-goal";
import {
  claimFriendCode,
  FRIEND_CODE_HINT,
  normalizeFriendCode,
  stubFriendFromCode,
} from "@/lib/friends";
import { normalizeAvatar, normalizeUsername } from "@/lib/identity";
import {
  normalizePlannerEvents,
  type PlannerEventKind,
} from "@/lib/planner";
import { playSfx } from "@/lib/sfx";
import {
  coalesceUnlocks,
  getSnapshot,
  setState,
  type CatalystState,
  type Session,
  type SessionLog,
  type Unlock,
} from "@/lib/store-core";

export * from "@/lib/store-core";

export function completeSetup(nemeses: NemesisId[]) {
  const next = [...new Set(nemeses.filter(isNemesisId))];
  if (next.length === 0) {
    return { ok: false as const, reason: "Pick at least one Tier 3 app." };
  }
  setState((current) => {
    const schedule =
      current.schedule.length > 0
        ? current.schedule
        : normalizeSchedule([AFTER_SCHOOL_PRESET]);
    if (schedule.length === 0) return current;
    return {
      ...current,
      nemeses: next,
      schedule,
      schoolTasks:
        current.schoolTasks.length > 0
          ? current.schoolTasks
          : mockTasksAsSchool([]),
      manageBacConnected: true,
      setupComplete: true,
    };
  });
  if (!getSnapshot().setupComplete) {
    return { ok: false as const, reason: "Add lock hours first." };
  }
  return { ok: true as const };
}

export function saveNemeses(nemeses: NemesisId[]) {
  const next = [...new Set(nemeses.filter(isNemesisId))];
  setState((current) => ({ ...current, nemeses: next }));
  return { ok: true as const, nemeses: next };
}
