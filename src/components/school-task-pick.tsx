"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TaskOption } from "@/components/task-option";
import { Button } from "@/components/ui/button";
import { sourceLabel, type SchoolTask } from "@/lib/school-tasks";
import { markSchoolTaskSubmitted } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SchoolTaskPick({
  task,
  selected,
  onSelect,
}: {
  task: SchoolTask;
  selected: boolean;
  onSelect: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <TaskOption
        title={task.title}
        detail={`${sourceLabel(task.source)} · due ${task.due}${
          task.submitted ? " · submitted" : ""
        }${task.done ? " · done" : ""}`}
        selected={selected}
        disabled={task.done}
        onSelect={onSelect}
      />
      <div className="overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-xs text-muted-foreground"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          School task description
          <ChevronDown
            className={cn(
              "size-3.5 shrink-0 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
        {open ? (
          <div className="space-y-3 px-4 pb-4">
            <p className="text-sm leading-6 text-foreground">
              {task.detail || "No extra description from school."}
            </p>
            {task.courseName ? (
              <p className="text-xs text-muted-foreground">{task.courseName}</p>
            ) : null}
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-full px-4"
              onClick={() => markSchoolTaskSubmitted(task.id, !task.submitted)}
            >
              {task.submitted ? "Undo submitted" : "Mark submitted"}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
