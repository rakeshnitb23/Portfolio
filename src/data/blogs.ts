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
    title: "Shipping AI Agents to Production: Eval Gates, Smoke Evals, and What to Do on a Bad Day",
    date: "2026-10-24",
    category: "AI Systems",
    tags: ["ai-agent", "evals", "deployment", "llm", "software-engineering"],
    summary:
      "One added prompt line — 'if a tool call fails, retry once' — passed the offline eval at 96%, then refunded 212 customers twice within 38 minutes, because the mocked refund tool answered in 50 ms and the real payments API timed out. The eval gate tests the version; a smoke eval tests the environment.",
    href: "https://www.linkedin.com/pulse/shipping-ai-agents-production-eval-gates-smoke-evals-what-singh--8isuc/",
    sources: [
      { name: "LinkedIn", href: "https://www.linkedin.com/pulse/shipping-ai-agents-production-eval-gates-smoke-evals-what-singh--8isuc/" },
      { name: "Medium", href: "https://medium.com/@rakeshnitb23/our-eval-gate-passed-212-customers-got-refunded-twice-c38317379fca" },
      { name: "dev.to", href: "https://dev.to/rakesh_kumar_04012c337851/our-ai-agent-passed-its-eval-then-it-refunded-212-customers-twice-2ija" },
    ],
  },
  {
    title: "Your AI Agent Just Showed Customer A's Orders to Customer B",
    date: "2026-10-10",
    category: "AI Systems",
    tags: ["ai-agent", "security", "rag", "prompt-injection", "software-engineering"],
    summary:
      "A verified login doesn't stop an agent from leaking another customer's data — the leak happens after login, when a customer ID gets typed into the prompt and the model fills a tool parameter with it. A system prompt saying 'only show this customer's orders' is a request, not a permission check; the fix belongs in code, not the prompt.",
    href: "https://www.linkedin.com/pulse/your-ai-agent-just-showed-customer-orders-b-rakesh-singh--bhmfc/",
    sources: [
      { name: "LinkedIn", href: "https://www.linkedin.com/pulse/your-ai-agent-just-showed-customer-orders-b-rakesh-singh--bhmfc/" },
      { name: "Medium", href: "https://medium.com/@rakeshnitb23/your-ai-agents-access-control-has-a-success-rate-e1ce664874d4" },
      { name: "dev.to", href: "https://dev.to/rakesh_kumar_04012c337851/your-system-prompt-is-not-access-control-keep-user-ids-in-state-1e03" },
    ],
  },
  {
    title: "Your AI Agent Just Charged the Customer Twice. Here Is Why.",
    date: "2026-10-09",
    category: "AI Systems",
    tags: ["ai-agent", "idempotency", "retries", "rag", "software-engineering"],
    summary:
      "Duplicate actions in AI agents usually come from retries, not bad code — the HTTP client, the orchestrator, the model's own re-attempt, and a resumed run after a crash can each multiply the same action. A content hash and stable chunk IDs stopped a RAG indexer from double-writing; seven rules for preventing duplicates follow.",
    href: "https://www.linkedin.com/pulse/your-ai-agent-just-charged-customer-twice-here-why-rakesh-singh--sipbc/",
    sources: [
      { name: "LinkedIn", href: "https://www.linkedin.com/pulse/your-ai-agent-just-charged-customer-twice-here-why-rakesh-singh--sipbc/" },
      { name: "Medium", href: "https://medium.com/@rakeshnitb23/your-agent-isnt-flaky-it-has-four-retry-layers-8688df946884" },
      { name: "dev.to", href: "https://dev.to/rakesh_kumar_04012c337851/your-ai-agent-sent-that-email-twice-heres-the-idempotency-fix-3hli" },
    ],
  },
  {
    title: "You Probably Have a Context Problem, Not an Agent-Count Problem",
    date: "2026-10-08",
    category: "AI Systems",
    tags: ["rag", "ai-agent", "context-engineering", "multi-agent", "software-engineering"],
    summary:
      "Before adding more agents to a RAG system, check whether the evidence for a failed answer was even in the model's context — if not, a second agent can't fix it, because the model needed the missing evidence, not collaborators. Multi-agent systems can burn roughly 15x the tokens of a single chat.",
    href: "https://www.linkedin.com/pulse/you-probably-have-context-problem-agent-count-rakesh-singh--hvhyc/",
    sources: [
      { name: "LinkedIn", href: "https://www.linkedin.com/pulse/you-probably-have-context-problem-agent-count-rakesh-singh--hvhyc/" },
      { name: "Medium", href: "https://medium.com/@rakeshnitb23/its-probably-a-context-problem-not-an-agent-count-problem-572316d4901e" },
      { name: "dev.to", href: "https://dev.to/rakesh_kumar_04012c337851/my-rag-system-didnt-need-more-agents-it-never-saw-the-evidence-59n1" },
    ],
  },
  {
    title: "Rate Limiting an Agentic System with Redis: Count Tokens, Not Requests",
    date: "2026-10-07",
    category: "AI Systems",
    tags: ["redis", "rate-limiting", "ai-agent", "llm", "software-engineering"],
    summary:
      "Request-count limits don't track cost: a one-line question and a multi-step agent run both count as one request. Two Redis counters — tokens per minute for capacity, cost per day for budget — with estimate, reserve, reconcile, plus per-run agent budgets so retries and sub-agents draw from the same cap.",
    href: "https://www.linkedin.com/pulse/rate-limiting-agentic-system-redis-count-tokens-requests-singh--iuzwc/",
    sources: [
      { name: "LinkedIn", href: "https://www.linkedin.com/pulse/rate-limiting-agentic-system-redis-count-tokens-requests-singh--iuzwc/" },
      { name: "Medium", href: "https://medium.com/@rakeshnitb23/rate-limit-an-llm-agent-by-tokens-not-requests-9f515c2b16e7" },
      { name: "dev.to", href: "https://dev.to/rakesh_kumar_04012c337851/a-request-limit-cannot-cap-your-llm-bill-reserve-tokens-in-redis-3719" },
    ],
  },
  {
    title: "When a Redis Cache Hit Is the Wrong Answer",
    date: "2026-10-03",
    category: "AI Systems",
    tags: ["redis", "caching", "ai-agent", "llm", "software-engineering"],
    summary:
      "Three caches in front of an LLM agent, what goes in each key, and the five cases where a saved answer must not be returned.",
    href: "https://www.linkedin.com/pulse/how-i-use-redis-cache-agentic-system-three-caches-when-rakesh-singh--bt2yc/",
    sources: [
      { name: "LinkedIn", href: "https://www.linkedin.com/pulse/how-i-use-redis-cache-agentic-system-three-caches-when-rakesh-singh--bt2yc/" },
      { name: "Medium", href: "https://medium.com/@rakeshnitb23/when-a-redis-cache-hit-is-the-wrong-answer-bb43e44c8b58" },
      { name: "dev.to", href: "https://dev.to/rakesh_kumar_04012c337851/my-agent-paid-twice-for-the-same-question-the-fix-was-a-redis-key-3hcl" },
    ],
  },
  // Build guides: the Hashnode editions, written as step-by-step how-tos.
  {
    title: "Eval gate passed, production broke: add a smoke eval to agent deploys",
    date: "2026-10-26",
    category: "Build Guides",
    tags: ["ai-agent", "evals", "deployment", "idempotency"],
    kind: "guide",
    summary:
      "An eval gate checks whether the version is good; a smoke eval checks whether the environment works right now. A 20-case, 3-minute check against real dependencies stops a bad rollout at 5% traffic.",
    steps: [
      "Write the gate down before the results come in",
      "Take retries out of the prompt",
      "Write the smoke eval",
      "Run it after every rollout step",
    ],
    href: "https://grounded-engineering.hashnode.dev/eval-gate-passed-production-broke-add-a-smoke-eval-to-agent-deploys",
    sources: [
      { name: "Hashnode", href: "https://grounded-engineering.hashnode.dev/eval-gate-passed-production-broke-add-a-smoke-eval-to-agent-deploys" },
    ],
  },
  {
    title: "Authorise AI agent tool calls from the JWT, not the prompt",
    date: "2026-10-14",
    category: "Build Guides",
    tags: ["ai-agent", "security", "jwt", "authorisation"],
    kind: "guide",
    summary:
      "The JWT was valid and the model still picked the customer ID. Freeze identity into run context so a fooled model can’t reach the wrong data.",
    steps: [
      "Verify the JWT once and freeze identity into run context",
      "Read the identity inside the tool, never from tool arguments",
      "Scope the query in the data layer and fail closed",
      "Treat retrieved text as data, not instructions",
      "Audit every tool call, then attack it",
    ],
    href: "https://grounded-engineering.hashnode.dev/authorise-ai-agent-tool-calls-from-the-jwt-not-the-prompt",
    sources: [
      { name: "Hashnode", href: "https://grounded-engineering.hashnode.dev/authorise-ai-agent-tool-calls-from-the-jwt-not-the-prompt" },
    ],
  },
  {
    title: "Idempotent tool calls: stop your AI agent from charging twice",
    date: "2026-10-10",
    category: "Build Guides",
    tags: ["ai-agent", "idempotency", "retries", "llm"],
    kind: "guide",
    summary:
      "Retries come from four layers and can multiply into many runs of one action. Seven rules make a dangerous tool call happen exactly once.",
    steps: [
      "Sort every tool into three groups",
      "Let one layer own retries",
      "Give every dangerous write an idempotency key",
      "Record the key and the result",
      "Return the first result as a success",
      "After a timeout, look before you retry",
      "Put a gate on what cannot be undone",
    ],
    href: "https://grounded-engineering.hashnode.dev/idempotent-tool-calls-stop-your-ai-agent-from-charging-twice",
    sources: [
      { name: "Hashnode", href: "https://grounded-engineering.hashnode.dev/idempotent-tool-calls-stop-your-ai-agent-from-charging-twice" },
    ],
  },
  {
    title: "Single agent vs multi-agent: check the context before you split",
    date: "2026-10-08",
    category: "Build Guides",
    tags: ["ai-agent", "multi-agent", "context-engineering", "rag"],
    kind: "guide",
    summary:
      "A second agent buys a context window, not intelligence. Check whether the evidence reached the model before you add agents.",
    steps: [
      "Pull your failed runs",
      "Check whether the evidence arrived",
      "Give every failure a label",
      "Pick the cheapest shape that works",
    ],
    href: "https://grounded-engineering.hashnode.dev/single-agent-vs-multi-agent-check-the-context-before-you-split",
    sources: [
      { name: "Hashnode", href: "https://grounded-engineering.hashnode.dev/single-agent-vs-multi-agent-check-the-context-before-you-split" },
    ],
  },
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
