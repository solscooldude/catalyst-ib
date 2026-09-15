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

export const QUIZ_BANK_A: QuizItem[] = [
  q("tok-claim", "tok", "tok", BOTH, "Knowledge claims", "In TOK, a knowledge claim is best described as…", ["A private feeling", "A statement about knowledge", "A bibliography entry"], 1),
  q("tok-aok", "tok", "tok", BOTH, "Areas of knowledge", "History, the natural sciences, and the arts are examples of…", ["Ways of knowing", "Areas of knowledge", "Knowledge questions"], 1),
  q("tok-kq", "tok", "tok", BOTH, "Knowledge questions", "A strong knowledge question is usually…", ["Answered by one fact", "Open, about knowledge, and contestable", "A yes/no homework check"], 1),
  q("tok-perspective", "tok", "tok", BOTH, "Perspectives", "Considering another perspective in TOK is useful because it…", ["Proves your claim automatically", "Tests how far a claim travels", "Replaces evidence"], 1),
  q("tok-evidence", "tok", "tok", BOTH, "Evidence", "In a TOK essay, an example works best when it…", ["Is famous only", "Is used to test a knowledge claim", "Fills word count"], 1),
  q("tok-hl-scope", "tok", "tok", BOTH, "Scope", "A discussion of scope in TOK asks…", ["How many sources you listed", "What a claim can and cannot cover", "Whether the teacher agrees"], 1),
  q("ee-lit", "ee", "ee", BOTH, "Literature review", "An EE literature review should mainly…", ["List titles only", "Put sources into an argument", "Skip citations"], 1),
  q("ee-rq", "ee", "ee", BOTH, "Research question", "A useful EE research question is…", ["A one-word topic", "Focused, researchable, and arguable", "The same as the title of a textbook"], 1),
  q("ee-method", "ee", "ee", BOTH, "Method", "The method section should show…", ["Why the approach can answer the question", "Every app you opened", "The final grade you want"], 0),
  q("ee-cite", "ee", "ee", BOTH, "Academic honesty", "In the EE, a quotation without a citation is…", ["Fine if short", "Academic misconduct", "Allowed in the abstract"], 1),
  q("cas-loop", "cas", "cas", BOTH, "CAS stages", "The CAS learning cycle typically moves through…", ["Investigation, preparation, action, reflection", "Memorize, test, forget", "Watch, like, share"], 0),
  q("cas-evidence", "cas", "cas", BOTH, "Evidence", "CAS evidence is strongest when it…", ["Shows hours only", "Shows what changed because of the activity", "Is a single selfie"], 1),
  q("cas-learning", "cas", "cas", BOTH, "Learning outcomes", "A CAS learning outcome is met when you…", ["Name the outcome in a title", "Show growth with specific evidence", "Copy a friend’s reflection"], 1),
  q("lang-a-thesis", "lang-a", "english", BOTH, "Guiding claim", "In a Language A paper, a thesis should…", ["Retell the plot", "Make a contestable claim about the text", "List every device"], 1),
  q("lang-a-audience", "lang-a", "english", BOTH, "Audience", "Identifying audience helps you explain…", ["Page count", "Why certain choices might land", "The author’s birthday"], 1),
  q("lang-a-feature", "lang-a", "english", BOTH, "Stylistic features", "A stylistic feature is useful in an essay when you…", ["Name it and stop", "Link it to an effect and a larger claim", "Translate it only"], 1),
  q("lang-a-context", "lang-a", "english", BOTH, "Context", "Context is strongest when it…", ["Replaces close reading", "Sharpens how a choice might be read", "Is a copied biography"], 1),
  q("lang-a-hl-compare", "lang-a", "english", HL, "Comparison", "In an HL comparative response, the priority is…", ["Summary of both texts in order", "A claim that both texts can test", "Equal word count per paragraph regardless of idea"], 1),
  q("lang-a-sl-focus", "lang-a", "english", SL, "Focus", "If time is short in a Language A response, keep…", ["Every quote you highlighted", "The guiding claim and a few well-read moments", "A full plot recap"], 1),
  q("lang-b-purpose", "lang-b", "language-b", BOTH, "Text types", "Before writing a Language B text, identify…", ["Purpose, audience, and text type", "Only the word limit", "A random idiom list"], 0),
  q("lang-b-register", "lang-b", "language-b", BOTH, "Register", "Register means…", ["Font size", "How formal or familiar the language is", "The listening speed"], 1),
  q("lang-b-receptive", "lang-b", "language-b", BOTH, "Receptive skills", "A useful first pass on a reading text is to…", ["Translate every word", "Get gist, then return for detail", "Skip the title"], 1),
  q("lang-b-theme", "lang-b", "language-b", BOTH, "Themes", "Identities, experiences, and human ingenuity are…", ["Random vocab lists", "Course themes that organize language use", "Only HL extras"], 1),
  q("lang-b-hl-lit", "lang-b", "language-b", HL, "HL literature", "HL Language B literature work should still…", ["Ignore language features", "Use the text to show meaning and language choices", "Be a plot quiz only"], 1),
  q("lang-ab-basic", "lang-ab", "language-b", SL, "Foundations", "Ab initio writing is stronger when you…", ["Stay in the text type and keep sentences you can control", "Paste a translator paragraph", "Avoid verbs"], 0),
  q("lang-ab-listen", "lang-ab", "language-b", SL, "Listening", "If you miss a word in ab initio listening…", ["Stop the paper", "Use context and the next cues", "Guess a whole new topic"], 1),
  q("lang-ab-culture", "lang-ab", "language-b", SL, "Culture", "A cultural note in ab initio is useful when it…", ["Is a stereotype", "Helps you choose an appropriate phrase", "Replaces grammar"], 1),
  q("latin-case", "latin", "language-b", BOTH, "Morphology", "In Latin, case mainly shows…", ["Tense", "A noun’s role in the sentence", "Meter"], 1),
  q("latin-agree", "latin", "language-b", BOTH, "Agreement", "A Latin adjective usually agrees with its noun in…", ["Person only", "Gender, number, and case", "Tense and mood"], 1),
  q("hist-argue", "history", "history", BOTH, "Essay craft", "A useful history essay always…", ["Names one date", "Uses evidence to argue", "Avoids historians"], 1),
  q("hist-source", "history", "history", BOTH, "Sources", "OPC VL is a way to think about…", ["Only maps", "Origin, purpose, content, value, and limitation", "Your conclusion first"], 1),
  q("hist-cause", "history", "history", BOTH, "Causation", "A causal claim is stronger when you…", ["List events in a line", "Weigh which factors mattered more and why", "Use one statistic"], 1),
  q("hist-perspective", "history", "history", BOTH, "Perspectives", "Two historians can use the same archive and disagree because…", ["Archives have no facts", "Questions, selection, and interpretation differ", "One of them failed"], 1),
  q("hist-hl-depth", "history", "history", HL, "HL depth", "An HL history depth study should emphasize…", ["Coverage of every year equally", "A focused argument with historiography where it earns its keep", "Memorizing names only"], 1),
  q("geo-scale", "geography", "geography", BOTH, "Scale", "In geography, changing scale can change…", ["The planet’s mass", "Which patterns and processes you can see", "The definition of latitude"], 1),
  q("geo-place", "geography", "geography", BOTH, "Place", "Place is more than location because it includes…", ["Only coordinates", "Meaning, connection, and lived experience", "The map title"], 1),
  q("geo-data", "geography", "geography", BOTH, "Data", "A choropleth map is most honest when you…", ["Hide the legend", "Choose classes and a title that match the data", "Use as many colors as possible"], 1),
  q("geo-hl-power", "geography", "geography", HL, "Power", "HL global interactions work often asks how…", ["Capitals are spelled", "Power and networks shape flows of people, money, and ideas", "Rivers flow uphill"], 1),
  q("eco-scarcity", "economics", "economics", BOTH, "Foundations", "Scarcity in economics means…", ["Nothing is produced", "Wants exceed available resources", "Prices are always rising"], 1),
  q("eco-demand", "economics", "economics", BOTH, "Microeconomics", "A movement along a demand curve is caused by…", ["A change in the good’s own price", "A change in income only", "A change in tastes only"], 0),
  q("eco-externality", "economics", "economics", BOTH, "Market failure", "A negative externality of production means…", ["Private cost equals social cost", "Social cost is higher than private cost", "There is no opportunity cost"], 1),
  q("eco-hl-macro", "economics", "economics", HL, "Macroeconomics", "In an AD/AS sketch, a fall in interest rates is usually shown as…", ["A left shift of AD", "A right shift of AD, other things equal", "A pivot of the production possibility curve only"], 1),
  q("bus-stake", "business", "economics", BOTH, "Stakeholders", "A stakeholder is…", ["Only a shareholder", "Anyone affected by the business’s decisions", "The cheapest supplier"], 1),
  q("bus-stp", "business", "economics", BOTH, "Marketing", "Segmentation, targeting, and positioning are used to…", ["Set the tax rate", "Choose whom to serve and how to be seen", "Calculate depreciation"], 1),
  q("bus-hl-finance", "business", "economics", HL, "Finance", "A cash-flow forecast is most useful for…", ["Replacing a balance sheet forever", "Anticipating liquidity problems before they hit", "Setting the mission statement"], 1),
  q("psych-iv", "psychology", "psychology", BOTH, "Research methods", "An independent variable is…", ["What you measure", "What you change", "The sample size"], 1),
  q("psych-ethics", "psychology", "psychology", BOTH, "Ethics", "Informed consent means participants…", ["Must finish the study", "Understand enough to agree freely", "Are paid extra"], 1),
  q("psych-bias", "psychology", "psychology", BOTH, "Bias", "A study with a tiny, similar sample is weakest on…", ["Internal slogans", "Generalizability", "Font choice"], 1),
  q("psych-hl-approach", "psychology", "psychology", HL, "Approaches", "HL discussion of approaches is strongest when you…", ["Pick a favorite forever", "Show what a biological, cognitive, or sociocultural lens can and cannot explain", "Ignore method"], 1)
];
