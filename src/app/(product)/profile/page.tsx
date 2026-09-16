"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSelect } from "@/components/app-select";
import { CoreSubjects } from "@/components/core-subjects";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  CLASS_YEARS,
  GROUP_LABELS,
  alphaByLabel,
  subjectsInGroup,
  takenCourses,
  validateDiploma,
} from "@/lib/ib";
import { LockHoursPicker } from "@/components/lock-hours-picker";
import { SpriteRename } from "@/components/sprite-rename";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/lib/routes";
import { AFTER_SCHOOL_PRESET, WEEKNIGHT_PRESET, formatWindow } from "@/lib/schedule";
import { PageFrame } from "@/components/page-frame";
import { readImageAsAvatar } from "@/lib/identity";
import { commitSpriteName, displaySpriteName } from "@/lib/sprite-name";
import {
  addLockWindow,
  saveIdentity,
  saveMotivation,
  saveProfile,
  useCatalyst,
} from "@/lib/store";

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
  const [colleges, setColleges] = useState(state.motivation.colleges);
  const [course, setCourse] = useState(state.motivation.course);
  const [error, setError] = useState<string | null>(null);
  const [spriteDraft, setSpriteDraft] = useState(() =>
    displaySpriteName(state.spriteName),
  );
  const [spriteDirty, setSpriteDirty] = useState(false);
  const [username, setUsername] = useState(state.username);
  const [avatarNotice, setAvatarNotice] = useState<string | null>(null);
  const [days, setDays] = useState<number[]>(AFTER_SCHOOL_PRESET.days);
  const [start, setStart] = useState(AFTER_SCHOOL_PRESET.start);
  const [end, setEnd] = useState(AFTER_SCHOOL_PRESET.end);
  const [lockError, setLockError] = useState<string | null>(null);
  const firstRun = !state.profile.complete || state.schedule.length === 0;

  useEffect(() => {
    if (spriteDirty) return;
    setSpriteDraft(displaySpriteName(state.spriteName));
  }, [state.hydrated, state.spriteName, spriteDirty]);

  const requiredIds = useMemo(
    () => Object.values(required).filter(Boolean),
    [required],
  );
  const subjects = [...requiredIds, sixth].filter(Boolean);
  const preview = validateDiploma(subjects, classYear);

  const extraChoices = alphaByLabel(
    ([1, 2, 3, 4, 5] as const)
      .flatMap((group) => subjectsInGroup(group))
      .filter((row) => !takenCourses(requiredIds).has(row.course)),
  );

  function ensureLockHours() {
    if (state.schedule.length > 0) return { ok: true as const };
    const lock = addLockWindow({ days, start, end, enabled: true });
    if (!lock.ok) {
      setLockError(lock.reason);
      return lock;
    }
    setLockError(null);
    return { ok: true as const };
  }

  function save() {
    const lock = ensureLockHours();
    if (!lock.ok) return;
    commitSpriteName(spriteDraft);
    saveIdentity({ username });
    const result = saveProfile({
      classYear,
      subjects,
      spriteName: spriteDraft,
    });
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    saveMotivation({
      ...state.motivation,
      colleges,
      course,
      why: "",
    });
    router.push(ROUTES.home);
  }

  return (
    <PageFrame width="form">
      <div className="flux-card px-6 py-8 sm:px-8">
        <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
          {firstRun ? "Account setup" : "Profile"}
        </p>
        <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
          {firstRun ? "Finish setting up account" : "IB profile"}
        </h1>
        {firstRun ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Required lock hours default to after school, 4:30–7:30. Change them
            if that is not your block. Then save your IB profile to open Home.
          </p>
        ) : null}
      </div>

      <div className="flux-card space-y-6 px-6 py-8">
      <section className="space-y-3 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900">
        <h2 className="text-base text-foreground">Lock hours</h2>
        <p className="text-sm text-muted-foreground">
          Required. Quiet hours when Catalyst locks your nemesis apps.
        </p>
        {state.schedule.length > 0 ? (
          <ul className="space-y-2">
            {state.schedule.map((window) => (
              <li
                key={window.id}
                className="rounded-2xl bg-background/60 px-4 py-3 text-sm text-foreground"
              >
                {formatWindow(window)}
              </li>
            ))}
          </ul>
        ) : (
          <LockHoursPicker
            days={days}
            start={start}
            end={end}
            error={lockError}
            onToggleDay={(day) =>
              setDays((current) =>
                current.includes(day)
                  ? current.filter((row) => row !== day)
                  : [...current, day],
              )
            }
            onStart={setStart}
            onEnd={setEnd}
            onAdd={() => {
              const result = addLockWindow({ days, start, end, enabled: true });
              setLockError(result.ok ? null : result.reason);
            }}
            onPreset={() => {
              const result = addLockWindow(AFTER_SCHOOL_PRESET);
              setLockError(result.ok ? null : result.reason);
            }}
            onWeeknights={() => {
              const result = addLockWindow(WEEKNIGHT_PRESET);
              setLockError(result.ok ? null : result.reason);
            }}
            addLabel="Save lock hours"
          />
        )}
      </section>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="sols"
          className="h-11 rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="avatar">Profile picture</Label>
        <div className="flex items-center gap-3">
          {state.avatarDataUrl ? (
            <img
              src={state.avatarDataUrl}
              alt=""
              className="size-12 rounded-full object-cover ring-1 ring-border"
            />
          ) : (
            <span className="grid size-12 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {(username || "A").slice(0, 1).toUpperCase()}
            </span>
          )}
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            className="h-11 rounded-xl"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const data = await readImageAsAvatar(file);
              if (!data) {
                setAvatarNotice("Could not read that image.");
                return;
              }
              saveIdentity({ avatarDataUrl: data });
              setAvatarNotice(null);
            }}
          />
        </div>
        {avatarNotice ? (
          <p className="text-sm text-rose-300">{avatarNotice}</p>
        ) : null}
      </div>
      <SpriteRename
        onDraft={(name) => {
          setSpriteDirty(true);
          setSpriteDraft(name);
        }}
      />
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

      <div className="space-y-2">
        <Label htmlFor="colleges">Dream college</Label>
        <Input
          id="colleges"
          value={colleges}
          onChange={(event) => setColleges(event.target.value)}
          placeholder="UCL, Toronto, NUS"
          className="h-11 rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="course">Intended course</Label>
        <Input
          id="course"
          value={course}
          onChange={(event) => setCourse(event.target.value)}
          placeholder="Biomedical engineering"
          className="h-11 rounded-xl"
        />
      </div>

      <p className="text-sm text-muted-foreground">
        {preview.ok
          ? `Class of ${classYear} · six subjects plus TOK and EE.`
          : preview.reason}
      </p>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <Button className="h-11 rounded-full px-6" onClick={save} disabled={!preview.ok}>
        {firstRun ? "Save and go to Home" : "Save profile"}
      </Button>
      </div>
    </PageFrame>
  );
}
