import logging
import subprocess
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from app.api.contact import router as contact_router
from app.api.rag import router as rag_router
from app.core.config import settings
from app.core.limiter import limiter
from app.core.logging import configure_logging
from app.rag.index_store import load_index

configure_logging()
logger = logging.getLogger("app")


def _resolve_git_sha() -> str:
    if settings.GIT_SHA:
        return settings.GIT_SHA
    try:
        out = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            capture_output=True,
            text=True,
            timeout=2,
            check=True,
        )
        return out.stdout.strip() or "unknown"
    except Exception:
        return "unknown"


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.index = load_index(settings.INDEX_PATH)
    app.state.build_sha = _resolve_git_sha()
    logger.info(
        "startup",
        extra={"index_chunks": app.state.index.chunk_count, "build_sha": app.state.build_sha},
    )
    yield


app = FastAPI(title="Portfolio Backend API", lifespan=lifespan)

app.state.limiter = limiter
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"success": False, "message": "Rate limit exceeded. Please slow down and try again later."},
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("unhandled exception", extra={"path": str(request.url.path)})
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Something went wrong. Please try again later."},
    )


app.include_router(contact_router)
app.include_router(rag_router)


@app.get("/health")
async def health():
    return {"ok": True}


@app.get("/healthz")
async def healthz(request: Request):
    return {
        "status": "ok",
        "index_size": request.app.state.index.chunk_count,
        "build_sha": request.app.state.build_sha,
    }
