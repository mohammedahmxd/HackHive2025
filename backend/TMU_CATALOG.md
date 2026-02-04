# TMU (Toronto Metropolitan University) Calendar Catalog

PathPilot supports TMU alongside Ontario Tech. Catalog data is stored under `app/data/tmu/` (file-based; no MongoDB required).

## Data layout

- **`app/data/tmu/course_catalog.json`** – Canonical course list (id, code, subject, number, title, description, prerequisites, corequisites, antirequisites, url, school, calendar_year).
- **`app/data/tmu/program_course_map.json`** – Program URLs and their full-time course IDs.
- **`app/data/tmu/requirement_pools.json`** – Liberal Studies Table A (lower) and Table B (upper) course IDs.

Transcript courses are stored separately (per upload); enrichment joins by normalized `course_id` (e.g. `CPS109`).

## Calendar year (20XX-20XX)

All TMU URLs use a calendar year (e.g. `2025-2026`, `2026-2027`). Set it via environment variable so you don’t hardcode it:

- **`TMU_CALENDAR_YEAR`** – e.g. `2026-2027`. Default: `2025-2026`.

Example (PowerShell): `$env:TMU_CALENDAR_YEAR = "2026-2027"`  
Example (bash): `export TMU_CALENDAR_YEAR=2026-2027`  
Or add to `.env`: `TMU_CALENDAR_YEAR=2026-2027`

## Scrapers

1. **TMU catalog (programs → Full-Time → course details)**  
   From repo root:
   ```bash
   cd backend
   # Optional: set year (default 2025-2026)
   # set TMU_CALENDAR_YEAR=2026-2027
   python scripts/tmu_catalog_scraper.py
   ```
   - With **Selenium**: opens programs index, visits each program, clicks “Full-Time”, collects course links, then fetches each course page (description, prereqs, antireqs). Writes `course_catalog.json` and `program_course_map.json`.
   - Without Selenium: uses only the Courses index and writes `course_catalog.json` (no program mapping).

2. **Liberal Studies (Table A / Table B)**  
   ```bash
   # Optional: set TMU_CALENDAR_YEAR=2026-2027
   python scripts/tmu_liberal_tables_scraper.py
   ```
   Writes `requirement_pools.json` with `liberal_lower` and `liberal_upper` course ID lists.

## Using TMU catalog in the API

Set the catalog school to TMU so enrichment and recommendations use TMU data:

- **Environment:** `CATALOG_SCHOOL=tmu`
- **Code:** `get_catalog_service(school="tmu")`

Default (no env) is Ontario Tech. Enrichment and recommend endpoints use whichever catalog is active.

## Course code normalization

TMU-style codes (`CPS 109`, `CPS109`, `MTH 110`) are normalized to `CPS109`, `MTH110` via `app.utils.course_codes.normalize_course_id`. Transcript extractor supports both Ontario Tech and TMU row formats; TMU rows use 2–4 letter subject + 3 digits (e.g. CPS 109 3.0 A).

## Requirement pools (LL/UL/CE/OE)

- **Lower/Upper Liberals:** Filled by `tmu_liberal_tables_scraper.py` (Table A, Table B).
- **Core electives:** Program-specific; derived from program pages (Full-Time section / tables) in the main TMU catalog scraper.
- **Open electives:** Can be computed as “all courses minus exclusions” when you add exclusion rules; not stored as a fixed list.

Recommendation logic can filter candidates by pool (e.g. LL, UL, CE, OE) then rank by prerequisites and preferences.
