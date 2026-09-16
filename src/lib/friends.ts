export type Friend = {
  code: string;
  name: string;
  tokens: number;
  streakDays: number;
};

export function normalizeFriendCode(raw: string) {
  const next = raw.trim().toUpperCase().replace(/\s+/g, "");
  if (!/^CAT-[A-Z2-9]{6}$/.test(next)) return "";
  return next;
}

export function stubFriendFromCode(code: string): Friend {
  let hash = 0;
  for (const ch of code) hash = (hash * 33 + ch.charCodeAt(0)) >>> 0;
  return {
    code,
    name: `IB ${code.slice(-4)}`,
    tokens: 6 + (hash % 48),
    streakDays: 1 + (hash % 18),
  };
}

export function normalizeFriends(raw: unknown): Friend[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const next: Friend[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const item = row as Partial<Friend>;
    const code = normalizeFriendCode(String(item.code ?? ""));
    if (!code || seen.has(code)) continue;
    seen.add(code);
    const stub = stubFriendFromCode(code);
    next.push({
      code,
      name:
        typeof item.name === "string" && item.name.trim()
          ? item.name.trim().slice(0, 20)
          : stub.name,
      tokens:
        typeof item.tokens === "number" && item.tokens >= 0
          ? Math.round(item.tokens)
          : stub.tokens,
      streakDays:
        typeof item.streakDays === "number" && item.streakDays >= 1
          ? Math.round(item.streakDays)
          : stub.streakDays,
    });
  }
  return next.slice(0, 24);
}
