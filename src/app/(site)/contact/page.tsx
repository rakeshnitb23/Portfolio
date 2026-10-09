import type { Metadata } from "next";
import { FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Contact from "@/components/sections/contact";
import { CopyEmailButton } from "@/components/sections/copy-email-button";
import { PERSON } from "@/lib/site";

// The homepage's "Directly DM" buttons: a near-black primary and neutral outlines.
const dmBase =
  "ui-font inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-sm font-medium transition-colors";
const dmPrimary = `${dmBase} cursor-pointer border-[var(--md-primary)] bg-[var(--md-primary)] text-[var(--md-primary-fg)] hover:opacity-90`;
const dmButton = `${dmBase} border-border bg-card text-foreground`;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Rakesh Singh, an AI Backend Engineer at Genpact open to selective remote opportunities.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="max-w-none py-10">
      <h1 id="lets-talk" className="text-[2em] font-normal leading-[1.3] text-foreground/70 mb-6">
        Let&apos;s talk
      </h1>
      <p className="text-foreground/70 leading-relaxed mb-10">
        Rakesh Singh is an AI Backend Engineer at Genpact, currently open to
        selective remote opportunities. Reach out about hiring,
        collaboration, or a project inquiry — response time is usually
        under 24 hours.
      </p>
      <Contact />

      <section className="mt-12 max-w-[42rem] border-t border-border pt-8">
        <h2 data-toc-skip="true" className="text-[1.25em] font-normal text-foreground mb-2">
          Prefer to DM?
        </h2>
        <p className="text-foreground/65 leading-relaxed mb-4">
          Copy my email, or message me directly on LinkedIn or X.
        </p>
        <div className="flex flex-wrap gap-3">
          <CopyEmailButton email={PERSON.email} className={dmPrimary} />
          <a
            href={PERSON.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`${dmButton} hover:border-foreground/30`}
          >
            <FaLinkedin className="h-4 w-4" aria-hidden="true" />
            Message on LinkedIn
          </a>
          {PERSON.x ? (
            <a
              href={PERSON.x}
              target="_blank"
              rel="noopener noreferrer"
              className={`${dmButton} hover:border-foreground/30`}
            >
              <FaXTwitter className="h-4 w-4" aria-hidden="true" />
              Message on X
            </a>
          ) : (
            // Shown greyed out until PERSON.x is set in lib/site.ts.
            <span title="Coming soon" className={`${dmButton} cursor-default opacity-50`}>
              <FaXTwitter className="h-4 w-4" aria-hidden="true" />
              Message on X
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
