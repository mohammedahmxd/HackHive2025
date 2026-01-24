from fastapi import APIRouter
from app.models.plan_schemas import PlanRequest, PlanResponse, RepairRequest, RepairResponse
from app.services.planner_service import generate_plan, repair_plan

router = APIRouter()

@router.post("/generate", response_model=PlanResponse)
def plan_generate(req: PlanRequest):
    return generate_plan(req)

@router.post("/repair", response_model=RepairResponse)
def plan_repair(req: RepairRequest):
    return repair_plan(req)
