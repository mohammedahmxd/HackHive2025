"""
Tests for TMU calendar scrapers and course code utilities.
Run from backend/: python -m pytest tests/test_tmu_scraper.py -v
Or: python -m unittest tests.test_tmu_scraper -v
"""
import os
import sys
from pathlib import Path
from unittest import TestCase, main as unittest_main

# Ensure backend and scripts are on path
BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))
if str(BACKEND_DIR / "scripts") not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR / "scripts"))

from app.utils.course_codes import (
    normalize_course_id,
    extract_course_ids_from_text,
    COURSE_RE,
)


# ---------- Course codes (shared TMU/OT) ----------
class TestNormalizeCourseId(TestCase):
    def test_tmu_style_with_space(self):
        self.assertEqual(normalize_course_id("CPS 109"), "CPS109")
        self.assertEqual(normalize_course_id("MTH 110"), "MTH110")

    def test_tmu_style_no_space(self):
        self.assertEqual(normalize_course_id("CPS109"), "CPS109")
        self.assertEqual(normalize_course_id("MTH110"), "MTH110")

    def test_ontario_tech_style(self):
        self.assertEqual(normalize_course_id("CSCI 1030U"), "CSCI1030U")
        self.assertEqual(normalize_course_id("MATH 4020U"), "MATH4020U")

    def test_empty_or_invalid(self):
        self.assertEqual(normalize_course_id(""), "")
        self.assertEqual(normalize_course_id("   "), "")
        self.assertEqual(normalize_course_id("not a code"), "")
        self.assertEqual(normalize_course_id("ABC"), "")

    def test_case_insensitive(self):
        self.assertEqual(normalize_course_id("cps 109"), "CPS109")
        self.assertEqual(normalize_course_id("Cps 109"), "CPS109")


class TestTmuTranscriptExtraction(TestCase):
    """TMU-style lines in transcript text should be parsed by course_extract_service."""

    def test_tmu_lines_extracted(self):
        from app.services.course_extract_service import extract_courses_from_text

        text = """
        Fall 2023
        CPS 109 3.0 A
        MTH 110 3.0 B+
        CPS 109 - Introduction to Computer Science I 3.0 A
        Winter 2024
        CPS 213 3.0 A-
        MTH 207 3.0 B
        """
        courses, warnings = extract_courses_from_text(text)
        codes = [c.course_code for c in courses if c.course_code]
        self.assertIn("CPS109", codes)
        self.assertIn("MTH110", codes)
        self.assertIn("CPS213", codes)
        self.assertIn("MTH207", codes)
        self.assertGreaterEqual(len(courses), 4)
        # At least one course should have term
        self.assertTrue(any(c.term for c in courses))

    def test_tmu_minimal_line(self):
        from app.services.course_extract_service import extract_courses_from_text

        text = "CPS 109 - Intro to CS"
        courses, _ = extract_courses_from_text(text)
        self.assertEqual(len(courses), 1)
        self.assertEqual(courses[0].course_code, "CPS109")


class TestExtractCourseIdsFromText(TestCase):
    def test_prereq_paragraph(self):
        text = "Prerequisites: CPS 109, MTH 110 and MTH 207. Not open to students who have taken CPS 106."
        ids = extract_course_ids_from_text(text)
        self.assertIn("CPS109", ids)
        self.assertIn("MTH110", ids)
        self.assertIn("MTH207", ids)
        self.assertIn("CPS106", ids)

    def test_empty_text(self):
        self.assertEqual(extract_course_ids_from_text(""), [])
        self.assertEqual(extract_course_ids_from_text(None), [])

    def test_dedupe(self):
        text = "CPS 109 and CPS109 are the same."
        ids = extract_course_ids_from_text(text)
        self.assertEqual(ids.count("CPS109"), 1)


# ---------- TMU catalog scraper (pure functions, no network/Selenium) ----------
class TestTmuCatalogScraper(TestCase):
    @classmethod
    def setUpClass(cls):
        import tmu_catalog_scraper as tmu
        cls.tmu = tmu

    def test_get_calendar_year_default(self):
        prev = os.environ.pop("TMU_CALENDAR_YEAR", None)
        try:
            self.assertEqual(self.tmu.get_calendar_year(), "2025-2026")
        finally:
            if prev is not None:
                os.environ["TMU_CALENDAR_YEAR"] = prev

    def test_get_calendar_year_from_env(self):
        prev = os.environ.get("TMU_CALENDAR_YEAR")
        try:
            os.environ["TMU_CALENDAR_YEAR"] = "2026-2027"
            self.assertEqual(self.tmu.get_calendar_year(), "2026-2027")
        finally:
            if prev is not None:
                os.environ["TMU_CALENDAR_YEAR"] = prev
            else:
                os.environ.pop("TMU_CALENDAR_YEAR", None)

    def test_calendar_urls(self):
        urls = self.tmu.calendar_urls("2026-2027")
        self.assertEqual(urls["programs"], "https://www.torontomu.ca/calendar/2026-2027/programs/")
        self.assertEqual(urls["courses"], "https://www.torontomu.ca/calendar/2026-2027/courses/")
        self.assertIn("/calendar/2026-2027/courses/", urls["course_href_snippet"])
        self.assertIn("/calendar/2026-2027/programs/", urls["programs_href_snippet"])

    def test_parse_course_page_minimal(self):
        html = """
        <html><body>
        <h2>CPS 109 – Introduction to Computer Science</h2>
        <p>Basic programming and problem solving.</p>
        </body></html>
        """
        out = self.tmu.parse_course_page(
            html,
            "https://www.torontomu.ca/calendar/2025-2026/courses/cps/109",
            "2025-2026",
        )
        self.assertEqual(out["code"], "CPS109")
        self.assertEqual(out["id"], "CPS109")
        self.assertIn("Introduction to Computer Science", out.get("title") or "")
        self.assertEqual(out["school"], "tmu")
        self.assertEqual(out["calendar_year"], "2025-2026")
        self.assertEqual(out["url"], "https://www.torontomu.ca/calendar/2025-2026/courses/cps/109")

    def test_parse_course_page_with_prereqs_antireqs(self):
        html = """
        <html><body>
        <h2>CPS 213 – Computer Organization I</h2>
        <p>Prerequisites: CPS 109, MTH 110. Antirequisites: CPS 113.</p>
        <p>Corequisites: MTH 207.</p>
        </body></html>
        """
        out = self.tmu.parse_course_page(
            html,
            "https://www.torontomu.ca/calendar/2025-2026/courses/cps/213",
            "2025-2026",
        )
        self.assertEqual(out["code"], "CPS213")
        self.assertIn("CPS109", out["prerequisites"])
        self.assertIn("MTH110", out["prerequisites"])
        self.assertIn("CPS113", out["antirequisites"])
        self.assertIn("MTH207", out["corequisites"])


# ---------- TMU liberal tables scraper ----------
class TestTmuLiberalTablesScraper(TestCase):
    @classmethod
    def setUpClass(cls):
        import tmu_liberal_tables_scraper as lib
        cls.lib = lib

    def test_get_calendar_year_default(self):
        prev = os.environ.pop("TMU_CALENDAR_YEAR", None)
        try:
            self.assertEqual(self.lib.get_calendar_year(), "2025-2026")
        finally:
            if prev is not None:
                os.environ["TMU_CALENDAR_YEAR"] = prev

    def test_get_calendar_year_from_env(self):
        prev = os.environ.get("TMU_CALENDAR_YEAR")
        try:
            os.environ["TMU_CALENDAR_YEAR"] = "2026-2027"
            self.assertEqual(self.lib.get_calendar_year(), "2026-2027")
        finally:
            if prev is not None:
                os.environ["TMU_CALENDAR_YEAR"] = prev
            else:
                os.environ.pop("TMU_CALENDAR_YEAR", None)

    def test_liberal_table_urls(self):
        urls = self.lib.liberal_table_urls("2026-2027")
        self.assertIn("2026-2027", urls["table_a"])
        self.assertIn("table_a", urls["table_a"])
        self.assertIn("2026-2027", urls["table_b"])
        self.assertIn("table_b", urls["table_b"])


# ---------- Liberal table extraction from HTML (no network) ----------
class TestLiberalTableExtractionFromHtml(TestCase):
    def test_extract_course_ids_from_table_html(self):
        """Extract course IDs from a snippet of Table A–style HTML."""
        from bs4 import BeautifulSoup

        html = """
        <div class="content">
        <a href="/calendar/2025-2026/courses/phi/101">PHL 101</a>
        <a href="/calendar/2025-2026/courses/soc/103">SOC 103</a>
        <p>Also: PHL 201, SOC 105 and SOC 205.</p>
        </div>
        """
        soup = BeautifulSoup(html, "html.parser")
        course_ids = set()
        for a in soup.select("a"):
            text = (a.get_text(" ", strip=True) or "").strip()
            cid = normalize_course_id(text)
            if cid:
                course_ids.add(cid)
        text = soup.get_text("\n", strip=True)
        for m in COURSE_RE.finditer(text.upper()):
            cid = f"{m.group(1).upper()}{m.group(2).upper()}"
            course_ids.add(cid)

        self.assertIn("PHL101", course_ids)
        self.assertIn("SOC103", course_ids)
        self.assertIn("PHL201", course_ids)
        self.assertIn("SOC105", course_ids)
        self.assertIn("SOC205", course_ids)


if __name__ == "__main__":
    unittest_main(verbosity=2)
