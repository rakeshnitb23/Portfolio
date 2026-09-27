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
    { title: "Investments", summary: "Notes on investments and angel positions", href: "/investments", group: "Pages" },
    { title: "User Manual", summary: "How to work with me", href: "/user-manual", group: "Pages" },
    { title: "Books", summary: "Books I've read and recommend", href: "/books", group: "Pages" },
    { title: "Resume", summary: "Experience, education, and skills", href: "/resume", group: "Pages" },
    { title: "Projects", summary: "Backend and AI systems, end to end", href: "/projects", group: "Pages" },
    { title: "Writing", summary: "Notes on retrieval, reliability, and backend systems", href: "/writing", group: "Pages" },
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
