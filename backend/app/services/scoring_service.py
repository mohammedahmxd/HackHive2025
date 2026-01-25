import math
import re
from dataclasses import dataclass
from typing import Dict, List, Optional, Any

# ----- Grade -> strength -----
GRADE_POINTS = {
    "A+": 4.3, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "D-": 0.7,
    "F": 0.0
}
MAX_GPA = 4.3

WORD_RE = re.compile(r"[a-z0-9]+")

def clean_text(s: str) -> str:
    return " ".join((s or "").split())

def tokenize(text: str) -> List[str]:
    t = clean_text(text).lower().replace("&", "and")
    return WORD_RE.findall(t)

def strength_from_grade(grade: Optional[str]) -> float:
    if not grade:
        return 0.5  # neutral if missing/in progress
    g = grade.strip().upper()
    pts = GRADE_POINTS.get(g)
    if pts is None:
        return 0.5
    return max(0.0, min(1.0, pts / MAX_GPA))

@dataclass
class CatalogStats:
    N: int
    df: Dict[str, int]  # document frequency per token

def build_catalog_stats(courses: List[Dict[str, Any]]) -> CatalogStats:
    df: Dict[str, int] = {}
    N = 0
    for c in courses:
        title = c.get("title") or ""
        desc = c.get("description") or ""
        tokens = set(tokenize(title + " " + desc))
        if not tokens:
            continue
        N += 1
        for w in tokens:
            df[w] = df.get(w, 0) + 1
    return CatalogStats(N=N, df=df)

def uniqueness_idf(title: str, description: str, stats: CatalogStats) -> float:
    # IDF average over tokens; normalized to 0-1 using a soft cap
    tokens = tokenize(title + " " + (description or ""))
    if not tokens or stats.N <= 0:
        return 0.3  # mild default

    idfs = []
    for w in set(tokens):
        d = stats.df.get(w, 0)
        idf = math.log((stats.N + 1) / (d + 1))  # >= 0
        idfs.append(idf)

    avg = sum(idfs) / len(idfs)

    # Normalize: typical idf avg maybe 0.5-2.5 depending on corpus.
    # We'll squash into [0,1] with a soft scaling.
    scaled = 1 - math.exp(-avg)  # maps 0->0, 1->0.63, 2->0.86, 3->0.95
    return max(0.0, min(1.0, scaled))

def importance_score(strength: float, uniqueness: float, w_strength=0.65, w_unique=0.35) -> float:
    v = w_strength * strength + w_unique * uniqueness
    return max(0.0, min(1.0, v))
