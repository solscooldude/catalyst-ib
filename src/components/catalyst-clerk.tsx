"use client";

import dynamic from "next/dynamic";
import { isClerkConfigured } from "@/lib/clerk-config";

const ClerkRuntime = dynamic(
  () => import("@/components/clerk-runtime").then((mod) => mod.ClerkRuntime),
  { ssr: false },
);

export function CatalystClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isClerkConfigured()) return children;
  return <ClerkRuntime>{children}</ClerkRuntime>;
}
