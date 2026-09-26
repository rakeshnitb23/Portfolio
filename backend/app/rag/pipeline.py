"""Retrieval + generation pipeline shared by the /api/ask endpoint and evals.

Kept as plain functions (no FastAPI/SSE concerns here) so evals/run.py can
call run_pipeline() in-process, without needing a live server.
"""

from __future__ import annotations

import logging
import re
import time
from dataclasses import dataclass, field

from app.core.config import settings
from app.rag import llm
from app.rag.index_store import IndexData
from app.rag.retrieval import best_score, search

logger = logging.getLogger("rag.pipeline")

ABSTENTION_MESSAGE = "I don't have anything in Rakesh's writing about that."

CITATION_MARKER_RE = re.compile(r"\[(\d+)\]")


@dataclass
class PipelineResult:
    answer: str
    citations: list[dict]
    abstained: bool
    best_score: float
    retrieved_chunks: list[dict] = field(default_factory=list)
    hallucinated_markers: list[int] = field(default_factory=list)
    latency_s: float = 0.0


def _strip_hallucinated_markers(text: str, n_chunks: int) -> tuple[str, list[int]]:
    """Remove any [n] marker that doesn't map to a chunk we actually retrieved.

    Valid markers are 1..n_chunks (the numbered list handed to the model in
    the prompt). Anything else -- a marker the model invented -- is stripped
    from the text before it reaches the client, and logged.
    """
    bad: list[int] = []

    def _replace(m: re.Match) -> str:
        n = int(m.group(1))
        if 1 <= n <= n_chunks:
            return m.group(0)
        bad.append(n)
        return ""

    cleaned = CITATION_MARKER_RE.sub(_replace, text)
    cleaned = re.sub(r"[ \t]{2,}", " ", cleaned).strip()
    return cleaned, bad


def run_pipeline(question: str, index: IndexData) -> PipelineResult:
    t0 = time.perf_counter()

    query_vec = llm.embed_texts([question])[0]
    top_score = best_score(query_vec, index)

    if top_score < settings.ABSTENTION_THRESHOLD:
        latency = time.perf_counter() - t0
        logger.info(
            "abstained",
            extra={"best_score": top_score, "abstained": True, "latency_s": latency},
        )
        return PipelineResult(
            answer=ABSTENTION_MESSAGE,
            citations=[],
            abstained=True,
            best_score=top_score,
            latency_s=latency,
        )

    chunks = search(query_vec, index, top_k=settings.TOP_K, relevance_floor=settings.RELEVANCE_FLOOR)
    if not chunks:
        latency = time.perf_counter() - t0
        return PipelineResult(
            answer=ABSTENTION_MESSAGE,
            citations=[],
            abstained=True,
            best_score=top_score,
            latency_s=latency,
        )

    raw_answer = "".join(llm.stream_chat(question, chunks))
    clean_answer, bad_markers = _strip_hallucinated_markers(raw_answer, len(chunks))
    if bad_markers:
        logger.warning(
            "stripped hallucinated citation markers",
            extra={"hallucinated_markers": bad_markers, "question": question},
        )

    # Only cite chunks whose marker actually survives in the cleaned answer.
    cited_indices = {int(n) for n in CITATION_MARKER_RE.findall(clean_answer)}
    citations = [
        {
            "doc_slug": c["doc_slug"],
            "heading": c["heading"],
            "score": c["score"],
            "marker": i,
        }
        for i, c in enumerate(chunks, start=1)
        if i in cited_indices
    ]
    # Fall back to all retrieved chunks as citations if the model emitted no markers at all,
    # so the client still gets sourcing even if the model forgot to cite inline.
    if not citations:
        citations = [
            {"doc_slug": c["doc_slug"], "heading": c["heading"], "score": c["score"], "marker": i}
            for i, c in enumerate(chunks, start=1)
        ]

    latency = time.perf_counter() - t0
    logger.info(
        "answered",
        extra={
            "best_score": top_score,
            "abstained": False,
            "latency_s": latency,
            "n_citations": len(citations),
            "n_hallucinated_stripped": len(bad_markers),
        },
    )

    return PipelineResult(
        answer=clean_answer,
        citations=citations,
        abstained=False,
        best_score=top_score,
        retrieved_chunks=chunks,
        hallucinated_markers=bad_markers,
        latency_s=latency,
    )
