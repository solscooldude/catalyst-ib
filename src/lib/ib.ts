import type { SubjectId } from "@/lib/constants";

export const IB_GROUPS = [1, 2, 3, 4, 5, 6] as const;
export type IbGroup = (typeof IB_GROUPS)[number];

export type IbSubject = {
  id: string;
  label: string;
  group: IbGroup;
  statId: SubjectId;
};

export const IB_SUBJECTS: IbSubject[] = [
  { id: "eng-a-langlit", label: "English A Language & Literature", group: 1, statId: "english" },
  { id: "eng-a-lit", label: "English A Literature", group: 1, statId: "english" },
  { id: "spa-a-langlit", label: "Spanish A Language & Literature", group: 1, statId: "language-b" },
  { id: "spa-a-lit", label: "Spanish A Literature", group: 1, statId: "language-b" },
  { id: "fre-a-langlit", label: "French A Language & Literature", group: 1, statId: "language-b" },
  { id: "fre-a-lit", label: "French A Literature", group: 1, statId: "language-b" },
  { id: "ita-a-langlit", label: "Italian A Language & Literature", group: 1, statId: "language-b" },
  { id: "ita-a-lit", label: "Italian A Literature", group: 1, statId: "language-b" },
  { id: "ger-a-langlit", label: "German A Language & Literature", group: 1, statId: "language-b" },
  { id: "ger-a-lit", label: "German A Literature", group: 1, statId: "language-b" },
  { id: "chi-a-langlit", label: "Chinese A Language & Literature", group: 1, statId: "language-b" },
  { id: "chi-a-lit", label: "Chinese A Literature", group: 1, statId: "language-b" },
  { id: "por-a-lit", label: "Portuguese A Literature", group: 1, statId: "language-b" },
  { id: "jpn-a-lit", label: "Japanese A Literature", group: 1, statId: "language-b" },
  { id: "ara-a-lit", label: "Arabic A Literature", group: 1, statId: "language-b" },
  { id: "self-taught-a", label: "Language A self-taught", group: 1, statId: "language-b" },
  { id: "spanish-b", label: "Spanish B", group: 2, statId: "language-b" },
  { id: "french-b", label: "French B", group: 2, statId: "language-b" },
  { id: "italian-b", label: "Italian B", group: 2, statId: "language-b" },
  { id: "german-b", label: "German B", group: 2, statId: "language-b" },
  { id: "mandarin-b", label: "Mandarin B", group: 2, statId: "language-b" },
  { id: "english-b", label: "English B", group: 2, statId: "english" },
  { id: "japanese-b", label: "Japanese B", group: 2, statId: "language-b" },
  { id: "portuguese-b", label: "Portuguese B", group: 2, statId: "language-b" },
  { id: "latin", label: "Latin", group: 2, statId: "language-b" },
  { id: "spanish-ab", label: "Spanish Ab initio", group: 2, statId: "language-b" },
  { id: "french-ab", label: "French Ab initio", group: 2, statId: "language-b" },
  { id: "italian-ab", label: "Italian Ab initio", group: 2, statId: "language-b" },
  { id: "german-ab", label: "German Ab initio", group: 2, statId: "language-b" },
  { id: "mandarin-ab", label: "Mandarin Ab initio", group: 2, statId: "language-b" },
  { id: "japanese-ab", label: "Japanese Ab initio", group: 2, statId: "language-b" },
  { id: "history", label: "History", group: 3, statId: "history" },
  { id: "geography", label: "Geography", group: 3, statId: "geography" },
  { id: "economics", label: "Economics", group: 3, statId: "economics" },
  { id: "psychology", label: "Psychology", group: 3, statId: "psychology" },
  { id: "business", label: "Business Management", group: 3, statId: "economics" },
  { id: "global-politics", label: "Global Politics", group: 3, statId: "history" },
  { id: "digital-societies", label: "Digital Societies", group: 3, statId: "digital-societies" },
  { id: "philosophy", label: "Philosophy", group: 3, statId: "history" },
  { id: "biology", label: "Biology", group: 4, statId: "biology" },
  { id: "chemistry", label: "Chemistry", group: 4, statId: "chemistry" },
  { id: "physics", label: "Physics", group: 4, statId: "physics" },
  { id: "cs", label: "Computer Science", group: 4, statId: "cs" },
  { id: "ess", label: "ESS", group: 4, statId: "biology" },
  { id: "sehs", label: "Sports, Exercise & Health", group: 4, statId: "cas" },
  { id: "design-tech", label: "Design Technology", group: 4, statId: "cs" },
  { id: "math-aa-hl", label: "Mathematics AA HL", group: 5, statId: "math-aa" },
  { id: "math-aa-sl", label: "Mathematics AA SL", group: 5, statId: "math-aa" },
  { id: "math-ai-hl", label: "Mathematics AI HL", group: 5, statId: "math-aa" },
  { id: "math-ai-sl", label: "Mathematics AI SL", group: 5, statId: "math-aa" },
  { id: "visual-arts", label: "Visual Arts", group: 6, statId: "visual-arts" },
  { id: "music", label: "Music", group: 6, statId: "music" },
  { id: "theatre", label: "Theatre", group: 6, statId: "visual-arts" },
  { id: "film", label: "Film", group: 6, statId: "visual-arts" },
  { id: "dance", label: "Dance", group: 6, statId: "visual-arts" },
];

export const CORE_STUDY = [
  { id: "tok", label: "Theory of Knowledge", statId: "tok" as SubjectId },
  { id: "ee", label: "Extended Essay", statId: "ee" as SubjectId },
  { id: "cas", label: "CAS", statId: "cas" as SubjectId },
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
};

export const defaultProfile: ProfileState = {
  complete: false,
  classYear: null,
  subjects: [],
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

export function getIbSubject(id: string) {
  return IB_SUBJECTS.find((row) => row.id === id);
}

export function subjectsInGroup(group: IbGroup) {
  return IB_SUBJECTS.filter((row) => row.group === group);
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
    return { ok: false, reason: "Choose exactly six DP subjects." };
  }
  const unique = new Set(subjects);
  if (unique.size !== 6) {
    return { ok: false, reason: "Each subject can only be taken once." };
  }
  const rows = subjects.map((id) => getIbSubject(id)).filter(Boolean) as IbSubject[];
  if (rows.length !== 6) {
    return { ok: false, reason: "One of those subjects is not on the IB list." };
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

export function studySubjectOptions(profile: ProfileState) {
  const diploma = profile.subjects
    .map((id) => getIbSubject(id))
    .filter(Boolean) as IbSubject[];
  const core = CORE_STUDY.map((row) => ({
    id: row.statId,
    label: row.label,
    statId: row.statId,
  }));
  const mapped = diploma.map((row) => ({
    id: row.statId,
    label: row.label,
    statId: row.statId,
  }));
  const seen = new Set<string>();
  return [...mapped, ...core].filter((row) => {
    const key = `${row.statId}:${row.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function motivationReady(motivation: MotivationState) {
  return Boolean(
    motivation.colleges.trim() &&
      motivation.course.trim() &&
      motivation.why.trim(),
  );
}
