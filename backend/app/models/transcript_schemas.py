from pydantic import BaseModel, Field
from typing import List, Optional

class ExtractedCourse(BaseModel):
    course_code: Optional[str] = None
    course_title: Optional[str] = None
    credits: Optional[float] = None
    grade: Optional[str] = None
    term: Optional[str] = None

    confidence: float = Field(ge=0.0, le=1.0, default=0.7)
    flags: List[str] = Field(default_factory=list)

class TranscriptParseResponse(BaseModel):
    filename: str
    extracted_text_chars: int
    courses: List[ExtractedCourse]
    warnings: List[str] = Field(default_factory=list)
