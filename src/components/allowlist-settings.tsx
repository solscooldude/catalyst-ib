"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BLOCK_APPS, DEFAULT_ALLOWLIST } from "@/lib/domain-policy";
import {
  addAllowlistHost,
  removeAllowlistHost,
  useCatalyst,
} from "@/lib/store";

export function AllowlistSettings() {
  const state = useCatalyst();
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  function add(event: React.FormEvent) {
    event.preventDefault();
    const result = addAllowlistHost(draft);
    if (!result.ok) {
      setNotice(result.reason);
      return;
    }
    setDraft("");
    setNotice("School site added. The extension picks this up from this tab.");
  }

  const blocked = {
    tier2: BLOCK_APPS.filter((app) => app.tier === "tier2"),
    tier3: BLOCK_APPS.filter((app) => app.tier === "tier3"),
    nemesis: BLOCK_APPS.filter((app) => app.tier === "nemesis"),
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg text-foreground">School allowlist</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          These hosts always stay open in lock hours. The Chrome extension never
          blocks them. Add your school portal if it is not listed.
        </p>
        <ul className="mt-4 space-y-2">
          {DEFAULT_ALLOWLIST.map((entry) => (
            <li
              key={entry.id}
              className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-900"
            >
              <p className="text-foreground">{entry.label}</p>
              <p className="text-xs text-muted-foreground">
                {entry.hosts.join(" · ")}
              </p>
            </li>
          ))}
        </ul>
        <form className="mt-4 space-y-3" onSubmit={add}>
          <div className="space-y-2">
            <Label htmlFor="allow-host">Add a school site</Label>
            <Input
              id="allow-host"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="school.edu"
              className="h-11 rounded-xl"
            />
          </div>
          <Button type="submit" className="h-11 rounded-full px-6">
            Add to allowlist
          </Button>
        </form>
        {state.allowlistExtra.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No extra school sites yet.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {state.allowlistExtra.map((host) => (
              <li
                key={host}
                className="flex items-center justify-between gap-3 rounded-2xl bg-primary/10 px-4 py-3"
              >
                <p className="text-sm text-foreground">{host}</p>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-full px-4"
                  onClick={() => {
                    removeAllowlistHost(host);
                    setNotice(`Removed ${host}.`);
                  }}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
        {notice ? (
          <p className="mt-3 text-sm text-muted-foreground">{notice}</p>
        ) : null}
      </section>

      <section>
        <h2 className="text-lg text-foreground">Blocked in lock hours</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Unknown sites stay open. Only these distractors are blocked, unless a
          paid unlock window is active.
        </p>
        {(
          [
            ["Tier 2", blocked.tier2],
            ["Tier 3 social", blocked.tier3],
            ["Nemesis", blocked.nemesis],
          ] as const
        ).map(([label, apps]) => (
          <div key={label} className="mt-4">
            <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-400 uppercase">
              {label}
            </p>
            <ul className="mt-2 space-y-2">
              {apps.map((app) => (
                <li
                  key={app.id}
                  className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-900"
                >
                  <p className="text-foreground">{app.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {app.hosts.join(" · ")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
