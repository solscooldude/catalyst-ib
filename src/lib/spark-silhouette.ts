/** Soft drop silhouettes. Same viewBox language as the original twin-peak. */

export const BRAND_MINT = "#5EEAD4";
export const BRAND_INK = "#0B0B0F";

export const SPRITE_SHAPES = [
  "twin-peak",
  "teardrop",
  "mochi",
  "cloud",
  "wisp",
  "bean",
] as const;

export type SpriteShapeId = (typeof SPRITE_SHAPES)[number];

/** Twin-peak — ORIGINAL drop. Rounded bottom, taller left peak, shorter right peak. */
export const SPARK_BODY_PATH =
  "M50 96C31 96 18 81 22 61C25 44 30 27 39 15C42 9 48 7 49 14C50 18 52 19 54 16C57 11 65 12 68 20C74 32 77 46 78 61C82 81 69 96 50 96Z";

/** Single soft rounded point on top. */
export const TEARDROP_BODY_PATH =
  "M50 98C29 98 16 82 20 60C24 40 34 22 45 8C48 2 50 0 52 8C62 28 76 44 80 62C84 82 71 98 50 98Z";

/** Soft squishy round ball. */
export const MOCHI_BODY_PATH =
  "M50 99C28 99 12 83 12 62C12 38 28 18 50 18C72 18 88 38 88 62C88 83 72 99 50 99Z";

/** Lumpy cloud silhouette. */
export const CLOUD_BODY_PATH =
  "M18 76C10 76 8 64 16 60C10 50 20 40 32 46C32 30 48 24 58 32C64 20 84 24 86 40C98 40 104 56 94 66C102 74 96 88 82 88C76 100 56 104 44 96C28 104 14 92 18 76Z";

/** Little flame with a curly tip. */
export const WISP_BODY_PATH =
  "M50 98C32 98 18 84 20 64C22 48 28 36 40 22C46 12 48 4 50 -2C52 6 56 10 62 12C74 0 86 12 76 24C70 30 68 34 70 38C80 44 84 56 80 68C82 86 68 98 50 98Z";

/** Tall soft jelly-bean. Lean is applied as a planted-base pose. */
export const BEAN_BODY_PATH =
  "M50 8C64 8 71 18 71 32C73 50 73 70 69 84C65 96 57 100 50 100C43 100 35 96 31 84C27 70 27 50 29 32C29 18 36 8 50 8Z";

export const SHAPE_PATHS: Record<SpriteShapeId, string> = {
  "twin-peak": SPARK_BODY_PATH,
  teardrop: TEARDROP_BODY_PATH,
  mochi: MOCHI_BODY_PATH,
  cloud: CLOUD_BODY_PATH,
  wisp: WISP_BODY_PATH,
  bean: BEAN_BODY_PATH,
};

export type GearSlot = "head" | "face" | "neck" | "back";

export type ShapeAnchor = {
  x: number;
  y: number;
  s?: number;
  r?: number;
};

export type ShapeAnchors = Record<GearSlot, ShapeAnchor>;

const ORIGIN: ShapeAnchor = { x: 0, y: 0, s: 1 };

export const SHAPE_ANCHORS: Record<SpriteShapeId, ShapeAnchors> = {
  "twin-peak": {
    head: ORIGIN,
    face: ORIGIN,
    neck: ORIGIN,
    back: ORIGIN,
  },
  teardrop: {
    head: { x: 0, y: -5, s: 0.96 },
    face: { x: 0, y: -2 },
    neck: { x: 0, y: 1 },
    back: { x: 0, y: 1, s: 0.98 },
  },
  mochi: {
    head: { x: 0, y: 10, s: 0.94 },
    face: { x: 0, y: 5 },
    neck: { x: 0, y: 7 },
    back: { x: 0, y: 6, s: 0.96 },
  },
  cloud: {
    head: { x: 0, y: 8, s: 1.08 },
    face: { x: 0, y: 3 },
    neck: { x: 0, y: 5 },
    back: { x: 0, y: 4, s: 1.1 },
  },
  wisp: {
    head: { x: 3, y: -8, s: 0.9 },
    face: { x: 1, y: -3 },
    neck: { x: 0, y: -1 },
    back: { x: 0, y: 0, s: 0.88 },
  },
  bean: {
    head: { x: 2, y: -16, s: 0.88 },
    face: { x: 1, y: -8 },
    neck: { x: 0, y: 2 },
    back: { x: 1, y: 0, s: 0.9 },
  },
};

/** Whole-body lean. Bean rotates around its planted base. */
export function shapePoseTransform(shape: SpriteShapeId): string | undefined {
  if (shape === "bean") return "rotate(12 50 88)";
  return undefined;
}

export function shapeBodyPath(shape: SpriteShapeId) {
  return SHAPE_PATHS[shape] ?? SPARK_BODY_PATH;
}

export function gearSlotForId(
  id: string,
  layer: "back" | "mid" | "front",
): GearSlot {
  if (layer === "back") return "back";
  if (layer === "front") return "face";
  if (
    id === "glasses" ||
    id === "hearts"
  ) {
    return "face";
  }
  if (
    id === "bowtie" ||
    id === "scarf" ||
    id === "cape" ||
    id === "streak-mantle"
  ) {
    return "neck";
  }
  return "head";
}

export function shapeGearTransform(
  shape: SpriteShapeId,
  slot: GearSlot,
): string | undefined {
  const anchor = SHAPE_ANCHORS[shape]?.[slot] ?? ORIGIN;
  const scale = anchor.s ?? 1;
  const rotate = anchor.r ?? 0;
  if (!anchor.x && !anchor.y && scale === 1 && !rotate) return undefined;
  const turn = rotate ? ` rotate(${rotate})` : "";
  return `translate(${anchor.x} ${anchor.y}) translate(50 58)${turn} scale(${scale}) translate(-50 -58)`;
}
