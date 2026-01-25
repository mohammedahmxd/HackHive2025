import os
import json
from typing import Any, Dict, List

try:
    from google import genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    genai = None

def _client():
    if not GEMINI_AVAILABLE:
        raise RuntimeError("google-genai package not installed. Install with: pip install google-genai")
    # If GEMINI_API_KEY is set, SDK picks it up automatically; we pass explicitly too.
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("Missing GEMINI_API_KEY env var. Set it in your environment or .env file.")
    return genai.Client(api_key=api_key)

def recommend_3_careers(enriched_courses: List[Dict[str, Any]]) -> Dict[str, Any]:
    # Sort by importance, take top ~12 signals to keep prompt small
    ranked = sorted(enriched_courses, key=lambda x: x.get("importance", 0), reverse=True)[:12]

    payload = {
        "courses": [
            {
                "title": c["title"],
                "grade": c.get("grade"),
                "strength": c.get("strength"),
                "uniqueness": c.get("uniqueness"),
                "importance": c.get("importance"),
                "description": c.get("catalog_description") or ""
            }
            for c in ranked
        ],
        "instructions": {
            "output_count": 3,
            "language_level": "simple",
            "must_explain": True
        }
    }

    prompt = f"""
Return ONLY valid JSON. No markdown, no backticks.

You are a career advisor. Provide exactly 3 career recommendations.

Use the input courses with these rules:
- Strength = higher grade (strength close to 1).
- Uniqueness = rare/specialized signals.
- Importance combines both; prioritize higher importance courses, but do not ignore strong secondary signals.

For each career include:
- title
- description: simple language, 2-3 sentences, no jargon.
- why_recommended: array of 3-6 bullet strings, each referencing specific course titles as evidence.
- confidence: number 0 to 1

Output schema:
{{
  "careers": [
    {{
      "title": "...",
      "description": "...",
      "why_recommended": ["...","..."],
      "confidence": 0.0
    }}
  ]
}}

Input:
{json.dumps(payload, ensure_ascii=False)}
"""

    client = _client()
    # Pick a fast model; adjust if you want higher quality later
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    resp = client.models.generate_content(
        model=model,
        contents=prompt,
    )

    text = (resp.text or "").strip()
    
    # Clean up JSON if wrapped in markdown code blocks
    if text.startswith("```"):
        lines = text.split("\n")
        text = "\n".join(lines[1:-1]) if len(lines) > 2 else text
    if text.startswith("```json"):
        lines = text.split("\n")
        text = "\n".join(lines[1:-1]) if len(lines) > 2 else text
    
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Failed to parse Gemini response as JSON: {e}\nResponse text: {text[:500]}")


def recommend_3_projects(career_title: str, career_description: str) -> Dict[str, Any]:
    """
    Generate 3 project recommendations based on the selected career path.
    Returns project details including name, description, difficulty, tech stack, and image URL.
    """
    prompt = f"""
Return ONLY valid JSON. No markdown, no backticks.

You are a project advisor. Based on the career path "{career_title}", recommend exactly 3 hands-on projects.

Career Description: {career_description}

For each project include:
- name: short, catchy project name
- description: 2-3 sentences explaining what the project does and why it's valuable for this career
- difficulty: "Beginner", "Intermediate", or "Advanced"
- tech_stack: array of 3-6 technologies/frameworks (e.g., ["Python", "Flask", "PostgreSQL"])
- estimated_hours: approximate hours to complete (number)
- learning_outcomes: array of 3-4 key skills learned

Output schema:
{{
  "projects": [
    {{
      "name": "...",
      "description": "...",
      "difficulty": "...",
      "tech_stack": ["...","..."],
      "estimated_hours": 0,
      "learning_outcomes": ["...","..."]
    }}
  ]
}}

Make projects diverse in difficulty and complementary to the career path.
"""

    client = _client()
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    resp = client.models.generate_content(
        model=model,
        contents=prompt,
    )

    text = (resp.text or "").strip()

    # Clean up JSON if wrapped in markdown code blocks
    if text.startswith("```"):
        lines = text.split("\n")
        text = "\n".join(lines[1:-1]) if len(lines) > 2 else text
    if text.startswith("```json"):
        lines = text.split("\n")
        text = "\n".join(lines[1:-1]) if len(lines) > 2 else text

    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Failed to parse Gemini response as JSON: {e}\nResponse text: {text[:500]}")
