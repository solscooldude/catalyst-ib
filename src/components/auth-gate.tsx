"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";
import { useCatalyst } from "@/lib/store";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();
  const store = useCatalyst();

  useEffect(() => {
    if (auth.hydrated && !auth.user) {
      router.replace("/login");
      return;
    }
    if (
      auth.hydrated &&
      store.hydrated &&
      auth.user &&
      !store.profile.complete &&
      pathname !== ROUTES.profile
    ) {
      router.replace(ROUTES.profile);
    }
  }, [auth.hydrated, auth.user, store.hydrated, store.profile.complete, pathname, router]);

  const waiting =
    !auth.hydrated ||
    !store.hydrated ||
    !auth.user ||
    (!store.profile.complete && pathname !== ROUTES.profile);

  if (waiting) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-4 py-12">
        <div className="grid gap-4">
          <div className="h-8 w-48 animate-pulse rounded-full bg-white/6" />
          <div className="h-48 animate-pulse rounded-3xl bg-white/4" />
        </div>
      </div>
    );
  }

  return children;
}
