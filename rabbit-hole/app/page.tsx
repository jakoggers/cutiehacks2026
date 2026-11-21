import { useRef, useState, type FormEvent } from "react";
import creamBunny from "./assets/bunny-cream.png";
import lilacBunny from "./assets/bunny-lilac.png"; 

function RabbitMark() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M4 1h2v1h1v5h2V2h1V1h2v1h1v6h1v2h1v3h-2v2H3v-2H1v-3h1V8h1V2h1zm1 2v4h1V3zm5 0v4h1V3zM4 10v2h2v-2zm6 0v2h2v-2z" />
    </svg>
  );
}

function HeartCard() {
  return (
    <svg className="heart-card" viewBox="0 0 24 32" fill="none">
      <path d="M2 0h20v2h2v28h-2v2H2v-2H0V2h2z" fill="#905e77" />
      <path d="M2 2h20v28H2z" fill="#fff3dc" />
      <path d="M2 27h20v3H2z" fill="#f1d4cc" />
      <path
        d="M6 4h2v1h1v4H8V7H6v2H5V5h1zm0 1v1h2V5zm1 7h4v2h2v-2h4v2h2v4h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-4h2zm11 13h2v2h-2z"
        fill="#bb637f"
      />
      <path d="M7 14h2v2H7z" fill="#f9b4bd" />
    </svg>
  );
}

function ForestScene() {
  return (
    <div className="forest-scene" aria-hidden="true">
      <div className="meadow-sky" />
      <div className="meadow-treeline" />
      <div className="fir fir-left-far" />
      <div className="fir fir-right-far" />
      <div className="fir fir-left" />
      <div className="fir fir-right" />
      <div className="meadow-friend meadow-friend-left">
        <HeartCard />
        <img src={creamBunny} width="28" height="27" alt="" />
      </div>
      <div className="meadow-friend meadow-friend-right">
        <HeartCard />
        <img src={lilacBunny} width="30" height="26" alt="" />
      </div>
    </div>
  );
}

export default function App() {
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");
  const signInDialog = useRef<HTMLDialogElement>(null);

  function beginJourney(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (goal.trim()) setMessage("Goal received.");
  }

  return (
    <div className="wonderland">
      <ForestScene />

      <header className="topbar">
        <a className="brand" href={import.meta.env.BASE_URL} aria-label="RabbitHole home">
          <RabbitMark />
          <span>RabbitHole</span>
        </a>
        <button className="sign-in" type="button" onClick={() => signInDialog.current?.showModal()}>
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
        <form className="goal-form" onSubmit={beginJourney}>
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
          />
          <button type="submit" aria-label="Begin your journey" disabled={!goal.trim()}>
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M7 2h2v2h2v2h2v2h-2V7H9v7H7V7H5v1H3V6h2V4h2z" />
            </svg>
          </button>
        </form>
        <p className="goal-status" role="status">
          {message}
        </p>
      </main>

      <footer className="site-footer">
        <a href={`${import.meta.env.BASE_URL}art-credits.txt`}>Art credits</a>
      </footer>

      <dialog ref={signInDialog} className="sign-in-dialog" aria-labelledby="sign-in-title">
        <h2 id="sign-in-title">Sign in</h2>
        <p>Sign-in isn’t available yet.</p>
        <form method="dialog">
          <button type="submit">Close</button>
        </form>
      </dialog>
    </div>
  );
}
