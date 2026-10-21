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

// Cards on the Projects page (/side-projects). Add a new project as another
// entry — the page and the count in its heading update on their own.
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
  {
    title: "Toolism",
    description:
      "Measures what an agent's tool definitions cost in tokens on every request and trims the JSON Schema padding, without changing which tool calls are valid — 37% fewer tokens across 159 MCP tools.",
    language: "Python",
    href: "https://github.com/rakeshnitb23/toolism",
    code: "https://github.com/rakeshnitb23/toolism",
  },
  {
    title: "Opfence",
    description:
      "An open catalog of operations an AI agent must never run without asking, and a local proxy that enforces it — every REST, GraphQL, AWS or MCP call is allowed, held for approval, or blocked.",
    language: "Go",
    href: "https://github.com/rakeshnitb23/opfence",
    code: "https://github.com/rakeshnitb23/opfence",
  },
  {
    title: "Fuel Route Planner",
    description:
      "Django REST API that plans US road trips with cost-effective fuel stops, using real truck-stop prices — PostGIS, OSRM, Redis and an optional AI strategy picker.",
    language: "Python",
    href: "https://github.com/rakeshnitb23/fuel-route-planner",
    code: "https://github.com/rakeshnitb23/fuel-route-planner",
    website: "https://fuel.lazymonk.si",
  },
  {
    title: "E-Commerce Backend",
    description:
      "Spring Boot REST API for an e-commerce app — authentication, products, cart and orders, with Spring Security, JPA, Docker and Prometheus monitoring.",
    language: "Java",
    href: "https://github.com/rakeshnitb23/Ecommerce-backend",
    code: "https://github.com/rakeshnitb23/Ecommerce-backend",
  },
  {
    title: "Pomodoro Hero",
    description:
      "A Pomodoro productivity timer with customizable work/break sessions, task tracking, progress stats and dark mode, built with Next.js and TypeScript.",
    language: "TypeScript",
    href: "https://github.com/rakeshnitb23/pomodoro-hero",
    code: "https://github.com/rakeshnitb23/pomodoro-hero",
  },
];
