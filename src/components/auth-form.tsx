"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DemoBadge } from "@/components/demo-badge";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logIn, signUp, useAuth } from "@/lib/auth";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (auth.hydrated && auth.user) {
      router.replace("/dashboard");
    }
  }, [auth.hydrated, auth.user, router]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const result =
      mode === "signup"
        ? await signUp(email, password)
        : await logIn(email, password);
    setPending(false);
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    router.push(mode === "signup" ? "/profile" : "/dashboard");
  }

  const isSignup = mode === "signup";

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-12">
      <Wordmark />
      <h1 className="mt-8 text-4xl text-foreground">
        {isSignup ? "Create a demo account" : "Log in"}
      </h1>
      <DemoBadge className="mt-4">This browser only</DemoBadge>

      <form className="mt-8 space-y-4" onSubmit={onSubmit}>
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
              ? "Create account"
              : "Log in"}
        </Button>
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
