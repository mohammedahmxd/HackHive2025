"""
Test script for transcript parser.
Place your OTUTranscripts.pdf file in the backend/uploads/ directory or specify the path.
"""
import os
import json
import sys
from pathlib import Path

# Add backend to path so we can import app modules
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from app.services.transcript_service import parse_transcript_pdf

def find_transcript_file():
    """Find the transcript PDF file."""
    # Check common locations
    possible_paths = [
        "../uploads/OTUTranscripts.pdf",
        "../uploads/OTUTranscript.pdf",
        "uploads/OTUTranscripts.pdf",
        "uploads/OTUTranscript.pdf",
    ]
    
    # Also check for any PDF in uploads
    uploads_dir = backend_dir / "uploads"
    if uploads_dir.exists():
        pdf_files = list(uploads_dir.glob("*.pdf"))
        if pdf_files:
            return str(pdf_files[0])
    
    for path in possible_paths:
        full_path = backend_dir / path
        if full_path.exists():
            return str(full_path)
    
    return None

def main():
    print("=" * 60)
    print("Transcript Parser Test")
    print("=" * 60)
    
    # Find the transcript file
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
        if not os.path.exists(pdf_path):
            print(f"Error: File not found: {pdf_path}")
            return
    else:
        pdf_path = find_transcript_file()
        if not pdf_path:
            print("Error: Could not find OTUTranscripts.pdf")
            print("\nPlease either:")
            print("1. Place OTUTranscripts.pdf in backend/uploads/")
            print("2. Run: python test_transcript_parser.py <path_to_pdf>")
            return
    
    print(f"\nProcessing: {pdf_path}")
    print("-" * 60)
    
    # Parse the transcript
    try:
        filename = os.path.basename(pdf_path)
        result = parse_transcript_pdf(pdf_path, filename)
        
        # Convert to dict for JSON serialization
        result_dict = {
            "filename": result.filename,
            "extracted_text_chars": result.extracted_text_chars,
            "university_name": result.university_name,
            "program_name": result.program_name,
            "total_credits_attempted": result.total_credits_attempted,
            "total_credits_earned": result.total_credits_earned,
            "study_year": result.study_year,
            "courses": [
                {
                    "course_code": course.course_code,
                    "course_title": course.course_title,
                    "credits": course.credits,
                    "grade": course.grade,
                    "term": course.term,
                    "confidence": course.confidence,
                    "flags": course.flags
                }
                for course in result.courses
            ],
            "warnings": result.warnings
        }
        
        # Print results
        print(f"\n✅ Parsing complete!")
        print(f"   Filename: {result.filename}")
        print(f"   Text extracted: {result.extracted_text_chars} characters")
        print(f"   Courses found: {len(result.courses)}")
        if result.university_name:
            print(f"   University: {result.university_name}")
        if result.program_name:
            print(f"   Program: {result.program_name}")
        print(f"   Total credits attempted: {result.total_credits_attempted}")
        print(f"   Total credits earned: {result.total_credits_earned}")
        if result.study_year:
            print(f"   Study year: {result.study_year}")
        print(f"   Warnings: {len(result.warnings)}")
        
        if result.warnings:
            print("\n⚠️  Warnings:")
            for warning in result.warnings:
                print(f"   - {warning}")
        
        if result.courses:
            print("\n📚 Extracted Courses:")
            for i, course in enumerate(result.courses, 1):
                print(f"\n   {i}. {course.course_code}")
                if course.course_title:
                    print(f"      Title: {course.course_title}")
                if course.credits:
                    print(f"      Credits: {course.credits}")
                if course.grade:
                    print(f"      Grade: {course.grade}")
                if course.term:
                    print(f"      Term: {course.term}")
                print(f"      Confidence: {course.confidence:.2f}")
                if course.flags:
                    print(f"      Flags: {', '.join(course.flags)}")
        
        # Save to JSON file
        output_file = backend_dir / "transcript_parse_result.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result_dict, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Results saved to: {output_file}")
        print("\n" + "=" * 60)
        print("JSON Output:")
        print("=" * 60)
        print(json.dumps(result_dict, indent=2, ensure_ascii=False))
        
    except Exception as e:
        print(f"\n❌ Error parsing transcript: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
