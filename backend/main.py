from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers.plan_controller import router as plan_router
from app.controllers.transcript_controller import router as transcript_router
from app.controllers.catalog_controller import router as catalog_router

app = FastAPI(title="PathPilot API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(plan_router, prefix="/plan", tags=["plan"])
app.include_router(transcript_router, prefix="/transcripts", tags=["transcripts"])
app.include_router(catalog_router, prefix="/catalog", tags=["catalog"])
