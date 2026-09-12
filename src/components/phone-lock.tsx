"use client";

import { useEffect, useState } from "react";
import {
  Clock3,
  MessageCircle,
  Phone,
  ShieldAlert,
  StickyNote,
} from "lucide-react";
import { DemoBadge } from "@/components/demo-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NEMESIS_APPS, type NemesisId } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { isUnlockActive, type Unlock } from "@/lib/store";

type PhoneLockProps = {
  nemesis?: NemesisId | null;
  unlocks?: Unlock[];
  locked?: boolean;
  compact?: boolean;
  onBeginFocus?: () => void;
};

const ESSENTIALS = [
  { id: "phone", name: "Phone", icon: Phone },
  { id: "messages", name: "Messages", icon: MessageCircle },
  { id: "notes", name: "Notes", icon: StickyNote },
  { id: "clock", name: "Clock", icon: Clock3 },
];

function SocialGlyph({ label }: { label: string }) {
  return (
    <span className="font-mono text-[10px] font-semibold tracking-wide">
      {label}
    </span>
  );
}

export function PhoneLock({
  nemesis = "tiktok",
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

  const nemesisApp =
    NEMESIS_APPS.find((app) => app.id === nemesis) ?? NEMESIS_APPS[0];
  const notesOpen = isUnlockActive(unlocks, "notes");
  const youtubeOpen = isUnlockActive(unlocks, "youtube");
  const nemesisOpen = isUnlockActive(unlocks, "nemesis");

  const socials = [
    {
      id: "instagram",
      name: "Instagram",
      glyph: "IG",
      locked: locked && !(nemesis === "instagram" && nemesisOpen),
      isNemesis: nemesis === "instagram",
    },
    {
      id: "tiktok",
      name: "TikTok",
      glyph: "TT",
      locked: locked && !(nemesis === "tiktok" && nemesisOpen),
      isNemesis: nemesis === "tiktok",
    },
    {
      id: "snapchat",
      name: "Snapchat",
      glyph: "SC",
      locked: locked && !(nemesis === "snapchat" && nemesisOpen),
      isNemesis: nemesis === "snapchat",
    },
    {
      id: "youtube",
      name: "YouTube",
      glyph: "YT",
      locked: locked && !youtubeOpen,
      isNemesis: false,
    },
  ];

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
          <div className={cn("px-6", compact ? "pt-6 pb-4" : "pt-8 pb-6")}>
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

          <div className="px-5">
            <div className="grid grid-cols-4 gap-3">
              {ESSENTIALS.map((app) => {
                const Icon = app.icon;
                const notesLocked = app.id === "notes" && locked && !notesOpen;
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => {
                      if (notesLocked) tapLocked("Notes");
                    }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <span
                      className={cn(
                        "flex size-11 items-center justify-center rounded-2xl",
                        notesLocked
                          ? "bg-zinc-800/80 text-zinc-600"
                          : "bg-zinc-800 text-zinc-200",
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="text-[9px] text-zinc-500">{app.name}</span>
                  </button>
                );
              })}
            </div>

            <p className="mt-5 mb-2 text-[10px] tracking-[0.16em] text-zinc-600 uppercase">
              Greyed until you earn it
            </p>
            <div className="grid grid-cols-4 gap-3">
              {socials.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    if (app.locked) tapLocked(app.name);
                    else setNotice(`${app.name} is unlocked for this window.`);
                  }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-2xl",
                      app.locked
                        ? "bg-zinc-900 text-zinc-600 ring-1 ring-white/4"
                        : "bg-primary/15 text-primary ring-1 ring-primary/30",
                    )}
                  >
                    <SocialGlyph label={app.glyph} />
                  </span>
                  <span
                    className={cn(
                      "text-[9px]",
                      app.isNemesis ? "text-primary/70" : "text-zinc-600",
                    )}
                  >
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-3 px-5 pb-5">
            {notice ? (
              <p className="rounded-xl bg-black/40 px-3 py-2 text-center text-[11px] text-zinc-400">
                {notice}
              </p>
            ) : (
              <p className="text-center text-[11px] text-zinc-600">
                {nemesisApp.name} is your nemesis. Emergency stays live.
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
