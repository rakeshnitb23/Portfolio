import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPersonalPosts, getPersonalPost, getPersonalSlugs } from "@/lib/content";
import { MdxContent } from "@/components/mdx-content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getPersonalSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!getPersonalSlugs().includes(slug)) return {};
  const { frontmatter } = getPersonalPost(slug);
  return {
    title: frontmatter.title,
    description: frontmatter.summary,
    alternates: { canonical: `/writing/personal/${slug}` },
    // Placeholders aren't real posts yet, so keep them out of search engines.
    ...(frontmatter.placeholder ? { robots: { index: false } } : {}),
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.summary,
      type: "article",
      url: absoluteUrl(`/writing/personal/${slug}`),
    },
  };
}

function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function PersonalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getPersonalSlugs().includes(slug)) notFound();

  const { frontmatter, body } = getPersonalPost(slug);
  const otherPosts = getAllPersonalPosts().filter((p) => p.slug !== slug);

  return (
    <article className="max-w-none py-10">
      <nav aria-label="Breadcrumb" className="mb-8 font-mono text-xs text-muted-foreground">
        <Link href="/writing" className="hover:text-primary underline underline-offset-4">
          Writing
        </Link>
        <span className="mx-2">/</span>
        <Link
          href="/writing#personal-writing"
          className="hover:text-primary underline underline-offset-4"
        >
          Personal writing
        </Link>
        <span className="mx-2">/</span>
        <span>{frontmatter.title}</span>
      </nav>

      <header className="mb-10">
        <p className="mb-3 font-mono text-xs uppercase tracking-wider text-primary">
          Personal writing
        </p>
        <h1 className="text-[2em] font-normal leading-[1.3] text-foreground/70 mb-4">
          {frontmatter.title}
        </h1>
        <p className="text-lg text-foreground/70 leading-relaxed mb-4">{frontmatter.summary}</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
          {frontmatter.placeholder || !frontmatter.date ? (
            <span>Placeholder · not written yet</span>
          ) : (
            <>
              <time dateTime={frontmatter.date}>{formatDate(frontmatter.date)}</time>
              <span>·</span>
              <span>{readingTime(body)} min read</span>
            </>
          )}
        </div>
      </header>

      <MdxContent source={body} />

      <footer className="mt-16 pt-8 border-t border-border">
        {otherPosts.length > 0 && (
          <>
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
              More personal writing
            </p>
            {otherPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/writing/personal/${p.slug}`}
                className="block text-lg text-foreground hover:text-primary transition-colors"
              >
                {p.frontmatter.title} →
              </Link>
            ))}
          </>
        )}
        <Link
          href="/writing#personal-writing"
          className="mt-6 inline-block font-mono text-sm text-primary hover:underline"
        >
          ← Back to Writing
        </Link>
      </footer>
    </article>
  );
}
