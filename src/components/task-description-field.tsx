"use client";

import { useState } from "react";
import { ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TASK_DESCRIPTION_MAX } from "@/lib/task-description";

export function TaskDescriptionField({
  id,
  value,
  onChange,
  disabled = false,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const [note, setNote] = useState<string | null>(null);

  async function pasteFromClipboard() {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      if (!text) {
        setNote("Clipboard is empty. Copy the assignment first.");
        return;
      }
      onChange(text.slice(0, TASK_DESCRIPTION_MAX));
      setNote(null);
    } catch {
      setNote(
        "Clipboard access was blocked. Paste with Ctrl or Cmd + V instead.",
      );
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label htmlFor={id}>Task description</Label>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="h-8 rounded-full px-3 text-xs"
          onClick={() => void pasteFromClipboard()}
        >
          <ClipboardPaste className="size-3.5" />
          Paste from Classroom / ManageBac
        </Button>
      </div>
      <Textarea
        id={id}
        required
        disabled={disabled}
        value={value}
        maxLength={TASK_DESCRIPTION_MAX}
        onChange={(event) => onChange(event.target.value)}
        placeholder="What are you working on?"
        className="focus-field focus-field-area"
      />
      <p className="text-xs text-muted-foreground">
        Copy the assignment in Classroom or ManageBac, then paste it here.
      </p>
      {note ? (
        <p className="text-xs text-amber-700 dark:text-amber-200">{note}</p>
      ) : null}
    </div>
  );
}
