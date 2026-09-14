import {
  MOCK_TASKS,
  SUBJECTS,
  TASK_SUBJECT,
  type SubjectId,
  type TaskId,
} from "@/lib/constants";
import { diplomaSubjectList, type ProfileState } from "@/lib/ib";

export type SparkFlavor =
  | "math"
  | "biology"
  | "chemistry"
  | "physics"
  | "reading"
  | "history"
  | "geography"
  | "economics"
  | "psychology"
  | "cs"
  | "arts"
  | "music"
  | "research"
  | "cas"
  | "generic";

/** Subject ink — contrast the mint spark body, never reuse #5EEAD4. */
export const SPARK_FLAVOR_INK: Record<SparkFlavor, string> = {
  math: "#F5C14A",
  biology: "#8BD14A",
  chemistry: "#FB8A3C",
  physics: "#8BA4FF",
  reading: "#E8B86D",
  history: "#D4A06A",
  geography: "#4DB7F5",
  economics: "#F3C14B",
  psychology: "#F47A9A",
  cs: "#7EB6FF",
  arts: "#E879F9",
  music: "#F472B6",
  research: "#E2C07A",
  cas: "#FB7A6E",
  generic: "#E8DFC8",
};

export type SparkFlavorInput = {
  subjectId?: SubjectId | null;
  text?: string | null;
};

const SUBJECT_FLAVOR: Record<SubjectId, SparkFlavor> = {
  "math-aa": "math",
  biology: "biology",
  chemistry: "chemistry",
  physics: "physics",
  tok: "reading",
  english: "reading",
  "language-b": "reading",
  history: "history",
  geography: "geography",
  economics: "economics",
  psychology: "psychology",
  cs: "cs",
  "digital-societies": "cs",
  "visual-arts": "arts",
  music: "music",
  ee: "research",
  cas: "cas",
  other: "generic",
};

const KEYWORD_RULES: { flavor: SparkFlavor; tests: RegExp[] }[] = [
  {
    flavor: "cas",
    tests: [
      /\bcas\b/,
      /creativity.?activity/,
      /\bsport/,
      /\bathlet/,
      /\bfootball\b/,
      /\bsoccer\b/,
      /\bswim/,
    ],
  },
  {
    flavor: "research",
    tests: [
      /\bextended essay\b/,
      /\bee\b/,
      /\bee[- ]/,
      /\bresearch\b/,
      /literature review/,
      /\bbibliograph/,
      /\bsources?\b/,
    ],
  },
  {
    flavor: "reading",
    tests: [/\btok\b/, /theory of knowledge/],
  },
  {
    flavor: "cs",
    tests: [
      /\bcomputer science\b/,
      /\bdigital societ/,
      /\bcoding\b/,
      /\bprogramming\b/,
      /\bpython\b/,
      /\bjava\b/,
      /\bcs hl\b/,
      /\bcs sl\b/,
    ],
  },
  {
    flavor: "arts",
    tests: [/\bvisual arts?\b/, /\bstudio\b/, /\bpaint/, /\bdrawing\b/],
  },
  {
    flavor: "music",
    tests: [/\bmusic\b/, /\bcomposition\b/, /\bpiano\b/, /\bensemble\b/],
  },
  {
    flavor: "psychology",
    tests: [/\bpsych/],
  },
  {
    flavor: "economics",
    tests: [/\becon/, /\bmicroecon/, /\bmacroecon/],
  },
  {
    flavor: "geography",
    tests: [/\bgeograph/, /\bgeo hl\b/, /\bgeo sl\b/],
  },
  {
    flavor: "physics",
    tests: [/\bphysic/, /\bmechanic/, /\borbit/, /\bkinematics/],
  },
  {
    flavor: "chemistry",
    tests: [/\bchem/, /\benergetics\b/, /\bstoich/, /\bmolecul/],
  },
  {
    flavor: "biology",
    tests: [/\bbiolog/, /\bbio ia\b/, /\bbio hl\b/, /\bbio sl\b/, /\bcell\b/],
  },
  {
    flavor: "history",
    tests: [/\bhistor/, /\bcold war\b/, /\bpaper 2\b/],
  },
  {
    flavor: "math",
    tests: [
      /\bmath/,
      /\bcalculus\b/,
      /\balgebra\b/,
      /\bintegrat/,
      /\bstatistic/,
      /\baa hl\b/,
      /\bai hl\b/,
      /\bai sl\b/,
    ],
  },
  {
    flavor: "reading",
    tests: [
      /\benglish\b/,
      /\blanguage [ab]\b/,
      /\bessay\b/,
      /\bspanish\b/,
      /\bfrench\b/,
      /\bgerman\b/,
      /\bmandarin\b/,
      /\bliterature\b/,
      /\blanguage\b/,
    ],
  },
];

function flavorFromKeywords(text: string): SparkFlavor | null {
  const haystack = text.toLowerCase();
  for (const rule of KEYWORD_RULES) {
    if (rule.tests.some((test) => test.test(haystack))) return rule.flavor;
  }
  return null;
}

export function sparkFlavorFromContext(
  input: SparkFlavorInput = {},
): SparkFlavor {
  const hinted = input.text?.trim()
    ? flavorFromKeywords(input.text)
    : null;
  if (hinted) return hinted;
  if (input.subjectId && input.subjectId in SUBJECT_FLAVOR) {
    return SUBJECT_FLAVOR[input.subjectId];
  }
  return "generic";
}

export function sparkFlavorFromSubject(
  subjectId?: SubjectId | null,
): SparkFlavor {
  return sparkFlavorFromContext({
    subjectId,
    text: SUBJECTS.find((subject) => subject.id === subjectId)?.label,
  });
}

export function sparkHintFromTask(taskId?: TaskId | null): string | undefined {
  if (!taskId) return undefined;
  const task = MOCK_TASKS.find((row) => row.id === taskId);
  return task ? `${task.title} ${task.subject}` : undefined;
}

export function sparkFlavorFromTask(taskId?: TaskId | null): SparkFlavor {
  if (!taskId) return "generic";
  return sparkFlavorFromContext({
    subjectId: TASK_SUBJECT[taskId],
    text: sparkHintFromTask(taskId),
  });
}

export function idleSubjectMoments(profile: ProfileState) {
  const { core, groups } = diplomaSubjectList(profile);
  return [...core, ...groups].map((row) => ({
    id: row.id,
    label: row.label,
    flavor: sparkFlavorFromSubject(row.statId),
  }));
}
