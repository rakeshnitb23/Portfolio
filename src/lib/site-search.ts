import type { SearchItem } from "@/lib/search-index";

// Full-text site search, modelled on mkdocs-material's: every page is split
// into sections at its headings, every section is a searchable document, and
// results are grouped by page. The index is built in the browser the first
// time search opens, by reading the rendered HTML of each page, so it always
// matches what visitors actually see — no build step to keep in sync.

export interface SearchDoc {
  /** Where the result links: a page path, optionally with a #anchor. */
  href: string;
  /** Results sharing a key are grouped ("N more on this page"). */
  group: string;
  pageTitle: string;
  title: string;
  paragraphs: string[];
  tags: string[];
  /** True for a page's top section, or a standalone item such as a blog post. */
  isPage: boolean;
  words: { title: string[]; tags: string[]; text: string[] };
}

export interface SearchHit {
  doc: SearchDoc;
  score: number;
}

export interface SearchGroup {
  key: string;
  score: number;
  hits: SearchHit[];
}

export interface SearchResult {
  groups: SearchGroup[];
  total: number;
  highlight: RegExp | null;
}

/** Same slug rule as the table of contents, so anchors line up with its heading ids. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

// Chrome and controls that are not content: navigation, buttons, forms, and
// anything a page marks with data-search-ignore (placeholders, filter pills).
const STRIP =
  "script, style, noscript, svg, nav, footer, form, button, input, select, textarea, label, [data-search-ignore]";
const BLOCK =
  "p, li, blockquote, pre, td, th, dt, dd, figcaption, h4, h5, h6, div, section, article, header";
const NOISE = /^(↑ Back to top|← Previous:.*|Continue reading →|Coming soon\.)$/;

const hasLetters = (text: string) => /\p{L}/u.test(text);
const clean = (text: string | null) => (text ?? "").replace(/\s+/g, " ").trim();

/**
 * Appends a text node's text, adding a space when it starts a new element so
 * adjacent inline elements ("<time>…</time><span>…</span>") don't run together.
 */
function append(buf: string, text: string, newElement: boolean): string {
  const needsSpace = newElement && buf && !/\s$/.test(buf) && !/^[\s,.;:!?)\]]/.test(text);
  return buf + (needsSpace ? " " : "") + text;
}

function wordsOf(text: string): string[] {
  return text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}

function makeDoc(doc: Omit<SearchDoc, "words">): SearchDoc {
  return {
    ...doc,
    words: {
      title: wordsOf(doc.title),
      tags: wordsOf(doc.tags.join(" ")),
      text: wordsOf(doc.paragraphs.join(" ")),
    },
  };
}

/** Text of an element, one entry per block-level element, in reading order. */
function paragraphsIn(root: Element): string[] {
  const out: string[] = [];
  let block: Element | null = null;
  let lastParent: Element | null = null;
  let buf = "";
  const flush = () => {
    const text = clean(buf);
    if (text && hasLetters(text) && !NOISE.test(text)) out.push(text);
    buf = "";
  };
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const b = node.parentElement?.closest(BLOCK) ?? null;
    if (b !== block) {
      flush();
      block = b;
    }
    buf = append(buf, node.textContent ?? "", node.parentElement !== lastParent);
    lastParent = node.parentElement;
  }
  flush();
  return out;
}

function extractDocs(html: string, page: SearchItem): SearchDoc[] {
  const dom = new DOMParser().parseFromString(html, "text/html");
  const root = dom.getElementById("page-content");
  if (!root) return [];
  root.querySelectorAll(STRIP).forEach((el) => el.remove());

  const pageTitle = clean(root.querySelector("h1")?.textContent ?? null) || page.title;
  const docs: SearchDoc[] = [];

  // Standalone items (blog posts, project cards) are results of their own.
  root.querySelectorAll<HTMLElement>("[data-search-item]").forEach((el) => {
    const title = el.dataset.searchTitle ?? "";
    const href = el.id ? `${page.href}#${el.id}` : page.href;
    el.querySelectorAll("time").forEach((t) => t.remove());
    docs.push(
      makeDoc({
        href,
        group: href,
        pageTitle,
        title,
        paragraphs: paragraphsIn(el).filter((p) => p !== title),
        tags: (el.dataset.searchTags ?? "").split(",").filter(Boolean),
        isPage: true,
      })
    );
    el.remove();
  });

  // Everything else is split into sections at h1–h3.
  const sections: { title: string; anchor: string; paragraphs: string[] }[] = [];
  let current = { title: pageTitle, anchor: "", paragraphs: [] as string[] };
  const used = new Set(Array.from(root.querySelectorAll("[id]"), (el) => el.id));
  let headingEl: Element | null = null;
  let block: Element | null = null;
  let lastParent: Element | null = null;
  let buf = "";
  const flush = () => {
    const text = clean(buf);
    if (text && hasLetters(text) && !NOISE.test(text)) current.paragraphs.push(text);
    buf = "";
  };

  const walker = dom.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!parent) continue;
    const heading = parent.closest("h1, h2, h3");
    if (heading) {
      if (heading !== headingEl) {
        flush();
        headingEl = heading;
        block = heading;
        if (heading.tagName === "H1") continue; // the page's own title
        sections.push(current);
        const title = clean(heading.textContent);
        let anchor = heading.id;
        // Headings without a server id get one from the table of contents
        // after load; derive the same slug. Headings it skips get none.
        if (!anchor && (heading as HTMLElement).dataset.tocSkip !== "true") {
          const base = slugify(title);
          anchor = base;
          for (let i = 2; used.has(anchor); i++) anchor = `${base}-${i}`;
          used.add(anchor);
        }
        current = { title, anchor, paragraphs: [] };
      }
      continue;
    }
    const b = parent.closest(BLOCK);
    if (b !== block) {
      flush();
      block = b;
    }
    buf = append(buf, node.textContent ?? "", parent !== lastParent);
    lastParent = parent;
  }
  flush();
  sections.push(current);

  // The page's tag line ("Java · Spring Boot · …") is shown as chips instead.
  const tagLine = (page.tags ?? []).join(" · ");
  if (tagLine) {
    sections[0].paragraphs = sections[0].paragraphs
      .map((p) => (p.endsWith(tagLine) ? p.slice(0, -tagLine.length).trim() : p))
      .filter(hasLetters);
  }

  sections.forEach((section, i) => {
    if (!section.paragraphs.length && !hasLetters(section.title)) return;
    const isPage = i === 0;
    docs.push(
      makeDoc({
        href: isPage || !section.anchor ? page.href : `${page.href}#${section.anchor}`,
        group: page.href,
        pageTitle,
        title: section.title,
        paragraphs: section.paragraphs,
        tags: isPage ? page.tags ?? [] : [],
        isPage,
      })
    );
  });

  return docs;
}

let indexPromise: Promise<SearchDoc[]> | null = null;

/** Builds the index once per page load; later calls reuse it. */
export function loadSearchIndex(pages: SearchItem[]): Promise<SearchDoc[]> {
  indexPromise ??= Promise.all(
    pages
      .filter((page, i) => pages.findIndex((p) => p.href === page.href) === i)
      .map(async (page) => {
        try {
          const res = await fetch(page.href);
          return res.ok ? extractDocs(await res.text(), page) : [];
        } catch {
          return [];
        }
      })
  ).then((perPage) => perPage.flat());
  return indexPromise;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Matches whole words that start with any query term ("k" → "Kojima's"). */
function highlighter(terms: string[]): RegExp | null {
  if (!terms.length) return null;
  const alternatives = terms.map(escapeRegExp).join("|");
  return new RegExp(`(?<![\\p{L}\\p{N}])(?:${alternatives})(?:[\\p{L}\\p{N}]|['’](?=\\p{L}))*`, "giu");
}

/** The same matcher search uses, for highlighting a query on the page a result opens. */
export function highlighterForQuery(query: string): RegExp | null {
  return highlighter([...new Set(wordsOf(query))]);
}

/** Adds the query as ?h= so the opened page can highlight it, like mkdocs-material. */
export function withHighlight(href: string, query: string): string {
  const [path, hash] = href.split("#");
  const url = `${path}${path.includes("?") ? "&" : "?"}h=${encodeURIComponent(query)}`;
  return hash ? `${url}#${hash}` : url;
}

// The query currently highlighted on the page (from ?h=). The header shows it
// in the search box and reopens search with it.
let activeHighlight = "";
const highlightListeners = new Set<() => void>();

export function setActiveHighlight(query: string) {
  if (query === activeHighlight) return;
  activeHighlight = query;
  highlightListeners.forEach((listener) => listener());
}

export function subscribeActiveHighlight(listener: () => void) {
  highlightListeners.add(listener);
  return () => {
    highlightListeners.delete(listener);
  };
}

export function getActiveHighlight() {
  return activeHighlight;
}

function countPrefix(words: string[], term: string): { hits: number; exact: boolean } {
  let hits = 0;
  let exact = false;
  for (const w of words) {
    if (w.startsWith(term)) {
      hits++;
      if (w === term) exact = true;
    }
  }
  return { hits, exact };
}

/** Every term must match a word prefix somewhere; titles and tags weigh most. */
function scoreDoc(doc: SearchDoc, terms: string[]): number {
  let total = 0;
  for (const term of terms) {
    const title = countPrefix(doc.words.title, term);
    const tags = countPrefix(doc.words.tags, term);
    const text = countPrefix(doc.words.text, term);
    if (!title.hits && !tags.hits && !text.hits) return 0;
    let score = title.hits * 10 + tags.hits * 6 + Math.min(text.hits, 8);
    if (title.exact || tags.exact || text.exact) score *= 1.5;
    total += score;
  }
  return total + (doc.isPage ? 1 : 0);
}

export function searchDocs(docs: SearchDoc[], query: string): SearchResult {
  const terms = [...new Set(wordsOf(query))];
  if (!terms.length) return { groups: [], total: 0, highlight: null };

  const byGroup = new Map<string, SearchHit[]>();
  let total = 0;
  for (const doc of docs) {
    const score = scoreDoc(doc, terms);
    if (!score) continue;
    total++;
    const hits = byGroup.get(doc.group) ?? [];
    hits.push({ doc, score });
    byGroup.set(doc.group, hits);
  }

  const groups = [...byGroup.entries()].map(([key, hits]) => {
    // A page's own top section leads its group when it matches, as in mkdocs.
    hits.sort((a, b) => Number(b.doc.isPage) - Number(a.doc.isPage) || b.score - a.score);
    return { key, hits, score: Math.max(...hits.map((h) => h.score)) };
  });
  groups.sort((a, b) => b.score - a.score);

  return { groups, total, highlight: highlighter(terms) };
}

/** Up to `max` paragraphs that contain a match (or the first one), clipped around it. */
export function snippetsFor(doc: SearchDoc, highlight: RegExp | null, max = 2, length = 420): string[] {
  const probe = highlight ? new RegExp(highlight.source, "iu") : null;
  const matching = probe ? doc.paragraphs.filter((p) => probe.test(p)) : [];
  const chosen = (matching.length ? matching : doc.paragraphs).slice(0, max);
  return chosen.map((text) => {
    if (text.length <= length) return text;
    const at = probe ? Math.max(0, text.search(probe)) : 0;
    const start = at > 120 ? text.lastIndexOf(" ", at - 60) + 1 : 0;
    let slice = text.slice(start, start + length);
    const cut = slice.lastIndexOf(" ");
    if (start + length < text.length && cut > length * 0.6) slice = slice.slice(0, cut);
    return `${start > 0 ? "… " : ""}${slice}${start + slice.length < text.length ? " …" : ""}`;
  });
}
