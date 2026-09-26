"""MDX parsing + heading-aware chunking for the RAG index.

A "document" is one .mdx file under the content directory (projects or
writing). Each document is split by markdown heading (#, ##, ###, ...) and
each heading's text is further split into ~CHUNK_TARGET_TOKENS-token windows
with CHUNK_OVERLAP_TOKENS of overlap between consecutive windows, so a fact
near a chunk boundary isn't lost. Every chunk carries a "heading path" like
"GroundedDocs > Ingestion > Idempotent chunking" built from the stack of
headings above it, plus the source doc's frontmatter.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

import yaml

from app.rag.tokenizer import count_tokens, split_words

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?\n)---\s*\n?", re.DOTALL)
HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$")


@dataclass
class Document:
    slug: str
    path: str
    doc_type: str  # "project" | "writing"
    frontmatter: dict
    body: str


@dataclass
class Chunk:
    chunk_id: str
    doc_slug: str
    doc_type: str
    doc_title: str
    heading: str  # full heading path, e.g. "GroundedDocs > Ingestion"
    text: str
    token_count: int = field(default=0)


def parse_mdx(path: Path, doc_type: str) -> Document:
    raw = path.read_text(encoding="utf-8")
    match = FRONTMATTER_RE.match(raw)
    frontmatter: dict = {}
    body = raw
    if match:
        try:
            frontmatter = yaml.safe_load(match.group(1)) or {}
        except yaml.YAMLError:
            frontmatter = {}
        body = raw[match.end() :]
    slug = path.stem
    return Document(slug=slug, path=str(path), doc_type=doc_type, frontmatter=frontmatter, body=body)


def _split_by_heading(body: str) -> list[tuple[list[str], str]]:
    """Split body text into (heading_stack, section_text) pairs."""
    lines = body.split("\n")
    sections: list[tuple[list[str], str]] = []
    stack: list[tuple[int, str]] = []  # (level, title)
    current_lines: list[str] = []

    def flush():
        text = "\n".join(current_lines).strip()
        if text:
            sections.append(([t for _, t in stack], text))

    for line in lines:
        m = HEADING_RE.match(line)
        if m:
            flush()
            current_lines = []
            level = len(m.group(1))
            title = m.group(2).strip()
            while stack and stack[-1][0] >= level:
                stack.pop()
            stack.append((level, title))
        else:
            current_lines.append(line)
    flush()

    if not sections and body.strip():
        sections.append(([], body.strip()))

    return sections


def _windowed_chunks(text: str, target_tokens: int, overlap_tokens: int) -> list[str]:
    """Split text into overlapping windows sized in approximate tokens.

    Works at word granularity (a word is a reasonable, tokenizer-agnostic
    unit to slide over) but sizes windows using the configured token
    approximation (tiktoken if available, else the word-count heuristic).
    """
    words = split_words(text)
    if not words:
        return []

    # Estimate words-per-token ratio locally so this works with either
    # tokenizer backend without hardcoding a global constant.
    total_tokens = max(count_tokens(text), 1)
    words_per_token = len(words) / total_tokens
    target_words = max(int(target_tokens * words_per_token), 1)
    overlap_words = max(int(overlap_tokens * words_per_token), 0)
    step = max(target_words - overlap_words, 1)

    chunks = []
    i = 0
    while i < len(words):
        window = words[i : i + target_words]
        chunks.append(" ".join(window))
        if i + target_words >= len(words):
            break
        i += step
    return chunks


def chunk_document(doc: Document, target_tokens: int, overlap_tokens: int) -> list[Chunk]:
    title = doc.frontmatter.get("title", doc.slug)
    sections = _split_by_heading(doc.body)
    chunks: list[Chunk] = []
    idx = 0
    for heading_stack, text in sections:
        heading_path = " > ".join([title] + heading_stack) if heading_stack else title
        for window in _windowed_chunks(text, target_tokens, overlap_tokens):
            chunk_id = f"{doc.slug}:{idx}"
            chunks.append(
                Chunk(
                    chunk_id=chunk_id,
                    doc_slug=doc.slug,
                    doc_type=doc.doc_type,
                    doc_title=title,
                    heading=heading_path,
                    text=window,
                    token_count=count_tokens(window),
                )
            )
            idx += 1
    return chunks


def load_documents(content_dir: Path) -> list[Document]:
    docs: list[Document] = []
    for doc_type, subdir in (("project", "projects"), ("writing", "writing")):
        d = content_dir / subdir
        if not d.exists():
            continue
        for path in sorted(d.glob("*.mdx")):
            docs.append(parse_mdx(path, doc_type))
    return docs
