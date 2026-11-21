import type { Rank } from "./taskTypes";
import SuitHeart from "./suitHeart";

type CardCornerProps = {
  rank: Rank;
};

const CardCorner = ({ rank }: CardCornerProps) => {
  return (
    <span className="task-card-corner" aria-hidden="true">
      {rank}
      <SuitHeart />
    </span>
  );
};

export default CardCorner;
