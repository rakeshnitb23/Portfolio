"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FaRss } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/nav";
import { PERSON } from "@/lib/site";
import {
  FOOTER_COLUMNS,
  FOOTER_NOTE,
  FOOTER_TAGLINE,
  SOCIAL_LINKS,
  type FooterLink,
} from "@/data/footer";

const isExternal = (href: string) => /^https?:\/\//.test(href);

const PLACEHOLDER_TITLE = "Coming soon";

function FooterItem({ link }: { link: FooterLink }) {
  const external = link.href !== undefined && isExternal(link.href);
  const className = cn(
    "inline-flex items-center gap-1.5 transition-colors",
    link.variant === "cta" && "font-bold text-primary",
    link.variant === "rss" && "font-bold text-orange-500",
    !link.variant && "text-foreground/80",
    link.href ? (link.variant ? "hover:opacity-80" : "hover:text-primary") : "cursor-default opacity-50"
  );

  const content = (
    <>
      {link.variant === "rss" && <FaRss className="h-3 w-3" aria-hidden="true" />}
      <span>{link.label}</span>
      {link.hint && (
        <span className="font-mono text-[0.7rem] text-muted-foreground">{link.hint}</span>
      )}
      {external && <ArrowUpRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />}
    </>
  );

  if (!link.href) {
    return (
      <span title={PLACEHOLDER_TITLE} className={className}>
        {content}
      </span>
    );
  }

  if (external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      {content}
    </Link>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  const currentIndex = NAV_LINKS.findIndex((link) => link.href === pathname);
  const next = currentIndex >= 0 ? NAV_LINKS[currentIndex + 1] : undefined;

  return (
    <footer className="mt-16">
      {next && (
        <div className="border-t border-border">
          <div className="mx-auto flex w-full max-w-[61rem] justify-end px-4 py-4">
            <Link
              href={next.href}
              className="group flex flex-col items-end gap-0.5 text-right"
            >
              <span className="text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                Next
              </span>
              <span className="flex items-center gap-2 font-medium text-foreground group-hover:text-primary">
                {next.name}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      )}

      <div className="border-t border-border bg-muted/60">
        <div className="mx-auto w-full max-w-[61rem] px-4 pt-12 pb-8">
          {/* Navigation columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h4 className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  {column.title}
                </h4>
                <ul className="space-y-2.5 text-sm">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <FooterItem link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Small print */}
          <div className="mt-12 border-t border-border pt-6">
            <p className="text-xs leading-relaxed text-muted-foreground">{FOOTER_NOTE}</p>
          </div>

          {/* Copyright and social handles */}
          <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} {PERSON.name}. {FOOTER_TAGLINE}
            </p>
            <div className="flex flex-wrap gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => {
                const className =
                  "inline-flex items-center gap-1.5 rounded-[0.25rem] border border-foreground/25 bg-background px-3 py-1.5 text-xs font-semibold text-foreground/80";
                const content = (
                  <>
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    {label}
                  </>
                );

                if (!href) {
                  return (
                    <span
                      key={label}
                      title={PLACEHOLDER_TITLE}
                      className={cn(className, "cursor-default opacity-50")}
                    >
                      {content}
                    </span>
                  );
                }

                return (
                  <a
                    key={label}
                    href={href}
                    target={isExternal(href) ? "_blank" : undefined}
                    rel={isExternal(href) ? "noopener noreferrer" : undefined}
                    className={cn(className, "transition-colors hover:border-primary hover:text-primary")}
                  >
                    {content}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
