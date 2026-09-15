"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TokenAmount } from "@/components/mint-chip";
import {
  DEFAULT_SPRITE_NAME,
  SPRITE_NAME_MAX,
  SPRITE_RENAME_COST,
  displaySpriteName,
  renameSprite,
} from "@/lib/sprite-name";
import { useCatalyst } from "@/lib/store";

export function SpriteRename({ compact = false }: { compact?: boolean }) {
  const state = useCatalyst();
  const current = displaySpriteName(state.spriteName);
  const [value, setValue] = useState(current);
  const [notice, setNotice] = useState<string | null>(null);
  const first = (state.spriteRenameCount ?? 0) === 0;

  function save() {
    const result = renameSprite(value);
    if (!result.ok) {
      setNotice(result.reason);
      return;
    }
    setValue(displaySpriteName(value));
    setNotice(
      result.cost === 0
        ? "Name saved. First rename is free."
        : `Name saved · ${result.cost} tokens.`,
    );
  }

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      <Label htmlFor="sprite-name">Sprite name</Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="sprite-name"
          value={value}
          maxLength={SPRITE_NAME_MAX}
          placeholder={DEFAULT_SPRITE_NAME}
          onChange={(event) => setValue(event.target.value)}
          className="h-11"
        />
        <Button type="button" className="h-11 rounded-full px-5" onClick={save}>
          Save name
        </Button>
      </div>
      <p className="text-sm text-zinc-400">
        {first ? (
          "First rename is free."
        ) : (
          <>
            Later renames cost <TokenAmount value={SPRITE_RENAME_COST} />
          </>
        )}
      </p>
      {notice ? <p className="text-sm text-foreground">{notice}</p> : null}
    </div>
  );
}
