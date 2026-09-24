"use client";

import { useEffect, useState } from "react";
import { AppSelect } from "@/components/app-select";
import { MissingSubjectsNote } from "@/components/missing-subjects-note";
import { TaskDescriptionField } from "@/components/task-description-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { chosenSubjectOptions } from "@/lib/ib";
import { addManualSchoolTask, useCatalyst } from "@/lib/store";
import type { SchoolTask } from "@/lib/school-tasks";

export function ManualTaskForm({
  onAdded,
}: {
  onAdded?: (task: SchoolTask) => void;
}) {
  const state = useCatalyst();
  const catalogKey = `${state.profile.subjects.join(",")}:${state.profile.core.join(",")}`;
  const options = chosenSubjectOptions(state.profile);
  const [title, setTitle] = useState("");
  const [subjectKey, setSubjectKey] = useState(options[0]?.id ?? "");
  const [due, setDue] = useState("");
  const [detail, setDetail] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const next = chosenSubjectOptions(state.profile);
    setSubjectKey((current) =>
      next.some((row) => row.id === current) ? current : (next[0]?.id ?? ""),
    );
  }, [catalogKey, state.profile]);

  const selected = options.find((row) => row.id === subjectKey);
  const blocked = options.length === 0;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!selected) {
      setError("Add subjects in Setup or Profile first.");
      return;
    }
    const result = addManualSchoolTask({
      title,
      subject: selected.label,
      subjectId: selected.statId,
      due,
      detail,
    });
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    setTitle("");
    setDue("");
    setDetail("");
    setError(null);
    onAdded?.(result.task);
  }

  if (blocked) {
    return <MissingSubjectsNote />;
  }

  return (
    <form className="space-y-3" onSubmit={submit}>
      <div className="space-y-2">
        <Label htmlFor="task-title">Task</Label>
        <Input
          id="task-title"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Biology IA first draft"
          className="h-11 rounded-xl"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="task-subject">Subject</Label>
          <AppSelect
            id="task-subject"
            value={subjectKey}
            onChange={setSubjectKey}
            placeholder="Choose a subject"
            options={options.map((subject) => ({
              value: subject.id,
              label: subject.label,
            }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="task-due">Due (optional)</Label>
          <Input
            id="task-due"
            value={due}
            onChange={(event) => setDue(event.target.value)}
            placeholder="Fri"
            className="h-11 rounded-xl"
          />
        </div>
      </div>
      <TaskDescriptionField
        id="task-detail"
        value={detail}
        onChange={setDetail}
      />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <Button
        type="submit"
        disabled={!subjectKey || !title.trim() || !detail.trim()}
        className="h-11 rounded-full px-5"
      >
        Add task
      </Button>
    </form>
  );
}
