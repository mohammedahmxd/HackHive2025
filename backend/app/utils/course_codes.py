"""
Shared course code normalization for TMU and Ontario Tech.
TMU style: "CPS 109", "CPS109", "MTH 110"
Ontario Tech style: "CSCI1030U", "MATH 4020U"
Normalized form: SUBJ+NUM (no spaces), e.g. "CPS109", "MTH110".
"""
import re
from typing import List

# Matches 2–4 letter subject + optional space + 3 digits (optional trailing letter for OT)
COURSE_RE = re.compile(r"\b([A-Z]{2,4})\s?(\d{3,4}[A-Z]?)\b", re.IGNORECASE)


def normalize_course_id(code: str) -> str:
    """
    Normalize a course code to canonical form for catalog join.
    "CPS 109" -> "CPS109", "MTH110" -> "MTH110", "CSCI 1030U" -> "CSCI1030U".
    Returns empty string if no match.
    """
    if not code or not isinstance(code, str):
        return ""
    text = code.strip().upper()
    m = COURSE_RE.search(text)
    if m:
        return f"{m.group(1).upper()}{m.group(2).upper()}"
    return ""


def extract_course_ids_from_text(text: str) -> List[str]:
    """Extract all course-like codes from a block of text (e.g. prereq paragraph)."""
    if not text:
        return []
    seen = set()
    out = []
    for m in COURSE_RE.finditer(text.upper()):
        cid = f"{m.group(1).upper()}{m.group(2).upper()}"
        if cid not in seen:
            seen.add(cid)
            out.append(cid)
    return out
