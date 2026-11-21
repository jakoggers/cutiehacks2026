
import { Link } from "react-router";
import SuitHeart from "@/src/components/TaskPicker/suitHeart";

type DashboardHeaderProps = {
  goal: string;
};

const DashboardHeader = ({ goal }: DashboardHeaderProps) => {
  return (
    <>
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">A LITTLE EVERY DAY</p>
          <h1>Your Wonderland</h1>
        </div>

        <Link className="quiet-link" to="/">
          Edit goal <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="goal-caption">
        <span className="goal-heart">
          <SuitHeart />
        </span>
        <p>{goal}</p>
      </div>
    </>
  );
};

export default DashboardHeader;
