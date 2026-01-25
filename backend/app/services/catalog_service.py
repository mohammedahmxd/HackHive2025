import json
import re
from pathlib import Path
from typing import List, Dict, Any, Optional

try:
    from rapidfuzz import process, fuzz
    RAPIDFUZZ_AVAILABLE = True
except ImportError:
    RAPIDFUZZ_AVAILABLE = False

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
        
        # Cache list for fuzzy matching
        self._title_norm_list = [
            (c.get("title_norm") or norm_title(c.get("title", "")), c["id"])
            for c in self.courses if c.get("id")
        ]
        self._title_norm_only = [t for (t, _) in self._title_norm_list]

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
    
    def best_match_title(self, title: str, min_score: int = 80) -> Optional[Dict[str, Any]]:
        """Find best matching course by title using fuzzy matching."""
        if not self.courses:
            return None

        q = norm_title(title)

        # Exact normalized match first
        ids = self.by_title_norm.get(q, [])
        for cid in ids:
            if cid in self.by_id:
                return self.by_id[cid]

        if not RAPIDFUZZ_AVAILABLE:
            # Fallback to substring search if rapidfuzz not available
            for c in self.courses:
                if c.get("title_norm") and q in c.get("title_norm", ""):
                    return c
            return None

        if not self._title_norm_only:
            return None

        hit = process.extractOne(q, self._title_norm_only, scorer=fuzz.token_set_ratio)
        if not hit:
            return None
        _, score, idx = hit
        if score < min_score:
            return None

        best_id = self._title_norm_list[idx][1]
        return self.by_id.get(best_id)

# Singleton instance
_catalog_service = None

def get_catalog_service() -> CatalogService:
    """Get or create the singleton catalog service instance."""
    global _catalog_service
    if _catalog_service is None:
        _catalog_service = CatalogService()
    return _catalog_service
