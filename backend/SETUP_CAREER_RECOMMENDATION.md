# Career Recommendation Setup Guide

## Quick Setup Steps

### 1. Install Dependencies

```bash
cd backend
.venv\Scripts\activate.bat
pip install rapidfuzz google-genai python-dotenv
pip freeze > requirements.txt
```

### 2. Get Gemini API Key

1. Visit: https://aistudio.google.com/apikey
2. Create a new API key
3. Copy the key

### 3. Set Environment Variable

**Windows CMD:**
```cmd
set GEMINI_API_KEY=your_api_key_here
```

**PowerShell:**
```powershell
$env:GEMINI_API_KEY="your_api_key_here"
```

**Or create `.env` file:**
```bash
# Copy example
copy .env.example .env

# Edit .env and add:
GEMINI_API_KEY=your_api_key_here
```

### 4. Start Server

```bash
uvicorn main:app --reload
```

## Testing the Pipeline

### Step 1: Parse Transcript
```bash
POST http://localhost:8000/transcripts/parse
# Upload your PDF
# Response includes courses array
```

### Step 2: Enrich Courses
```bash
POST http://localhost:8000/enrich/courses
{
  "courses": [
    {"title": "Intro to Computer Science", "grade": "A+", "term": "Fall 2023"}
  ]
}
```

### Step 3: Get Recommendations
```bash
POST http://localhost:8000/recommend/careers
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

## Files Created

- ✅ `app/services/scoring_service.py` - Strength, uniqueness, importance calculations
- ✅ `app/services/gemini_service.py` - Gemini API integration
- ✅ `app/controllers/enrich_controller.py` - Course enrichment endpoint
- ✅ `app/controllers/recommend_controller.py` - Career recommendation endpoint
- ✅ `.env.example` - Environment variable template

## Updated Files

- ✅ `app/services/catalog_service.py` - Added `best_match_title()` with fuzzy matching
- ✅ `main.py` - Wired new routers
- ✅ `requirements.txt` - Added new dependencies

## Troubleshooting

**ModuleNotFoundError: No module named 'rapidfuzz'**
```bash
pip install rapidfuzz google-genai python-dotenv
```

**Missing GEMINI_API_KEY**
- Set the environment variable or create `.env` file
- Get key from: https://aistudio.google.com/apikey

**Catalog not loaded**
- Run: `python scripts/ontariotech_catalog_build.py`
- Check: `GET /catalog/status`
