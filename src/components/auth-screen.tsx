"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { ConnectAuthCard } from "@/components/connect-auth";
import { isClerkConfigured } from "@/lib/clerk-config";
import { startLocalSession, useAuth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

const ClerkAuthForms = dynamic(
  () => import("@/components/clerk-auth-forms").then((mod) => mod.ClerkAuthForms),
  { ssr: false },
);

export function AuthScreen({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const auth = useAuth();
  const clerkReady = isClerkConfigured();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (auth.hydrated && auth.user) {
      router.replace(ROUTES.home);
    }
  }, [auth.hydrated, auth.user, router]);

  function continueLocally() {
    const result = startLocalSession();
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    router.push(ROUTES.intro);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-12">
      <Wordmark />
      <h1 className="mt-8 text-4xl text-foreground">
        {mode === "sign-up" ? "Create your account" : "Sign in"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Google or email. Your lock hours, tokens, sprite, and unlocks follow
        the account — not just this browser.
      </p>

      {clerkReady ? (
        <div className="mt-8">
          <ClerkAuthForms mode={mode} />
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <ConnectAuthCard />
          <div className="rounded-[1.6rem] bg-[#121218] p-6 ring-1 ring-[#F4F4F5]/10">
            <h2 className="text-lg text-foreground">This browser only</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Use Catalyst here while Clerk keys are missing. This is not a
              cross-browser account.
            </p>
            {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
            <Button
              className="mt-5 h-11 w-full rounded-full"
              onClick={continueLocally}
            >
              Continue in this browser
            </Button>
          </div>
        </div>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        {mode === "sign-up" ? (
          <>
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/sign-up" className="text-primary">
              Create an account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
