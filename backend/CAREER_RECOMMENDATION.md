# Career Recommendation System

End-to-end career recommendation pipeline using transcript parsing, course matching, scoring, and Gemini AI.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
# Activate venv first
.venv\Scripts\activate.bat

# Install new dependencies
pip install rapidfuzz google-genai python-dotenv
pip freeze > requirements.txt
```

### 2. Set Up Gemini API Key

Create a `.env` file in the `backend/` directory:

```bash
# Copy example
copy .env.example .env

# Edit .env and add your API key
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Get your API key from: https://aistudio.google.com/apikey

### 3. Load Environment Variables

**Windows CMD:**
```cmd
set GEMINI_API_KEY=your_api_key_here
```

**PowerShell:**
```powershell
$env:GEMINI_API_KEY="your_api_key_here"
```

**Or use python-dotenv:**
The code will automatically load from `.env` if you use `python-dotenv`.

### 4. Start Server

```bash
uvicorn main:app --reload
```

## 📋 API Endpoints

### 1. Parse Transcript
**POST** `/transcripts/parse`

Upload transcript PDF and get parsed courses.

**Response includes:**
- `courses`: List with `course_code`, `course_title`, `grade`, `credits`, `term`

### 2. Enrich Courses
**POST** `/enrich/courses`

Enrich courses with catalog data and compute scores.

**Request:**
```json
{
  "courses": [
    {
      "title": "Intro to Computer Science",
      "grade": "A+",
      "term": "Fall 2023"
    }
  ]
}
```

**Response:**
```json
{
  "results": [
    {
      "title": "Intro to Computer Science",
      "grade": "A+",
      "term": "Fall 2023",
      "matched": true,
      "course_url": "https://...",
      "catalog_title": "Introduction to Computer Science",
      "catalog_code": "CPS109",
      "catalog_description": "...",
      "strength": 1.0,
      "uniqueness": 0.65,
      "importance": 0.88
    }
  ]
}
```

### 3. Get Career Recommendations
**POST** `/recommend/careers`

Get 3 career recommendations based on enriched courses.

**Request:**
```json
{
  "courses": [
    {
      "title": "Intro to Computer Science",
      "grade": "A+",
      "strength": 1.0,
      "uniqueness": 0.65,
      "importance": 0.88,
      "catalog_description": "..."
    }
  ]
}
```

**Response:**
```json
{
  "careers": [
    {
      "title": "Software Engineer",
      "description": "Build and maintain software applications...",
      "why_recommended": [
        "Strong performance in Intro to Computer Science",
        "High importance score indicates strong aptitude"
      ],
      "confidence": 0.92
    }
  ]
}
```

## 🔄 Complete Workflow

### Step 1: Parse Transcript
```bash
curl -X POST http://localhost:8000/transcripts/parse \
  -F "file=@uploads/OTUTranscripts.pdf"
```

Extract the `courses` array from the response.

### Step 2: Enrich Courses
```bash
curl -X POST http://localhost:8000/enrich/courses \
  -H "Content-Type: application/json" \
  -d '{
    "courses": [
      {"title": "Intro to Computer Science", "grade": "A+", "term": "Fall 2023"}
    ]
  }'
```

### Step 3: Get Recommendations
```bash
curl -X POST http://localhost:8000/recommend/careers \
  -H "Content-Type: application/json" \
  -d '{
    "courses": [
      {
        "title": "Intro to Computer Science",
        "grade": "A+",
        "strength": 1.0,
        "uniqueness": 0.65,
        "importance": 0.88,
        "catalog_description": "..."
      }
    ]
  }'
```

## 📊 Scoring System

### Strength
- Based on letter grade (A+ = 1.0, A = 0.93, B = 0.70, etc.)
- Higher grades = higher strength
- Missing/in-progress grades = 0.5 (neutral)

### Uniqueness
- Uses IDF (Inverse Document Frequency) across catalog
- Rare/specialized courses = higher uniqueness
- Common courses = lower uniqueness

### Importance
- Weighted combination: `0.65 * strength + 0.35 * uniqueness`
- Prioritizes both high grades AND specialized courses

## 🧪 Testing

### Test Enrichment
```python
import requests

courses = [
    {"title": "Intro to Computer Science", "grade": "A+", "term": "Fall 2023"}
]

response = requests.post(
    "http://localhost:8000/enrich/courses",
    json={"courses": courses}
)
print(response.json())
```

### Test Recommendations
```python
import requests
import os

# Set API key
os.environ["GEMINI_API_KEY"] = "your_key"

enriched = [
    {
        "title": "Intro to Computer Science",
        "grade": "A+",
        "strength": 1.0,
        "uniqueness": 0.65,
        "importance": 0.88,
        "catalog_description": "Fundamentals of programming..."
    }
]

response = requests.post(
    "http://localhost:8000/recommend/careers",
    json={"courses": enriched}
)
print(response.json())
```

## 📝 Notes

- **Catalog Required**: Make sure to run the catalog scraper first:
  ```bash
  python scripts/ontariotech_catalog_build.py
  ```

- **API Key**: Get from https://aistudio.google.com/apikey

- **Model**: Default is `gemini-2.5-flash` (fast). Change via `GEMINI_MODEL` env var.

- **Top Courses**: Only top 12 courses by importance are sent to Gemini to keep prompt size manageable.
