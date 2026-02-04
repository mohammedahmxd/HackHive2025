"""
TMU (Toronto Metropolitan University) Calendar Catalog Scraper.
- Programs index -> program URLs
- For each program: Full-Time section -> course links (CPS 109, MTH 110)
- For each course URL: parse description, prerequisites, antirequisites (requests + BeautifulSoup)
- Output: course_catalog.json, program_course_map.json under backend/app/data/tmu/
"""
import json
import os
import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

# Optional Selenium for program/course link discovery (program pages use Full-Time section)
try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.utils.course_codes import normalize_course_id, extract_course_ids_from_text

SCHOOL = "tmu"
# Calendar year: set TMU_CALENDAR_YEAR=2026-2027 (or 20XX-20XX) to scrape a different year
DEFAULT_CALENDAR_YEAR = "2025-2026"


def get_calendar_year() -> str:
    """From env TMU_CALENDAR_YEAR (e.g. 2026-2027); default 2025-2026."""
    return os.getenv("TMU_CALENDAR_YEAR", DEFAULT_CALENDAR_YEAR).strip()


def calendar_urls(year: str):
    """Base URLs for a given calendar year (e.g. 2025-2026)."""
    base = f"https://www.torontomu.ca/calendar/{year}/"
    return {
        "programs": base + "programs/",
        "courses": base + "courses/",
        "course_href_snippet": f"/calendar/{year}/courses/",
        "programs_href_snippet": f"/calendar/{year}/programs/",
    }


COURSE_CODE_RE = re.compile(r"^[A-Z]{2,4}\s?\d{3}$", re.IGNORECASE)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-CA,en;q=0.9",
}


def _clean_text(s: str) -> str:
    return " ".join((s or "").split())


def _norm_title(title: str) -> str:
    t = _clean_text(title).lower()
    t = t.replace("&", "and")
    t = re.sub(r"[^a-z0-9\s]", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


# ---------- Selenium: program links + course links from program pages ----------
def build_driver():
    if not SELENIUM_AVAILABLE:
        raise RuntimeError("Selenium not installed. pip install selenium")
    opts = webdriver.ChromeOptions()
    opts.add_argument("--headless=new")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--window-size=1400,900")
    return webdriver.Chrome(options=opts)


def get_program_links(driver, programs_url: str, programs_href_snippet: str) -> list:
    driver.get(programs_url)
    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "a[href]"))
    )
    links = []
    for a in driver.find_elements(By.CSS_SELECTOR, "a[href]"):
        href = a.get_attribute("href") or ""
        if programs_href_snippet in href and href.rstrip("/").count("/") >= 7:
            links.append(href.split("#")[0])
    seen = set()
    out = []
    for x in links:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out


def click_full_time_section_if_present(driver):
    candidates = driver.find_elements(By.PARTIAL_LINK_TEXT, "Full-Time")
    if candidates:
        try:
            driver.execute_script("arguments[0].scrollIntoView({block:'center'});", candidates[0])
            candidates[0].click()
            time.sleep(0.5)
        except Exception:
            pass


def extract_course_links_from_program_page(driver, program_url: str, course_href_snippet: str) -> dict:
    driver.get(program_url)
    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "a[href]"))
    )
    click_full_time_section_if_present(driver)
    course_links = {}
    for a in driver.find_elements(By.CSS_SELECTOR, "a[href]"):
        text = (a.get_attribute("textContent") or a.text or "").strip()
        href = a.get_attribute("href") or ""
        if course_href_snippet in href and COURSE_CODE_RE.match(text):
            cid = normalize_course_id(text)
            if cid:
                course_links[cid] = href.split("#")[0]
    return {"program_url": program_url, "course_links": course_links}


# ---------- requests + BeautifulSoup: course detail page ----------
# TMU pages use headings like "Prerequisites", "Antirequisites", "Corequisites"
PREREQ_RE = re.compile(
    r"(?:Prerequisite|Prerequisites)[\s:]*\s*(.+?)(?=Corequisite|Antirequisite|Credit|Prerequisite|$)",
    re.IGNORECASE | re.DOTALL,
)
COREQ_RE = re.compile(
    r"(?:Corequisite|Corequisites)[\s:]*\s*(.+?)(?=Prerequisite|Antirequisite|Credit|$)",
    re.IGNORECASE | re.DOTALL,
)
ANTIREQ_RE = re.compile(
    r"(?:Antirequisite|Antirequisites)[\s:]*\s*(.+?)(?=Prerequisite|Corequisite|Credit|$)",
    re.IGNORECASE | re.DOTALL,
)
CODE_TITLE_RE = re.compile(r"^([A-Z]{2,4}\s?\d{3})\s*[-–:]\s*(.+)$", re.IGNORECASE)


def parse_course_page(html: str, course_url: str, calendar_year: str) -> dict:
    soup = BeautifulSoup(html, "html.parser")
    text = _clean_text(soup.get_text(" ", strip=True))
    header = soup.find(["h1", "h2", "h3"])
    header_text = _clean_text(header.get_text(strip=True)) if header else None

    course_code = None
    course_title = None
    if header_text:
        m = CODE_TITLE_RE.match(header_text)
        if m:
            course_code = normalize_course_id(m.group(1))
            course_title = _clean_text(m.group(2))
        else:
            course_title = header_text

    description = text[:4000] if text else ""

    prereq_raw = None
    coreq_raw = None
    antireq_raw = None
    pm = PREREQ_RE.search(text)
    if pm:
        prereq_raw = _clean_text(pm.group(1))[:500]
    cm = COREQ_RE.search(text)
    if cm:
        coreq_raw = _clean_text(cm.group(1))[:500]
    am = ANTIREQ_RE.search(text)
    if am:
        antireq_raw = _clean_text(am.group(1))[:500]

    prerequisites = extract_course_ids_from_text(prereq_raw or "")
    corequisites = extract_course_ids_from_text(coreq_raw or "")
    antirequisites = extract_course_ids_from_text(antireq_raw or "")

    # _id for catalog: normalized code (TMU uses code as canonical id)
    cid = course_code or (course_url.split("/")[-1].replace("-", "").upper())
    if not re.match(r"^[A-Z]{2,4}\d{3}$", cid):
        cid = course_code or "UNK"

    # subject = leading letters, number = digits (e.g. CPS109 -> CPS, 109)
    subject = re.match(r"^([A-Z]+)", cid)
    number = re.sub(r"^[A-Z]+", "", cid) if cid else ""
    return {
        "id": cid,
        "code": cid,
        "subject": subject.group(1) if subject else "",
        "number": number,
        "title": course_title,
        "description": description,
        "prerequisites": prerequisites,
        "corequisites": corequisites,
        "antirequisites": antirequisites,
        "url": course_url,
        "school": SCHOOL,
        "calendar_year": calendar_year,
        "title_norm": _norm_title(course_title) if course_title else None,
    }


def fetch_all_course_urls_via_courses_index(
    session, courses_index_url: str, course_href_snippet: str, limit_programs: int = 999
) -> dict:
    """
    Fallback: scrape course links from the Courses index page (subjects -> courses).
    Returns dict course_id -> url.
    """
    course_urls = {}
    r = session.get(courses_index_url, headers=HEADERS, timeout=25)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    for a in soup.select("a[href]"):
        href = a.get("href") or ""
        href = urljoin(courses_index_url, href)
        text = (a.get_text(strip=True) or "").strip()
        if course_href_snippet in href and COURSE_CODE_RE.match(text):
            cid = normalize_course_id(text)
            if cid:
                course_urls[cid] = href.split("#")[0]
    return course_urls


def run_with_selenium(out_dir: Path, delay: float = 0.5):
    """Use Selenium for program list + course links per program; requests for course details."""
    calendar_year = get_calendar_year()
    urls = calendar_urls(calendar_year)
    print(f"Using calendar year: {calendar_year}")

    driver = build_driver()
    session = requests.Session()
    session.headers.update(HEADERS)

    program_links = get_program_links(driver, urls["programs"], urls["programs_href_snippet"])
    print(f"Found {len(program_links)} program pages")

    all_course_urls = {}
    program_maps = []

    for i, purl in enumerate(program_links, start=1):
        data = extract_course_links_from_program_page(driver, purl, urls["course_href_snippet"])
        cl = data["course_links"]
        for cid, url in cl.items():
            all_course_urls[cid] = url
        slug = purl.rstrip("/").split("/")[-1] or f"program_{i}"
        program_maps.append({
            "_id": f"{SCHOOL}|{calendar_year}|{slug}",
            "school": SCHOOL,
            "program_slug": slug,
            "program_url": purl,
            "full_time_course_ids": list(cl.keys()),
            "calendar_year": calendar_year,
        })
        print(f"[{i}/{len(program_links)}] {slug} => {len(cl)} courses")
        time.sleep(delay)

    driver.quit()

    # Optional: merge in any courses from courses index not already in program pages
    try:
        index_urls = fetch_all_course_urls_via_courses_index(
            session, urls["courses"], urls["course_href_snippet"]
        )
        for cid, url in index_urls.items():
            if cid not in all_course_urls:
                all_course_urls[cid] = url
        print(f"After courses index: {len(all_course_urls)} unique course URLs")
    except Exception as e:
        print(f"Courses index fetch failed (optional): {e}")

    # Fetch each course page and parse
    courses = []
    by_code = {}
    by_title_norm = {}

    for i, (cid, url) in enumerate(all_course_urls.items(), start=1):
        try:
            r = session.get(url, timeout=25)
            r.raise_for_status()
            course = parse_course_page(r.text, url, calendar_year)
            course["id"] = cid
            course["code"] = cid
            courses.append(course)
            by_code[cid] = cid
            if course.get("title_norm"):
                by_title_norm.setdefault(course["title_norm"], []).append(cid)
            if i % 50 == 0:
                print(f"[{i}/{len(all_course_urls)}] parsed courses...")
            time.sleep(delay)
        except Exception as e:
            print(f"Failed {url}: {e}")
            time.sleep(delay)

    catalog = {
        "meta": {
            "school": SCHOOL,
            "calendar_year": calendar_year,
            "source": urls["programs"],
            "course_count": len(courses),
        },
        "courses": courses,
        "indexes": {"by_code": by_code, "by_title_norm": by_title_norm},
    }
    catalog_path = out_dir / "course_catalog.json"
    catalog_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {catalog_path} ({len(courses)} courses)")

    program_map_path = out_dir / "program_course_map.json"
    program_map_path.write_text(
        json.dumps({"programs": program_maps, "meta": {"school": SCHOOL, "calendar_year": calendar_year}}, indent=2),
        encoding="utf-8",
    )
    print(f"Saved {program_map_path} ({len(program_maps)} programs)")


def run_with_requests_only(out_dir: Path, delay: float = 0.4):
    """
    No Selenium: only use Courses index to get course URLs, then parse each course page.
    Use when Selenium is not installed or for a quick catalog build without program mapping.
    """
    calendar_year = get_calendar_year()
    urls = calendar_urls(calendar_year)
    print(f"Using calendar year: {calendar_year}")

    session = requests.Session()
    session.headers.update(HEADERS)
    all_course_urls = fetch_all_course_urls_via_courses_index(
        session, urls["courses"], urls["course_href_snippet"]
    )
    print(f"Found {len(all_course_urls)} course URLs from courses index")

    courses = []
    by_code = {}
    by_title_norm = {}

    for i, (cid, url) in enumerate(all_course_urls.items(), start=1):
        try:
            r = session.get(url, timeout=25)
            r.raise_for_status()
            course = parse_course_page(r.text, url, calendar_year)
            course["id"] = cid
            course["code"] = cid
            courses.append(course)
            by_code[cid] = cid
            if course.get("title_norm"):
                by_title_norm.setdefault(course["title_norm"], []).append(cid)
            if i % 50 == 0:
                print(f"[{i}/{len(all_course_urls)}] parsed...")
            time.sleep(delay)
        except Exception as e:
            print(f"Failed {url}: {e}")
            time.sleep(delay)

    catalog = {
        "meta": {"school": SCHOOL, "calendar_year": calendar_year, "source": urls["courses"], "course_count": len(courses)},
        "courses": courses,
        "indexes": {"by_code": by_code, "by_title_norm": by_title_norm},
    }
    catalog_path = out_dir / "course_catalog.json"
    catalog_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {catalog_path} ({len(courses)} courses)")


def main():
    out_dir = BACKEND_DIR / "app" / "data" / "tmu"
    out_dir.mkdir(parents=True, exist_ok=True)

    if SELENIUM_AVAILABLE:
        run_with_selenium(out_dir, delay=0.5)
    else:
        print("Selenium not available; using requests-only (courses index).")
        run_with_requests_only(out_dir, delay=0.4)


if __name__ == "__main__":
    main()
