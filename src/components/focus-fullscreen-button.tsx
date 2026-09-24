"use client";

import { useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  exitFullscreen,
  fullscreenElement,
  fullscreenSupported,
  listenFullscreen,
  requestFullscreen,
} from "@/lib/fullscreen";
import { cn } from "@/lib/utils";

export function FocusFullscreenButton({
  target,
  className,
}: {
  target?: React.RefObject<HTMLElement | null>;
  className?: string;
}) {
  const [on, setOn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(fullscreenSupported());
    return listenFullscreen(() => setOn(Boolean(fullscreenElement())));
  }, []);

  if (!ready) return null;

  const label = on ? "Exit fullscreen" : "Enter fullscreen";

  return (
    <Button
      type="button"
      variant="outline"
      aria-label={label}
      aria-pressed={on}
      className={cn(
        "h-11 shrink-0 rounded-full px-4 text-sm ring-1 ring-primary/40",
        on && "bg-primary/15 text-foreground",
        className,
      )}
      onClick={() => {
        if (on) {
          void exitFullscreen();
          return;
        }
        void requestFullscreen(target?.current ?? document.documentElement);
      }}
    >
      {on ? (
        <Minimize2 className="size-4 text-primary" />
      ) : (
        <Maximize2 className="size-4 text-primary" />
      )}
      <span>{on ? "Exit" : "Fullscreen"}</span>
    </Button>
  );
}
