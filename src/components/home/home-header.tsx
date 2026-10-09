import Link from "next/link";
import { HomeNav } from "@/components/home/home-nav";
import { home } from "@/data/home";
import type { SearchItem } from "@/lib/search-index";
import { cn } from "@/lib/utils";

const container = "mx-auto w-full max-w-[800px] px-6 phone:px-4";
// The GitHub link reuses the socials entry, so the URL lives in one place.
const githubUrl = home.socials.find((social) => social.type === "github")!.href;

/**
 * The site's menu bar: the same on the homepage and on every inner page.
 * It carries its own look (the .home-page tokens, Lora, the homepage's text
 * size and corner radius) so it renders identically wherever it is placed —
 * inner pages set a rounder --radius that would otherwise reach its buttons.
 * `children` render at the end of the bar (the inner pages' phone menu button).
 */
export function HomeHeader({
  searchIndex,
  nameAs: Name = "h1",
  children,
}: {
  searchIndex: SearchItem[];
  /** "h1" on the homepage; "p" on inner pages, which have their own h1. */
  nameAs?: "h1" | "p";
  children?: React.ReactNode;
}) {
  return (
    <header
      className={cn(
        "home-page relative bg-[var(--bg)] font-[family-name:var(--font-lora),Georgia,serif] text-[18px] leading-[1.65] text-[var(--text)] [--radius:0.25rem] phone:text-[17px]",
        "border-t-[3px] border-b border-t-[var(--topbar)] border-b-[var(--border)]"
      )}
    >
      <div className={cn(container, "flex h-16 items-center gap-6 phone:h-auto phone:flex-wrap")}>
        <Name className="text-[26px] font-medium leading-none phone:flex phone:h-16 phone:items-center">
          <Link href="/" className="text-[var(--text)] no-underline">
            {home.name}
          </Link>
        </Name>
        <HomeNav githubUrl={githubUrl} searchIndex={searchIndex} />
        {children}
      </div>
    </header>
  );
}
