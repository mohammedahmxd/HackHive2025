from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from app.controllers.plan_controller import router as plan_router
from app.controllers.transcript_controller import router as transcript_router
from app.controllers.catalog_controller import router as catalog_router
from app.controllers.enrich_controller import router as enrich_router
from app.controllers.recommend_controller import router as recommend_router

app = FastAPI(title="PathPilot API", version="0.1.0")

# CORS middleware MUST be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_credentials=False,  # Must be False when allow_origins=["*"]
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

@app.get("/")
def root():
    return {
        "message": "PathPilot API",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "plan": "/plan/generate, /plan/repair",
            "transcripts": "/transcripts/parse, /transcripts/{id}, /transcripts/",
            "catalog": "/catalog/status, /catalog/search, /catalog/all",
            "enrich": "/enrich/courses",
            "recommend": "/recommend/careers"
        }
    }

@app.get("/favicon.ico")
def favicon():
    """Handle favicon requests to prevent 404 errors."""
    return Response(status_code=204)

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(plan_router, prefix="/plan", tags=["plan"])
app.include_router(transcript_router, prefix="/transcripts", tags=["transcripts"])
app.include_router(catalog_router, prefix="/catalog", tags=["catalog"])
app.include_router(enrich_router, prefix="/enrich", tags=["enrich"])
app.include_router(recommend_router, prefix="/recommend", tags=["recommend"])
