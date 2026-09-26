"""Loads the committed index.json into memory as a numpy matrix.

Why numpy in-process instead of a vector database: the corpus is ~20 source
documents (a few hundred chunks at most). A brute-force cosine similarity
over a numpy array of that size is sub-millisecond and runs in the same
process as the request -- no network hop, no separate service to deploy,
patch, or pay for. A vector DB earns its keep at 10k-1M+ vectors with
filtered/ANN search; below that it's strictly slower (extra RPC) and adds an
operational dependency (auth, backups, uptime) for no retrieval-quality
benefit. If the corpus grows by ~100x, this is the first thing to revisit.
"""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from pathlib import Path

import numpy as np

logger = logging.getLogger("rag.index")


@dataclass
class IndexData:
    chunks: list[dict]
    vectors: np.ndarray  # shape (n_chunks, dim), L2-normalized rows
    meta: dict

    @property
    def chunk_count(self) -> int:
        return len(self.chunks)


_EMPTY = IndexData(chunks=[], vectors=np.zeros((0, 0), dtype=np.float32), meta={})


def load_index(path: str | Path) -> IndexData:
    p = Path(path)
    if not p.exists():
        logger.warning("index file not found at %s; starting with an empty index", p)
        return _EMPTY

    with p.open("r", encoding="utf-8") as f:
        raw = json.load(f)

    chunks = raw.get("chunks", [])
    if not chunks:
        return IndexData(chunks=[], vectors=np.zeros((0, 0), dtype=np.float32), meta=raw.get("build_meta", {}))

    dim = len(chunks[0]["embedding"])
    vectors = np.zeros((len(chunks), dim), dtype=np.float32)
    for i, c in enumerate(chunks):
        vectors[i] = np.array(c["embedding"], dtype=np.float32)

    # Normalize rows so cosine similarity is a plain dot product at query time.
    norms = np.linalg.norm(vectors, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    vectors = vectors / norms

    # Keep chunk dicts without the (now-redundant, large) embedding field in memory.
    slim_chunks = [{k: v for k, v in c.items() if k != "embedding"} for c in chunks]

    return IndexData(chunks=slim_chunks, vectors=vectors, meta=raw.get("build_meta", {}))
