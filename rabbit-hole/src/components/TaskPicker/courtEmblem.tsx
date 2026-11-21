
import type { Rank } from "./taskTypes";

type CourtEmblemProps = {
  rank: Rank;
};

const CourtEmblem = ({ rank }: CourtEmblemProps) => {
  return (
    <svg
      className="court-emblem"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 2h12v2h4v2h2v4h2v12h-2v4h-2v2h-4v2H10v-2H6v-2H4v-4H2V10h2V6h2V4h4z"
        className="court-seal"
      />

      {rank === "J" && (
        <>
          <path
            d="M19 7h5v3h-2v2h-3v3h-3v-4h1V9h2z"
            className="court-highlight"
          />
          <path
            d="M11 12h7v2h3v3h2v4h-2v2H10v-2H8v-4h2v-3h1z"
            fill="currentColor"
          />
          <path d="M10 19h11v2H10z" className="court-highlight" />
          <path d="M13 15h4v2h-4z" className="court-shine" />
        </>
      )}

      {rank === "Q" && (
        <>
          <path
            d="M15 8h2v2h2v2h2v2h2v-2h2v5h-2v4H9v-4H7v-5h2v2h2v-2h2v-2h2zM10 23h12v2H10z"
            fill="currentColor"
          />
          <path
            d="M15 13h2v2h2v2h-2v2h-2v-2h-2v-2h2z"
            className="court-shine"
          />
        </>
      )}

      {rank === "K" && (
        <>
          <path
            d="M15 7h2v2h2v2h-2v4h3v-2h2v-2h3v2h2v2h-2v4h-2v3H9v-3H7v-4H5v-2h2v-2h3v2h2v2h3v-4h-2V9h2zM9 24h14v2H9z"
            fill="currentColor"
          />
          <path
            d="M15 17h2v2h-2zm-5 0h2v2h-2zm10 0h2v2h-2z"
            className="court-shine"
          />
        </>
      )}
    </svg>
  );
};

export default CourtEmblem;
