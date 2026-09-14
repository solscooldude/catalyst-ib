export const ACCENTS = [
  {
    id: "mint",
    name: "Mint",
    hex: "#5EEAD4",
    cost: 0,
    blurb: "The default. Soft cyan.",
  },
  {
    id: "pink",
    name: "Blush",
    hex: "#F9A8D4",
    cost: 20,
    blurb: "Warm pink buttons and highlights.",
  },
  {
    id: "violet",
    name: "Violet",
    hex: "#C4B5FD",
    cost: 18,
    blurb: "Lilac accents across the UI.",
  },
  {
    id: "amber",
    name: "Amber",
    hex: "#FBBF24",
    cost: 16,
    blurb: "A quieter gold for late sessions.",
  },
] as const;

export const BACKGROUNDS = [
  {
    id: "void",
    name: "Void",
    cost: 0,
    blurb: "Near-black, the original room.",
  },
  {
    id: "dusk",
    name: "Dusk",
    cost: 12,
    blurb: "A violet evening wash.",
  },
  {
    id: "mist",
    name: "Mist",
    cost: 12,
    blurb: "Cool slate, a little softer.",
  },
  {
    id: "grove",
    name: "Grove",
    cost: 14,
    blurb: "Deep green, like a library lamp.",
  },
  {
    id: "stars",
    name: "Stars",
    cost: 100,
    blurb: "Soft glowing dots. A quiet night sky.",
  },
  {
    id: "aurora",
    name: "Aurora",
    cost: 100,
    blurb: "A slow mint-and-violet wash across the room.",
  },
] as const;
