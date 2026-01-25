# Ontario Tech Course Catalog Scraper

This script scrapes the Ontario Tech course catalog and builds a JSON database for use in the PathPilot API.

## Usage

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the scraper:
```bash
python scripts/ontariotech_catalog_build.py
```

The script will:
- Fetch the parent program listing page
- Extract all program links
- For each program, extract all course links
- Fetch and parse each unique course page
- Build a JSON database with indexes
- Save to `app/data/ontariotech_courses_db.json`

## Output

The generated JSON file contains:
- `meta`: Metadata about the scrape (source URL, timestamp, course count)
- `courses`: Array of course objects with:
  - `id`: Stable unique identifier
  - `title`: Course title
  - `code`: Course code (e.g., "CPS109")
  - `url`: URL to the course page
  - `description`: Full course description text
  - `prerequisites`: Prerequisite requirements
  - `corequisites`: Corequisite requirements
  - `exclusions`: Exclusion rules
  - `title_norm`: Normalized title for matching
- `indexes`: Fast lookup indexes
  - `by_code`: Map from course code to course ID
  - `by_title_norm`: Map from normalized title to course IDs

## Notes

- The scraper includes polite delays (0.4s) between requests
- It handles duplicate course URLs across programs
- Course pages are parsed with regex patterns for prerequisites/corequisites/exclusions
- The script is idempotent - running it multiple times will regenerate the database
