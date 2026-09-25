"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FriendIdentity, RequestCountBadge } from "@/components/friend-identity";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageFrame } from "@/components/page-frame";
import {
  FRIEND_CODE_COPY,
  FRIEND_CODE_HINT,
  formatFriendId,
  formatRequestTime,
  friendDisplayName,
  friendTabFromLocation,
  friendTabHref,
  normalizeFriendCode,
  rankFriends,
  resolveFriendRow,
  type FriendTab,
} from "@/lib/friends";
import {
  acceptIncoming,
  cancelOutgoing,
  declineIncoming,
  lookupFriendProfile,
  requestFriend,
  syncFriendsFromServer,
} from "@/lib/friends-client";
import { followInPageHref, listenInPageNav } from "@/lib/in-page-nav";
import { displayAvatar } from "@/lib/identity";
import { ROUTES } from "@/lib/routes";
import { openSchoolTasks, sourceLabel } from "@/lib/school-tasks";
import { formatWeeklyStudy, weeklyStudyMinutes } from "@/lib/stats";
import { removeFriend, startSession, useCatalyst } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS = [
  ["races", "Task races"],
  ["manage", "Friends"],
  ["board", "Leaderboard"],
] as const;

export default function FriendsPage() {
  const router = useRouter();
  const state = useCatalyst();
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [section, setSection] = useState<FriendTab>(() =>
    typeof window === "undefined" ? "races" : friendTabFromLocation(),
  );
  const [raceFriend, setRaceFriend] = useState("");
  const [raceTask, setRaceTask] = useState("");
  const [lookup, setLookup] = useState<{
    code: string;
    name: string;
    avatarUrl: string | null;
  } | null>(null);
  const [lookupBusy, setLookupBusy] = useState(false);
  const focusTasks = openSchoolTasks(state.schoolTasks);
  const incoming = state.incomingRequests.map(resolveFriendRow);
  const outgoing = state.outgoingRequests.map(resolveFriendRow);
  const friends = state.friends.map(resolveFriendRow);

  useEffect(() => listenInPageNav(() => setSection(friendTabFromLocation())), []);

  useEffect(() => {
    void syncFriendsFromServer();
    const timer = window.setInterval(() => void syncFriendsFromServer(), 20_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const next = normalizeFriendCode(code);
    if (!next) {
      setLookup(null);
      setLookupBusy(false);
      return;
    }
    let cancelled = false;
    setLookupBusy(true);
    const timer = window.setTimeout(() => {
      void lookupFriendProfile(next).then((profile) => {
        if (cancelled) return;
        setLookupBusy(false);
        setLookup(
          profile
            ? {
                code: profile.code,
                name: friendDisplayName(profile),
                avatarUrl: profile.avatarUrl ?? null,
              }
            : null,
        );
      });
    }, 280);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [code]);

  const youWeekly = weeklyStudyMinutes(state.logs);
  const youAvatar = displayAvatar(state.avatarDataUrl, state.avatarUrl);
  const youName = state.username || "You";
  const board = useMemo(() => {
    const you = {
      code: state.friendCode,
      name: youName,
      avatarUrl: youAvatar,
      weeklyStudyMinutes: youWeekly,
      you: true,
    };
    return rankFriends([
      you,
      ...friends.map((row) => ({ ...row, you: false })),
    ]);
  }, [state.friendCode, friends, youName, youAvatar, youWeekly]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(state.friendCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function submitFriend(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const result = await requestFriend(code);
    setBusy(false);
    if (!result.ok) {
      setNotice(result.reason);
      return;
    }
    setCode("");
    setLookup(null);
    setNotice(
      result.becameFriends
        ? `You and ${friendDisplayName({ name: result.name, code })} are now friends.`
        : `Request sent to ${friendDisplayName({ name: result.name, code })}.`,
    );
  }

  function beginRace() {
    if (!raceFriend || !raceTask) {
      setNotice("Pick a friend and a task.");
      return;
    }
    const friend = friends.find((row) => row.code === raceFriend);
    const result = startSession({
      taskId: raceTask,
      goal: `Task race vs ${friendDisplayName(friend ?? { code: raceFriend })}`,
    });
    if (!result.ok) {
      setNotice(result.reason);
      return;
    }
    router.push(ROUTES.session);
  }

  function go(next: FriendTab) {
    setSection(next);
    followInPageHref(friendTabHref(next));
  }

  return (
    <PageFrame width="mid">
      <section className="flux-card px-6 py-8 sm:px-8">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Friends
        </p>
        <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">Friends</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Race the same task. Add someone with the assigned ID Catalyst gave
          them — you will see their username and photo. The leaderboard ranks
          study time this week — Monday to Sunday, your local time. Minigames
          live on My Sprite.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => go(id)}
              className={cn(
                "inline-flex h-10 items-center rounded-full px-4 text-sm ring-1",
                section === id
                  ? "bg-primary/15 text-foreground ring-primary/40"
                  : "text-muted-foreground ring-border",
              )}
            >
              {label}
              {id === "manage" ? (
                <RequestCountBadge count={incoming.length} />
              ) : null}
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
          {friends.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Add a friend first, then come back to race.
            </p>
          ) : focusTasks.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              No open tasks. Add one on Focus, then race.
            </p>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Friend</Label>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {friends.map((friend) => (
                    <li key={friend.code}>
                      <button
                        type="button"
                        onClick={() => setRaceFriend(friend.code)}
                        className={cn(
                          "flex w-full rounded-2xl px-4 py-3 text-left ring-1",
                          raceFriend === friend.code
                            ? "bg-primary/15 ring-primary/40"
                            : "bg-zinc-50 ring-transparent dark:bg-zinc-900",
                        )}
                      >
                        <FriendIdentity
                          name={friend.name}
                          code={friend.code}
                          avatarUrl={friend.avatarUrl}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2 sm:col-span-2">
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
            disabled={friends.length === 0 || focusTasks.length === 0}
            onClick={beginRace}
          >
            Start task race
          </Button>
        </section>
      ) : null}

      {section === "manage" ? (
        <section id="manage" className="space-y-6">
          <div className="flux-card px-6 py-6">
            <h2 className="text-lg text-foreground">Your friend ID</h2>
            <p className="mt-2 text-sm text-muted-foreground">{FRIEND_CODE_COPY}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <FriendIdentity
                name={youName}
                code={state.friendCode}
                avatarUrl={youAvatar}
                you
              />
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-full px-6"
                onClick={() => void copy()}
                disabled={!state.friendCode}
              >
                {copied ? "Copied" : "Copy ID"}
              </Button>
            </div>
          </div>

          <div className="flux-card px-6 py-6">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg text-foreground">Friend requests</h2>
              <RequestCountBadge count={incoming.length} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Accepting adds them to your friends and the weekly leaderboard.
            </p>

            <h3 className="mt-5 text-sm font-medium text-foreground">Received</h3>
            {incoming.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                No requests right now
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {incoming.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900"
                  >
                    <div className="min-w-0">
                      <FriendIdentity
                        name={row.name}
                        code={row.code}
                        avatarUrl={row.avatarUrl}
                        extra={formatRequestTime(row.sentAt)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        className="h-9 rounded-full px-4"
                        disabled={busy}
                        onClick={() => {
                          void acceptIncoming(row.code).then((result) => {
                            setNotice(
                              result.ok
                                ? `You and ${friendDisplayName(row)} are now friends.`
                                : result.reason,
                            );
                          });
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-9 rounded-full px-4"
                        disabled={busy}
                        onClick={() => {
                          void declineIncoming(row.code).then(() => {
                            setNotice(`Declined ${friendDisplayName(row)}.`);
                          });
                        }}
                      >
                        Decline
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="mt-6 text-sm font-medium text-foreground">Sent</h3>
            {outgoing.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                You haven&apos;t sent any requests
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {outgoing.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900"
                  >
                    <div className="min-w-0">
                      <FriendIdentity
                        name={row.name}
                        code={row.code}
                        avatarUrl={row.avatarUrl}
                        extra={formatRequestTime(row.sentAt)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 rounded-full px-4"
                      disabled={busy}
                      onClick={() => {
                        void cancelOutgoing(row.code).then(() => {
                          setNotice(`Cancelled request to ${friendDisplayName(row)}.`);
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form className="flux-card px-6 py-6" onSubmit={(event) => void submitFriend(event)}>
            <h2 className="text-lg text-foreground">Add a friend</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the assigned ID they can copy from Friends. After they
              accept, you see the username and photo they set during setup.{" "}
              {FRIEND_CODE_HINT}
            </p>
            <div className="mt-4 space-y-2">
              <Label htmlFor="friend-code">Their assigned ID</Label>
              <Input
                id="friend-code"
                value={code}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="CAT-XXXXXX"
                className="h-11 rounded-xl"
              />
            </div>
            {lookup ? (
              <div className="mt-4 rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900">
                <FriendIdentity
                  name={lookup.name}
                  code={lookup.code}
                  avatarUrl={lookup.avatarUrl}
                  extra="Account found"
                />
              </div>
            ) : lookupBusy ? (
              <p className="mt-3 text-sm text-muted-foreground">Looking up account…</p>
            ) : normalizeFriendCode(code) ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No account found for {formatFriendId(code)} yet.
              </p>
            ) : null}
            <Button
              type="submit"
              className="mt-4 h-11 rounded-full px-6"
              disabled={busy}
            >
              Send request
            </Button>
          </form>
          <div className="flux-card px-6 py-6">
            <h2 className="text-lg text-foreground">Your friends</h2>
            {friends.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No friends yet. Send a request to start a race.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {friends.map((friend) => (
                  <li
                    key={friend.code}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900"
                  >
                    <FriendIdentity
                      name={friend.name}
                      code={friend.code}
                      avatarUrl={friend.avatarUrl}
                      extra={formatWeeklyStudy(friend.weeklyStudyMinutes)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 rounded-full px-4"
                      onClick={() => {
                        removeFriend(friend.code);
                        setNotice(`Removed ${friendDisplayName(friend)}.`);
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
            Ranked by study time this week (Monday–Sunday, your local time).
          </p>
          <ol className="mt-5 space-y-2">
            {board.map((row, index) => (
              <li
                key={row.code}
                className="flex items-center justify-between gap-3 rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-6 text-sm text-muted-foreground">
                    {index + 1}.
                  </span>
                  <FriendIdentity
                    name={row.name}
                    code={row.code}
                    avatarUrl={row.avatarUrl}
                    you={row.you}
                  />
                </div>
                <p className="text-right text-sm text-foreground">
                  {formatWeeklyStudy(row.weeklyStudyMinutes)}
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
