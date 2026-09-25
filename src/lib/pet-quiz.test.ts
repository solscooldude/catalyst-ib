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

describe("pet quiz", () => {
  it("has 13 questions with four hidden mappings", () => {
    assert.equal(PET_QUIZ.length, 13);
    for (const question of PET_QUIZ) {
      assert.equal(question.options.length, 4);
      for (const option of question.options) {
        assert.equal(option.text.includes(option.style), false);
        assert.match(option.text, /\S/);
      }
    }
  });

  it("maps the locked A–D styles on question 1 and 13", () => {
    assert.deepEqual(
      PET_QUIZ[0]?.options.map((row) => row.style),
      ["night-owl", "social-sprint", "steady-marathon", "deep-dive"],
    );
    assert.deepEqual(
      PET_QUIZ[12]?.options.map((row) => row.style),
      ["night-owl", "social-sprint", "steady-marathon", "bold-challenge"],
    );
  });

  it("scores a clean Night owl win", () => {
    let scores = emptyPetScores();
    const picks = [0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0];
    picks.forEach((option, index) => {
      scores = scorePetAnswer(scores, index, option);
    });
    assert.equal(petQuizOutcome(scores).kind, "winner");
    assert.deepEqual(petQuizOutcome(scores).styles, ["night-owl"]);
  });

  it("uses the drain prompt when calm-plan and bold-challenge tie", () => {
    let scores = emptyPetScores();
    scores = { ...scores, "calm-plan": 4, "bold-challenge": 4, "night-owl": 2 };
    const outcome = petQuizOutcome(scores);
    assert.equal(outcome.kind, "drain-tie");
    assert.deepEqual(outcome.styles, ["calm-plan", "bold-challenge"]);
    assert.match(DRAIN_TIE.prompt, /drained/);
  });

  it("asks which feels more you on a normal two-way tie", () => {
    const scores = {
      ...emptyPetScores(),
      "night-owl": 5,
      "social-sprint": 5,
      "steady-marathon": 1,
    };
    const outcome = petQuizOutcome(scores);
    assert.equal(outcome.kind, "tie");
    assert.deepEqual(leadingStyles(scores), ["night-owl", "social-sprint"]);
  });
});
