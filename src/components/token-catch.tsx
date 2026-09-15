"use client";

import { useEffect, useRef, useState } from "react";
import { SparkleMark } from "@/components/brand-marks";
import { Button } from "@/components/ui/button";
import { playSfx } from "@/lib/sfx";
import { catchSparkToken } from "@/lib/spark-gift";
import { cn } from "@/lib/utils";

const GAME_MS = 10_000;

type Star = { id: number; left: number; top: number };

export function TokenCatch({
  onNotice,
}: {
  onNotice: (text: string) => void;
}) {
  const [live, setLive] = useState(false);
  const [leftMs, setLeftMs] = useState(GAME_MS);
  const [stars, setStars] = useState<Star[]>([]);
  const [caught, setCaught] = useState(0);
  const caughtRef = useRef(0);
  const endAt = useRef(0);

  useEffect(() => {
    if (!live) return;
    const beat = window.setInterval(() => {
      const remain = Math.max(0, endAt.current - Date.now());
      setLeftMs(remain);
      if (remain === 0) {
        setLive(false);
        setStars([]);
        const total = caughtRef.current;
        onNotice(
          total === 0 ? "No catches that round." : `Caught ${total} in 10s.`,
        );
      }
    }, 120);
    const spawn = window.setInterval(() => {
      setStars((current) => [
        ...current.slice(-4),
        {
          id: Date.now() + Math.random(),
          left: 12 + Math.random() * 70,
          top: 8 + Math.random() * 62,
        },
      ]);
    }, 700);
    return () => {
      window.clearInterval(beat);
      window.clearInterval(spawn);
    };
  }, [live, onNotice]);

  function start() {
    caughtRef.current = 0;
    setCaught(0);
    setStars([]);
    setLeftMs(GAME_MS);
    endAt.current = Date.now() + GAME_MS;
    setLive(true);
  }

  function grab(id: number) {
    setStars((current) => current.filter((star) => star.id !== id));
    const result = catchSparkToken();
    playSfx("catch");
    if (result.ok) {
      caughtRef.current += 1;
      setCaught(caughtRef.current);
    } else if (result.reason) {
      onNotice(result.reason);
    }
  }

  return (
    <section className="flux-card relative overflow-hidden px-6 py-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg text-foreground">Token catch</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {live ? `${Math.ceil(leftMs / 1000)}s` : "Ten seconds. Tap the stars."}
          </p>
        </div>
        <Button
          type="button"
          variant={live ? "outline" : "default"}
          className="h-10 rounded-full px-5"
          disabled={live}
          onClick={start}
        >
          Play
        </Button>
      </div>
      <div
        className={cn(
          "relative mt-4 min-h-40 rounded-2xl ring-1 ring-border",
          live && "bg-primary/5",
        )}
      >
        {live
          ? stars.map((star) => (
              <button
                key={star.id}
                type="button"
                aria-label="Catch a token"
                className="sprite-catch-star"
                style={{ left: `${star.left}%`, top: `${star.top}%` }}
                onClick={() => grab(star.id)}
              >
                <SparkleMark size={22} />
              </button>
            ))
          : (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              {caught > 0 ? `${caught} caught last round.` : "Ready when you are."}
            </p>
          )}
      </div>
    </section>
  );
}
