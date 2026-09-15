"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function TaskOption({
  title,
  detail,
  selected,
  disabled,
  onSelect,
}: {
  title: string;
  detail: string;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      data-selected={selected || undefined}
      aria-pressed={selected}
      onClick={onSelect}
      className="task-option"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="task-option-title text-sm">{title}</p>
          <p className="task-option-meta mt-1 text-xs">{detail}</p>
        </div>
        <span className="task-option-check" aria-hidden>
          {selected ? <Check className="size-3.5" strokeWidth={3} /> : null}
        </span>
      </div>
    </button>
  );
}

export function SelectedTaskChip({
  title,
  detail,
  empty,
}: {
  title?: string;
  detail?: string;
  empty?: string;
}) {
  if (!title) {
    return (
      <p className="rounded-2xl bg-zinc-100 px-3.5 py-3 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
        {empty ?? "Pick a task so you can see what you are locking in."}
      </p>
    );
  }

  return (
    <div className="selected-task-chip">
      <p className="selected-task-label">Selected task</p>
      <p className="selected-task-name mt-1 text-sm">{title}</p>
      {detail ? (
        <p className="selected-task-meta mt-0.5 text-xs">{detail}</p>
      ) : null}
    </div>
  );
}

export function StudyChip({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-selected={selected || undefined}
      aria-pressed={selected}
      onClick={onClick}
      className={cn("study-chip")}
    >
      {children}
    </button>
  );
}
