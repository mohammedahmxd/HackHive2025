import json
import re
from pathlib import Path
from typing import List, Dict, Any, Optional

DB_PATH = Path(__file__).resolve().parents[1] / "data" / "ontariotech_courses_db.json"

def clean_text(s: str) -> str:
    return " ".join((s or "").split())

def norm_title(title: str) -> str:
    t = clean_text(title).lower()
    t = t.replace("&", "and")
    t = re.sub(r"[^a-z0-9\s]", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t

class CatalogService:
    def __init__(self):
        if not DB_PATH.exists():
            self.courses: List[Dict[str, Any]] = []
            self.by_code: Dict[str, str] = {}
            self.by_title_norm: Dict[str, List[str]] = {}
            self.by_id: Dict[str, Dict[str, Any]] = {}
            return
        
        raw = json.loads(DB_PATH.read_text(encoding="utf-8"))
        self.courses: List[Dict[str, Any]] = raw.get("courses", [])
        self.by_code: Dict[str, str] = raw.get("indexes", {}).get("by_code", {})
        self.by_title_norm: Dict[str, List[str]] = raw.get("indexes", {}).get("by_title_norm", {})
        self.by_id: Dict[str, Dict[str, Any]] = {c["id"]: c for c in self.courses}

    def search_by_title(self, title: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Search courses by normalized title."""
        if not self.courses:
            return []
        
        q = norm_title(title)
        # exact normalized match first
        ids = self.by_title_norm.get(q, [])
        results = [self.by_id[i] for i in ids if i in self.by_id][:limit]
        if results:
            return results

        # fallback: substring search
        out = []
        for c in self.courses:
            if c.get("title_norm") and q in c["title_norm"]:
                out.append(c)
                if len(out) >= limit:
                    break
        return out

    def get_by_code(self, code: str) -> Optional[Dict[str, Any]]:
        """Get course by course code (e.g., 'CPS109')."""
        if not self.by_code:
            return None
        cid = self.by_code.get(code.upper())
        return self.by_id.get(cid) if cid else None

    def get_by_id(self, cid: str) -> Optional[Dict[str, Any]]:
        """Get course by internal ID."""
        return self.by_id.get(cid)

    def get_all_courses(self) -> List[Dict[str, Any]]:
        """Get all courses in the catalog."""
        return self.courses

    def is_loaded(self) -> bool:
        """Check if catalog data is loaded."""
        return len(self.courses) > 0

# Singleton instance
_catalog_service = None

def get_catalog_service() -> CatalogService:
    """Get or create the singleton catalog service instance."""
    global _catalog_service
    if _catalog_service is None:
        _catalog_service = CatalogService()
    return _catalog_service
