"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS, isNavLinkActive } from "@/lib/nav";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigation" className="text-sm">
      <ul className="space-y-1">
        {NAV_LINKS.map((link) => {
          const active = isNavLinkActive(pathname, link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "block border-l-2 py-1 pl-3 transition-colors",
                  active
                    ? "border-primary font-medium text-primary"
                    : "border-transparent text-foreground/70 hover:text-foreground"
                )}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
