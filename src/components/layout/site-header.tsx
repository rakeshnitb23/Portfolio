"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { NAV_LINKS, TOP_NAV_LINKS, isNavLinkActive } from "@/lib/nav";
import type { SearchItem } from "@/lib/search-index";
import { PERSON } from "@/lib/site";

function SiteLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="M12 8a3 3 0 0 0 3-3 3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3m0 3.54C9.64 9.35 6.5 8 3 8v11c3.5 0 6.64 1.35 9 3.54 2.36-2.19 5.5-3.54 9-3.54V8c-3.5 0-6.64 1.35-9 3.54" />
    </svg>
  );
}

function SearchOverlay({
  index,
  onClose,
}: {
  index: SearchItem[];
  onClose: () => void;
}) {
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.slice(0, 8);
    return index
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [query, index]);

  return (
    <div className="fixed inset-0 z-[60] bg-black/40" onClick={onClose}>
      <div
        className="mx-auto mt-[10vh] w-[92%] max-w-[38rem] rounded-sm bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="max-h-[60vh] overflow-y-auto py-2">
          {results.length === 0 && (
            <li className="px-4 py-6 text-sm text-muted-foreground">
              No matching documents
            </li>
          )}
          {results.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="block px-4 py-2.5 hover:bg-muted"
              >
                <p className="text-[0.7rem] uppercase tracking-wide text-muted-foreground">
                  {item.group}
                </p>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">{item.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SiteHeader({ searchIndex }: { searchIndex: SearchItem[] }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="sticky top-0 z-50">
      {/* Header bar */}
      <header className="bg-[var(--md-primary)] text-white shadow-[0_0_0.2rem_rgba(0,0,0,0),0_0.2rem_0.4rem_rgba(0,0,0,0.1)]">
        <div className="mx-auto flex h-12 w-full max-w-[78.25rem] items-center gap-4 px-4">
          <button
            type="button"
            className="lg:hidden shrink-0"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex h-10 w-10 shrink-0 items-center justify-center">
            <SiteLogo />
          </Link>

          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-bold">{PERSON.name}</p>
          </div>

          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center gap-3 rounded-[0.125rem] bg-black/25 text-white/90 transition-colors hover:bg-black/35 sm:w-[14.625rem] sm:justify-start sm:px-3"
          >
            <Search className="h-6 w-6 shrink-0 text-white/70" aria-hidden="true" />
            <span className="hidden truncate text-white/70 sm:inline">Search</span>
          </button>

          <a
            href={PERSON.github + "/Portfolio"}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 items-center gap-4 pr-1 text-white/90 hover:text-white sm:flex"
          >
            <FaGithub className="h-6 w-6" />
            <span className="text-[0.8125rem]">Portfolio</span>
          </a>
        </div>
      </header>

      {/* Tabs row */}
      <nav
        aria-label="Tabs"
        className="hidden overflow-x-auto bg-[var(--md-primary)] text-white lg:block"
      >
        <div className="mx-auto flex h-12 w-full max-w-[78.25rem] items-center gap-8 px-4">
          {TOP_NAV_LINKS.map((link) => {
            const active = isNavLinkActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "border-b-2 py-1 text-sm font-normal uppercase transition-opacity",
                  active
                    ? "border-white opacity-100"
                    : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav className="absolute inset-x-0 top-12 max-h-[calc(100vh-3rem)] overflow-y-auto border-b border-border bg-background shadow-md lg:hidden">
          <ul className="mx-auto w-full max-w-[78.25rem] px-4 py-2">
            {NAV_LINKS.map((link) => {
              const active = isNavLinkActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block py-2.5 text-sm",
                      active ? "font-medium text-primary" : "text-foreground/80"
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {searchOpen && (
        <SearchOverlay index={searchIndex} onClose={() => setSearchOpen(false)} />
      )}
    </div>
  );
}
