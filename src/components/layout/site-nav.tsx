"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SIDEBAR_LINKS, isNavLinkActive } from "@/lib/nav";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigation" className="text-sm">
      <ul className="space-y-1">
        {SIDEBAR_LINKS.map((link) => {
          const active = isNavLinkActive(pathname, link.href);
          const isSection = link.href === "/";
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "block py-1 pl-3 transition-colors",
                  isSection ? "font-bold" : "font-normal",
                  active
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground"
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
