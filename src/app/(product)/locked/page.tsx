"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PageFrame } from "@/components/page-frame";
import { ROUTES } from "@/lib/routes";

function LockedInner() {
  const params = useSearchParams();
  const name = params.get("app") || "This site";
  const host = params.get("host") || "";
  const tier = params.get("tier") || "";

  return (
    <PageFrame width="form">
      <section className="flux-card px-6 py-8 sm:px-8">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Lock hours
        </p>
        <h1 className="mt-3 text-4xl text-foreground">{name} is locked</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Lock hours are on. Catalyst only blocks distracting sites — Docs,
          Classroom, and the rest of the school allowlist stay open.
        </p>
        {host || tier ? (
          <p className="mt-2 text-xs text-muted-foreground">
            {[
              host,
              tier === "nemesis"
                ? "Nemesis · spend Tier 3 + 1 extra token"
                : tier === "tier3"
                  ? "Tier 3 social"
                  : tier === "tier2"
                    ? "Tier 2"
                    : "",
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        ) : null}
        <Button asChild className="mt-6 h-11 rounded-full px-6">
          <Link href={ROUTES.unlocks}>Spend tokens to unlock</Link>
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          The Chrome extension reads the unlock timer from this tab and lets
          the site through until it ends.
        </p>
      </section>
    </PageFrame>
  );
}

export default function LockedPage() {
  return (
    <Suspense>
      <LockedInner />
    </Suspense>
  );
}
