"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

// Shows the current mode (sun in light, moon in dark). Both icons render and
// CSS picks one, so server and client markup always match.
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
    >
      <Sun className="h-5 w-5 dark:hidden" aria-hidden="true" />
      <Moon className="hidden h-5 w-5 dark:block" aria-hidden="true" />
    </button>
  );
}
