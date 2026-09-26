import json
import logging
import uuid

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import ValidationError

from app.core.config import settings
from app.core.limiter import limiter
from app.rag.pipeline import run_pipeline
from app.schemas.ask import AskRequest

logger = logging.getLogger("rag.api")

router = APIRouter()


def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


def _stream_pipeline_result(result, request_id: str):
    """Turn an already-computed PipelineResult into an SSE token stream.

    The model's raw output is fully buffered and citation-checked in
    run_pipeline() before we ever send bytes to the client (see
    app/rag/pipeline.py) -- a hallucinated [n] marker must never reach the
    client, so we can't stream raw model tokens live and fix them up after
    the fact. We re-chunk the *validated* text into word-sized SSE frames so
    the client still gets an incremental, typewriter-style stream.
    """
    for word in result.answer.split(" "):
        if word:
            yield _sse("token", {"text": word + " "})
    citations = [
        {"doc_slug": c["doc_slug"], "heading": c["heading"], "score": round(c["score"], 4)}
        for c in result.citations
    ]
    yield _sse("done", {"citations": citations, "abstained": result.abstained, "request_id": request_id})


@router.post("/api/ask")
@limiter.limit(settings.RATE_LIMIT_PER_DAY)
@limiter.limit(settings.RATE_LIMIT_PER_MINUTE)
async def ask(request: Request):
    request_id = str(uuid.uuid4())
    body = await request.json()
    try:
        payload = AskRequest.model_validate(body)
    except ValidationError as exc:
        errors = {str(e["loc"][0]): e["msg"].removeprefix("Value error, ") for e in exc.errors()}
        return JSONResponse(status_code=422, content={"success": False, "errors": errors})

    index = request.app.state.index
    result = run_pipeline(payload.question, index)

    logger.info(
        "ask request",
        extra={
            "request_id": request_id,
            "latency_s": result.latency_s,
            "best_score": result.best_score,
            "abstained": result.abstained,
            "n_citations": len(result.citations),
        },
    )

    return StreamingResponse(
        _stream_pipeline_result(result, request_id),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Request-Id": request_id},
    )


@router.get("/api/index/stats")
async def index_stats(request: Request):
    index = request.app.state.index
    meta = index.meta or {}
    return {
        "chunk_count": index.chunk_count,
        "corpus_last_built": meta.get("built_at"),
    }
