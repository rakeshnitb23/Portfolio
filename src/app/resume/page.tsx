import type { Metadata } from "next";
import { EXPERIENCES } from "@/data/experiences";
import { DOMAINS } from "@/data/technical-expertise";
import { PERSON } from "@/lib/site";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Rakesh Singh is an AI Backend Engineer at Genpact, building grounded retrieval systems and hybrid search after four years of Java/Spring Boot backend work for Shutterfly USA.",
  alternates: { canonical: "/resume" },
};

export default function ResumePage() {
  return (
    <div className="max-w-none py-10">
      <h1 id="resume" className="text-[2em] font-normal leading-[1.3] text-foreground/70 mb-6">
        Resume
      </h1>

      <div className="prose-content mb-4">
        <p>
          I&apos;m Rakesh Singh, an AI Backend Engineer at Genpact based in{" "}
          {PERSON.location}. I architect backend systems and performance-driven
          applications designed for scale and production stability — most
          recently grounded document Q&amp;A systems that answer only with
          faithful citations and abstain when the evidence isn&apos;t there,
          and before that, Java and Spring Boot services processing millions
          of transactions a day for Shutterfly in the US.
        </p>
        <p>
          My focus areas are scalable backend systems, production reliability,
          and — currently — retrieval-augmented generation done in a way that
          doesn&apos;t quietly lie to users. I&apos;m open to selective remote
          opportunities.
        </p>
      </div>

      <section aria-labelledby="experience-heading" className="mb-16">
        <h2
          id="experience-heading"
          className="text-[1.5625em] font-light tracking-[-0.01em] text-foreground mb-8"
        >
          Experience
        </h2>
        <div className="flex flex-col gap-12">
          {EXPERIENCES.map((exp) => (
            <article key={exp.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <h3 className="text-[1.25em] font-normal tracking-[-0.01em] text-foreground">
                  {exp.role} · {exp.companyFull}
                </h3>
                <time className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {exp.period}
                </time>
              </div>
              <p className="font-mono text-xs uppercase tracking-wider text-primary mb-4">
                {exp.location}
              </p>
              <ul className="list-disc ml-5 space-y-2 text-foreground/75 leading-relaxed">
                {exp.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
              <p className="mt-4 font-mono text-xs text-muted-foreground">
                {exp.tags.join(" · ")}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="education-heading" className="mb-16">
        <h2
          id="education-heading"
          className="text-[1.5625em] font-light tracking-[-0.01em] text-foreground mb-6"
        >
          Education
        </h2>
        <article>
          <h3 className="text-[1.25em] font-normal tracking-[-0.01em] text-foreground">
            Bachelor of Technology, Computer Science and Engineering
          </h3>
          <p className="font-mono text-xs uppercase tracking-wider text-primary mt-1 mb-1">
            National Institute of Technology (NIT) Bhopal
          </p>
          <time className="font-mono text-xs text-muted-foreground">
            Jan 2018 — Jan 2022
          </time>
          <ul className="list-disc ml-5 mt-4 space-y-2 text-foreground/75 leading-relaxed">
            <li>Foundation in OS, networks, databases, and software engineering.</li>
            <li>
              Helped organize ISTE chapter events for 200+ students, and
              contributed 100+ volunteer hours at Arushi NGO, Bhopal.
            </li>
          </ul>
        </article>
      </section>

      <section aria-labelledby="skills-heading">
        <h2
          id="skills-heading"
          className="text-[1.5625em] font-light tracking-[-0.01em] text-foreground mb-8"
        >
          Skills
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {DOMAINS.map((domain) => (
            <div key={domain.index}>
              <h3 className="text-lg font-normal text-foreground mb-1">
                {domain.title}
              </h3>
              <p className="text-sm text-foreground/60 mb-3">{domain.depth}</p>
              <p className="font-mono text-xs text-muted-foreground">
                {domain.techs.map((t) => t.label).join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
