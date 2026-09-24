export const PET_SPECIES = [
  "fox",
  "bunny",
  "deer",
  "cat",
  "axolotl",
  "dragon",
] as const;

export type PetSpeciesId = (typeof PET_SPECIES)[number];

export const PET_QUIZ_LETTERS = ["A", "B", "C", "D"] as const;

export type PetQuizOption = {
  letter: (typeof PET_QUIZ_LETTERS)[number];
  text: string;
  species: PetSpeciesId;
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
        species: "fox",
      },
      {
        letter: "B",
        text: "Text someone to work on it together so it feels less heavy",
        species: "bunny",
      },
      {
        letter: "C",
        text: "Block time on your calendar and chip away a bit each day",
        species: "deer",
      },
      {
        letter: "D",
        text: "Put your phone away and disappear until it’s done",
        species: "cat",
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
        species: "axolotl",
      },
      {
        letter: "B",
        text: "Wherever the energy is — loud playlist, big desk, full send",
        species: "dragon",
      },
      {
        letter: "C",
        text: "It changes; you follow whatever feels productive that day",
        species: "fox",
      },
      {
        letter: "D",
        text: "A shared space — library, café, call with a friend on mute",
        species: "bunny",
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
        species: "deer",
      },
      {
        letter: "B",
        text: "Short and straight — no sugarcoating",
        species: "cat",
      },
      {
        letter: "C",
        text: "Kind first, then the note — you shut down if it’s harsh",
        species: "axolotl",
      },
      {
        letter: "D",
        text: "Something that lights a competitive spark",
        species: "dragon",
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
        species: "fox",
      },
      {
        letter: "B",
        text: "Keep the same rhythm; rushing makes it worse",
        species: "deer",
      },
      {
        letter: "C",
        text: "Take a short break, snack/water, then ease back in",
        species: "bunny",
      },
      {
        letter: "D",
        text: "Slip into deep focus and only notice the time later",
        species: "axolotl",
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
        species: "cat",
      },
      {
        letter: "B",
        text: "Expressive — colour, posters, a bit of beautiful mess",
        species: "dragon",
      },
      {
        letter: "C",
        text: "Practical — everything you need within reach",
        species: "fox",
      },
      {
        letter: "D",
        text: "Calm — clean surfaces, easy on the eyes",
        species: "deer",
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
        species: "bunny",
      },
      {
        letter: "B",
        text: "Is fine if nobody’s chatting at you — parallel quiet",
        species: "cat",
      },
      {
        letter: "C",
        text: "Is better as a friendly push (“who finishes the set first?”)",
        species: "dragon",
      },
      {
        letter: "D",
        text: "Is something you do when a friend’s stressed and needs company",
        species: "axolotl",
      },
    ],
  },
  {
    id: "hard-weeks",
    prompt: "Which sounds most like how you get through hard weeks?",
    options: [
      { letter: "A", text: "“There’s a smarter way through this.”", species: "fox" },
      { letter: "B", text: "“I don’t have to do it alone.”", species: "bunny" },
      {
        letter: "C",
        text: "“Showing up a little every day is enough.”",
        species: "deer",
      },
      {
        letter: "D",
        text: "“Protect my focus. Everything else can wait.”",
        species: "cat",
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
        species: "fox",
      },
      {
        letter: "B",
        text: "A bit nervous, but better if you’ve got plans with people",
        species: "bunny",
      },
      { letter: "C", text: "Fine if the week is mapped out", species: "deer" },
      {
        letter: "D",
        text: "Prefer not to think about it until you have to",
        species: "cat",
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
        species: "fox",
      },
      { letter: "B", text: "The task feels lonely and heavy", species: "bunny" },
      {
        letter: "C",
        text: "You underestimated how long the early steps take",
        species: "deer",
      },
      {
        letter: "D",
        text: "You’re protecting your energy / overstimulated",
        species: "axolotl",
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
        species: "deer",
      },
      {
        letter: "B",
        text: "Want the next challenge immediately",
        species: "dragon",
      },
      {
        letter: "C",
        text: "Feel warm if it was a group win you shared",
        species: "bunny",
      },
      {
        letter: "D",
        text: "Shrug — praise doesn’t move you much either way",
        species: "cat",
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
        species: "fox",
      },
      {
        letter: "B",
        text: "Feel pulled to reply so nobody’s left hanging",
        species: "bunny",
      },
      {
        letter: "C",
        text: "Finish your block first; messages can wait",
        species: "deer",
      },
      {
        letter: "D",
        text: "Get annoyed; interruptions break the spell",
        species: "cat",
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
        species: "axolotl",
      },
      {
        letter: "B",
        text: "Doing something intense so the day doesn’t “win”",
        species: "dragon",
      },
      {
        letter: "C",
        text: "Talking it out with someone you trust",
        species: "bunny",
      },
      {
        letter: "D",
        text: "Alone time with a comfort show / game",
        species: "cat",
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
        species: "fox",
      },
      { letter: "B", text: "What your friends are also taking", species: "bunny" },
      {
        letter: "C",
        text: "What you can sustain without burning out",
        species: "deer",
      },
      {
        letter: "D",
        text: "What you’re oddly obsessed with, even if it’s extra",
        species: "dragon",
      },
    ],
  },
];

export type PetQuizScores = Record<PetSpeciesId, number>;

export function emptyPetScores(): PetQuizScores {
  return {
    fox: 0,
    bunny: 0,
    deer: 0,
    cat: 0,
    axolotl: 0,
    dragon: 0,
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
  return { ...scores, [option.species]: scores[option.species] + 1 };
}

export function leadingSpecies(scores: PetQuizScores): PetSpeciesId[] {
  const max = Math.max(...PET_SPECIES.map((id) => scores[id]));
  return PET_SPECIES.filter((id) => scores[id] === max && max > 0);
}

export function petQuizOutcome(scores: PetQuizScores): {
  kind: "winner" | "tie" | "axolotl-dragon";
  species: PetSpeciesId[];
} {
  const leaders = leadingSpecies(scores);
  if (leaders.length <= 1) {
    return { kind: "winner", species: leaders[0] ? [leaders[0]] : ["fox"] };
  }
  const pair = new Set(leaders);
  if (pair.size === 2 && pair.has("axolotl") && pair.has("dragon")) {
    return { kind: "axolotl-dragon", species: ["axolotl", "dragon"] };
  }
  return { kind: "tie", species: leaders.slice(0, 2) };
}

export const SPECIES_REVEAL: Record<
  PetSpeciesId,
  { label: string; line: string }
> = {
  fox: {
    label: "Fox",
    line: "You find the smarter path. Plans flex. Energy goes where it counts.",
  },
  bunny: {
    label: "Bunny",
    line: "Hard work feels lighter with people. You pull others in and keep going.",
  },
  deer: {
    label: "Deer",
    line: "You show up a little every day. Calm structure beats a scramble.",
  },
  cat: {
    label: "Cat",
    line: "Focus is the point. You protect the block and let the rest wait.",
  },
  axolotl: {
    label: "Axolotl",
    line: "You recover soft, then sink deep. Kindness first, then the work.",
  },
  dragon: {
    label: "Dragon",
    line: "You want the spark. Intensity, a challenge, and a reason to push.",
  },
};

export const AXOLOTL_DRAGON_TIE = {
  prompt: "When you’re drained, soft recover or push with intensity?",
  options: [
    { species: "axolotl" as const, label: "Soft recover" },
    { species: "dragon" as const, label: "Push with intensity" },
  ],
};

export const GENERIC_TIE_PROMPT = "Which feels more you?";
