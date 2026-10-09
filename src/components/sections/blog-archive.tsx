"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/site-search";
import type { BlogPost } from "@/data/blogs";

type Filter =
  | { kind: "all" }
  | { kind: "category"; value: string }
  | { kind: "tag"; value: string };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Dates are split by hand rather than passed to `new Date`, which parses
// YYYY-MM-DD as UTC and can shift the day back in western timezones.
function splitDate(date: string) {
  const [year, month, day] = date.split("-");
  return { year, month: MONTHS[Number(month) - 1], day };
}

function matches(post: BlogPost, filter: Filter): boolean {
  if (filter.kind === "category") return post.category === filter.value;
  if (filter.kind === "tag") return post.tags.includes(filter.value);
  return true;
}

function FilterPill({
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

// Titles are plain text; readers follow a post's "Read on …" links instead.
function PostTitle({ post }: { post: BlogPost }) {
  return <span className="font-medium text-foreground">{post.title}</span>;
}

export function BlogArchive({ posts }: { posts: BlogPost[] }) {
  const [filter, setFilter] = React.useState<Filter>({ kind: "all" });

  // Newest first; posts sharing a date keep their order from the data file.
  const sorted = React.useMemo(
    () => [...posts].sort((a, b) => b.date.localeCompare(a.date)),
    [posts]
  );

  // Category pills, most-used first.
  const categories = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of sorted) {
      counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [sorted]);

  const years = React.useMemo(() => {
    const groups: { year: string; posts: BlogPost[] }[] = [];
    for (const post of sorted) {
      if (!matches(post, filter)) continue;
      const { year } = splitDate(post.date);
      const last = groups[groups.length - 1];
      if (last?.year === year) last.posts.push(post);
      else groups.push({ year, posts: [post] });
    }
    return groups;
  }, [sorted, filter]);

  return (
    <div>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2 mb-10">
        <FilterPill
          label="All"
          count={sorted.length}
          active={filter.kind === "all"}
          onClick={() => setFilter({ kind: "all" })}
        />
        {categories.map(([category, count]) => (
          <FilterPill
            key={category}
            label={category}
            count={count}
            active={filter.kind === "category" && filter.value === category}
            onClick={() => setFilter({ kind: "category", value: category })}
          />
        ))}
      </div>

      {filter.kind === "tag" && (
        <p className="-mt-6 mb-8 text-sm text-foreground/65">
          Showing posts tagged{" "}
          <span className="font-mono text-primary">#{filter.value}</span> ·{" "}
          <button
            type="button"
            onClick={() => setFilter({ kind: "all" })}
            className="text-primary hover:underline"
          >
            Clear
          </button>
        </p>
      )}

      {years.map(({ year, posts: yearPosts }) => (
        <section key={year} className="mb-10">
          <div className="flex items-baseline gap-2 border-b border-border pb-2 mb-4">
            <h2 id={`year-${year}`} className="font-mono text-[1.25em] font-bold text-foreground">
              {year}
            </h2>
            <span className="font-mono text-xs text-muted-foreground">({yearPosts.length})</span>
          </div>

          <ul className="space-y-4">
            {yearPosts.map((post) => {
              const { month, day } = splitDate(post.date);
              // A guide can share its title with the essay edition, so it gets its own anchor.
              const anchor = `post-${slugify(post.title)}${post.kind === "guide" ? "-guide" : ""}`;
              return (
                <li
                  key={anchor}
                  id={anchor}
                  className="flex gap-4 sm:gap-6"
                  // Site search: each real post is its own result; placeholders are skipped.
                  {...(post.href
                    ? {
                        "data-search-item": "",
                        "data-search-title": post.title,
                        "data-search-tags": [post.category, ...post.tags].join(","),
                      }
                    : { "data-search-ignore": "" })}
                >
                  <time
                    dateTime={post.date}
                    title={`${month} ${day}, ${year}`}
                    className="w-14 shrink-0 pt-px font-mono text-sm text-muted-foreground"
                  >
                    {month} {day}
                  </time>
                  <div className="min-w-0">
                    <PostTitle post={post} />
                    {post.summary && (
                      <p className="mt-1 text-sm leading-relaxed text-foreground/65">
                        {post.kind === "guide" && (
                          <span className="mr-1.5 font-mono text-[0.7rem] font-bold uppercase tracking-wider text-primary">
                            TL;DR
                          </span>
                        )}
                        {post.summary}
                      </p>
                    )}
                    {/* Build guides: the guide's steps as a numbered outline. */}
                    {post.steps && post.steps.length > 0 && (
                      <ol
                        className={cn(
                          "mt-2 grid gap-x-6 gap-y-0.5 border-l-2 border-primary/30 pl-3 text-sm text-foreground/75",
                          post.steps.length > 4 && "sm:grid-cols-2"
                        )}
                      >
                        {post.steps.map((step, i) => (
                          <li key={step} className="flex gap-2 leading-6">
                            <span className="font-mono text-xs leading-6 text-primary">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                    {post.sources && post.sources.length > 0 && (
                      <p
                        data-search-ignore
                        className="ui-font mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
                      >
                        {/* Each separator stays with the link before it, so a wrapped line never starts with "·". */}
                        {post.sources.map((source, i, all) => (
                          <span key={source.name} className="inline-flex items-center gap-2">
                            <a
                              href={source.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
                            >
                              Read on {source.name}
                              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                            {i < all.length - 1 && (
                              <span aria-hidden="true" className="text-muted-foreground">
                                ·
                              </span>
                            )}
                          </span>
                        ))}
                      </p>
                    )}
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setFilter({ kind: "category", value: post.category })}
                        className="rounded-sm bg-primary/10 px-1.5 py-0.5 font-medium text-primary hover:bg-primary/15"
                      >
                        {post.category}
                      </button>
                      {post.tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setFilter({ kind: "tag", value: tag })}
                          className="font-mono text-muted-foreground hover:text-primary"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
