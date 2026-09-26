import type { MetadataRoute } from "next";
import { getAllProjects, getAllWritingPosts } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/writing`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = getAllProjects().map((p) => ({
    url: `${SITE_URL}/projects/${p.slug}`,
    lastModified: p.frontmatter.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const writingRoutes: MetadataRoute.Sitemap = getAllWritingPosts().map((p) => ({
    url: `${SITE_URL}/writing/${p.slug}`,
    lastModified: p.frontmatter.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...writingRoutes];
}
