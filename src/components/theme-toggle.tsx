"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setUiTheme, useUiTheme } from "@/lib/ui-theme";

export function ThemeToggle() {
  const uiTheme = useUiTheme();
  const next = uiTheme === "dark" ? "light" : "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="size-9 rounded-full text-muted-foreground"
      aria-label={`Switch to ${next} theme`}
      onClick={() => setUiTheme(next)}
    >
      {uiTheme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
