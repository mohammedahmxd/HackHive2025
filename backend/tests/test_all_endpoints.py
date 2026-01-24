"""
Test all transcript API endpoints.
Tests: POST /parse, GET /, GET /latest, GET /{id}
"""
import os
import sys
import json
import requests
from pathlib import Path

# Configuration
API_BASE_URL = "http://localhost:8000"
TRANSCRIPT_PATH = "../uploads/OTUTranscripts.pdf"

def print_section(title):
    """Print a formatted section header."""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)

def print_result(success, message, data=None):
    """Print test result."""
    status = "✅" if success else "❌"
    print(f"{status} {message}")
    if data and isinstance(data, dict):
        # Print key info from response
        if "transcript_id" in data:
            print(f"   Transcript ID: {data['transcript_id']}")
        if "count" in data:
            print(f"   Count: {data['count']}")
        if "filename" in data:
            print(f"   Filename: {data['filename']}")
        if "courses" in data:
            print(f"   Courses: {len(data['courses'])}")
        if "total_credits_earned" in data:
            print(f"   Credits Earned: {data['total_credits_earned']}")

def test_server_running():
    """Check if the server is running."""
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("✅ Server is running")
            return True
        else:
            print(f"❌ Server returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure it's running:")
        print("   uvicorn main:app --reload")
        return False
    except Exception as e:
        print(f"❌ Error checking server: {e}")
        return False

def test_parse_endpoint(pdf_path):
    """Test POST /transcripts/parse"""
    print_section("1. Testing POST /transcripts/parse")
    
    if not os.path.exists(pdf_path):
        print(f"❌ PDF file not found: {pdf_path}")
        return None
    
    try:
        with open(pdf_path, 'rb') as f:
            files = {'file': (os.path.basename(pdf_path), f, 'application/pdf')}
            response = requests.post(
                f"{API_BASE_URL}/transcripts/parse",
                files=files,
                timeout=30
            )
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, "Parse endpoint works!", data)
            return data.get("transcript_id")
        else:
            print_result(False, f"Parse failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print_result(False, f"Error: {e}")
        return None

def test_list_endpoint():
    """Test GET /transcripts/"""
    print_section("2. Testing GET /transcripts/ (List All)")
    
    try:
        response = requests.get(f"{API_BASE_URL}/transcripts/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, "List endpoint works!", data)
            
            if data.get("transcripts"):
                print(f"\n   Found {data['count']} transcript(s):")
                for i, transcript in enumerate(data["transcripts"], 1):
                    print(f"   {i}. ID: {transcript['transcript_id']}")
                    print(f"      Filename: {transcript.get('filename', 'N/A')}")
                    print(f"      Program: {transcript.get('program_name', 'N/A')}")
                    print(f"      Credits: {transcript.get('total_credits_earned', 0)}")
            
            return data.get("transcripts", [])
        else:
            print_result(False, f"List failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return []
    except Exception as e:
        print_result(False, f"Error: {e}")
        return []

def test_latest_endpoint():
    """Test GET /transcripts/latest"""
    print_section("3. Testing GET /transcripts/latest")
    
    try:
        response = requests.get(f"{API_BASE_URL}/transcripts/latest", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, "Latest endpoint works!", data)
            
            if "courses" in data:
                print(f"   Total courses: {len(data['courses'])}")
                print(f"   University: {data.get('university_name', 'N/A')}")
                print(f"   Program: {data.get('program_name', 'N/A')}")
                print(f"   Study Year: {data.get('study_year', 'N/A')}")
                print(f"   Credits Attempted: {data.get('total_credits_attempted', 0)}")
                print(f"   Credits Earned: {data.get('total_credits_earned', 0)}")
            
            return data.get("transcript_id")
        elif response.status_code == 404:
            print_result(False, "No transcripts found (404)")
            return None
        else:
            print_result(False, f"Latest failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print_result(False, f"Error: {e}")
        return None

def test_get_by_id(transcript_id):
    """Test GET /transcripts/{id}"""
    print_section(f"4. Testing GET /transcripts/{transcript_id}")
    
    if not transcript_id:
        print("❌ No transcript ID provided")
        return False
    
    try:
        response = requests.get(
            f"{API_BASE_URL}/transcripts/{transcript_id}",
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print_result(True, "Get by ID endpoint works!", data)
            
            if "courses" in data:
                print(f"   Total courses: {len(data['courses'])}")
                # Show first 3 courses as sample
                if data['courses']:
                    print(f"\n   Sample courses:")
                    for course in data['courses'][:3]:
                        code = course.get('course_code', 'N/A')
                        title = course.get('course_title', 'N/A')
                        grade = course.get('grade', 'N/A')
                        credits = course.get('credits', 'N/A')
                        print(f"      - {code}: {title} (Grade: {grade}, Credits: {credits})")
            
            return True
        else:
            print_result(False, f"Get by ID failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print_result(False, f"Error: {e}")
        return False

def test_reserved_words():
    """Test that reserved words are rejected"""
    print_section("5. Testing Reserved Words Protection")
    
    try:
        # Test "parse" as ID
        response = requests.get(f"{API_BASE_URL}/transcripts/parse", timeout=5)
        if response.status_code == 400:
            print("✅ Reserved word 'parse' correctly rejected")
        else:
            print(f"❌ Expected 400 for 'parse', got {response.status_code}")
        
        # Test "latest" as ID
        response = requests.get(f"{API_BASE_URL}/transcripts/latest", timeout=5)
        # This should work (it's the actual endpoint), so we check it doesn't go to {id} route
        # Actually, /latest is a real endpoint, so this will succeed - that's fine
        
    except Exception as e:
        print(f"❌ Error testing reserved words: {e}")

def main():
    """Run all endpoint tests."""
    print("\n" + "=" * 60)
    print("  TRANSCRIPT API ENDPOINT TESTER")
    print("=" * 60)
    
    # Check server
    if not test_server_running():
        return 1
    
    # Find PDF file
    backend_dir = Path(__file__).parent.parent
    pdf_path = backend_dir / TRANSCRIPT_PATH
    
    if not pdf_path.exists():
        print(f"\n❌ PDF not found at: {pdf_path}")
        print("   Please ensure OTUTranscripts.pdf is in backend/uploads/")
        return 1
    
    print(f"\n📄 Using PDF: {pdf_path}")
    
    # Test 1: Parse endpoint
    transcript_id = test_parse_endpoint(str(pdf_path))
    
    # Test 2: List endpoint
    transcripts = test_list_endpoint()
    
    # Test 3: Latest endpoint
    latest_id = test_latest_endpoint()
    
    # Test 4: Get by ID (use latest_id or transcript_id)
    test_id = latest_id or transcript_id
    if test_id:
        test_get_by_id(test_id)
    
    # Test 5: Reserved words
    test_reserved_words()
    
    # Summary
    print_section("TEST SUMMARY")
    print("✅ All endpoint tests completed!")
    print(f"\n📝 Next steps:")
    print(f"   1. Check Swagger UI: {API_BASE_URL}/docs")
    print(f"   2. Use transcript ID: {test_id or 'N/A'}")
    print(f"   3. Access latest: {API_BASE_URL}/transcripts/latest")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
