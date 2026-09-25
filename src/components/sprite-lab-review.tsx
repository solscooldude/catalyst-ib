"use client";

import { useEffect, useRef, useState } from "react";
import "@/app/sprite-motion.css";
import { Spark, type SparkMood } from "@/components/spark";
import { SpritePlaypen } from "@/components/sprite-playpen";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SPARK_GEAR,
  type SparkAuraId,
  type SparkGearId,
} from "@/lib/appearance";
import type { CareStage } from "@/lib/care-stages";
import type { SparkAct } from "@/lib/spark-play";
import {
  SPECIES_PALETTES,
  SPRITE_SPECIES,
  type SpriteSpeciesId,
} from "@/lib/sprite-species";
import { cn } from "@/lib/utils";

const SPECIES_AURA: Record<SpriteSpeciesId, SparkAuraId> = {
  fox: "amber",
  bunny: "pearl",
  deer: "grove",
  cat: "magenta",
  axolotl: "hotpink",
  dragon: "mint",
};

const ACCESSORIES: SparkGearId[] = [
  "none",
  "bow",
  "glasses",
  "cap",
  "beanie",
  "phones",
  "horn",
  "hearts",
  "scarf",
];

type LabColumn = {
  id: string;
  label: string;
  stage: CareStage;
  eggFeeds?: number;
  extraMagical?: boolean;
};

const COLUMNS: LabColumn[] = [
  { id: "egg", label: "Egg", stage: "egg", eggFeeds: 0 },
  { id: "egg-1", label: "Egg 1/3", stage: "egg", eggFeeds: 1 },
  { id: "egg-2", label: "Egg 2/3", stage: "egg", eggFeeds: 2 },
  { id: "hatchling", label: "Hatchling", stage: "hatchling" },
  { id: "growing", label: "Growing", stage: "growing" },
  { id: "luminary", label: "Luminary", stage: "luminary" },
  { id: "ethereal", label: "Ethereal", stage: "ethereal" },
  {
    id: "magical",
    label: "Ethereal + Extra Magical",
    stage: "ethereal",
    extraMagical: true,
  },
];

type LabMove =
  | "idle"
  | "blink"
  | "poke"
  | "pet"
  | "tickle"
  | "spin"
  | "mirror"
  | "sit"
  | "jiggle"
  | "sleep"
  | "hatch"
  | "feed";

const MOVES: { id: LabMove; label: string; ms: number }[] = [
  { id: "idle", label: "Idle / breathe", ms: 700 },
  { id: "blink", label: "Blink", ms: 520 },
  { id: "poke", label: "Poke", ms: 900 },
  { id: "pet", label: "Pet / happy", ms: 1400 },
  { id: "tickle", label: "Tickle", ms: 980 },
  { id: "spin", label: "Spin", ms: 1100 },
  { id: "mirror", label: "Mirror", ms: 1100 },
  { id: "sit", label: "Study-buddy sit", ms: 1200 },
  { id: "jiggle", label: "Scrunch", ms: 900 },
  { id: "sleep", label: "Sleep", ms: 1600 },
  { id: "hatch", label: "Hatch", ms: 1200 },
  { id: "feed", label: "Feed", ms: 1400 },
];

function moveToSpark(move: LabMove | null): {
  act: SparkAct;
  mood: SparkMood;
  hatching: boolean;
  snack: "cookie" | null;
  blink: boolean;
  flourish: "loop" | "now";
} {
  switch (move) {
    case "poke":
      return { act: "poke", mood: "idle", hatching: false, snack: null, blink: false, flourish: "loop" };
    case "tickle":
      return { act: "tickle", mood: "idle", hatching: false, snack: null, blink: false, flourish: "loop" };
    case "spin":
      return { act: "spin", mood: "idle", hatching: false, snack: null, blink: false, flourish: "loop" };
    case "mirror":
      return { act: "wave", mood: "idle", hatching: false, snack: null, blink: false, flourish: "loop" };
    case "jiggle":
      return { act: "scrunch", mood: "idle", hatching: false, snack: null, blink: false, flourish: "loop" };
    case "sleep":
      return { act: "sleep", mood: "sleepy", hatching: false, snack: null, blink: false, flourish: "loop" };
    case "sit":
      return { act: null, mood: "tempted", hatching: false, snack: null, blink: false, flourish: "loop" };
    case "hatch":
      return { act: null, mood: "idle", hatching: true, snack: null, blink: false, flourish: "loop" };
    case "feed":
      return { act: null, mood: "eating", hatching: false, snack: "cookie", blink: false, flourish: "loop" };
    case "blink":
      return { act: null, mood: "idle", hatching: false, snack: null, blink: true, flourish: "loop" };
    case "idle":
      return { act: null, mood: "idle", hatching: false, snack: null, blink: false, flourish: "now" };
    default:
      return { act: null, mood: "idle", hatching: false, snack: null, blink: false, flourish: "loop" };
  }
}

export function SpriteLabReview() {
  const [filter, setFilter] = useState<SpriteSpeciesId | "all">("all");
  const [gear, setGear] = useState<SparkGearId>("none");
  const [showAura, setShowAura] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [move, setMove] = useState<LabMove | null>(null);
  const [petPulse, setPetPulse] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [inspect, setInspect] = useState<{
    species: SpriteSpeciesId;
    column: LabColumn;
  } | null>(null);
  const cancelPlay = useRef(false);
  const look = moveToSpark(move);
  const rows =
    filter === "all"
      ? SPRITE_SPECIES
      : SPRITE_SPECIES.filter((id) => id === filter);

  useEffect(() => {
    return () => {
      cancelPlay.current = true;
    };
  }, []);

  function fire(next: LabMove) {
    setMove(next);
    if (next === "pet") setPetPulse((n) => n + 1);
  }

  async function playAll() {
    cancelPlay.current = false;
    setPlaying(true);
    for (const step of MOVES) {
      if (cancelPlay.current) break;
      fire(step.id);
      await wait(step.ms);
    }
    if (!cancelPlay.current) setMove(null);
    setPlaying(false);
  }

  return (
    <div
      className={cn(
        "min-h-dvh bg-[#0B0B0F] px-4 py-8 text-zinc-50 sm:px-6",
        reduced && "sprite-lab-reduced",
        look.blink && "spark-force-blink",
      )}
    >
      <div className="mx-auto max-w-[96rem]">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Unlisted review
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Sprite lab
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          One row per animal, one column per stage. Buttons fire the same
          animation on every visible sprite. Click a cell to enlarge and
          poke, pet, or drag it.
        </p>

        <div className="sticky top-0 z-20 mt-6 rounded-2xl border border-white/10 bg-[#0B0B0F]/95 p-3 backdrop-blur">
          <div className="flex flex-wrap gap-2">
            {MOVES.map((item) => (
              <Button
                key={item.id}
                type="button"
                size="sm"
                variant={move === item.id ? "default" : "outline"}
                disabled={playing}
                onClick={() => fire(item.id)}
              >
                {item.label}
              </Button>
            ))}
            <Button
              type="button"
              size="sm"
              variant={playing ? "default" : "secondary"}
              disabled={playing}
              onClick={() => void playAll()}
            >
              {playing ? "Playing…" : "Play all in sequence"}
            </Button>
            {playing ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => {
                  cancelPlay.current = true;
                }}
              >
                Stop
              </Button>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <div className="flex flex-wrap gap-1.5">
              <FilterChip
                on={filter === "all"}
                onClick={() => setFilter("all")}
              >
                All
              </FilterChip>
              {SPRITE_SPECIES.map((id) => (
                <FilterChip
                  key={id}
                  on={filter === id}
                  onClick={() => setFilter(id)}
                >
                  {SPECIES_PALETTES[id].label}
                </FilterChip>
              ))}
            </div>
            <label className="flex items-center gap-2 text-zinc-300">
              Accessory
              <select
                className="h-8 rounded-lg border border-white/15 bg-[#18181B] px-2 text-sm"
                value={gear}
                onChange={(event) =>
                  setGear(event.target.value as SparkGearId)
                }
              >
                {ACCESSORIES.map((id) => (
                  <option key={id} value={id}>
                    {SPARK_GEAR.find((row) => row.id === id)?.name ?? id}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-zinc-300">
              <Checkbox
                checked={showAura}
                onCheckedChange={(value) => setShowAura(value === true)}
              />
              Show glow aura
            </label>
            <label className="flex items-center gap-2 text-zinc-300">
              <Checkbox
                checked={reduced}
                onCheckedChange={(value) => setReduced(value === true)}
              />
              Reduced motion
            </label>
          </div>
        </div>

        <div id="sprite-lab-grid" className="mt-6 overflow-auto pb-8">
          <table className="min-w-[74rem] border-separate border-spacing-2">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-[#0B0B0F] px-2 py-2 text-left text-xs font-medium tracking-[0.14em] text-zinc-500 uppercase">
                  Animal
                </th>
                {COLUMNS.map((column) => (
                  <th
                    key={column.id}
                    className="px-2 py-2 text-center text-xs font-medium text-zinc-400"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((species) => (
                <tr key={species}>
                  <th className="sticky left-0 z-10 bg-[#0B0B0F] px-2 py-3 text-left text-sm font-medium">
                    {SPECIES_PALETTES[species].label}
                  </th>
                  {COLUMNS.map((column) => (
                    <td key={`${species}-${column.id}`}>
                      <button
                        type="button"
                        onClick={() => setInspect({ species, column })}
                        className="flex w-full flex-col items-center rounded-2xl border border-white/10 bg-[#18181B] px-2 pt-3 pb-2 transition hover:border-white/25"
                      >
                        <div
                          className={cn(
                            "flex h-28 w-full items-center justify-center",
                            look.blink && "spark-force-blink",
                          )}
                        >
                          <Spark
                            mood={look.mood}
                            act={look.act}
                            snack={look.snack}
                            hatching={look.hatching}
                            flourish={look.flourish}
                            petPulse={petPulse}
                            shape={species}
                            stage={column.stage}
                            eggFeeds={column.eggFeeds}
                            extraMagical={Boolean(column.extraMagical)}
                            gear={gear}
                            aura={
                              showAura ? SPECIES_AURA[species] : "none"
                            }
                            trail="none"
                            evolve={false}
                            size={112}
                          />
                        </div>
                        <span className="mt-1 text-[11px] text-zinc-400">
                          {SPECIES_PALETTES[species].label} · {column.label}
                        </span>
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={Boolean(inspect)}
        onOpenChange={(open) => {
          if (!open) setInspect(null);
        }}
      >
        <DialogContent className="max-w-xl border-white/10 bg-[#121218] text-zinc-50">
          <DialogHeader>
            <DialogTitle>
              {inspect
                ? `${SPECIES_PALETTES[inspect.species].label} · ${inspect.column.label}`
                : "Sprite"}
            </DialogTitle>
            <DialogDescription>
              Poke, pet, or drag this sprite. Snacks are on the tray if it is
              hatched.
            </DialogDescription>
          </DialogHeader>
          {inspect ? (
            <SpritePlaypen
              mood="idle"
              petPulse={0}
              canFeed={inspect.column.stage !== "egg"}
              onPet={() => undefined}
              onFeed={() => true}
              shape={inspect.species}
              stage={inspect.column.stage}
              eggFeeds={inspect.column.eggFeeds}
              extraMagical={Boolean(inspect.column.extraMagical)}
              gear={gear}
              aura={showAura ? SPECIES_AURA[inspect.species] : "none"}
              trail="none"
              size={220}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterChip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium",
        on ? "bg-zinc-100 text-zinc-950" : "bg-white/8 text-zinc-300",
      )}
    >
      {children}
    </button>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
