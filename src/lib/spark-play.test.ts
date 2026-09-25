import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  SPARK_HOW_TO,
  SPRITE_STAGE_MOVES,
  hitZone,
  isScrunchZone,
  isTickleSwipe,
} from "./spark-play.ts";

describe("animal hit zones", () => {
  it("treats the crown as peak so scrunch can find ears and head", () => {
    assert.equal(hitZone(50, 18, 100, 100), "peak");
    assert.equal(hitZone(50, 32, 100, 100), "peak");
  });

  it("treats mid-head as face for boop", () => {
    assert.equal(hitZone(50, 48, 100, 100), "face");
  });

  it("treats the lower drop as belly for tickle and scrunch", () => {
    assert.equal(hitZone(50, 72, 100, 100), "belly");
    assert.equal(isScrunchZone("peak"), true);
    assert.equal(isScrunchZone("face"), true);
    assert.equal(isScrunchZone("belly"), true);
    assert.equal(isScrunchZone("body"), false);
  });

  it("still reads a sideways belly swipe as a tickle", () => {
    assert.equal(isTickleSwipe(40, 4), true);
    assert.equal(isTickleSwipe(10, 4), false);
  });
});

describe("My Sprite cheat sheet", () => {
  it("lists every live stage move and no leftovers", () => {
    const names = SPARK_HOW_TO.map((row) => row.name);
    for (const move of SPRITE_STAGE_MOVES) {
      assert.ok(names.includes(move), `missing ${move}`);
    }
    assert.ok(names.includes("Study buddy sit"));
    assert.ok(names.includes("Equip"));
  });
});
