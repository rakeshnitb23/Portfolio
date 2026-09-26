import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllWritingPosts, getWritingPost, getWritingSlugs } from "@/lib/content";
import { MdxContent } from "@/components/mdx-content";
import { JsonLd, breadcrumbList } from "@/components/json-ld";
import { absoluteUrl, personId } from "@/lib/site";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getWritingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugs = getWritingSlugs();
  if (!slugs.includes(slug)) return {};
  const { frontmatter } = getWritingPost(slug);
  return {
    title: frontmatter.title,
    description: frontmatter.summary,
    alternates: { canonical: `/writing/${slug}` },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.summary,
      type: "article",
      url: absoluteUrl(`/writing/${slug}`),
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.summary,
    },
  };
}

export default async function WritingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getWritingSlugs();
  if (!slugs.includes(slug)) notFound();

  const { frontmatter, body } = getWritingPost(slug);
  const url = absoluteUrl(`/writing/${slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: frontmatter.title,
    description: frontmatter.summary,
    url,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    keywords: frontmatter.tags.join(", "),
    author: { "@id": personId() },
  };

  const otherPosts = getAllWritingPosts().filter((p) => p.slug !== slug);

  return (
    <article className="container-constrained max-w-[720px] py-20 md:py-28">
      <JsonLd data={jsonLd} />
      <JsonLd
        data={breadcrumbList([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Writing", url: absoluteUrl("/writing") },
          { name: frontmatter.title, url },
        ])}
      />

      <nav aria-label="Breadcrumb" className="mb-8 font-mono text-xs text-muted-foreground">
        <Link href="/writing" className="hover:text-accent underline underline-offset-4">
          Writing
        </Link>
        <span className="mx-2">/</span>
        <span>{frontmatter.title}</span>
      </nav>

      <header className="mb-10">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
          {frontmatter.title}
        </h1>
        <p className="text-lg text-foreground/70 leading-relaxed max-w-[60ch] mb-4">
          {frontmatter.summary}
        </p>
        <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-muted-foreground">
          <time dateTime={frontmatter.date}>
            {new Date(frontmatter.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>{frontmatter.tags.join(" · ")}</span>
        </div>
      </header>

      <MdxContent source={body} />

      {otherPosts.length > 0 && (
        <footer className="mt-16 pt-8 border-t border-border">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
            More writing
          </p>
          {otherPosts.map((p) => (
            <Link
              key={p.slug}
              href={`/writing/${p.slug}`}
              className="block font-serif text-lg text-foreground hover:text-accent transition-colors"
            >
              {p.frontmatter.title} →
            </Link>
          ))}
        </footer>
      )}
    </article>
  );
}
