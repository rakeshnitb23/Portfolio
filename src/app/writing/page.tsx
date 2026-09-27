import Link from "next/link";
import type { Metadata } from "next";
import { getAllWritingPosts, type ContentEntry, type WritingFrontmatter } from "@/lib/content";
import { PERSON } from "@/lib/site";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on retrieval, reliability, and backend systems from Rakesh Singh — citations, abstention, uptime, and idempotency.",
  alternates: { canonical: "/writing" },
};

type Post = ContentEntry<WritingFrontmatter>;

interface Category {
  id: string;
  title: string;
  description?: string;
  match: (post: Post) => boolean;
}

// Fixed category index, matching the reference site's structure. Categories
// with no matching post yet are shown empty rather than filled with
// unrelated or fabricated articles.
const CATEGORIES: Category[] = [
  {
    id: "personal",
    title: "Personal",
    match: () => false,
  },
  {
    id: "rag-and-retrieval-systems",
    title: "RAG and Retrieval Systems",
    description:
      "Notes on keeping retrieval-augmented systems honest — what they cite, and when they should say nothing at all.",
    match: (post) =>
      post.frontmatter.tags.includes("Retrieval") ||
      post.frontmatter.tags.includes("Citations"),
  },
  {
    id: "context-engineering",
    title: "Context Engineering",
    match: () => false,
  },
  {
    id: "coding-agents",
    title: "Coding Agents",
    match: () => false,
  },
  {
    id: "ai-engineering-and-process",
    title: "AI Engineering and Process",
    description:
      "Backend guarantees that hold up under scale — idempotency, uptime, and the discipline behind both.",
    match: (post) =>
      post.frontmatter.tags.includes("Systems") ||
      post.frontmatter.tags.includes("Operations"),
  },
  {
    id: "business-and-product",
    title: "Business and Product",
    match: () => false,
  },
];

function categoryFor(post: Post): Category | undefined {
  return CATEGORIES.find((c) => c.match(post));
}

function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function formatFeedDate(date: string): string {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

const buttonBase =
  "inline-flex items-center rounded-sm border px-4 py-1 text-sm font-medium transition-colors";
const buttonOutline = `${buttonBase} border-primary text-primary hover:bg-primary hover:text-primary-foreground`;
const buttonFilled = `${buttonBase} border-primary bg-primary text-primary-foreground hover:opacity-90`;

export default function WritingPage() {
  const posts = getAllWritingPosts();

  return (
    <div className="max-w-none py-10">
      <h1 id="writing" className="text-[2em] font-normal leading-[1.3] text-foreground/70 mb-4">
        Writing
      </h1>

      <div className="flex flex-wrap items-center gap-3 mb-10">
        <a href="#feed" className={buttonOutline}>
          Popular posts
        </a>
        <a href={`mailto:${PERSON.email}?subject=Subscribe`} className={buttonFilled}>
          Subscribe to my newsletter
        </a>
        <a
          href={PERSON.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonOutline}
        >
          Follow me on LinkedIn
        </a>
      </div>

      {/* Category index */}
      {CATEGORIES.map((category) => {
        const categoryPosts = posts.filter(category.match);
        return (
          <section key={category.id} className="mb-8">
            <h2
              id={category.id}
              className="text-[1.5625em] font-light tracking-[-0.01em] text-foreground mb-2"
            >
              {category.title}
            </h2>
            {category.description && (
              <p className="text-foreground/65 leading-relaxed mb-3">
                {category.description}
              </p>
            )}
            {categoryPosts.length > 0 ? (
              <ul className="list-disc ml-5 space-y-1.5 text-foreground/80 leading-relaxed">
                {categoryPosts.map((post) => (
                  <li key={post.slug}>
                    <a href={`#${post.slug}`} className="text-primary hover:underline">
                      {post.frontmatter.title}
                    </a>{" "}
                    — {post.frontmatter.summary}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground/50 italic">Coming soon.</p>
            )}
          </section>
        );
      })}

      <hr className="border-border my-10" />

      {/* Chronological article feed */}
      <section id="feed" aria-label="All posts, chronological">
        <div className="flex flex-col divide-y divide-border">
          {posts.map((post) => {
            const category = categoryFor(post);
            return (
              <article key={post.slug} className="py-8 first:pt-0">
                <header className="flex items-center gap-3 mb-3">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
                  >
                    {initials(PERSON.name)}
                  </span>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    <time dateTime={post.frontmatter.date}>
                      {formatFeedDate(post.frontmatter.date)}
                    </time>
                    {category && (
                      <>
                        <span>·</span>
                        <span>
                          in{" "}
                          <a href={`#${category.id}`} className="text-primary normal-case hover:underline">
                            {category.title}
                          </a>
                        </span>
                      </>
                    )}
                    <span>·</span>
                    <span>{readingTime(post.body)} min read</span>
                  </div>
                </header>

                <h2
                  id={post.slug}
                  className="text-[1.25em] font-normal tracking-[-0.01em] text-foreground mb-2"
                >
                  <Link href={`/writing/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.frontmatter.title}
                  </Link>
                </h2>
                <p className="text-foreground/65 leading-relaxed mb-3">
                  {post.frontmatter.summary}
                </p>
                <Link
                  href={`/writing/${post.slug}`}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Continue reading →
                </Link>
              </article>
            );
          })}
        </div>

        <nav aria-label="Pagination" className="mt-10 flex items-center gap-2 font-mono text-sm">
          <span className="flex h-7 w-7 items-center justify-center rounded-sm border border-primary bg-primary text-primary-foreground">
            1
          </span>
        </nav>
      </section>
    </div>
  );
}
