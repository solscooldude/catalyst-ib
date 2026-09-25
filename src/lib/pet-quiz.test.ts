import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AXOLOTL_DRAGON_TIE,
  emptyPetScores,
  leadingSpecies,
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
        assert.equal(option.text.includes(option.species), false);
        assert.match(option.text, /\S/);
      }
    }
  });

  it("maps the locked A–D animals on question 1 and 13", () => {
    assert.deepEqual(
      PET_QUIZ[0]?.options.map((row) => row.species),
      ["fox", "bunny", "deer", "cat"],
    );
    assert.deepEqual(
      PET_QUIZ[12]?.options.map((row) => row.species),
      ["fox", "bunny", "deer", "dragon"],
    );
  });

  it("scores a clean Fox win", () => {
    let scores = emptyPetScores();
    const foxPicks = [0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0];
    foxPicks.forEach((option, index) => {
      scores = scorePetAnswer(scores, index, option);
    });
    assert.equal(petQuizOutcome(scores).kind, "winner");
    assert.deepEqual(petQuizOutcome(scores).species, ["fox"]);
  });

  it("uses the Axolotl / Dragon drain prompt when those two tie", () => {
    let scores = emptyPetScores();
    scores = { ...scores, axolotl: 4, dragon: 4, fox: 2 };
    const outcome = petQuizOutcome(scores);
    assert.equal(outcome.kind, "axolotl-dragon");
    assert.deepEqual(outcome.species, ["axolotl", "dragon"]);
    assert.match(AXOLOTL_DRAGON_TIE.prompt, /drained/);
  });

  it("asks which feels more you on a normal two-way tie", () => {
    const scores = { ...emptyPetScores(), fox: 5, bunny: 5, deer: 1 };
    const outcome = petQuizOutcome(scores);
    assert.equal(outcome.kind, "tie");
    assert.deepEqual(leadingSpecies(scores), ["fox", "bunny"]);
  });
});
