export type SparkAuraId = (typeof SPARK_AURAS)[number]["id"];

type AuraWash = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  fill: string;
  fillOpacity: number;
};

export const SPARK_AURAS = [
  {
    id: "none",
    name: "No glow",
    cost: 0,
    collection: "starter" as const,
    blurb: "No extra colour around the body.",
    glow: "transparent",
    washes: [] as AuraWash[],
  },
  {
    id: "mint",
    name: "Mint glow",
    cost: 22,
    collection: "starter" as const,
    blurb: "A soft mint halo around Spark.",
    glow: "#5EEAD4",
    washes: [
      { cx: 50, cy: 66, rx: 46, ry: 50, fill: "#5EEAD4", fillOpacity: 0.22 },
      { cx: 50, cy: 64, rx: 32, ry: 36, fill: "#99F6E4", fillOpacity: 0.16 },
    ],
  },
  {
    id: "lavender",
    name: "Lavender glow",
    cost: 24,
    collection: "starter" as const,
    blurb: "A pale violet halo. One colour at a time.",
    glow: "#A78BFA",
    washes: [
      { cx: 50, cy: 66, rx: 46, ry: 50, fill: "#A78BFA", fillOpacity: 0.22 },
      { cx: 50, cy: 64, rx: 32, ry: 36, fill: "#C4B5FD", fillOpacity: 0.16 },
    ],
  },
  {
    id: "pink",
    name: "Pink glow",
    cost: 24,
    collection: "starter" as const,
    blurb: "A blush halo around the silhouette.",
    glow: "#F9A8D4",
    washes: [
      { cx: 50, cy: 66, rx: 46, ry: 50, fill: "#F9A8D4", fillOpacity: 0.24 },
      { cx: 50, cy: 64, rx: 32, ry: 36, fill: "#FBCFE8", fillOpacity: 0.16 },
    ],
  },
  {
    id: "gold",
    name: "Gold glow",
    cost: 40,
    collection: "gold" as const,
    blurb: "Warm metal light around the body.",
    glow: "#E8C547",
    washes: [
      { cx: 50, cy: 66, rx: 45, ry: 49, fill: "#E8C547", fillOpacity: 0.2 },
      { cx: 50, cy: 64, rx: 31, ry: 35, fill: "#FDE68A", fillOpacity: 0.16 },
    ],
  },
  {
    id: "aurora",
    name: "Aurora glow",
    cost: 80,
    collection: "aurora" as const,
    blurb: "Mint-to-violet wash around Spark.",
    glow: "#5EEAD4",
    washes: [
      { cx: 42, cy: 68, rx: 40, ry: 46, fill: "#5EEAD4", fillOpacity: 0.2 },
      { cx: 60, cy: 60, rx: 38, ry: 44, fill: "#A78BFA", fillOpacity: 0.2 },
    ],
  },
] as const;

export function getSparkAura(id: SparkAuraId) {
  return SPARK_AURAS.find((row) => row.id === id) ?? SPARK_AURAS[0];
}
