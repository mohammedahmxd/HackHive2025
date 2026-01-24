from .schemas import PlanRequest, PlanResponse, Semester, RepairRequest, RepairResponse


def generate_plan(req: PlanRequest) -> PlanResponse:
    remaining = ["CPS109", "CPS209", "CPS305", "CPS506", "CPS510", "CPS633"]
    remaining = [c for c in remaining if c not in req.completed_courses]

    max_per = max(1, req.max_courses_per_term)

    sem1 = Semester(term="Fall", courses=remaining[:max_per])
    sem2 = Semester(term="Winter", courses=remaining[max_per:max_per * 2])

    notes = [
        "Placeholder plan generator.",
        "Next: load real course catalog JSON and validate prerequisites."
    ]

    return PlanResponse(semesters=[sem1, sem2], notes=notes)


def repair_plan(req: RepairRequest) -> RepairResponse:
    updated = req.current_plan

    if req.swap_out and req.swap_in:
        if req.swap_out in req.locked_courses:
            return RepairResponse(
                updated_plan=updated,
                notes=["Swap blocked: the course you tried to remove is locked."]
            )

        did_swap = False
        for sem in updated:
            if req.swap_out in sem.courses:
                sem.courses = [req.swap_in if c == req.swap_out else c for c in sem.courses]
                did_swap = True
                break

        if did_swap:
            return RepairResponse(
                updated_plan=updated,
                notes=[f"Swapped {req.swap_out} -> {req.swap_in} (placeholder)."]
            )

        return RepairResponse(
            updated_plan=updated,
            notes=["swap_out not found in the current plan."]
        )

    return RepairResponse(
        updated_plan=updated,
        notes=["No swap requested. Returned plan unchanged (placeholder)."]
    )
