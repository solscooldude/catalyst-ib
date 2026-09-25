import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { spriteArtSrc } from "./sprite-art.ts";

describe("illustrated sprite plates", () => {
  it("does not prefer image plates for any shape or stage", () => {
    assert.equal(spriteArtSrc("fox", "growing"), null);
    assert.equal(spriteArtSrc("bunny", "ethereal"), null);
    assert.equal(spriteArtSrc("cat", "hatchling"), null);
  });

  it("stays null for unknown shape or stage", () => {
    assert.equal(spriteArtSrc("phoenix", "growing"), null);
    assert.equal(spriteArtSrc("axolotl", "ascended"), null);
  });
});
