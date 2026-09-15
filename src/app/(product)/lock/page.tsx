"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { enterFocus, useCatalyst } from "@/lib/store";

/** Legacy /lock bookmarks skip the iPhone preview and enter the session. */
export default function LockPage() {
  const router = useRouter();
  const state = useCatalyst();

  useEffect(() => {
    if (!state.hydrated) return;
    if (!state.setupComplete) {
      router.replace(ROUTES.setup);
      return;
    }
    if (!state.session) {
      router.replace(ROUTES.focus);
      return;
    }
    if (state.session.status === "completed") {
      router.replace(`${ROUTES.home}#unlocks`);
      return;
    }
    if (state.session.status === "locked") {
      enterFocus();
    }
    router.replace(ROUTES.session);
  }, [state.hydrated, state.setupComplete, state.session, router]);

  return null;
}
