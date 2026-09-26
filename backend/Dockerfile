# syntax=docker/dockerfile:1

# ---- builder stage: resolve deps with uv into a venv -----------------------
FROM python:3.12-slim AS builder

RUN pip install --no-cache-dir uv

WORKDIR /app

COPY pyproject.toml ./
RUN uv venv /opt/venv
ENV VIRTUAL_ENV=/opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN uv pip install --python /opt/venv/bin/python -e .

COPY . .
# Build the index at image build time if content + API key are available at
# build time via --build-arg/secret; otherwise the committed backend/index.json
# (built ahead of time via `make index`) ships as-is. We do not fail the
# build if this step can't reach OpenAI.
RUN uv pip install --python /opt/venv/bin/python ".[tiktoken]" || true

# ---- runtime stage -----------------------------------------------------
FROM python:3.12-slim AS runtime

RUN useradd --create-home --shell /usr/sbin/nologin appuser
WORKDIR /app

COPY --from=builder /opt/venv /opt/venv
COPY --from=builder /app /app

ENV VIRTUAL_ENV=/opt/venv
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1

RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://localhost:8000/healthz', timeout=3).status==200 else 1)"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
