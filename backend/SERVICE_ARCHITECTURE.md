# Service Architecture - How All Services Work Together

## Overview

The backend uses a clean MVC architecture where **services** contain business logic and work together:

```
┌─────────────────────────────────────────────────────────┐
│                    Controllers                           │
│  (API endpoints - plan, transcript, catalog)            │
└──────────────┬──────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────┐
│                    Services                              │
│                                                          │
│  transcript_service ──uses──> pdf_text_service           │
│         │                    course_extract_service      │
│         │                    catalog_service             │
│         │                                                 │
│         └──> get_completed_courses_from_transcript()     │
│                      │                                    │
│                      ▼                                    │
│              planner_service                              │
└──────────────────────────────────────────────────────────┘
```

## Service Responsibilities

### 1. `transcript_service.py` (Main Orchestrator)
**What it does:**
- Orchestrates the transcript parsing workflow
- Uses `pdf_text_service` to extract text from PDF
- Uses `course_extract_service` to parse courses from text
- Uses `catalog_service` to enrich course data
- Provides helper to convert transcript courses for planner

**Key Functions:**
- `parse_transcript_pdf()` - Main parsing function
- `get_completed_courses_from_transcript()` - Converts to planner format

### 2. `pdf_text_service.py` (PDF Extraction)
**What it does:**
- Extracts raw text from PDF files
- Uses pdfplumber (preferred) or PyPDF2 (fallback)

**Used by:**
- `transcript_service`

### 3. `course_extract_service.py` (Course Parsing)
**What it does:**
- Parses course codes, titles, grades, credits, terms from text
- Uses regex patterns for Ontario Tech transcript format

**Used by:**
- `transcript_service`

### 4. `catalog_service.py` (Course Catalog)
**What it does:**
- Loads and queries the scraped course catalog JSON
- Provides search by code, title, etc.
- Singleton pattern for efficient loading

**Used by:**
- `transcript_service` (for enrichment)
- `catalog_controller` (for API endpoints)

### 5. `planner_service.py` (Academic Planning)
**What it does:**
- Generates academic plans
- Repairs/modifies existing plans
- Uses course codes from transcript

**Used by:**
- `plan_controller` (for API endpoints)
- Can receive data from `transcript_service` via helper function

## Integration Flow

### Example: Parse Transcript → Generate Plan

```python
# Step 1: Parse transcript (uses multiple services)
from app.services.transcript_service import (
    parse_transcript_pdf, 
    get_completed_courses_from_transcript
)

transcript_result = parse_transcript_pdf(
    "transcript.pdf", 
    "transcript.pdf",
    enrich_with_catalog=True  # Uses catalog_service
)
# This internally uses:
# - pdf_text_service (extract text)
# - course_extract_service (parse courses)
# - catalog_service (enrich with catalog data)

# Step 2: Extract completed courses
completed = get_completed_courses_from_transcript(transcript_result)

# Step 3: Generate plan (uses planner_service)
from app.services.planner_service import generate_plan
from app.models.plan_schemas import PlanRequest

plan = generate_plan(PlanRequest(completed_courses=completed))
```

## Why This Architecture?

✅ **Separation of Concerns**: Each service has a single responsibility  
✅ **Reusability**: Services can be used independently or together  
✅ **Testability**: Easy to test each service in isolation  
✅ **Maintainability**: Changes to one service don't break others  

## Test Scripts

Test scripts are located in the `tests/` directory:

1. **`test_transcript_parser.py`** - Tests transcript_service only
2. **`test_all_endpoints.py`** - Tests all API endpoints
3. **`test_full_integration.py`** - Tests all services working together

## Key Point

**All services ARE being used!** The architecture follows the dependency chain:
- `transcript_service` orchestrates and uses other services
- `planner_service` can receive data from `transcript_service`
- `catalog_service` enriches data from `transcript_service`

This is proper service-oriented architecture! 🎯
