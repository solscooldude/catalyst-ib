"use client";

import { useEffect } from "react";
import { ExtensionSync } from "@/components/extension-sync";
import { ThemeApplier } from "@/components/theme-applier";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getAuthSnapshot, hydrateAuth } from "@/lib/auth";
import { claimDailyLogin, hydrateStore } from "@/lib/store";

export function CatalystProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    hydrateAuth();
    const userId = getAuthSnapshot().user?.id ?? null;
    hydrateStore(userId);
    if (userId) claimDailyLogin();
  }, []);

  return (
    <TooltipProvider>
      <ThemeApplier />
      <ExtensionSync>{children}</ExtensionSync>
    </TooltipProvider>
  );
}
