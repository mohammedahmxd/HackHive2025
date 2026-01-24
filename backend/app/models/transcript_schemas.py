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
    university_name: Optional[str] = Field(default=None, description="University name extracted from transcript")
    program_name: Optional[str] = Field(default=None, description="Program/Major name extracted from transcript")
    total_credits_attempted: float = Field(default=0.0, description="Total attempted credits found in transcript")
    total_credits_earned: float = Field(default=0.0, description="Total earned credits (passing grades only)")
    study_year: Optional[int] = Field(default=None, description="Calculated study year based on Fall/Winter terms")
    # Legacy fields for backward compatibility
    total_credits: float = Field(default=0.0, description="Alias for total_credits_attempted")
    completed_credits: float = Field(default=0.0, description="Alias for total_credits_earned")
    degree_credits: float = Field(default=0.0, description="Degree credits - excludes co-op courses (SCCO)")
