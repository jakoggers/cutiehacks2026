from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from geminiApi import generate_json  # your existing function

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PromptRequest(BaseModel):
    prompt: str


@app.post("/api/generate")
def generate(req: PromptRequest) -> dict:
    try:
        return generate_json(req.prompt)
    except ValueError as e:
        # empty prompt, empty response, or invalid JSON from Gemini
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # network/API errors from Gemini
        raise HTTPException(status_code=502, detail=f"Gemini error: {e}")

TASKS_PROMPT = """
Generate 3 small tasks that can help achieve this goal: {goal}

For each task include:
- task_name
- estimated_complete_time
- description

Return a JSON object shaped like: {{"tasks": [ ... ]}}
"""

@app.get("/")
def root(goal: str = "learn to cook"):
    try:
        return generate_json(TASKS_PROMPT.format(goal=goal))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini error: {e}")