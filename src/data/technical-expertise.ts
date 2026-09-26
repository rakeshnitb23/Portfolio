import {
  Server, Terminal, Code2, Database, Layout, BarChart2, Clock, Cloud, Container, Shield, GitBranch, RefreshCw, FileType, Binary, Cpu, Coffee, Boxes, Network
} from "lucide-react";

export const DOMAINS = [
  {
    index: "01",
    title: "Backend Systems",
    descriptor: "Server Architecture & API Design",
    depth: "Production-grade distributed systems with sub-100ms response targets",
    techs: [
      { label: "FastAPI", Icon: Terminal },
      { label: "Python", Icon: Code2 },
      { label: "Java", Icon: Coffee },
      { label: "Spring Boot", Icon: Boxes },
      { label: "TypeScript", Icon: FileType },
    ],
  },
  {
    index: "02",
    title: "Retrieval & AI",
    descriptor: "Grounded Retrieval & Agent Systems",
    depth: "Hybrid retrieval, citation validation, and bounded agent workflows",
    techs: [
      { label: "pgvector", Icon: Database },
      { label: "BM25", Icon: RefreshCw },
      { label: "LangGraph", Icon: Network },
      { label: "MCP", Icon: Server },
      { label: "Structured Outputs", Icon: Binary },
    ],
  },
  {
    index: "03",
    title: "Languages",
    descriptor: "Programming Foundations",
    depth: "Core engineering logic in high-level and system languages",
    techs: [
      { label: "Python", Icon: Code2 },
      { label: "Java 11/17", Icon: Coffee },
      { label: "TypeScript", Icon: FileType },
      { label: "JavaScript", Icon: Binary },
      { label: "SQL", Icon: Cpu },
    ],
  },
  {
    index: "04",
    title: "Data & Storage",
    descriptor: "Caching & Query Optimization",
    depth: "Schema design and transactional synchronization at scale",
    techs: [
      { label: "PostgreSQL", Icon: Layout },
      { label: "pgvector", Icon: Database },
      { label: "Redis", Icon: Clock },
      { label: "MongoDB", Icon: BarChart2 },
      { label: "SQL", Icon: Cpu },
    ],
  },
  {
    index: "05",
    title: "DevOps & Quality",
    descriptor: "Deployment, Orchestration & Reliability",
    depth: "CI/CD pipelines with Docker, Kubernetes, and AWS infrastructure",
    techs: [
      { label: "Docker", Icon: Container },
      { label: "Kubernetes", Icon: Boxes },
      { label: "AWS", Icon: Cloud },
      { label: "Jenkins", Icon: GitBranch },
      { label: "Resilience4j", Icon: Shield },
    ],
  },
] as const;
