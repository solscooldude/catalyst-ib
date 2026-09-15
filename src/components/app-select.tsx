"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { nativeSelectClass } from "@/lib/select-class";
import { cn } from "@/lib/utils";

export type AppSelectOption = {
  value: string;
  label: string;
};

export type AppSelectGroup = {
  label: string;
  options: AppSelectOption[];
};

type AppSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options?: AppSelectOption[];
  groups?: AppSelectGroup[];
  placeholder?: string;
};

export function AppSelect({
  id,
  value,
  onChange,
  options = [],
  groups,
  placeholder = "Choose",
}: AppSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const flat = groups?.flatMap((group) => group.options) ?? options;
  const selected = flat.find((row) => row.value === value);

  useEffect(() => {
    function onDoc(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function pick(next: string) {
    onChange(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className={cn(nativeSelectClass, "flex items-center justify-between gap-2 text-left")}
      >
        <span
          className={cn(
            "truncate font-medium text-zinc-900",
            !selected && "font-normal text-zinc-500",
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="app-select-menu absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-xl py-1 text-sm shadow-[0_16px_40px_-20px_rgb(0_0_0_/_0.7)]"
        >
          {groups
            ? groups.map((group) => (
                <li key={group.label}>
                  <p className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-[0.12em] text-zinc-600 uppercase dark:text-zinc-400">
                    {group.label}
                  </p>
                  {group.options.map((option) => (
                    <OptionRow
                      key={option.value}
                      option={option}
                      selected={option.value === value}
                      onPick={pick}
                    />
                  ))}
                </li>
              ))
            : options.map((option) => (
                <OptionRow
                  key={option.value}
                  option={option}
                  selected={option.value === value}
                  onPick={pick}
                />
              ))}
        </ul>
      ) : null}
    </div>
  );
}

function OptionRow({
  option,
  selected,
  onPick,
}: {
  option: AppSelectOption;
  selected: boolean;
  onPick: (value: string) => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={() => onPick(option.value)}
      className="app-select-item flex min-h-11 w-full items-center justify-between px-3 py-2.5 text-left font-medium"
      data-selected={selected || undefined}
    >
      <span>{option.label}</span>
      {selected ? <Check className="size-4 shrink-0 text-teal-700 dark:text-primary" /> : null}
    </button>
  );
}
