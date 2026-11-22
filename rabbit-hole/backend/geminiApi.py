"""HTTP API and CLI for generating Gemini tasks and saving them to public.task.

The task table needs id (uuid), task-name (text), and overarching goal (text).
profiles.id is reserved for IDs already present in the referenced users table.
"""

import base64
import binascii
import json
import os
import uuid

import httpx2
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import errors, types
from pydantic import BaseModel, Field
from supabase import create_client

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not api_key:
    raise RuntimeError("GEMINI_API_KEY is not set in .env")
if not supabase_url or not supabase_key:
    raise RuntimeError(
        "Set SUPABASE_URL and SUPABASE_KEY in .env; SUPABASE_KEY must "
        "be a server-only secret or legacy service_role key"
    )


def check_server_key(key: str) -> str:
    """Catch publishable/anon credentials before attempting an insert."""
    key = key.strip()
    if key.startswith("sb_publishable_"):
        raise ValueError(
            "The Supabase key is publishable. Use a server-only sb_secret_ "
            "key or legacy service_role key."
        )
    if key.startswith("sb_secret_"):
        return key

    # Older Supabase keys are JWTs; inspect the role without printing the key.
    try:
        payload = key.split(".")[1]
        payload += "=" * (-len(payload) % 4)
        role = json.loads(base64.urlsafe_b64decode(payload))["role"]
    except (IndexError, ValueError, KeyError, binascii.Error) as exc:
        raise ValueError(
            "Expected a Supabase sb_secret_ key or a legacy service_role JWT"
        ) from exc
    if role != "service_role":
        raise ValueError(
            f"Supabase key has role {role!r}; use a server-only secret key "
            "or legacy service_role key, not an anon key"
        )
    return key


supabase_key = check_server_key(supabase_key)

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
TASK_TABLE = os.getenv("SUPABASE_TASK_TABLE", "task")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv(
            "FRONTEND_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000"
        ).split(",")
        if origin.strip()
    ],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


class GoalRequest(BaseModel):
    goal: str = Field(min_length=1, max_length=240)


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
    if not prompt or not prompt.strip():
        raise ValueError("Prompt cannot be empty")

    last_error: Exception | None = None
    response = None
    for model in MODELS:
        try:
            response = _call_gemini(model, prompt)
            print(f"[gemini] answered by {model}")
            break
        except errors.APIError as exc:
            if exc.code not in RETRYABLE_CODES:
                raise
            print(f"[gemini] {model} failed ({exc.code}), trying next model...")
            last_error = exc
        except httpx2.TimeoutException as exc:
            print(f"[gemini] {model} timed out, trying next model...")
            last_error = exc

    if response is None:
        raise RuntimeError(f"All Gemini models failed. Last error: {last_error}")
    if not response.text:
        raise ValueError("Gemini returned an empty response")

    try:
        result = json.loads(response.text)
    except json.JSONDecodeError as exc:
        raise ValueError("Gemini returned invalid JSON") from exc

    if isinstance(result, list):
        result = {"items": result}
    if not isinstance(result, dict):
        raise ValueError("Gemini response must be a JSON object or array")
    return result


def parse_tasks(result: dict) -> tuple[list[dict], list[str]]:
    """Assign a new UUID to each task description returned by Gemini."""
    tasks = result.get("tasks", result.get("items"))
    if not isinstance(tasks, list):
        raise ValueError("Gemini must return a 'tasks' array")

    task_rows = []
    for task in tasks:
        if not isinstance(task, dict) or not isinstance(task.get("description"), str):
            raise ValueError("Each task needs a description string")
        description = task["description"].strip()
        if not description:
            raise ValueError("Task descriptions cannot be empty")
        task_rows.append({"id": str(uuid.uuid4()), "description": description})

    if not task_rows:
        raise ValueError("Gemini returned no tasks")

    task_ids = [row["id"] for row in task_rows]
    return task_rows, task_ids


def get_overarching_goal(task_rows: list[dict]) -> str:
    """Use an exact supplied goal, or infer one from Gemini's task list."""
    specified_goal = os.getenv("OVERARCHING_GOAL", "").strip()
    if specified_goal:
        return specified_goal

    goal_prompt = (
        "Infer one short overarching goal that the following tasks could "
        "collectively achieve. Return JSON shaped like "
        '{"overarching_goal": "..."}. Tasks: '
        + json.dumps([row["description"] for row in task_rows])
    )
    goal_result = generate_json(goal_prompt)
    goal = goal_result.get("overarching_goal")
    if not isinstance(goal, str) or not goal.strip():
        raise ValueError("Gemini did not return an overarching goal")
    return goal.strip()


def save_tasks(task_rows: list[dict], overarching_goal: str) -> list[str]:
    """Save task IDs, names and goal; return IDs confirmed by Supabase."""
    if not task_rows:
        return []
    if not overarching_goal.strip():
        raise ValueError("Overarching goal cannot be empty")

    db_rows = [
        {
            "id": row["id"],
            "task-name": row["description"],
            "overarching goal": overarching_goal,
        }
        for row in task_rows
    ]
    response = supabase.table(TASK_TABLE).insert(db_rows).select("id").execute()
    inserted_ids = [row["id"] for row in response.data]
    if set(inserted_ids) != {row["id"] for row in task_rows}:
        raise RuntimeError("Supabase did not return all inserted task IDs")
    return inserted_ids


prompt = """
    Generate 3 small tasks that can help achieve a goal

    For each task include:
    - task_name
    - estimated_complete_time
    - description

    Return a JSON object shaped like: {"tasks": [{"description": "..."}]}
    """


@app.post("/generate-tasks")
def generate_tasks_for_goal(request: GoalRequest):
    goal = request.goal.strip()
    if not goal:
        raise HTTPException(status_code=400, detail="Goal cannot be empty")

    # The prompt variable above stays unchanged; the user's goal is passed
    # separately so Gemini generates tasks for their actual input.
    try:
        result = generate_json(f"User's overarching goal: {goal}\n\n{prompt}")
        task_rows, _ = parse_tasks(result)
    except (ValueError, RuntimeError, errors.APIError, httpx2.TimeoutException) as exc:
        raise HTTPException(status_code=502, detail="Could not generate tasks") from exc

    try:
        inserted_ids = save_tasks(task_rows, goal)
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Could not save tasks") from exc

    return {"goal": goal, "task_rows": task_rows, "task_ids": inserted_ids}


if __name__ == "__main__":
    result = generate_json(prompt)
    print(f"This is the prompt: {prompt}")
    task_rows, task_ids = parse_tasks(result)
    overarching_goal = get_overarching_goal(task_rows)

    print("Raw Gemini output:")
    print(json.dumps(result, indent=2))
    print("\nGenerated tasks and IDs:")
    print(json.dumps(task_rows, indent=2))
    print("\nOverarching goal:")
    print(overarching_goal)

    inserted_ids = save_tasks(task_rows, overarching_goal)
    print(f"\nIDs inserted into {TASK_TABLE}.id:")
    print(json.dumps(inserted_ids, indent=2))
