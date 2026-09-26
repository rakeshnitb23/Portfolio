"""Token-count approximation used for chunk sizing.

Uses tiktoken when it is installed (accurate, matches OpenAI's own tokenizer).
Falls back to a word-count heuristic when tiktoken is unavailable: empirically,
English prose runs ~0.75 words per token, so `tokens ~= words / 0.75`
(equivalently `words * 1.333`). This is documented here (and in the README)
because the fallback is a heuristic, not an exact count -- it is only used to
decide where to cut chunks, never surfaced to users or billed against.
"""

from __future__ import annotations

try:
    import tiktoken

    _ENC = tiktoken.get_encoding("cl100k_base")
    TOKENIZER_BACKEND = "tiktoken (cl100k_base)"
except Exception:  # pragma: no cover - exercised when tiktoken isn't installed
    _ENC = None
    TOKENIZER_BACKEND = "word-count heuristic (words / 0.75)"


def count_tokens(text: str) -> int:
    if _ENC is not None:
        return len(_ENC.encode(text))
    words = len(text.split())
    return int(words / 0.75) if words else 0


def split_words(text: str) -> list[str]:
    """Word-level split used by the fallback chunk-overlap logic."""
    return text.split()
