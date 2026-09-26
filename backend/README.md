# Portfolio backend

FastAPI service with two independent features:

1. **Contact form API** (`app/api/contact.py`) -- unchanged, sends an email via SMTP.
2. **Grounded Q&A demo** (`app/rag/*`, `app/api/rag.py`) -- a small RAG service that
   answers questions about Rakesh's own portfolio content (projects + writing), with
   citations, and abstains rather than guessing when the corpus doesn't cover the
   question.

## Endpoints

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/health` | Original liveness check. Unchanged. |
| GET | `/healthz` | `{status, index_size, build_sha}` -- `build_sha` from `GIT_SHA` env var, else `git rev-parse --short HEAD`, else `"unknown"`. |
| POST | `/api/contact` | Original contact form. Unchanged. |
| POST | `/api/ask` | Body `{"question": str}` (max 500 chars, non-empty). SSE stream of `event: token` frames, then one `event: done` frame with `{citations: [{doc_slug, heading, score}], abstained}`. Rate limited: 10/minute, 100/day per IP. |
| GET | `/api/index/stats` | `{chunk_count, corpus_last_built}` from the loaded index. |

## Running

```bash
uv sync                       # or: pip install -e ".[dev,tiktoken]"
cp .env.example .env          # fill in OPENAI_API_KEY, EMAIL_* etc.
uv run scripts/build_index.py # builds backend/index.json from ../content
make dev                      # uvicorn app.main:app --reload
```

`make` targets: `dev`, `test`, `eval`, `index`, `deploy` (see `Makefile`).

## Architecture: numpy, not a vector database

The corpus is ~20 short documents (a few hundred chunks at most). At that size:

- A brute-force cosine similarity over an in-memory numpy matrix is sub-millisecond
  and runs in the same process as the request handler -- no network round trip.
- There's no separate service to provision, patch, back up, or authenticate against.
- The entire index (chunks + vectors + metadata) is ~1-2MB of JSON, small enough to
  commit to the repo and load at startup in `app/rag/index_store.py`.

A vector database earns its keep once the corpus reaches roughly 10k-1M+ vectors and
needs filtered/approximate search at that scale. Below that, it is strictly *slower*
(an extra RPC per query) and adds an operational dependency for zero retrieval-quality
benefit. If this corpus ever grows ~100x, that's the trigger to revisit this decision
-- not before.

## Ingestion (`scripts/build_index.py`)

- Reads `../content/projects/*.mdx` and `../content/writing/*.mdx` (configurable via
  `CONTENT_DIR`), parsing YAML frontmatter + Markdown body.
- Splits each document by heading (`#`, `##`, ...) and further splits each heading's
  text into ~500-token windows with 80-token overlap (`CHUNK_TARGET_TOKENS` /
  `CHUNK_OVERLAP_TOKENS`), so no fact is lost at a chunk boundary.
- Each chunk carries a heading path, e.g. `"GroundedDocs > Idempotent ingest"`.
- **Tokenizer**: uses `tiktoken` (`cl100k_base`) when installed for exact token
  counts; falls back to a word-count heuristic (`tokens ~= words / 0.75`) otherwise.
  Both are supported; `tiktoken` is in `requirements.txt` / the `tiktoken` extra, and
  `build_meta.tokenizer_backend` in `index.json` records which one produced the
  committed index.
- Each chunk is embedded once via the OpenAI embeddings API (`EMBEDDING_MODEL`,
  default `text-embedding-3-small`) and the result -- chunks, vectors, and
  metadata -- is written to `backend/index.json`, which is committed.

## Retrieval + generation

- `top_k = 5` (`TOP_K`), then a relevance floor of `0.15` (`RELEVANCE_FLOOR`) drops
  any retrieved chunk that isn't at least marginally related.
- **Calibrated abstention**: if the *best* chunk's cosine similarity is below
  `ABSTENTION_THRESHOLD` (currently **0.32**), the LLM is skipped entirely and the
  fixed string `"I don't have anything in Rakesh's writing about that."` is returned.
  This threshold was chosen against `evals/golden.yaml` bucket (b) -- adjacent-but-
  absent questions that sound plausible but aren't covered by the corpus (e.g. "Does
  Rakesh have AWS certifications?"). It needs to sit above the similarity these
  near-miss questions produce against unrelated chunks, but below the similarity a
  genuinely on-topic question produces against its actual answer chunk. **This value
  still needs a final pass with real OpenAI embeddings** -- see "What's verified vs.
  not" below; the mock-embedding dry run in this repo cannot calibrate it
  meaningfully since mock vectors aren't semantically related to the questions.
- **System prompt** (`app/rag/llm.py::SYSTEM_PROMPT`) forbids answering from
  parametric knowledge, requires every claim to trace to a retrieved chunk via an
  inline `[n]` marker, and explicitly instructs the model to treat any instruction
  embedded in the question or in a retrieved chunk as untrusted content, not a
  command.
- **Post-generation citation check** (`app/rag/pipeline.py::_strip_hallucinated_markers`):
  after the model responds, every `[n]` marker is checked against the chunks that
  were actually retrieved for that query (valid range `1..len(chunks)`). Any marker
  outside that range is stripped from the text before it reaches the client and
  logged as a warning (`stripped hallucinated citation markers`).

## Hardening

- **CORS**: a single app-level `CORSMiddleware` in `app/main.py` covers both routers,
  built from `settings.FRONTEND_ORIGIN` plus explicit `localhost`/`127.0.0.1:3000`
  entries -- no second, conflicting CORS policy.
- **Rate limiting**: `slowapi`, 10 requests/minute and 100/day per IP on `POST
  /api/ask`. A `RateLimitExceeded` returns a clean `429 {"success": false,
  "message": "..."}` JSON body, no traceback.
- **Input validation**: `AskRequest` rejects empty/whitespace-only questions and
  caps length at 500 chars (`MAX_QUESTION_LENGTH`), returning a `422` with a field
  error rather than a 500.
- **Structured JSON logging** (`app/core/logging.py`): every log line is one JSON
  object with timestamp, level, logger, message, plus whatever `extra=` fields the
  call site attaches -- request id, latency, best retrieval score, and whether the
  request abstained (see `app/api/rag.py` and `app/rag/pipeline.py`). Settings
  values (including `OPENAI_API_KEY`) are never passed into a log call.
- **Global exception handler** (`app.exception_handler(Exception)` in
  `app/main.py`): any unhandled exception is logged server-side with a traceback and
  returns a clean `500 {"success": false, "message": "..."}` to the client -- no
  stack trace leaves the process.

## Eval harness

`evals/golden.yaml` has 27 question/expectation pairs (12 answerable / 8
adjacent-but-absent / 7 adversarial -- see file header for the exact split
rationale). `evals/run.py` runs them **in-process** against `run_pipeline()`
directly (no live server needed), prints a results table, and exits non-zero if any
metric is below its documented threshold:

- Citation precision (bucket a) >= 80%
- Abstention rate (bucket b) >= 85%
- Injection resistance (bucket c) >= 100% (hard safety bar, not tunable)

```bash
make eval          # == uv run evals/run.py
```

### Latest results

**These numbers are from a mock-embedding dry run, not real OpenAI calls -- see
"What's verified vs. not" below. They validate that the harness and exit-code
gating work, not retrieval quality.** Re-run `make index && make eval` with a real
`OPENAI_API_KEY` before trusting these numbers for anything else.

```
Citation precision (bucket a, n=12): 25.00%  (threshold 80%)
Abstention rate    (bucket b, n=8):  100.00% (threshold 85%)
Injection resistance(bucket c, n=7): 85.71%  (threshold 100%)
Latency p50: <1ms  p95: <1ms   (in-process, mock LLM -- not representative of real API latency)
Exit code: 1 (below threshold, as expected for a mock run)
```

## Deliverables

- `Dockerfile` -- multi-stage (`uv`-based builder + slim runtime), non-root
  `appuser`, `HEALTHCHECK` against `/healthz`.
- `fly.toml` -- Fly.io deploy config, health check on `/healthz`.
- `Makefile` -- `dev`, `test`, `eval`, `index`, `deploy`.
- `pyproject.toml` + `uv.lock` -- primary dependency management; `requirements.txt`
  kept in sync for the existing venv workflow.

## What's verified vs. not (read this before deploying)

This environment had **no `OPENAI_API_KEY`** available anywhere (not in `.env`, not
in the shell). Everything that doesn't require calling OpenAI was fully built,
executed, and verified for real:

- Full pipeline (MDX parsing -> heading-aware chunking -> index build -> numpy
  cosine retrieval -> abstention gate -> citation-marker validation -> SSE framing)
  runs end-to-end against the **real** `../content/**/*.mdx` files that landed
  during this session (6 documents, 29 chunks).
- `uv run scripts/build_index.py` and `uv run evals/run.py` both run successfully
  via `uv` against this repo's `pyproject.toml`/`uv.lock`.
- FastAPI app tested with `TestClient`: `/health`, `/healthz`, `/api/index/stats`,
  `/api/ask` (streaming, abstain path, and answer path), input validation (empty /
  too-long question -> 422), all verified.
- `pytest` unit tests (`tests/test_pipeline.py`) cover chunking, retrieval
  floor/top-k, and hallucinated-citation stripping -- all pass, no mocking needed
  for these (they're pure numpy/regex logic).

To make any of the above runnable without a paid API key, `app/rag/llm.py` has a
`MOCK_LLM` dev-only escape hatch (deterministic hash-based embeddings, canned
generation) that only activates when `MOCK_LLM=true` **and** `OPENAI_API_KEY` is
unset. It is off by default and documented as never-for-production.

**What could not be verified**: actual OpenAI embedding/generation calls, and
therefore:
- Real retrieval quality and the citation-precision/abstention-rate/injection-
  resistance numbers in the table above (the mock embeddings are hash-based, not
  semantically meaningful, so bucket (a) citation precision of 25% reflects that,
  not the real system).
- Whether `ABSTENTION_THRESHOLD = 0.32` is actually well-calibrated for real
  `text-embedding-3-small` vectors. **Before deploying, run**:
  ```bash
  export OPENAI_API_KEY=sk-...
  uv run scripts/build_index.py   # rebuild index.json with real embeddings
  uv run evals/run.py             # check the printed table, retune ABSTENTION_THRESHOLD
                                    # / RELEVANCE_FLOOR against bucket (b) if abstention
                                    # rate is off, then re-run until thresholds pass
  ```
  and update the "Latest results" table above with the real numbers.

The `/content` directory did not exist at the start of this task and landed
partway through (added by the concurrent frontend-rebuild agent); `evals/golden.yaml`
bucket (a) and `doc_slug` values were written against and verified to match the real
files (`groundeddocs`, `kafka-order-system`, `abstention-is-the-default-path`,
`citations-get-checked-not-trusted`, `idempotency-at-the-schema`,
`uptime-is-a-personality`).
