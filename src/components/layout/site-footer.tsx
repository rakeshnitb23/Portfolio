"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { NAV_LINKS } from "@/lib/nav";
import { PERSON } from "@/lib/site";

const SOCIAL_LINKS = [
  { Icon: FaGithub, href: PERSON.github, label: "GitHub" },
  { Icon: FaLinkedin, href: PERSON.linkedin, label: "LinkedIn" },
  { Icon: FaEnvelope, href: `mailto:${PERSON.email}`, label: "Email" },
];

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

      <div className="bg-[var(--md-footer-bg)] text-white/80">
        <div className="mx-auto flex w-full max-w-[61rem] flex-wrap items-center justify-between gap-4 px-4 py-5">
          <p className="text-xs">
            <span className="text-white">
              Copyright &copy; {new Date().getFullYear()} {PERSON.name}
            </span>
            <br />
            Built with Next.js
          </p>
          <div className="flex items-center gap-5">
            {SOCIAL_LINKS.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                className="text-white/70 hover:text-white"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
