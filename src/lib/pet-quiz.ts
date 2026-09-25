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
    id: "nine-pm",
    prompt: "It's 9pm and you've got a test tomorrow. What are you actually doing?",
    options: [
      {
        letter: "A",
        text: "Making a last-minute plan so the hard bits get the time left",
        style: "night-owl",
      },
      {
        letter: "B",
        text: "Texting someone to cram together so it feels less doomed",
        style: "social-sprint",
      },
      {
        letter: "C",
        text: "Skimming the notes I already made this week, then sleeping",
        style: "steady-marathon",
      },
      {
        letter: "D",
        text: "Phone in another room. I'm disappearing until I get it",
        style: "deep-dive",
      },
    ],
  },
  {
    id: "study-together",
    prompt: "Your friend asks to study together. Your honest first thought?",
    options: [
      {
        letter: "A",
        text: "Only if we actually race the worksheet and not just talk",
        style: "bold-challenge",
      },
      {
        letter: "B",
        text: "Please. I was hoping someone would ask",
        style: "social-sprint",
      },
      {
        letter: "C",
        text: "Fine if we sit quietly and do our own stuff",
        style: "calm-plan",
      },
      {
        letter: "D",
        text: "I'd rather do it alone. I can help them after",
        style: "deep-dive",
      },
    ],
  },
  {
    id: "laptop-open",
    prompt: "You open your laptop to start homework. What happens in the next 10 minutes?",
    options: [
      {
        letter: "A",
        text: "I rearrange tabs, pick a playlist, then actually start",
        style: "night-owl",
      },
      {
        letter: "B",
        text: "I message someone \"are you doing this too\"",
        style: "social-sprint",
      },
      {
        letter: "C",
        text: "I open the doc and just start the first easy part",
        style: "steady-marathon",
      },
      {
        letter: "D",
        text: "I stare for a second, then I'm 40 minutes in without noticing",
        style: "deep-dive",
      },
    ],
  },
  {
    id: "huge-project",
    prompt: "A teacher dumps a huge project on Friday. You…",
    options: [
      {
        letter: "A",
        text: "Treat it like a dare and try to knock out a chunk tonight",
        style: "bold-challenge",
      },
      {
        letter: "B",
        text: "Write the due date down and split it across the week",
        style: "calm-plan",
      },
      {
        letter: "C",
        text: "Do 20 minutes now so Monday isn't a wall",
        style: "steady-marathon",
      },
      {
        letter: "D",
        text: "Ignore it until the night I actually have energy for it",
        style: "night-owl",
      },
    ],
  },
  {
    id: "stuck",
    prompt: "You're stuck on a question and the answer isn't coming. What do you actually do?",
    options: [
      {
        letter: "A",
        text: "Skip it, change the order, come back when my brain unsticks",
        style: "night-owl",
      },
      {
        letter: "B",
        text: "Do the next three easy ones so I don't lose the day",
        style: "steady-marathon",
      },
      {
        letter: "C",
        text: "Close the laptop, snack, come back when I'm less fried",
        style: "calm-plan",
      },
      {
        letter: "D",
        text: "Refuse to lose. I stay until it clicks",
        style: "bold-challenge",
      },
    ],
  },
  {
    id: "sunday-night",
    prompt: "It's Sunday night. How does the week look from here?",
    options: [
      {
        letter: "A",
        text: "I'll figure Monday out when Monday starts",
        style: "night-owl",
      },
      {
        letter: "B",
        text: "Better if I've already got a call or library plan with someone",
        style: "social-sprint",
      },
      {
        letter: "C",
        text: "Fine if the assignments are already on a list",
        style: "steady-marathon",
      },
      {
        letter: "D",
        text: "I already moved the heavy stuff off Monday morning",
        style: "calm-plan",
      },
    ],
  },
  {
    id: "free-period",
    prompt: "You've got a free period. What are you actually doing with it?",
    options: [
      {
        letter: "A",
        text: "Turn it into a timed sprint so it counts",
        style: "bold-challenge",
      },
      {
        letter: "B",
        text: "Sit with whoever's around and half-work, half-talk",
        style: "social-sprint",
      },
      {
        letter: "C",
        text: "Use it for the boring admin so tonight stays lighter",
        style: "calm-plan",
      },
      {
        letter: "D",
        text: "Find a quiet corner and actually finish one thing",
        style: "deep-dive",
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
      styles: leaders[0] ? [leaders[0]] : ["bold-challenge"],
    };
  }
  const pair = new Set(leaders);
  if (pair.size === 2 && pair.has("calm-plan") && pair.has("bold-challenge")) {
    return { kind: "drain-tie", styles: ["calm-plan", "bold-challenge"] };
  }
  return { kind: "tie", styles: leaders.slice(0, 2) };
}

export const DRAIN_TIE = {
  prompt: "When you're drained, recover soft or push through?",
  options: [
    { style: "calm-plan" as const, label: "Recover soft" },
    { style: "bold-challenge" as const, label: "Push through" },
  ],
};

export const GENERIC_TIE_PROMPT = "Which feels more you?";

export { STUDY_STYLE_RESULTS };
