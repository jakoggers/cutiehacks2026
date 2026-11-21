
import type { Task } from "./journey-model";

type QuestPanelProps = {
  tasks: Task[];
  completed: number[];
  onToggleTask: (index: number) => void;
};

const QuestPanel = ({
  tasks,
  completed,
  onToggleTask,
}: QuestPanelProps) => {
  const completedCount = completed.filter((value) => value === 1).length;

  const rankName = (rank: Task["rank"]) => {
    switch (rank) {
      case 1:
        return "Rank 1";
      case 2:
        return "Rank 2";
      case 3:
        return "Rank 3";
    }
  };

  return (
    <aside className="quest-panel">
      <div className="quest-heading">
        <h2 className="eyebrow">YOUR DAILY QUESTS</h2>
        <span className="quest-dot" />
      </div>

      {tasks.length > 0 ? (
        <>
          <p className="steps-heading">
            Today's progress
            <span>
              {completedCount}/{tasks.length}
            </span>
          </p>

          <div
            className="quest-progress"
            role="progressbar"
            aria-label="Daily task progress"
            aria-valuemin={0}
            aria-valuemax={tasks.length}
            aria-valuenow={completedCount}
          >
            {tasks.map((task, index) => (
              <span
                key={task.id}
                className={completed[index] === 1 ? "is-filled" : ""}
              />
            ))}
          </div>

          <div className="quest-steps">
            {tasks.map((task, index) => {
              const isComplete = completed[index] === 1;

              return (
                <label
                  key={task.id}
                  className={isComplete ? "step-checked" : ""}
                >
                  <input
                    type="checkbox"
                    checked={isComplete}
                    onChange={() => onToggleTask(index)}
                  />

                  <span className="quest-task-description">
                    {task.description}
                  </span>

                  <span
                    className={`quest-task-rank quest-task-rank--${task.rank}`}
                  >
                    {rankName(task.rank)}
                  </span>
                </label>
              );
            })}
          </div>

          {completedCount === tasks.length && (
            <p className="completion-note" role="status">
              <span aria-hidden="true">✓</span>
              All your daily quests are complete!
            </p>
          )}

          <p className="reward-note">
            Complete a task to earn +10 happiness
          </p>
        </>
      ) : (
        <div className="empty-quest">
          <p>No tasks have been assigned for today yet.</p>
        </div>
      )}
    </aside>
  );
};

export default QuestPanel;
