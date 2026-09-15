"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AppSelect } from "@/components/app-select";
import { SelectedTaskChip, StudyChip } from "@/components/task-option";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type SubjectId } from "@/lib/constants";
import { studySubjectOptions } from "@/lib/ib";
import { ROUTES } from "@/lib/routes";
import { startStudySession, useCatalyst } from "@/lib/store";

const GOALS = [15, 25, 45, 60] as const;

export function StudyStartForm() {
  const router = useRouter();
  const state = useCatalyst();
  const options = studySubjectOptions(state.profile);
  const [subjectId, setSubjectId] = useState<SubjectId>(
    (options[0]?.statId ?? "biology") as SubjectId,
  );
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const subjectLabel =
    options.find((row) => row.statId === subjectId)?.label ?? "Subject";

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
          className="h-11 rounded-xl border-2 border-zinc-300 bg-white text-zinc-900 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </div>
      {title.trim().length >= 3 ? (
        <SelectedTaskChip
          title={title.trim()}
          detail={`${subjectLabel}${minutes ? ` · soft goal ${minutes} min` : " · count up until you End"}`}
        />
      ) : null}
      <div className="space-y-2">
        <Label>Optional soft goal</Label>
        <div className="flex flex-wrap gap-2">
          <StudyChip selected={minutes === null} onClick={() => setMinutes(null)}>
            No goal
          </StudyChip>
          {GOALS.map((block) => (
            <StudyChip
              key={block}
              selected={minutes === block}
              onClick={() => setMinutes(block)}
            >
              {block} min
            </StudyChip>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Counts up until you End. A goal never auto-stops the block.
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
