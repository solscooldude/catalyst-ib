import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_STUDY_STYLE,
  STUDY_STYLES,
  STUDY_STYLE_RESULTS,
  normalizeStudyStyle,
  studyStyleResult,
} from "./study-style.ts";

describe("study style", () => {
  it("maps each style to a unique starter glow", () => {
    const auras = STUDY_STYLES.map((id) => STUDY_STYLE_RESULTS[id].aura);
    assert.equal(new Set(auras).size, STUDY_STYLES.length);
    assert.deepEqual(auras, [
      "amber",
      "pearl",
      "grove",
      "magenta",
      "hotpink",
      "mint",
    ]);
  });

  it("migrates legacy animal ids to study styles", () => {
    assert.equal(normalizeStudyStyle("fox"), "night-owl");
    assert.equal(normalizeStudyStyle("bunny"), "social-sprint");
    assert.equal(normalizeStudyStyle("deer"), "steady-marathon");
    assert.equal(normalizeStudyStyle("cat"), "deep-dive");
    assert.equal(normalizeStudyStyle("axolotl"), "calm-plan");
    assert.equal(normalizeStudyStyle("dragon"), "bold-challenge");
    assert.equal(normalizeStudyStyle("unknown"), DEFAULT_STUDY_STYLE);
  });

  it("keeps titles free of animal names", () => {
    for (const id of STUDY_STYLES) {
      const card = studyStyleResult(id);
      assert.match(card.title, /\S/);
      assert.match(card.glowName, /\S/);
      assert.equal(/fox|bunny|deer|cat|axolotl|dragon/i.test(card.title), false);
      assert.equal(/fox|bunny|deer|cat|axolotl|dragon/i.test(card.line), false);
    }
  });
});
