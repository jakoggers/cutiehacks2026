"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ForestScene from "@/src/components/Home/forestScene";
import RabbitMark from "@/src/components/Home/rabbitMark";
import { signIn, signUp, isValidUsername } from "@/src/lib/auth";
import { useUser } from "@/src/lib/useUser";

type Mode = "signin" | "signup";

export default function SignInPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();

  const [mode, setMode] = useState<Mode>("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already signed in: go home
  useEffect(() => {
    if (!userLoading && user) router.replace("/");
  }, [user, userLoading, router]);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const name = username.trim();

    if (!isValidUsername(name)) {
      setError("Usernames are 3–20 characters: letters, numbers and _ only.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords don’t match.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signin") await signIn(name, password);
      else await signUp(name, password);
      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const isSignUp = mode === "signup";

  return (
    <div className="wonderland">
      <ForestScene />

      <header className="topbar">
        <Link className="brand" href="/" aria-label="RabbitHole home">
          <RabbitMark />
          <span>RabbitHole</span>
        </Link>
      </header>

      <main className="hero auth-page">
        <div className="auth-card">
          <h1>{isSignUp ? "Create an account" : "Welcome back"}</h1>

          <div className="auth-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={!isSignUp}
              className={!isSignUp ? "active" : ""}
              onClick={() => switchMode("signin")}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isSignUp}
              className={isSignUp ? "active" : ""}
              onClick={() => switchMode("signup")}
            >
              Sign up
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label>
              Username
              <input
                type="text"
                name="username"
                autoComplete="username"
                value={username}
                maxLength={20}
                onChange={(e) => setUsername(e.target.value)}
                disabled={submitting}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                required
              />
            </label>

            {isSignUp && (
              <label>
                Confirm password
                <input
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={submitting}
                  required
                />
              </label>
            )}

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting
                ? isSignUp
                  ? "Creating account…"
                  : "Signing in…"
                : isSignUp
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}