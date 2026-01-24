from pydantic import BaseModel
from typing import List, Optional

class PlanRequest(BaseModel):
    completed_courses: List[str] = []
    target_career: Optional[str] = None
    max_courses_per_term: int = 5

class Semester(BaseModel):
    term: str
    courses: List[str]

class PlanResponse(BaseModel):
    semesters: List[Semester]
    notes: List[str] = []

class RepairRequest(BaseModel):
    current_plan: List[Semester]
    locked_courses: List[str] = []
    swap_out: Optional[str] = None
    swap_in: Optional[str] = None

class RepairResponse(BaseModel):
    updated_plan: List[Semester]
    notes: List[str] = []
