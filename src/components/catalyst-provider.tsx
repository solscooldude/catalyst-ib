"use client";

import { useEffect } from "react";
import { ThemeApplier } from "@/components/theme-applier";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAuthSnapshot, hydrateAuth } from "@/lib/auth";
import { hydrateStore } from "@/lib/store";

export function CatalystProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    hydrateAuth();
    hydrateStore(getAuthSnapshot().user?.id ?? null);
  }, []);

  return (
    <TooltipProvider>
      <ThemeApplier />
      {children}
    </TooltipProvider>
  );
}
