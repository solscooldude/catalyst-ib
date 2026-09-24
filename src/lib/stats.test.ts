import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CARE_STAGES,
  ETHEREAL_SCORE,
  LUMINARY_SCORE,
  normalizeCareStage,
  sparkEvolutionLabel,
  stageFromScore,
} from "./care-stages.ts";

describe("care stages", () => {
  it("lists Egg through Ethereal with Ethereal last", () => {
    assert.deepEqual([...CARE_STAGES], [
      "egg",
      "hatchling",
      "growing",
      "luminary",
      "ethereal",
    ]);
    assert.equal(sparkEvolutionLabel("ethereal"), "Ethereal");
  });

  it("maps legacy sparklet/steady/bright onto Growing", () => {
    assert.equal(normalizeCareStage("sparklet"), "growing");
    assert.equal(normalizeCareStage("steady"), "growing");
    assert.equal(normalizeCareStage("bright"), "growing");
    assert.equal(normalizeCareStage("luminary"), "luminary");
    assert.equal(normalizeCareStage("ethereal"), "ethereal");
  });

  it("unlocks Ethereal only after Luminary at score 64", () => {
    assert.equal(stageFromScore(0, false), "egg");
    assert.equal(stageFromScore(1, true), "hatchling");
    assert.equal(stageFromScore(16, true), "growing");
    assert.equal(stageFromScore(LUMINARY_SCORE - 0.01, true), "growing");
    assert.equal(stageFromScore(LUMINARY_SCORE, true), "luminary");
    assert.equal(stageFromScore(ETHEREAL_SCORE - 0.01, true), "luminary");
    assert.equal(stageFromScore(ETHEREAL_SCORE, true), "ethereal");
  });
});
