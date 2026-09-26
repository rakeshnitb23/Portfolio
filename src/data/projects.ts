import { Activity, FileCode2 } from "lucide-react";

import { type Project } from "@/types";

// ─── Categories ───────────────────────────────────────────────────────────────

export const CATEGORIES = [
  "All",
  "Full Stack",
  "Backend Systems",
  "AI Systems",
] as const;

// ─── Project Data ─────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    slug: "groundeddocs",
    title: "GroundedDocs",
    category: "AI Systems",
    tag: "RAG / citations",
    description:
      "Private document Q&A that answers only with a faithful citation from the user's files — and abstains when it can't. Idempotent ingest, user-scoped hybrid retrieval, structured outputs, citation validation, eval gates.",
    tech: ["FastAPI", "PostgreSQL", "pgvector", "LangGraph", "OpenAI"],
    year: "2026",
    annotation: "Genpact",
    href: "https://github.com/rakeshnitb23/groundeddocs",
    image: "/projects/groundeddocs.svg",
    githubUrl: "https://github.com/rakeshnitb23/groundeddocs",
    icon: FileCode2,
    stat: { label: "eval set", value: "40" },
    featured: true,
  },
  {
    slug: "kafka-order-system",
    title: "Kafka Order System",
    category: "Backend Systems",
    tag: "Event-driven",
    description:
      "Order + notification microservices on Kafka. Avro + Schema Registry, idempotent writes, retries, dead-letter queue, Flyway, Docker Compose, Actuator + Prometheus.",
    tech: ["Java 17", "Spring Boot", "Kafka", "Avro", "PostgreSQL"],
    year: "2025",
    annotation: "Architecture",
    href: "https://github.com/rakeshnitb23/kafka-order-system",
    image: "/projects/kafka-order-system.svg",
    githubUrl: "https://github.com/rakeshnitb23/kafka-order-system",
    icon: Activity,
    stat: { label: "services", value: "2" },
    featured: true,
  },
];
