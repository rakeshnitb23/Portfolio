import { SiteNav } from "@/components/layout/site-nav";
import { TableOfContents } from "@/components/layout/table-of-contents";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[61rem] px-4 pt-6 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)_13rem] lg:gap-10">
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
