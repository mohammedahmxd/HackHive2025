import re
import json
import time
import hashlib
from urllib.parse import urljoin
import requests
from bs4 import BeautifulSoup

BASE = "https://calendar.ontariotechu.ca/"
PARENT_URL = "https://calendar.ontariotechu.ca/content.php?catoid=67&navoid=3132"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-CA,en;q=0.9",
}

def clean_text(s: str) -> str:
    return " ".join((s or "").split())

def norm_title(title: str) -> str:
    t = clean_text(title).lower()
    t = t.replace("&", "and")
    t = re.sub(r"[^a-z0-9\s]", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t

def stable_id_from_url(url: str) -> str:
    # Stable ID so your DB doesn't reorder every run
    h = hashlib.sha1(url.encode("utf-8")).hexdigest()[:12]
    return f"ot_{h}"

def looks_like_program_link(href: str) -> bool:
    return bool(href) and "preview_program.php" in href and "poid=" in href

def looks_like_course_link(href: str) -> bool:
    # Typical course pages include preview_course and coid
    return bool(href) and ("preview_course" in href) and ("coid=" in href or "catoid=" in href)

def extract_program_links(parent_html: str):
    soup = BeautifulSoup(parent_html, "html.parser")
    container = soup.select_one("td.block_content") or soup.body
    if not container:
        return []

    programs = []
    for a in container.find_all("a", href=True):
        href = a["href"]
        if looks_like_program_link(href):
            programs.append(urljoin(BASE, href))

    # Dedup
    out = []
    seen = set()
    for url in programs:
        if url in seen:
            continue
        seen.add(url)
        out.append(url)
    return out

def extract_course_links_from_program(program_html: str):
    soup = BeautifulSoup(program_html, "html.parser")
    container = soup.select_one("td.block_content") or soup.body
    if not container:
        return []

    course_links = []

    # Strategy A: courseblock sections (often present)
    for a in container.find_all("a", href=True):
        href = a["href"]
        if looks_like_course_link(href):
            title_raw = clean_text(a.get_text(strip=True))
            course_links.append({
                "title_raw": title_raw if title_raw else None,
                "url": urljoin(BASE, href),
            })

    # Dedup by URL
    seen = set()
    deduped = []
    for item in course_links:
        if item["url"] in seen:
            continue
        seen.add(item["url"])
        deduped.append(item)

    return deduped

# Regex patterns for parsing course pages
PREREQ_RE = re.compile(r"(Prerequisite\(s\):\s*)(.+?)(?=(Corequisite|Exclusion|Credit|$))", re.IGNORECASE | re.DOTALL)
COREQ_RE  = re.compile(r"(Corequisite\(s\):\s*)(.+?)(?=(Prerequisite|Exclusion|Credit|$))", re.IGNORECASE | re.DOTALL)
EXCL_RE   = re.compile(r"(Exclusion\(s\):\s*)(.+?)(?=(Prerequisite|Corequisite|Credit|$))", re.IGNORECASE | re.DOTALL)

CODE_TITLE_RE = re.compile(r"^([A-Z]{3,5}\s*\d{3,4}[A-Z]?\s*[A-Z]?)\s*[-–]\s*(.+)$")

def parse_course_page(course_html: str, course_url: str):
    soup = BeautifulSoup(course_html, "html.parser")
    container = soup.select_one("td.block_content") or soup.body
    text = clean_text(container.get_text(" ", strip=True)) if container else clean_text(soup.get_text(" ", strip=True))

    # Try to find a visible header/title element
    header = soup.find(["h1", "h2", "h3"])
    header_text = clean_text(header.get_text(strip=True)) if header else None

    course_code = None
    course_title = None

    if header_text:
        m = CODE_TITLE_RE.match(header_text)
        if m:
            course_code = clean_text(m.group(1))
            course_title = clean_text(m.group(2))
        else:
            course_title = header_text

    # Description heuristic: often first sentence chunk after title
    # We'll just store full text and let UI/LLM summarize if needed,
    # but you can improve later by extracting "Course Description" sections.
    description = text

    prereq = None
    coreq = None
    excl = None

    pm = PREREQ_RE.search(text)
    if pm: prereq = clean_text(pm.group(2))

    cm = COREQ_RE.search(text)
    if cm: coreq = clean_text(cm.group(2))

    em = EXCL_RE.search(text)
    if em: excl = clean_text(em.group(2))

    return {
        "id": stable_id_from_url(course_url),
        "title": course_title,
        "code": course_code,
        "url": course_url,
        "description": description,
        "prerequisites": prereq,
        "corequisites": coreq,
        "exclusions": excl,
        "title_norm": norm_title(course_title) if course_title else None,
    }

def build_catalog(out_json="ontariotech_courses_db.json", delay=0.4):
    session = requests.Session()

    print("Fetching parent page...")
    parent = session.get(PARENT_URL, headers=HEADERS, timeout=25)
    parent.raise_for_status()

    program_urls = extract_program_links(parent.text)
    print(f"Programs found: {len(program_urls)}")

    # Stage 2: gather unique course URLs
    seen_course_urls = set()
    course_url_seed = []

    for i, purl in enumerate(program_urls, start=1):
        r = session.get(purl, headers=HEADERS, timeout=25)
        r.raise_for_status()

        links = extract_course_links_from_program(r.text)
        for item in links:
            url = item["url"]
            if url not in seen_course_urls:
                seen_course_urls.add(url)
                course_url_seed.append(url)

        print(f"[{i}/{len(program_urls)}] +{len(links)} links (total unique courses: {len(course_url_seed)})")
        time.sleep(delay)

    print(f"Unique course pages to fetch: {len(course_url_seed)}")

    # Stage 3: fetch each course page and parse
    courses = []
    by_code = {}
    by_title_norm = {}

    for i, curl in enumerate(course_url_seed, start=1):
        try:
            r = session.get(curl, headers=HEADERS, timeout=25)
            r.raise_for_status()
            course = parse_course_page(r.text, curl)

            # store
            courses.append(course)

            # indexes
            if course.get("code"):
                by_code[course["code"]] = course["id"]
            if course.get("title_norm"):
                by_title_norm.setdefault(course["title_norm"], []).append(course["id"])

            if i % 25 == 0:
                print(f"[{i}/{len(course_url_seed)}] parsed courses...")

            time.sleep(delay)
        except Exception as e:
            print(f"Failed course page: {curl} ({e})")
            time.sleep(delay)

    db = {
        "meta": {
            "source_parent": PARENT_URL,
            "generated_at_unix": int(time.time()),
            "course_count": len(courses)
        },
        "courses": courses,
        "indexes": {
            "by_code": by_code,
            "by_title_norm": by_title_norm
        }
    }

    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)

    print(f"Saved DB: {out_json} ({len(courses)} courses)")


if __name__ == "__main__":
    import sys
    import os
    
    # Default output to app/data directory
    if len(sys.argv) > 1:
        out_path = sys.argv[1]
    else:
        # Get the backend directory (parent of scripts)
        backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        out_path = os.path.join(backend_dir, "app", "data", "ontariotech_courses_db.json")
    
    build_catalog(out_json=out_path, delay=0.4)
