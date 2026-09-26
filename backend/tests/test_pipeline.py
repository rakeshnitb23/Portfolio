"""Fast, offline tests for chunking, retrieval and the citation-check logic.

These use app.rag directly (no network, no FastAPI) so they run without an
OPENAI_API_KEY. End-to-end behavior against real embeddings/generation is
covered by evals/run.py against a real index.json instead.
"""

import numpy as np

from app.rag.chunking import Chunk, chunk_document, parse_mdx
from app.rag.index_store import IndexData
from app.rag.pipeline import _strip_hallucinated_markers
from app.rag.retrieval import search


def test_strip_hallucinated_markers_removes_out_of_range():
    text = "Rakesh built X [1] and Y [9]."
    cleaned, bad = _strip_hallucinated_markers(text, n_chunks=2)
    assert "[9]" not in cleaned
    assert "[1]" in cleaned
    assert bad == [9]


def test_strip_hallucinated_markers_keeps_all_valid():
    text = "A [1] B [2] C [1]."
    cleaned, bad = _strip_hallucinated_markers(text, n_chunks=2)
    assert cleaned == text
    assert bad == []


def test_search_respects_relevance_floor_and_top_k():
    vectors = np.array(
        [
            [1.0, 0.0],
            [0.9, 0.1],
            [0.0, 1.0],
        ],
        dtype=np.float32,
    )
    norms = np.linalg.norm(vectors, axis=1, keepdims=True)
    vectors = vectors / norms
    chunks = [
        {"chunk_id": "a:0", "doc_slug": "a", "heading": "A"},
        {"chunk_id": "a:1", "doc_slug": "a", "heading": "A2"},
        {"chunk_id": "b:0", "doc_slug": "b", "heading": "B"},
    ]
    index = IndexData(chunks=chunks, vectors=vectors, meta={})

    results = search([1.0, 0.0], index, top_k=5, relevance_floor=0.5)
    assert len(results) == 2
    assert results[0]["doc_slug"] == "a"

    results_high_floor = search([1.0, 0.0], index, top_k=5, relevance_floor=0.999)
    assert len(results_high_floor) == 1


def test_chunk_document_preserves_heading_path(tmp_path):
    mdx = tmp_path / "example.mdx"
    mdx.write_text(
        "---\ntitle: Example\n---\n\n## Section One\n\nSome content here about testing chunking behavior.\n",
        encoding="utf-8",
    )
    doc = parse_mdx(mdx, "project")
    chunks = chunk_document(doc, target_tokens=500, overlap_tokens=80)
    assert len(chunks) == 1
    assert chunks[0].heading == "Example > Section One"
    assert "testing chunking" in chunks[0].text
