import Link from "next/link";
import {
  ArrowRight,
  Lock,
  NotebookPen,
  Smartphone,
  Timer,
} from "lucide-react";
import { DemoBadge } from "@/components/demo-badge";
import { PhoneLock } from "@/components/phone-lock";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { UNLOCK_CATALOG } from "@/lib/constants";

const STEPS = [
  {
    n: "01",
    title: "Phone lock",
    copy: "Your nemesis app greys out. Emergency and the boring essentials stay.",
    icon: Smartphone,
  },
  {
    n: "02",
    title: "Work",
    copy: "Pick a ManageBac task. Stay on the laptop. The scroll can wait.",
    icon: NotebookPen,
  },
  {
    n: "03",
    title: "Tokens",
    copy: "One token every five minutes of proven focus. Demo speed exists so you can try it.",
    icon: Timer,
  },
  {
    n: "04",
    title: "Unlock",
    copy: "Spend tokens for ten minutes. Notes is cheap. Your nemesis is not.",
    icon: Lock,
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <Wordmark />
        <div className="flex items-center gap-3">
          <DemoBadge className="hidden sm:inline-flex">Interactive demo</DemoBadge>
          <Button asChild className="h-9 rounded-full px-4">
            <Link href="/app">
              Open the app
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-6xl items-center gap-16 px-5 pt-8 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
          <div>
            <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
              For IB DP students who know the next scroll won’t write the IA
            </p>
            <h1 className="mt-5 max-w-xl text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
              Prove the work.
              <br />
              Earn the unlock.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              Catalyst is a personal focus tool — not a group sprint. It locks
              the phone you hide under the desk, watches a ManageBac task get
              finished, and only then sells you TikTok time.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 rounded-full px-6 text-sm">
                <Link href="/app">
                  Start free month
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-white/10 px-6 text-sm"
              >
                <Link href="#how">See how it works</Link>
              </Button>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              First month free, then about $9.99. Laptop focus + a marked-done
              task is the proof — simulated here so you can feel the loop.
            </p>
          </div>
          <PhoneLock compact />
        </section>

        <section className="border-y border-white/6">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2">
            <div>
              <p className="text-xs tracking-[0.2em] text-primary uppercase">
                The problem
              </p>
              <h2 className="mt-3 text-4xl text-foreground sm:text-5xl">
                You sat down for TOK.
                <br />
                TikTok sat down harder.
              </h2>
            </div>
            <p className="self-end text-base leading-7 text-muted-foreground">
              IB DP is a deadline factory. The For You page is a slot machine.
              You open Instagram “for a second,” lose the Chemistry block, then
              promise the Extended Essay you’ll start after one more video. You
              don’t need a study group cheering. You need the nemesis app to
              cost something.
            </p>
          </div>
        </section>

        <section id="how" className="mx-auto max-w-6xl px-5 py-20">
          <p className="text-xs tracking-[0.2em] text-primary uppercase">
            The loop
          </p>
          <h2 className="mt-3 max-w-xl text-4xl text-foreground sm:text-5xl">
            Phone lock → work → tokens → unlock.
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="rounded-3xl bg-card p-6 ring-1 ring-white/6"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-primary">{step.n}</span>
                  <step.icon className="size-4 text-muted-foreground" />
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
          <div className="rounded-[2rem] bg-card p-6 ring-1 ring-white/6 sm:p-10">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs tracking-[0.2em] text-primary uppercase">
                  Token costs
                </p>
                <h2 className="mt-3 text-4xl text-foreground">
                  Ten minutes. Priced by temptation.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                Earn 1 token per 5 minutes of focus. In this demo, 30 seconds
                can equal 1 token so you aren’t waiting on a real Pomodoro.
              </p>
            </div>
            <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-white/6">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/3 text-xs tracking-[0.14em] text-muted-foreground uppercase">
                  <tr>
                    <th className="px-5 py-3 font-medium">Unlock</th>
                    <th className="px-5 py-3 font-medium">Intensity</th>
                    <th className="px-5 py-3 font-medium">Per 10 min</th>
                  </tr>
                </thead>
                <tbody>
                  {UNLOCK_CATALOG.map((row) => (
                    <tr key={row.id} className="border-t border-white/6">
                      <td className="px-5 py-4">
                        <div className="font-medium text-foreground">{row.name}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {row.blurb}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {row.intensity}
                      </td>
                      <td className="px-5 py-4 font-mono text-primary">
                        {row.cost} tokens
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="border-t border-white/6">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 lg:grid-cols-2">
            <div>
              <p className="text-xs tracking-[0.2em] text-primary uppercase">
                Pricing tease
              </p>
              <h2 className="mt-3 text-4xl text-foreground sm:text-5xl">
                One month free.
                <br />
                Then about $9.99.
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
                Cheaper than the week you lose to one “quick” scroll before the
                IA deadline. This build is a product demo — no checkout, no
                account, tokens live in your browser.
              </p>
              <Button asChild className="mt-8 h-12 rounded-full px-6">
                <Link href="/app">
                  Enter Catalyst
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="rounded-[2rem] bg-card p-8 ring-1 ring-white/6">
              <p className="font-heading text-3xl text-foreground">
                Focus mode + ManageBac.
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Tokens for phone time — your nemesis app costs the most. Laptop
                stays open. Phone stays honest. The work is the receipt.
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

      <footer className="border-t border-white/6 px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <Wordmark />
          <p>Built as a v1 demo for IB DP students. Mint, not lime.</p>
        </div>
      </footer>
    </div>
  );
}
