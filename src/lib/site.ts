import type { Metadata } from "next";

// The production domain. NEXT_PUBLIC_SITE_URL overrides it (it's baked in at build
// time, so a change needs a redeploy). Keep this fallback the real domain: every
// canonical tag, the sitemap, robots.txt, and JSON-LD are built from it.
// scripts/generate-llms-txt.mjs and scripts/verify-crawlable.mjs repeat it.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.lazymonk.si";

export const SITE_NAME = "Rakesh Singh";

export const PERSON = {
  name: "Rakesh Singh",
  email: "rakeshnitb23@gmail.com",
  jobTitle: "AI Backend Engineer",
  location: "Bangalore, India",
  github: "https://github.com/rakeshnitb23",
  linkedin: "https://linkedin.com/in/rakesh-singh-58926a116",
  /** X (Twitter) profile URL. */
  x: "https://x.com/rakeshK77998015",
  hashnode: "https://grounded-engineering.hashnode.dev",
  /** Profile photo, used as the Person JSON-LD image. */
  image: "/images/rakesh.jpg",
  alumniOf: "National Institute of Technology (NIT) Bhopal",
};

export function personId() {
  return `${SITE_URL}/#person`;
}

export function absoluteUrl(pathname: string) {
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

/**
 * The preview image from app/opengraph-image.tsx. A page that sets its own
 * openGraph or twitter tags drops the inherited image, so it lists this one.
 */
export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Rakesh Singh — AI Backend Engineer",
};

/**
 * Metadata for a static page: title, description, canonical, and its own Open
 * Graph and Twitter tags. Without the last two a page inherits the root
 * layout's, so its link preview shows the homepage's title and URL.
 */
export function pageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  const fullTitle = `${title} — ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      siteName: "Rakesh Singh Portfolio",
      locale: "en_US",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
