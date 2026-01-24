from app.services.pdf_text_service import extract_text_from_pdf
from app.services.course_extract_service import extract_courses_from_text
from app.models.transcript_schemas import TranscriptParseResponse

def parse_transcript_pdf(saved_path: str, original_filename: str) -> TranscriptParseResponse:
    text, pdf_warnings = extract_text_from_pdf(saved_path)
    courses, parse_warnings = extract_courses_from_text(text)

    return TranscriptParseResponse(
        filename=original_filename,
        extracted_text_chars=len(text),
        courses=courses,
        warnings=[*pdf_warnings, *parse_warnings],
    )
