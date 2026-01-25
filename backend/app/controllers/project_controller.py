from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import traceback

from app.services.gemini_service import recommend_3_projects

router = APIRouter()

class ProjectRecommendRequest(BaseModel):
    career_title: str
    career_description: Optional[str] = ""

@router.post("/recommend")
def recommend_projects(req: ProjectRecommendRequest):
    """
    Generate 3 project recommendations based on the selected career path.
    Uses Gemini AI to create personalized project suggestions.
    """
    try:
        result = recommend_3_projects(req.career_title, req.career_description or "")
        return result
    except Exception as e:
        error_msg = f"Error generating project recommendations: {str(e)}"
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=error_msg)
