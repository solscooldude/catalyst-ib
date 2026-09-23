"use client";

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
  DEMO_TIME_COMPRESS_MS,
  DEMO_TOKEN_BLOCK_MS,
  DEMO_TOKENS_PER_BLOCK,
  DEMO_UNLOCK_MS,
  MOCK_TASKS,
  REAL_TIME_COMPRESS_MS,
  REAL_TOKEN_MS,
  REAL_UNLOCK_MS,
  NEMESIS_UNLOCK_COST,
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
  normalizeHostList,
  type UnlockMinutes,
} from "@/lib/domain-policy";
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
  inferSubjectId,
  mergeSchoolTasks,
  mockTasksAsSchool,
  type SchoolTask,
} from "@/lib/school-tasks";
import { SAMPLE_CLASSROOM_TASKS } from "@/lib/classroom";
import { SAMPLE_MANAGEBAC_TASKS, parseManageBacImport } from "@/lib/managebac";
import type { SchoolProvider } from "@/lib/school-provider";
import { displaySpriteName, isDefaultSpriteName } from "@/lib/sprite-name";
import {
  clampDailyGoalMinutes,
  DAILY_GOAL_REWARD,
} from "@/lib/daily-goal";
import { todayStudyMs } from "@/lib/stats";
import {
  claimFriendCode,
  FRIEND_CODE_HINT,
  normalizeFriendCode,
  stubFriendFromCode,
} from "@/lib/friends";
import {
  normalizeAvatar,
  normalizeAvatarUrl,
  normalizeUsername,
} from "@/lib/identity";
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
