import { writeDeviceSpriteName } from "@/lib/sprite-name-persist";
import { getSnapshot, setState } from "@/lib/store-core";

export const DEFAULT_SPRITE_NAME = "Sprite";

export function isDefaultSpriteName(name?: string | null) {
  return /^(spark|sprite|flux)$/i.test((name ?? "").trim());
}
export const SPRITE_NAME_MAX = 16;
export const SPRITE_RENAME_COST = 2;

export function normalizeSpriteName(raw?: string | null) {
  const trimmed = (raw ?? "").replace(/\s+/g, " ").trim();
  if (!trimmed) return DEFAULT_SPRITE_NAME;
  return trimmed.slice(0, SPRITE_NAME_MAX);
}

export function displaySpriteName(raw?: string | null) {
  const name = normalizeSpriteName(raw);
  return isDefaultSpriteName(name) ? DEFAULT_SPRITE_NAME : name;
}

export function commitSpriteName(next: string) {
  const name = displaySpriteName(next);
  writeDeviceSpriteName(name);
  setState((state) =>
    displaySpriteName(state.spriteName) === name
      ? state
      : {
          ...state,
          spriteName: name,
          spriteRenameCount: Math.max(state.spriteRenameCount ?? 0, 1),
        },
  );
  return name;
}

export function renameSprite(next: string) {
  const name = normalizeSpriteName(next);
  if (/^flux$/i.test(name)) {
    return { ok: false as const, reason: "That's the old prototype name." };
  }
  const current = getSnapshot();
  if (name === displaySpriteName(current.spriteName)) {
    writeDeviceSpriteName(name);
    return { ok: true as const, cost: 0 };
  }
  const first = (current.spriteRenameCount ?? 0) === 0;
  if (!first && current.tokens < SPRITE_RENAME_COST) {
    return {
      ok: false as const,
      reason: `Later renames cost ${SPRITE_RENAME_COST} tokens.`,
    };
  }
  setState((state) => ({
    ...state,
    spriteName: name,
    spriteRenameCount: (state.spriteRenameCount ?? 0) + 1,
    tokens: first ? state.tokens : state.tokens - SPRITE_RENAME_COST,
  }));
  writeDeviceSpriteName(name);
  return { ok: true as const, cost: first ? 0 : SPRITE_RENAME_COST };
}
