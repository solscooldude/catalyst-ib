export const LIVE_APP_ORIGIN = "https://catalyst-study.vercel.app";

export const LIVE_APP_HOSTS = [
  "catalyst-study.vercel.app",
  "catalyst-focus.vercel.app",
  "catalyst-ib.vercel.app",
] as const;

export function defaultAppOrigin() {
  if (typeof window === "undefined") return LIVE_APP_ORIGIN;
  return window.location.origin;
}
