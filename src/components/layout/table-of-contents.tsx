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
  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const root = document.getElementById("page-content");
    if (!root) {
      setEntries([]);
      return;
    }

    const headings = Array.from(
      root.querySelectorAll<HTMLElement>("h2, h3")
    ).filter(
      (h) => h.closest("footer") === null && h.dataset.tocSkip !== "true"
    );

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
    setActiveId(next[0]?.id ?? null);

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (observerEntries) => {
        for (const entry of observerEntries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [pathname]);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-2 font-bold text-foreground/70">Table of contents</p>
      <ul className="space-y-1">
        {entries.map((entry) => (
          <li key={entry.id} className={entry.level === 3 ? "pl-4" : undefined}>
            <a
              href={`#${entry.id}`}
              className={cn(
                "block py-1 pl-3 leading-snug transition-colors",
                entry.level === 2 ? "font-bold" : "font-normal",
                activeId === entry.id
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground"
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
