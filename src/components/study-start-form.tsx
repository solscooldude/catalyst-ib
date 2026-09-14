"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AppSelect } from "@/components/app-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type SubjectId } from "@/lib/constants";
import { studySubjectOptions } from "@/lib/ib";
import { ROUTES } from "@/lib/routes";
import { startStudySession, useCatalyst } from "@/lib/store";

const BLOCKS = [15, 25, 45, 60];

export function StudyStartForm() {
  const router = useRouter();
  const state = useCatalyst();
  const options = studySubjectOptions(state.profile);
  const [subjectId, setSubjectId] = useState<SubjectId>(
    (options[0]?.statId ?? "biology") as SubjectId,
  );
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState(25);
  const [error, setError] = useState<string | null>(null);

  function begin(event: React.FormEvent) {
    event.preventDefault();
    const result = startStudySession({ subjectId, title, minutes });
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    router.push(ROUTES.lock);
  }

  return (
    <form className="grid gap-4" onSubmit={begin}>
      <div className="space-y-2">
        <Label htmlFor="study-subject">Subject</Label>
        <AppSelect
          id="study-subject"
          value={subjectId}
          onChange={(next) => setSubjectId(next as SubjectId)}
          options={options.map((subject) => ({
            value: subject.statId,
            label: subject.label,
          }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="study-what">What are you studying</Label>
        <Input
          id="study-what"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Paper 2 timing. Chapter 4 notes. IA data table."
          className="h-11 rounded-xl"
        />
      </div>
      <div className="space-y-2">
        <Label>Block length</Label>
        <div className="flex flex-wrap gap-2">
          {BLOCKS.map((block) => (
            <button
              key={block}
              type="button"
              onClick={() => setMinutes(block)}
              className={`rounded-full px-3 py-1.5 text-sm ring-1 ${
                minutes === block
                  ? "bg-primary/15 text-foreground ring-primary/40"
                  : "text-muted-foreground ring-white/10"
              }`}
            >
              {block} min
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Phone locks for this block. Demo speed shortens the wait, not the
          tokens-per-five-minutes math. No +5 — that is official tasks only.
        </p>
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <Button type="submit" className="h-11 rounded-full">
        Lock and start
        <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
