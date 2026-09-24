"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AppSelect } from "@/components/app-select";
import { MissingSubjectsNote } from "@/components/missing-subjects-note";
import { TaskDescriptionField } from "@/components/task-description-field";
import { SelectedTaskChip, StudyChip } from "@/components/task-option";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { chosenSubjectOptions } from "@/lib/ib";
import { ROUTES } from "@/lib/routes";
import { startStudySession, useCatalyst } from "@/lib/store";

const GOALS = [15, 25, 45, 60] as const;

export function StudyStartForm({
  formId,
  hideStart = false,
}: {
  formId?: string;
  hideStart?: boolean;
}) {
  const router = useRouter();
  const state = useCatalyst();
  const catalogKey = `${state.profile.subjects.join(",")}:${state.profile.core.join(",")}`;
  const options = chosenSubjectOptions(state.profile);
  const [subjectKey, setSubjectKey] = useState(options[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const next = chosenSubjectOptions(state.profile);
    setSubjectKey((current) =>
      next.some((row) => row.id === current) ? current : (next[0]?.id ?? ""),
    );
  }, [catalogKey, state.profile]);

  const selected = options.find((row) => row.id === subjectKey);
  const subjectLabel = selected?.label ?? "Subject";
  const blocked = options.length === 0;

  function begin(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) {
      setError("Add subjects in Setup or Profile first.");
      return;
    }
    const result = startStudySession({
      subjectId: selected.statId,
      title,
      minutes,
    });
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    router.push(ROUTES.session);
  }

  if (blocked) {
    return (
      <div className="grid gap-4">
        <MissingSubjectsNote />
      </div>
    );
  }

  return (
    <form id={formId} className="grid gap-4" onSubmit={begin}>
      <div className="space-y-2">
        <Label htmlFor="study-subject">Subject</Label>
        <AppSelect
          id="study-subject"
          value={subjectKey}
          onChange={setSubjectKey}
          placeholder="Choose a subject"
          options={options.map((subject) => ({
            value: subject.id,
            label: subject.label,
          }))}
        />
      </div>
      <TaskDescriptionField
        id="study-what"
        value={title}
        onChange={setTitle}
      />
      {title.trim() ? (
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
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      {hideStart ? null : (
        <Button
          type="submit"
          disabled={!subjectKey || !title.trim()}
          className="h-11 rounded-full"
        >
          Start focus
          <ArrowRight className="size-4" />
        </Button>
      )}
    </form>
  );
}
