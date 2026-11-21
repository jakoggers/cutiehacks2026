from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from geminiApi import generate_json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

TASKS_PROMPT = """
Generate exactly 3 small tasks that help achieve this goal: {goal}

Order them from easiest to hardest:
1. Easy (about 10 minutes)
2. Medium (about 20 minutes)
3. Hard (about 30 minutes)

For each task include:
- task_name (short, under 8 words, so it fits on a card)
- estimated_complete_time (like "10 min")
- description (1-2 sentences)

Return a JSON object shaped like: {{"tasks": [ ... ]}}
"""


class GoalRequest(BaseModel):
    goal: str = Field(min_length=1, max_length=240)


@app.get("/")
def root():
    return {"status": "ok"}


@app.post("/api/tasks")
def create_tasks(req: GoalRequest) -> dict:
    goal = req.goal.strip()
    if not goal:
        raise HTTPException(status_code=400, detail="Goal cannot be empty")

    try:
        result = generate_json(TASKS_PROMPT.format(goal=goal))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Gemini error: {e}")

    # Always return {"tasks": [...]}, even if Gemini sent a bare list
    tasks = result.get("tasks") or result.get("items") or []
    return {"tasks": tasks}