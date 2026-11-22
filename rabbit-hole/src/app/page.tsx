"use client"

import { BrowserRouter, Routes, Route } from "react-router";
import DashboardPreview from "@/src/app/Dashboard/DashboardPreview";

import "@/src/app/globals.css"
import { useState } from "react";
import Link from "next/link";
import ForestScene from "@/src/components/Home/forestScene";
import RabbitMark from "@/src/components/Home/rabbitMark";
import { useRouter } from "next/navigation";
import { signOut } from "@/src/lib/auth";
import { useUser } from "@/src/lib/useUser";

const Home = () => {
  const router = useRouter();
  const { user, username, loading } = useUser();
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");

  function beginJourney() {
    const trimmed = goal.trim();
    if (!trimmed) return;

    setMessage("Goal received.");
    router.push(`/TaskPicker?goal=${encodeURIComponent(trimmed)}`);
  }

  // return (
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/dashboard" element={<DashboardPreview />} />
  //       <Route
  //         path="/dashboard-preview"
  //         element={<DashboardPreview />}
  //       />
  //     </Routes>
  //   </BrowserRouter>
  // );

  return (
    <div className="wonderland">
      <ForestScene />

      <header className="topbar">
        <Link className="brand" href="/" aria-label="RabbitHole home">
          <RabbitMark />
          <span>RabbitHole</span>
        </Link>

        {!loading &&
          (user ? (
            <div className="topbar-user">
              <span>Hi, {username}</span>
              <button className="sign-in" type="button" onClick={() => signOut()}>
                Sign out
              </button>
            </div>
          ) : (
            <Link className="sign-in" href="/SignIn">
              Sign in
            </Link>
          ))}
      </header>

      <main className="hero">
        <h1 className="text-fuchsia-600">
          <span>Chase your dreams</span>
          <span>
            down the <strong>RabbitHole.</strong>
          </span>
        </h1>

        <div className="goal-form">
          <input
            className="text-[#775e7e]"
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
    </div>
  );
};

export default Home;