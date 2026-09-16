"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DemoBadge } from "@/components/demo-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageFrame } from "@/components/page-frame";
import { ROUTES } from "@/lib/routes";
import { sourceLabel } from "@/lib/school-tasks";
import {
  connectClassroomLive,
  connectClassroomSample,
  connectManageBacImport,
  connectManageBacSample,
  useCatalyst,
} from "@/lib/store";
import type { SchoolTask } from "@/lib/school-tasks";

type ClassroomStatus = {
  credentialsReady: boolean;
  connected: boolean;
  email: string | null;
};

export default function IntegrationsPage() {
  const state = useCatalyst();
  const [status, setStatus] = useState<ClassroomStatus | null>(null);
  const [schoolUrl, setSchoolUrl] = useState(state.manageBacSchoolUrl);
  const [paste, setPaste] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void fetch("/api/classroom/status")
      .then((res) => res.json())
      .then((json: ClassroomStatus) => setStatus(json))
      .catch(() =>
        setStatus({ credentialsReady: false, connected: false, email: null }),
      );
  }, []);

  useEffect(() => {
    const flag = new URLSearchParams(window.location.search).get("classroom");
    if (flag === "ok") {
      void pullClassroom();
    } else if (flag === "needs-credentials") {
      setNotice("Google Cloud OAuth is not configured on this deploy yet.");
    } else if (flag === "denied" || flag === "error") {
      setNotice("Google sign-in did not finish. You can still load sample tasks.");
    }
  }, []);

  async function pullClassroom() {
    setPending(true);
    setNotice(null);
    try {
      const res = await fetch("/api/classroom/tasks");
      const json = (await res.json()) as {
        ok?: boolean;
        email?: string | null;
        tasks?: SchoolTask[];
        reason?: string;
      };
      if (!res.ok || !json.ok) {
        setNotice(
          json.reason === "needs-credentials"
            ? "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, then reconnect."
            : json.reason || "Classroom sync failed. Sample tasks are still available.",
        );
        return;
      }
      const result = connectClassroomLive({
        email: json.email ?? undefined,
        tasks: json.tasks ?? [],
      });
      setNotice(
        result.ok
          ? `Pulled ${result.count} Classroom task${result.count === 1 ? "" : "s"}.`
          : result.reason,
      );
    } finally {
      setPending(false);
    }
  }

  function loadClassroomSample() {
    const result = connectClassroomSample();
    setNotice(
      result.ok
        ? `Loaded ${result.count} sample Classroom tasks.`
        : result.reason,
    );
  }

  function loadManageBacSample() {
    const result = connectManageBacSample(schoolUrl);
    setNotice(
      result.ok
        ? `Loaded ${result.count} ManageBac-shaped tasks.`
        : result.reason,
    );
  }

  function importManageBac() {
    const result = connectManageBacImport(paste, schoolUrl);
    setNotice(result.ok ? `Imported ${result.count} tasks.` : result.reason);
  }

  return (
    <PageFrame width="mid">
      <section className="flux-card px-6 py-8 sm:px-8">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Integrations
        </p>
        <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
          School tasks
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Connect Google Classroom with a personal Google account when OAuth
          keys are set. ManageBac has no public student API — paste a list or
          load IB-shaped sample tasks. Everything here feeds Focus, quiz
          captions, and the completion bonus.
        </p>
      </section>

      <section className="flux-card space-y-4 px-6 py-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg text-foreground">Google Classroom</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Personal Google. Live pull needs a Google Cloud OAuth client
              with Classroom coursework read-only.
            </p>
          </div>
          <DemoBadge>
            {status?.credentialsReady
              ? status.connected
                ? "OAuth connected"
                : "OAuth ready"
              : "Needs Google Cloud credentials"}
          </DemoBadge>
        </div>
        {state.classroomConnected ? (
          <p className="text-sm text-foreground">
            {state.classroomMode === "oauth"
              ? `Connected${state.classroomEmail ? ` as ${state.classroomEmail}` : ""}.`
              : "Sample Classroom tasks are in Focus."}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button asChild className="h-11 rounded-full px-5">
            <a href="/api/classroom/start">Connect personal Google</a>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full px-5"
            disabled={pending}
            onClick={() => void pullClassroom()}
          >
            Sync Classroom
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full px-5"
            onClick={loadClassroomSample}
          >
            Load sample tasks
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Sols: add <code>GOOGLE_CLIENT_ID</code>,{" "}
          <code>GOOGLE_CLIENT_SECRET</code>, and redirect{" "}
          <code>https://catalyst-ib.vercel.app/api/classroom/callback</code>{" "}
          on the Vercel project. Local redirect:{" "}
          <code>http://127.0.0.1:43127/api/classroom/callback</code>.
        </p>
      </section>

      <section className="flux-card space-y-4 px-6 py-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg text-foreground">ManageBac</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              No public student OAuth. We do not scrape your school site.
              Paste a task list or ICS, or load sample IB assignments.
            </p>
          </div>
          <DemoBadge>
            {state.manageBacMode === "import"
              ? "Imported list"
              : state.manageBacConnected
                ? "Sample / setup"
                : "Not connected"}
          </DemoBadge>
        </div>
        <div className="space-y-2">
          <Label htmlFor="mb-url">School ManageBac URL</Label>
          <Input
            id="mb-url"
            value={schoolUrl}
            onChange={(event) => setSchoolUrl(event.target.value)}
            placeholder="https://yourschool.managebac.com"
            className="h-11 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mb-paste">Paste tasks</Label>
          <textarea
            id="mb-paste"
            value={paste}
            onChange={(event) => setPaste(event.target.value)}
            placeholder={"Biology IA first draft | Biology HL | Fri\nTOK essay | TOK | Mon"}
            className="min-h-32 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" className="h-11 rounded-full px-5" onClick={importManageBac}>
            Import pasted list
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-full px-5"
            onClick={loadManageBacSample}
          >
            Load sample ManageBac tasks
          </Button>
        </div>
      </section>

      <section className="flux-card px-6 py-6">
        <h2 className="text-lg text-foreground">In Focus now</h2>
        {state.schoolTasks.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No tasks yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {state.schoolTasks.map((task) => (
              <li
                key={task.id}
                className="rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900"
              >
                <p className="text-sm text-foreground">{task.title}</p>
                <p className="text-xs text-muted-foreground">
                  {sourceLabel(task.source)} · {task.subject} · due {task.due}
                  {task.done ? " · done" : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
        <Button asChild variant="outline" className="mt-5 h-11 rounded-full px-5">
          <Link href={ROUTES.focus}>Open Focus</Link>
        </Button>
      </section>

      {notice ? (
        <p className="text-sm text-muted-foreground" role="status">
          {notice}
        </p>
      ) : null}
    </PageFrame>
  );
}
