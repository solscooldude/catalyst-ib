import { alphaByLabel } from "@/lib/alpha";
import type { SubjectId } from "@/lib/constants";

export const IB_GROUPS = [1, 2, 3, 4, 5, 6] as const;
export type IbGroup = (typeof IB_GROUPS)[number];
export type IbLevel = "HL" | "SL";

export type IbSubject = {
  id: string;
  course: string;
  label: string;
  group: IbGroup;
  statId: SubjectId;
  level: IbLevel;
};

function course(
  courseId: string,
  name: string,
  group: IbGroup,
  statId: SubjectId,
  levels: IbLevel[] = ["HL", "SL"],
): IbSubject[] {
  return levels.map((level) => ({
    id: `${courseId}-${level.toLowerCase()}`,
    course: courseId,
    label: `${name} ${level}`,
    group,
    statId,
    level,
  }));
}

export const IB_SUBJECTS: IbSubject[] = [
  ...course("eng-a-langlit", "English A Language & Literature", 1, "english"),
  ...course("eng-a-lit", "English A Literature", 1, "english"),
  ...course("spa-a-langlit", "Spanish A Language & Literature", 1, "language-b"),
  ...course("spa-a-lit", "Spanish A Literature", 1, "language-b"),
  ...course("fre-a-langlit", "French A Language & Literature", 1, "language-b"),
  ...course("fre-a-lit", "French A Literature", 1, "language-b"),
  ...course("ita-a-langlit", "Italian A Language & Literature", 1, "language-b"),
  ...course("ita-a-lit", "Italian A Literature", 1, "language-b"),
  ...course("ger-a-langlit", "German A Language & Literature", 1, "language-b"),
  ...course("ger-a-lit", "German A Literature", 1, "language-b"),
  ...course("chi-a-langlit", "Chinese A Language & Literature", 1, "language-b"),
  ...course("chi-a-lit", "Chinese A Literature", 1, "language-b"),
  ...course("por-a-lit", "Portuguese A Literature", 1, "language-b"),
  ...course("jpn-a-lit", "Japanese A Literature", 1, "language-b"),
  ...course("ara-a-lit", "Arabic A Literature", 1, "language-b"),
  ...course("self-taught-a", "Language A self-taught", 1, "language-b", ["SL"]),
  ...course("spanish-b", "Spanish B", 2, "language-b"),
  ...course("french-b", "French B", 2, "language-b"),
  ...course("italian-b", "Italian B", 2, "language-b"),
  ...course("german-b", "German B", 2, "language-b"),
  ...course("mandarin-b", "Mandarin B", 2, "language-b"),
  ...course("english-b", "English B", 2, "english"),
  ...course("japanese-b", "Japanese B", 2, "language-b"),
  ...course("portuguese-b", "Portuguese B", 2, "language-b"),
  ...course("latin", "Latin", 2, "language-b"),
  ...course("spanish-ab", "Spanish Ab initio", 2, "language-b", ["SL"]),
  ...course("french-ab", "French Ab initio", 2, "language-b", ["SL"]),
  ...course("italian-ab", "Italian Ab initio", 2, "language-b", ["SL"]),
  ...course("german-ab", "German Ab initio", 2, "language-b", ["SL"]),
  ...course("mandarin-ab", "Mandarin Ab initio", 2, "language-b", ["SL"]),
  ...course("japanese-ab", "Japanese Ab initio", 2, "language-b", ["SL"]),
  ...course("history", "History", 3, "history"),
  ...course("geography", "Geography", 3, "geography"),
  ...course("economics", "Economics", 3, "economics"),
  ...course("psychology", "Psychology", 3, "psychology"),
  ...course("business", "Business Management", 3, "economics"),
  ...course("global-politics", "Global Politics", 3, "history"),
  ...course("digital-societies", "Digital Societies", 3, "digital-societies"),
  ...course("philosophy", "Philosophy", 3, "history"),
  ...course("biology", "Biology", 4, "biology"),
  ...course("chemistry", "Chemistry", 4, "chemistry"),
  ...course("physics", "Physics", 4, "physics"),
  ...course("cs", "Computer Science", 4, "cs"),
  ...course("ess", "ESS", 4, "biology"),
  ...course("sehs", "Sports, Exercise & Health", 4, "cas"),
  ...course("design-tech", "Design Technology", 4, "cs"),
  ...course("math-aa", "Mathematics AA", 5, "math-aa"),
  ...course("math-ai", "Mathematics AI", 5, "math-aa"),
  ...course("visual-arts", "Visual Arts", 6, "visual-arts"),
  ...course("music", "Music", 6, "music"),
  ...course("theatre", "Theatre", 6, "visual-arts"),
  ...course("film", "Film", 6, "visual-arts"),
  ...course("dance", "Dance", 6, "visual-arts"),
];

export const CORE_DIPLOMA = [
  { id: "tok" as const, label: "Theory of Knowledge", statId: "tok" as SubjectId },
  { id: "ee" as const, label: "Extended Essay", statId: "ee" as SubjectId },
];

export const CORE_STUDY = [
  ...CORE_DIPLOMA,
  { id: "cas" as const, label: "CAS", statId: "cas" as SubjectId },
];

export const CLASS_YEARS = [2026, 2027, 2028, 2029, 2030, 2031, 2032] as const;

export const GROUP_LABELS: Record<IbGroup, string> = {
  1: "Group 1 · Language & literature",
  2: "Group 2 · Language acquisition",
  3: "Group 3 · Individuals & societies",
  4: "Group 4 · Sciences",
  5: "Group 5 · Mathematics",
  6: "Group 6 · The arts",
};

export type ProfileState = {
  complete: boolean;
  classYear: number | null;
  subjects: string[];
  core: Array<(typeof CORE_DIPLOMA)[number]["id"]>;
};

export const defaultProfile: ProfileState = {
  complete: false,
  classYear: null,
  subjects: [],
  core: ["tok", "ee"],
};

export type MotivationState = {
  colleges: string;
  course: string;
  why: string;
  targetPoints: string;
  unlockNote: string;
};

export const defaultMotivation: MotivationState = {
  colleges: "",
  course: "",
  why: "",
  targetPoints: "",
  unlockNote: "",
};

export { alphaByLabel } from "@/lib/alpha";

export function getIbSubject(id: string) {
  return IB_SUBJECTS.find((row) => row.id === id);
}

export function subjectsInGroup(group: IbGroup) {
  return alphaByLabel(IB_SUBJECTS.filter((row) => row.group === group));
}

export function takenCourses(subjectIds: string[]) {
  return new Set(
    subjectIds
      .map((id) => getIbSubject(id)?.course)
      .filter((courseId): courseId is string => Boolean(courseId)),
  );
}

export function normalizeProfile(
  raw?: Partial<ProfileState> | null,
): ProfileState {
  const subjects = [...new Set(raw?.subjects ?? [])].filter((id) =>
    IB_SUBJECTS.some((row) => row.id === id),
  );
  const classYear =
    raw?.classYear && CLASS_YEARS.includes(raw.classYear as (typeof CLASS_YEARS)[number])
      ? raw.classYear
      : null;
  const check = validateDiploma(subjects, classYear);
  return {
    classYear,
    subjects,
    core: ["tok", "ee"],
    complete: check.ok,
  };
}

export function normalizeMotivation(
  raw?: Partial<MotivationState> | null,
): MotivationState {
  return {
    colleges: raw?.colleges?.trim() ?? "",
    course: raw?.course?.trim() ?? "",
    why: raw?.why?.trim() ?? "",
    targetPoints: raw?.targetPoints?.trim() ?? "",
    unlockNote: raw?.unlockNote?.trim() ?? "",
  };
}

export function validateDiploma(
  subjects: string[],
  classYear: number | null,
): { ok: true } | { ok: false; reason: string } {
  if (!classYear) return { ok: false, reason: "Pick your graduating class." };
  if (subjects.length !== 6) {
    return { ok: false, reason: "Choose exactly six subjects." };
  }
  const unique = new Set(subjects);
  if (unique.size !== 6) {
    return { ok: false, reason: "Each subject can only be taken once." };
  }
  const rows = subjects.map((id) => getIbSubject(id)).filter(Boolean) as IbSubject[];
  if (rows.length !== 6) {
    return { ok: false, reason: "One of those subjects is not on the list." };
  }
  if (rows.some((row) => !row.level)) {
    return { ok: false, reason: "Every subject needs HL or SL." };
  }
  if (takenCourses(subjects).size !== 6) {
    return { ok: false, reason: "Each subject can only be taken once." };
  }
  const byGroup = new Map<IbGroup, number>();
  for (const row of rows) {
    byGroup.set(row.group, (byGroup.get(row.group) ?? 0) + 1);
  }
  for (const group of [1, 2, 3, 4, 5] as const) {
    if ((byGroup.get(group) ?? 0) < 1) {
      return {
        ok: false,
        reason: `You still need ${GROUP_LABELS[group]}.`,
      };
    }
  }
  const arts = byGroup.get(6) ?? 0;
  if (arts > 1) {
    return { ok: false, reason: "Take at most one Group 6 arts subject." };
  }
  if (arts === 0) {
    const extras = [1, 2, 3, 4, 5].some((group) => (byGroup.get(group as IbGroup) ?? 0) > 1);
    if (!extras) {
      return {
        ok: false,
        reason: "No arts: take a sixth subject from Groups 1–5.",
      };
    }
  }
  return { ok: true };
}

export function diplomaSubjectList(profile: ProfileState) {
  const groups = profile.subjects
    .map((id) => getIbSubject(id))
    .filter((row): row is IbSubject => Boolean(row));
  return {
    core: alphaByLabel(
      CORE_DIPLOMA.map((row) => ({
        id: row.statId,
        label: row.label,
        statId: row.statId,
      })),
    ),
    groups: alphaByLabel(
      groups.map((row) => ({
        id: row.id,
        label: row.label,
        statId: row.statId,
        level: row.level,
      })),
    ),
  };
}

export function studySubjectOptions(profile: ProfileState) {
  const { core, groups } = diplomaSubjectList(profile);
  const cas = CORE_STUDY.filter((row) => row.id === "cas").map((row) => ({
    id: row.statId,
    label: row.label,
    statId: row.statId,
  }));
  const seen = new Set<string>();
  return alphaByLabel(
    [...core, ...groups, ...cas].filter((row) => {
      const key = `${row.statId}:${row.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }),
  );
}

export function motivationReady(motivation: MotivationState) {
  return Boolean(
    motivation.colleges.trim() &&
      motivation.course.trim() &&
      motivation.why.trim(),
  );
}
