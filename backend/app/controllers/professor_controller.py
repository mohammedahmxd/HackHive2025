from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import subprocess
import json

router = APIRouter()

# Ontario Tech University ID on RateMyProfessor
ONTARIO_TECH_ID = 4714

class ProfessorSearchRequest(BaseModel):
    query: str
    university_id: int = ONTARIO_TECH_ID


@router.get("/search")
def search_professors(query: str = ""):
    """
    Search for professors at Ontario Tech University using Rate My Professor API.
    """
    try:
        print(f"\n{'='*60}")
        print(f"Searching Rate My Professor")
        print(f"University ID: {ONTARIO_TECH_ID}")
        print(f"Query: {query}")
        print(f"{'='*60}\n")

        # Rate My Professor GraphQL API
        url = "https://www.ratemyprofessors.com/graphql"

        # GraphQL query to search for professors
        graphql_query = """
        query NewSearchTeachersQuery($query: TeacherSearchQuery!) {
          newSearch {
            teachers(query: $query, first: 100) {
              edges {
                node {
                  id
                  legacyId
                  firstName
                  lastName
                  school {
                    name
                    id
                  }
                  department
                  avgRating
                  numRatings
                  wouldTakeAgainPercent
                  avgDifficulty
                }
              }
            }
          }
        }
        """

        # Variables for the query
        variables = {
            "query": {
                "text": query,
                "schoolID": "U2Nob29sLTQ3MTQ=",  # Base64 encoded school ID for Ontario Tech
                "fallback": True
            }
        }

        # Prepare the GraphQL request body
        request_body = {
            "query": graphql_query,
            "variables": variables
        }

        # Use curl via subprocess (bypasses Python DNS/SSL issues)
        curl_command = [
            'curl',
            '--request', 'POST',
            '--url', url,
            '--header', 'Content-Type: application/json',
            '--header', 'Authorization: Basic dGVzdDp0ZXN0',
            '--header', 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            '--data', json.dumps(request_body),
            '--silent'
        ]

        print(f"Executing curl command for RateMyProfessor...")

        result = subprocess.run(
            curl_command,
            capture_output=True,
            text=True,
            timeout=15
        )

        if result.returncode != 0:
            print(f"curl failed with code {result.returncode}")
            print(f"stderr: {result.stderr}")
            raise HTTPException(
                status_code=500,
                detail=f"curl command failed: {result.stderr}"
            )

        # Parse JSON response
        try:
            data = json.loads(result.stdout)
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON response")
            print(f"Response: {result.stdout[:500]}")
            raise HTTPException(
                status_code=500,
                detail=f"Invalid JSON response from API"
            )

        # Extract professors from response
        professors = []
        edges = data.get("data", {}).get("newSearch", {}).get("teachers", {}).get("edges", [])

        for edge in edges:
            node = edge.get("node", {})

            # Only include professors with ratings
            if node.get("numRatings", 0) > 0:
                professors.append({
                    "id": node.get("legacyId"),
                    "firstName": node.get("firstName", ""),
                    "lastName": node.get("lastName", ""),
                    "department": node.get("department", "Unknown"),
                    "avgRating": round(float(node.get("avgRating", 0)), 1),
                    "numRatings": node.get("numRatings", 0),
                    "wouldTakeAgainPercent": round(float(node.get("wouldTakeAgainPercent", 0)), 1) if node.get("wouldTakeAgainPercent") else None,
                    "avgDifficulty": round(float(node.get("avgDifficulty", 0)), 1),
                    "school": node.get("school", {}).get("name", "Ontario Tech University")
                })

        print(f"Found {len(professors)} professors")

        if professors:
            print(f"\nSample professors:")
            for i, prof in enumerate(professors[:5]):
                print(f"  {i+1}. {prof['firstName']} {prof['lastName']} - {prof['department']} - Rating: {prof['avgRating']}/5")

        print(f"\n{'='*60}\n")

        return {
            "success": True,
            "count": len(professors),
            "professors": professors
        }

    except subprocess.TimeoutExpired:
        print(f"Request timeout error")
        raise HTTPException(status_code=408, detail="Request timed out")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.get("/top")
def get_top_professors(limit: int = 20):
    """
    Get top-rated professors at Ontario Tech University.
    """
    try:
        print(f"\n{'='*60}")
        print(f"Fetching Top Professors")
        print(f"University ID: {ONTARIO_TECH_ID}")
        print(f"{'='*60}\n")

        # Search with empty query to get all professors, then sort by rating
        result = search_professors(query="")

        # Sort professors by rating (descending) and number of ratings
        professors = result["professors"]
        professors.sort(key=lambda x: (x["avgRating"], x["numRatings"]), reverse=True)

        # Return top N professors
        top_professors = professors[:limit]

        print(f"Returning top {len(top_professors)} professors")
        print(f"\n{'='*60}\n")

        return {
            "success": True,
            "count": len(top_professors),
            "professors": top_professors
        }

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
