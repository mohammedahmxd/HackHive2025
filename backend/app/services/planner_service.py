# backend/app/services/planner_service.py

from __future__ import annotations

from copy import deepcopy
from typing import Dict, List, Optional, Tuple

from app.models.plan_schemas import (
    PlanRequest,
    PlanResponse,
    Semester,
    RepairRequest,
    RepairResponse,
)

# -------------------------------------------------------------------
# Hackathon-stable demo catalog (edit later without changing APIs)
# -------------------------------------------------------------------
COURSE_CATALOG: Dict[str, dict] = {
    "CPS109": {"prereqs": [], "offered": {"Fall", "Winter"}},
    "CPS209": {"prereqs": ["CPS109"], "offered": {"Fall", "Winter"}},
    "CPS305": {"prereqs": ["CPS209"], "offered": {"Fall", "Winter"}},
    "CPS506": {"prereqs": ["CPS305"], "offered": {"Fall"}},
    "CPS510": {"prereqs": ["CPS305"], "offered": {"Winter"}},
    "CPS633": {"prereqs": ["CPS305"], "offered": {"Fall", "Winter"}},
}

# Simple career weighting for deterministic “scoring” selection order
CAREER_BOOST: Dict[str, List[str]] = {
    "ai": ["CPS510", "CPS633"],
    "data": ["CPS510", "CPS633"],
    "software": ["CPS305", "CPS506"],
}

# -------------------------------------------------------------------
# Validation helpers (internal)
# -------------------------------------------------------------------
def _prereqs_met(course: str, taken: set[str]) -> bool:
    prereqs = COURSE_CATALOG.get(course, {}).get("prereqs", [])
    return all(p in taken for p in prereqs)

def _offered_in_term(course: str, term: str) -> bool:
    if course not in COURSE_CATALOG:
        return True  # unknown courses won't hard-fail demo
    return term in COURSE_CATALOG[course]["offered"]

def _validate_plan(
    semesters: List[Semester],
    completed_courses: List[str],
    max_per_term: int,
) -> Tuple[bool, List[str]]:
    issues: List[str] = []

    completed = set(completed_courses)
    seen = set(completed_courses)

    all_courses: List[str] = []

    for sem in semesters:
        if len(sem.courses) > max_per_term:
            issues.append(f"{sem.term}: too many courses (max {max_per_term}).")

        for c in sem.courses:
            all_courses.append(c)

            if c in completed:
                issues.append(f"{c} is already completed but appears in the plan.")

            if not _offered_in_term(c, sem.term):
                issues.append(f"{c} is not offered in {sem.term}.")

            if c in COURSE_CATALOG:
                missing = [p for p in COURSE_CATALOG[c]["prereqs"] if p not in seen]
                if missing:
                    issues.append(f"{c} missing prereqs when scheduled: {missing}")

        for c in sem.courses:
            seen.add(c)

    if len(set(all_courses)) != len(all_courses):
        issues.append("Duplicate course found across semesters.")

    return (len(issues) == 0), issues

def _auto_repair(
    semesters: List[Semester],
    completed_courses: List[str],
    max_per_term: int,
) -> Tuple[List[Semester], List[str]]:
    """
    Best-effort, deterministic repair for demo stability:
      - moves offering-mismatched courses to the other term if possible
      - moves prereq-problem courses later if possible
      - otherwise drops a course (last in Winter, else Fall)
    """
    semesters = deepcopy(semesters)
    notes: List[str] = []

    for _ in range(5):
        valid, issues = _validate_plan(semesters, completed_courses, max_per_term)
        if valid:
            return semesters, notes

        notes.append(f"Validator: {issues[0]}")

        # Only supports the 2-term demo grid (Fall/Winter)
        if len(semesters) != 2:
            notes.append("Auto-repair: expected 2 semesters (Fall/Winter); stopping.")
            break

        fall, winter = semesters[0], semesters[1]

        # 1) Fix offering mismatch: move to the other term if offered there and capacity allows
        moved = False
        for src, dst in [(fall, winter), (winter, fall)]:
            for c in list(src.courses):
                if c in COURSE_CATALOG and (not _offered_in_term(c, src.term)) and _offered_in_term(c, dst.term):
                    if len(dst.courses) < max_per_term:
                        src.courses.remove(c)
                        dst.courses.append(c)
                        notes.append(f"Auto-repair: moved {c} from {src.term} to {dst.term}.")
                        moved = True
                        break
            if moved:
                break
        if moved:
            continue

        # 2) Fix prereq issues: move Fall course to Winter if it helps and capacity allows
        moved = False
        taken_before_fall = set(completed_courses)
        taken_after_fall = taken_before_fall | set(fall.courses)

        for c in list(fall.courses):
            if c in COURSE_CATALOG:
                missing_if_in_fall = [p for p in COURSE_CATALOG[c]["prereqs"] if p not in taken_before_fall]
                if missing_if_in_fall and len(winter.courses) < max_per_term and _offered_in_term(c, "Winter"):
                    fall.courses.remove(c)
                    winter.courses.append(c)
                    notes.append(f"Auto-repair: moved {c} from Fall to Winter to satisfy prereqs.")
                    moved = True
                    break
        if moved:
            continue

        # 3) If still invalid, drop something deterministically
        if winter.courses:
            dropped = winter.courses.pop()
            notes.append(f"Auto-repair: dropped {dropped} (could not place validly).")
        elif fall.courses:
            dropped = fall.courses.pop()
            notes.append(f"Auto-repair: dropped {dropped} (could not place validly).")
        else:
            notes.append("Auto-repair: nothing left to adjust.")
            break

    return semesters, notes

def _rank_courses_for_career(courses: List[str], target_career: Optional[str]) -> List[str]:
    if not target_career:
        return sorted(courses)

    key = target_career.strip().lower()
    boost = CAREER_BOOST.get(key, [])

    boosted = [c for c in boost if c in courses]
    rest = sorted([c for c in courses if c not in boosted])
    return boosted + rest

# -------------------------------------------------------------------
# Public functions used by controllers
# -------------------------------------------------------------------
def generate_plan(req: PlanRequest) -> PlanResponse:
    max_per = max(1, req.max_courses_per_term)

    # remaining courses (demo-safe deterministic set)
    remaining = [c for c in COURSE_CATALOG.keys() if c not in set(req.completed_courses)]
    remaining = _rank_courses_for_career(remaining, req.target_career)

    fall = Semester(term="Fall", courses=[])
    winter = Semester(term="Winter", courses=[])

    notes: List[str] = []
    taken = set(req.completed_courses)

    # Fill Fall where prereqs met and offered
    for c in list(remaining):
        if len(fall.courses) >= max_per:
            break
        if _offered_in_term(c, "Fall") and _prereqs_met(c, taken):
            fall.courses.append(c)
            remaining.remove(c)

    for c in fall.courses:
        taken.add(c)

    # Fill Winter where prereqs met and offered
    for c in list(remaining):
        if len(winter.courses) >= max_per:
            break
        if _offered_in_term(c, "Winter") and _prereqs_met(c, taken):
            winter.courses.append(c)
            remaining.remove(c)

    semesters = [fall, winter]

    # Validate + auto-repair for demo stability
    valid, issues = _validate_plan(semesters, req.completed_courses, max_per)
    if not valid:
        notes.extend(issues)
        semesters, repair_notes = _auto_repair(semesters, req.completed_courses, max_per)
        notes.extend(repair_notes)

        valid2, issues2 = _validate_plan(semesters, req.completed_courses, max_per)
        if not valid2:
            notes.extend(issues2)
            notes.append("Warning: plan may still be invalid; review validator notes.")

    notes.append("Generated a deterministic demo plan (Fall/Winter).")
    if req.target_career:
        notes.append(f"Course ordering influenced by target_career='{req.target_career}' (simple scoring).")

    return PlanResponse(semesters=semesters, notes=notes)

def repair_plan(req: RepairRequest) -> RepairResponse:
    updated = deepcopy(req.current_plan)
    notes: List[str] = []

    locked = set(getattr(req, "locked_courses", []) or [])
    completed_courses = getattr(req, "completed_courses", []) or []  # works even if field not present
    max_per = getattr(req, "max_courses_per_term", 5) or 5  # stable default

    # Apply swap if requested
    if req.swap_out and req.swap_in:
        if req.swap_out in locked:
            return RepairResponse(
                updated_plan=updated,
                notes=["Swap blocked: the course you tried to remove is locked."],
            )

        did_swap = False
        for sem in updated:
            if req.swap_out in sem.courses:
                sem.courses = [req.swap_in if c == req.swap_out else c for c in sem.courses]
                did_swap = True
                notes.append(f"Swapped {req.swap_out} -> {req.swap_in}.")
                break

        if not did_swap:
            notes.append("swap_out not found in the current plan.")
    else:
        notes.append("No swap requested; plan returned unchanged.")

    # Validate + auto-repair after swap
    valid, issues = _validate_plan(updated, completed_courses=completed_courses, max_per_term=max_per)
    if not valid:
        notes.extend(issues)
        updated, repair_notes = _auto_repair(updated, completed_courses=completed_courses, max_per_term=max_per)
        notes.extend(repair_notes)

        valid2, issues2 = _validate_plan(updated, completed_courses=completed_courses, max_per_term=max_per)
        if not valid2:
            notes.extend(issues2)
            notes.append("Warning: repair may still be invalid; review validator notes.")

    return RepairResponse(updated_plan=updated, notes=notes)
