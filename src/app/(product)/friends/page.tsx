"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageFrame } from "@/components/page-frame";
import { ROUTES } from "@/lib/routes";
import { useCatalyst } from "@/lib/store";
import Link from "next/link";

export default function FriendsPage() {
  const state = useCatalyst();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(state.friendCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <PageFrame width="mid">
      <section className="flux-card px-6 py-8 sm:px-8">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Friends
        </p>
        <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">Friend code</h1>
      </section>

      <section className="flux-card px-6 py-6">
        <p className="font-heading text-3xl tracking-[0.12em] text-foreground">
          {state.friendCode}
        </p>
        <Button
          type="button"
          className="mt-5 h-11 rounded-full px-6"
          onClick={copy}
        >
          {copied ? "Copied" : "Copy code"}
        </Button>
      </section>

      <section className="flux-card px-6 py-6">
        <h2 className="text-lg text-foreground">Task race</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Same ManageBac task. First to end the focus block wins. Add codes
          here next — this page just holds your code for now.
        </p>
        <Button asChild variant="outline" className="mt-5 h-11 rounded-full px-5">
          <Link href={ROUTES.focus}>Open Focus</Link>
        </Button>
      </section>
    </PageFrame>
  );
}
