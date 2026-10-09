"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { BookOpen, Check, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const sans = "font-[family-name:var(--font-inter),system-ui,sans-serif]";

const THEMES = [
  { id: "light", label: "Light", Icon: Sun },
  { id: "sepia", label: "Sepia", Icon: BookOpen },
  { id: "dark", label: "Dark", Icon: Moon },
] as const;

/**
 * Reading theme picker in the menu bar: Light, Sepia (warm paper) or Dark.
 * The choice is site-wide and remembered (next-themes, localStorage). The
 * button shows the current theme's icon; CSS picks it (see the sepia-theme:
 * and dark: variants), so server and client markup always match.
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Close on a click outside, or on Escape (returning focus to the button).
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    // -ml-3 pairs it with the Search button, tighter than the menu bar's gap.
    <div ref={rootRef} className={cn(sans, "relative -ml-3 shrink-0")}>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Reading theme"
        title="Reading theme"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)]"
      >
        <Sun className="size-4 dark:hidden sepia-theme:hidden" aria-hidden="true" />
        <BookOpen className="hidden size-4 sepia-theme:block" aria-hidden="true" />
        <Moon className="hidden size-4 dark:block" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Reading theme"
          className="absolute right-0 top-full z-50 mt-2 w-40 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1 shadow-lg"
        >
          {THEMES.map(({ id, label, Icon }) => {
            const active = theme === id;
            return (
              <button
                key={id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(id);
                  setOpen(false);
                }}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[14px] leading-6 text-[var(--text)] transition-colors hover:bg-[var(--placeholder-bg)] focus-visible:bg-[var(--placeholder-bg)]"
              >
                <Icon className="size-4 text-[var(--muted)]" aria-hidden="true" />
                {label}
                {active && <Check className="ml-auto size-4" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
