from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    EMAIL_HOST: str = ""
    EMAIL_PORT: int = 587
    EMAIL_USER: str = ""
    EMAIL_PASS: str = ""
    EMAIL_TO: str = ""
    FRONTEND_ORIGIN: str = "http://localhost:3000"

    # --- RAG / Q&A demo settings ---
    OPENAI_API_KEY: str = ""
    EMBEDDING_MODEL: str = "text-embedding-3-small"
    CHAT_MODEL: str = "gpt-4o-mini"
    CONTENT_DIR: str = "../content"
    INDEX_PATH: str = "index.json"
    GIT_SHA: str = ""

    TOP_K: int = 5
    RELEVANCE_FLOOR: float = 0.15
    ABSTENTION_THRESHOLD: float = 0.32

    CHUNK_TARGET_TOKENS: int = 500
    CHUNK_OVERLAP_TOKENS: int = 80

    RATE_LIMIT_PER_MINUTE: str = "10/minute"
    RATE_LIMIT_PER_DAY: str = "100/day"

    MAX_QUESTION_LENGTH: int = 500

    # Dev/test-only escape hatch: when true and no OPENAI_API_KEY is set,
    # embeddings/generation use a deterministic local stand-in instead of
    # calling OpenAI. Never enable in production -- see README.
    MOCK_LLM: bool = False


settings = Settings()
