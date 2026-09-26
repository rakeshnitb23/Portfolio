import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export interface ProjectFrontmatter {
  title: string;
  summary: string;
  date: string;
  stack: string[];
  role: string;
  outcome: string;
  repo?: string;
  demo?: string;
}

export interface WritingFrontmatter {
  title: string;
  summary: string;
  date: string;
  tags: string[];
}

export interface ContentEntry<T> {
  slug: string;
  frontmatter: T;
  body: string;
}

function readDir(dir: string): string[] {
  const full = path.join(CONTENT_ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function readEntry<T>(dir: string, slug: string): ContentEntry<T> {
  const filePath = path.join(CONTENT_ROOT, dir, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { slug, frontmatter: data as T, body: content };
}

export function getProjectSlugs(): string[] {
  return readDir("projects");
}

export function getWritingSlugs(): string[] {
  return readDir("writing");
}

export function getProject(slug: string): ContentEntry<ProjectFrontmatter> {
  return readEntry<ProjectFrontmatter>("projects", slug);
}

export function getWritingPost(slug: string): ContentEntry<WritingFrontmatter> {
  return readEntry<WritingFrontmatter>("writing", slug);
}

export function getAllProjects(): ContentEntry<ProjectFrontmatter>[] {
  return getProjectSlugs()
    .map((slug) => getProject(slug))
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}

export function getAllWritingPosts(): ContentEntry<WritingFrontmatter>[] {
  return getWritingSlugs()
    .map((slug) => getWritingPost(slug))
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1));
}
