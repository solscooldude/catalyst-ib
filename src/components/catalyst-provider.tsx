"use client";

import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { hydrateStore } from "@/lib/store";

export function CatalystProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    hydrateStore();
  }, []);

  return <TooltipProvider>{children}</TooltipProvider>;
}
