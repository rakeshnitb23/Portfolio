import { TableOfContents } from "@/components/layout/table-of-contents";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[96rem] px-4 pt-6 sm:px-6 lg:grid lg:grid-cols-[15.125rem_minmax(0,1fr)_15.125rem] lg:gap-x-12 lg:px-8 xl:px-12">
      {/* Empty left column (the left menu was removed) keeps the page content centred at its usual width. */}
      <div aria-hidden="true" className="hidden lg:block" />

      <div id="page-content" className="min-w-0">
        {children}
      </div>

      <aside className="hidden lg:block">
        {/* The menu bar scrolls away, so the contents list sticks near the top of the window. */}
        <div className="sticky top-8">
          <TableOfContents />
        </div>
      </aside>
    </div>
  );
}
