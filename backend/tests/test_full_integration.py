"""
Full integration test showing how all services work together:
1. transcript_service - parses PDF
2. catalog_service - enriches course data
3. planner_service - generates plan from completed courses
"""
import os
import json
import sys
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from app.services.transcript_service import parse_transcript_pdf, get_completed_courses_from_transcript
from app.services.planner_service import generate_plan
from app.models.plan_schemas import PlanRequest

def find_transcript_file():
    """Find the transcript PDF file."""
    possible_paths = [
        "uploads/OTUTranscripts.pdf",
        "uploads/OTUTranscript.pdf",
        "OTUTranscripts.pdf",
        "OTUTranscript.pdf",
    ]
    
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
    print("=" * 70)
    print("Full Service Integration Test")
    print("=" * 70)
    print("\nThis test demonstrates:")
    print("1. transcript_service - Parses PDF transcript")
    print("2. catalog_service - Enriches courses with catalog data")
    print("3. planner_service - Generates plan from completed courses")
    print("=" * 70)
    
    # Find transcript file
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
    else:
        pdf_path = find_transcript_file()
        if not pdf_path:
            print("\n❌ Error: Could not find OTUTranscripts.pdf")
            print("Place it in backend/uploads/ or provide path as argument")
            return 1
    
    print(f"\n📄 Step 1: Parsing transcript with catalog enrichment")
    print(f"   File: {pdf_path}")
    print("-" * 70)
    
    try:
        # Step 1: Parse transcript (uses transcript_service, which uses pdf_text_service, 
        # course_extract_service, and catalog_service)
        filename = os.path.basename(pdf_path)
        transcript_result = parse_transcript_pdf(pdf_path, filename, enrich_with_catalog=True)
        
        print(f"✅ Parsed {len(transcript_result.courses)} courses")
        print(f"   Text extracted: {transcript_result.extracted_text_chars} characters")
        
        if transcript_result.warnings:
            print(f"\n⚠️  Warnings: {len(transcript_result.warnings)}")
            for w in transcript_result.warnings[:3]:  # Show first 3
                print(f"   - {w}")
        
        # Step 2: Extract completed courses for planner
        print(f"\n📋 Step 2: Extracting completed courses for planner")
        print("-" * 70)
        
        completed_courses = get_completed_courses_from_transcript(transcript_result)
        print(f"✅ Found {len(completed_courses)} completed courses:")
        for code in completed_courses[:10]:  # Show first 10
            print(f"   - {code}")
        if len(completed_courses) > 10:
            print(f"   ... and {len(completed_courses) - 10} more")
        
        # Step 3: Generate plan using planner_service
        print(f"\n🎓 Step 3: Generating academic plan")
        print("-" * 70)
        
        plan_request = PlanRequest(
            completed_courses=completed_courses,
            max_courses_per_term=5
        )
        
        plan_result = generate_plan(plan_request)
        
        print(f"✅ Generated plan with {len(plan_result.semesters)} semesters:")
        for sem in plan_result.semesters:
            print(f"\n   {sem.term}:")
            for course in sem.courses:
                print(f"      - {course}")
        
        if plan_result.notes:
            print(f"\n📝 Notes:")
            for note in plan_result.notes:
                print(f"   - {note}")
        
        # Create combined result
        combined_result = {
            "transcript": {
                "filename": transcript_result.filename,
                "extracted_text_chars": transcript_result.extracted_text_chars,
                "courses": [
                    {
                        "course_code": c.course_code,
                        "course_title": c.course_title,
                        "credits": c.credits,
                        "grade": c.grade,
                        "term": c.term,
                        "confidence": c.confidence,
                        "flags": c.flags
                    }
                    for c in transcript_result.courses
                ],
                "warnings": transcript_result.warnings
            },
            "completed_courses": completed_courses,
            "plan": {
                "semesters": [
                    {
                        "term": s.term,
                        "courses": s.courses
                    }
                    for s in plan_result.semesters
                ],
                "notes": plan_result.notes
            }
        }
        
        # Save to file
        output_file = backend_dir / "full_integration_result.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(combined_result, f, indent=2, ensure_ascii=False)
        
        print(f"\n💾 Full integration result saved to: {output_file}")
        print("\n" + "=" * 70)
        print("✅ Integration test complete!")
        print("=" * 70)
        
        return 0
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())
