from typing import Tuple, List
import os

def _rows_from_words(words, y_tol=3):
    """
    Group words into rows by their top y coordinate (pdfplumber word dict has 'top', 'x0').
    This helps reconstruct table-like layouts where columns might be lost.
    """
    if not words:
        return []

    # sort top-to-bottom then left-to-right
    words = sorted(words, key=lambda w: (round(w["top"]), w["x0"]))

    rows = []
    current = []
    current_y = None

    for w in words:
        y = w["top"]
        if current_y is None or abs(y - current_y) <= y_tol:
            current.append(w)
            current_y = y if current_y is None else current_y
        else:
            rows.append(current)
            current = [w]
            current_y = y

    if current:
        rows.append(current)

    # join each row left-to-right
    lines = []
    for row in rows:
        row_sorted = sorted(row, key=lambda w: w["x0"])
        line = " ".join(w["text"] for w in row_sorted).strip()
        if line:
            lines.append(line)
    return lines

def extract_text_from_pdf(pdf_path: str) -> Tuple[str, List[str]]:
    """
    Extract text from a PDF file using pdfplumber (preferred) or PyPDF2 (fallback).
    Uses layout-aware extraction and word-based row reconstruction to capture
    table columns that might be lost in simple text extraction.
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        Tuple of (extracted_text, warnings)
    """
    warnings = []
    text = ""

    if not os.path.exists(pdf_path):
        warnings.append(f"PDF file not found: {pdf_path}")
        return text, warnings

    # Try pdfplumber first (better for tables and formatted text)
    try:
        import pdfplumber
        with pdfplumber.open(pdf_path) as pdf:
            pages_text = []
            for page in pdf.pages:
                # 1) Try layout-aware extraction
                page_text = page.extract_text(layout=True)
                if page_text and len(page_text.strip()) > 50:
                    pages_text.append(page_text)
                    continue

                # 2) Fallback: reconstruct rows from words (captures columns)
                words = page.extract_words(keep_blank_chars=False, use_text_flow=True)
                lines = _rows_from_words(words)
                if lines:
                    pages_text.append("\n".join(lines))

            text = "\n".join(pages_text).strip()
            if text:
                return text, warnings
    except ImportError:
        warnings.append("pdfplumber not installed, trying PyPDF2")
    except Exception as e:
        warnings.append(f"pdfplumber error: {str(e)}, trying PyPDF2")

    # Fallback to PyPDF2
    try:
        import PyPDF2
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            pages_text = []
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                page_text = page.extract_text()
                if page_text:
                    pages_text.append(page_text)
            text = "\n".join(pages_text)
    except ImportError:
        warnings.append("PyPDF2 not installed. Install with: pip install PyPDF2 pdfplumber")
    except Exception as e:
        warnings.append(f"Error extracting PDF text: {str(e)}")

    if not text:
        warnings.append("No text could be extracted from PDF")

    return text, warnings
