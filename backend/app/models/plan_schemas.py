# backend/app/models/plan_schemas.py

from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


class PlanRequest(BaseModel):
    completed_courses: List[str] = Field(default_factory=list)
    target_career: Optional[str] = None
    max_courses_per_term: int = 5


class Semester(BaseModel):
    term: str
    courses: List[str] = Field(default_factory=list)


class PlanResponse(BaseModel):
    semesters: List[Semester] = Field(default_factory=list)
    notes: List[str] = Field(default_factory=list)


class RepairRequest(BaseModel):
    current_plan: List[Semester] = Field(default_factory=list)
    locked_courses: List[str] = Field(default_factory=list)
    swap_out: Optional[str] = None
    swap_in: Optional[str] = None

    # Optional but recommended (lets validator repair properly)
    completed_courses: List[str] = Field(default_factory=list)
    max_courses_per_term: int = 5


class RepairResponse(BaseModel):
    updated_plan: List[Semester] = Field(default_factory=list)
    notes: List[str] = Field(default_factory=list)
