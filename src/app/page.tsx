import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HomeHeader } from "@/components/home/home-header";
import { CopyEmailButton } from "@/components/sections/copy-email-button";
import { NewsletterSubscribe } from "@/components/sections/newsletter-subscribe";
import { BLOGS } from "@/data/blogs";
import { home, type SocialType } from "@/data/home";
import { buildSearchIndex } from "@/lib/search-index";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Rakesh Singh — AI Backend Engineer",
  description:
    "AI Backend Engineer at Genpact building grounded retrieval systems, and previously a Java/Spring Boot backend developer for Shutterfly USA.",
};

const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-lora" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter" });

// Lora for reading text, Inter for UI text (nav, buttons, dates, labels).
const serif = "font-[family-name:var(--font-lora),Georgia,serif]";
const sans = "font-[family-name:var(--font-inter),system-ui,sans-serif]";

const container = "mx-auto w-full max-w-[800px] px-6 phone:px-4";
const isExternal = (href: string) => /^https?:\/\//.test(href);
const newTab = { target: "_blank", rel: "noopener noreferrer" } as const;

const SOCIAL_ICONS: Record<SocialType, React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" }>> = {
  email: Mail,
  linkedin: FaLinkedin,
  x: FaXTwitter,
  github: FaGithub,
};

interface HomePost {
  title: string;
  href: string;
  /** YYYY-MM-DD */
  date: string;
}

// The 4 newest published posts, newest first. Build guides are left out: each
// one is a companion to an essay on the same topic, so they would show twice.
function getLatestPosts(limit = 4): HomePost[] {
  return BLOGS.flatMap(({ title, href, date, kind }) => (href && kind !== "guide" ? [{ title, href, date }] : []))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-02" → "02 Oct 2026" */
function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day} ${MONTHS[Number(month) - 1]} ${year}`;
}

const inlineLink = "text-[var(--link)] no-underline hover:text-[var(--link-hover)] hover:underline";

/** Renders [text](href) links inside a bio paragraph; everything else is plain text. */
function BioParagraph({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <p>
      {parts.map((part, i) => {
        const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!match) return part;
        const [, label, href] = match;
        return isExternal(href) ? (
          <a key={i} href={href} {...newTab} className={inlineLink}>
            {label}
          </a>
        ) : (
          <Link key={i} href={href} className={inlineLink}>
            {label}
          </Link>
        );
      })}
    </p>
  );
}

const photoBox =
  "float-right mt-1 mb-4 ml-8 size-[240px] rounded-full [shape-outside:circle(50%)] " +
  "phone:float-none phone:mx-auto phone:mt-0 phone:mb-6 phone:size-[160px] phone:[shape-outside:none]";

function Portrait() {
  // Until the photo is added under /public, show a neutral placeholder circle.
  const hasPhoto = fs.existsSync(path.join(process.cwd(), "public", home.photo));
  if (!hasPhoto) {
    return (
      <div
        role="img"
        aria-label="Portrait of Rakesh Singh (placeholder)"
        className={cn(photoBox, sans, "flex items-center justify-center bg-[var(--placeholder-bg)] text-[40px] font-medium text-[var(--muted)]")}
      >
        RS
      </div>
    );
  }
  return (
    <Image
      src={home.photo}
      alt="Portrait of Rakesh Singh"
      width={480}
      height={480}
      priority
      sizes="(max-width: 640px) 160px, 240px"
      className={cn(photoBox, "block object-cover")}
    />
  );
}

const sectionHeading = "text-[22px] font-semibold leading-tight";

const buttonBase =
  `${sans} inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-[15px] font-medium transition-colors ` +
  "phone:flex-1 phone:px-3 tiny:w-full tiny:flex-none";
// Colours come from the .home-page tokens in globals.css, so buttons follow the reading theme.
const outlineButton = `${buttonBase} border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--border-hover)]`;
const primaryButton = `${buttonBase} cursor-pointer border border-[var(--text)] bg-[var(--text)] text-[var(--on-text)] hover:border-[var(--text-hover)] hover:bg-[var(--text-hover)]`;
// A smaller primary button that sits beside a section heading.
const headingButton = `${sans} inline-flex h-8 cursor-pointer items-center whitespace-nowrap rounded-lg border border-[var(--text)] bg-[var(--text)] px-3 text-[14px] font-medium text-[var(--on-text)] transition-colors hover:border-[var(--text-hover)] hover:bg-[var(--text-hover)]`;

export default function Home() {
  const posts = getLatestPosts();
  const searchIndex = buildSearchIndex();

  return (
    <div
      className={cn(
        lora.variable,
        inter.variable,
        serif,
        "home-page flex min-h-screen flex-col bg-[var(--bg)] text-[18px] leading-[1.65] text-[var(--text)] phone:text-[17px]"
      )}
    >
      {/* Header: the site-wide menu bar (also used on every inner page). */}
      <HomeHeader searchIndex={searchIndex} />

      <main className={cn(container, "flex-1")}>
        {/* About: the bio wraps around the circular photo, then runs full width under it. */}
        <section aria-label="About" className="flow-root pt-14">
          <Portrait />
          <div className="space-y-4">
            {home.bio.map((paragraph, i) => (
              <BioParagraph key={i} text={paragraph} />
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" aria-labelledby="projects-heading" className="mt-14">
          <h2 id="projects-heading" className={cn(sectionHeading, "mb-4")}>
            Projects
          </h2>
          <div className="grid grid-cols-2 gap-5 phone:grid-cols-1 phone:gap-4">
            {home.projects.map((project) => (
              <article
                key={project.title}
                className="relative flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition duration-150 ease-in-out hover:-translate-y-0.5 hover:border-[var(--border-hover)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <h3 className="text-[19px] font-semibold leading-snug">
                  {/* Stretched link: its ::after covers the card, so the whole card opens the project. */}
                  <a
                    href={project.href}
                    {...(isExternal(project.href) ? newTab : {})}
                    className="text-[var(--text)] no-underline after:absolute after:inset-0 after:rounded-xl after:content-['']"
                  >
                    {project.title}
                  </a>
                </h3>
                <p className="mt-2 line-clamp-2 text-[16px] leading-normal">{project.summary}</p>
                <div className={cn(sans, "mt-auto flex items-center justify-between pt-4 text-[15px]")}>
                  {/* Visual cue only: the stretched title link above handles the click. */}
                  <span aria-hidden="true" className="font-medium text-[var(--link)]">
                    View project →
                  </span>
                  <a
                    href={project.github}
                    {...newTab}
                    className="relative z-10 inline-flex items-center gap-1.5 text-[var(--muted)] hover:text-[var(--text)] hover:underline"
                  >
                    <FaGithub className="size-4" aria-hidden="true" />
                    GitHub
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Technical Blogs (hidden when there are no posts) */}
        {posts.length > 0 && (
          <section id="blog" aria-labelledby="blog-heading" className="mt-14">
            {/* The newsletter form opens on its own line under this row (see NewsletterSubscribe). */}
            <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-3">
              <h2 id="blog-heading" className={cn(sectionHeading, "mr-auto")}>
                Technical Blogs
              </h2>
              <NewsletterSubscribe
                className={headingButton}
                submitClassName="border-[var(--text)] bg-[var(--text)] text-[var(--on-text)] hover:border-[var(--text-hover)] hover:bg-[var(--text-hover)]"
              />
              <Link
                href="/blogs"
                className={cn(sans, "text-[15px] font-medium text-[var(--link)] hover:text-[var(--link-hover)] hover:underline")}
              >
                All posts →
              </Link>
            </div>
            <ul>
              {posts.map((post) => (
                <li key={post.href} className="border-t border-[var(--border)]">
                  <a
                    href={post.href}
                    {...(isExternal(post.href) ? newTab : {})}
                    className="group flex min-h-12 items-baseline justify-between gap-6 py-3.5 phone:flex-col phone:gap-1"
                  >
                    <span className="line-clamp-2 text-[var(--link)] group-hover:text-[var(--link-hover)] group-hover:underline">
                      {post.title}
                    </span>
                    <time
                      dateTime={post.date}
                      className={cn(sans, "shrink-0 whitespace-nowrap text-[15px] text-[var(--muted)] tabular-nums")}
                    >
                      {formatDate(post.date)}
                    </time>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-14 border-t border-[var(--border)]">
        <div className={cn(container, "grid grid-cols-[2fr_3fr] items-start gap-8 pt-10 pb-14 phone:grid-cols-1")}>
          <div>
            <h2 className={cn(sans, "mb-3 text-[15px] font-semibold text-[var(--muted)]")}>Socials</h2>
            <ul className="space-y-2 text-[16px]">
              {home.socials.map(({ type, label, href }) => {
                const Icon = SOCIAL_ICONS[type];
                return (
                  <li key={type} className="flex items-center gap-2">
                    <Icon className="size-4 shrink-0 text-[var(--muted)]" aria-hidden="true" />
                    <a
                      href={href}
                      {...(isExternal(href) ? newTab : {})}
                      className="break-all text-[var(--link)] hover:text-[var(--link-hover)] hover:underline"
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h2 className={cn(sans, "text-[15px] font-semibold text-[var(--muted)]")}>Directly DM</h2>
            <p className={cn(sans, "mb-3 text-[15px] text-[var(--muted)]")}>Fastest way to reach me.</p>
            <div className="flex gap-3 tiny:flex-col">
              <CopyEmailButton email={home.email} className={primaryButton} />
              <a href={home.linkedinDm} {...newTab} className={outlineButton}>
                <FaLinkedin className="size-4" aria-hidden="true" />
                LinkedIn
              </a>
              <a href={home.xDm} {...newTab} className={outlineButton}>
                <FaXTwitter className="size-4" aria-hidden="true" />X
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
