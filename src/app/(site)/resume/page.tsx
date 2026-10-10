import type { Metadata } from "next";
import Image from "next/image";
import { Download, ExternalLink } from "lucide-react";

// To update: replace public/resume/resume.pdf, then run `npm run resume:image`
// to re-render the preview (public/resume/resume.png) from its first page.
const RESUME_PDF = "/resume/resume.pdf";
const RESUME_PREVIEW = "/resume/resume.png";
// Name the visitor's browser saves the file under.
const DOWNLOAD_NAME = "Rakesh-Singh-Resume.pdf";

// The contact page's button styles: a near-black primary and a neutral outline.
const buttonBase =
  "ui-font inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-sm font-medium transition-colors";
const primaryButton = `${buttonBase} border-[var(--md-primary)] bg-[var(--md-primary)] text-[var(--md-primary-fg)] hover:opacity-90`;
const outlineButton = `${buttonBase} border-border bg-card text-foreground hover:bg-muted`;

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Rakesh Singh is an AI Backend Engineer at Genpact, building grounded retrieval systems and hybrid search after four years of Java/Spring Boot backend work for Shutterfly USA.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <div className="max-w-none py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 id="resume" className="text-[2em] font-normal leading-[1.3] text-foreground/70">
          Resume
        </h1>
        <div className="flex flex-wrap gap-3">
          <a href={RESUME_PDF} download={DOWNLOAD_NAME} className={primaryButton}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Download PDF
          </a>
          <a href={RESUME_PDF} target="_blank" rel="noopener noreferrer" className={outlineButton}>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Open PDF
          </a>
        </div>
      </div>

      {/* The page as a sheet of paper: white in every theme, like the printed PDF. */}
      <a
        href={RESUME_PDF}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open the resume PDF in a new tab"
        className="block overflow-hidden rounded-sm bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.10)] ring-1 ring-black/5 transition-shadow hover:shadow-[0_2px_6px_rgba(0,0,0,0.14),0_12px_32px_rgba(0,0,0,0.14)]"
      >
        <Image
          src={RESUME_PREVIEW}
          alt="Rakesh Singh's one-page resume"
          width={1854}
          height={2400}
          sizes="(max-width: 840px) 100vw, 800px"
          priority
          className="h-auto w-full"
        />
      </a>
    </div>
  );
}
