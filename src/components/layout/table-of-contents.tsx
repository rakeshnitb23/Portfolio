"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface TocEntry {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function TableOfContents() {
  const pathname = usePathname();
  const [entries, setEntries] = React.useState<TocEntry[]>([]);

  React.useEffect(() => {
    const root = document.getElementById("page-content");
    if (!root) {
      setEntries([]);
      return;
    }

    const headings = Array.from(
      root.querySelectorAll<HTMLElement>("h2, h3")
    ).filter((h) => h.closest("footer") === null);

    const used = new Set<string>();
    const next: TocEntry[] = headings.map((h) => {
      if (!h.id) {
        let slug = slugify(h.textContent ?? "");
        let i = 2;
        while (used.has(slug) || document.getElementById(slug)) {
          slug = `${slugify(h.textContent ?? "")}-${i++}`;
        }
        h.id = slug;
      }
      used.add(h.id);
      return {
        id: h.id,
        text: h.textContent ?? "",
        level: h.tagName === "H3" ? 3 : 2,
      };
    });

    setEntries(next);
  }, [pathname]);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-2 text-foreground/70">Table of contents</p>
      <ul className="space-y-1">
        {entries.map((entry) => (
          <li key={entry.id} style={{ paddingLeft: entry.level === 3 ? "2rem" : "0" }}>
            <a
              href={`#${entry.id}`}
              className={cn(
                "block leading-snug transition-colors hover:text-foreground",
                entry.level === 2
                  ? "font-bold text-foreground/70"
                  : "font-normal text-foreground/60"
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
