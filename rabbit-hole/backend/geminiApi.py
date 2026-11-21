import os
import json

from dotenv import load_dotenv
from google import genai
from google.genai import types

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

# Select model
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")


def generate_json(prompt: str) -> dict:
    """
    Sends a prompt to Gemini and returns its response as a Python dictionary.

    If Gemini returns a JSON array, it is wrapped as {"items": [...]}
    so the result is always a dictionary.
    """

    if not prompt or not prompt.strip():
        raise ValueError("Prompt cannot be empty")

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.2,
        ),
    )

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


if __name__ == "__main__":
    prompt = """
    Generate 3 small tasks that can help achieve a goal

    For each task include:
    - task_name
    - estimated_complete_time
    - description

    Return a JSON object shaped like: {"tasks": [ ... ]}
    """

    result = generate_json(prompt)

    print(json.dumps(result, indent=2))