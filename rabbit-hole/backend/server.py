
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from geminiApi import generate_json, parse_tasks, save_tasks

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GoalRequest(BaseModel):
    goal: str = Field(min_length=1, max_length=240)


@app.post("/generate-tasks")
def generate_tasks_for_goal(request: GoalRequest):
    goal = request.goal.strip()

    if not goal:
        raise HTTPException(status_code=400, detail="Goal cannot be empty")

    prompt = f"""
    Generate 3 small tasks that can help achieve this goal:

    {goal}

    Return JSON shaped like:
    {{
        "tasks": [
            {{"description": "Task 1"}},
            {{"description": "Task 2"}},
            {{"description": "Task 3"}}
        ]
    }}
    """

    try:
        result = generate_json(prompt)
        task_rows, _ = parse_tasks(result)
        inserted_ids = save_tasks(task_rows, goal)

        return {
            "goal": goal,
            "task_rows": task_rows,
            "task_ids": inserted_ids
        }

    except Exception as exc:
        print("Task generation error:", exc)
        raise HTTPException(
            status_code=500,
            detail="Could not generate or save tasks"
        ) from exc
