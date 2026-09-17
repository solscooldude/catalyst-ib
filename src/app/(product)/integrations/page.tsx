"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DemoBadge } from "@/components/demo-badge";
import { OptionHelp } from "@/components/option-help";
import { SchoolProviderPicker } from "@/components/school-provider-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageFrame } from "@/components/page-frame";
import { ROUTES } from "@/lib/routes";
import {
  CLASSROOM_HELP,
  MANAGEBAC_ICS_HELP,
  MANAGEBAC_ICS_TIP,
  MANAGEBAC_PASTE_HELP,
  MANAGEBAC_SCAN_HELP,
} from "@/lib/integration-help";
import { sourceLabel, type SchoolTask } from "@/lib/school-tasks";
import { providerLabel } from "@/lib/school-provider";
import {
  addManualSchoolTask,
  applyClassroomSubmissionStates,
  connectClassroomLive,
  connectClassroomSample,
  connectManageBacIcs,
  connectManageBacImport,
  connectManageBacSample,
  connectManageBacScan,
  markSchoolTaskSubmitted,
  setSchoolProvider,
  useCatalyst,
} from "@/lib/store";

type ClassroomStatus = {
  credentialsReady: boolean;
  connected: boolean;
  email: string | null;
};

export default function IntegrationsPage() {
  const state = useCatalyst();
  const [status, setStatus] = useState<ClassroomStatus | null>(null);
  const [schoolUrl, setSchoolUrl] = useState(state.manageBacSchoolUrl);
  const [icsUrl, setIcsUrl] = useState(state.manageBacIcsUrl);
  const [paste, setPaste] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualSubject, setManualSubject] = useState("");
  const [manualDue, setManualDue] = useState("");
  const [manualDetail, setManualDetail] = useState("");

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

  async function checkClassroomSubmissions() {
    setPending(true);
    setNotice(null);
    try {
      const res = await fetch("/api/classroom/submissions");
      const json = (await res.json()) as {
        ok?: boolean;
        rows?: Array<{ id: string; submitted: boolean }>;
        reason?: string;
      };
      if (!res.ok || !json.ok) {
        setNotice(
          json.reason === "needs-credentials"
            ? "Connect Google Classroom first — OAuth keys are not on this deploy."
            : json.reason === "not-connected"
              ? "Connect personal Google, then check submissions."
              : json.reason || "Submission check failed.",
        );
        return;
      }
      applyClassroomSubmissionStates(json.rows ?? []);
      const submitted = (json.rows ?? []).filter((row) => row.submitted).length;
      setNotice(
        submitted
          ? `Classroom marked ${submitted} task${submitted === 1 ? "" : "s"} submitted.`
          : "Classroom says nothing is turned in yet.",
      );
    } finally {
      setPending(false);
    }
  }

  async function scanUpload(file: File | null) {
    if (!file) return;
    setPending(true);
    setNotice(null);
    try {
      const body = new FormData();
      body.set("file", file);
      if (paste.trim()) body.set("text", paste);
      const res = await fetch("/api/tasks/scan", { method: "POST", body });
      const json = (await res.json()) as {
        ok?: boolean;
        tasks?: SchoolTask[];
        reason?: string;
        usedAi?: boolean;
        mode?: string;
      };
      if (!res.ok || !json.ok || !json.tasks?.length) {
        setNotice(
          json.reason ||
            "Scan found no tasks. Try an ICS, PDF export, or add by hand.",
        );
        return;
      }
      const result = connectManageBacScan(json.tasks);
      setNotice(
        result.ok
          ? `Scanned ${result.count} task${result.count === 1 ? "" : "s"}${
              json.usedAi ? " with AI" : ""
            }.`
          : result.reason,
      );
    } finally {
      setPending(false);
    }
  }

  async function fetchIcs() {
    if (!icsUrl.trim()) {
      setNotice("Paste an https calendar URL first.");
      return;
    }
    setPending(true);
    setNotice(null);
    try {
      const res = await fetch("/api/tasks/ics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: icsUrl }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        tasks?: SchoolTask[];
        reason?: string;
      };
      if (!res.ok || !json.ok || !json.tasks?.length) {
        setNotice(json.reason || "That calendar did not include tasks.");
        return;
      }
      const result = connectManageBacIcs(json.tasks, icsUrl);
      setNotice(
        result.ok
          ? `Imported ${result.count} task${result.count === 1 ? "" : "s"} from the calendar.`
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

  function addManual() {
    const result = addManualSchoolTask({
      title: manualTitle,
      subject: manualSubject,
      due: manualDue,
      detail: manualDetail,
    });
    if (result.ok) {
      setManualTitle("");
      setManualSubject("");
      setManualDue("");
      setManualDetail("");
      setNotice(`Added ${result.count} task by hand.`);
      return;
    }
    setNotice(result.reason);
  }

  const provider = state.schoolProvider;

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
          Choose ManageBac or Google Classroom — one source at a time. Switch
          later if the school changes. Classroom uses real OAuth when keys
          exist. ManageBac is scan, ICS, or by hand — we do not scrape.
        </p>
        <div className="mt-6">
          <SchoolProviderPicker
            value={provider}
            onPick={(next) => {
              setSchoolProvider(next);
              setNotice(`Using ${providerLabel(next)}. The other source stays off.`);
            }}
          />
        </div>
      </section>

      {!provider ? (
        <section className="flux-card px-6 py-6">
          <p className="text-sm text-muted-foreground">
            Pick a source above. Focus stays empty until tasks land.
          </p>
        </section>
      ) : null}

      {provider === "classroom" ? (
        <section className="flux-card space-y-4 px-6 py-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg text-foreground">Google Classroom</h2>
                <OptionHelp title={CLASSROOM_HELP.title}>
                  <p>{CLASSROOM_HELP.body}</p>
                </OptionHelp>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Personal Google. Live pull needs a Google Cloud OAuth client
                with Classroom coursework read-only. The helper can check
                whether you turned work in.
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
          {!status?.credentialsReady ? (
            <p className="rounded-2xl bg-zinc-50 px-4 py-3 text-sm text-foreground dark:bg-zinc-900">
              Connect is ready in the UI, but this deploy has no{" "}
              <code>GOOGLE_CLIENT_ID</code> / <code>GOOGLE_CLIENT_SECRET</code>{" "}
              yet. Load sample tasks, or ask Sols to add the OAuth client.
            </p>
          ) : null}
          {state.classroomConnected ? (
            <p className="text-sm text-foreground">
              {state.classroomMode === "oauth"
                ? `Connected${state.classroomEmail ? ` as ${state.classroomEmail}` : ""}.`
                : "Sample Classroom tasks are in Focus."}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Not connected yet. Use personal Google when credentials exist.
            </p>
          )}
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
              disabled={pending}
              onClick={() => void checkClassroomSubmissions()}
            >
              Check Classroom submissions
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
            Redirect{" "}
            <code>https://catalyst-ib.vercel.app/api/classroom/callback</code>
            {" · "}
            local <code>http://127.0.0.1:43127/api/classroom/callback</code>.
          </p>
        </section>
      ) : null}

      {provider === "managebac" ? (
        <section className="flux-card space-y-5 px-6 py-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg text-foreground">ManageBac</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                No public student API, so we do not scrape. Upload a screenshot,
                PDF, or export. Paste a list. Or add a calendar URL if your
                school publishes one.
              </p>
            </div>
            <DemoBadge>
              {state.manageBacMode === "scan"
                ? "AI / file scan"
                : state.manageBacMode === "ics"
                  ? "Calendar URL"
                  : state.manageBacMode === "import"
                    ? "Imported list"
                    : state.manageBacMode === "manual"
                      ? "Added by hand"
                      : state.manageBacConnected
                        ? "Sample / setup"
                        : "Not connected"}
            </DemoBadge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="mb-scan">AI scan — screenshot, PDF, ICS, export</Label>
              <OptionHelp title={MANAGEBAC_SCAN_HELP.title}>
                <p>{MANAGEBAC_SCAN_HELP.body}</p>
              </OptionHelp>
            </div>
            <Input
              id="mb-scan"
              type="file"
              accept="image/*,.pdf,.ics,.txt,.csv,text/calendar"
              className="h-11 rounded-xl"
              disabled={pending}
              onChange={(event) => {
                void scanUpload(event.target.files?.[0] ?? null);
                event.target.value = "";
              }}
            />
            <p className="text-xs text-muted-foreground">
              Screenshots need <code>OPENAI_API_KEY</code>. ICS and text exports
              parse without it.
            </p>
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
            <div className="flex items-center gap-2">
              <Label htmlFor="mb-ics">Calendar / ICS URL</Label>
              <OptionHelp title={MANAGEBAC_ICS_HELP.title}>
                <p>{MANAGEBAC_ICS_HELP.body}</p>
                <p>{MANAGEBAC_ICS_TIP}</p>
              </OptionHelp>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="mb-ics"
                value={icsUrl}
                onChange={(event) => setIcsUrl(event.target.value)}
                placeholder="https://…/calendar.ics"
                className="h-11 rounded-xl"
              />
              <Button
                type="button"
                variant="outline"
                className="h-11 shrink-0 rounded-full px-5"
                disabled={pending}
                onClick={() => void fetchIcs()}
              >
                Fetch calendar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{MANAGEBAC_ICS_TIP}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="mb-paste">Paste tasks</Label>
              <OptionHelp title={MANAGEBAC_PASTE_HELP.title}>
                <p>{MANAGEBAC_PASTE_HELP.body}</p>
              </OptionHelp>
            </div>
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

          <div className="rounded-3xl bg-zinc-50 p-4 dark:bg-zinc-900">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-foreground">Add by hand</h3>
              <OptionHelp title={MANAGEBAC_PASTE_HELP.title}>
                <p>{MANAGEBAC_PASTE_HELP.body}</p>
              </OptionHelp>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="manual-title">Title</Label>
                <Input
                  id="manual-title"
                  value={manualTitle}
                  onChange={(event) => setManualTitle(event.target.value)}
                  placeholder="Biology IA first draft"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manual-subject">Subject</Label>
                <Input
                  id="manual-subject"
                  value={manualSubject}
                  onChange={(event) => setManualSubject(event.target.value)}
                  placeholder="Biology HL"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manual-due">Due</Label>
                <Input
                  id="manual-due"
                  value={manualDue}
                  onChange={(event) => setManualDue(event.target.value)}
                  placeholder="Fri"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="manual-detail">Notes</Label>
                <Input
                  id="manual-detail"
                  value={manualDetail}
                  onChange={(event) => setManualDetail(event.target.value)}
                  placeholder="Write the methodology."
                  className="h-11 rounded-xl"
                />
              </div>
            </div>
            <Button
              type="button"
              className="mt-4 h-11 rounded-full px-5"
              onClick={addManual}
            >
              Add task
            </Button>
          </div>
        </section>
      ) : null}

      <section className="flux-card px-6 py-6">
        <h2 className="text-lg text-foreground">In Focus now</h2>
        {state.schoolTasks.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No tasks yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {state.schoolTasks.map((task) => (
              <li
                key={task.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900"
              >
                <div>
                  <p className="text-sm text-foreground">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {sourceLabel(task.source)} · {task.subject} · due {task.due}
                    {task.submitted ? " · submitted" : ""}
                    {task.done ? " · done" : ""}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-full px-4"
                  onClick={() =>
                    markSchoolTaskSubmitted(task.id, !task.submitted)
                  }
                >
                  {task.submitted ? "Undo submitted" : "Mark submitted"}
                </Button>
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
