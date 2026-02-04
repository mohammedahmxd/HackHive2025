from app.services.pdf_text_service import extract_text_from_pdf
from app.services.course_extract_service import extract_courses_from_text
from app.services.catalog_service import get_catalog_service
from app.models.transcript_schemas import TranscriptParseResponse, ExtractedCourse
from typing import List, Optional, Tuple
import re

# Passing non-letter grades that count as earned credits
PASSING_NONLETTER = {"PAS", "CR", "P"}  # PAS=Pass, CR=Credit, P=Pass
# Grades that do NOT count as earned credits
NON_EARNED = {"F", "WD", "W", "NC", "IP", "CO"}  # CO=Currently in progress (not completed)

def _infer_university_name(text: str, original_filename: str) -> Tuple[Optional[str], List[str]]:
    warnings = []
    # Try explicit text match first (some PDFs include it in text layer)
    uni_patterns = [
        (r'Ontario\s+Tech\s+University|University\s+of\s+Ontario\s+Institute\s+of\s+Technology', "Ontario Tech University"),
        (r'Toronto\s+Metropolitan\s+University|TMU|Ryerson\s+University', "Toronto Metropolitan University"),
    ]
    for p, name in uni_patterns:
        if re.search(p, text, re.IGNORECASE):
            return name, warnings

    # Heuristic fallback from filename
    fname = (original_filename or "").lower()
    if "otu" in fname or "ontariotech" in fname:
        warnings.append("University name inferred from filename (no explicit university name found in PDF text layer)")
        return "Ontario Tech University", warnings
    if "tmu" in fname or "torontomu" in fname or "ryerson" in fname:
        warnings.append("University name inferred from filename (no explicit university name found in PDF text layer)")
        return "Toronto Metropolitan University", warnings

    warnings.append("University name not found in transcript text")
    return None, warnings

def _extract_program_name(text: str) -> Tuple[Optional[str], List[str]]:
    warnings = []
    # Major: (Ontario Tech), Program: (TMU and others), Degree:
    for pattern in (r'\bMajor:\s*(.+?)(?=\n|Minor:|College:|Curriculum|Primary Degree|$)', r'\bProgram:\s*(.+?)(?=\n|Minor:|College:|Curriculum|$)', r'\bDegree:\s*(.+?)(?=\n|Minor:|College:|Curriculum|$)'):
        m = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        if m:
            prog = m.group(1).strip()
            prog = re.sub(r'\s+', ' ', prog)
            prog = re.split(r'\b(Minor:|College:|Curriculum Information|Primary Degree)\b', prog)[0].strip()
            return prog or None, warnings

    warnings.append("Program/Major not found in transcript text")
    return None, warnings

def _term_key(term: str) -> Optional[Tuple[int, int]]:
    """
    Sort key: (year, season_index)
    season_index: Fall=1, Winter=2, Spring/Summer=3, Spring=3, Summer=3
    """
    if not term:
        return None
    m = re.match(r'^(Fall|Winter|Spring/Summer|Spring|Summer)\s+(\d{4})$', term, re.IGNORECASE)
    if not m:
        return None
    season = m.group(1).lower()
    year = int(m.group(2))
    season_index = 3
    if season == "fall":
        season_index = 1
    elif season == "winter":
        season_index = 2
    return (year, season_index)

def _calc_study_year(terms: List[str]) -> Optional[int]:
    """
    Canadian universities: 2 main semesters per year (Fall/Winter).
    Count unique Fall/Winter terms from first to latest (inclusive), then ceil(count/2).
    """
    keys = []
    for t in set([x for x in terms if x]):
        k = _term_key(t)
        if k and (t.lower().startswith("fall") or t.lower().startswith("winter")):
            keys.append((k, t))
    if not keys:
        return None
    keys.sort(key=lambda x: x[0])
    # Count distinct Fall/Winter terms in chronological order
    count_terms = len(keys)
    # ceil(count/2) without math import:
    return (count_terms + 1) // 2

def _calc_credit_totals(courses: List[ExtractedCourse]) -> Tuple[float, float]:
    attempted = 0.0
    earned = 0.0
    for c in courses:
        if c.credits is None:
            continue
        attempted += float(c.credits)

        if not c.grade:
            # likely in-progress; do not count as earned
            continue

        g = c.grade.upper().strip()
        if g in NON_EARNED:
            continue
        # Letter grades (A-F with optional +/-) or passing non-letter grades (PAS, CR, P) count as earned
        # Note: CO (Currently in progress) is excluded via NON_EARNED
        is_letter_grade = len(g) >= 1 and g[0] in "ABCDEF" and (len(g) == 1 or g[1:] in ["+", "-", ""])
        if g in PASSING_NONLETTER or is_letter_grade:
            earned += float(c.credits)

    return attempted, earned

def parse_transcript_pdf(saved_path: str, original_filename: str, enrich_with_catalog: bool = True) -> TranscriptParseResponse:
    """
    Parse transcript PDF and optionally enrich with catalog data.
    
    Args:
        saved_path: Path to the saved PDF file
        original_filename: Original filename of the uploaded PDF
        enrich_with_catalog: If True, match courses with catalog and enrich data
        
    Returns:
        TranscriptParseResponse with parsed courses and metadata
    """
    # Step 1: Extract text from PDF
    text, pdf_warnings = extract_text_from_pdf(saved_path)

    # Step 2: Extract courses from text
    courses, parse_warnings = extract_courses_from_text(text)

    # Step 2.5: Extract metadata
    program_name, program_warnings = _extract_program_name(text)
    university_name, uni_warnings = _infer_university_name(text, original_filename)

    # Step 2.6: Totals + study year
    attempted, earned = _calc_credit_totals(courses)
    study_year = _calc_study_year([c.term for c in courses if c.term])

    # Step 3: Optionally enrich with catalog data
    catalog_warnings = []
    if enrich_with_catalog:
        catalog = get_catalog_service()
        if catalog.is_loaded():
            enriched_courses = []
            for course in courses:
                if course.course_code:
                    catalog_course = catalog.get_by_code(course.course_code)
                    if catalog_course:
                        if not course.course_title and catalog_course.get("title"):
                            course.course_title = catalog_course["title"]
                        if catalog_course.get("url"):
                            course.flags.append(f"catalog_url:{catalog_course['url']}")
                        course.confidence = min(1.0, course.confidence + 0.05)
                enriched_courses.append(course)
            courses = enriched_courses
        else:
            catalog_warnings.append("Catalog not loaded - skipping enrichment")

    # Calculate degree credits (excluding co-op)
    degree_credits = sum(
        (c.credits or 0)
        for c in courses
        if c.credits and c.course_code and not c.course_code.startswith('SCCO')
    )

    warnings_out = [*pdf_warnings, *parse_warnings, *program_warnings, *uni_warnings, *catalog_warnings]
    warnings_out.append(f"Total attempted credits: {attempted:.3f}")
    warnings_out.append(f"Total earned credits: {earned:.3f}")
    warnings_out.append(f"Degree credits (excluding co-op): {degree_credits:.3f}")
    if study_year:
        warnings_out.append(f"Study year: {study_year}")

    return TranscriptParseResponse(
        filename=original_filename,
        extracted_text_chars=len(text),
        courses=courses,
        university_name=university_name,
        program_name=program_name,
        total_credits_attempted=round(attempted, 3),
        total_credits_earned=round(earned, 3),
        study_year=study_year,
        warnings=warnings_out,
        # Legacy fields for backward compatibility
        total_credits=round(attempted, 3),
        completed_credits=round(earned, 3),
        degree_credits=round(degree_credits, 3),
    )


def get_completed_courses_from_transcript(transcript_response: TranscriptParseResponse) -> List[str]:
    """
    Extract completed course codes from transcript for use with planner_service.
    
    This integrates transcript_service with planner_service by converting
    parsed transcript courses into the format expected by PlanRequest.
    
    Args:
        transcript_response: The parsed transcript response
        
    Returns:
        List of completed course codes (e.g., ["CPS109", "CPS209"])
    """
    completed = []
    # Grades that indicate the course is NOT completed
    incomplete_grades = {'F', 'WD', 'W', 'NC', 'IP', 'CO'}  # IP=In-Progress, CO=Currently in progress
    
    for course in transcript_response.courses:
        # Only include courses with valid codes
        if not course.course_code:
            continue
        
        # Must have a grade to be considered completed
        if not course.grade:
            # No grade means course is likely in-progress or not yet completed
            continue
        
        # Check if grade indicates completion
        grade_upper = course.grade.upper().strip()
        if grade_upper not in incomplete_grades:
            # Course has a passing/completed grade
            completed.append(course.course_code.upper())
    
    return list(set(completed))  # Remove duplicates
