import { useState } from "react";

interface Task {
  task_name: string;
  estimated_complete_time: string;
  description: string;
}

interface TasksResponse {
  tasks: Task[];
}

export default function Tasks() {
  const [goal, setGoal] = useState("");
  const [data, setData] = useState<TasksResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `http://localhost:8000/?goal=${encodeURIComponent(goal)}`
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? `Request failed (${res.status})`);
      }
      setData(await res.json());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={load}>
      <input
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter a goal"
      />
      <button disabled={loading || !goal.trim()}>
        {loading ? "Generating..." : "Get tasks"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data?.tasks?.map((task) => (
        <div key={task.task_name}>
          <h3>{task.task_name}</h3>
          <p><b>Time:</b> {task.estimated_complete_time}</p>
          <p>{task.description}</p>
        </div>
      ))}
    </form>
  );
}