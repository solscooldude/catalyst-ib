"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageFrame } from "@/components/page-frame";
import { SpriteRename } from "@/components/sprite-rename";
import { updateEmail, updatePassword, useAuth } from "@/lib/auth";
import { setSoundMuted, useCatalyst } from "@/lib/store";

export default function SettingsPage() {
  const auth = useAuth();
  const store = useCatalyst();
  const [emailDraft, setEmailDraft] = useState<string | null>(null);
  const email = emailDraft ?? auth.user?.email ?? "";
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [emailNotice, setEmailNotice] = useState<string | null>(null);
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);

  async function saveEmail(event: React.FormEvent) {
    event.preventDefault();
    const result = await updateEmail(email, emailPassword);
    setEmailNotice(result.ok ? "Email updated." : result.reason);
    if (result.ok) setEmailPassword("");
  }

  async function savePassword(event: React.FormEvent) {
    event.preventDefault();
    const result = await updatePassword(currentPassword, nextPassword);
    setPasswordNotice(result.ok ? "Password updated." : result.reason);
    if (result.ok) {
      setCurrentPassword("");
      setNextPassword("");
    }
  }

  return (
    <PageFrame width="form">
      <div className="flux-card px-6 py-8 sm:px-8">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Settings
        </p>
        <h1 className="mt-3 text-4xl text-foreground">Account</h1>
      </div>

      <div className="flux-card px-6 py-8">
        <SpriteRename />
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

      <form className="flux-card space-y-4 px-6 py-8" onSubmit={saveEmail}>
        <h2 className="text-lg text-foreground">Email</h2>
        <div className="space-y-2">
          <Label htmlFor="email">Linked email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmailDraft(event.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-password">Current password</Label>
          <Input
            id="email-password"
            type="password"
            value={emailPassword}
            onChange={(event) => setEmailPassword(event.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        {emailNotice ? <p className="text-sm text-foreground">{emailNotice}</p> : null}
        <Button type="submit" className="h-11 rounded-full px-6">
          Save email
        </Button>
      </form>

      <form className="flux-card space-y-4 px-6 py-8" onSubmit={savePassword}>
        <h2 className="text-lg text-foreground">Reset password</h2>
        <div className="space-y-2">
          <Label htmlFor="current-password">Current password</Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="next-password">New password</Label>
          <Input
            id="next-password"
            type="password"
            value={nextPassword}
            onChange={(event) => setNextPassword(event.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
        {passwordNotice ? (
          <p className="text-sm text-foreground">{passwordNotice}</p>
        ) : null}
        <Button type="submit" className="h-11 rounded-full px-6">
          Save password
        </Button>
      </form>
    </PageFrame>
  );
}
