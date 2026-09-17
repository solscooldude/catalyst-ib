"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addManualSchoolTask } from "@/lib/store";

export function ManualTaskForm({
  onAdded,
}: {
  onAdded?: (title: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [due, setDue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const result = addManualSchoolTask({
      title,
      subject,
      due,
    });
    if (!result.ok) {
      setError(result.reason);
      return;
    }
    setTitle("");
    setSubject("");
    setDue("");
    setError(null);
    onAdded?.(title.trim());
  }

  return (
    <form className="space-y-3" onSubmit={submit}>
      <div className="space-y-2">
        <Label htmlFor="task-title">Task</Label>
        <Input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Biology IA first draft"
          className="h-11 rounded-xl"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="task-subject">Subject (optional)</Label>
          <Input
            id="task-subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Biology HL"
            className="h-11 rounded-xl"
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
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <Button type="submit" className="h-11 rounded-full px-5">
        Add task
      </Button>
    </form>
  );
}
