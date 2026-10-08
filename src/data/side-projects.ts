export interface SideProject {
  /** Card title. */
  title: string;
  /** One or two sentences on what the project does. */
  description: string;
  /** Main language, shown in the grey line under the description. */
  language?: string;
  /** GitHub star count. Leave it out to hide the count. */
  stars?: number;
  /**
   * Where the title links: a site path ("/projects/my-project") or a full URL.
   * Leave it out while the card is a placeholder — the title then renders as
   * plain text, so visitors never land on a missing page.
   */
  href?: string;
  /** Source repository, shown as [code]. */
  code?: string;
  /** Live site or demo, shown as [website]. */
  website?: string;
}

// Cards on the Projects page (/side-projects). The first two are real; the rest
// are placeholders. When a new project is ready, overwrite a placeholder with
// its details — the page and the count in its heading update on their own.
export const SIDE_PROJECTS: SideProject[] = [
  {
    title: "GroundedDocs",
    description:
      "Private document Q&A that answers only with a faithful citation from the user's files — and abstains when it can't.",
    language: "Python",
    href: "/projects/groundeddocs",
    code: "https://github.com/rakeshnitb23/groundeddocs",
  },
  {
    title: "Kafka Order System",
    description:
      "Order and notification microservices on Kafka — Avro + Schema Registry, idempotent writes, retries, a dead-letter queue, and Prometheus-backed observability.",
    language: "Java",
    href: "/projects/kafka-order-system",
    code: "https://github.com/rakeshnitb23/kafka-order-system",
  },
  { title: "Placeholder Project 03", description: "A one or two sentence description of the project goes here.", language: "TBD" },
  { title: "Placeholder Project 04", description: "A one or two sentence description of the project goes here.", language: "TBD" },
  { title: "Placeholder Project 05", description: "A one or two sentence description of the project goes here.", language: "TBD" },
  { title: "Placeholder Project 06", description: "A one or two sentence description of the project goes here.", language: "TBD" },
  { title: "Placeholder Project 07", description: "A one or two sentence description of the project goes here.", language: "TBD" },
  { title: "Placeholder Project 08", description: "A one or two sentence description of the project goes here.", language: "TBD" },
];
