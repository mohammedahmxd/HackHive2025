# PathPilot Documentation

This document explains how to set up and run PathPilot locally, and how to use the backend API endpoints.

---

## Project Overview

PathPilot helps students choose electives that align with a career goal and builds a semester by semester plan that respects prerequisites and program rules. It also supports networking by generating LinkedIn search queries and drafting outreach messages.

---

## Project Structure

HackHive2025/
  backend/                     # FastAPI backend
    app/                       # API modules
      __init__.py
      planner.py               # Planner logic (generate_plan, repair_plan)
      schemas.py               # Pydantic request/response models
    main.py                    # FastAPI app entry point
    requirements.txt           # Python dependencies
  frontend/                    # React frontend
  data/                        # (Optional) course catalog + career profiles (JSON)
  README.md
  DOCUMENTATION.md

---

## Requirements

You need these installed on your machine:

- Python 3
- Node.js and npm

Notes for macOS users:
- Use `python3` instead of `python`
- Use `python3 -m pip` instead of `pip` if `pip` is not found

---

## Backend Setup (FastAPI)

### 1. Go to the backend folder

```bash
cd backend
