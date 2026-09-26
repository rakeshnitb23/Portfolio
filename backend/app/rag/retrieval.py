"""Cosine-similarity retrieval over the in-memory index."""

from __future__ import annotations

import numpy as np

from app.rag.index_store import IndexData


def search(query_vector: list[float], index: IndexData, top_k: int, relevance_floor: float) -> list[dict]:
    """Return up to top_k chunks above relevance_floor, sorted by score desc.

    Each returned dict is the chunk metadata plus a "score" key (cosine
    similarity in [-1, 1], typically [0, 1] for normalized text embeddings).
    """
    if index.chunk_count == 0:
        return []

    q = np.array(query_vector, dtype=np.float32)
    qn = np.linalg.norm(q)
    if qn > 0:
        q = q / qn

    scores = index.vectors @ q  # (n_chunks,)
    order = np.argsort(-scores)[:top_k]

    results = []
    for idx in order:
        score = float(scores[idx])
        if score < relevance_floor:
            continue
        chunk = dict(index.chunks[int(idx)])
        chunk["score"] = score
        results.append(chunk)
    return results


def best_score(query_vector: list[float], index: IndexData) -> float:
    if index.chunk_count == 0:
        return -1.0
    q = np.array(query_vector, dtype=np.float32)
    qn = np.linalg.norm(q)
    if qn > 0:
        q = q / qn
    scores = index.vectors @ q
    return float(np.max(scores))
