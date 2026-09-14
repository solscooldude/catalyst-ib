"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Spark } from "@/components/spark";
import { ROUTES } from "@/lib/routes";
import { idleSubjectMoments } from "@/lib/spark-flavor";
import { useCatalyst } from "@/lib/store";

type Moment = ReturnType<typeof idleSubjectMoments>[number];

function studying(pathname: string, sessionStatus?: string | null) {
  return (
    pathname === ROUTES.lock ||
    pathname === ROUTES.session ||
    sessionStatus === "locked" ||
    sessionStatus === "focus"
  );
}

export function IdleSubjectPopup() {
  const pathname = usePathname();
  const state = useCatalyst();
  const [moment, setMoment] = useState<Moment | null>(null);

  const inFocus = studying(pathname, state.session?.status);
  const catalogKey = `${state.profile.complete}:${state.profile.subjects.join(",")}`;

  useEffect(() => {
    const catalog = idleSubjectMoments(state.profile);
    if (!state.hydrated || inFocus || catalog.length === 0) {
      setMoment(null);
      return;
    }

    let hideTimer = 0;
    let waitTimer = 0;
    let cancelled = false;

    function later(first: boolean) {
      const delay = first
        ? 8000 + Math.random() * 4000
        : 52000 + Math.random() * 28000;
      waitTimer = window.setTimeout(() => {
        if (cancelled) return;
        const pick = catalog[Math.floor(Math.random() * catalog.length)];
        if (!pick) return;
        setMoment(pick);
        hideTimer = window.setTimeout(() => {
          if (!cancelled) setMoment(null);
          later(false);
        }, 3400);
      }, delay);
    }

    later(true);
    return () => {
      cancelled = true;
      window.clearTimeout(waitTimer);
      window.clearTimeout(hideTimer);
    };
  }, [state.hydrated, inFocus, catalogKey, state.profile]);

  if (!moment) return null;

  return (
    <div
      className="pointer-events-none fixed right-4 bottom-5 z-40 sm:right-6"
      role="status"
      aria-live="polite"
    >
      <div className="idle-subject-pop flex items-center gap-3 rounded-2xl border border-white/10 bg-[#121218]/92 px-3 py-2.5 shadow-[0_18px_40px_-24px_rgb(0_0_0_/_0.9)] backdrop-blur-md">
        <Spark
          mood="idle"
          flavor={moment.flavor}
          hint={moment.label}
          size={52}
          flourish="now"
          className="shrink-0"
        />
        <div className="min-w-0 pr-1">
          <p className="text-[10px] tracking-[0.16em] text-primary uppercase">
            Still on your diploma
          </p>
          <p className="mt-0.5 text-sm text-zinc-100">{moment.label}</p>
        </div>
      </div>
    </div>
  );
}
