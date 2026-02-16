from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from app.services.catalog_service import get_catalog_service
from app.services.program_service import get_program_service

router = APIRouter()

@router.get("/search")
def search_courses(
    title: Optional[str] = Query(None, description="Search by course title"),
    code: Optional[str] = Query(None, description="Search by course code"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of results")
) -> Dict[str, Any]:
    """Search courses by title or code."""
    catalog = get_catalog_service()
    
    if not catalog.is_loaded():
        raise HTTPException(
            status_code=503,
            detail="Course catalog not loaded. Run the scraping script first."
        )
    
    if code:
        course = catalog.get_by_code(code)
        if course:
            return {"results": [course], "count": 1}
        return {"results": [], "count": 0}
    
    if title:
        results = catalog.search_by_title(title, limit=limit)
        return {"results": results, "count": len(results)}
    
    raise HTTPException(
        status_code=400,
        detail="Please provide either 'title' or 'code' query parameter"
    )

@router.get("/course/{course_id}")
def get_course(course_id: str) -> Dict[str, Any]:
    """Get a specific course by ID."""
    catalog = get_catalog_service()
    
    if not catalog.is_loaded():
        raise HTTPException(
            status_code=503,
            detail="Course catalog not loaded. Run the scraping script first."
        )
    
    course = catalog.get_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    return course

@router.get("/status")
def catalog_status() -> Dict[str, Any]:
    """Get catalog loading status and metadata."""
    catalog = get_catalog_service()
    
    return {
        "loaded": catalog.is_loaded(),
        "course_count": len(catalog.courses) if catalog.is_loaded() else 0,
        "db_path": str(catalog.__class__.__module__)  # Just to indicate it's from catalog_service
    }

@router.get("/programs")
def list_programs(
    school: str = Query("tmu", description="School identifier (e.g. 'tmu')")
) -> Dict[str, Any]:
    """List available programs for a school."""
    service = get_program_service(school)
    programs = service.list_programs()
    if not programs:
        raise HTTPException(
            status_code=404,
            detail=f"No programs found for school '{school}'"
        )
    return {"school": school, "programs": programs}

@router.get("/program-courses")
def get_program_courses(
    school: str = Query("tmu", description="School identifier"),
    program: str = Query(..., description="Program slug e.g. 'computer_sci'")
) -> Dict[str, Any]:
    """Get full course data for a specific program, shaped for the frontend graph."""
    if school not in ("tmu",):
        return {"use_local": True, "school": school}

    service = get_program_service(school)
    result = service.get_program_courses(program)
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"Program '{program}' not found for school '{school}'"
        )
    return result

@router.get("/all")
def get_all_courses(
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of courses to return")
) -> Dict[str, Any]:
    """Get all courses (paginated)."""
    catalog = get_catalog_service()
    
    if not catalog.is_loaded():
        raise HTTPException(
            status_code=503,
            detail="Course catalog not loaded. Run the scraping script first."
        )
    
    all_courses = catalog.get_all_courses()[:limit]
    return {
        "results": all_courses,
        "count": len(all_courses),
        "total": len(catalog.courses)
    }
