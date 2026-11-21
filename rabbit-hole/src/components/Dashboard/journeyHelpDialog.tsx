
import type { Journey, JourneyPhase, HelpDialogRef } from "./dashboardTypes";
import {
  HAPPINESS_GAIN,
  MISSED_DAY_LOSS,
} from "@/src/components/Dashboard/journey-model";

type JourneyHelpDialogProps = {
  dialogRef: HelpDialogRef;
  journey: Journey;
  progress: JourneyPhase[];
};

const JourneyHelpDialog = ({
  dialogRef,
  journey,
  progress,
}: JourneyHelpDialogProps) => {
  const totalTasks = progress.reduce(
    (total, phase) => total + phase.tasks,
    0
  );

  return (
    <dialog
      ref={dialogRef}
      className="journey-dialog"
      aria-labelledby="journey-dialog-title"
      onClick={(e) => {
        if (e.target === dialogRef.current) {
          dialogRef.current?.close();
        }
      }}
    >
      <h2 id="journey-dialog-title">Every little hop counts</h2>

      <p>
        Complete a task to add {HAPPINESS_GAIN} happiness and move
        one step along your journey. Happiness stays between 0 and
        100.
      </p>

      <p>
        Each day without a completed task costs {MISSED_DAY_LOSS}
        {" "}happiness. Days and scenery follow UTC, and the current
        day is never counted as missed.
      </p>

      <p>
        Your phases and task targets are part of your journey plan.
        This journey has {progress.length} phases and {totalTasks} tasks.
      </p>

      <p>
        Your progress is saved with your journey. Click any phase
        to see its task target.
      </p>

      <form method="dialog">
        <button className="complete-button">
          Back to Wonderland
        </button>
      </form>
    </dialog>
  );
};

export default JourneyHelpDialog;
