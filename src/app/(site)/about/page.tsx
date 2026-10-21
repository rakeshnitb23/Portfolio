import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { EXPERIENCES } from "@/data/experiences";
import { DOMAINS } from "@/data/technical-expertise";
import { PERSON, absoluteUrl, pageMetadata, personId } from "@/lib/site";

// A plain-HTML bio built from the same data as the rest of the site, so search
// engines and AI crawlers can read the experience and numbers that /resume
// only shows as an image.
export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "About",
  description:
    "About Rakesh Singh: AI Backend Engineer at Genpact building grounded retrieval systems, previously a Java/Spring Boot backend developer for Shutterfly USA. Experience, skills, and education.",
});

const LINKS = [
  { label: "GitHub", href: PERSON.github },
  { label: "LinkedIn", href: PERSON.linkedin },
  { label: "X", href: PERSON.x },
  { label: "Hashnode", href: PERSON.hashnode },
];

export default function AboutPage() {
  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl("/about"),
    mainEntity: { "@id": personId() },
  };

  return (
    <div className="max-w-none py-10">
      <JsonLd data={profileJsonLd} />
      <h1 id="about" className="text-[2em] font-normal leading-[1.3] text-foreground/70 mb-6">
        About
      </h1>

      <div className="prose-content">
        <p>
          Rakesh Singh is an AI Backend Engineer at Genpact in {PERSON.location}, building
          grounded retrieval systems with hybrid search, citation validation, and calibrated
          abstention. From October 2022 to January 2026 he was a Backend Java Developer on
          Genpact&apos;s Shutterfly (USA) account, building high-throughput Spring Boot
          microservices.
        </p>
        <hr />

        <h2 id="experience">Experience</h2>
        {EXPERIENCES.map((exp) => (
          <section key={exp.id}>
            <h3 id={`experience-${exp.id}`}>
              {exp.role}, {exp.companyFull}
            </h3>
            <p>
              {exp.period} · {exp.location}
            </p>
            <ul>
              {exp.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </section>
        ))}
        <hr />

        <h2 id="skills">Skills</h2>
        <ul>
          {DOMAINS.map((d) => (
            <li key={d.index}>
              <strong>{d.title}</strong> - {d.techs.map((t) => t.label).join(", ")}
            </li>
          ))}
        </ul>
        <hr />

        <h2 id="education">Education</h2>
        <p>B.Tech in Computer Science and Engineering, {PERSON.alumniOf}.</p>
        <hr />

        <h2 id="links">Links</h2>
        <ul>
          <li>
            <Link href="/resume">Resume</Link> (<a href="/resume/resume.pdf">PDF</a>)
          </li>
          {LINKS.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${PERSON.email}`}>{PERSON.email}</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
