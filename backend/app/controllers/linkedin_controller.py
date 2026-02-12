from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import json

router = APIRouter()

# LinkedIn Jobs API (via RapidAPI - FREE)
import os
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY", "c535adefe0msh1ec28265d66ef67p158a96jsn9a1a799bd4da")
LINKEDIN_API_URL = "https://linkedin-job-search-api.p.rapidapi.com/active-jb-24h"


class JobSearchRequest(BaseModel):
    university: str
    program: str
    career_path: str
    location: str = "Canada"  # Default location


@router.post("/jobs/search")
def search_linkedin_jobs(request: JobSearchRequest):
    """
    Search for LinkedIn jobs using requests library.
    """
    try:
        print(f"\n{'='*60}")
        print(f"Searching LinkedIn Jobs")
        print(f"Career Path: {request.career_path}")
        print(f"Location: {request.location}")
        print(f"{'='*60}\n")

        # Build URL with proper filter parameters for /active-jb-24h endpoint
        title_filter = request.career_path
        location_filter = 'Canada'

        # Query parameters
        params = {
            'title_filter': title_filter,
            'location_filter': location_filter,
            'limit': 100,
            'offset': 0,
            'description_type': 'text'
        }

        # Headers for RapidAPI
        headers = {
            'x-rapidapi-host': 'linkedin-job-search-api.p.rapidapi.com',
            'x-rapidapi-key': RAPIDAPI_KEY
        }

        print(f"Using RAPIDAPI_KEY: {RAPIDAPI_KEY[:10]}...{RAPIDAPI_KEY[-10:]}")
        print(f"Making request to: {LINKEDIN_API_URL}")
        print(f"Params: {params}")

        # Make request using requests library
        response = requests.get(
            LINKEDIN_API_URL,
            params=params,
            headers=headers,
            timeout=30
        )

        print(f"Response status code: {response.status_code}")

        if response.status_code != 200:
            print(f"API returned non-200 status: {response.status_code}")
            print(f"Response text: {response.text[:500]}")
            raise HTTPException(
                status_code=response.status_code,
                detail=f"LinkedIn API returned status {response.status_code}: {response.text[:200]}"
            )

        # Parse JSON response
        try:
            jobs_data = response.json()
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON response")
            print(f"Response: {response.text[:500]}")
            raise HTTPException(
                status_code=500,
                detail=f"Invalid JSON response from API"
            )

        # Check for API quota errors
        if isinstance(jobs_data, dict) and "message" in jobs_data:
            error_msg = jobs_data.get("message", "")
            if "exceeded" in error_msg.lower() and "quota" in error_msg.lower():
                print(f"API Quota Error: {error_msg}")
                raise HTTPException(
                    status_code=429,
                    detail=f"LinkedIn API quota exceeded. The free tier monthly limit has been reached. Please upgrade your RapidAPI plan or wait until next month."
                )

        # Handle different response formats
        if isinstance(jobs_data, dict):
            jobs_list = jobs_data.get("data", jobs_data.get("jobs", []))
        else:
            jobs_list = jobs_data

        print(f"Retrieved {len(jobs_list)} jobs from LinkedIn API")

        # Format jobs
        formatted_jobs = []

        for job in jobs_list:
            # Map API fields to our format
            title = job.get("title", "")
            company = job.get("organization", "")

            # Extract location from locations_raw array
            location = "Canada"
            if job.get("locations_raw") and len(job.get("locations_raw", [])) > 0:
                address = job.get("locations_raw")[0].get("address", {})
                locality = address.get("addressLocality", "")
                region = address.get("addressRegion", "")
                country = address.get("addressCountry", "")

                if locality and region:
                    location = f"{locality}, {region}"
                elif locality:
                    location = locality
                elif region:
                    location = region
                elif country:
                    location = country

            if not title or not company:
                continue

            # Map employment_type array to string
            employment_type = "Full-time"
            if job.get("employment_type") and len(job.get("employment_type", [])) > 0:
                emp_type = job.get("employment_type")[0]
                if emp_type == "FULL_TIME":
                    employment_type = "Full-time"
                elif emp_type == "PART_TIME":
                    employment_type = "Part-time"
                elif emp_type == "INTERN":
                    employment_type = "Internship"
                elif emp_type == "CONTRACT":
                    employment_type = "Contract"

            formatted_jobs.append({
                "id": job.get("id", ""),
                "title": title,
                "company": company,
                "location": location,
                "description": (job.get("description", ""))[:500],
                "url": job.get("url", ""),
                "postedAt": job.get("date_posted", "Recently"),
                "employmentType": employment_type,
                "seniorityLevel": "Entry level",
                "companyLogo": job.get("organization_logo", "")
            })

        # Debug output
        print(f"\nFound {len(formatted_jobs)} jobs for {request.career_path}")
        if formatted_jobs:
            print(f"Sample jobs:")
            for i, job in enumerate(formatted_jobs[:5]):
                print(f"  {i+1}. {job['title']} at {job['company']} - {job['location']}")
            print(f"\nSample raw job data:")
            print(json.dumps(jobs_list[0] if jobs_list else {}, indent=2))
        else:
            print(f"No jobs found. Raw response:")
            print(json.dumps(jobs_data, indent=2)[:1000])

        print(f"\n{'='*60}\n")

        return {
            "success": True,
            "query": request.career_path,
            "university": request.university,
            "program": request.program,
            "careerPath": request.career_path,
            "jobCount": len(formatted_jobs),
            "jobs": formatted_jobs
        }

    except requests.Timeout:
        print(f"Request timeout error")
        raise HTTPException(status_code=408, detail="Request timed out")
    except requests.RequestException as e:
        print(f"Request error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Request error: {str(e)}")
    except HTTPException:
        # Re-raise HTTPExceptions (like quota errors) without wrapping
        raise
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")