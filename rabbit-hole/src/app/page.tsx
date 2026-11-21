"use client"

import "@/src/app/globals.css"
import { useState } from "react";
import ForestScene from "@/src/components/Home/forestScene";
import RabbitMark from "@/src/components/Home/rabbitMark";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  function beginJourney() {
    const trimmed = goal.trim();
    if (!trimmed) return; // don't navigate with an empty goal

    setMessage("Goal received.");
    router.push(`/TaskPicker?goal=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="wonderland">
      <ForestScene />

      <header className="topbar">
        <a className="brand" href="/" aria-label="RabbitHole home">
          <RabbitMark />
          <span>RabbitHole</span>
        </a>

        <button
          className="sign-in"
          type="button"
          onClick={() => setIsSignInOpen(true)}
        >
          Sign in
        </button>
      </header>

      <main className="hero">
        <h1>
          <span>Chase your dreams</span>
          <span>
            down the <strong>RabbitHole.</strong>
          </span>
        </h1>

        <div className="goal-form">
          <input
            aria-label="Your goal"
            name="goal"
            type="text"
            autoComplete="off"
            value={goal}
            maxLength={240}
            placeholder="What’s your goal?"
            onChange={(event) => {
              setGoal(event.target.value);
              setMessage("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                beginJourney();
              }
            }}
          />

          <button
            type="button"
            aria-label="Begin your journey"
            disabled={!goal.trim()}
            onClick={beginJourney}
          >
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M7 2h2v2h2v2h2v2h-2V7H9v7H7V7H5v1H3V6h2V4h2z" />
            </svg>
          </button>
        </div>

        <p className="goal-status" role="status">
          {message}
        </p>
      </main>

      <footer className="site-footer">
        <a href="/art-credits.txt">Art credits</a>
      </footer>

      {isSignInOpen && (
        <dialog
          open
          className="sign-in-dialog"
          aria-labelledby="sign-in-title"
        >
          <h2 id="sign-in-title">Sign in</h2>
          <p>Sign-in isn’t available yet.</p>

          <button
            type="button"
            onClick={() => setIsSignInOpen(false)}
          >
            Close
          </button>
        </dialog>
      )}
    </div>
  );
};

export default Home;