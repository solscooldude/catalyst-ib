"use client";

import { useEffect } from "react";
import { ClerkProvider, useClerk, useUser } from "@clerk/nextjs";
import { syncClerkSession } from "@/lib/auth";

const clerkAppearance = {
  variables: {
    colorPrimary: "#5EEAD4",
    colorBackground: "#121218",
    colorForeground: "#F4F4F5",
    colorText: "#F4F4F5",
    colorInputBackground: "#0B0B0F",
    colorInputText: "#F4F4F5",
    colorNeutral: "#A1A1AA",
    borderRadius: "0.9rem",
  },
  elements: {
    card: "bg-[#121218] shadow-none ring-1 ring-[#F4F4F5]/10",
    headerTitle: "text-[#F4F4F5]",
    headerSubtitle: "text-[#A1A1AA]",
    socialButtonsBlockButton:
      "bg-[#0B0B0F] text-[#F4F4F5] ring-1 ring-[#F4F4F5]/10",
    formFieldInput: "bg-[#0B0B0F] text-[#F4F4F5]",
    footerActionLink: "text-[#5EEAD4]",
  },
};

function ClerkSessionBridge() {
  const { isLoaded, user } = useUser();
  const { signOut } = useClerk();

  useEffect(() => {
    syncClerkSession({
      loaded: isLoaded,
      user: user
        ? {
            id: user.id,
            primaryEmailAddress: user.primaryEmailAddress,
            emailAddresses: user.emailAddresses,
            imageUrl: user.imageUrl,
          }
        : null,
      signOut: () => signOut({ redirectUrl: "/" }),
    });
  }, [isLoaded, user, signOut]);

  return null;
}

export function ClerkRuntime({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      appearance={clerkAppearance}
    >
      <ClerkSessionBridge />
      {children}
    </ClerkProvider>
  );
}
