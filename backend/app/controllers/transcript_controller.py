import os
import uuid
import json
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.transcript_service import parse_transcript_pdf
from app.models.transcript_schemas import TranscriptParseResponse
from typing import Dict, Any

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
RESULTS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "transcript_results")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(RESULTS_DIR, exist_ok=True)

def _save_result(transcript_id: str, result: TranscriptParseResponse):
    """Save parse result to JSON file."""
    result_file = os.path.join(RESULTS_DIR, f"{transcript_id}.json")
    result_dict = {
        "transcript_id": transcript_id,
        "filename": result.filename,
        "extracted_text_chars": result.extracted_text_chars,
        "university_name": result.university_name,
        "program_name": result.program_name,
        "total_credits_attempted": result.total_credits_attempted,
        "total_credits_earned": result.total_credits_earned,
        "study_year": result.study_year,
        "courses": [
            {
                "course_code": course.course_code,
                "course_title": course.course_title,
                "credits": course.credits,
                "grade": course.grade,
                "term": course.term,
                "confidence": course.confidence,
                "flags": course.flags
            }
            for course in result.courses
        ],
        "warnings": result.warnings
    }
    with open(result_file, 'w', encoding='utf-8') as f:
        json.dump(result_dict, f, indent=2, ensure_ascii=False)
    return result_dict

def _load_result(transcript_id: str) -> Dict[str, Any]:
    """Load parse result from JSON file."""
    result_file = os.path.join(RESULTS_DIR, f"{transcript_id}.json")
    if not os.path.exists(result_file):
        raise HTTPException(status_code=404, detail=f"Transcript result not found for ID: {transcript_id}")
    
    with open(result_file, 'r', encoding='utf-8') as f:
        return json.load(f)

@router.post("/parse")
async def parse_transcript(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Parse a transcript PDF and return the result with transcript_id.
    
    Returns:
        JSON with transcript_id and all parsed transcript data
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF transcript file")

    transcript_id = str(uuid.uuid4())
    save_path = os.path.join(UPLOAD_DIR, f"{transcript_id}.pdf")

    contents = await file.read()
    with open(save_path, "wb") as f:
        f.write(contents)

    # Parse the transcript
    result = parse_transcript_pdf(save_path, file.filename)
    
    # Save result to JSON file
    result_dict = _save_result(transcript_id, result)
    
    return result_dict

@router.get("/")
def list_transcripts():
    """
    List all parsed transcripts.
    
    Returns:
        List of transcript IDs and metadata
    """
    results = []
    if os.path.exists(RESULTS_DIR):
        for file in Path(RESULTS_DIR).glob("*.json"):
            transcript_id = file.stem
            try:
                data = _load_result(transcript_id)
                results.append({
                    "transcript_id": transcript_id,
                    "filename": data.get("filename"),
                    "university_name": data.get("university_name"),
                    "program_name": data.get("program_name"),
                    "total_credits_attempted": data.get("total_credits_attempted"),
                    "total_credits_earned": data.get("total_credits_earned"),
                    "study_year": data.get("study_year"),
                    "course_count": len(data.get("courses", []))
                })
            except Exception:
                continue
    
    return {
        "transcripts": results,
        "count": len(results)
    }

@router.get("/latest", response_model=Dict[str, Any])
def get_latest_transcript():
    """
    Get the most recently parsed transcript (convenience endpoint).
    
    Returns:
        JSON with all parsed transcript data for the latest transcript
    """
    if not os.path.exists(RESULTS_DIR):
        raise HTTPException(status_code=404, detail="No transcripts found")
    
    json_files = list(Path(RESULTS_DIR).glob("*.json"))
    if not json_files:
        raise HTTPException(status_code=404, detail="No transcripts found")
    
    # Get the most recently modified file
    latest_file = max(json_files, key=lambda f: f.stat().st_mtime)
    transcript_id = latest_file.stem
    
    return _load_result(transcript_id)

@router.get("/{transcript_id}", response_model=Dict[str, Any])
def get_transcript(transcript_id: str):
    """
    Get parsed transcript JSON by transcript ID.
    
    Args:
        transcript_id: The UUID returned from POST /transcripts/parse
        
    Returns:
        JSON with all parsed transcript data
    """
    # Prevent reserved words from being used as IDs
    reserved_words = {"parse", "latest"}
    if transcript_id.lower() in reserved_words:
        raise HTTPException(
            status_code=400,
            detail=f"'{transcript_id}' is a reserved endpoint. Use /transcripts/ to list all transcripts or /transcripts/latest to get the most recent transcript."
        )
    
    return _load_result(transcript_id)
