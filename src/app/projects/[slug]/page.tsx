import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjects, getProject, getProjectSlugs } from "@/lib/content";
import { MdxContent } from "@/components/mdx-content";
import { JsonLd, breadcrumbList } from "@/components/json-ld";
import { absoluteUrl, personId } from "@/lib/site";

export const dynamic = "force-static";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugs = getProjectSlugs();
  if (!slugs.includes(slug)) return {};
  const { frontmatter } = getProject(slug);
  return {
    title: frontmatter.title,
    description: frontmatter.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.summary,
      type: "article",
      url: absoluteUrl(`/projects/${slug}`),
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.summary,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugs = getProjectSlugs();
  if (!slugs.includes(slug)) notFound();

  const { frontmatter, body } = getProject(slug);
  const url = absoluteUrl(`/projects/${slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: frontmatter.title,
    description: frontmatter.summary,
    url,
    dateCreated: frontmatter.date,
    programmingLanguage: frontmatter.stack,
    codeRepository: frontmatter.repo,
    author: { "@id": personId() },
    creator: { "@id": personId() },
  };

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: frontmatter.title,
    description: frontmatter.summary,
    url,
    author: { "@id": personId() },
    datePublished: frontmatter.date,
  };

  const otherProjects = getAllProjects().filter((p) => p.slug !== slug);

  return (
    <article className="max-w-[42rem] py-10">
      <JsonLd data={jsonLd} />
      <JsonLd data={creativeWorkJsonLd} />
      <JsonLd
        data={breadcrumbList([
          { name: "Home", url: absoluteUrl("/") },
          { name: "Projects", url: absoluteUrl("/projects") },
          { name: frontmatter.title, url },
        ])}
      />

      <nav aria-label="Breadcrumb" className="mb-8 font-mono text-xs text-muted-foreground">
        <Link href="/projects" className="hover:text-primary underline underline-offset-4">
          Projects
        </Link>
        <span className="mx-2">/</span>
        <span>{frontmatter.title}</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-[2em] font-normal leading-[1.3] text-foreground/70 mb-4">
          {frontmatter.title}
        </h1>
        <p className="text-lg text-foreground/70 leading-relaxed max-w-[60ch]">
          {frontmatter.summary}
        </p>

        <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div>
            <dt className="uppercase tracking-wider text-muted-foreground mb-1">Role</dt>
            <dd className="text-foreground/80">{frontmatter.role}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider text-muted-foreground mb-1">Date</dt>
            <dd className="text-foreground/80">
              <time dateTime={frontmatter.date}>
                {new Date(frontmatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </time>
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="uppercase tracking-wider text-muted-foreground mb-1">Stack</dt>
            <dd className="text-foreground/80">{frontmatter.stack.join(" · ")}</dd>
          </div>
        </dl>

        <p className="mt-4 text-sm text-foreground/70 max-w-[60ch]">
          <strong className="font-semibold text-foreground">Outcome:</strong>{" "}
          {frontmatter.outcome}
        </p>

        <div className="mt-6 flex gap-6 font-mono text-xs uppercase tracking-wider">
          {frontmatter.repo && (
            <a
              href={frontmatter.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              Repository
            </a>
          )}
          {frontmatter.demo && (
            <a
              href={frontmatter.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              Live demo
            </a>
          )}
        </div>
      </header>

      <MdxContent source={body} />

      {otherProjects.length > 0 && (
        <footer className="mt-16 pt-8 border-t border-border">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3">
            More projects
          </p>
          {otherProjects.map((p) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="block text-lg text-foreground hover:text-primary transition-colors"
            >
              {p.frontmatter.title} →
            </Link>
          ))}
        </footer>
      )}
    </article>
  );
}
