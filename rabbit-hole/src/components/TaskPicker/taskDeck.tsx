
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { fetchTasks, type Task } from "@/src/lib/tasksApi";

import TaskCard from "./taskCard";
import { ranks, type Rank } from "./taskTypes";

type TaskDeckProps = {
  goal: string;
};

const TaskDeck = ({ goal }: TaskDeckProps) => {
  const [selection, setSelection] = useState<Rank | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  // Focus the heading when the component loads
  useEffect(() => {
    document
      .getElementById("task-picker-heading")
      ?.focus({ preventScroll: true });
  }, []);

  // Fetch tasks whenever the goal or retry attempt changes
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setSelection(null);

    fetchTasks(goal)
      .then((result) => {
        if (!cancelled) {
          setTasks(result);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError((e as Error).message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [goal, attempt]);

  // Only show as many cards as tasks we received (maximum 3)
  const deck = ranks.slice(0, Math.min(ranks.length, tasks.length));

  const pickedIndex = selection
    ? deck.findIndex(({ letter }) => letter === selection)
    : -1;

  const pickedTask = pickedIndex >= 0 ? tasks[pickedIndex] : null;

  return (
    <main className="task-picker">
      <h1 id="task-picker-heading" tabIndex={-1}>
        Pick a task
      </h1>

      <div className="task-goal">
        <p title={goal}>{goal}</p>
        <Link href="/">Edit goal</Link>
      </div>

      {loading && (
        <p className="task-confirmation" role="status">
          Digging your rabbit hole…
        </p>
      )}

      {!loading && error && (
        <div className="task-confirmation" role="alert">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setAttempt((n) => n + 1)}
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div
            className="task-deck"
            role="group"
            aria-label="Daily tasks, easiest to hardest"
          >
            {deck.map(({ letter, name, difficulty, minutes }, index) => (
              <TaskCard
                key={letter}
                rank={letter}
                name={name}
                difficulty={difficulty}
                minutes={minutes}
                task={tasks[index]}
                selected={selection === letter}
                onSelect={() => setSelection(letter)}
              />
            ))}
          </div>

          <div className="task-confirmation" role="status">
            {pickedTask && (
              <>
                <p>
                  Picked: <strong>{pickedTask.task_name}</strong>
                </p>

                <p>{pickedTask.description}</p>
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
};

export default TaskDeck;
