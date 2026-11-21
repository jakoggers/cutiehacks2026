"use client"

import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { getDailyTasks } from "./journey-tasks";

const ranks = [
  { letter: "J", name: "Jack", difficulty: "Easy", minutes: 10 },
  { letter: "Q", name: "Queen", difficulty: "Medium", minutes: 20 },
  { letter: "K", name: "King", difficulty: "Hard", minutes: 30 },
] as const;

type Rank = (typeof ranks)[number]["letter"];

export function readJourneyGoal(state: unknown): string {
  return typeof state === "object" &&
    state !== null &&
    "goal" in state &&
    typeof state.goal === "string"
    ? state.goal.trim().slice(0, 240)
    : "";
}

function SuitHeart() {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
      <path d="M1 2h4v1h2V2h4v1h1v4h-2v2H8v2H4V9H2V7H0V3h1z" />
    </svg>
  );
}

function CourtEmblem({ rank }: { rank: Rank }) {
  return (
    <svg className="court-emblem" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M10 2h12v2h4v2h2v4h2v12h-2v4h-2v2h-4v2H10v-2H6v-2H4v-4H2V10h2V6h2V4h4z"
        className="court-seal"
      />
      {rank === "J" && (
        <>
          <path d="M19 7h5v3h-2v2h-3v3h-3v-4h1V9h2z" className="court-highlight" />
          <path d="M11 12h7v2h3v3h2v4h-2v2H10v-2H8v-4h2v-3h1z" fill="currentColor" />
          <path d="M10 19h11v2H10z" className="court-highlight" />
          <path d="M13 15h4v2h-4z" className="court-shine" />
        </>
      )}
      {rank === "Q" && (
        <>
          <path
            d="M15 8h2v2h2v2h2v2h2v-2h2v5h-2v4H9v-4H7v-5h2v2h2v-2h2v-2h2zM10 23h12v2H10z"
            fill="currentColor"
          />
          <path d="M15 13h2v2h2v2h-2v2h-2v-2h-2v-2h2z" className="court-shine" />
        </>
      )}
      {rank === "K" && (
        <>
          <path
            d="M15 7h2v2h2v2h-2v4h3v-2h2v-2h3v2h2v2h-2v4h-2v3H9v-3H7v-4H5v-2h2v-2h3v2h2v2h3v-4h-2V9h2zM9 24h14v2H9z"
            fill="currentColor"
          />
          <path d="M15 17h2v2h-2zm-5 0h2v2h-2zm10 0h2v2h-2z" className="court-shine" />
        </>
      )}
    </svg>
  );
}

function CardCorner({ rank }: { rank: Rank }) {
  return (
    <span className="task-card-corner" aria-hidden="true">
      {rank}
      <SuitHeart />
    </span>
  );
}

function TaskDeck({ goal }: { goal: string }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [selection, setSelection] = useState<Rank | null>(null);
  const tasks = getDailyTasks(goal);
  const pickedTask = selection
    ? tasks[ranks.findIndex(({ letter }) => letter === selection)]
    : null;

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);

  return (
    <main className="task-picker">
      <h1 ref={heading} tabIndex={-1}>
        Pick a task
      </h1>
      <div className="task-goal">
        <p title={goal}>{goal}</p>
        <Link to="/">Edit goal</Link>
      </div>

      <div className="task-deck" role="group" aria-label="Daily tasks, easiest to hardest">
        {ranks.map(({ letter, name, difficulty, minutes }, index) => (
          <button
            className={`task-card task-card--${letter.toLowerCase()}`}
            type="button"
            key={letter}
            aria-pressed={selection === letter}
            aria-label={`${name} of hearts: ${tasks[index]}, ${difficulty}, about ${minutes} minutes`}
            onClick={() => setSelection(letter)}
          >
            <CardCorner rank={letter} />
            <span className="task-card-content">
              <CourtEmblem rank={letter} />
              <span className="task-card-title">{tasks[index]}</span>
              <span className="task-card-details">
                <span>{difficulty}</span>
                <span>~{minutes} min</span>
              </span>
            </span>
            <CardCorner rank={letter} />
          </button>
        ))}
      </div>

      <p className="task-confirmation" role="status">
        {pickedTask && (
          <>
            Picked: <strong>{pickedTask}</strong>
          </>
        )}
      </p>
    </main>
  );
}

const TaskPicker = () => {
  const goal = readJourneyGoal(useLocation().state);
  return goal ? <TaskDeck key={goal} goal={goal} /> : <Navigate to="/" replace />;
}

export default TaskPicker;