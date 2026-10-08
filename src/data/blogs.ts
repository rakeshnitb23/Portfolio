export interface BlogPost {
  /** Title shown in the archive list. */
  title: string;
  /** Publish date as YYYY-MM-DD. Sets the year group and the sort order. */
  date: string;
  /** Primary category. Each distinct value becomes a filter pill on /blogs. */
  category: string;
  /** Topic tags, rendered as #tag under the title. */
  tags: string[];
  /** A short overview shown under the title. Leave it out to show only the title. */
  summary?: string;
  /** Platforms the post is published on. Each adds a "Read on <name>" link under the overview. */
  sources?: { name: string; href: string }[];
  /** "guide" marks a hands-on build guide: the overview shows as a TL;DR and `steps` as a numbered outline. */
  kind?: "guide";
  /** A build guide's steps, in order. */
  steps?: string[];
  /**
   * The post's main URL. Titles are plain text (readers use the "Read on …"
   * links); an href marks the entry as a real post rather than a placeholder,
   * which site search relies on. Leave it out while the entry is a placeholder.
   */
  href?: string;
}

// Placeholder entries for /blogs. When a post is ready, overwrite one entry's
// title, date, category, and tags and add its href. Year groups, counts, and
// filter pills are all derived from this list, so nothing else needs editing.
export const BLOGS: BlogPost[] = [
  // 2026
  {
    title: "Rate Limit an LLM Agent by Tokens, Not Requests",
    date: "2026-10-03",
    category: "AI Systems",
    tags: ["ai-agent", "redis", "llm", "rate-limiting", "software-engineering"],
    summary:
      "Counting requests can't control LLM spend: one request may be a one-line question or an agent run making a dozen model calls. Limit by tokens instead — estimate, reserve atomically in a shared Redis counter, then reconcile with actual usage. Also covers token buckets vs. window quotas and per-run agent budgets.",
    href: "https://medium.com/@rakeshnitb23/rate-limit-an-llm-agent-by-tokens-not-requests-9f515c2b16e7",
    sources: [
      { name: "Medium", href: "https://medium.com/@rakeshnitb23/rate-limit-an-llm-agent-by-tokens-not-requests-9f515c2b16e7" },
      { name: "DEV", href: "https://dev.to/rakesh_kumar_04012c337851/a-request-limit-cannot-cap-your-llm-bill-reserve-tokens-in-redis-3719" },
      { name: "LinkedIn", href: "https://www.linkedin.com/posts/rakeshnitb23_redis-ratelimiting-aiagents-ugcPost-7512063784803295232-fYcV/" },
    ],
  },
  {
    title: "When a Redis Cache Hit Is the Wrong Answer",
    date: "2026-10-03",
    category: "AI Systems",
    tags: ["llm", "caching", "redis", "ai-agent", "software-engineering"],
    summary:
      "Cache-aside breaks in front of an LLM agent: a question has no fixed key, rebuilding an answer means paying the model again, and answers depend on document version and permissions. Three Redis caches — exact match, semantic, and tool results — and why a semantic hit for timer T3410 must never answer T3411.",
    href: "https://medium.com/@rakeshnitb23/when-a-redis-cache-hit-is-the-wrong-answer-bb43e44c8b58",
    sources: [
      { name: "Medium", href: "https://medium.com/@rakeshnitb23/when-a-redis-cache-hit-is-the-wrong-answer-bb43e44c8b58" },
      { name: "DEV", href: "https://dev.to/rakesh_kumar_04012c337851/my-agent-paid-twice-for-the-same-question-the-fix-was-a-redis-key-3hcl" },
      { name: "LinkedIn", href: "https://www.linkedin.com/posts/rakeshnitb23_redis-aiengineering-aiagents-ugcPost-7512055590614036480-D8eZ/" },
    ],
  },
  {
    title: "Multi-Tenant RAG Leaks Through the Search, Not the Login",
    date: "2026-10-01",
    category: "AI Systems",
    tags: ["llm", "postgresql", "multitenancy", "security", "rag"],
    summary:
      "In a shared RAG pipeline the login is the easy part; leaks happen in the search. The rule: a client may select a workspace but never assert one. Four checkpoints — entry, retrieval, prompt, and proof — keep the workspace inside every SQL and vector query, backed by a 30+ attack suite that passes only when nothing leaks.",
    href: "https://medium.com/@rakeshnitb23/multi-tenant-rag-leaks-through-the-search-not-the-login-a24566eea45d",
    sources: [
      { name: "Medium", href: "https://medium.com/@rakeshnitb23/multi-tenant-rag-leaks-through-the-search-not-the-login-a24566eea45d" },
      { name: "DEV", href: "https://dev.to/rakesh_kumar_04012c337851/first-person-failure-plus-an-ordered-n-the-4-checkpoints-in-pipeline-order-53f2" },
      { name: "LinkedIn", href: "https://www.linkedin.com/posts/rakeshnitb23_my-rag-pipelines-first-design-trusted-one-ugcPost-7511372564858884096-kkFL/" },
    ],
  },
  {
    title: "My RAG API Never Signs Tokens or Sees Passwords",
    date: "2026-09-30",
    category: "AI Systems",
    tags: ["api-security", "llm", "authentication", "rag", "software-architecture"],
    summary:
      "If an attacker stole everything inside your API, who could they become? With an identity provider issuing tokens and the API only verifying them, the answer is no one. Four questions for RAG auth — including two attackers most designs forget: the model and the documents — and why every failure should close the door.",
    href: "https://medium.com/@rakeshnitb23/my-rag-api-never-signs-tokens-or-sees-passwords-24d1996fd504",
    sources: [
      { name: "Medium", href: "https://medium.com/@rakeshnitb23/my-rag-api-never-signs-tokens-or-sees-passwords-24d1996fd504" },
      { name: "DEV", href: "https://dev.to/rakesh_kumar_04012c337851/my-rag-api-never-signs-tokens-or-sees-passwords-1p4e" },
      { name: "LinkedIn", href: "https://www.linkedin.com/posts/rakeshnitb23_steal-my-rag-apis-config-and-database-and-ugcPost-7511365807994515457-btD8/" },
    ],
  },
  // Build guides: the Hashnode editions, written as step-by-step how-tos.
  {
    title: "Rate limit LLM tokens with Redis when the cost arrives after the call",
    date: "2026-10-03",
    category: "Build Guides",
    tags: ["redis", "rate-limiting", "llm", "ai-agent"],
    kind: "guide",
    summary:
      "A token limit is a reservation: reserve an estimate before the model call, correct it after, and give every agent run its own budget.",
    steps: [
      "Decide what each counter protects",
      "Estimate before the call",
      "Reserve in one atomic script",
      "Call the model, then reconcile",
      "Give every agent run its own budget",
      "Tell the caller which limit it hit",
    ],
    href: "https://grounded-engineering.hashnode.dev/rate-limit-llm-tokens-with-redis-when-the-cost-arrives-after-the-call",
    sources: [
      { name: "Hashnode", href: "https://grounded-engineering.hashnode.dev/rate-limit-llm-tokens-with-redis-when-the-cost-arrives-after-the-call" },
    ],
  },
  {
    title: "How to cache an LLM agent with Redis without serving wrong answers",
    date: "2026-10-02",
    category: "Build Guides",
    tags: ["redis", "caching", "llm", "ai-agent"],
    kind: "guide",
    summary:
      "Put three caches in Redis and check them in order of cost — exact match, semantic, then tool results inside the agent loop — and know the cases where a hit must be treated as a miss.",
    steps: [
      "Check in order of cost",
      "Add the exact-match cache",
      "Add the semantic cache, with an identifier check",
      "Add the tool-result cache inside the agent loop",
      "Re-check authorisation on every hit",
      "Invalidate by version",
      "Fail open when Redis is down",
      "Leave prefix caching to the model provider",
    ],
    href: "https://grounded-engineering.hashnode.dev/how-to-cache-an-llm-agent-with-redis-without-serving-wrong-answers",
    sources: [
      { name: "Hashnode", href: "https://grounded-engineering.hashnode.dev/how-to-cache-an-llm-agent-with-redis-without-serving-wrong-answers" },
    ],
  },
  {
    title: "Multi-Tenant RAG Leaks Through the Search, Not the Login",
    date: "2026-10-01",
    category: "Build Guides",
    tags: ["rag", "multitenancy", "postgresql", "security"],
    kind: "guide",
    summary:
      "One pipeline, many users: the client may select a workspace but never assert one. Four checkpoints keep every answer inside the asker’s own documents.",
    steps: [
      "The server decides the workspace on every request",
      "Every path to the data carries the limit",
      "Document text never makes an access decision",
      "Prove it with refusal tests and an audit trail",
    ],
    href: "https://grounded-engineering.hashnode.dev/multi-tenant-rag-leaks-through-the-search-not-the-login",
    sources: [
      { name: "Hashnode", href: "https://grounded-engineering.hashnode.dev/multi-tenant-rag-leaks-through-the-search-not-the-login" },
    ],
  },
  {
    title: "Secure a RAG API without minting tokens or storing passwords",
    date: "2026-09-30",
    category: "Build Guides",
    tags: ["rag", "api-security", "authentication", "jwks"],
    kind: "guide",
    summary:
      "Let an identity provider (Keycloak, Okta, Cognito) issue tokens; the RAG API only verifies them, locally, against cached public keys.",
    steps: [
      "The config holds nothing that signs",
      "Verify locally, then check membership",
      "The route and every tool take identity from the principal",
    ],
    href: "https://grounded-engineering.hashnode.dev/secure-a-rag-api-without-minting-tokens-or-storing-passwords",
    sources: [
      { name: "Hashnode", href: "https://grounded-engineering.hashnode.dev/secure-a-rag-api-without-minting-tokens-or-storing-passwords" },
    ],
  },

  // 2025
  { title: "Placeholder Post 09", date: "2025-12-09", category: "Databases", tags: ["databases", "indexing"] },
  { title: "Placeholder Post 10", date: "2025-11-04", category: "Career Growth", tags: ["career-growth"] },
  { title: "Placeholder Post 11", date: "2025-10-01", category: "Distributed Systems", tags: ["distributed-systems", "kafka"] },
  { title: "Placeholder Post 12", date: "2025-08-26", category: "AI Systems", tags: ["ai-systems", "rag"] },
  { title: "Placeholder Post 13", date: "2025-07-15", category: "Backend Engineering", tags: ["backend", "spring-boot"] },
  { title: "Placeholder Post 14", date: "2025-05-27", category: "Databases", tags: ["databases", "postgres"] },
  { title: "Placeholder Post 15", date: "2025-04-08", category: "Career Growth", tags: ["career-growth"] },
  { title: "Placeholder Post 16", date: "2025-02-18", category: "Distributed Systems", tags: ["distributed-systems", "consistency"] },

  // 2024
  { title: "Placeholder Post 17", date: "2024-12-03", category: "AI Systems", tags: ["ai-systems", "llm"] },
  { title: "Placeholder Post 18", date: "2024-10-15", category: "Backend Engineering", tags: ["backend", "microservices"] },
  { title: "Placeholder Post 19", date: "2024-08-06", category: "Databases", tags: ["databases", "indexing"] },
  { title: "Placeholder Post 20", date: "2024-06-11", category: "Career Growth", tags: ["career-growth"] },
  { title: "Placeholder Post 21", date: "2024-04-02", category: "Distributed Systems", tags: ["distributed-systems", "kafka"] },
  { title: "Placeholder Post 22", date: "2024-01-23", category: "AI Systems", tags: ["ai-systems", "rag"] },
];
