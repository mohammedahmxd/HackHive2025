from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from app.services.catalog_service import get_catalog_service
from app.services.scoring_service import (
    build_catalog_stats, uniqueness_idf, strength_from_grade, importance_score
)

router = APIRouter()

class CourseIn(BaseModel):
    title: str
    grade: Optional[str] = None
    term: Optional[str] = None

class EnrichRequest(BaseModel):
    courses: List[CourseIn]

@router.post("/courses")
def enrich_courses(req: EnrichRequest):
    catalog = get_catalog_service()

    # Precompute catalog stats once per request (fine for hackathon)
    stats = build_catalog_stats(catalog.get_all_courses())

    enriched = []
    for c in req.courses:
        match = catalog.best_match_title(c.title)
        desc = (match or {}).get("description") or ""
        url = (match or {}).get("url")
        code = (match or {}).get("code")

        strength = strength_from_grade(c.grade)
        uniq = uniqueness_idf(c.title, desc, stats)
        imp = importance_score(strength, uniq)

        enriched.append({
            "title": c.title,
            "grade": c.grade,
            "term": c.term,
            "matched": bool(match),
            "course_url": url,
            "catalog_title": (match or {}).get("title"),
            "catalog_code": code,
            "catalog_description": desc[:600],  # keep short
            "strength": round(strength, 3),
            "uniqueness": round(uniq, 3),
            "importance": round(imp, 3),
        })

    return {"results": enriched}
