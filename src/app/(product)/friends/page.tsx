"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AvoidFall } from "@/components/avoid-fall";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageFrame } from "@/components/page-frame";
import { MOCK_TASKS, type TaskId } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import {
  addFriend,
  removeFriend,
  startSession,
  useCatalyst,
} from "@/lib/store";
import { cn } from "@/lib/utils";

type Section = "play" | "manage" | "board";

function sectionFromHash(hash: string): Section {
  if (hash === "#manage") return "manage";
  if (hash === "#board") return "board";
  return "play";
}

export default function FriendsPage() {
  const router = useRouter();
  const state = useCatalyst();
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [section, setSection] = useState<Section>("play");
  const [raceFriend, setRaceFriend] = useState("");
  const [raceTask, setRaceTask] = useState<TaskId | "">("");

  useEffect(() => {
    function sync() {
      setSection(sectionFromHash(window.location.hash));
    }
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const board = useMemo(() => {
    const you = {
      code: state.friendCode,
      name: state.username || "You",
      tokens: state.tokens,
      streakDays: Math.max(1, state.streakDays),
      you: true,
    };
    return [you, ...state.friends.map((row) => ({ ...row, you: false }))].sort(
      (a, b) => b.tokens - a.tokens || b.streakDays - a.streakDays,
    );
  }, [state.friendCode, state.friends, state.streakDays, state.tokens, state.username]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(state.friendCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function submitFriend(event: React.FormEvent) {
    event.preventDefault();
    const result = addFriend(code);
    if (!result.ok) {
      setNotice(result.reason);
      return;
    }
    setCode("");
    setNotice(`Added ${result.friend.name}.`);
  }

  function beginRace() {
    if (!raceFriend || !raceTask) {
      setNotice("Pick a friend and a ManageBac task.");
      return;
    }
    const friend = state.friends.find((row) => row.code === raceFriend);
    startSession({
      taskId: raceTask,
      goal: `Task race vs ${friend?.name ?? raceFriend}`,
    });
    router.push(ROUTES.session);
  }

  function go(next: Section) {
    setSection(next);
    window.history.replaceState(null, "", `${ROUTES.friends}#${next}`);
  }

  return (
    <PageFrame width="mid">
      <section className="flux-card px-6 py-8 sm:px-8">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Friends
        </p>
        <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
          Friends
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Race a ManageBac task, manage your list, and see who is earning.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              ["play", "Minigames"],
              ["manage", "Manage"],
              ["board", "Leaderboard"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => go(id)}
              className={cn(
                "h-10 rounded-full px-4 text-sm ring-1",
                section === id
                  ? "bg-primary/15 text-foreground ring-primary/40"
                  : "text-muted-foreground ring-border",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {section === "play" ? (
        <>
          <section id="play" className="flux-card scroll-mt-24 px-6 py-6">
            <h2 className="text-lg text-foreground">Task race — minigame</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Same ManageBac task. First to end the focus block wins. Local
              demo — your friend is racing the same assignment title.
            </p>
            {state.friends.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Add a friend first, then come back to race.
              </p>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="race-friend">Friend</Label>
                  <select
                    id="race-friend"
                    value={raceFriend}
                    onChange={(event) => setRaceFriend(event.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="">Choose</option>
                    {state.friends.map((friend) => (
                      <option key={friend.code} value={friend.code}>
                        {friend.name} · {friend.code}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="race-task">ManageBac task</Label>
                  <select
                    id="race-task"
                    value={raceTask}
                    onChange={(event) =>
                      setRaceTask(event.target.value as TaskId | "")
                    }
                    className="h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
                  >
                    <option value="">Choose</option>
                    {MOCK_TASKS.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <Button
              type="button"
              className="mt-5 h-11 rounded-full px-6"
              disabled={state.friends.length === 0}
              onClick={beginRace}
            >
              Start task race
            </Button>
          </section>
          <AvoidFall onNotice={setNotice} />
        </>
      ) : null}

      {section === "manage" ? (
        <section id="manage" className="space-y-6">
          <div className="flux-card px-6 py-6">
            <h2 className="text-lg text-foreground">Your friend code</h2>
            <p className="font-heading mt-3 text-3xl tracking-[0.12em] text-foreground">
              {state.friendCode}
            </p>
            <Button
              type="button"
              className="mt-5 h-11 rounded-full px-6"
              onClick={copy}
            >
              {copied ? "Copied" : "Copy code"}
            </Button>
          </div>
          <form className="flux-card px-6 py-6" onSubmit={submitFriend}>
            <h2 className="text-lg text-foreground">Add a friend</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Codes look like CAT-XXXXXX.
            </p>
            <div className="mt-4 space-y-2">
              <Label htmlFor="friend-code">Friend code</Label>
              <Input
                id="friend-code"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="CAT-AB12CD"
                className="h-11 rounded-xl"
              />
            </div>
            <Button type="submit" className="mt-4 h-11 rounded-full px-6">
              Add friend
            </Button>
          </form>
          <div className="flux-card px-6 py-6">
            <h2 className="text-lg text-foreground">Your friends</h2>
            {state.friends.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No friends yet. Add a code to start a race.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {state.friends.map((friend) => (
                  <li
                    key={friend.code}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900"
                  >
                    <div>
                      <p className="text-sm text-foreground">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {friend.code} · {friend.tokens} tokens ·{" "}
                        {friend.streakDays} day streak
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 rounded-full px-4"
                      onClick={() => {
                        removeFriend(friend.code);
                        setNotice(`Removed ${friend.name}.`);
                      }}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ) : null}

      {section === "board" ? (
        <section id="board" className="flux-card px-6 py-6">
          <h2 className="text-lg text-foreground">Friend leaderboard</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ranked by tokens, then streak.
          </p>
          <ol className="mt-5 space-y-2">
            {board.map((row, index) => (
              <li
                key={row.code}
                className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900"
              >
                <div>
                  <p className="text-sm text-foreground">
                    {index + 1}. {row.you ? `${row.name} (you)` : row.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{row.code}</p>
                </div>
                <p className="text-sm text-foreground">
                  {row.tokens} · {row.streakDays}d
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {notice ? (
        <p className="text-sm text-muted-foreground" role="status">
          {notice}
        </p>
      ) : null}
    </PageFrame>
  );
}
