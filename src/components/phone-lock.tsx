"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { DemoBadge } from "@/components/demo-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ESSENTIAL_APPS,
  NEMESIS_APPS,
  TIER2_APPS,
  TIER2_COST,
  formatNemesisList,
  type NemesisId,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { isAppUnlocked, type Unlock } from "@/lib/store";

type PhoneLockProps = {
  nemeses?: NemesisId[];
  unlocks?: Unlock[];
  locked?: boolean;
  compact?: boolean;
  onBeginFocus?: () => void;
};

function SocialGlyph({ label }: { label: string }) {
  return (
    <span className="font-mono text-[10px] font-semibold tracking-wide">
      {label}
    </span>
  );
}

export function PhoneLock({
  nemeses = ["tiktok"],
  unlocks = [],
  locked = true,
  compact = false,
  onBeginFocus,
}: PhoneLockProps) {
  const [now, setNow] = useState(() => new Date());
  const [notice, setNotice] = useState<string | null>(null);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
  const date = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const named = formatNemesisList(nemeses);
  const tier2 = TIER2_APPS.map((app) => ({
    ...app,
    isNemesis: false,
    open: !locked || isAppUnlocked(unlocks, app.id),
  }));
  const tier3 = NEMESIS_APPS.map((app) => {
    const isNemesis = nemeses.includes(app.id);
    return {
      ...app,
      isNemesis,
      open: !locked || isAppUnlocked(unlocks, app.id),
    };
  });

  function tapLocked(name: string) {
    setNotice(`${name} stays grey until you earn and spend tokens.`);
  }

  return (
    <div className={cn("mx-auto w-full", compact ? "max-w-[280px]" : "max-w-[320px]")}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[#07070a] shadow-[0_30px_80px_-32px_rgb(0_0_0_/_0.9)]",
          compact ? "p-2.5" : "p-3",
        )}
      >
        <div className="absolute top-3 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />
        <div className="relative overflow-hidden rounded-[1.9rem] bg-gradient-to-b from-[#16161d] to-[#0b0b0f]">
          <div className="flex items-center justify-between px-6 pt-4 text-[10px] text-zinc-500">
            <span>Catalyst</span>
            <span>LTE</span>
          </div>
          <div className={cn("px-6", compact ? "pt-6 pb-3" : "pt-8 pb-5")}>
            <p className="text-center text-[11px] text-zinc-500">{date}</p>
            <p
              className={cn(
                "mt-1 text-center font-heading tracking-tight text-foreground",
                compact ? "text-5xl" : "text-6xl",
              )}
            >
              {time}
            </p>
            <div className="mt-4 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-black/40 px-3 py-1 text-[11px] text-zinc-300">
                <span className="size-1.5 rounded-full bg-primary" />
                Focus locked
              </span>
            </div>
          </div>

          <div className={cn("px-4", compact ? "px-3.5" : "px-5")}>
            <p className="mb-2 text-[10px] tracking-[0.16em] text-emerald-500/80 uppercase">
              School / essentials — allowed
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ESSENTIAL_APPS.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() =>
                    setNotice(`${app.name} stays allowed during lock.`)
                  }
                  className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] text-emerald-300 ring-1 ring-emerald-500/25"
                >
                  {app.name}
                </button>
              ))}
            </div>

            <p className="mt-4 mb-2 text-[10px] tracking-[0.16em] text-zinc-600 uppercase">
              Tier 2 — {TIER2_COST} tokens / 10 min
            </p>
            <div className="grid grid-cols-4 gap-2">
              {tier2.map((app) => (
                <LockTile
                  key={app.id}
                  name={app.name}
                  glyph={app.glyph}
                  locked={!app.open}
                  highlight={false}
                  onClick={() => {
                    if (!app.open) tapLocked(app.name);
                    else setNotice(`${app.name} is unlocked for this window.`);
                  }}
                />
              ))}
            </div>

            <p className="mt-4 mb-2 text-[10px] tracking-[0.16em] text-zinc-600 uppercase">
              Tier 3 — nemesis set
            </p>
            <div className="grid grid-cols-3 gap-2">
              {tier3.map((app) => (
                <LockTile
                  key={app.id}
                  name={app.name}
                  glyph={app.glyph}
                  locked={!app.open}
                  highlight={app.isNemesis}
                  onClick={() => {
                    if (!app.open) tapLocked(app.name);
                    else setNotice(`${app.name} is unlocked for this window.`);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-3 px-5 pb-5">
            {notice ? (
              <p className="rounded-xl bg-black/40 px-3 py-2 text-center text-[11px] text-zinc-400">
                {notice}
              </p>
            ) : (
              <p className="text-center text-[11px] text-zinc-600">
                {named} {nemeses.length === 1 ? "is" : "are"} your nemesis
                {nemeses.length === 1 ? "" : "es"}. Emergency stays live.
              </p>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="h-10 flex-1 rounded-full border-white/10 bg-white/4 text-xs"
                onClick={() => setEmergencyOpen(true)}
              >
                <ShieldAlert className="size-3.5" />
                Emergency
              </Button>
              {onBeginFocus ? (
                <Button
                  type="button"
                  className="h-10 flex-1 rounded-full text-xs"
                  onClick={onBeginFocus}
                >
                  Begin focus
                </Button>
              ) : null}
            </div>
            <div className="flex justify-center">
              <DemoBadge>Simulated phone lock</DemoBadge>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={emergencyOpen} onOpenChange={setEmergencyOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Emergency stays available</DialogTitle>
            <DialogDescription>
              In a real install, calls, SOS, and parent contacts would still
              work. This web demo only pretends to lock the home screen — your
              actual phone is not restricted.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LockTile({
  name,
  glyph,
  locked,
  highlight,
  onClick,
}: {
  name: string;
  glyph: string;
  locked: boolean;
  highlight: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1"
    >
      <span
        className={cn(
          "flex size-10 items-center justify-center rounded-2xl",
          locked
            ? "bg-zinc-900 text-zinc-600 ring-1 ring-white/4"
            : "bg-primary/15 text-primary ring-1 ring-primary/30",
        )}
      >
        <SocialGlyph label={glyph} />
      </span>
      <span
        className={cn(
          "text-center text-[8px] leading-tight",
          highlight ? "text-primary/80" : "text-zinc-600",
        )}
      >
        {name}
      </span>
    </button>
  );
}
