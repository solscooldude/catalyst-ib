"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useCatalyst } from "@/lib/store";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const auth = useAuth();
  const store = useCatalyst();

  useEffect(() => {
    if (auth.hydrated && !auth.user) {
      router.replace("/login");
    }
  }, [auth.hydrated, auth.user, router]);

  if (!auth.hydrated || !store.hydrated || !auth.user) {
    return (
      <div className="grid gap-4">
        <div className="h-8 w-48 animate-pulse rounded-full bg-white/6" />
        <div className="h-48 animate-pulse rounded-3xl bg-white/4" />
      </div>
    );
  }

  return children;
}
