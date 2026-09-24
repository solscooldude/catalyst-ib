"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageFrame } from "@/components/page-frame";
import { SpriteRename } from "@/components/sprite-rename";
import { logOut, useAuth } from "@/lib/auth";
import { AllowlistSettings } from "@/components/allowlist-settings";
import { ConnectAuthCard } from "@/components/connect-auth";
import { LockExtensionSetup } from "@/components/lock-extension-setup";
import { isClerkConfigured } from "@/lib/clerk-config";
import { saveCloudState } from "@/lib/cloud-sync";
import { setSoundMuted, useCatalyst } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const auth = useAuth();
  const store = useCatalyst();
  const clerkReady = isClerkConfigured();
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function saveNow() {
    if (auth.user?.source !== "clerk") {
      setSyncNotice("Sign in with Google or email to save across browsers.");
      return;
    }
    setPending(true);
    try {
      await saveCloudState();
      setSyncNotice("Saved to your account.");
    } catch {
      setSyncNotice("Could not save. Check Clerk keys and try again.");
    }
    setPending(false);
  }

  return (
    <PageFrame width="form">
      <div className="flux-card px-6 py-8 sm:px-8">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Settings
        </p>
        <h1 className="mt-3 text-4xl text-foreground">Account</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Lock hours, unlocks, and the school allowlist sync to the Chrome
          extension from this tab. Signed-in accounts also save tokens, sprite
          care, and your schedule to Clerk.
        </p>
      </div>

      {!clerkReady ? (
        <div className="flux-card space-y-6 px-6 py-8">
          <ConnectAuthCard compact />
          {auth.user?.source === "local" ? (
            <div className="space-y-3 border-t border-white/8 pt-6">
              <h2 className="text-lg text-foreground">On this device</h2>
              <p className="text-sm text-muted-foreground">
                This session stays here until you sign in with Google or email.
              </p>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-full px-6"
                onClick={async () => {
                  await logOut();
                  router.push("/sign-in");
                }}
              >
                Sign out
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flux-card space-y-4 px-6 py-8">
          <h2 className="text-lg text-foreground">Signed in</h2>
          <p className="text-sm text-muted-foreground">
            {auth.user?.email || "Google or email account"}
            {auth.user?.source === "clerk"
              ? " · saved on this account"
              : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="h-11 rounded-full px-6"
              disabled={pending}
              onClick={() => void saveNow()}
            >
              {pending ? "Saving…" : "Save to account"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-full px-6"
              onClick={async () => {
                await logOut();
                router.push("/sign-in");
              }}
            >
              Sign out
            </Button>
          </div>
          {syncNotice ? (
            <p className="text-sm text-foreground">{syncNotice}</p>
          ) : null}
        </div>
      )}

      <div className="flux-card px-6 py-8">
        <LockExtensionSetup />
      </div>

      <div className="flux-card px-6 py-8">
        <SpriteRename />
      </div>

      <div className="flux-card px-6 py-8">
        <AllowlistSettings />
      </div>

      <div className="flux-card px-6 py-8">
        <h2 className="text-lg text-foreground">Sound</h2>
        <label className="mt-4 flex items-center gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            checked={store.soundMuted}
            onChange={(event) => setSoundMuted(event.target.checked)}
            className="size-4 accent-[var(--primary)]"
          />
          Mute soft sounds
        </label>
      </div>
    </PageFrame>
  );
}
