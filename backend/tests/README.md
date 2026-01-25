# Test Scripts

This directory contains test scripts for the PathPilot backend.

## Available Tests

### `test_transcript_parser.py`
Tests the transcript parsing service directly (without API).

**Usage:**
```bash
python tests/test_transcript_parser.py
# Or with specific file:
python tests/test_transcript_parser.py path/to/transcript.pdf
```

### `test_all_endpoints.py`
Tests all API endpoints (requires server to be running).

**Usage:**
1. Start server: `uvicorn main:app --reload`
2. Run test: `python tests/test_all_endpoints.py`

### `test_full_integration.py`
Tests the full integration of all services working together.

**Usage:**
```bash
python tests/test_full_integration.py
```

## Running Tests

Make sure the server is running for endpoint tests:

```bash
# Terminal 1: Start server
cd backend
uvicorn main:app --reload

# Terminal 2: Run tests
cd backend
python tests/test_all_endpoints.py
```
