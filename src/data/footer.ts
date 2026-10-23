import type { IconType } from "react-icons";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { PERSON } from "@/lib/site";

export interface FooterLink {
  label: string;
  /** Small grey descriptor after the label, e.g. "Essays". */
  hint?: string;
  /**
   * A site path or a full URL (full URLs open in a new tab with an ↗ icon).
   * Leave it out for a placeholder: it renders greyed out and unlinked.
   */
  href?: string;
  /** "cta" renders bold in the primary colour; "rss" adds the RSS icon. */
  variant?: "cta" | "rss";
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  label: string;
  icon: IconType;
  /** Leave it out for a placeholder. */
  href?: string;
}

// Site-wide footer. Entries without an href are placeholders — add an href
// when the page or profile exists and the entry becomes a normal link.
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Writings & Media",
    links: [
      { label: "Projects", hint: "Open-source", href: "/side-projects" },
      { label: "Blogs", hint: "Essays", href: "/blogs" },
      { label: "Writing", hint: "Notes", href: "/writing" },
      { label: "Books", hint: "Reads", href: "/books" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { label: "GroundedDocs", href: "https://github.com/rakeshnitb23/groundeddocs" },
      { label: "Kafka Order System", href: "https://github.com/rakeshnitb23/kafka-order-system" },
    ],
  },
  {
    title: "About & Contact",
    links: [
      { label: "About Rakesh", href: "/resume" },
      { label: "Contact & Inquiries", href: "/contact" },
    ],
  },
];

export const FOOTER_TAGLINE = "Built with Next.js.";

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "x.com", icon: FaXTwitter, href: PERSON.x },
  { label: "LinkedIn", icon: FaLinkedin, href: PERSON.linkedin },
  { label: "GitHub", icon: FaGithub, href: PERSON.github },
  { label: "Email", icon: FaEnvelope, href: `mailto:${PERSON.email}` },
];
