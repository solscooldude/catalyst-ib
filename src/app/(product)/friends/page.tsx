"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageFrame } from "@/components/page-frame";
import { FRIEND_CODE_HINT, rankFriends } from "@/lib/friends";
import { ROUTES } from "@/lib/routes";
import { openSchoolTasks, sourceLabel } from "@/lib/school-tasks";
import { formatStudyMinutes, studyMinutesFromLogs } from "@/lib/stats";
import {
  addFriend,
  removeFriend,
  setFriendCode,
  startSession,
  useCatalyst,
} from "@/lib/store";
import { cn } from "@/lib/utils";

type Section = "races" | "manage" | "board";

function sectionFromHash(hash: string): Section {
  if (hash === "#manage") return "manage";
  if (hash === "#board") return "board";
  return "races";
}

export default function FriendsPage() {
  const router = useRouter();
  const state = useCatalyst();
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("");
  const [ownCode, setOwnCode] = useState(state.friendCode);
  const [notice, setNotice] = useState<string | null>(null);
  const [section, setSection] = useState<Section>("races");
  const [raceFriend, setRaceFriend] = useState("");
  const [raceTask, setRaceTask] = useState("");
  const focusTasks = openSchoolTasks(state.schoolTasks);

  useEffect(() => {
    setOwnCode(state.friendCode);
  }, [state.friendCode]);

  useEffect(() => {
    function sync() {
      setSection(sectionFromHash(window.location.hash));
    }
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const youMinutes = studyMinutesFromLogs(state.logs);
  const youTasks = state.schoolTasks.filter((task) => task.done).length;
  const board = useMemo(() => {
    const you = {
      code: state.friendCode,
      name: state.username || "You",
      tokens: state.tokens,
      streakDays: Math.max(1, state.streakDays),
      studyMinutes: youMinutes,
      tasksCompleted: youTasks,
      you: true,
    };
    return rankFriends([
      you,
      ...state.friends.map((row) => ({ ...row, you: false })),
    ]);
  }, [
    state.friendCode,
    state.friends,
    state.streakDays,
    state.tokens,
    state.username,
    youMinutes,
    youTasks,
  ]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(state.friendCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  function saveCode(event: React.FormEvent) {
    event.preventDefault();
    const result = setFriendCode(ownCode);
    if (!result.ok) {
      setNotice(result.reason);
      return;
    }
    setNotice(`Friend code set to ${result.code}.`);
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
      setNotice("Pick a friend and a task.");
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
        <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">Friends</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Race the same task. Manage codes. Rank by study minutes, then
          tasks completed. Minigames live on My Sprite.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {(
            [
              ["races", "Task races"],
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

      {section === "races" ? (
        <section id="races" className="flux-card scroll-mt-24 px-6 py-6">
          <h2 className="text-lg text-foreground">Task race</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Same task. First to end the focus block wins.
          </p>
          {state.friends.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Add a friend first, then come back to race.
            </p>
          ) : focusTasks.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No open tasks. Add one on Focus, then race.
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
                <Label htmlFor="race-task">Task</Label>
                <select
                  id="race-task"
                  value={raceTask}
                  onChange={(event) => setRaceTask(event.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm"
                >
                  <option value="">Choose</option>
                  {focusTasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {sourceLabel(task.source)} · {task.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <Button
            type="button"
            className="mt-5 h-11 rounded-full px-6"
            disabled={state.friends.length === 0 || focusTasks.length === 0}
            onClick={beginRace}
          >
            Start task race
          </Button>
        </section>
      ) : null}

      {section === "manage" ? (
        <section id="manage" className="space-y-6">
          <form className="flux-card px-6 py-6" onSubmit={saveCode}>
            <h2 className="text-lg text-foreground">Your friend code</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {FRIEND_CODE_HINT}
            </p>
            <div className="mt-4 space-y-2">
              <Label htmlFor="own-code">Code</Label>
              <Input
                id="own-code"
                value={ownCode}
                onChange={(event) => setOwnCode(event.target.value.toUpperCase())}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="submit" className="h-11 rounded-full px-6">
                Save code
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-full px-6"
                onClick={copy}
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </form>
          <form className="flux-card px-6 py-6" onSubmit={submitFriend}>
            <h2 className="text-lg text-foreground">Add a friend</h2>
            <div className="mt-4 space-y-2">
              <Label htmlFor="friend-code">Their code</Label>
              <Input
                id="friend-code"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="friend-code"
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
                        {friend.code} · {formatStudyMinutes(friend.studyMinutes)}{" "}
                        · {friend.tasksCompleted} tasks
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
        <section id="board" className="flux-card scroll-mt-24 px-6 py-6">
          <h2 className="text-lg text-foreground">Friend leaderboard</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ranked by study minutes, then tasks completed.
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
                <p className="text-right text-sm text-foreground">
                  {formatStudyMinutes(row.studyMinutes)}
                  <span className="block text-xs text-muted-foreground">
                    {row.tasksCompleted} task
                    {row.tasksCompleted === 1 ? "" : "s"}
                  </span>
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
