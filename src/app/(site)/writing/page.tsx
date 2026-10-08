import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getAllPersonalPosts } from "@/lib/content";
import { PERSON } from "@/lib/site";
import { NewsletterCard, NewsletterSubscribe } from "@/components/sections/newsletter-subscribe";
import { BLOGS } from "@/data/blogs";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on retrieval, reliability, and backend systems from Rakesh Singh — citations, abstention, uptime, and idempotency.",
  alternates: { canonical: "/writing" },
};

const SELECTED_NOTES = [
  {
    title: "My RAG API Never Signs Tokens or Sees Passwords",
    summary: "auth on a RAG API, and the two attackers most designs forget.",
  },
  {
    title: "Multi-Tenant RAG Leaks Through the Search, Not the Login",
    summary: "four checkpoints that keep an answer inside the asker’s own documents.",
  },
  {
    title: "When a Redis Cache Hit Is the Wrong Answer",
    summary: "three caches in front of an agent, and the cases where a saved answer must not be returned.",
  },
  {
    title: "Rate Limit an LLM Agent by Tokens, Not Requests",
    summary: "what to count, when to count it, and what an agent loop changes.",
  },
];

/** A note's "Read on …" links, taken from the same post on the Blogs page so both stay in sync. */
function sourcesFor(title: string) {
  return BLOGS.find((post) => post.title === title && post.kind !== "guide")?.sources ?? [];
}

function TechnicalBlogs() {
  return (
    <>
      <p className="font-medium text-foreground mb-2">Technical popular blogs</p>
      <ul className="list-disc ml-5 space-y-1.5 text-foreground/80 leading-relaxed">
        {SELECTED_NOTES.map((note) => {
          const sources = sourcesFor(note.title);
          return (
            <li key={note.title}>
              <span className="font-medium text-foreground">{note.title}</span> — {note.summary}
              {sources.length > 0 && (
                <div
                  data-search-ignore
                  className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
                >
                  {sources.map((source, i) => (
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
                      {i < sources.length - 1 && (
                        <span aria-hidden="true" className="text-muted-foreground">
                          ·
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
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

const buttonBase =
  "inline-flex items-center rounded-sm border px-4 py-1 text-sm font-medium transition-colors";
const buttonOutline = `${buttonBase} border-primary text-primary hover:bg-primary hover:text-primary-foreground`;
const buttonFilled = `${buttonBase} border-primary bg-primary text-primary-foreground hover:opacity-90`;

export default function WritingPage() {
  const personalPosts = getAllPersonalPosts();

  return (
    <div className="max-w-none py-10">
      <h1 id="writing" className="text-[2em] font-normal leading-[1.3] text-foreground/70 mb-4">
        Writing
      </h1>

      <div className="flex flex-wrap items-center gap-3 mb-10">
        <a href="#technical-popular-blogs" className={buttonOutline}>
          Popular posts
        </a>
        <NewsletterSubscribe className={buttonFilled} />
        <a
          href={PERSON.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonOutline}
        >
          Follow me on LinkedIn
        </a>
      </div>

      {/* scroll-mt clears the sticky header when jumping here from "Popular posts". */}
      <section id="technical-popular-blogs" className="mb-8 scroll-mt-28">
        <TechnicalBlogs />
        <NewsletterCard />
      </section>

      {/* Personal writing: each entry opens its own page at /writing/personal/<slug>.
          Posts live in content/personal/*.mdx; "placeholder: true" marks one not yet written. */}
      <section aria-labelledby="personal-writing" className="mt-12">
        <h2
          id="personal-writing"
          className="scroll-mt-28 text-[1.5625em] font-light tracking-[-0.01em] text-foreground mb-4"
        >
          Personal writing
        </h2>
        <div className="flex flex-col divide-y divide-border">
          {personalPosts.map((post) => {
            const { title, summary, date, placeholder } = post.frontmatter;
            return (
              <Link
                key={post.slug}
                href={`/writing/personal/${post.slug}`}
                className="group block py-6 first:pt-2"
              >
                <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {placeholder || !date ? (
                    "Placeholder"
                  ) : (
                    <>
                      <time dateTime={date}>{formatFeedDate(date)}</time> · {readingTime(post.body)}{" "}
                      min read
                    </>
                  )}
                </p>
                <h3
                  data-toc-skip="true"
                  className="text-[1.25em] font-normal tracking-[-0.01em] text-foreground mb-2 transition-colors group-hover:text-primary"
                >
                  {title}
                </h3>
                <p className="text-foreground/65 leading-relaxed mb-3">{summary}</p>
                <span className="text-primary text-sm font-medium group-hover:underline">
                  Continue reading →
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
