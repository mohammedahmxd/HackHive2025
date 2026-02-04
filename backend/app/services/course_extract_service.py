import re
from typing import Tuple, List, Optional
from app.models.transcript_schemas import ExtractedCourse

# Ontario Tech: 3-5 letters + 3-4 digits + optional letter. TMU: 2-4 letters + optional space + 3 digits
COURSE_CODE_PATTERN = re.compile(r'\b([A-Z]{2,5}\s*\d{3,4}[A-Z]?)\b')

# Include transcript-style grades like PAS/CO
GRADE_TOKEN = r'(?:[A-F][+-]?|P|F|WD|CR|NC|IP|W|PAS|CO)'
GRADE_PATTERN = re.compile(rf'\b({GRADE_TOKEN})\b', re.IGNORECASE)

# Term patterns (include Spring/Summer)
TERM_HEADER_PATTERN = re.compile(
    r'\bTerm:\s*(Fall|Winter|Spring/Summer|Spring|Summer)\s*(\d{4})\b',
    re.IGNORECASE
)
TERM_INLINE_PATTERN = re.compile(
    r'\b(Fall|Winter|Spring/Summer|Spring|Summer)\s*(\d{4})\b',
    re.IGNORECASE
)

# Row patterns (Ontario Tech transcript tables)
# Example: "CSCI 1030U UG Intro to Computer Science A+ 3.000 12.90"
COURSE_ROW_PATTERN = re.compile(
    rf'^\s*(?P<subj>[A-Z]{{3,5}})\s+(?P<num>\d{{3,4}}[A-Z]?)\s+'
    r'(?P<level>UG|GR)\s+'
    rf'(?P<title>.+?)\s+'
    rf'(?P<grade>{GRADE_TOKEN})\s+'
    r'(?P<credits>\d+(?:\.\d+)?)\b',
    re.IGNORECASE
)

# In-progress rows often omit grade:
# Example: "MATH 4020U UG Computational Science II 3.000"
COURSE_ROW_INPROGRESS_PATTERN = re.compile(
    r'^\s*(?P<subj>[A-Z]{3,5})\s+(?P<num>\d{3,4}[A-Z]?)\s+'
    r'(?P<level>UG|GR)\s+'
    r'(?P<title>.+?)\s+'
    r'(?P<credits>\d+(?:\.\d+)?)\b',
    re.IGNORECASE
)

# TMU-style rows: "CPS 109 3.0 A", "CPS 109 - Intro to CS 3.0 B+", "MTH 110 3.0"
# 2-4 letter subject, optional space, 3 digits; then optional title then credits and optional grade
TMU_ROW_PATTERN = re.compile(
    r'^\s*(?P<subj>[A-Z]{2,4})\s?(?P<num>\d{3})\s+'
    r'(?:(?P<title>.+?)\s+)?'
    r'(?P<credits>\d+(?:\.\d+)?)\s*'
    r'(?P<grade>' + GRADE_TOKEN + r')?\s*$',
    re.IGNORECASE
)
# TMU row without credits/grade (code + optional title only)
TMU_ROW_MINIMAL_PATTERN = re.compile(
    r'^\s*(?P<subj>[A-Z]{2,4})\s?(?P<num>\d{3})\s*'
    r'(?:\s*[-–:]\s*(?P<title>.+?))?\s*$',
    re.IGNORECASE
)

def _norm_course_code(subj: str, num: str) -> str:
    return f"{subj}{num}".replace(" ", "").upper()

def _clean_title(title: str) -> str:
    t = re.sub(r'\s+', ' ', (title or '').strip())
    # Remove trailing junk if any
    t = re.sub(r'\s+(Attempt|Hours|Passed|Earned|GPA|Quality|Points)\b.*$', '', t, flags=re.IGNORECASE)
    return t.strip(" -–")

def extract_courses_from_text(text: str) -> Tuple[List[ExtractedCourse], List[str]]:
    warnings: List[str] = []
    courses: List[ExtractedCourse] = []

    if not text:
        warnings.append("No text provided for course extraction")
        return courses, warnings

    lines = [line.strip() for line in text.split('\n') if line.strip()]

    current_term: Optional[str] = None

    for line_num, line in enumerate(lines):
        # Track term headers (this fixes term_missing)
        m_term = TERM_HEADER_PATTERN.search(line)
        if m_term:
            season = m_term.group(1)
            year = m_term.group(2)
            current_term = f"{season} {year}"
            continue

        # Some PDFs place term info without "Term:" (fallback)
        if current_term is None:
            m_inline = TERM_INLINE_PATTERN.search(line)
            if m_inline and "Term Totals" not in line:
                current_term = f"{m_inline.group(1)} {m_inline.group(2)}"

        # Parse full structured row first (best signal)
        m_row = COURSE_ROW_PATTERN.match(line)
        if m_row:
            subj = m_row.group("subj").upper()
            num = m_row.group("num").upper()
            code = _norm_course_code(subj, num)
            title = _clean_title(m_row.group("title"))
            grade = m_row.group("grade").upper()
            credits = float(m_row.group("credits"))

            course = ExtractedCourse(
                course_code=code,
                course_title=title or None,
                credits=credits,
                grade=grade or None,
                term=current_term,
                confidence=0.95,
                flags=[]
            )
            courses.append(course)
            continue

        # In-progress row (no grade)
        m_inprog = COURSE_ROW_INPROGRESS_PATTERN.match(line)
        if m_inprog:
            subj = m_inprog.group("subj").upper()
            num = m_inprog.group("num").upper()
            code = _norm_course_code(subj, num)
            title = _clean_title(m_inprog.group("title"))
            credits = float(m_inprog.group("credits"))

            course = ExtractedCourse(
                course_code=code,
                course_title=title or None,
                credits=credits,
                grade=None,
                term=current_term,
                confidence=0.85,
                flags=["grade_missing"]
            )
            courses.append(course)
            continue

        # TMU-style row: CPS 109, CPS 109 3.0 A, CPS 109 - Title 3.0 B+
        m_tmu = TMU_ROW_PATTERN.match(line)
        if m_tmu:
            subj = m_tmu.group("subj").upper()
            num = m_tmu.group("num").upper()
            code = _norm_course_code(subj, num)
            title = _clean_title(m_tmu.group("title") or "")
            try:
                credits = float(m_tmu.group("credits"))
            except (TypeError, ValueError):
                credits = None
            grade = (m_tmu.group("grade") or "").strip().upper() or None

            course = ExtractedCourse(
                course_code=code,
                course_title=title or None,
                credits=credits,
                grade=grade,
                term=current_term,
                confidence=0.9,
                flags=[]
            )
            courses.append(course)
            continue

        # TMU minimal: "CPS 109" or "CPS 109 - Title" (no credits/grade)
        m_tmu_min = TMU_ROW_MINIMAL_PATTERN.match(line)
        if m_tmu_min and len(line) < 120:
            subj = m_tmu_min.group("subj").upper()
            num = m_tmu_min.group("num").upper()
            code = _norm_course_code(subj, num)
            title = _clean_title(m_tmu_min.group("title") or "")

            course = ExtractedCourse(
                course_code=code,
                course_title=title or None,
                credits=None,
                grade=None,
                term=current_term,
                confidence=0.75,
                flags=["credits_missing", "grade_missing"]
            )
            courses.append(course)
            continue

    # De-dupe (code+term)
    deduped: List[ExtractedCourse] = []
    seen = set()
    for c in courses:
        key = (c.course_code or "", c.term or "")
        if key not in seen:
            seen.add(key)
            deduped.append(c)

    courses = deduped

    # Post-process flags + confidence normalization
    for course in courses:
        if not course.grade:
            if "grade_missing" not in course.flags:
                course.flags.append("grade_missing")
        if course.credits is None:
            course.flags.append("credits_missing")
        if not course.term:
            course.flags.append("term_missing")
        if not course.course_title:
            course.flags.append("title_missing")

        found_fields = sum([
            course.course_code is not None,
            course.course_title is not None,
            course.credits is not None,
            course.grade is not None,
            course.term is not None
        ])
        course.confidence = min(1.0, 0.55 + (found_fields * 0.1))

    if not courses:
        warnings.append("No courses could be extracted from transcript")
    else:
        warnings.append(f"Extracted {len(courses)} courses from transcript")
        with_titles = sum(1 for c in courses if c.course_title)
        with_credits = sum(1 for c in courses if c.credits is not None)
        with_terms = sum(1 for c in courses if c.term)
        warnings.append(f"  - {with_titles}/{len(courses)} with titles, {with_credits}/{len(courses)} with credits, {with_terms}/{len(courses)} with terms")

    return courses, warnings
