# PathPilot Backend API

FastAPI backend for academic planning, transcript parsing, and course catalog management.

## 🚀 Quick Start

### 1. Setup

```bash
cd backend
pip install -r requirements.txt
```

### 2. Start Server

```bash
python -m uvicorn main:app --reload
```

### 3. Access API

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## 📚 API Endpoints

### Plan Endpoints
- `POST /plan/generate` - Generate academic plan
- `POST /plan/repair` - Repair/modify existing plan

### Transcript Endpoints
- `POST /transcripts/parse` - Upload and parse transcript PDF
- `GET /transcripts/` - List all parsed transcripts
- `GET /transcripts/latest` - Get most recent transcript
- `GET /transcripts/{id}` - Get specific transcript by ID

### Catalog Endpoints
- `GET /catalog/status` - Check catalog loading status
- `GET /catalog/search` - Search courses by title or code
- `GET /catalog/all` - Get all courses (with limit)

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── controllers/          # API route handlers
│   │   ├── plan_controller.py
│   │   ├── transcript_controller.py
│   │   └── catalog_controller.py
│   ├── models/               # Pydantic schemas
│   │   ├── plan_schemas.py
│   │   └── transcript_schemas.py
│   ├── services/             # Business logic
│   │   ├── planner_service.py
│   │   ├── transcript_service.py
│   │   ├── pdf_text_service.py
│   │   ├── course_extract_service.py
│   │   └── catalog_service.py
│   └── data/                 # JSON database storage
├── scripts/                  # Utility scripts
│   └── ontariotech_catalog_build.py
├── tests/                    # Test scripts
├── uploads/                  # Uploaded PDFs (gitignored)
├── transcript_results/       # Parsed results (gitignored)
└── main.py                   # FastAPI app entry point
```

## 🔧 Architecture

The backend follows MVC architecture with service-oriented design:

- **Controllers**: Handle HTTP requests/responses
- **Models**: Define data structures (Pydantic schemas)
- **Services**: Contain business logic and orchestrate workflows

See [SERVICE_ARCHITECTURE.md](./SERVICE_ARCHITECTURE.md) for detailed architecture documentation.

## 📝 Usage Examples

### Parse Transcript

```bash
curl -X POST http://localhost:8000/transcripts/parse \
  -F "file=@uploads/OTUTranscripts.pdf"
```

### Get Latest Transcript

```bash
curl http://localhost:8000/transcripts/latest
```

### Search Courses

```bash
curl "http://localhost:8000/catalog/search?title=computer%20science"
```

## 🧪 Testing

Test scripts are available in the `tests/` directory:

- `test_transcript_parser.py` - Test transcript parsing
- `test_all_endpoints.py` - Test all API endpoints
- `test_full_integration.py` - Test service integration

## 📦 Dependencies

- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `pydantic` - Data validation
- `pdfplumber` / `PyPDF2` - PDF parsing
- `requests` - HTTP client
- `beautifulsoup4` - Web scraping
- `rapidfuzz` - Fuzzy string matching for course titles
- `google-genai` - Gemini AI SDK for career recommendations
- `python-dotenv` - Environment variable management

## 🔒 Environment & Security

- User uploads are stored in `uploads/` (gitignored)
- Parsed results in `transcript_results/` (gitignored)
- CORS is currently open (`allow_origins=["*"]`) - tighten for production

## 📖 Additional Documentation

- [SERVICE_ARCHITECTURE.md](./SERVICE_ARCHITECTURE.md) - Service architecture details
- [scripts/README.md](./scripts/README.md) - Course catalog scraper guide
- [CAREER_RECOMMENDATION.md](./CAREER_RECOMMENDATION.md) - Career recommendation system guide

## 🐛 Troubleshooting

### Server Not Starting
- Check Python version (3.8+)
- Install dependencies: `pip install -r requirements.txt`
- Check port 8000 is available

### Import Errors
- Ensure you're in the `backend` directory
- Activate virtual environment if using one
- Check Python path includes backend directory

### 404 Errors
- Verify server is running
- Check endpoint URLs (no trailing slashes for POST)
- Use Swagger UI at `/docs` to see all endpoints

## 📄 License

[Your License Here]
