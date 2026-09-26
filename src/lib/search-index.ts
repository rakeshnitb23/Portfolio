import { getAllProjects, getAllWritingPosts } from "@/lib/content";

export interface SearchItem {
  title: string;
  summary: string;
  href: string;
  group: string;
}

export function buildSearchIndex(): SearchItem[] {
  const pages: SearchItem[] = [
    { title: "Home", summary: "Introduction and selected work", href: "/", group: "Pages" },
    { title: "Projects", summary: "Backend and AI systems, end to end", href: "/projects", group: "Pages" },
    { title: "Writing", summary: "Notes on retrieval, reliability, and backend systems", href: "/writing", group: "Pages" },
    { title: "About", summary: "Experience, education, and skills", href: "/about", group: "Pages" },
    { title: "Contact", summary: "Get in touch", href: "/contact", group: "Pages" },
  ];

  const projects: SearchItem[] = getAllProjects().map((p) => ({
    title: p.frontmatter.title,
    summary: p.frontmatter.summary,
    href: `/projects/${p.slug}`,
    group: "Projects",
  }));

  const writing: SearchItem[] = getAllWritingPosts().map((p) => ({
    title: p.frontmatter.title,
    summary: p.frontmatter.summary,
    href: `/writing/${p.slug}`,
    group: "Writing",
  }));

  return [...pages, ...projects, ...writing];
}
