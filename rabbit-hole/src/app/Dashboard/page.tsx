"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useJourney } from "@/src/components/Dashboard/JourneyContext";
import {
  phaseProgress,
  happinessMood,
  timeOfDay,
} from "@/src/components/Dashboard/journey-model";

import PhasePanel from "@/src/components/Dashboard/phasePanel";
import HappinessPanel from "@/src/components/Dashboard/happinessPanel";
import Habitat from "@/src/components/Dashboard/habitat";
import QuestPanel from "@/src/components/Dashboard/questPanel";
import JourneyStats from "@/src/components/Dashboard/journeyStats";

import "./dashboard.css";

const Dashboard = () => {
  const router = useRouter();
  const {
    profile,
    storageUnavailable,
    toggleTask,
    advancePhase,
  } = useJourney();

  const [now, setNow] = useState(Date.now);
  const [petMessage, setPetMessage] = useState("");
  const [celebrating, setCelebrating] = useState(false);

  const help = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!profile) {
      router.replace("/");
    }
  }, [profile, router]);

  useEffect(() => {
    document.getElementById("dashboard-title")?.focus({
      preventScroll: true,
    });

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 15_000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!petMessage && !celebrating) return;

    const timer = window.setTimeout(() => {
      setPetMessage("");
      setCelebrating(false);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [petMessage, celebrating]);

  if (!profile) {
    return null;
  }

  const progress = phaseProgress(profile);
  const phase = timeOfDay(now);

  const currentPhase = profile.currPhase;
  const totalPhases = profile.numOfPhases;

  const completedToday = profile.taskCompleted.filter(
    (value) => value === 1
  ).length;

  const allTasksDone =
    profile.currTasks.length > 0 &&
    completedToday === profile.currTasks.length;

  const mood = happinessMood(profile.petHappiness);

  const clock = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  const petRabbit = () => {
    setPetMessage("A little hello makes my day!");
    setCelebrating(true);
  };

  const openHelp = () => {
    help.current?.showModal();
  };

  const closeHelp = () => {
    help.current?.close();
  };

  const handleToggleTask = (index: number) => {
    const wasCompleted = profile.taskCompleted[index] === 1;

    toggleTask(index);

    if (wasCompleted) {
      setPetMessage("There's always another chance!");
      setCelebrating(false);
    } else {
      setPetMessage("You did it! A hop closer.");
      setCelebrating(true);
    }
  };

  const handleAdvancePhase = () => {
    if (!allTasksDone || currentPhase >= totalPhases) return;

    advancePhase();
    setPetMessage("A new chapter of your journey begins!");
    setCelebrating(true);
  };

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1 id="dashboard-title" tabIndex={-1}>
            Your Wonderland
          </h1>
          <p className="dashboard-subtitle">
            Every little step brings you somewhere wonderful.
          </p>
        </div>
      </header>

      {storageUnavailable && (
        <p className="storage-notice" role="status">
          Your browser couldn't save progress. Keep this tab open
          to continue this visit.
        </p>
      )}

      <div className="dashboard-grid">
        <PhasePanel
          progress={progress}
          currentPhase={currentPhase}
          totalPhases={totalPhases}
          onOpenHelp={openHelp}
        />

        <HappinessPanel
          happiness={profile.petHappiness}
          mood={mood}
          onOpenHelp={openHelp}
        />

        <Habitat
          now={now}
          phase={phase}
          clock={clock}
          petMessage={petMessage}
          completeToday={completedToday}
          celebrating={celebrating}
          onPetRabbit={petRabbit}
        />

        <QuestPanel
          tasks={profile.currTasks}
          completed={profile.taskCompleted}
          onToggleTask={handleToggleTask}
        />

        <JourneyStats
          profile={profile}
          progress={progress}
        />
      </div>

      {allTasksDone && currentPhase < totalPhases && (
        <div className="phase-advance">
          <p>You've completed all your tasks for this phase!</p>
          <button
            type="button"
            className="complete-button"
            onClick={handleAdvancePhase}
          >
            Continue to Phase {currentPhase + 1}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}

      {allTasksDone && currentPhase === totalPhases && (
        <p className="completion-note" role="status">
          You've completed all the tasks in your final phase. What an
          accomplishment!
        </p>
      )}

      <p className="dashboard-footnote">
        Big dreams grow from little things.
        <span aria-hidden="true"> ♥</span>
      </p>

      <dialog ref={help} className="journey-help-dialog">
        <div className="help-dialog-content">
          <button
            type="button"
            className="help-dialog-close"
            onClick={closeHelp}
            aria-label="Close help"
          >
            ×
          </button>

          <h2>Your journey</h2>

          <p>
            Your journey is divided into {totalPhases} phases.
            Complete your daily tasks to make progress and move
            forward through each phase.
          </p>

          <p>
            <strong>Current phase:</strong> Phase {currentPhase} / {totalPhases}
          </p>

          <p>
            <strong>Happiness:</strong> Completing a task earns
            +10 happiness for your pet.
          </p>

          <p>
            <strong>Ranks:</strong> Tasks are ranked from 1 to 3
            based on their difficulty.
          </p>

          <button
            type="button"
            className="complete-button"
            onClick={closeHelp}
          >
            Got it
          </button>
        </div>
      </dialog>
    </main>
  );
};

export default Dashboard;
