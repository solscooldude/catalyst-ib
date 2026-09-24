import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { ILLUSTRATED_SPECIES, ILLUSTRATED_STAGES, spriteArtSrc } from "./sprite-art.ts";

describe("illustrated sprite plates", () => {
  it("ships every quiz species for every care stage", () => {
    for (const species of ILLUSTRATED_SPECIES) {
      for (const stage of ILLUSTRATED_STAGES) {
        assert.equal(spriteArtSrc(species, stage), `/sprites/${species}/${stage}.webp`);
      }
    }
  });

  it("falls back when the species or stage is unknown", () => {
    assert.equal(spriteArtSrc("phoenix", "growing"), null);
    assert.equal(spriteArtSrc("bunny", "ascended"), null);
  });

  it("keeps a real WebP plate on disk for every species and stage", () => {
    const root = join(process.cwd(), "public/sprites");
    for (const species of ILLUSTRATED_SPECIES) {
      for (const stage of ILLUSTRATED_STAGES) {
        assert.equal(
          existsSync(join(root, species, `${stage}.webp`)),
          true,
          `missing ${species}/${stage}.webp`,
        );
      }
    }
  });
});
