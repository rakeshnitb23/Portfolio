import { PERSON } from "@/lib/site";

export type SocialType = "email" | "linkedin" | "x" | "github";

export interface HomeProject {
  title: string;
  /** One or two lines; the card clamps it to two. */
  summary: string;
  /** Internal project page (/projects/slug) or an external URL. */
  href: string;
  github: string;
  /** A LinkedIn post about the project, shown as a link next to GitHub. */
  linkedin?: string;
  /** My role on the project (e.g. "Owner"), shown as a pill above the title. */
  role?: string;
  /** What the project is (e.g. "Open-source library"), shown next to the role. */
  kind?: string;
}

export interface HomeSocial {
  type: SocialType;
  label: string;
  href: string;
}

export interface HomeContent {
  name: string;
  /**
   * Path under /public. Until the file exists, the page shows an "RS"
   * placeholder circle in its place.
   */
  photo: string;
  /** 3–5 short paragraphs. Inline links use markdown syntax: [text](/path). */
  bio: string[];
  /** Exactly two. */
  projects: [HomeProject, HomeProject];
  email: string;
  linkedinDm: string;
  xDm: string;
  /** Shown in this order in the footer. */
  socials: HomeSocial[];
}

// Everything the homepage says lives here.
export const home: HomeContent = {
  name: PERSON.name,
  photo: "/images/rakesh.jpg",
  bio: [
    "I'm an AI Backend Engineer in Bengaluru with four years of production backend experience. I build grounded AI systems: assistants that answer from a company's private documents, cite the exact source, and say \"I don't know\" when the evidence isn't there. Most recently at [Genpact](https://www.genpact.com), I built one end to end, from hybrid search on [PostgreSQL](https://www.postgresql.org) and [pgvector](https://github.com/pgvector/pgvector) to an LLM gateway over [OpenAI](https://openai.com), [Claude](https://www.anthropic.com/claude) and [AWS Bedrock](https://aws.amazon.com/bedrock/), with [DeepEval](https://deepeval.com) and [Ragas](https://docs.ragas.io) eval gates that block any release that gets less accurate, less secure or more expensive.",
    "Before AI, I spent two years building Java and [Spring Boot](https://spring.io/projects/spring-boot) microservices for [Shutterfly](https://www.shutterfly.com)'s photo platform in the US, handling 2 million transactions a day. That work taught me to care about idempotency, retries and what happens when a message arrives twice. I now bring the same habits to LLM calls that time out, fail or cost too much.",
    "Outside work I maintain [toolism](https://github.com/rakeshnitb23/toolism), an open-source Python library that cuts the token cost of AI agent tool definitions by 38%, and [Opfence](https://github.com/sudheer215s/opfence), an open catalog of operations an AI agent should never run without asking. I write about [retrieval, caching and rate limiting for LLM systems](/blogs), and keep [personal writing](/personal-writing) on the skills I'm learning. I studied at [NIT Bhopal](https://www.manit.ac.in). If you're hiring or want to compare notes on RAG in production, [get in touch](/contact).",
  ],
  projects: [
    {
      title: "toolism",
      summary:
        "Open-source Python library that measures and cuts the token cost of LLM tool and MCP schemas, with equivalence checking and a CI gate.",
      href: "https://github.com/rakeshnitb23/toolism",
      github: "https://github.com/rakeshnitb23/toolism",
      linkedin: "https://www.linkedin.com/feed/update/urn:li:activity:7529582208936808448/",
      role: "Owner",
      kind: "Open-source library",
    },
    {
      title: "Opfence",
      summary:
        "Open catalog of the operations an AI agent must never run without asking, and a Go tool that enforces it on every request.",
      href: "https://github.com/rakeshnitb23/opfence",
      github: "https://github.com/rakeshnitb23/opfence",
      role: "Maintainer",
      kind: "Open-source library",
    },
  ],
  email: PERSON.email,
  linkedinDm: PERSON.linkedin,
  xDm: PERSON.x,
  socials: [
    { type: "email", label: PERSON.email, href: `mailto:${PERSON.email}` },
    { type: "linkedin", label: "rakesh-singh-58926a116", href: PERSON.linkedin },
    { type: "x", label: "@rakeshK77998015", href: PERSON.x },
    { type: "github", label: "rakeshnitb23", href: PERSON.github },
  ],
};
