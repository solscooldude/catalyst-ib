import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { spriteArtSrc } from "./sprite-art.ts";

describe("illustrated sprite plates", () => {
  it("does not prefer image plates for any species or stage", () => {
    assert.equal(spriteArtSrc("fox", "growing"), null);
    assert.equal(spriteArtSrc("bunny", "ethereal"), null);
    assert.equal(spriteArtSrc("deer", "hatchling"), null);
  });

  it("stays null for unknown species or stage", () => {
    assert.equal(spriteArtSrc("phoenix", "growing"), null);
    assert.equal(spriteArtSrc("bunny", "ascended"), null);
  });
});
