"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { highlighterForQuery, setActiveHighlight } from "@/lib/site-search";

const HIGHLIGHT_NAME = "search-results";

// Inlined here rather than in globals.css: the CSS build drops ::highlight() rules.
const HIGHLIGHT_STYLES = `
::highlight(${HIGHLIGHT_NAME}) { background-color: rgb(255 235 59 / 0.6); }
.dark ::highlight(${HIGHLIGHT_NAME}) { background-color: rgb(250 204 21 / 0.3); }
.theme-sepia ::highlight(${HIGHLIGHT_NAME}) { background-color: rgb(217 119 6 / 0.3); }
`;

// Highlights the words of a search (?h=...) wherever they appear in the page's
// content, like mkdocs-material does after opening a search result. It uses
// the CSS Custom Highlight API, which paints text ranges without touching the
// DOM, so React-rendered content is never rewrapped or disturbed.
export function SearchHighlighter() {
  const pathname = usePathname();
  const query = useSearchParams().get("h")?.trim() ?? "";

  React.useEffect(() => {
    setActiveHighlight(query);

    const registry = typeof CSS !== "undefined" && "highlights" in CSS ? CSS.highlights : null;
    const root = document.getElementById("page-content");
    const re = highlighterForQuery(query);
    if (!registry || !root || !re) {
      registry?.delete(HIGHLIGHT_NAME);
      return;
    }

    const paint = () => {
      const ranges: Range[] = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: (node) =>
          node.parentElement?.closest("script, style, noscript")
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT,
      });
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        for (const match of (node.nodeValue ?? "").matchAll(re)) {
          const range = new Range();
          range.setStart(node, match.index ?? 0);
          range.setEnd(node, (match.index ?? 0) + match[0].length);
          ranges.push(range);
        }
      }
      registry.set(HIGHLIGHT_NAME, new Highlight(...ranges));
    };

    // Repaint when the content changes (late renders, list filters).
    let frame = requestAnimationFrame(paint);
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      registry.delete(HIGHLIGHT_NAME);
    };
  }, [pathname, query]);

  return <style>{HIGHLIGHT_STYLES}</style>;
}
