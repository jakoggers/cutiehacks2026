/**
 * The Figma meadow (same classes as the home page, styled in globals.css),
 * graded for sunrise, day, sunset or night. No decorative bunnies here:
 * the White Rabbit is the star of the dashboard.
 */
export type TimeOfDay = "dawn" | "day" | "dusk" | "night";

function PixelMoon() {
  return (
    <svg className="pixel-moon" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 1h5v1h2v1h1v2h1v6h-1v2h-1v1h-2v1H6v-1H4v-1H3v-1h3v-1h2V9h1V5H8V3H6z" fill="#fff6dc" />
      <path d="M8 3h1v2h1v4H9v2H8v1H6v1h4v-1h2v-2h1V6h-1V4h-1V3H9V2H8z" fill="#f3dfae" />
    </svg>
  );
}

export default function MeadowScene({ time }: { time: TimeOfDay }) {
  return (
    <div className={`forest-scene forest-scene--${time}`} aria-hidden="true">
      <div className="meadow-sky" />
      {time === "night" && <div className="night-stars" />}
      {time === "night" && <PixelMoon />}
      <div className="meadow-treeline" />
      <div className="fir fir-left-far" />
      <div className="fir fir-right-far" />
      <div className="fir fir-left" />
      <div className="fir fir-right" />
      <div className="time-grade" />
    </div>
  );
}