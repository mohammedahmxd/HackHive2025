"""
Test Gemini-related endpoints: /enrich/courses and /recommend/careers
"""
import requests
import json
from pathlib import Path

API_BASE_URL = "http://localhost:8000"

def print_section(title):
    """Print a formatted section header."""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)

def test_server_running():
    """Check if the server is running."""
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            print("OK: Server is running")
            return True
        else:
            print(f"ERROR: Server returned status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("ERROR: Cannot connect to server. Make sure it's running:")
        print("   uvicorn main:app --reload")
        return False

def test_enrich_endpoint():
    """Test POST /enrich/courses"""
    print_section("Testing /enrich/courses")
    
    test_courses = [
        {"title": "Intro to Computer Science", "grade": "A+", "term": "Fall 2023"},
        {"title": "Data Structures", "grade": "A", "term": "Winter 2024"},
        {"title": "Calculus I", "grade": "B+", "term": "Fall 2023"}
    ]
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/enrich/courses",
            json={"courses": test_courses},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print("OK: Enrich endpoint works!")
            print(f"   Enriched {len(data.get('results', []))} courses")
            
            # Show first result
            if data.get('results'):
                first = data['results'][0]
                print(f"\n   Example result:")
                print(f"   - Title: {first.get('title')}")
                print(f"   - Matched: {first.get('matched')}")
                print(f"   - Strength: {first.get('strength')}")
                print(f"   - Uniqueness: {first.get('uniqueness')}")
                print(f"   - Importance: {first.get('importance')}")
                return data.get('results', [])
            return []
        else:
            print(f"ERROR: Enrich endpoint failed: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            return []
    except Exception as e:
        print(f"ERROR: Error testing enrich endpoint: {e}")
        return []

def test_recommend_endpoint(enriched_courses):
    """Test POST /recommend/careers"""
    print_section("Testing /recommend/careers")
    
    if not enriched_courses:
        print("⚠️  No enriched courses available. Creating sample data...")
        enriched_courses = [
            {
                "title": "Intro to Computer Science",
                "grade": "A+",
                "term": "Fall 2023",
                "matched": True,
                "strength": 1.0,
                "uniqueness": 0.65,
                "importance": 0.88,
                "catalog_description": "Fundamentals of programming and computer science"
            },
            {
                "title": "Data Structures",
                "grade": "A",
                "term": "Winter 2024",
                "matched": True,
                "strength": 0.93,
                "uniqueness": 0.70,
                "importance": 0.85,
                "catalog_description": "Advanced data structures and algorithms"
            }
        ]
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/recommend/careers",
            json={"courses": enriched_courses},
            timeout=60  # Gemini API might take longer
        )
        
        if response.status_code == 200:
            data = response.json()
            print("OK: Recommend endpoint works!")
            
            if 'careers' in data:
                careers = data['careers']
                print(f"   Received {len(careers)} career recommendations\n")
                
                for i, career in enumerate(careers, 1):
                    print(f"   Career {i}:")
                    print(f"   - Title: {career.get('title', 'N/A')}")
                    print(f"   - Confidence: {career.get('confidence', 'N/A')}")
                    if 'description' in career:
                        desc = career['description'][:100]
                        print(f"   - Description: {desc}...")
                    if 'why_recommended' in career:
                        reasons = career['why_recommended']
                        print(f"   - Reasons: {len(reasons)} points")
                        for reason in reasons[:2]:  # Show first 2
                            print(f"     • {reason[:60]}...")
                    print()
                return True
            else:
                print(f"WARNING: Response missing 'careers' key")
                print(f"   Response: {json.dumps(data, indent=2)[:500]}")
                return False
        else:
            print(f"ERROR: Recommend endpoint failed: {response.status_code}")
            try:
                error_detail = response.json()
                print(f"   Error detail: {error_detail}")
            except:
                print(f"   Response: {response.text[:500]}")
            return False
    except requests.exceptions.Timeout:
        print("ERROR: Request timed out (Gemini API might be slow)")
        return False
    except Exception as e:
        print(f"ERROR: Error testing recommend endpoint: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("  Gemini Endpoints Test")
    print("=" * 60)
    
    # Check server
    if not test_server_running():
        return
    
    # Test enrich
    enriched = test_enrich_endpoint()
    
    # Test recommend
    test_recommend_endpoint(enriched)
    
    print_section("Test Complete")
    print("OK: All tests finished!")

if __name__ == "__main__":
    main()
