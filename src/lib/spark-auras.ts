export type SparkAuraId = (typeof SPARK_AURAS)[number]["id"];

export const SPARK_AURAS = [
  {
    id: "none",
    name: "No glow",
    cost: 0,
    collection: "starter" as const,
    blurb: "No body glow.",
    glow: "transparent",
    glowB: null as string | null,
  },
  {
    id: "mint",
    name: "Mint",
    cost: 22,
    collection: "starter" as const,
    blurb: "Mint body glow.",
    glow: "#5EEAD4",
    glowB: null,
  },
  {
    id: "lavender",
    name: "Lavender",
    cost: 24,
    collection: "starter" as const,
    blurb: "Lavender body glow.",
    glow: "#A78BFA",
    glowB: null,
  },
  {
    id: "pink",
    name: "Pink",
    cost: 24,
    collection: "starter" as const,
    blurb: "Pink body glow.",
    glow: "#F9A8D4",
    glowB: null,
  },
  {
    id: "gold",
    name: "Gold",
    cost: 40,
    collection: "gold" as const,
    blurb: "Gold body glow.",
    glow: "#E8C547",
    glowB: null,
  },
  {
    id: "aurora",
    name: "Aurora",
    cost: 80,
    collection: "aurora" as const,
    blurb: "Mint and violet body glow.",
    glow: "#5EEAD4",
    glowB: "#A78BFA",
  },
] as const;

export function getSparkAura(id: SparkAuraId) {
  return SPARK_AURAS.find((row) => row.id === id) ?? SPARK_AURAS[0];
}
