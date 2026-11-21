
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
client = genai.Client(api_key=api_key)

# Select model
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


def generate_json(prompt: str) -> dict:
    """
    Sends a prompt to Gemini and returns its response as a Python dictionary.

    Args:
        prompt: Instructions describing what Gemini should generate.

    Returns:
        A Python dictionary containing Gemini's JSON response.
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

    if not isinstance(result, dict):
        raise ValueError("Gemini response must be a JSON object")

    return result


if __name__ == "__main__":
    prompt = """
    Generate information about three popular programming languages.

    For each language, include:
    - name
    - creator
    - year_created
    - primary_uses
    - description

    Return the information as a JSON object.
    """

    result = generate_json(prompt)

    print(json.dumps(result, indent=2))
