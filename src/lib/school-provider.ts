export const SCHOOL_PROVIDERS = ["managebac", "classroom"] as const;
export type SchoolProvider = (typeof SCHOOL_PROVIDERS)[number];

export function normalizeSchoolProvider(
  raw: unknown,
): SchoolProvider | null {
  return raw === "managebac" || raw === "classroom" ? raw : null;
}

export function providerLabel(provider: SchoolProvider | null) {
  if (provider === "classroom") return "Google Classroom";
  if (provider === "managebac") return "ManageBac";
  return "Not chosen";
}
