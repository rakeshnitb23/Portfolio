import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getAllProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Backend and AI systems built by Rakesh Singh, including GroundedDocs (grounded retrieval Q&A) and the Kafka Order System (event-driven microservices).",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="container-constrained max-w-[860px] py-20 md:py-28">
      <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
        Projects
      </h1>
      <p className="text-foreground/65 max-w-[60ch] leading-relaxed mb-16">
        A short list of production-minded systems — retrieval that cites its
        sources and knows when to abstain, and event-driven backends built to
        stay correct under retries and redelivery.
      </p>

      <div className="flex flex-col divide-y divide-border">
        {projects.map((project) => (
          <article key={project.slug} className="py-8 first:pt-0">
            <Link
              href={`/projects/${project.slug}`}
              className="group flex flex-col gap-2"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-serif text-2xl font-semibold text-foreground group-hover:text-accent transition-colors flex items-center gap-2">
                  {project.frontmatter.title}
                  <ArrowUpRight
                    className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden="true"
                  />
                </h2>
                <time
                  dateTime={project.frontmatter.date}
                  className="font-mono text-xs text-muted-foreground shrink-0"
                >
                  {new Date(project.frontmatter.date).getFullYear()}
                </time>
              </div>
              <p className="text-foreground/65 leading-relaxed max-w-[64ch]">
                {project.frontmatter.summary}
              </p>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-1">
                {project.frontmatter.stack.join(" · ")}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
