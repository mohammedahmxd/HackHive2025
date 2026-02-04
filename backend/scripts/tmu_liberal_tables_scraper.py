"""
TMU Liberal Studies tables: Table A (lower liberals), Table B (upper liberals).
Writes requirement_pools.json under backend/app/data/tmu/.
Set TMU_CALENDAR_YEAR=2026-2027 (or 20XX-20XX) to scrape a different year.
"""
import json
import os
import sys
from pathlib import Path

import requests
from bs4 import BeautifulSoup

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.utils.course_codes import normalize_course_id, COURSE_RE

SCHOOL = "tmu"
DEFAULT_CALENDAR_YEAR = "2025-2026"


def get_calendar_year() -> str:
    """From env TMU_CALENDAR_YEAR (e.g. 2026-2027); default 2025-2026."""
    return os.getenv("TMU_CALENDAR_YEAR", DEFAULT_CALENDAR_YEAR).strip()


def liberal_table_urls(year: str):
    """Table A and Table B URLs for a given calendar year."""
    base = f"https://www.torontomu.ca/calendar/{year}/liberal-studies/"
    return {"table_a": base + "table_a/", "table_b": base + "table_b/"}

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-CA,en;q=0.9",
}


def scrape_liberal_table(url: str) -> list:
    """Extract course IDs from a liberal studies table page (links + plain text fallback)."""
    r = requests.get(url, headers=HEADERS, timeout=30)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
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

    return sorted(course_ids)


def main():
    calendar_year = get_calendar_year()
    urls = liberal_table_urls(calendar_year)
    print(f"Using calendar year: {calendar_year}")

    out_dir = BACKEND_DIR / "app" / "data" / "tmu"
    out_dir.mkdir(parents=True, exist_ok=True)

    lower = scrape_liberal_table(urls["table_a"])
    upper = scrape_liberal_table(urls["table_b"])

    pools = [
        {
            "_id": f"{SCHOOL}|{calendar_year}|liberal_lower",
            "pool_type": "liberal_lower",
            "course_ids": lower,
            "notes": "Table A - Lower Liberal Studies",
            "source_url": urls["table_a"],
            "school": SCHOOL,
            "calendar_year": calendar_year,
        },
        {
            "_id": f"{SCHOOL}|{calendar_year}|liberal_upper",
            "pool_type": "liberal_upper",
            "course_ids": upper,
            "notes": "Table B - Upper Liberal Studies",
            "source_url": urls["table_b"],
            "school": SCHOOL,
            "calendar_year": calendar_year,
        },
    ]

    out = {"pools": pools, "meta": {"school": SCHOOL, "calendar_year": calendar_year}}
    out_path = out_dir / "requirement_pools.json"
    out_path.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"Saved {out_path}: liberal_lower={len(lower)} courses, liberal_upper={len(upper)} courses")


if __name__ == "__main__":
    main()
