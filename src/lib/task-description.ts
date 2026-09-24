export const TASK_DESCRIPTION_MAX = 2000;

export function normalizeTaskDescription(value: string | undefined | null) {
  return (value ?? "").trim().slice(0, TASK_DESCRIPTION_MAX);
}

export function taskDescriptionReady(value: string | undefined | null) {
  return normalizeTaskDescription(value).length > 0;
}
