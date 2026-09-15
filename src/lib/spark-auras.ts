export type SparkAuraId = (typeof SPARK_AURAS)[number]["id"];

type AuraWash = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  fill: string;
  fillOpacity: number;
};

type AuraRing = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  stroke: string;
  strokeOpacity: number;
  strokeWidth: number;
};

export const SPARK_AURAS = [
  {
    id: "none",
    name: "No aura",
    cost: 0,
    collection: "starter" as const,
    blurb: "Just the body glow.",
    washes: [] as AuraWash[],
    rings: [] as AuraRing[],
  },
  {
    id: "mint",
    name: "Mint halo",
    cost: 22,
    collection: "starter" as const,
    blurb: "A quiet mint ring. Soft enough for Focus.",
    washes: [
      { cx: 50, cy: 64, rx: 36, ry: 40, fill: "#5EEAD4", fillOpacity: 0.1 },
    ],
    rings: [
      {
        cx: 50,
        cy: 64,
        rx: 40,
        ry: 44,
        stroke: "#5EEAD4",
        strokeOpacity: 0.28,
        strokeWidth: 4.5,
      },
    ],
  },
  {
    id: "lavender",
    name: "Lavender halo",
    cost: 24,
    collection: "starter" as const,
    blurb: "A pale violet wash. One at a time.",
    washes: [
      { cx: 50, cy: 64, rx: 36, ry: 40, fill: "#C4B5FD", fillOpacity: 0.12 },
    ],
    rings: [
      {
        cx: 50,
        cy: 64,
        rx: 40,
        ry: 44,
        stroke: "#A78BFA",
        strokeOpacity: 0.3,
        strokeWidth: 4.5,
      },
    ],
  },
  {
    id: "gold",
    name: "Gold halo",
    cost: 40,
    collection: "gold" as const,
    blurb: "Warm metal light. Still quiet on Focus.",
    washes: [
      { cx: 50, cy: 64, rx: 35, ry: 39, fill: "#E8C547", fillOpacity: 0.1 },
    ],
    rings: [
      {
        cx: 50,
        cy: 64,
        rx: 39,
        ry: 43,
        stroke: "#E8C547",
        strokeOpacity: 0.32,
        strokeWidth: 4.2,
      },
    ],
  },
  {
    id: "aurora",
    name: "Aurora halo",
    cost: 80,
    collection: "aurora" as const,
    blurb: "Mint and violet, barely there.",
    washes: [
      { cx: 44, cy: 66, rx: 30, ry: 34, fill: "#5EEAD4", fillOpacity: 0.1 },
      { cx: 58, cy: 62, rx: 28, ry: 32, fill: "#A78BFA", fillOpacity: 0.1 },
    ],
    rings: [
      {
        cx: 50,
        cy: 64,
        rx: 41,
        ry: 45,
        stroke: "#5EEAD4",
        strokeOpacity: 0.2,
        strokeWidth: 3.4,
      },
      {
        cx: 52,
        cy: 62,
        rx: 37,
        ry: 41,
        stroke: "#A78BFA",
        strokeOpacity: 0.22,
        strokeWidth: 3.2,
      },
    ],
  },
] as const;

export function getSparkAura(id: SparkAuraId) {
  return SPARK_AURAS.find((row) => row.id === id) ?? SPARK_AURAS[0];
}
