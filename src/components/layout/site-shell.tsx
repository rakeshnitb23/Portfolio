import { SiteNav } from "@/components/layout/site-nav";
import { TableOfContents } from "@/components/layout/table-of-contents";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[78.25rem] px-4 pt-6 lg:grid lg:grid-cols-[15.125rem_minmax(0,1fr)_15.125rem] lg:gap-x-[1.5rem]">
      <aside className="hidden lg:block">
        <div className="sticky top-[6.5rem]">
          <SiteNav />
        </div>
      </aside>

      <div id="page-content" className="min-w-0">
        {children}
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-[6.5rem]">
          <TableOfContents />
        </div>
      </aside>
    </div>
  );
}
