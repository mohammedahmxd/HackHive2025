import json
import re
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, List, Optional

from app.services.catalog_service import get_catalog_service

DATA_DIR = Path(__file__).resolve().parents[1] / "data"

PREFIX_CATEGORY = {
    "CPS": "Computer Science",
    "MTH": "Mathematics",
    "PCS": "Physics",
    "ELE": "Electrical Engineering",
    "BLG": "Biology",
    "CHY": "Chemistry",
    "CMN": "Communication",
    "ITM": "Information Technology",
    "SSH": "Social Sciences",
    "WKT": "Work Term",
    "SCI": "Science",
    "GEO": "Geography",
    "ECN": "Economics",
    "ACC": "Accounting",
    "FIN": "Finance",
    "MKT": "Marketing",
    "POG": "Politics & Governance",
    "CRM": "Criminology",
    "SOC": "Sociology",
    "PSY": "Psychology",
    "ENG": "English",
    "HIS": "History",
    "PHL": "Philosophy",
    "POL": "Political Science",
    "ACS": "Arts & Contemporary Studies",
    "MEC": "Mechanical Engineering",
    "COE": "Computer Engineering",
    "BME": "Biomedical Engineering",
    "CEN": "Civil Engineering",
    "AER": "Aerospace Engineering",
    "CHE": "Chemical Engineering",
    "NUR": "Nursing",
    "MID": "Midwifery",
    "OHS": "Occupational Health",
    "FNF": "Food & Nutrition",
    "RTA": "Media",
    "JRN": "Journalism",
    "GCM": "Graphic Communications",
    "IND": "Industrial Design",
    "INR": "Interior Design",
    "FAS": "Fashion",
    "HST": "History of Science & Tech",
    "REL": "Religion",
    "LNG": "Language",
    "MUS": "Music",
}

SLUG_DISPLAY_NAMES = {
    "accounting_finance": "Accounting & Finance",
    "aerospace": "Aerospace Engineering",
    "architectural": "Architectural Science",
    "arts_contemporary": "Arts & Contemporary Studies",
    "biology": "Biology",
    "biomedical_eng": "Biomedical Engineering",
    "biomedical_sci": "Biomedical Science",
    "business_mgt": "Business Management",
    "business_tech": "Business Technology Management",
    "chemical": "Chemical Engineering",
    "chemistry": "Chemistry",
    "child_youth": "Child & Youth Care",
    "civil": "Civil Engineering",
    "computer_eng": "Computer Engineering",
    "computer_sci": "Computer Science",
    "creative_industries": "Creative Industries",
    "criminology": "Criminology",
    "criminology_history": "Criminology & History",
    "criminology_politics_governance": "Criminology & Politics/Governance",
    "criminology_sociology": "Criminology & Sociology",
    "disability_studies": "Disability Studies",
    "early_child": "Early Childhood Studies",
    "economics": "Economics",
    "electrical": "Electrical Engineering",
    "english": "English",
    "english_history": "English & History",
    "english_philosophy": "English & Philosophy",
    "eus": "Environment & Urban Sustainability",
    "fashion": "Fashion",
    "financial_math": "Financial Mathematics",
    "gcm": "Graphic Communications Management",
    "geographic": "Geographic Analysis",
    "health_services": "Health Services Management",
    "history": "History",
    "history_philosophy": "History & Philosophy",
    "history_politics_governance": "History & Politics/Governance",
    "history_sociology": "History & Sociology",
    "hospitality": "Hospitality & Tourism Management",
    "image_arts": "Image Arts",
    "industrial": "Industrial Engineering",
    "interior": "Interior Design",
    "journalism": "Journalism",
    "language": "Language & Intercultural Relations",
    "mathematics": "Mathematics",
    "mechanical": "Mechanical Engineering",
    "mechatronics-engineering": "Mechatronics Engineering",
    "media": "Media Production",
    "medical_physics": "Medical Physics",
    "midwifery": "Midwifery",
    "new_media": "New Media",
    "nursing_collaborative": "Nursing (Collaborative)",
    "nursing_post-diploma": "Nursing (Post-Diploma)",
    "nutrition": "Nutrition & Food",
    "occupational": "Occupational Health & Safety",
    "performance": "Performance",
    "philosophy": "Philosophy",
    "planning": "Urban & Regional Planning",
    "politics": "Politics & Governance",
    "politics_gov_sociology": "Politics/Governance & Sociology",
    "procomm": "Professional Communication",
    "professional_music": "Professional Music",
    "psychology": "Psychology",
    "public_admin": "Public Administration",
    "publichealth": "Public Health",
    "retail": "Retail Management",
    "socialwork": "Social Work",
    "sociology": "Sociology",
    "sport_media": "Sport Media",
    "undeclared_arts": "Undeclared Arts",
    "undeclared_eng": "Undeclared Engineering",
}


def _slug_to_name(slug: str) -> str:
    clean = slug.replace(".html", "")
    if clean in SLUG_DISPLAY_NAMES:
        return SLUG_DISPLAY_NAMES[clean]
    return clean.replace("_", " ").replace("-", " ").title()


def _derive_year(code: str) -> int:
    m = re.search(r"(\d)", code)
    if m:
        level = int(m.group(1))
        if level <= 0:
            return 1
        return min(level, 4)
    return 1


def _derive_category(code: str) -> str:
    m = re.match(r"([A-Z]+)", code)
    if m:
        prefix = m.group(1)
        return PREFIX_CATEGORY.get(prefix, prefix)
    return "General"


def _extract_course_name(raw: Dict[str, Any]) -> str:
    """Extract a readable course name from the raw catalog entry."""
    title = raw.get("title", "")
    desc = raw.get("description", "")

    # title is like "CPS 109" -- try to get the actual name from the description
    # pattern: "CPS 109 Computer Science I ..."
    # The description starts with "CODE NNN - Actual Name - 2025-2026..."
    name_match = re.match(r"^[A-Z]+\s*\d+\s*-\s*(.*?)\s*-\s*\d{4}", desc)
    if name_match:
        return name_match.group(1).strip()

    # Try: after "main content area CODE NNN " the next words are the name
    content_match = re.search(
        r"main content area\s+[A-Z]+\s+\d+\s+(.*?)(?:\s+[A-Z](?:[a-z]| ))",
        desc,
    )
    if content_match:
        candidate = content_match.group(1).strip()
        if len(candidate) > 3:
            return candidate

    return title


def _extract_short_description(raw: Dict[str, Any]) -> str:
    """Extract a short description from the raw scraped description field."""
    desc = raw.get("description", "")
    if not desc:
        return ""

    # Extract text between the course name header and "Weekly Contact"
    m = re.search(
        r"main content area\s+[A-Z]+\s+\d+\s+.*?\s{2,}(.*?)(?:Weekly Contact|$)",
        desc,
        re.DOTALL,
    )
    if m:
        text = m.group(1).strip()
        text = re.sub(r"\s+", " ", text)
        if len(text) > 200:
            text = text[:197] + "..."
        return text

    return ""


def _format_code(code: str) -> str:
    """Insert space between letters and numbers: CPS109 -> CPS 109."""
    return re.sub(r"([A-Z]+)(\d+)", r"\1 \2", code)


class ProgramService:
    def __init__(self, school: str):
        self.school = school
        self._programs: List[Dict[str, Any]] = []
        self._program_map: Dict[str, Dict[str, Any]] = {}
        self._load()

    def _load(self):
        map_path = DATA_DIR / self.school / "program_course_map.json"
        if not map_path.exists():
            return
        raw = json.loads(map_path.read_text(encoding="utf-8"))
        self._programs = raw.get("programs", [])
        for p in self._programs:
            slug = p.get("program_slug", "").replace(".html", "")
            self._program_map[slug] = p

    def list_programs(self) -> List[Dict[str, str]]:
        result = []
        for p in self._programs:
            slug = p.get("program_slug", "").replace(".html", "")
            result.append({"slug": slug, "name": _slug_to_name(slug)})
        result.sort(key=lambda x: x["name"])
        return result

    def get_program_courses(self, program_slug: str) -> Optional[Dict[str, Any]]:
        program = self._program_map.get(program_slug)
        if not program:
            return None

        catalog = get_catalog_service(self.school)
        if not catalog.is_loaded():
            return None

        course_ids = program.get("full_time_course_ids", [])
        program_id_set = set(course_ids)

        courses = []
        year_counters: Dict[int, int] = defaultdict(int)

        for cid in course_ids:
            raw = catalog.get_by_id(cid)
            if not raw:
                continue

            year = _derive_year(cid)
            year_counters[year] += 1
            semester_in_year = 1 if year_counters[year] % 2 == 1 else 2
            semester = (year - 1) * 2 + semester_in_year

            filtered_prereqs = [
                p for p in raw.get("prerequisites", []) if p in program_id_set
            ]

            courses.append(
                {
                    "id": cid,
                    "code": _format_code(cid),
                    "name": _extract_course_name(raw),
                    "credits": 1,
                    "year": year,
                    "semester": semester,
                    "category": _derive_category(cid),
                    "prerequisites": filtered_prereqs,
                    "description": _extract_short_description(raw),
                }
            )

        course_sets = self._generate_course_sets(courses, course_ids)

        return {
            "school": self.school,
            "program": program_slug,
            "program_name": _slug_to_name(program_slug),
            "courses": courses,
            "course_sets": course_sets,
        }

    def _generate_course_sets(
        self, courses: List[Dict], course_ids: List[str]
    ) -> Dict[str, Any]:
        sets: Dict[str, Any] = {
            "all": {"label": "All Courses", "ids": course_ids}
        }

        # Group by prefix
        prefix_groups: Dict[str, List[str]] = defaultdict(list)
        for cid in course_ids:
            m = re.match(r"([A-Z]+)", cid)
            if m:
                prefix_groups[m.group(1)].append(cid)
        for prefix, ids in sorted(prefix_groups.items()):
            if len(ids) >= 3:
                sets[prefix.lower()] = {
                    "label": PREFIX_CATEGORY.get(prefix, prefix),
                    "ids": ids,
                }

        # Group by year
        year_groups: Dict[int, List[str]] = defaultdict(list)
        for cid in course_ids:
            year_groups[_derive_year(cid)].append(cid)
        for year in sorted(year_groups):
            sets[f"year{year}"] = {
                "label": f"Year {year}",
                "ids": year_groups[year],
            }

        return sets


_program_services: Dict[str, ProgramService] = {}


def get_program_service(school: str = "tmu") -> ProgramService:
    global _program_services
    if school not in _program_services:
        _program_services[school] = ProgramService(school)
    return _program_services[school]
