"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DemoBadge } from "@/components/demo-badge";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function LandingHeader() {
  const auth = useAuth();

  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
      <Wordmark />
      <div className="flex items-center gap-2 sm:gap-3">
        <DemoBadge className="hidden sm:inline-flex">Interactive demo</DemoBadge>
        {auth.user ? (
          <Button asChild className="h-9 rounded-full px-4">
            <Link href="/dashboard">
              Go to dashboard
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        ) : (
          <>
            <Button
              asChild
              variant="ghost"
              className="h-9 rounded-full px-3 text-muted-foreground"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild className="h-9 rounded-full px-4">
              <Link href="/signup">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
