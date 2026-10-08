"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, FileSearch, Search, Share2, X } from "lucide-react";
import type { SearchItem } from "@/lib/search-index";
import {
  loadSearchIndex,
  searchDocs,
  snippetsFor,
  withHighlight,
  type SearchDoc,
  type SearchGroup,
} from "@/lib/site-search";

const PAGE_SIZE = 30;
// Clears the sticky header (bar + tabs) when scrolling to a section.
const HEADER_OFFSET = 112;

function Highlight({
  text,
  re,
  className,
}: {
  text: string;
  re: RegExp | null;
  className: string;
}) {
  if (!re) return <>{text}</>;
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    const at = m.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    parts.push(
      <mark key={at} className={`bg-transparent ${className}`}>
        {m[0]}
      </mark>
    );
    last = at + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}

/** After navigating, scroll to the anchor once the target page has rendered it. */
function scrollToAnchor(path: string, id: string) {
  let tries = 0;
  const tick = () => {
    const el = window.location.pathname === path ? document.getElementById(id) : null;
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET });
    } else if (tries++ < 40) {
      setTimeout(tick, 100);
    }
  };
  setTimeout(tick, 50);
}

export function SiteSearch({
  pages,
  initialQuery = "",
  onClose,
  panelRef,
  overlayRef,
}: {
  pages: SearchItem[];
  initialQuery?: string;
  /** `navigating` is set when a result was opened, so the header closes at once. */
  onClose: (options?: { navigating?: boolean }) => void;
  /** Let the header animate the panel and the dimmed backdrop. */
  panelRef?: React.Ref<HTMLDivElement>;
  overlayRef?: React.Ref<HTMLDivElement>;
}) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [query, setQuery] = React.useState(initialQuery);
  const [docs, setDocs] = React.useState<SearchDoc[] | null>(null);
  const [expanded, setExpanded] = React.useState<{ query: string; keys: Set<string> }>({
    query: "",
    keys: new Set(),
  });
  const [limit, setLimit] = React.useState({ query: "", count: PAGE_SIZE });
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    let alive = true;
    loadSearchIndex(pages).then((index) => {
      if (alive) setDocs(index);
    });
    return () => {
      alive = false;
    };
  }, [pages]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const trimmed = query.trim();
  const result = React.useMemo(
    () => (docs && trimmed ? searchDocs(docs, trimmed) : null),
    [docs, trimmed]
  );
  const openKeys = expanded.query === trimmed ? expanded.keys : new Set<string>();
  const shown = limit.query === trimmed ? limit.count : PAGE_SIZE;

  const status = !docs
    ? "Initializing search"
    : !trimmed
      ? "Type to start searching"
      : !result?.total
        ? "No matching documents"
        : `${result.total} matching document${result.total === 1 ? "" : "s"}`;

  const toggleGroup = (key: string) => {
    const keys = new Set(openKeys);
    if (keys.has(key)) keys.delete(key);
    else keys.add(key);
    setExpanded({ query: trimmed, keys });
  };

  const open = (href: string, e: React.MouseEvent) => {
    // Let modified clicks (new tab / window) behave like normal links.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onClose({ navigating: true });
    router.push(withHighlight(href, trimmed));
    const [path, hash] = href.split("#");
    if (hash) scrollToAnchor(path, decodeURIComponent(hash));
  };

  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(trimmed)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be unavailable (permissions, insecure context); nothing to do.
    }
  };

  // Arrow keys move between results; Enter follows the focused one.
  const focusResult = (step: 1 | -1) => {
    const items = Array.from(
      listRef.current?.querySelectorAll<HTMLElement>("[data-search-result]") ?? []
    );
    if (!items.length) return;
    const at = items.indexOf(document.activeElement as HTMLElement);
    if (at === -1) {
      if (step === 1) items[0].focus();
      return;
    }
    const next = at + step;
    if (next < 0) inputRef.current?.focus();
    else items[Math.min(next, items.length - 1)].focus();
  };
  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      focusResult(e.key === "ArrowDown" ? 1 : -1);
    }
  };

  const re = result?.highlight ?? null;

  const renderGroup = (group: SearchGroup) => {
    const [first, ...rest] = group.hits;
    const doc = first.doc;
    const isOpen = openKeys.has(group.key);
    return (
      <li key={group.key} className="border-b border-border last:border-b-0">
        <a
          href={withHighlight(doc.href, trimmed)}
          data-search-result
          onClick={(e) => open(doc.href, e)}
          className="flex gap-3 px-4 py-4 outline-none transition-colors hover:bg-muted/60 focus-visible:bg-muted/60"
        >
          <FileSearch className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="min-w-0">
            {!doc.isPage && (
              <p className="mb-0.5 text-xs text-muted-foreground">{doc.pageTitle}</p>
            )}
            <p className="text-[1.05rem] leading-snug text-foreground">
              <Highlight text={doc.title} re={re} className="text-primary" />
            </p>
            {snippetsFor(doc, re).map((text, i) => (
              <p key={i} className="mt-2 text-sm leading-relaxed text-foreground/65">
                <Highlight
                  text={text}
                  re={re}
                  className="text-primary underline underline-offset-2"
                />
              </p>
            ))}
            {doc.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-foreground/70"
                  >
                    <Highlight text={tag} re={re} className="text-primary underline" />
                  </span>
                ))}
              </div>
            )}
          </div>
        </a>

        {rest.length > 0 && (
          <div className="pb-3 pl-12 pr-4">
            <button
              type="button"
              onClick={() => toggleGroup(group.key)}
              className="text-sm text-primary hover:underline"
            >
              {isOpen ? "Show less" : `${rest.length} more on this page`}
            </button>
            {isOpen && (
              <ul className="mt-2 space-y-1">
                {rest.map(({ doc: section }) => (
                  <li key={section.href + section.title}>
                    <a
                      href={withHighlight(section.href, trimmed)}
                      data-search-result
                      onClick={(e) => open(section.href, e)}
                      className="block rounded-sm px-2 py-2 outline-none transition-colors hover:bg-muted/60 focus-visible:bg-muted/60"
                    >
                      <p className="text-sm text-foreground">
                        <Highlight text={section.title} re={re} className="text-primary" />
                      </p>
                      {snippetsFor(section, re, 1, 160).map((text, i) => (
                        <p key={i} className="mt-0.5 text-xs leading-relaxed text-foreground/60">
                          <Highlight
                            text={text}
                            re={re}
                            className="text-primary underline underline-offset-2"
                          />
                        </p>
                      ))}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </li>
    );
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[60] bg-black/40" onClick={() => onClose()}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="mx-auto mt-[6vh] flex max-h-[86vh] w-[94%] max-w-[46rem] flex-col overflow-hidden rounded-sm bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                focusResult(1);
              }
            }}
            placeholder="Search"
            aria-label="Search the site"
            className="h-12 w-full bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
          />
          {trimmed && (
            <button
              type="button"
              onClick={share}
              aria-label="Share this search"
              title={copied ? "Link copied" : "Share this search"}
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            >
              {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            </button>
          )}
          <button
            type="button"
            onClick={() => onClose()}
            aria-label="Close search"
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="bg-muted px-4 py-2.5 pl-12 text-sm text-muted-foreground" aria-live="polite">
          {status}
        </p>

        {result && result.groups.length > 0 && (
          <div ref={listRef} onKeyDown={onListKey} className="flex-1 overflow-y-auto">
            <ol>{result.groups.slice(0, shown).map(renderGroup)}</ol>
            {result.groups.length > shown && (
              <button
                type="button"
                onClick={() => setLimit({ query: trimmed, count: shown + PAGE_SIZE })}
                className="w-full border-t border-border px-4 py-3 text-sm text-primary hover:bg-muted/60"
              >
                Show more results
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
