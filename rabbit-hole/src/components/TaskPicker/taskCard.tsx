import type { Task } from "@/src/lib/tasksApi";
import type { Rank } from "./taskTypes";
import CardCorner from "./cardCorner";
import CourtEmblem from "./courtEmblem";

type TaskCardProps = {
  rank: Rank;
  name: string;
  difficulty: string;
  minutes: number;
  task: Task;
  selected: boolean;
  onSelect: () => void;
};

const TaskCard = ({
  rank,
  name,
  difficulty,
  minutes,
  task,
  selected,
  onSelect,
}: TaskCardProps) => {
  const time = task.estimated_complete_time || `~${minutes} min`;

  return (
    <button
      className={`task-card task-card--${rank.toLowerCase()}`}
      type="button"
      aria-pressed={selected}
      aria-label={`${name} of hearts: ${task.task_name}, ${difficulty}, ${time}`}
      onClick={onSelect}
    >
      <CardCorner rank={rank} />

      <span className="task-card-content">
        <CourtEmblem rank={rank} />

        <span className="task-card-title">
          {task.task_name}
        </span>

        <span className="task-card-details">
          <span>{difficulty}</span>
          <span>{time}</span>
        </span>
      </span>

      <CardCorner rank={rank} />
    </button>
  );
};

export default TaskCard;
