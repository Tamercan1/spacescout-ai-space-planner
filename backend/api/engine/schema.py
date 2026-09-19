from pydantic import BaseModel, Field
from typing import Any


class Media(BaseModel):
    media_type: str
    media_url: str


class Discovery(BaseModel):
    type: str
    title: str
    date: str | None = Field(
        description="should strictly be in a format YYYY-MM-DD"
    )
    media: Media | None 
    summary: str
    why_interesting: str
    facts: dict[str, Any]
    source: str = Field(
        description="A URL pointing to the original data source (tool output, "
        "NASA page, or API reference) — not just a source name like 'NASA'."
    )


class SpacePlan(BaseModel):
    title: str
    summary: str
    discoveries: list[Discovery]