"""Quick database connection test. Run from backend: python test_db.py"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend directory (same folder as this script)
_load_env = Path(__file__).resolve().parent / ".env"
load_dotenv(_load_env)
# Also load from current working directory (e.g. when run from backend/)
load_dotenv(".env")

from app.db import engine

if engine is None:
    print("DATABASE_URL not set - skipping connection test.")
    print("Tip: Add DATABASE_URL=... to backend/.env and save the file, then run again.")
else:
    with engine.connect() as conn:
        print("Connected!")
