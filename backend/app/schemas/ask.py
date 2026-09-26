from pydantic import BaseModel, field_validator

from app.core.config import settings


class AskRequest(BaseModel):
    question: str

    @field_validator("question")
    @classmethod
    def validate_question(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Question must not be empty")
        if len(v) > settings.MAX_QUESTION_LENGTH:
            raise ValueError(f"Question must be under {settings.MAX_QUESTION_LENGTH} characters")
        return v


class Citation(BaseModel):
    doc_slug: str
    heading: str
    score: float
