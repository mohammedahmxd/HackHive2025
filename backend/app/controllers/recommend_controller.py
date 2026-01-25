from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import traceback

from app.services.gemini_service import recommend_3_careers

router = APIRouter()

class EnrichedCourse(BaseModel):
    title: str
    grade: Optional[str] = None
    term: Optional[str] = None
    matched: bool = False
    course_url: Optional[str] = None
    catalog_description: Optional[str] = None
    strength: float
    uniqueness: float
    importance: float

class RecommendRequest(BaseModel):
    courses: List[EnrichedCourse]

@router.post("/careers")
def recommend(req: RecommendRequest):
    try:
        # Convert pydantic models to dicts
        courses = [c.model_dump() for c in req.courses]
        return recommend_3_careers(courses)
    except Exception as e:
        error_msg = f"Error generating recommendations: {str(e)}"
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_msg)
