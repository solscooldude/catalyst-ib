"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { ROUTES } from "@/lib/routes";

export function ClerkAuthForms({ mode }: { mode: "sign-in" | "sign-up" }) {
  if (mode === "sign-up") {
    return (
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl={ROUTES.intro}
      />
    );
  }
  return (
    <SignIn
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
      fallbackRedirectUrl={ROUTES.home}
    />
  );
}
