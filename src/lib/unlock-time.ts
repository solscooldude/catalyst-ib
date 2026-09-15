export function formatUnlockLeft(ms: number) {
  const mins = Math.floor(Math.max(0, ms) / 60000);
  const secs = Math.floor((Math.max(0, ms) % 60000) / 1000);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}
