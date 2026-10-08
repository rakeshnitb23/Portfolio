import type { Metadata } from "next";
import { BlogArchive } from "@/components/sections/blog-archive";
import { BLOGS } from "@/data/blogs";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Long-form essays from Rakesh Singh on distributed systems, backend engineering, databases, and AI systems.",
  alternates: { canonical: "/blogs" },
};

export default function BlogsPage() {
  return (
    <div className="max-w-none py-10">
      <h1 id="blogs" className="text-[2em] font-normal leading-[1.3] text-foreground/70 mb-2">
        Blogs
      </h1>
      <p className="text-foreground/65 leading-relaxed mb-8">
        Long-form essays on distributed systems, backend engineering, databases, and AI systems.
      </p>

      <BlogArchive posts={BLOGS} />

      <div className="mt-16 pt-6 border-t border-border font-mono text-sm">
        <a href="#blogs" className="text-primary hover:underline">
          ↑ Back to top
        </a>
      </div>
    </div>
  );
}
