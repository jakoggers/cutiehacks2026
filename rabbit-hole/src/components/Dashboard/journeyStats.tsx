
import type { Profile, PhaseProgress } from "./journey-model";

type JourneyStatsProps = {
  profile: Profile;
  progress: PhaseProgress[];
};

const JourneyStats = ({
  profile,
  progress,
}: JourneyStatsProps) => {
  const completedToday = profile.taskCompleted.filter(
    (value) => value === 1
  ).length;

  const currentStreak = profile.streak;
  const completedPhases = progress.filter(
    (phase) => phase.complete
  ).length;

  return (
    <section className="journey-stats" aria-label="Your progress">
      <div>
        <span className="stat-icon" aria-hidden="true">
          ✦
        </span>

        <p>
          <strong>{completedToday}</strong>
          <span>Tasks completed today</span>
        </p>
      </div>

      <div>
        <span className="stat-icon stat-icon--rose" aria-hidden="true">
          ♥
        </span>

        <p>
          <strong>
            {currentStreak}
            <small>{currentStreak === 1 ? "day" : "days"}</small>
          </strong>

          <span>Current streak</span>
        </p>
      </div>

      <div>
        <span className="stat-icon stat-icon--green" aria-hidden="true">
          ⚑
        </span>

        <p>
          <strong>
            {completedPhases}
            <small> / {progress.length}</small>
          </strong>

          <span>Phases complete</span>
        </p>
      </div>
    </section>
  );
};

export default JourneyStats;
