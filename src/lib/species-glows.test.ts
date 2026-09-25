import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BRAND_MINT,
  ETHEREAL_GLOWS,
  SPRITE_SPECIES,
} from "./species-glows.ts";
import { normalizeSpriteSpecies } from "./sprite-species.ts";

describe("signature Ethereal glows", () => {
  it("gives each animal a unique glow; mint only on Dragon", () => {
    const glows = SPRITE_SPECIES.map((id) => ETHEREAL_GLOWS[id].glow);
    assert.equal(new Set(glows).size, 6);
    assert.equal(ETHEREAL_GLOWS.dragon.glow, BRAND_MINT);
    assert.equal(ETHEREAL_GLOWS.fox.fx, "sunset");
    assert.equal(ETHEREAL_GLOWS.bunny.fx, "bubbles");
    assert.equal(ETHEREAL_GLOWS.deer.fx, "goldgreen");
    assert.equal(ETHEREAL_GLOWS.cat.fx, "hearts");
    assert.equal(ETHEREAL_GLOWS.axolotl.fx, "rose");
    assert.equal(ETHEREAL_GLOWS.dragon.fx, "starfire");
    for (const id of SPRITE_SPECIES) {
      if (id === "dragon") continue;
      assert.notEqual(ETHEREAL_GLOWS[id].glow, BRAND_MINT);
      assert.notEqual(ETHEREAL_GLOWS[id].glowDeep, BRAND_MINT);
    }
  });

  it("keeps animals and maps drop-shape leftovers onto them", () => {
    assert.equal(normalizeSpriteSpecies("fox"), "fox");
    assert.equal(normalizeSpriteSpecies("bunny"), "bunny");
    assert.equal(normalizeSpriteSpecies("dragon"), "dragon");
    assert.equal(normalizeSpriteSpecies("teardrop"), "bunny");
    assert.equal(normalizeSpriteSpecies("twin-peak"), "dragon");
    assert.equal(normalizeSpriteSpecies("bean"), "cat");
    assert.equal(normalizeSpriteSpecies("star"), "fox");
    assert.equal(normalizeSpriteSpecies(undefined), "fox");
  });
});
