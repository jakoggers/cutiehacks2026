const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface Task {
  task_name: string;
  estimated_complete_time: string;
  description: string;
}

export async function fetchTasks(goal: string): Promise<Task[]> {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.detail === "string" ? err.detail : `Something went wrong (${res.status})`
    );
  }

  const data: { tasks: Task[] } = await res.json();
  return data.tasks ?? [];
}