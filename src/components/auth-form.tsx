"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DemoBadge } from "@/components/demo-badge";
import { LockHoursPicker } from "@/components/lock-hours-picker";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logIn, signUp, useAuth } from "@/lib/auth";
import { WEEKNIGHT_PRESET, validateWindow } from "@/lib/schedule";
import { addLockWindow } from "@/lib/store";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [step, setStep] = useState<"account" | "locks">("account");
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [start, setStart] = useState("19:00");
  const [end, setEnd] = useState("22:00");

  useEffect(() => {
    if (auth.hydrated && auth.user && mode === "login") {
      router.replace("/dashboard");
    }
  }, [auth.hydrated, auth.user, mode, router]);

  async function finishSignup(window: {
    days: number[];
    start: string;
    end: string;
    enabled: boolean;
  }) {
    const check = validateWindow(window);
    if (!check.ok) {
      setError(check.reason);
      return;
    }
    setPending(true);
    setError(null);
    const result = await signUp(email, password);
    if (!result.ok) {
      setPending(false);
      setError(result.reason);
      setStep("account");
      return;
    }
    const lock = addLockWindow(window);
    setPending(false);
    if (!lock.ok) {
      setError(lock.reason);
      return;
    }
    router.push("/intro");
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (mode === "signup") {
      if (step === "account") {
        if (!email.includes("@") || password.length < 6) {
          setError(
            password.length < 6
              ? "Use at least 6 characters."
              : "Enter a valid email.",
          );
          return;
        }
        setError(null);
        setStep("locks");
        return;
      }
      await finishSignup({ days, start, end, enabled: true });
      return;
    }
    setPending(true);
    setError(null);
    const result = await logIn(email, password);
    setPending(false);
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    router.push("/intro");
  }

  const isSignup = mode === "signup";
  const lockStep = isSignup && step === "locks";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-12">
      <Wordmark />
      <h1 className="mt-8 text-4xl text-foreground">
        {lockStep
          ? "Set lock hours"
          : isSignup
            ? "Create a demo account"
            : "Log in"}
      </h1>
      {lockStep ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Required. Learn the main feature now: quiet hours when Catalyst
          locks your nemesis apps.
        </p>
      ) : (
        <DemoBadge className="mt-4">This browser only</DemoBadge>
      )}

      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
        {lockStep ? (
          <>
            <LockHoursPicker
              days={days}
              start={start}
              end={end}
              error={error}
              onToggleDay={(day) =>
                setDays((current) =>
                  current.includes(day)
                    ? current.filter((row) => row !== day)
                    : [...current, day],
                )
              }
              onStart={setStart}
              onEnd={setEnd}
              onAdd={() => {
                void finishSignup({ days, start, end, enabled: true });
              }}
              onPreset={() => {
                void finishSignup(WEEKNIGHT_PRESET);
              }}
              addLabel={pending ? "Working…" : "Create account"}
            />
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => {
                setStep("account");
                setError(null);
              }}
            >
              Back
            </button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 rounded-xl"
                minLength={6}
                required
              />
            </div>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <Button
              type="submit"
              className="h-11 w-full rounded-full"
              disabled={pending}
            >
              {pending
                ? "Working…"
                : isSignup
                  ? "Continue"
                  : "Log in"}
            </Button>
          </>
        )}
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        {isSignup ? (
          <>
            Already have a demo account?{" "}
            <Link href="/login" className="text-primary">
              Log in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="text-primary">
              Sign up
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
