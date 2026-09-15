"use client";

import { PageFrame } from "@/components/page-frame";

/** Future billing stub — no live subscribe UI in this demo. */
export default function SubscriptionPage() {
  return (
    <PageFrame width="form">
      <div className="flux-card px-6 py-8 sm:px-8">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Free demo
        </p>
        <h1 className="mt-3 text-4xl text-foreground">No subscription</h1>
        <p className="mt-4 text-sm leading-6 text-zinc-400">
          This build is free to use. Billing can come back later; nothing here
          asks you to pay.
        </p>
      </div>
    </PageFrame>
  );
}
