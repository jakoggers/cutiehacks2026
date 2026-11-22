
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type { Task } from "@/src/lib/tasksApi";

import TaskCard from "./taskCard";
import { ranks, type Rank } from "./taskTypes";

type TaskDeckProps = {
  goal: string;
  tasks: Task[];
};

const TaskDeck = ({ goal, tasks }: TaskDeckProps) => {
  const [selection, setSelection] = useState<Rank | null>(null);

  // Focus the heading when the component loads.
  useEffect(() => {
    document
      .getElementById("task-picker-heading")
      ?.focus({ preventScroll: true });
  }, []);

  // Only show as many cards as tasks received (maximum 3).
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

      {tasks.length === 0 ? (
        <p className="task-confirmation" role="alert">
          No tasks were generated. Please try another goal.
        </p>
      ) : (
        <>
          <div
            className="task-deck"
            role="group"
            aria-label="Daily tasks, easiest to hardest"
          >
            {deck.map(({ letter, name, difficulty, minutes }, index) => (
              <TaskCard
                key={tasks[index].id}
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
