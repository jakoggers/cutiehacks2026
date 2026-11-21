
import type { PhaseProgress } from "./journey-model";

type PhasePanelProps = {
  progress: PhaseProgress[];
  currentPhase: number;
  totalPhases: number;
  onOpenHelp: () => void;
};

const PhasePanel = ({
  progress,
  currentPhase,
  totalPhases,
  onOpenHelp,
}: PhasePanelProps) => {
  return (
    <section className="phase-panel" aria-label="Journey phases">
      <div className="phase-heading">
        <span className="eyebrow">YOUR JOURNEY</span>

        <button
          className="plan-info"
          type="button"
          onClick={onOpenHelp}
        >
          Your plan <span aria-hidden="true">ⓘ</span>
        </button>
      </div>

      <ol className="phase-track">
        {progress.map((phase) => (
          <li
            key={phase.phaseNumber}
            className={`${phase.complete ? "is-complete" : ""} ${
              phase.current ? "is-current" : ""
            }`}
          >
            <div
              className="phase-item"
              aria-current={phase.current ? "step" : undefined}
              aria-label={`Phase ${phase.phaseNumber}${
                phase.complete ? ", complete" : phase.current ? ", current" : ""
              }`}
            >
              <span className="phase-chevron">
                <span className="phase-fill" style={{ width: "100%" }} />

                <span className="phase-number">
                  {phase.complete
                    ? "✓"
                    : String(phase.phaseNumber).padStart(2, "0")}
                </span>
              </span>

              <span className="phase-label">
                Phase {phase.phaseNumber}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <p className="phase-detail" aria-live="polite">
        <span>Phase {currentPhase} / {totalPhases}</span>
      </p>
    </section>
  );
};

export default PhasePanel;
