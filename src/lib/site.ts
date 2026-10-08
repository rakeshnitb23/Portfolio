// NOTE: No production domain was configured anywhere in the repo (next-sitemap.config.js
// falls back to localhost). This is env-driven via NEXT_PUBLIC_SITE_URL; set that env var
// to the real production domain when it exists. Falls back to a placeholder for local/dev.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://rakeshsingh.dev";

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
  alumniOf: "National Institute of Technology (NIT) Bhopal",
};

export function personId() {
  return `${SITE_URL}/#person`;
}

export function absoluteUrl(pathname: string) {
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}
