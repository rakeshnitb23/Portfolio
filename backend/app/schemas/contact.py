import re

from pydantic import BaseModel, ConfigDict, Field, field_validator

NAME_REGEX = re.compile(r"^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$")
EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@"
    r"[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?"
    r"(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$"
)
URL_REGEX = re.compile(r"https?://|www\.", re.IGNORECASE)
SCRIPT_TAG_REGEX = re.compile(r"<script[\s>]", re.IGNORECASE)

SUBJECT_LABELS = {
    "hiring": "Hiring Opportunity",
    "collaboration": "Collaboration",
    "project": "Project Inquiry",
    "other": "Other",
}


class ContactRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    fullName: str = ""
    email: str = ""
    company: str = ""
    subject: str = ""
    message: str = ""
    agreement: bool = False
    hp: str = Field(default="", alias="_hp")

    @field_validator("fullName")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Name must be at least 2 characters")
        if len(v) > 60:
            raise ValueError("Name must be under 60 characters")
        if not NAME_REGEX.match(v):
            raise ValueError("Name can only contain letters and spaces")
        return v

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = v.strip()
        if not EMAIL_REGEX.match(v):
            raise ValueError("Please enter a valid email address")
        return v

    @field_validator("company")
    @classmethod
    def validate_company(cls, v: str) -> str:
        v = v.strip()
        if len(v) > 100:
            raise ValueError("Company name must be under 100 characters")
        return v

    @field_validator("subject")
    @classmethod
    def validate_subject(cls, v: str) -> str:
        if v not in SUBJECT_LABELS:
            raise ValueError("Please select a subject")
        return v

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 20:
            raise ValueError("Message must be at least 20 characters")
        if len(v) > 1000:
            raise ValueError("Message must be under 1000 characters")
        if URL_REGEX.search(v):
            raise ValueError("Links are not allowed in messages")
        if SCRIPT_TAG_REGEX.search(v):
            raise ValueError("Invalid content detected")
        return v

    @field_validator("agreement")
    @classmethod
    def validate_agreement(cls, v: bool) -> bool:
        if v is not True:
            raise ValueError("Please agree to professional communication")
        return v
