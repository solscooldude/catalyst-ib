import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DRAIN_TIE,
  emptyPetScores,
  leadingStyles,
  PET_QUIZ,
  petQuizOutcome,
  scorePetAnswer,
} from "./pet-quiz.ts";
import { STUDY_STYLE_RESULTS, STUDY_STYLES } from "./study-style.ts";

const ANIMAL_CUES = /fox|bunny|deer|cat|axolotl|dragon|animal/i;

describe("pet quiz", () => {
  it("has exactly 7 everyday questions with four hidden mappings", () => {
    assert.equal(PET_QUIZ.length, 7);
    for (const question of PET_QUIZ) {
      assert.equal(question.options.length, 4);
      assert.equal(ANIMAL_CUES.test(question.prompt), false);
      for (const option of question.options) {
        assert.equal(option.text.includes(option.style), false);
        assert.equal(ANIMAL_CUES.test(option.text), false);
        assert.match(option.text, /\S/);
      }
    }
  });

  it("covers all six study styles", () => {
    const seen = new Set(PET_QUIZ.flatMap((row) => row.options.map((opt) => opt.style)));
    assert.deepEqual([...seen].sort(), [...STUDY_STYLES].sort());
  });

  it("pairs each result to a unique animal and glow", () => {
    const animals = STUDY_STYLES.map((id) => STUDY_STYLE_RESULTS[id].species);
    const auras = STUDY_STYLES.map((id) => STUDY_STYLE_RESULTS[id].aura);
    assert.equal(new Set(animals).size, 6);
    assert.equal(new Set(auras).size, 6);
    assert.equal(STUDY_STYLE_RESULTS["night-owl"].species, "fox");
    assert.equal(STUDY_STYLE_RESULTS["social-sprint"].species, "bunny");
    assert.equal(STUDY_STYLE_RESULTS["steady-marathon"].species, "deer");
    assert.equal(STUDY_STYLE_RESULTS["deep-dive"].species, "cat");
    assert.equal(STUDY_STYLE_RESULTS["calm-plan"].species, "axolotl");
    assert.equal(STUDY_STYLE_RESULTS["bold-challenge"].species, "dragon");
  });

  it("scores a clean Night owl win", () => {
    let scores = emptyPetScores();
    const picks = [0, 0, 0, 3, 0, 0, 0];
    picks.forEach((option, index) => {
      scores = scorePetAnswer(scores, index, option);
    });
    assert.equal(petQuizOutcome(scores).kind, "winner");
    assert.deepEqual(petQuizOutcome(scores).styles, ["night-owl"]);
  });

  it("uses the drain prompt when Calm planner and Bold challenger tie", () => {
    const scores = {
      ...emptyPetScores(),
      "calm-plan": 4,
      "bold-challenge": 4,
      "night-owl": 1,
    };
    const outcome = petQuizOutcome(scores);
    assert.equal(outcome.kind, "drain-tie");
    assert.deepEqual(outcome.styles, ["calm-plan", "bold-challenge"]);
    assert.match(DRAIN_TIE.prompt, /drained/);
  });

  it("asks which feels more you on a normal two-way tie", () => {
    const scores = {
      ...emptyPetScores(),
      "night-owl": 4,
      "social-sprint": 4,
      "steady-marathon": 1,
    };
    const outcome = petQuizOutcome(scores);
    assert.equal(outcome.kind, "tie");
    assert.deepEqual(leadingStyles(scores), ["night-owl", "social-sprint"]);
  });
});
