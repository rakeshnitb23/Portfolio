export const NOTES = [
  {
    index: "01",
    cat: "Retrieval",
    date: "2026",
    title: "Citations Get Checked, Not Trusted",
    summary:
      "A citation is only as good as the validation behind it. GroundedDocs returns structured JSON with citation IDs, and every ID is checked against the retrieved chunk set before the answer is allowed to ship — an unvalidated citation is a defect, not a display detail.",
    expanded:
      "Structured answer-with-citations became the default path, not an add-on: the model returns citation IDs bound to retrieved chunks, and a validation pass rejects any answer whose citations don't resolve. Held on a frozen 40-question set (18 answerable / 11 partial / 11 unanswerable) so prompt or corpus changes can't quietly drift the pass rate.",
    meta: "Retrieval · Citations · Eval Gates",
  },
  {
    index: "02",
    cat: "Reliability",
    date: "2026",
    title: "Abstention Is the Default Path",
    summary:
      "A system that always answers is a system that sometimes lies with confidence. Calibrated abstention — knowing when evidence is insufficient and saying so — is treated as a first-class output, not a fallback for when retrieval fails.",
    expanded:
      "Hybrid retrieval (pgvector + BM25 + RRF, then cross-encoder rerank) is scoped by user and workspace from day one, so unscoped search is itself a defect. On top of that, abstention precision and recall are tracked as eval-gate metrics alongside retrieval quality and citation faithfulness — abstaining correctly is scored as rigorously as answering correctly.",
    meta: "Reliability · Retrieval · Security",
  },
  {
    index: "03",
    cat: "Operations",
    date: "2022–2026",
    title: "Uptime Is a Personality",
    summary:
      "Resilience4j across 15+ microservices took system uptime to 99.9% while processing 2 million daily transactions. Reliability at that scale isn't a single fix — it's circuit breakers, bulkheads, and retry policies applied consistently until failure becomes the exception instead of the norm.",
    expanded:
      "Every downstream call got a circuit breaker and a bounded retry policy, and PostgreSQL, MongoDB, and Redis were tuned in tandem — retrieval speed up 70%, infrastructure cost down 30%. The lesson: uptime is not a target you hit once, it's a property you keep re-earning every time a dependency degrades.",
    meta: "Operations · Java · Spring Boot",
  },
  {
    index: "04",
    cat: "Systems",
    date: "2025",
    title: "Idempotency at the Schema",
    summary:
      "Idempotency that lives only in application logic breaks the moment someone bypasses it. Content-hash based ingest and Kafka dead-letter queues push the guarantee down to the schema and the messaging layer, where it's much harder to accidentally violate.",
    expanded:
      "PDF ingest uses content hashing and stable chunk IDs, so a changed document re-indexes cleanly without duplicate vectors or stale citations. The Kafka order system applies the same principle to messaging: idempotent writes, retries, and a dead-letter queue mean a redelivered event can never double-apply — the guarantee is structural, not just a check someone remembered to write.",
    meta: "Systems · Kafka · Idempotency",
  },
];
