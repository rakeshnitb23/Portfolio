import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getAllProjects } from "@/lib/content";
import { PERSON } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rakesh Singh — AI Backend Engineer",
  description:
    "AI Backend Engineer at Genpact building grounded retrieval systems, and previously a Java/Spring Boot backend developer for Shutterfly USA.",
};

export default function Home() {
  const projects = getAllProjects();

  return (
    <div className="max-w-none py-10">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary mb-4">
          {PERSON.location}
        </p>
        <h1 id="rakesh-singh" className="text-[2em] font-normal leading-[1.3] text-foreground/70 mb-10">
          Rakesh Singh
        </h1>
        <p className="text-lg text-foreground/70 leading-relaxed">
          I&apos;m an AI Backend Engineer at Genpact, building grounded
          retrieval systems that cite their sources and know when to say
          &quot;I don&apos;t know&quot; — after four years building Java and
          Spring Boot backends for Shutterfly&apos;s production systems in the
          US market.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-sm">
          <a
            href={PERSON.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-accent underline underline-offset-4"
          >
            GitHub
          </a>
          <a
            href={PERSON.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/60 hover:text-accent underline underline-offset-4"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${PERSON.email}`}
            className="text-foreground/60 hover:text-accent underline underline-offset-4"
          >
            {PERSON.email}
          </a>
          <Link
            href="/resume"
            className="text-foreground/60 hover:text-accent underline underline-offset-4"
          >
            Full bio →
          </Link>
        </div>
      </header>

      <section aria-labelledby="featured-work-heading">
        <div className="flex items-baseline justify-between mb-6">
          <h2
            id="featured-work-heading"
            className="text-[1.5625em] font-light tracking-[-0.01em] text-foreground"
          >
            Selected work
          </h2>
          <Link
            href="/projects"
            className="font-mono text-xs uppercase tracking-wider text-primary hover:underline"
          >
            All projects
          </Link>
        </div>

        <div className="flex flex-col divide-y divide-border">
          {projects.map((project) => (
            <article key={project.slug} className="py-8 first:pt-0">
              <Link
                href={`/projects/${project.slug}`}
                className="group flex flex-col md:flex-row md:items-baseline md:justify-between gap-2"
              >
                <div className="max-w-none">
                  <h3 className="text-xl font-normal tracking-[-0.01em] text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    {project.frontmatter.title}
                    <ArrowUpRight
                      className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-hidden="true"
                    />
                  </h3>
                  <p className="mt-2 text-foreground/65 leading-relaxed">
                    {project.frontmatter.summary}
                  </p>
                  <p className="mt-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {project.frontmatter.stack.join(" · ")}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <p className="font-serif text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-none">
          I write about retrieval, reliability, and the systems that keep
          large-scale backends honest. Read the{" "}
          <Link href="/writing" className="text-accent underline underline-offset-4">
            notes
          </Link>
          , or{" "}
          <Link href="/contact" className="text-accent underline underline-offset-4">
            get in touch
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
