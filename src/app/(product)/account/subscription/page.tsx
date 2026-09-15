"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PRICING } from "@/lib/constants";
import { PageFrame } from "@/components/page-frame";
import {
  readSubscription,
  writeSubscription,
  type SubscriptionState,
} from "@/lib/subscription";

export default function SubscriptionPage() {
  const [plan, setPlan] = useState<SubscriptionState>(() => readSubscription());

  function toggle() {
    const next: SubscriptionState = {
      plan: "monthly",
      status: plan.status === "active" ? "canceled" : "active",
    };
    writeSubscription(next);
    setPlan(next);
  }

  return (
    <PageFrame width="form">
      <div className="flux-card px-6 py-8 sm:px-8">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Subscription
        </p>
        <h1 className="mt-3 text-4xl text-foreground">Catalyst monthly</h1>
        <p className="mt-4 text-3xl font-heading text-foreground">{PRICING.then}</p>
        <p className="mt-2 text-sm text-zinc-400">
          {plan.status === "active" ? "Active on this demo account." : "Canceled. Restart anytime."}
        </p>
        <Button className="mt-6 h-11 rounded-full px-6" onClick={toggle}>
          {plan.status === "active" ? "Cancel monthly" : "Restart monthly"}
        </Button>
      </div>
    </PageFrame>
  );
}
