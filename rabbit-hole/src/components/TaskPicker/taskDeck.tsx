
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { Task } from "@/src/lib/tasksApi";
import {
  PROFILE_KEY,
  type Profile,
  type Task as JourneyTask,
  type Rank as JourneyRank,
} from "@/src/components/Dashboard/journey-model";

import TaskCard from "./taskCard";
import { ranks, type Rank } from "./taskTypes";

type TaskDeckProps = {
  goal: string;
  tasks: Task[];
};

const TaskDeck = ({ goal, tasks }: TaskDeckProps) => {
  const router = useRouter();
  const [selection, setSelection] = useState<Rank | null>(null);

  useEffect(() => {
    document
      .getElementById("task-picker-heading")
      ?.focus({ preventScroll: true });
  }, []);

  const deck = ranks.slice(0, Math.min(ranks.length, tasks.length));

  const handleSelect = (selectedTask: Task, letter: Rank) => {
    setSelection(letter);

    // Put the selected task first so it appears as the current quest.
    const orderedTasks = [
      selectedTask,
      ...tasks.filter((task) => task.id !== selectedTask.id),
    ];

    // Convert generated tasks into the Dashboard's task format.
    const dashboardTasks: JourneyTask[] = orderedTasks.map(
      (task, index) => ({
        id: task.id || `guest-task-${index}`,
        description: task.description || task.task_name,
        rank: Math.min(index + 1, 3) as JourneyRank,
      })
    );

    // Initial guest profile. These values are temporary demo data.
    const guestProfile: Profile = {
      id: "guest-demo",
      goal,

      tasks: dashboardTasks,
      currTasks: dashboardTasks,

      taskCompleted: dashboardTasks.map(() => 0),

      numOfPhases: 3,
      currPhase: 1,

      currPet: 0,
      petHappiness: 75,
      streak: 1,
      lastLogin: new Date().toISOString(),
    };

    // Save the profile so the Dashboard can load it without authentication.
    localStorage.setItem(PROFILE_KEY, JSON.stringify(guestProfile));

    router.push("/Dashboard");
  };

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
                onSelect={() => handleSelect(tasks[index], letter)}
              />
            ))}
          </div>

          <p className="task-confirmation">
            Select a card to begin your journey.
          </p>
        </>
      )}
    </main>
  );
};

export default TaskDeck;
