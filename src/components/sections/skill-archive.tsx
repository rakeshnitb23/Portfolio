"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/site-search";

export interface SkillPost {
  slug: string;
  title: string;
  summary: string;
  date?: string;
  placeholder?: boolean;
  skill?: string;
  minutes: number;
}

function formatFeedDate(date: string): string {
  return date.replaceAll("-", "/");
}

// Same look as the category pills on /blogs.
function SkillPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-sm border px-3 py-1 text-sm transition-colors",
        active
          ? "border-[var(--md-primary)] bg-[var(--md-primary)] text-[var(--md-primary-fg)]"
          : "border-border text-foreground/80 hover:border-primary hover:text-primary"
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "font-mono text-xs",
          active ? "text-primary-foreground/80" : "text-muted-foreground"
        )}
      >
        {count}
      </span>
    </button>
  );
}

export function SkillArchive({ posts }: { posts: SkillPost[] }) {
  // null shows every post. The page is prerendered with all posts listed; a
  // ?skill=<slug> link applies its filter once the page loads.
  const [skill, setSkill] = React.useState<string | null>(null);

  // Skill pills in the order the skills first appear.
  const skills = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      if (post.skill) counts.set(post.skill, (counts.get(post.skill) ?? 0) + 1);
    }
    return [...counts.entries()];
  }, [posts]);

  React.useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("skill");
    const match = skills.find(([name]) => slugify(name) === wanted);
    if (match) setSkill(match[0]);
  }, [skills]);

  function choose(next: string | null) {
    setSkill(next);
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("skill", slugify(next));
    else url.searchParams.delete("skill");
    window.history.replaceState(null, "", url);
  }

  const visible = skill ? posts.filter((post) => post.skill === skill) : posts;

  return (
    <div>
      <div role="group" aria-label="Filter by skill" className="flex flex-wrap gap-2 mb-10">
        <SkillPill
          label="All"
          count={posts.length}
          active={skill === null}
          onClick={() => choose(null)}
        />
        {skills.map(([name, count]) => (
          <SkillPill
            key={name}
            label={name}
            count={count}
            active={skill === name}
            onClick={() => choose(name)}
          />
        ))}
      </div>

      <div className="flex flex-col divide-y divide-border">
        {visible.map((post) => (
          <Link
            key={post.slug}
            href={`/personal-writing/${post.slug}`}
            className="group block py-6 first:pt-2"
          >
            <p className="mb-2 flex flex-wrap items-center justify-between gap-x-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <span>
                {post.placeholder || !post.date ? (
                  "Placeholder"
                ) : (
                  <>
                    <time dateTime={post.date}>{formatFeedDate(post.date)}</time> ·{" "}
                    {post.minutes} min read
                  </>
                )}
              </span>
              {post.skill && <span className="text-primary">{post.skill}</span>}
            </p>
            <h2
              data-toc-skip="true"
              className="text-[1.25em] font-normal tracking-[-0.01em] text-foreground mb-2 transition-colors group-hover:text-primary"
            >
              {post.title}
            </h2>
            <p className="text-foreground/65 leading-relaxed mb-3">{post.summary}</p>
            <span className="ui-font text-primary text-sm font-medium group-hover:underline">
              Continue reading →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
