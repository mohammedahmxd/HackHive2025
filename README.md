# PathPilot: Aligning academic progress with career outcomes.

PathPilot provides students with career insights aligned to their completed prerequisites and program requirements. It also supports career growth by generating targeted LinkedIn search queries, drafting outreach messages, and recommending projects to strengthen key skills for each role.

## Project Structure
```
HackHive2025/
  frontend/        # React app (Vite + React)
  backend/         # FastAPI app (Python)
  README.md        # This file
```

## Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

See [backend/README.md](./backend/README.md) for detailed backend documentation.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

See [frontend/README.md](./frontend/README.md) for detailed frontend documentation.

## Features

- **Transcript Parsing**: Upload and parse academic transcripts (PDF); supports Ontario Tech and TMU (Toronto Metropolitan University) formats
- **Course Catalog**: Search and match courses (Ontario Tech or TMU catalog via `CATALOG_SCHOOL`)
- **Career Recommendations**: AI-powered career suggestions based on transcript analysis
- **Academic Planning**: Generate semester-by-semester course plans
- **TMU Calendar Scrapers**: Scripts to build TMU course catalog, program maps, and liberal studies pools (see [backend/TMU_CATALOG.md](./backend/TMU_CATALOG.md))

## Documentation

- [backend/README.md](./backend/README.md) - Backend API documentation
- [backend/CAREER_RECOMMENDATION.md](./backend/CAREER_RECOMMENDATION.md) - Career recommendation system
- [backend/TMU_CATALOG.md](./backend/TMU_CATALOG.md) - TMU calendar catalog and scrapers
- [backend/SERVICE_ARCHITECTURE.md](./backend/SERVICE_ARCHITECTURE.md) - Service architecture

