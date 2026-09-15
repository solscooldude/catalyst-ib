"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spark } from "@/components/spark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/routes";
import { saveMotivation, useCatalyst } from "@/lib/store";

export default function MotivationPage() {
  const router = useRouter();
  const state = useCatalyst();
  const [colleges, setColleges] = useState(state.motivation.colleges);
  const [course, setCourse] = useState(state.motivation.course);
  const [why, setWhy] = useState(state.motivation.why);
  const [targetPoints, setTargetPoints] = useState(state.motivation.targetPoints);
  const [unlockNote, setUnlockNote] = useState(state.motivation.unlockNote);
  const [error, setError] = useState<string | null>(null);

  function save(event: React.FormEvent) {
    event.preventDefault();
    const result = saveMotivation({
      colleges,
      course,
      why,
      targetPoints,
      unlockNote,
    });
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    router.push(ROUTES.home);
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <div className="flux-card flex items-start justify-between gap-4 px-6 py-8">
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] text-zinc-400 uppercase">
            Motivation
          </p>
          <h1 className="mt-3 text-4xl text-foreground sm:text-5xl">
            Why the phone stays locked.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            A short reminder for the lock screen. Fill the first three. The
            rest is optional.
          </p>
        </div>
        <Spark mood="idle" size={88} pettable className="hidden shrink-0 sm:block" />
      </div>

      <form className="space-y-5" onSubmit={save}>
        <Field
          id="colleges"
          label="Dream college(s)"
          value={colleges}
          onChange={setColleges}
          placeholder="UCL, Toronto, NUS"
        />
        <Field
          id="course"
          label="Intended course / major"
          value={course}
          onChange={setCourse}
          placeholder="Biomedical engineering"
        />
        <Field
          id="why"
          label="Why it matters"
          value={why}
          onChange={setWhy}
          placeholder="I want the lab, not another hour of For You."
        />
        <Field
          id="points"
          label="Target IB points (optional)"
          value={targetPoints}
          onChange={setTargetPoints}
          placeholder="42"
        />
        <Field
          id="note"
          label="Remember this when you unlock (optional)"
          value={unlockNote}
          onChange={setUnlockNote}
          placeholder="Ten minutes. Then back to the IA."
        />
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <Button type="submit" className="h-11 rounded-full px-6">
          Save motivation
        </Button>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-xl"
      />
    </div>
  );
}
