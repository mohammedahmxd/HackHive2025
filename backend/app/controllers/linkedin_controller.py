from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import time
import asyncio

router = APIRouter()

# Apify API Configuration
import os
APIFY_TOKEN = os.getenv("APIFY_API_TOKEN", "your_apify_token_here")
APIFY_ACTOR_ID = "fantastic-jobs~advanced-linkedin-job-search-api"


class JobSearchRequest(BaseModel):
    university: str
    program: str
    career_path: str
    location: str = "Canada"  # Default location


@router.post("/jobs/search")
async def search_linkedin_jobs(request: JobSearchRequest):
    """
    Search for LinkedIn jobs based on university, program, and career path.
    Uses Apify's LinkedIn Job Search API.
    """
    try:
        # Build search query based on career path and program
        search_query = f"{request.career_path} {request.program}"

        # Apify API URL - exactly as it works in Postman
        apify_url = f"https://api.apify.com/v2/acts/{APIFY_ACTOR_ID}/runs"

        # Headers - using Bearer token exactly like Postman
        headers = {
            "Authorization": f"Bearer {APIFY_TOKEN}",
            "Content-Type": "application/json"
        }

        # Request body - matching your Postman format exactly
        actor_input = {
            "keywords": search_query,
            "location": request.location,
            "remote": True,
            "maxResults": 20,
            "sortBy": "date"
        }

        print(f"Starting Apify job search for: {search_query}")
        print(f"Request body: {actor_input}")

        # Use httpx with better DNS handling
        async with httpx.AsyncClient(verify=False, timeout=30.0) as client:
            response = await client.post(
                apify_url,
                json=actor_input,
                headers=headers
            )

        print(f"Apify response status: {response.status_code}")

        if response.status_code != 201:
            print(f"Apify API error: {response.status_code} - {response.text}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to start Apify actor: {response.status_code} - {response.text}"
            )

        run_data = response.json()
        run_id = run_data["data"]["id"]
        print(f"Apify run started with ID: {run_id}")

        # Wait for the actor to finish (max 90 seconds)
        dataset_id = None
        async with httpx.AsyncClient(verify=False, timeout=30.0) as client:
            for attempt in range(45):  # Check every 2 seconds for 90 seconds
                await asyncio.sleep(2)

                status_url = f"https://api.apify.com/v2/acts/{APIFY_ACTOR_ID}/runs/{run_id}"
                status_response = await client.get(status_url, headers=headers)

                if status_response.status_code == 200:
                    status_data = status_response.json()
                    run_status = status_data["data"]["status"]

                    print(f"Actor run status (attempt {attempt + 1}): {run_status}")

                    if run_status == "SUCCEEDED":
                        dataset_id = status_data["data"]["defaultDatasetId"]
                        print(f"Actor succeeded! Dataset ID: {dataset_id}")
                        break
                    elif run_status in ["FAILED", "ABORTED", "TIMED-OUT"]:
                        raise HTTPException(
                            status_code=500,
                            detail=f"Apify actor failed with status: {run_status}"
                        )

            if not dataset_id:
                raise HTTPException(
                    status_code=408,
                    detail="Job search timed out. The API is taking too long to respond."
                )

            # Get the results from the dataset
            dataset_url = f"https://api.apify.com/v2/datasets/{dataset_id}/items"
            dataset_response = await client.get(dataset_url, headers=headers)

            if dataset_response.status_code != 200:
                print(f"Failed to get dataset: {dataset_response.status_code} - {dataset_response.text}")
                raise HTTPException(
                    status_code=500,
                    detail="Failed to retrieve job results"
                )

            jobs = dataset_response.json()
            print(f"Retrieved {len(jobs)} jobs from Apify")

        # Format and return jobs - handle different field names from Apify
        formatted_jobs = []
        for job in jobs[:20]:  # Limit to 20 jobs
            # Try different field names for company
            company_name = (
                job.get("company") or
                job.get("companyName") or
                job.get("company_name") or
                job.get("employer") or
                "Company Name Not Available"
            )

            # Try different field names for other fields
            job_title = job.get("title") or job.get("jobTitle") or job.get("job_title") or "Position Available"
            job_location = job.get("location") or job.get("jobLocation") or job.get("place") or request.location
            job_url = job.get("url") or job.get("link") or job.get("jobUrl") or ""

            formatted_jobs.append({
                "id": job.get("id", ""),
                "title": job_title,
                "company": company_name,
                "location": job_location,
                "description": (job.get("description") or job.get("jobDescription") or "")[:500],
                "url": job_url,
                "postedAt": job.get("postedAt") or job.get("postedDate") or job.get("date") or "Recently",
                "employmentType": job.get("employmentType") or job.get("jobType") or "Full-time",
                "seniorityLevel": job.get("seniorityLevel") or job.get("experienceLevel") or "Entry level",
                "companyLogo": job.get("companyLogo") or job.get("logo") or ""
            })

        # Debug: print first job to see structure
        if jobs:
            print(f"Sample job data: {jobs[0]}")

        return {
            "success": True,
            "query": search_query,
            "university": request.university,
            "program": request.program,
            "careerPath": request.career_path,
            "jobCount": len(formatted_jobs),
            "jobs": formatted_jobs
        }

    except httpx.TimeoutException:
        print(f"Request timeout error")
        raise HTTPException(status_code=408, detail="Request timed out")
    except httpx.HTTPError as e:
        print(f"HTTP exception: {str(e)}")
        raise HTTPException(status_code=500, detail=f"API request failed: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
