import Link from "next/link";
import { ArrowRight, Lock, NotebookPen, Smartphone } from "lucide-react";
import { LandingHeader } from "@/components/landing-header";
import { TokenAmount } from "@/components/mint-chip";
import { PhoneLock } from "@/components/phone-lock";
import { BrandC, SparkleMark } from "@/components/brand-marks";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { PRICING, UNLOCK_CATALOG } from "@/lib/constants";

const STEPS = [
  {
    n: "01",
    title: "Phone lock",
    copy: "The apps you name go grey. Calls, SOS, and essentials stay available.",
    icon: Smartphone,
  },
  {
    n: "02",
    title: "Work",
    copy: "Stay on the laptop. Pick a ManageBac task or a study block and finish it there.",
    icon: NotebookPen,
  },
  {
    n: "03",
    title: "Tokens",
    copy: "This demo pays 10 tokens per 20 seconds when you End. The production target is 1 token per 2 minutes.",
    icon: "chip" as const,
  },
  {
    n: "04",
    title: "Unlock",
    copy: "Spend tokens for 10 minutes. Notes is 2, YouTube is 4, and your nemesis apps are 8.",
    icon: Lock,
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <LandingHeader />

      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-6xl items-center gap-16 px-5 pt-8 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
          <div>
            <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
              For IB Diploma Programme students
            </p>
            <h1 className="mt-5 max-w-xl text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
              Apps pull you off ManageBac. You unlock them after the work is
              done.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              TikTok, Instagram, and the rest sit next to the IA, TOK essay, or
              EE. Catalyst greys the apps you name. You stay on the laptop
              until a task is marked done or a study block finishes. Tokens
              come from those minutes of real work. Then you buy a short
              unlock.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 rounded-full px-6 text-sm">
                <Link href="/signup">
                  Start free month
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-border px-6 text-sm"
              >
                <Link href="#how">See how it works</Link>
              </Button>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              First month free, then {PRICING.then.toLowerCase()}. Phone lock
              and ManageBac are simulated in this demo.
            </p>
          </div>
          <PhoneLock compact nemeses={["tiktok", "instagram"]} />
        </section>

        <section className="border-y border-border">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2">
            <div>
              <p className="text-xs tracking-[0.2em] text-primary uppercase">
                The problem
              </p>
              <h2 className="mt-3 text-4xl text-foreground sm:text-5xl">
                The phone takes the hour you needed for the IA.
              </h2>
            </div>
            <div className="self-end space-y-4 text-base leading-7 text-muted-foreground">
              <p>
                ManageBac work is on the laptop. The distracting apps are on
                the phone beside it. A five-minute check becomes the block you
                meant for TOK or the EE.
              </p>
              <p>
                You get those apps back only after a session that actually ran.
                Tokens come from focus time, plus a bonus when an official
                ManageBac task is marked complete. No unlock without that
                proof.
              </p>
            </div>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-5 py-20">
          <p className="text-xs tracking-[0.2em] text-primary uppercase">
            How it works
          </p>
          <h2 className="mt-3 max-w-xl text-4xl text-foreground sm:text-5xl">
            What happens in a session
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="rounded-3xl bg-card p-6 ring-1 ring-border"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary">{step.n}</span>
                  {step.icon === "chip" ? (
                    <SparkleMark size={16} />
                  ) : (
                    <step.icon className="size-4 text-muted-foreground" />
                  )}
                </div>
                <h3 className="mt-6 text-2xl text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20">
          <div className="rounded-[2rem] bg-card p-6 ring-1 ring-border sm:p-10">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs tracking-[0.2em] text-primary uppercase">
                  Token costs
                </p>
                <h2 className="mt-3 text-4xl text-foreground">
                  What 10 minutes costs
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                This demo pays 10 tokens per 20 seconds when you End. Production
                target is 1 token per 2 minutes.
              </p>
            </div>
            <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/70 text-xs tracking-[0.14em] text-muted-foreground uppercase">
                  <tr>
                    <th className="px-5 py-3 font-medium">Unlock</th>
                    <th className="px-5 py-3 font-medium">Intensity</th>
                    <th className="px-5 py-3 font-medium">Per 10 min</th>
                  </tr>
                </thead>
                <tbody>
                  {UNLOCK_CATALOG.map((row) => (
                    <tr key={row.id} className="border-t border-border">
                      <td className="px-5 py-4">
                        <div className="font-medium text-foreground">{row.name}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {row.blurb}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {row.intensity}
                      </td>
                      <td className="px-5 py-4 text-primary">
                        <TokenAmount value={row.cost} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="border-t border-border">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 lg:grid-cols-2">
            <div>
              <p className="text-xs tracking-[0.2em] text-primary uppercase">
                Pricing
              </p>
              <h2 className="mt-3 text-4xl text-foreground sm:text-5xl">
                First month free, then $2 a month
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
                This build is a product demo. Sign up creates a demo account in
                this browser — not a real checkout.
              </p>
              <Button asChild className="mt-8 h-12 rounded-full px-6">
                <Link href="/signup">
                  Try the demo
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-[2rem] bg-card p-8 ring-1 ring-border">
              <p className="font-heading text-3xl text-foreground">
                What the demo includes
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Laptop focus plus a ManageBac task marked done. The apps you
                named as nemesis cost the most tokens to unlock.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  Personal lock. No social sprints in v1.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  Mock ManageBac list: Bio IA, TOK, Math AA, Chem, EE.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  Simulated Screen Time. Your OS is untouched.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <Wordmark />
          <p className="inline-flex items-center gap-2">
            <BrandC size={18} />
            v1 demo for IB DP students. Phone lock and ManageBac are simulated.
          </p>
        </div>
      </footer>
    </div>
  );
}
