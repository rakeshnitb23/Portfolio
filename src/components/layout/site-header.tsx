"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SiteSearch } from "@/components/layout/site-search";
import { NAV_LINKS, TOP_NAV_LINKS, isNavLinkActive } from "@/lib/nav";
import type { SearchItem } from "@/lib/search-index";
import { getActiveHighlight, loadSearchIndex, subscribeActiveHighlight } from "@/lib/site-search";
import { PERSON } from "@/lib/site";

const subscribeNever = () => () => {};

/** The ?q= value from a shared search link ("" on the server and when absent). */
function useUrlQuery(): string {
  return React.useSyncExternalStore(
    subscribeNever,
    () => new URLSearchParams(window.location.search).get("q") ?? "",
    () => ""
  );
}

// Article pages (writing posts, personal posts, project write-ups) show their
// title in the header as soon as they open.
const ARTICLE_PATH = /^\/(?:writing(?:\/personal)?|projects)\/[^/]+$/;

/**
 * mkdocs-material's header title: on article pages, and elsewhere once the
 * page's main heading scrolls under the header, the page title replaces the
 * site name.
 */
function usePageTitleInHeader(pathname: string, headerRef: React.RefObject<HTMLElement | null>) {
  const [state, setState] = React.useState({ title: "", show: false });

  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      const h1 = document.querySelector<HTMLElement>("#page-content h1");
      let title = "";
      if (h1) {
        const copy = h1.cloneNode(true) as HTMLElement;
        copy.querySelectorAll("small").forEach((el) => el.remove()); // e.g. "(8)" counts
        title = (copy.textContent ?? "").replace(/\s+/g, " ").trim();
      }
      const headerBottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
      const show =
        !!title &&
        !!h1 &&
        (ARTICLE_PATH.test(pathname) || h1.getBoundingClientRect().bottom <= headerBottom);
      setState((prev) => (prev.title === title && prev.show === show ? prev : { title, show }));
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname, headerRef]);

  return state;
}

// Header motion. Everything animates transform and opacity only.
const POP_MS = 120;
const SLIDE_MS = 220;
const PANEL_MS = 240;
const LABEL_MS = 280;
const POP = "scale(1.04)";
const EASE = "cubic-bezier(0.2, 0.8, 0.2, 1)";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Transform that shrinks `el` from its own box onto `target`, scaling about its centre. */
function collapseOnto(el: HTMLElement, target: DOMRect): string {
  const box = el.getBoundingClientRect();
  const dx = target.left + target.width / 2 - (box.left + box.width / 2);
  const dy = target.top + target.height / 2 - (box.top + box.height / 2);
  return `translate(${dx}px, ${dy}px) scale(${target.width / box.width}, ${target.height / box.height})`;
}

interface HeaderLabelText {
  text: string;
  bold: boolean;
}

/**
 * The top-left header label. When its text changes, the old text slides up
 * and fades out while the new one slides in from below; with
 * prefers-reduced-motion the swap is instant. Long text truncates.
 */
function HeaderLabel({ label }: { label: HeaderLabelText }) {
  const [shown, setShown] = React.useState<{
    current: HeaderLabelText;
    previous: HeaderLabelText | null;
    id: number;
  }>({ current: label, previous: null, id: 0 });
  // A new label starts a swap (React's "adjust state when a prop changes" pattern).
  if (shown.current.text !== label.text || shown.current.bold !== label.bold) {
    setShown({ current: label, previous: shown.current, id: shown.id + 1 });
  }

  const currentRef = React.useRef<HTMLParagraphElement>(null);
  const previousRef = React.useRef<HTMLParagraphElement>(null);

  React.useLayoutEffect(() => {
    if (shown.id === 0) return; // first render: nothing to swap from
    const id = shown.id;
    const clear = () => setShown((s) => (s.id === id ? { ...s, previous: null } : s));
    const exit =
      prefersReducedMotion() || !previousRef.current
        ? null
        : previousRef.current.animate(
            [
              { opacity: 1, transform: "none" },
              { opacity: 0, transform: "translateY(-1rem)" },
            ],
            { duration: LABEL_MS, easing: EASE, fill: "forwards" }
          );
    if (exit) {
      currentRef.current?.animate(
        [
          { opacity: 0, transform: "translateY(1rem)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: LABEL_MS, easing: EASE }
      );
      exit.finished.then(clear, clear);
    } else {
      queueMicrotask(clear);
    }
  }, [shown.id]);

  const base = "absolute inset-x-0 top-0 truncate text-lg leading-[3rem]";
  return (
    <>
      {shown.previous && (
        <p
          key={shown.id - 1}
          ref={previousRef}
          aria-hidden="true"
          className={cn(base, shown.previous.bold && "font-bold", "motion-reduce:hidden")}
        >
          {shown.previous.text}
        </p>
      )}
      <p key={shown.id} ref={currentRef} className={cn(base, shown.current.bold && "font-bold")}>
        {shown.current.text}
      </p>
    </>
  );
}

function SiteLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="M12 8a3 3 0 0 0 3-3 3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3m0 3.54C9.64 9.35 6.5 8 3 8v11c3.5 0 6.64 1.35 9 3.54 2.36-2.19 5.5-3.54 9-3.54V8c-3.5 0-6.64 1.35-9 3.54" />
    </svg>
  );
}

export function SiteHeader({ searchIndex }: { searchIndex: SearchItem[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const headerRef = React.useRef<HTMLDivElement>(null);
  const pageTitle = usePageTitleInHeader(pathname, headerRef);

  // The query highlighted on this page (after opening a search result).
  const highlightQuery = React.useSyncExternalStore(
    subscribeActiveHighlight,
    getActiveHighlight,
    () => ""
  );

  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const searchShadowRef = React.useRef<HTMLSpanElement>(null);
  const searchPanelRef = React.useRef<HTMLDivElement>(null);
  const searchOverlayRef = React.useRef<HTMLDivElement>(null);
  const [searchPhase, setSearchPhase] = React.useState<"closed" | "open" | "closing">("closed");
  // Animation bookkeeping, read and written only by the handlers below.
  const searchMotion = React.useRef({ busy: false, open: false, lifted: false, dx: 0 });

  // A shared link (?q=...) opens search with that query, until it is closed.
  const urlQuery = useUrlQuery();
  const [urlQueryDismissed, setUrlQueryDismissed] = React.useState(false);
  const urlSearchOpen = urlQuery !== "" && !urlQueryDismissed;
  const showSearch = searchPhase !== "closed" || urlSearchOpen;
  React.useEffect(() => {
    if (urlSearchOpen) searchMotion.current.open = true;
  }, [urlSearchOpen]);

  // Open: the control pops, slides toward the header's centre, then the panel
  // grows out of it (layout effect below) over the dimmed page.
  const openSearch = React.useCallback(async () => {
    const motion = searchMotion.current;
    const button = searchButtonRef.current;
    if (motion.busy || motion.open) return;
    motion.open = true;
    if (!button || prefersReducedMotion()) {
      setSearchPhase("open");
      return;
    }
    motion.busy = true;
    const header = button.closest("header")?.getBoundingClientRect();
    const box = button.getBoundingClientRect();
    motion.dx = header ? header.left + header.width / 2 - (box.left + box.width / 2) : 0;
    try {
      searchShadowRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: POP_MS,
        easing: "ease-out",
        fill: "forwards",
      });
      await button.animate([{ transform: "none" }, { transform: POP }], {
        duration: POP_MS,
        easing: "ease-out",
        fill: "forwards",
      }).finished;
      await button.animate(
        [{ transform: POP }, { transform: `translateX(${motion.dx}px) ${POP}` }],
        { duration: SLIDE_MS, easing: EASE, fill: "forwards" }
      ).finished;
      motion.lifted = true;
    } catch {
      // Interrupted: open without the rest of the motion.
    }
    motion.busy = false;
    setSearchPhase("open");
  }, []);

  React.useLayoutEffect(() => {
    const panel = searchPanelRef.current;
    const overlay = searchOverlayRef.current;
    const button = searchButtonRef.current;
    if (searchPhase !== "open" || !searchMotion.current.lifted || !panel || !overlay || !button) {
      return;
    }
    panel.animate(
      [
        { transform: collapseOnto(panel, button.getBoundingClientRect()), opacity: 0 },
        { transform: "none", opacity: 1 },
      ],
      { duration: PANEL_MS, easing: EASE }
    );
    overlay.animate([{ opacity: 0 }, { opacity: 1 }], { duration: PANEL_MS, easing: "ease-out" });
    // The control hands over to the panel.
    button.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: PANEL_MS / 2,
      easing: "ease-out",
      fill: "forwards",
    });
  }, [searchPhase]);

  // Close (Escape, overlay, X) plays the opening in reverse, then returns
  // focus to the search button. Opening a result closes at once, as before.
  const closeSearch = React.useCallback(async (options?: { navigating?: boolean }) => {
    const motion = searchMotion.current;
    const button = searchButtonRef.current;
    if (motion.busy) return;
    const finish = () => {
      button?.getAnimations().forEach((a) => a.cancel());
      searchShadowRef.current?.getAnimations().forEach((a) => a.cancel());
      Object.assign(motion, { busy: false, open: false, lifted: false, dx: 0 });
      setSearchPhase("closed");
      setUrlQueryDismissed(true);
    };
    if (options?.navigating || !button || prefersReducedMotion()) {
      finish();
      if (!options?.navigating) button?.focus();
      return;
    }
    motion.busy = true;
    setSearchPhase("closing");
    try {
      const panel = searchPanelRef.current;
      const overlay = searchOverlayRef.current;
      if (panel && overlay) {
        const target = collapseOnto(panel, button.getBoundingClientRect());
        overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: PANEL_MS,
          easing: "ease-in",
          fill: "forwards",
        });
        if (motion.lifted) {
          button.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: PANEL_MS,
            easing: "ease-in",
            fill: "forwards",
          });
        }
        await panel.animate(
          [
            { transform: "none", opacity: 1 },
            { transform: target, opacity: 0 },
          ],
          { duration: PANEL_MS, easing: EASE, fill: "forwards" }
        ).finished;
      }
      if (motion.lifted) {
        await button.animate(
          [{ transform: `translateX(${motion.dx}px) ${POP}` }, { transform: POP }],
          { duration: SLIDE_MS, easing: EASE, fill: "forwards" }
        ).finished;
        searchShadowRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: POP_MS,
          easing: "ease-in",
          fill: "forwards",
        });
        await button.animate([{ transform: POP }, { transform: "none" }], {
          duration: POP_MS,
          easing: "ease-in",
          fill: "forwards",
        }).finished;
      }
    } catch {
      // Interrupted: finish closing without the rest of the motion.
    }
    finish();
    button.focus();
  }, []);

  // "/" (outside text fields) or Cmd/Ctrl+K opens search.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement | null)?.closest(
        "input, textarea, select, [contenteditable='true']"
      );
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openSearch]);

  return (
    <div ref={headerRef} className="sticky top-0 z-50">
      {/* Header bar */}
      <header className="bg-[var(--md-primary)] text-white shadow-[0_0_0.2rem_rgba(0,0,0,0),0_0.2rem_0.4rem_rgba(0,0,0,0.1)]">
        <div className="mx-auto flex h-12 w-full max-w-[96rem] items-center gap-4 px-4 sm:px-6 lg:px-8 xl:px-12">
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

          <div className="relative h-12 min-w-0 flex-1 overflow-hidden">
            <HeaderLabel
              label={
                pageTitle.show
                  ? { text: pageTitle.title, bold: false }
                  : { text: PERSON.name, bold: true }
              }
            />
          </div>

          <ThemeToggle />

          <button
            ref={searchButtonRef}
            type="button"
            aria-label="Search"
            onClick={openSearch}
            // Start building the index as soon as the visitor reaches for search.
            onPointerEnter={() => loadSearchIndex(searchIndex)}
            onFocus={() => loadSearchIndex(searchIndex)}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center gap-3 rounded-[0.125rem] bg-black/25 text-white/90 transition-colors hover:bg-black/35 sm:w-[14.625rem] sm:justify-start sm:px-3"
          >
            {/* Shadow for the "pop"; only its opacity animates. */}
            <span
              ref={searchShadowRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            />
            <Search className="h-6 w-6 shrink-0 text-white/70" aria-hidden="true" />
            <span
              className={cn("hidden truncate sm:inline", highlightQuery ? "text-white" : "text-white/70")}
            >
              {highlightQuery || "Search"}
            </span>
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
        <div className="mx-auto flex h-12 w-full max-w-[96rem] items-center gap-8 px-4 sm:px-6 lg:px-8 xl:px-12">
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
          <ul className="mx-auto w-full max-w-[96rem] px-4 py-2">
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

      {showSearch && (
        <SiteSearch
          pages={searchIndex}
          initialQuery={urlQuery || highlightQuery}
          onClose={closeSearch}
          panelRef={searchPanelRef}
          overlayRef={searchOverlayRef}
        />
      )}
    </div>
  );
}
