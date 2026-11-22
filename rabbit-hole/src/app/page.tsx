"use client"

import { BrowserRouter, Routes, Route } from "react-router";
import DashboardPreview from "@/src/app/Dashboard/DashboardPreview";

import "@/src/app/globals.css";
import { useState, type FormEvent } from "react";
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
  const [isSaving, setIsSaving] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);


async function beginJourney(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const trimmed = goal.trim();
  if (!trimmed || isSaving) return;

  setIsSaving(true);
  setMessage("Generating your tasks...");

  try {
    const apiBaseUrl = (
      process.env.NEXT_PUBLIC_TASKS_API_URL ?? "http://127.0.0.1:8000"
    ).replace(/\/$/, "");

    console.log("Sending request to:", `${apiBaseUrl}/generate-tasks`);

    const response = await fetch(`${apiBaseUrl}/generate-tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ goal: trimmed }),
    });

    console.log("Backend response status:", response.status);

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        `Task API returned ${response.status}: ${
          responseData.detail ?? JSON.stringify(responseData)
        }`
      );
    }

    console.log("Generated tasks:", responseData);

    if (!responseData.task_rows) {
      throw new Error("Backend did not return task_rows.");
    }

    sessionStorage.setItem(
      "pendingJourney",
      JSON.stringify({
        goal: trimmed,
        tasks: responseData.task_rows,
      })
    );

    setMessage("Tasks generated!");

    router.push("/TaskPicker");
  } catch (error) {
    console.error("Could not generate tasks:", error);

    setMessage(
      error instanceof Error
        ? error.message
        : "Could not generate your tasks. Please try again."
    );
  } finally {
    setIsSaving(false);
  }
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

        <form className="goal-form" onSubmit={beginJourney} aria-busy={isSaving}>
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
          />

          <button
            type="submit"
            aria-label={isSaving ? "Saving your goal" : "Begin your journey"}
            disabled={!goal.trim() || isSaving}
          >
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M7 2h2v2h2v2h2v2h-2V7H9v7H7V7H5v1H3V6h2V4h2z" />
            </svg>
          </button>
        </form>

        <p className="goal-status" role="status">
          {message}
        </p>
      </main>

      {isSignInOpen && (
        <dialog open className="sign-in-dialog" aria-labelledby="sign-in-title">
          <h2 id="sign-in-title">Sign in</h2>
          <p>Sign-in isn’t available yet.</p>

          <button type="button" onClick={() => setIsSignInOpen(false)}>
            Close
          </button>
        </dialog>
      )}
    </div>
  );
};

export default Home;
