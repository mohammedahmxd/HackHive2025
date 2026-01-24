import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.transcript_service import parse_transcript_pdf
from app.models.transcript_schemas import TranscriptParseResponse

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/parse", response_model=TranscriptParseResponse)
async def parse_transcript(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Please upload a PDF transcript for now.")

    # Always save as 'transcript.pdf' - automatically overwrites old uploads
    save_path = os.path.join(UPLOAD_DIR, "transcript.pdf")

    contents = await file.read()
    with open(save_path, "wb") as f:
        f.write(contents)

    return parse_transcript_pdf(save_path, file.filename)
