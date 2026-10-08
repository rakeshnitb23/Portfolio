import { PERSON } from "@/lib/site";

export type SocialType = "email" | "linkedin" | "x" | "github";

export interface HomeProject {
  title: string;
  /** One or two lines; the card clamps it to two. */
  summary: string;
  /** Internal project page (/projects/slug) or an external URL. */
  href: string;
  github: string;
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
    "I'm an AI Backend Engineer at Genpact in Bangalore. I build grounded retrieval systems: question-answering over private documents that cites its sources and says \"I don't know\" when the evidence isn't there.",
    "Before that, I spent four years building Java and Spring Boot backends for Shutterfly's production systems in the US market. That work taught me to care about idempotency, retries and what happens when a message arrives twice.",
    "These days I write about [retrieval, caching and rate limiting for LLM systems](/blogs), and keep longer [notes on reliability](/writing). I studied at NIT Bhopal. If you're hiring or want to compare notes on RAG in production, [get in touch](/contact).",
  ],
  projects: [
    {
      title: "GroundedDocs",
      summary:
        "Private document Q&A that answers only with a faithful citation from the user's files — and abstains when it can't.",
      href: "/projects/groundeddocs",
      github: "https://github.com/rakeshnitb23/groundeddocs",
    },
    {
      title: "Kafka Order System",
      summary:
        "Order and notification microservices on Kafka — Avro + Schema Registry, idempotent writes, retries and a dead-letter queue.",
      href: "/projects/kafka-order-system",
      github: "https://github.com/rakeshnitb23/kafka-order-system",
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
