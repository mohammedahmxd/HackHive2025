from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from app.controllers.plan_controller import router as plan_router
from app.controllers.transcript_controller import router as transcript_router
from app.controllers.catalog_controller import router as catalog_router
from app.controllers.linkedin_controller import router as linkedin_router

app = FastAPI(title="PathPilot API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
            "catalog": "/catalog/status, /catalog/search, /catalog/all"
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
app.include_router(linkedin_router, prefix="/linkedin", tags=["linkedin"])
