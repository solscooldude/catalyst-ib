"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageFrame } from "@/components/page-frame";
import { PLANNER_KINDS, plannerKindLabel } from "@/lib/planner";
import { ROUTES } from "@/lib/routes";
import { WEEKDAYS } from "@/lib/schedule";
import { startOfWeek } from "@/lib/stats";
import {
  addPlannerEvent,
  addPlannerTodo,
  removePlannerEvent,
  removePlannerTodo,
  togglePlannerTodo,
  useCatalyst,
} from "@/lib/store";
import { cn } from "@/lib/utils";

const timeClass =
  "h-11 w-full rounded-xl border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export default function PlannerPage() {
  const router = useRouter();
  const state = useCatalyst();
  const [todo, setTodo] = useState("");
  const [title, setTitle] = useState("");
  const [day, setDay] = useState(() => new Date().getDay());
  const [time, setTime] = useState("16:00");
  const [kind, setKind] = useState<(typeof PLANNER_KINDS)[number]["id"]>("test");
  const [error, setError] = useState<string | null>(null);
  const now = useMemo(() => new Date(), []);
  const weekStart = startOfWeek(now);

  useEffect(() => {
    if (state.hydrated && !state.setupComplete) {
      router.replace(ROUTES.setup);
    }
  }, [state.hydrated, state.setupComplete, router]);

  const days = WEEKDAYS.map((row, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const events = state.plannerEvents
      .filter((event) => event.day === row.day)
      .sort((a, b) => a.time.localeCompare(b.time));
    return { ...row, date, events, isToday: row.day === now.getDay() };
  });

  function addTodo() {
    const result = addPlannerTodo(todo);
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    setTodo("");
    setError(null);
  }

  function addEvent() {
    const result = addPlannerEvent({ title, day, time, kind });
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    setTitle("");
    setError(null);
  }

  if (!state.setupComplete) return null;

  return (
    <PageFrame>
      <section className="flux-card px-6 py-8 sm:px-8">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Planner
        </p>
        <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">This week</h1>
      </section>

      <section className="flux-card overflow-hidden p-0">
        <div className="grid grid-cols-7 divide-x divide-border overflow-x-auto">
          {days.map((row) => (
            <div
              key={row.day}
              className={cn(
                "min-w-[6.5rem] px-2 py-3 sm:min-w-0 sm:px-3",
                row.isToday && "bg-primary/8",
              )}
            >
              <p className="text-[11px] tracking-[0.12em] text-zinc-400 uppercase">
                {row.short}
              </p>
              <p className="mt-1 text-sm text-foreground">
                {row.date.getDate()}
              </p>
              <ul className="mt-3 space-y-1.5">
                {row.events.length === 0 ? (
                  <li className="text-[11px] text-muted-foreground">—</li>
                ) : (
                  row.events.map((event) => (
                    <li
                      key={event.id}
                      className="rounded-xl bg-white/70 px-2 py-1.5 ring-1 ring-border dark:bg-zinc-900"
                    >
                      <p className="text-[10px] tracking-[0.12em] text-zinc-400 uppercase">
                        {event.time} · {plannerKindLabel(event.kind)}
                      </p>
                      <p className="truncate text-xs text-foreground">{event.title}</p>
                      <button
                        type="button"
                        className="mt-1 text-[10px] text-zinc-400 hover:text-foreground"
                        onClick={() => removePlannerEvent(event.id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flux-card px-6 py-6">
          <h2 className="text-lg text-foreground">To-do</h2>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              addTodo();
            }}
          >
            <Input
              value={todo}
              onChange={(event) => setTodo(event.target.value)}
              placeholder="IA draft, flashcards…"
              className="h-11 rounded-xl"
            />
            <Button type="submit" className="h-11 rounded-full px-5">
              Add
            </Button>
          </form>
          {state.plannerTodos.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No to-dos.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {state.plannerTodos.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2 ring-1 ring-border dark:bg-zinc-900"
                >
                  <label className="flex min-w-0 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => togglePlannerTodo(item.id)}
                      className="size-4 accent-[var(--primary)]"
                    />
                    <span
                      className={cn(
                        "truncate text-foreground",
                        item.done && "text-muted-foreground line-through",
                      )}
                    >
                      {item.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-xs text-zinc-400 hover:text-foreground"
                    onClick={() => removePlannerTodo(item.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flux-card px-6 py-6">
          <h2 className="text-lg text-foreground">Add event</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="planner-title">Title</Label>
              <Input
                id="planner-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Math paper 2"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Day</Label>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((row) => (
                  <button
                    key={row.day}
                    type="button"
                    onClick={() => setDay(row.day)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm ring-1",
                      day === row.day
                        ? "bg-primary/15 text-foreground ring-primary/40"
                        : "text-muted-foreground ring-white/10",
                    )}
                  >
                    {row.short}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="planner-time">Time</Label>
                <input
                  id="planner-time"
                  type="time"
                  className={timeClass}
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Kind</Label>
                <div className="flex flex-wrap gap-2">
                  {PLANNER_KINDS.map((row) => (
                    <button
                      key={row.id}
                      type="button"
                      onClick={() => setKind(row.id)}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-sm ring-1",
                        kind === row.id
                          ? "bg-primary/15 text-foreground ring-primary/40"
                          : "text-muted-foreground ring-white/10",
                      )}
                    >
                      {row.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <Button className="h-11 rounded-full px-6" onClick={addEvent}>
              Add to week
            </Button>
          </div>
        </section>
      </div>
    </PageFrame>
  );
}
