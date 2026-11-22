"""Generate task suggestions with Gemini and save them to Supabase.

Expected database shape:
  public.task: id (uuid primary key), description (text)
  public.profiles: id (uuid), tasks (jsonb array of task UUID strings)
"""

import json
import os
import uuid

import httpx
from dotenv import load_dotenv
from google import genai
from google.genai import errors, types
from supabase import create_client

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("GEMINI_API_KEY is not set in .env")

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
profile_id = os.getenv("SUPABASE_PROFILE_ID")
if not all((supabase_url, supabase_key, profile_id)):
    raise RuntimeError(
        "Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and "
        "SUPABASE_PROFILE_ID in .env"
    )

TASK_TABLE = os.getenv("SUPABASE_TASKS_TABLE", "task")
PROFILE_TABLE = os.getenv("SUPABASE_PROFILES_TABLE", "profiles")

client = genai.Client(
    api_key=api_key,
    http_options=types.HttpOptions(timeout=60_000),
)
supabase = create_client(supabase_url, supabase_key)

MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
FALLBACK_MODELS = [
    model.strip()
    for model in os.getenv(
        "GEMINI_FALLBACK_MODELS",
        "gemini-3.1-flash-lite,gemini-3.8-flash",
    ).split(",")
    if model.strip()
]
MODELS = [MODEL] + [model for model in FALLBACK_MODELS if model != MODEL]
RETRYABLE_CODES = {404, 429, 500, 503}


def call_gemini(model: str, prompt: str):
    return client.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.2,
        ),
    )


def generate_json(prompt: str) -> dict:
    if not prompt.strip():
        raise ValueError("Prompt cannot be empty")

    last_error = None
    response = None
    for model in MODELS:
        try:
            response = call_gemini(model, prompt)
            print(f"[gemini] answered by {model}")
            break
        except errors.APIError as exc:
            if exc.code not in RETRYABLE_CODES:
                raise
            print(f"[gemini] {model} failed ({exc.code}); trying next model")
            last_error = exc
        except httpx.TimeoutException as exc:
            print(f"[gemini] {model} timed out; trying next model")
            last_error = exc

    if response is None:
        raise RuntimeError(f"All Gemini models failed. Last error: {last_error}")
    if not response.text:
        raise ValueError("Gemini returned an empty response")

    try:
        result = json.loads(response.text)
    except json.JSONDecodeError as exc:
        raise ValueError(f"Gemini returned invalid JSON: {response.text}") from exc

    if isinstance(result, list):
        result = {"items": result}
    if not isinstance(result, dict):
        raise ValueError("Gemini response must be a JSON object or array")
    return result


def parse_tasks(result: dict) -> list[dict]:
    raw_tasks = result.get("tasks") or result.get("items") or []
    rows = []
    for task in raw_tasks:
        if not isinstance(task, dict):
            continue
        description = str(task.get("description", "")).strip()
        if description:
            rows.append({"id": str(uuid.uuid4()), "description": description})
    return rows


def save_tasks_and_profile_ids(task_rows: list[dict]) -> tuple[list[dict], list[str]]:
    if not task_rows:
        return [], []

    # Insert tasks first. IDs are generated above, and returned rows confirm success.
    inserted = supabase.table(TASK_TABLE).insert(task_rows).execute().data
    new_ids = [str(row["id"]) for row in inserted]

    profile = (
        supabase.table(PROFILE_TABLE)
        .select("tasks")
        .eq("id", profile_id)
        .single()
        .execute()
        .data
    )
    current_ids = profile.get("tasks") or []
    updated_ids = current_ids + new_ids

    supabase.table(PROFILE_TABLE).update({"tasks": updated_ids}).eq(
        "id", profile_id
    ).execute()
    return inserted, updated_ids


if __name__ == "__main__":
    prompt = """
    Generate 3 small tasks that can help achieve this goal: learn to cook.
    Order them from easiest to hardest. Each task should be one short,
    actionable sentence under 12 words. Return JSON shaped like:
    {"tasks": [{"description": "..."}]}
    """

    generated = generate_json(prompt)
    task_rows = parse_tasks(generated)
    print("Generated rows:")
    print(json.dumps(task_rows, indent=2))

    inserted_rows, profile_task_ids = save_tasks_and_profile_ids(task_rows)
    print(f"Inserted {len(inserted_rows)} tasks into {TASK_TABLE}.")
    print(f"Updated profile {profile_id}; task IDs: {profile_task_ids}")
