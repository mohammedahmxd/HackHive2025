# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PathPilot is an academic planning application that helps students navigate their university course requirements. It features transcript parsing, course visualization with dependency graphs, and personalized recommendations for academic and professional connections.

**Tech Stack:**
- Frontend: React 19 + Vite, Framer Motion, ReactFlow, Recharts
- Backend: FastAPI (Python)
- State Management: React Context API

## Development Commands

### Frontend (React + Vite)
Located in `frontend/` directory:

```bash
# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

### Backend (FastAPI)
Located in `backend/` directory:

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server (http://localhost:8000)
uvicorn main:app --reload

# API documentation available at:
# - http://localhost:8000/docs (Swagger UI)
# - http://localhost:8000/redoc (ReDoc)
```

## Architecture

### Frontend Architecture

**Page Flow:**
The app uses a simple state-based navigation system (no react-router-dom routing, just conditional rendering):
1. `LandingPage` - Upload transcript (PDF)
2. `ValidationPage` - Verify extracted university, program, transcript type, language
3. `DashboardPage` - Main view with course graph and recommendation cards

Navigation is managed in `App.jsx` using `currentPage` state and `AnimatePresence` for smooth transitions.

**Global State (AppContext):**
- `transcriptFile` - Uploaded PDF file
- `university` - Selected university name
- `program` - Degree program (e.g., "Computer Science")
- `transcriptType` - Undergraduate/Graduate/Postgraduate
- `language` - Preferred language
- `academicYear` - Current year in program

**Key Components:**

- `CourseGraph.jsx` - Interactive course dependency visualization using ReactFlow
  - Displays courses grouped by year with prerequisite arrows
  - Supports multiple view tabs (All Courses, AI & Data, Graphics, Web & Mobile, Systems, Languages)
  - Course removal, status filtering, and JSON export functionality
  - Color-coded by status: completed (green), in-progress (blue), recommended (dashed green), not taken (gray)

- `DashboardPage.jsx` - Main dashboard with three interactive cards
  - Cards expand on hover (2/3 width for hovered, 1/3 shared for others)
  - Clicking opens full-page view for: LinkedIn Connections, Professor Connections, Project Recommendations
  - Uses smooth 0.3s animations

**Course Data Structure:**
Located in `frontend/src/data/courseGraphData.js`:
- Contains full Ontario Tech CS program course catalog
- Each course has: id, code, name, credits, year, semester, category, prerequisites, description
- Mock student progress data available for testing

**Design System:**
Colors defined in `frontend/src/index.css`:
- Blues: `--blue-dark: #000814`, `--blue-medium: #003566`, `--blue-light: #013a63`
- Gold/Yellow: `--gold-bright: #ffd60a`, `--gold-medium: #fdc500`
- Background: `#00111F`
- Animations use cubic-bezier: `[0.25, 0.46, 0.45, 0.94]`

### Backend Architecture

**MVC Pattern:**
- `controllers/` - API route handlers (FastAPI routers)
  - `transcript_controller.py` - Transcript parsing endpoint
  - `plan_controller.py` - Academic planning endpoints
- `services/` - Business logic
  - `transcript_service.py` - Transcript processing
  - `pdf_text_service.py` - PDF text extraction
  - `course_extract_service.py` - Course data extraction
  - `planner_service.py` - Academic planning logic
- `models/` - Pydantic schemas for request/response validation
  - `transcript_schemas.py`
  - `plan_schemas.py`

**API Endpoints:**
- `POST /transcripts/parse` - Upload and parse transcript PDF
- `/plan/*` - Academic planning endpoints
- `GET /health` - Health check

**CORS Configuration:**
Currently allows all origins (`allow_origins=["*"]`) - tighten for production.

## Important Patterns

### Animations
- All framer-motion animations use `duration: 0.3-0.6s` and `ease: [0.25, 0.46, 0.45, 0.94]`
- Page transitions use `<AnimatePresence mode="wait">`
- Hover animations typically use 0.3s duration

### Styling Conventions
- NO emojis unless explicitly requested by user
- Inline styles preferred over CSS files (React inline style objects)
- Color variables from `index.css` referenced as `var(--color-name)`
- Professional, minimal aesthetic with blue/gold color scheme

### Backend-Frontend Communication
- Frontend makes API calls to `http://localhost:8000`
- File uploads use FormData
- Backend returns JSON responses validated by Pydantic models

## File Upload Flow
1. User selects PDF in `LandingPage`
2. File sent to `POST /transcripts/parse`
3. Backend extracts university, program, courses
4. Frontend stores in AppContext and navigates to ValidationPage
5. User validates/corrects extracted data
6. Continue to DashboardPage with validated information
