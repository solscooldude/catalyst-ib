"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  CLASS_YEARS,
  GROUP_LABELS,
  subjectsInGroup,
  validateDiploma,
} from "@/lib/ib";
import { ROUTES } from "@/lib/routes";
import { saveProfile, useCatalyst } from "@/lib/store";

const selectClass =
  "h-11 w-full rounded-xl border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export default function ProfilePage() {
  const router = useRouter();
  const state = useCatalyst();
  const [classYear, setClassYear] = useState<number>(
    state.profile.classYear ?? 2027,
  );
  const [required, setRequired] = useState<Record<1 | 2 | 3 | 4 | 5, string>>(
    () => {
      const next = { 1: "", 2: "", 3: "", 4: "", 5: "" };
      for (const id of state.profile.subjects) {
        for (const group of [1, 2, 3, 4, 5] as const) {
          if (
            !next[group] &&
            subjectsInGroup(group).some((row) => row.id === id)
          ) {
            next[group] = id;
            break;
          }
        }
      }
      return next;
    },
  );
  const [sixth, setSixth] = useState(() => {
    const taken = new Set<string>();
    for (const id of state.profile.subjects) {
      let placed = false;
      for (const group of [1, 2, 3, 4, 5] as const) {
        if (
          subjectsInGroup(group).some((row) => row.id === id) &&
          ![...taken].some((existing) =>
            subjectsInGroup(group).some((row) => row.id === existing),
          )
        ) {
          taken.add(id);
          placed = true;
          break;
        }
      }
      if (!placed) return id;
    }
    return "";
  });
  const [error, setError] = useState<string | null>(null);

  const requiredIds = useMemo(
    () => Object.values(required).filter(Boolean),
    [required],
  );
  const subjects = [...requiredIds, sixth].filter(Boolean);
  const preview = validateDiploma(subjects, classYear);

  const extraChoices = ([1, 2, 3, 4, 5] as const)
    .flatMap((group) => subjectsInGroup(group))
    .filter((row) => !requiredIds.includes(row.id));

  function save() {
    const result = saveProfile({ classYear, subjects });
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    router.push(state.setupComplete ? ROUTES.home : ROUTES.setup);
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div>
        <p className="text-xs tracking-[0.2em] text-primary uppercase">
          Profile
        </p>
        <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
          Your diploma, on paper.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Groups 1–5 are required. Group 6 is optional — if you skip arts, take
          a sixth subject from another group. Exactly six DP subjects.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="class-year">Graduating class</Label>
        <select
          id="class-year"
          className={selectClass}
          value={classYear}
          onChange={(event) => setClassYear(Number(event.target.value))}
        >
          {CLASS_YEARS.map((year) => (
            <option key={year} value={year}>
              Class of {year}
            </option>
          ))}
        </select>
      </div>

      {([1, 2, 3, 4, 5] as const).map((group) => (
        <div key={group} className="space-y-2">
          <Label htmlFor={`group-${group}`}>{GROUP_LABELS[group]}</Label>
          <select
            id={`group-${group}`}
            className={selectClass}
            value={required[group]}
            onChange={(event) =>
              setRequired((current) => ({
                ...current,
                [group]: event.target.value,
              }))
            }
          >
            <option value="">Choose a subject</option>
            {subjectsInGroup(group).map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.label}
              </option>
            ))}
          </select>
        </div>
      ))}

      <div className="space-y-2">
        <Label htmlFor="sixth">Sixth subject · arts or an extra</Label>
        <select
          id="sixth"
          className={selectClass}
          value={sixth}
          onChange={(event) => setSixth(event.target.value)}
        >
          <option value="">Choose arts or another subject</option>
          <optgroup label={GROUP_LABELS[6]}>
            {subjectsInGroup(6).map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Extra from Groups 1–5">
            {extraChoices.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.label}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      <p className="text-sm text-muted-foreground">
        {preview.ok
          ? `Class of ${classYear} · six subjects locked in.`
          : preview.reason}
      </p>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <Button className="h-11 rounded-full px-6" onClick={save} disabled={!preview.ok}>
        Save profile
      </Button>
    </div>
  );
}
