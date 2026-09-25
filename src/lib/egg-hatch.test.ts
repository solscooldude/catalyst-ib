import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EGG_FEEDS_TO_HATCH,
  clampEggFeeds,
  eggCrackLevel,
  hatchProgressLabel,
  nextEggFeeds,
  normalizeEggFeeds,
  resolveSpriteHatched,
} from "./egg-hatch.ts";

describe("egg hatch progress", () => {
  it("keeps the hatch snack count as a single constant", () => {
    assert.equal(EGG_FEEDS_TO_HATCH, 3);
  });

  it("cracks after one snack, bigger after two, hatch-ready at the constant", () => {
    assert.equal(eggCrackLevel(0), 0);
    assert.equal(eggCrackLevel(1), 1);
    assert.equal(eggCrackLevel(2), 2);
    assert.equal(eggCrackLevel(EGG_FEEDS_TO_HATCH), 2);
  });

  it("labels progress for My Sprite", () => {
    assert.equal(hatchProgressLabel(0), "Hatching 0/3");
    assert.equal(hatchProgressLabel(1), "Hatching 1/3");
    assert.equal(hatchProgressLabel(2), "Hatching 2/3");
  });

  it("does not un-hatch people already past Egg", () => {
    assert.equal(
      resolveSpriteHatched({ spriteHatched: true, careStage: "growing" }),
      true,
    );
    assert.equal(
      normalizeEggFeeds({ spriteHatched: true, careStage: "hatchling" }),
      EGG_FEEDS_TO_HATCH,
    );
    assert.equal(nextEggFeeds(1, true), EGG_FEEDS_TO_HATCH);
  });

  it("keeps feed progress for users still on Egg", () => {
    assert.equal(
      normalizeEggFeeds({
        spriteHatched: false,
        careStage: "egg",
        eggFeeds: 2,
        feedCount: 0,
      }),
      2,
    );
    assert.equal(
      normalizeEggFeeds({
        spriteHatched: false,
        careStage: "egg",
        feedDay: "2026-09-25",
        feedCount: 1,
      }, "2026-09-25"),
      1,
    );
    assert.equal(
      resolveSpriteHatched({
        spriteHatched: false,
        careStage: "egg",
        eggFeeds: 1,
        careActions: 1,
      }),
      false,
    );
  });

  it("clamps stored snack counts to the constant", () => {
    assert.equal(clampEggFeeds(-2), 0);
    assert.equal(clampEggFeeds(9), EGG_FEEDS_TO_HATCH);
  });
});
