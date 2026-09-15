export const STUDY_BUDDY_KEY = "catalyst-v1:study-buddy-sit";

export function readStudyBuddySit() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STUDY_BUDDY_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeStudyBuddySit(on: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STUDY_BUDDY_KEY, on ? "1" : "0");
  } catch {
    /* quota */
  }
}
