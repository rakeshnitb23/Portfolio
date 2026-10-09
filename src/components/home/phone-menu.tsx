"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, isNavLinkActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

const sans = "font-[family-name:var(--font-inter),system-ui,sans-serif]";

/**
 * Phones only, on inner pages: a ☰ button at the end of the menu bar that
 * opens the full list of pages, so pages that aren't in the bar (User Manual,
 * Books, Resume) stay reachable on small screens.
 */
export function PhoneMenu() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [openedOn, setOpenedOn] = React.useState(pathname);
  // Close the list after navigating (React's "adjust state when a prop changes" pattern).
  if (openedOn !== pathname) {
    setOpenedOn(pathname);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="phone-menu"
        onClick={() => setOpen((v) => !v)}
        // -ml-3 sits it closer to Search than the bar's gap, like a pair.
        className={cn(
          sans,
          "-ml-3 hidden h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition-colors hover:border-[#BDBDBD] hover:text-[var(--text)] phone:inline-flex"
        )}
      >
        {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
      </button>

      {open && (
        <nav
          id="phone-menu"
          aria-label="Pages"
          className={cn(
            sans,
            "absolute inset-x-0 top-full z-40 hidden border-b border-[var(--border)] bg-[var(--surface)] shadow-md phone:block"
          )}
        >
          <ul className="px-4 py-2">
            {NAV_LINKS.map((link) => {
              const active = isNavLinkActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "block py-2.5 text-[15px] font-medium text-[var(--text)] hover:underline",
                      active && "underline decoration-2 underline-offset-4"
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
    </>
  );
}
