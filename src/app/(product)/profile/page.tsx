"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSelect } from "@/components/app-select";
import { CoreSubjects } from "@/components/core-subjects";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  CLASS_YEARS,
  GROUP_LABELS,
  subjectsInGroup,
  takenCourses,
  validateDiploma,
} from "@/lib/ib";
import { SpriteRename } from "@/components/sprite-rename";
import { ROUTES } from "@/lib/routes";
import { saveProfile, useCatalyst } from "@/lib/store";

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
    .filter((row) => !takenCourses(requiredIds).has(row.course));

  function save() {
    const result = saveProfile({ classYear, subjects });
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    router.push(state.setupComplete ? ROUTES.home : ROUTES.setup);
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <div className="flux-card px-6 py-8">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          Profile
        </p>
        <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
          Your diploma, on paper.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Groups 1–5 are required. Group 6 is optional — if you skip arts, take
          a sixth subject from another group. Every subject is HL or SL. Ab
          initio and self-taught Language A are SL only. TOK and EE sit on
          every diploma automatically.
        </p>
      </div>

      <div className="flux-card space-y-6 px-6 py-8">
      <SpriteRename />
      <div className="space-y-2">
        <Label htmlFor="class-year">Graduating class</Label>
        <AppSelect
          id="class-year"
          value={String(classYear)}
          onChange={(next) => setClassYear(Number(next))}
          options={CLASS_YEARS.map((year) => ({
            value: String(year),
            label: `Class of ${year}`,
          }))}
        />
      </div>

      {([1, 2, 3, 4, 5] as const).map((group) => (
        <div key={group} className="space-y-2">
          <Label htmlFor={`group-${group}`}>{GROUP_LABELS[group]}</Label>
          <AppSelect
            id={`group-${group}`}
            value={required[group]}
            placeholder="Choose a subject · HL or SL"
            onChange={(next) =>
              setRequired((current) => ({
                ...current,
                [group]: next,
              }))
            }
            options={subjectsInGroup(group).map((subject) => ({
              value: subject.id,
              label: subject.label,
            }))}
          />
        </div>
      ))}

      <div className="space-y-2">
        <Label htmlFor="sixth">Sixth subject · arts or an extra</Label>
        <AppSelect
          id="sixth"
          value={sixth}
          placeholder="Choose arts or an extra · HL or SL"
          onChange={setSixth}
          groups={[
            {
              label: GROUP_LABELS[6],
              options: subjectsInGroup(6).map((subject) => ({
                value: subject.id,
                label: subject.label,
              })),
            },
            {
              label: "Extra from Groups 1–5",
              options: extraChoices.map((subject) => ({
                value: subject.id,
                label: subject.label,
              })),
            },
          ]}
        />
      </div>

      <CoreSubjects />

      <p className="text-sm text-muted-foreground">
        {preview.ok
          ? `Class of ${classYear} · six subjects plus TOK and EE.`
          : preview.reason}
      </p>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <Button className="h-11 rounded-full px-6" onClick={save} disabled={!preview.ok}>
        Save profile
      </Button>
      </div>
    </div>
  );
}
