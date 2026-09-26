import Link from "next/link";
import type { Metadata } from "next";
import { getAllWritingPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Notes on retrieval, reliability, and backend systems from Rakesh Singh — citations, abstention, uptime, and idempotency.",
  alternates: { canonical: "/writing" },
};

export default function WritingPage() {
  const posts = getAllWritingPosts();

  return (
    <div className="container-constrained max-w-[860px] py-20 md:py-28">
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
        Writing
      </h1>
      <p className="text-foreground/65 max-w-[60ch] leading-relaxed mb-16">
        Short notes on the engineering decisions behind the projects — mostly
        retrieval, reliability, and the discipline it takes to keep a backend
        honest under scale.
      </p>

      <div className="flex flex-col divide-y divide-border">
        {posts.map((post) => (
          <article key={post.slug} className="py-8 first:pt-0">
            <Link href={`/writing/${post.slug}`} className="group flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-serif text-2xl font-semibold text-foreground group-hover:text-accent transition-colors">
                  {post.frontmatter.title}
                </h2>
                <time
                  dateTime={post.frontmatter.date}
                  className="font-mono text-xs text-muted-foreground shrink-0"
                >
                  {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </time>
              </div>
              <p className="text-foreground/65 leading-relaxed max-w-[64ch]">
                {post.frontmatter.summary}
              </p>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-1">
                {post.frontmatter.tags.join(" · ")}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
