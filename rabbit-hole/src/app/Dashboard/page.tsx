"use client"

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useJourney } from "@/src/components/Dashboard/JourneyContext";
import { timeOfDay } from "@/src/components/Dashboard/journey-model";
import MeadowScene, { type TimeOfDay } from "@/src/components/Dashboard/meadowScene";
import { CardCorner, CourtEmblem, PixelCheck, SuitHeart, ranks } from "@/src/components/Dashboard/cardArt";
import RabbitMark from "@/src/components/Home/rabbitMark";
import { signOut } from "@/src/lib/auth";
import { useUser } from "@/src/lib/useUser";

import "./dashboard.css";

const HEARTS = 5;
const TIMES: TimeOfDay[] = ["dawn", "day", "dusk", "night"];

/** Hearts that pop out when the rabbit is petted: start spot, sideways drift, delay, size. */
const HEART_BURST = [
  { "--x": "30%", "--dx": "-26px", "--d": "0.32s", "--s": "18px" },
  { "--x": "52%", "--dx": "4px", "--d": "0.4s", "--s": "22px" },
  { "--x": "70%", "--dx": "28px", "--d": "0.48s", "--s": "16px" },
  { "--x": "40%", "--dx": "-12px", "--d": "0.6s", "--s": "14px" },
  { "--x": "62%", "--dx": "16px", "--d": "0.68s", "--s": "15px" },
];

/** currTasks may hold strings or task objects; read whichever text field is there. */
function taskText(task: unknown): string {
  if (typeof task === "string") return task;
  if (task && typeof task === "object") {
    const t = task as Record<string, unknown>;
    for (const key of ["description", "title", "task_name", "name"]) {
      if (typeof t[key] === "string") return t[key] as string;
    }
  }
  return "";
}

const Dashboard = () => {
  const router = useRouter();
  const { profile, storageUnavailable, toggleTask, advancePhase } = useJourney();
  const { user, username, loading: userLoading } = useUser();

  const [now, setNow] = useState(Date.now);
  const [pets, setPets] = useState(0); // each pet restarts the hop + hearts

  useEffect(() => {
    if (!profile) router.replace("/");
  }, [profile, router]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!pets) return;
    const timer = window.setTimeout(() => setPets(0), 2100);
    return () => window.clearTimeout(timer);
  }, [pets]);

  if (!profile) return null;

  const pet = () => setPets((n) => n + 1);

  // Time of day for the meadow and lighting
  const rawTime = String(timeOfDay(now));
  const time: TimeOfDay = TIMES.includes(rawTime as TimeOfDay) ? (rawTime as TimeOfDay) : "day";

  // Phases (currPhase is 1-based: "Phase 2 / 4")
  const totalPhases = profile.numOfPhases;
  const currentPhase = profile.currPhase;
  const tasks = profile.currTasks ?? [];
  const completed = profile.taskCompleted ?? [];
  const completedToday = completed.filter((v: number) => v === 1).length;
  const allTasksDone = tasks.length > 0 && completedToday === tasks.length;

  // Today's card: the first task not done yet (or the last one once all are done)
  const firstOpen = tasks.findIndex((_: unknown, i: number) => completed[i] !== 1);
  const cardIndex = firstOpen === -1 ? tasks.length - 1 : firstOpen;
  const cardDone = cardIndex >= 0 && completed[cardIndex] === 1;
  const rank = ranks[Math.max(0, cardIndex) % ranks.length];

  const hearts = Math.round(profile.petHappiness / (100 / HEARTS));
  const goal = (profile as { goal?: string }).goal;

  const finishCard = () => {
    if (cardIndex < 0 || cardDone) return;
    toggleTask(cardIndex);
    pet();
  };

  const nextPhase = () => {
    if (!allTasksDone || currentPhase >= totalPhases) return;
    advancePhase();
    pet();
  };

  return (
    <div className="wonderland wonderland--dashboard">
      <MeadowScene time={time} />

      <header className="topbar">
        <Link className="brand" href="/" aria-label="RabbitHole home">
          <RabbitMark />
          <span>RabbitHole</span>
        </Link>
        {!userLoading &&
          (user ? (
            <button className="sign-in" type="button" onClick={() => signOut()} title="Sign out">
              {username}
            </button>
          ) : (
            <Link className="sign-in" href="/SignIn">
              Sign in
            </Link>
          ))}
      </header>

      <main className="dashboard">
        <div className="dash-top">
          {goal && (
            <div className="task-goal dash-goal">
              <p title={goal}>{goal}</p>
              <Link href="/">Edit goal</Link>
            </div>
          )}
          <ol className="phase-pips" aria-label="Journey phases">
            {Array.from({ length: totalPhases }, (_, i) => {
              const n = i + 1;
              const complete = n < currentPhase || (n === currentPhase && allTasksDone);
              const current = n === currentPhase;
              const fill = complete ? 100 : current && tasks.length ? (100 * completedToday) / tasks.length : 0;
              return (
                <li
                  key={n}
                  className={`${complete ? "is-complete" : ""} ${current ? "is-current" : ""}`}
                  title={`Phase ${n} / ${totalPhases}`}
                  aria-label={`Phase ${n} of ${totalPhases}${complete ? ", complete" : current ? ", in progress" : ""}`}
                  aria-current={current ? "step" : undefined}
                >
                  <span style={{ width: `${fill}%` }} />
                </li>
              );
            })}
          </ol>
        </div>

        <div
          className="mood"
          role="meter"
          aria-label="Rabbit happiness"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={profile.petHappiness}
          title={`Happiness ${profile.petHappiness} / 100`}
        >
          {Array.from({ length: HEARTS }, (_, i) => (
            <span key={i} className={i >= HEARTS - hearts ? "" : "is-empty"}>
              <SuitHeart />
            </span>
          ))}
        </div>

        <button type="button" className={`pet ${pets ? "is-happy" : ""}`} aria-label="Pet the White Rabbit" onClick={pet}>
          <span className="pet-body" key={`body-${pets}`}>
            <img src="/rabbit-standing.png" width={36} height={50} alt="" />
          </span>
          {pets > 0 && (
            <span className="pet-hearts" key={`hearts-${pets}`} aria-hidden="true">
              {HEART_BURST.map((h, i) => (
                <span key={i} className="pet-heart" style={h as CSSProperties}>
                  <SuitHeart />
                </span>
              ))}
            </span>
          )}
        </button>

        <section className="quest" aria-label="Today’s task">
          {cardIndex >= 0 && (
            <article className={`task-card task-card--${rank.letter.toLowerCase()} quest-card ${cardDone ? "is-done" : ""}`}>
              <CardCorner rank={rank.letter} />
              <span className="task-card-content">
                <CourtEmblem rank={rank.letter} />
                <h2 className="task-card-title">{taskText(tasks[cardIndex])}</h2>
                <span className="task-card-details">
                  <span>{rank.difficulty}</span>
                  <span>~{rank.minutes} min</span>
                </span>
              </span>
              <CardCorner rank={rank.letter} />
              {cardDone && (
                <span className="done-seal" role="img" aria-label="Done">
                  <PixelCheck />
                </span>
              )}
            </article>
          )}

          {!cardDone && cardIndex >= 0 && (
            <button type="button" className="quest-button" onClick={finishCard}>
              Done <PixelCheck />
            </button>
          )}
          {allTasksDone && currentPhase < totalPhases && (
            <button type="button" className="quest-button" onClick={nextPhase}>
              Next phase
            </button>
          )}
          {allTasksDone && currentPhase >= totalPhases && (
            <Link className="quest-button" href="/">
              New goal
            </Link>
          )}
        </section>

        {storageUnavailable && (
          <p className="storage-notice" role="status">
            Progress isn’t saving in this browser.
          </p>
        )}
      </main>

      <footer className="site-footer">
        <a href="/art-credits.txt">Art credits</a>
      </footer>
    </div>
  );
};

export default Dashboard;