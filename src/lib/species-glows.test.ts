import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  BRAND_MINT,
  ETHEREAL_GLOWS,
  SPRITE_SPECIES,
} from "./species-glows.ts";
import { SPECIES_PALETTES, normalizeSpriteSpecies } from "./sprite-species.ts";

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

  it("keeps the cat a tuxedo with magenta glow", () => {
    assert.equal(SPECIES_PALETTES.cat.fur, "#1C1C1E");
    assert.equal(SPECIES_PALETTES.cat.belly, "#FFF8F4");
    assert.equal(SPECIES_PALETTES.cat.mark, "#FFF8F4");
    assert.equal(SPECIES_PALETTES.cat.nose, "#F4A8B8");
    assert.equal(SPECIES_PALETTES.cat.egg, "#1C1C1E");
    assert.equal(SPECIES_PALETTES.cat.eggMark, "#FFF8F4");
    assert.equal(ETHEREAL_GLOWS.cat.glow, "#E879F9");
    assert.equal(ETHEREAL_GLOWS.cat.glowDeep, "#A78BFA");
  });

  it("keeps the deer a warm caramel with cream spots", () => {
    assert.equal(SPECIES_PALETTES.deer.fur, "#B8773F");
    assert.equal(SPECIES_PALETTES.deer.furDeep, "#8A4A24");
    assert.equal(SPECIES_PALETTES.deer.belly, "#FFF6E8");
    assert.equal(SPECIES_PALETTES.deer.mark, "#FFF8EE");
    assert.equal(SPECIES_PALETTES.deer.egg, "#C8894E");
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
