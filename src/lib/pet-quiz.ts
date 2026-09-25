import {
  STUDY_STYLE_RESULTS,
  STUDY_STYLES,
  type StudyStyleId,
} from "./study-style.ts";

export const PET_SPECIES = STUDY_STYLES;
export type PetSpeciesId = StudyStyleId;

export const PET_QUIZ_LETTERS = ["A", "B", "C", "D"] as const;

export type PetQuizOption = {
  letter: (typeof PET_QUIZ_LETTERS)[number];
  text: string;
  style: StudyStyleId;
};

export type PetQuizQuestion = {
  id: string;
  prompt: string;
  options: [PetQuizOption, PetQuizOption, PetQuizOption, PetQuizOption];
};

export const PET_QUIZ: PetQuizQuestion[] = [
  {
    id: "deadline",
    prompt: "A big deadline is a week away. What’s your usual move?",
    options: [
      {
        letter: "A",
        text: "Sketch a plan, cut corners that don’t matter, save energy for the hard parts",
        style: "night-owl",
      },
      {
        letter: "B",
        text: "Text someone to work on it together so it feels less heavy",
        style: "social-sprint",
      },
      {
        letter: "C",
        text: "Block time on your calendar and chip away a bit each day",
        style: "steady-marathon",
      },
      {
        letter: "D",
        text: "Put your phone away and disappear until it’s done",
        style: "deep-dive",
      },
    ],
  },
  {
    id: "where",
    prompt: "Where do you actually get work done?",
    options: [
      {
        letter: "A",
        text: "Somewhere soft and low-stakes — bed, couch, quiet corner",
        style: "calm-plan",
      },
      {
        letter: "B",
        text: "Wherever the energy is — loud playlist, big desk, full send",
        style: "bold-challenge",
      },
      {
        letter: "C",
        text: "It changes; you follow whatever feels productive that day",
        style: "night-owl",
      },
      {
        letter: "D",
        text: "A shared space — library, café, call with a friend on mute",
        style: "social-sprint",
      },
    ],
  },
  {
    id: "feedback",
    prompt: "When someone gives you feedback, what lands best?",
    options: [
      {
        letter: "A",
        text: "Calm, specific, “here’s what to fix next”",
        style: "steady-marathon",
      },
      {
        letter: "B",
        text: "Short and straight — no sugarcoating",
        style: "deep-dive",
      },
      {
        letter: "C",
        text: "Kind first, then the note — you shut down if it’s harsh",
        style: "calm-plan",
      },
      {
        letter: "D",
        text: "Something that lights a competitive spark",
        style: "bold-challenge",
      },
    ],
  },
  {
    id: "midblock",
    prompt: "Halfway through a long study block you usually…",
    options: [
      {
        letter: "A",
        text: "Change approach if you’re stuck (new notes style, new order)",
        style: "night-owl",
      },
      {
        letter: "B",
        text: "Keep the same rhythm; rushing makes it worse",
        style: "steady-marathon",
      },
      {
        letter: "C",
        text: "Take a short break, snack/water, then ease back in",
        style: "social-sprint",
      },
      {
        letter: "D",
        text: "Slip into deep focus and only notice the time later",
        style: "calm-plan",
      },
    ],
  },
  {
    id: "space",
    prompt: "Your space says what about you?",
    options: [
      {
        letter: "A",
        text: "Intentional — a few things you like, nothing random",
        style: "deep-dive",
      },
      {
        letter: "B",
        text: "Expressive — colour, posters, a bit of beautiful mess",
        style: "bold-challenge",
      },
      {
        letter: "C",
        text: "Practical — everything you need within reach",
        style: "night-owl",
      },
      {
        letter: "D",
        text: "Calm — clean surfaces, easy on the eyes",
        style: "steady-marathon",
      },
    ],
  },
  {
    id: "others",
    prompt: "Studying with other people…",
    options: [
      {
        letter: "A",
        text: "Helps — you like the company even if you’re on different subjects",
        style: "social-sprint",
      },
      {
        letter: "B",
        text: "Is fine if nobody’s chatting at you — parallel quiet",
        style: "deep-dive",
      },
      {
        letter: "C",
        text: "Is better as a friendly push (“who finishes the set first?”)",
        style: "bold-challenge",
      },
      {
        letter: "D",
        text: "Is something you do when a friend’s stressed and needs company",
        style: "calm-plan",
      },
    ],
  },
  {
    id: "hard-weeks",
    prompt: "Which sounds most like how you get through hard weeks?",
    options: [
      { letter: "A", text: "“There’s a smarter way through this.”", style: "night-owl" },
      { letter: "B", text: "“I don’t have to do it alone.”", style: "social-sprint" },
      {
        letter: "C",
        text: "“Showing up a little every day is enough.”",
        style: "steady-marathon",
      },
      {
        letter: "D",
        text: "“Protect my focus. Everything else can wait.”",
        style: "deep-dive",
      },
    ],
  },
  {
    id: "sunday",
    prompt: "It’s Sunday night. How do you feel about the week ahead?",
    options: [
      {
        letter: "A",
        text: "Already rearranging tasks so Monday isn’t brutal",
        style: "night-owl",
      },
      {
        letter: "B",
        text: "A bit nervous, but better if you’ve got plans with people",
        style: "social-sprint",
      },
      { letter: "C", text: "Fine if the week is mapped out", style: "steady-marathon" },
      {
        letter: "D",
        text: "Prefer not to think about it until you have to",
        style: "deep-dive",
      },
    ],
  },
  {
    id: "procrastinate",
    prompt: "When you procrastinate, it’s usually because…",
    options: [
      {
        letter: "A",
        text: "You’re waiting for the “right” mood or method",
        style: "night-owl",
      },
      { letter: "B", text: "The task feels lonely and heavy", style: "social-sprint" },
      {
        letter: "C",
        text: "You underestimated how long the early steps take",
        style: "steady-marathon",
      },
      {
        letter: "D",
        text: "You’re protecting your energy / overstimulated",
        style: "calm-plan",
      },
    ],
  },
  {
    id: "praise",
    prompt: "A teacher praises the class. You…",
    options: [
      {
        letter: "A",
        text: "Feel quietly proud and file it away",
        style: "steady-marathon",
      },
      {
        letter: "B",
        text: "Want the next challenge immediately",
        style: "bold-challenge",
      },
      {
        letter: "C",
        text: "Feel warm if it was a group win you shared",
        style: "social-sprint",
      },
      {
        letter: "D",
        text: "Shrug — praise doesn’t move you much either way",
        style: "deep-dive",
      },
    ],
  },
  {
    id: "phone",
    prompt: "Your phone buzzes mid-focus. You…",
    options: [
      {
        letter: "A",
        text: "Check if it’s useful, then adapt",
        style: "night-owl",
      },
      {
        letter: "B",
        text: "Feel pulled to reply so nobody’s left hanging",
        style: "social-sprint",
      },
      {
        letter: "C",
        text: "Finish your block first; messages can wait",
        style: "steady-marathon",
      },
      {
        letter: "D",
        text: "Get annoyed; interruptions break the spell",
        style: "deep-dive",
      },
    ],
  },
  {
    id: "recovery",
    prompt: "After a rough day, recovery looks like…",
    options: [
      {
        letter: "A",
        text: "Soft reset — shower, snack, low lights",
        style: "calm-plan",
      },
      {
        letter: "B",
        text: "Doing something intense so the day doesn’t “win”",
        style: "bold-challenge",
      },
      {
        letter: "C",
        text: "Talking it out with someone you trust",
        style: "social-sprint",
      },
      {
        letter: "D",
        text: "Alone time with a comfort show / game",
        style: "deep-dive",
      },
    ],
  },
  {
    id: "elective",
    prompt: "You’re picking an elective. You lean toward…",
    options: [
      {
        letter: "A",
        text: "Whatever opens the most doors later",
        style: "night-owl",
      },
      { letter: "B", text: "What your friends are also taking", style: "social-sprint" },
      {
        letter: "C",
        text: "What you can sustain without burning out",
        style: "steady-marathon",
      },
      {
        letter: "D",
        text: "What you’re oddly obsessed with, even if it’s extra",
        style: "bold-challenge",
      },
    ],
  },
];

export type PetQuizScores = Record<StudyStyleId, number>;

export function emptyPetScores(): PetQuizScores {
  return {
    "night-owl": 0,
    "social-sprint": 0,
    "steady-marathon": 0,
    "deep-dive": 0,
    "calm-plan": 0,
    "bold-challenge": 0,
  };
}

export function scorePetAnswer(
  scores: PetQuizScores,
  questionIndex: number,
  optionIndex: number,
): PetQuizScores {
  const question = PET_QUIZ[questionIndex];
  const option = question?.options[optionIndex];
  if (!option) return scores;
  return { ...scores, [option.style]: scores[option.style] + 1 };
}

export function leadingStyles(scores: PetQuizScores): StudyStyleId[] {
  const max = Math.max(...STUDY_STYLES.map((id) => scores[id]));
  return STUDY_STYLES.filter((id) => scores[id] === max && max > 0);
}

export function petQuizOutcome(scores: PetQuizScores): {
  kind: "winner" | "tie" | "drain-tie";
  styles: StudyStyleId[];
} {
  const leaders = leadingStyles(scores);
  if (leaders.length <= 1) {
    return {
      kind: "winner",
      styles: leaders[0] ? [leaders[0]] : ["night-owl"],
    };
  }
  const pair = new Set(leaders);
  if (pair.size === 2 && pair.has("calm-plan") && pair.has("bold-challenge")) {
    return { kind: "drain-tie", styles: ["calm-plan", "bold-challenge"] };
  }
  return { kind: "tie", styles: leaders.slice(0, 2) };
}

export const STYLE_REVEAL = STUDY_STYLE_RESULTS;

export const DRAIN_TIE = {
  prompt: "When you’re drained, soft recover or push with intensity?",
  options: [
    { style: "calm-plan" as const, label: "Soft recover" },
    { style: "bold-challenge" as const, label: "Push with intensity" },
  ],
};

export const GENERIC_TIE_PROMPT = "Which feels more you?";
