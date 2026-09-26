#!/usr/bin/env python3
"""Builds backend/index.json from the frontend's ../content/**/*.mdx files.

Usage:
    uv run scripts/build_index.py
    uv run scripts/build_index.py --content-dir /path/to/content --out index.json

Reads projects (frontmatter: title, summary, date, stack[], role, outcome,
repo, demo) and writing (frontmatter: title, summary, date, tags[]) MDX
files, chunks each by heading with ~500 token windows / 80 token overlap
(see app/rag/chunking.py), embeds every chunk once via the OpenAI embeddings
API, and writes chunks + vectors + metadata to index.json.

If ../content doesn't exist yet (frontend content not landed), this script
still runs -- it just produces an empty index, and should be re-run once the
MDX files are in place.
"""

from __future__ import annotations

import argparse
import json
import logging
import sys
from datetime import UTC, datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.config import settings  # noqa: E402
from app.core.logging import configure_logging  # noqa: E402
from app.rag import llm  # noqa: E402
from app.rag.chunking import chunk_document, load_documents  # noqa: E402
from app.rag.tokenizer import TOKENIZER_BACKEND  # noqa: E402

configure_logging()
logger = logging.getLogger("build_index")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--content-dir", default=settings.CONTENT_DIR)
    parser.add_argument("--out", default=settings.INDEX_PATH)
    args = parser.parse_args()

    content_dir = Path(args.content_dir)
    if not content_dir.is_absolute():
        # Resolve relative to backend/ (this script's parent dir), matching
        # how the running FastAPI app resolves settings.CONTENT_DIR.
        content_dir = (Path(__file__).resolve().parent.parent / content_dir).resolve()

    logger.info("loading documents", extra={"content_dir": str(content_dir)})
    docs = load_documents(content_dir)
    if not docs:
        logger.warning(
            "no .mdx documents found; writing an empty index. Re-run once "
            "../content/projects and ../content/writing are populated.",
            extra={"content_dir": str(content_dir)},
        )

    all_chunks = []
    for doc in docs:
        chunks = chunk_document(doc, settings.CHUNK_TARGET_TOKENS, settings.CHUNK_OVERLAP_TOKENS)
        all_chunks.extend(chunks)
        logger.info(
            "chunked document",
            extra={"doc_slug": doc.slug, "doc_type": doc.doc_type, "n_chunks": len(chunks)},
        )

    embeddings: list[list[float]] = []
    if all_chunks:
        texts = [c.text for c in all_chunks]
        embeddings = llm.embed_texts(texts)

    out_chunks = []
    for chunk, emb in zip(all_chunks, embeddings, strict=True):
        out_chunks.append(
            {
                "chunk_id": chunk.chunk_id,
                "doc_slug": chunk.doc_slug,
                "doc_type": chunk.doc_type,
                "doc_title": chunk.doc_title,
                "heading": chunk.heading,
                "text": chunk.text,
                "token_count": chunk.token_count,
                "embedding": emb,
            }
        )

    payload = {
        "build_meta": {
            "built_at": datetime.now(UTC).isoformat(),
            "embedding_model": settings.EMBEDDING_MODEL,
            "tokenizer_backend": TOKENIZER_BACKEND,
            "chunk_target_tokens": settings.CHUNK_TARGET_TOKENS,
            "chunk_overlap_tokens": settings.CHUNK_OVERLAP_TOKENS,
            "chunk_count": len(out_chunks),
            "doc_count": len(docs),
            "content_dir": str(content_dir),
            "mock_llm": settings.MOCK_LLM and not settings.OPENAI_API_KEY,
        },
        "chunks": out_chunks,
    }

    out_path = Path(args.out)
    if not out_path.is_absolute():
        out_path = (Path(__file__).resolve().parent.parent / out_path).resolve()
    out_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    logger.info("wrote index", extra={"out_path": str(out_path), "chunk_count": len(out_chunks)})
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
