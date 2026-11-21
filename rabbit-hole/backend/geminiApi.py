import os
import json
import uuid

import httpx2
from dotenv import load_dotenv
from google import genai
from google.genai import errors, types

load_dotenv()

# Get API key from .env
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY is not set in .env")

# Initialize Gemini client
client = genai.Client(
    api_key=api_key,
    http_options=types.HttpOptions(timeout=60_000),  # 60 seconds, in milliseconds
)

# Main model first, then fallbacks in order
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
FALLBACK_MODELS = [
    m.strip()
    for m in os.getenv(
        "GEMINI_FALLBACK_MODELS",
        "gemini-3.1-flash-lite,gemini-3.8-flash",
    ).split(",")
    if m.strip()
]
MODELS = [MODEL] + [m for m in FALLBACK_MODELS if m != MODEL]

# Error codes that mean "try another model"
# 429 = rate limited, 500/503 = overloaded or server error, 404 = model not available
RETRYABLE_CODES = {404, 429, 500, 503}


def _call_gemini(model: str, prompt: str):
    return client.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.2,
        ),
    )


def generate_json(prompt: str) -> dict:
    """
    Sends a prompt to Gemini and returns its response as a Python dictionary.

    Tries each model in MODELS until one succeeds. If Gemini returns a
    JSON array, it is wrapped as {"items": [...]}.
    """

    if not prompt or not prompt.strip():
        raise ValueError("Prompt cannot be empty")

    last_error: Exception | None = None
    response = None

    for model in MODELS:
        try:
            response = _call_gemini(model, prompt)
            print(f"[gemini] answered by {model}")
            break
        except errors.APIError as e:
            if e.code in RETRYABLE_CODES:
                print(f"[gemini] {model} failed ({e.code}), trying next model...")
                last_error = e
                continue
            raise  # e.g. 400 bad request or 401/403 bad API key: switching won't help
        except httpx2.TimeoutException as e:
            print(f"[gemini] {model} timed out, trying next model...")
            last_error = e
            continue

    if response is None:
        raise RuntimeError(f"All Gemini models failed. Last error: {last_error}")

    if not response.text:
        raise ValueError("Gemini returned an empty response")

    try:
        result = json.loads(response.text)
    except json.JSONDecodeError as e:
        raise ValueError(
            f"Gemini returned invalid JSON: {response.text}"
        ) from e

    # Gemini sometimes returns a list instead of an object: wrap it
    if isinstance(result, list):
        result = {"items": result}

    if not isinstance(result, dict):
        raise ValueError("Gemini response must be a JSON object or array")

    return result

def parse_tasks(tasks_json: str) -> tuple[list[dict], list[str]]:
    """
    Parses Gemini's tasks JSON string into values ready for Supabase.

    Returns:
        task_rows: rows for the tasks table -> [{"id": ..., "description": ...}, ...]
        task_ids:  the id-only list         -> ["id1", "id2", "id3"]
    """
    data = json.loads(tasks_json)

    raw_tasks = data.get("tasks") or data.get("items") or []

    task_rows: list[dict] = []
    for task in raw_tasks:
        if not isinstance(task, dict):
            continue
        description = str(task.get("description", "")).strip()
        if not description:
            continue
        task_rows.append({
            "id": str(uuid.uuid4()),
            "description": description,
        })

    task_ids = [row["id"] for row in task_rows]

    return task_rows, task_ids


if __name__ == "__main__":
    prompt = """
    Generate 3 small tasks that can help achieve this goal: learn to cook

    Order them from easiest to hardest.
    Each task has only a description: one short, actionable sentence
    (under 12 words).

    Return a JSON object shaped like: {"tasks": [{"description": "..."}]}
    """

    result = generate_json(prompt)
    tasks_json = json.dumps(result, indent=2)

    task_rows, task_ids = parse_tasks(tasks_json)

    print("Raw Gemini output:")
    print(tasks_json)

    print("\nRows for the tasks table:")
    print(json.dumps(task_rows, indent=2))

    print("\nTask id list:")
    print(task_ids)