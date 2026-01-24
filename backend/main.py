from fastapi import FastAPI
from app.schemas import PlanRequest, PlanResponse, RepairRequest, RepairResponse
from app.planner import generate_plan, repair_plan

app = FastAPI(title="PathPilot API")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/plan/generate", response_model=PlanResponse)
def plan_generate(req: PlanRequest):
    return generate_plan(req)


@app.post("/plan/repair", response_model=RepairResponse)
def plan_repair(req: RepairRequest):
    return repair_plan(req)
