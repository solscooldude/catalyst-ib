import { BRAND_INK, BRAND_MINT, SPARK_BODY_PATH } from "@/lib/spark-silhouette";
import {
  formatHours,
  startOfWeek,
  weekDayMarks,
  weeklyRoundup,
} from "@/lib/stats";
import type { SessionLog } from "@/lib/store";

export const STORY_WIDTH = 1080;
export const STORY_HEIGHT = 1920;

export type WeekStoryStats = {
  weekLabel: string;
  topSubject: string;
  empty: boolean;
  streakDays: number;
  studyLabel: string;
  tokensEarned: number;
  spriteName: string;
  studiedDays: boolean[];
};

export function buildWeekStory(
  logs: SessionLog[],
  streakDays: number,
  spriteName: string,
  now = new Date(),
): WeekStoryStats {
  const week = weeklyRoundup(logs, now);
  return {
    weekLabel: week.weekLabel,
    topSubject: week.topSubject?.label ?? "No sessions yet",
    empty: week.empty,
    streakDays,
    studyLabel: formatHours(week.durationMs),
    tokensEarned: week.tokensEarned,
    spriteName,
    studiedDays: weekDayMarks(logs, now).map((day) => day.studied),
  };
}

export function weekStoryFilename(now = new Date()) {
  const start = startOfWeek(now);
  const year = start.getFullYear();
  const month = String(start.getMonth() + 1).padStart(2, "0");
  const day = String(start.getDate()).padStart(2, "0");
  return `catalyst-week-${year}-${month}-${day}.png`;
}

function cssFamily(variable: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  return value || fallback;
}

function headingFont(weight: number, size: number) {
  return `${weight} ${size}px ${cssFamily("--font-plus-jakarta", '"Plus Jakarta Sans", ui-sans-serif, sans-serif')}`;
}

function bodyFont(weight: number, size: number) {
  return `${weight} ${size}px ${cssFamily("--font-geist-sans", '"Geist", ui-sans-serif, sans-serif')}`;
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [text];
  const lines: string[] = [];
  let current = words[0];
  for (const word of words.slice(1)) {
    const next = `${current} ${word}`;
    if (ctx.measureText(next).width <= maxWidth) {
      current = next;
      continue;
    }
    lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) break;
  }
  if (lines.length < maxLines) {
    lines.push(current);
  } else {
    let last = current;
    while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) {
      last = last.slice(0, -1);
    }
    lines[maxLines - 1] = `${last}…`;
  }
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawSparkle(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color = BRAND_MINT,
) {
  const s = size / 16;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(s, s);
  ctx.translate(-8, -8);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(8, 1.1);
  ctx.lineTo(9.15, 6.2);
  ctx.lineTo(14.9, 8);
  ctx.lineTo(9.15, 9.8);
  ctx.lineTo(8, 14.9);
  ctx.lineTo(6.85, 9.8);
  ctx.lineTo(1.1, 8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSparkPeek(ctx: CanvasRenderingContext2D) {
  const scale = 6.1;
  const x = STORY_WIDTH / 2 - 50 * scale;
  const y = 1410;
  ctx.save();
  const glow = ctx.createRadialGradient(540, 1680, 40, 540, 1680, 340);
  glow.addColorStop(0, "rgba(94, 234, 212, 0.42)");
  glow.addColorStop(1, "rgba(94, 234, 212, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.ellipse(540, 1720, 340, 220, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = BRAND_MINT;
  ctx.fill(new Path2D(SPARK_BODY_PATH));
  ctx.fillStyle = BRAND_INK;
  ctx.beginPath();
  ctx.arc(39.2, 60, 5.5, 0, Math.PI * 2);
  ctx.arc(60.8, 60, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(41.2, 58.2, 1.7, 0, Math.PI * 2);
  ctx.arc(62.8, 58.2, 1.7, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawWeekStory(
  ctx: CanvasRenderingContext2D,
  story: WeekStoryStats,
) {
  ctx.clearRect(0, 0, STORY_WIDTH, STORY_HEIGHT);
  ctx.fillStyle = "#F4F4F5";
  ctx.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);

  const wash = ctx.createRadialGradient(220, 180, 20, 180, 160, 520);
  wash.addColorStop(0, "rgba(94, 234, 212, 0.28)");
  wash.addColorStop(1, "rgba(94, 234, 212, 0)");
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, STORY_WIDTH, 720);

  drawSparkle(ctx, 128, 168, 36);
  ctx.fillStyle = BRAND_INK;
  ctx.font = headingFont(700, 42);
  ctx.textBaseline = "middle";
  ctx.fillText("Catalyst", 158, 166);
  const catalystWidth = ctx.measureText("Catalyst").width;
  ctx.fillStyle = "#A1A1AA";
  ctx.font = headingFont(600, 28);
  ctx.fillText("IB", 158 + catalystWidth + 14, 168);

  ctx.fillStyle = "#A1A1AA";
  ctx.font = bodyFont(500, 22);
  ctx.fillText("THIS WEEK", 96, 280);
  ctx.fillStyle = BRAND_INK;
  ctx.font = headingFont(600, 36);
  ctx.fillText(story.weekLabel, 96, 332);

  const marksX = 96;
  const marksY = 392;
  for (let index = 0; index < 7; index += 1) {
    const studied = story.studiedDays[index];
    ctx.beginPath();
    ctx.arc(marksX + index * 36, marksY, 10, 0, Math.PI * 2);
    ctx.fillStyle = studied ? BRAND_MINT : "#E4E4E7";
    ctx.fill();
  }

  ctx.fillStyle = BRAND_INK;
  ctx.font = headingFont(700, story.empty ? 64 : 76);
  ctx.textBaseline = "top";
  const hero = story.empty ? "A quiet week" : story.topSubject;
  const heroLines = wrapLines(ctx, hero, 888, 2);
  let heroY = 460;
  for (const line of heroLines) {
    ctx.fillText(line, 96, heroY);
    heroY += story.empty ? 78 : 90;
  }
  ctx.fillStyle = "#A1A1AA";
  ctx.font = bodyFont(500, 28);
  ctx.fillText(
    story.empty ? "Start a block and this card fills in." : "Top subject",
    96,
    heroY + 8,
  );

  const cardY = 760;
  const cardH = 220;
  const gap = 24;
  const cardW = (STORY_WIDTH - 96 * 2 - gap) / 2;
  const cards = [
    {
      x: 96,
      label: "Streak",
      value:
        story.streakDays === 1 ? "1 day" : `${story.streakDays} days`,
    },
    {
      x: 96 + cardW + gap,
      label: "Study time",
      value: story.studyLabel,
    },
  ];
  for (const card of cards) {
    ctx.fillStyle = "#fff";
    roundRect(ctx, card.x, cardY, cardW, cardH, 36);
    ctx.fill();
    ctx.fillStyle = "#A1A1AA";
    ctx.font = bodyFont(500, 22);
    ctx.textBaseline = "alphabetic";
    ctx.fillText(card.label, card.x + 36, cardY + 58);
    ctx.fillStyle = BRAND_INK;
    ctx.font = headingFont(700, 52);
    ctx.fillText(card.value, card.x + 36, cardY + 132);
  }

  const tokenY = 1020;
  ctx.fillStyle = "#fff";
  roundRect(ctx, 96, tokenY, STORY_WIDTH - 192, 200, 36);
  ctx.fill();
  ctx.fillStyle = "#A1A1AA";
  ctx.font = bodyFont(500, 22);
  ctx.fillText("Tokens this week", 132, tokenY + 58);
  drawSparkle(ctx, 154, tokenY + 124, 34);
  ctx.fillStyle = BRAND_INK;
  ctx.font = headingFont(700, 64);
  ctx.textBaseline = "middle";
  ctx.fillText(story.tokensEarned.toLocaleString(), 186, tokenY + 126);

  drawSparkPeek(ctx);

  ctx.fillStyle = "#A1A1AA";
  ctx.font = bodyFont(500, 24);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";
  const peekName = story.spriteName.trim() || "Spark";
  ctx.fillText(
    story.empty
      ? `${peekName} is waiting.`
      : "Focus first. Then the apps.",
    STORY_WIDTH / 2,
    1368,
  );
  ctx.textAlign = "left";
}

export async function weekStoryPngBlob(story: WeekStoryStats) {
  if (typeof document !== "undefined" && "fonts" in document) {
    await document.fonts.ready;
  }
  const canvas = document.createElement("canvas");
  canvas.width = STORY_WIDTH;
  canvas.height = STORY_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not draw the Story card.");
  drawWeekStory(ctx, story);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new Error("Could not export the Story card.");
  return blob;
}

export async function downloadWeekStory(story: WeekStoryStats, now = new Date()) {
  const blob = await weekStoryPngBlob(story);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = weekStoryFilename(now);
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2_000);
  return blob;
}

export async function shareWeekStory(story: WeekStoryStats, now = new Date()) {
  const blob = await weekStoryPngBlob(story);
  const file = new File([blob], weekStoryFilename(now), { type: "image/png" });
  const payload = {
    files: [file],
    title: "This week on Catalyst",
    text: story.empty
      ? "A quiet week on Catalyst — starting a block next."
      : `${story.topSubject} led my week on Catalyst.`,
  };
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share(payload);
    return "shared" as const;
  }
  await downloadWeekStory(story, now);
  return "downloaded" as const;
}
