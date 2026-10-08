import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteShell } from "@/components/layout/site-shell";
import { SiteFooter } from "@/components/layout/site-footer";
import { SearchHighlighter } from "@/components/layout/search-highlighter";
import { buildSearchIndex } from "@/lib/search-index";

// Docs-style chrome (header with search, sidebar, table of contents, footer)
// for every page except the homepage.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const searchIndex = buildSearchIndex();

  return (
    <>
      <SiteHeader searchIndex={searchIndex} />
      <main className="flex-1">
        <SiteShell>{children}</SiteShell>
      </main>
      <SiteFooter />
      {/* Reads ?h= from the URL, so it renders client-side only. */}
      <Suspense fallback={null}>
        <SearchHighlighter />
      </Suspense>
    </>
  );
}
