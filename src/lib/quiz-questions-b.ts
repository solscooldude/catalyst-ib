import type { SubjectId } from "@/lib/constants";
import type { IbLevel } from "@/lib/ib";

export type QuizItem = {
  id: string;
  course: string;
  subjectId: SubjectId;
  levels: IbLevel[];
  topic: string;
  prompt: string;
  choices: [string, string, string];
  answer: 0 | 1 | 2;
};

const BOTH: IbLevel[] = ["HL", "SL"];
const HL: IbLevel[] = ["HL"];
const SL: IbLevel[] = ["SL"];

function q(
  id: string,
  course: string,
  subjectId: SubjectId,
  levels: IbLevel[],
  topic: string,
  prompt: string,
  choices: [string, string, string],
  answer: 0 | 1 | 2,
): QuizItem {
  return { id, course, subjectId, levels, topic, prompt, choices, answer };
}

export const QUIZ_BANK_B: QuizItem[] = [
  q("gp-power", "global-politics", "history", BOTH, "Power", "In global politics, hard power typically relies on…", ["Attraction and values only", "Coercion such as force or economic pressure", "Private diaries"], 1),
  q("gp-actor", "global-politics", "history", BOTH, "Actors", "A non-state actor might be…", ["Only a ministry", "An NGO, corporation, or armed group", "A continent"], 1),
  q("gp-hl-theory", "global-politics", "history", HL, "Theories", "Realism in global politics tends to emphasize…", ["Absolute harmony", "States, power, and self-help", "Culture only"], 1),

  q("ds-data", "digital-societies", "digital-societies", BOTH, "Data", "In digital societies, data becomes powerful when it is…", ["Collected, classified, and used to decide", "Stored offline only", "Never shared"], 0),
  q("ds-algo", "digital-societies", "digital-societies", BOTH, "Algorithms", "An algorithm can be political because it…", ["Is always neutral math", "Ranks, filters, and can amplify some voices", "Cannot use data"], 1),
  q("ds-hl-inquiry", "digital-societies", "digital-societies", HL, "Inquiry", "An HL inquiry is stronger when a real digital case…", ["Is described once", "Is used to test a concept such as agency or equity", "Replaces the concept"], 1),

  q("phil-claim", "philosophy", "history", BOTH, "Argument", "A philosophical argument needs…", ["A celebrity quote", "Reasons that support a conclusion", "A long story only"], 1),
  q("phil-counter", "philosophy", "history", BOTH, "Evaluation", "A counter-argument is useful when you…", ["Ignore it", "State it fairly and test your claim against it", "Use it as the title"], 1),
  q("phil-hl-text", "philosophy", "history", HL, "Texts", "HL work with a prescribed text should…", ["Paraphrase the whole book", "Use the text to think through a live philosophical problem", "Avoid the author’s terms"], 1),

  q("bio-mito", "biology", "biology", BOTH, "Cell biology", "Which organelle is the main site of aerobic respiration in eukaryotes?", ["Chloroplast", "Mitochondrion", "Ribosome"], 1),
  q("bio-membrane", "biology", "biology", BOTH, "Membranes", "In the fluid mosaic model, membrane proteins are…", ["A solid crust on the outside only", "Embedded in a phospholipid bilayer", "Made of cellulose"], 1),
  q("bio-osmosis", "biology", "biology", BOTH, "Transport", "Osmosis is best described as net water movement…", ["Against a water potential gradient through a pump only", "Down a water potential gradient across a partially permeable membrane", "Of solute through the nucleus"], 1),
  q("bio-enzyme", "biology", "biology", BOTH, "Enzymes", "Raising temperature far above an enzyme’s optimum typically…", ["Locks the substrate forever", "Denatures the protein and collapses activity", "Creates new active sites"], 1),
  q("bio-species", "biology", "biology", BOTH, "Ecology", "The biological species concept groups organisms that…", ["Look identical", "Can interbreed to produce fertile offspring", "Share a habitat only"], 1),
  q("bio-control", "biology", "biology", BOTH, "IA method", "A control in a biology investigation is there to…", ["Make the graph taller", "Provide a comparison so you can judge the treatment", "Replace repeats"], 1),
  q("bio-hl-calvin", "biology", "biology", HL, "Photosynthesis", "In the Calvin cycle, carbon fixation is catalyzed by…", ["ATP synthase", "Rubisco", "Helicase"], 1),
  q("bio-hl-meiosis", "biology", "biology", HL, "Genetics", "Crossing over during meiosis mainly increases…", ["Cell size", "Genetic variation among gametes", "The number of autosomes"], 1),

  q("chem-ph", "chemistry", "chemistry", BOTH, "Acids", "An aqueous solution with pH 3 is…", ["Acidic", "Neutral", "Basic"], 0),
  q("chem-mole", "chemistry", "chemistry", BOTH, "Stoichiometry", "One mole of particles is…", ["12 grams of anything", "Avogadro’s number of those particles", "One liter of solution"], 1),
  q("chem-bond", "chemistry", "chemistry", BOTH, "Bonding", "A covalent bond is best described as…", ["Transfer of electrons to make ions", "A shared pair of electrons", "A metallic lattice only"], 1),
  q("chem-endo", "chemistry", "chemistry", BOTH, "Energetics", "An endothermic change…", ["Releases heat to the surroundings", "Absorbs heat from the surroundings", "Has no enthalpy change"], 1),
  q("chem-eq", "chemistry", "chemistry", BOTH, "Equilibrium", "A dynamic equilibrium means…", ["All reaction has stopped", "Forward and reverse rates are equal and both still happen", "The yield is 100%"], 1),
  q("chem-hl-rds", "chemistry", "chemistry", HL, "Kinetics", "The rate-determining step is…", ["The fastest elementary step", "The slowest step that limits the overall rate", "Any step that makes a catalyst"], 1),

  q("phys-acc", "physics", "physics", BOTH, "Mechanics", "Acceleration is the rate of change of…", ["Mass", "Velocity", "Distance"], 1),
  q("phys-energy", "physics", "physics", BOTH, "Energy", "A closed system’s total energy is…", ["Always zero", "Conserved, though it can change form", "Equal to temperature"], 1),
  q("phys-wave", "physics", "physics", BOTH, "Waves", "Frequency of a wave is…", ["Distance between crests", "Oscillations per unit time", "Wave speed divided by amplitude"], 1),
  q("phys-field", "physics", "physics", BOTH, "Fields", "A gravitational field strength at a point is…", ["Mass times velocity", "Force per unit mass on a small test mass", "Energy per coulomb"], 1),
  q("phys-uncertain", "physics", "physics", BOTH, "Practical", "A random uncertainty is reduced most clearly by…", ["Changing the hypothesis", "Repeating and using an appropriate average", "Using a thicker pen"], 1),
  q("phys-hl-shmc", "physics", "physics", HL, "SHM", "In simple harmonic motion, acceleration is…", ["Constant", "Proportional to displacement and toward equilibrium", "Proportional to mass only"], 1),

  q("cs-loop", "cs", "cs", BOTH, "Programming", "A loop that never meets its exit condition is…", ["A compiler", "An infinite loop", "A stack"], 1),
  q("cs-array", "cs", "cs", BOTH, "Data structures", "An array is most useful when you need…", ["An unordered unique set only", "Indexed storage of items of one type", "A network protocol"], 1),
  q("cs-binary", "cs", "cs", BOTH, "Representation", "Binary is used in computers because…", ["Humans prefer base 2", "Two stable states map cleanly onto hardware", "It cannot represent zero"], 1),
  q("cs-ethics", "cs", "cs", BOTH, "Social issues", "Collecting extra personal data “just in case” mainly raises…", ["Faster compile times", "Privacy and consent issues", "Bigger cache size"], 1),
  q("cs-hl-abstract", "cs", "cs", HL, "Abstract data", "An abstract data type specifies…", ["The exact machine code", "Behavior and operations, not one concrete layout", "The brand of laptop"], 1),

  q("ess-system", "ess", "biology", BOTH, "Systems", "In ESS, a system is usefully described by…", ["A single number", "Storages, flows, and boundaries", "Only species names"], 1),
  q("ess-sustain", "ess", "biology", BOTH, "Sustainability", "A sustainable practice is one that…", ["Maximizes this year’s profit only", "Can continue without collapsing the supporting system", "Ignores feedback"], 1),
  q("ess-model", "ess", "biology", BOTH, "Models", "An environmental model is limited because it…", ["Cannot use units", "Simplifies a more complex reality", "Is never quantitative"], 1),

  q("sehs-energy", "sehs", "cas", BOTH, "Exercise physiology", "ATP is important in muscle work because it…", ["Stores oxygen in bone", "Provides an immediate energy currency", "Is a vitamin"], 1),
  q("sehs-skill", "sehs", "cas", BOTH, "Skill", "A closed skill is typically performed…", ["In a stable, predictable environment", "Only in teams", "Without any feedback"], 0),
  q("sehs-hl-train", "sehs", "cas", HL, "Training", "Periodization in training is mainly about…", ["Random daily variety", "Planned cycles of load and recovery", "Eating sugar before every session"], 1),

  q("dt-brief", "design-tech", "cs", BOTH, "Design process", "A design brief should capture…", ["The final CAD file only", "The problem, constraints, and user need", "The shop’s Wi-Fi password"], 1),
  q("dt-user", "design-tech", "cs", BOTH, "User research", "Testing a prototype with real users is meant to…", ["Prove the first idea is perfect", "Reveal mismatches between intent and use", "Replace a specification"], 1),
  q("dt-hl-sustain", "design-tech", "cs", HL, "Sustainability", "A life-cycle analysis looks at impacts…", ["At the point of sale only", "From materials through use and disposal", "Only in the logo"], 1),

  q("maa-deriv", "math-aa", "math-aa", BOTH, "Calculus", "The derivative of x² is…", ["x", "2x", "2"], 1),
  q("maa-integral", "math-aa", "math-aa", BOTH, "Calculus", "An antiderivative of 2x is…", ["2", "x² + C", "2x² + C"], 1),
  q("maa-function", "math-aa", "math-aa", BOTH, "Functions", "The range of a function is…", ["The set of allowed inputs", "The set of outputs the function actually takes", "The slope"], 1),
  q("maa-log", "math-aa", "math-aa", BOTH, "Exponents", "log₁₀(100) equals…", ["2", "10", "100"], 0),
  q("maa-triangle", "math-aa", "math-aa", BOTH, "Trigonometry", "In a right triangle, sin θ is…", ["Adjacent / hypotenuse", "Opposite / hypotenuse", "Opposite / adjacent"], 1),
  q("maa-seq", "math-aa", "math-aa", BOTH, "Sequences", "In an arithmetic sequence, consecutive terms differ by…", ["A constant ratio", "A constant difference", "A factorial"], 1),
  q("maa-hl-complex", "math-aa", "math-aa", HL, "Complex numbers", "The modulus of a + bi is…", ["a + b", "√(a² + b²)", "a − b"], 1),
  q("maa-hl-parts", "math-aa", "math-aa", HL, "Integration", "Integration by parts is the integral analogue of…", ["The chain rule", "The product rule", "Completing the square"], 1),

  q("mai-model", "math-ai", "math-aa", BOTH, "Modelling", "A mathematical model is useful when it…", ["Copies every detail of reality", "Captures the features that matter for a decision", "Avoids units"], 1),
  q("mai-mean", "math-ai", "math-aa", BOTH, "Statistics", "The mean of a data set is most pulled by…", ["The median", "Extreme outliers", "The mode only"], 1),
  q("mai-prob", "math-ai", "math-aa", BOTH, "Probability", "If A and B are mutually exclusive, P(A and B) is…", ["P(A) + P(B)", "0", "1"], 1),
  q("mai-percent", "math-ai", "math-aa", BOTH, "Number", "A 20% increase followed by a 20% decrease…", ["Returns the original value", "Ends below the original value", "Ends above the original value"], 1),
  q("mai-scatter", "math-ai", "math-aa", BOTH, "Bivariate", "A strong correlation on a scatter graph…", ["Proves causation", "Shows association, not automatically cause", "Means the line must pass through the origin"], 1),
  q("mai-hl-calc", "math-ai", "math-aa", HL, "Calculus", "In context, a derivative often represents…", ["A total", "An instantaneous rate of change", "A sample size"], 1),

  q("va-intent", "visual-arts", "visual-arts", BOTH, "Process", "In Visual Arts, a process portfolio should show…", ["Only finished pieces", "Experiment, decision, and development", "A shopping list"], 1),
  q("va-compare", "visual-arts", "visual-arts", BOTH, "Comparative", "A comparative study is stronger when you…", ["Describe two works and stop", "Use comparison to make a claim about meaning or method", "Copy a museum label"], 1),
  q("va-form", "visual-arts", "visual-arts", BOTH, "Formal analysis", "Talking about composition, color, and material is useful when it…", ["Stays a checklist", "Supports an interpretation", "Replaces the artwork"], 1),
  q("va-hl-curate", "visual-arts", "visual-arts", HL, "Exhibition", "HL exhibition text should help a viewer see…", ["Your grades", "How the works speak as a curated set", "The price of materials"], 1),

  q("mus-element", "music", "music", BOTH, "Elements", "Pitch, duration, timbre, and texture are…", ["Only pop-song slang", "Musical elements you can hear and discuss", "Software brands"], 1),
  q("mus-context", "music", "music", BOTH, "Context", "Context in music analysis is strongest when it…", ["Replaces listening", "Helps explain why a choice might matter", "Is a copied biography"], 1),
  q("mus-hl-create", "music", "music", HL, "Creating", "An HL creating task is more convincing when sketches show…", ["A single first take", "How material was tried, refused, and shaped", "The DAW preset name only"], 1),

  q("the-action", "theatre", "visual-arts", BOTH, "Performance", "In theatre, an action is usefully described as…", ["A costume color", "What a character does to affect another", "The ticket price"], 1),
  q("the-space", "theatre", "visual-arts", BOTH, "Staging", "Proxemics refers to…", ["Microphone gain", "How distance and placement make meaning", "Interval length"], 1),
  q("the-hl-research", "theatre", "visual-arts", HL, "Research", "HL theatre research should connect…", ["A theory to a practical choice you can show", "A poster to a font", "A review score to the cast list"], 0),

  q("film-shot", "film", "visual-arts", BOTH, "Language", "A close-up is often used to…", ["Show a city skyline", "Direct attention to a face or detail", "Replace sound"], 1),
  q("film-edit", "film", "visual-arts", BOTH, "Editing", "A cut on action can…", ["Hide continuity and keep momentum", "Add opening credits", "Change the aspect ratio"], 0),
  q("film-hl-theory", "film", "visual-arts", HL, "Theory", "HL film theory is most useful when it…", ["Is quoted and dropped", "Gives you a lens for a specific sequence", "Renames the director"], 1),

  q("dance-motif", "dance", "visual-arts", BOTH, "Choreography", "A motif in dance is…", ["The ticket stub", "A movement idea that can be developed", "The speaker volume"], 1),
  q("dance-structure", "dance", "visual-arts", BOTH, "Structure", "ABA structure in a dance typically means…", ["No repetition", "A theme, a contrast, and a return", "Three identical phrases"], 1),
];
