import type { IconType } from "react-icons";
import { FaEnvelope, FaGithub, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

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
      { label: "Videos", hint: "Walkthroughs" },
      { label: "Papershelf", hint: "Research" },
      { label: "Books", hint: "Reads", href: "/books" },
      { label: "Talks & Appearances" },
      { label: "RSS Feed", variant: "rss" },
    ],
  },
  {
    title: "Masterclasses",
    links: [
      { label: "Placeholder Course 1" },
      { label: "Placeholder Course 2" },
      { label: "Placeholder Course 3" },
      { label: "View all courses →", variant: "cta" },
    ],
  },
  {
    title: "Ecosystem",
    links: [
      { label: "GroundedDocs", href: "https://github.com/rakeshnitb23/groundeddocs" },
      { label: "Kafka Order System", href: "https://github.com/rakeshnitb23/kafka-order-system" },
      { label: "Placeholder Project 1" },
      { label: "Placeholder Project 2" },
      { label: "Placeholder Project 3" },
    ],
  },
  {
    title: "About & Contact",
    links: [
      { label: "About Rakesh", href: "/resume" },
      { label: "Contact & Inquiries", href: "/contact" },
      { label: "Terms & Conditions" },
      { label: "Privacy Policy" },
      { label: "Refund Policy" },
    ],
  },
];

/** Small print above the copyright line (business name, address, tax ID). */
export const FOOTER_NOTE =
  "Placeholder — registered business name, address, and tax ID go here.";

export const FOOTER_TAGLINE = "Built with Next.js.";

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "YouTube", icon: FaYoutube },
  { label: "Twitter", icon: FaTwitter, href: PERSON.x },
  { label: "LinkedIn", icon: FaLinkedin, href: PERSON.linkedin },
  { label: "GitHub", icon: FaGithub, href: PERSON.github },
  { label: "Email", icon: FaEnvelope, href: `mailto:${PERSON.email}` },
];
