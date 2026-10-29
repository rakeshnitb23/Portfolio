import type { Metadata } from "next";
import { getAllPersonalPosts } from "@/lib/content";
import { pageMetadata } from "@/lib/site";
import { SkillArchive, type SkillPost } from "@/components/sections/skill-archive";

export const metadata: Metadata = pageMetadata({
  path: "/personal-writing",
  title: "Personal Writings",
  description:
    "Personal writing from Rakesh Singh, grouped by the skills he is learning right now.",
});

function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function PersonalWritingPage() {
  // Posts live in content/personal/*.mdx; each one's "skill" frontmatter puts it under a pill.
  const posts: SkillPost[] = getAllPersonalPosts().map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title,
    summary: post.frontmatter.summary,
    date: post.frontmatter.date,
    placeholder: post.frontmatter.placeholder,
    skill: post.frontmatter.skill,
    minutes: readingTime(post.body),
  }));

  return (
    <div className="max-w-none py-10">
      <h1
        id="personal-writing"
        className="text-[2em] font-normal leading-[1.3] text-foreground/70 mb-2"
      >
        Personal Writings
      </h1>
      <p className="text-foreground/65 leading-relaxed mb-8">
        These are the skills I’m learning. Pick one to see what I’ve written about it.
      </p>

      <SkillArchive posts={posts} />
    </div>
  );
}
