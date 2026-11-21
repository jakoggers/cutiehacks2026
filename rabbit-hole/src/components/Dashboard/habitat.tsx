
import { WhiteRabbit } from "@/src/components/Pets/WhiteRabbit";

type RabbitHabitatProps = {
  now: number;
  phase: string;
  clock: string;
  petMessage: string;
  completeToday: number;
  celebrating: boolean;
  onPetRabbit: () => void;
};

const Habitat = ({
  now,
  phase,
  clock,
  petMessage,
  completeToday,
  celebrating,
  onPetRabbit,
}: RabbitHabitatProps) => {
  const timeLabel =
    phase === "dawn"
      ? "Sunrise"
      : phase === "dusk"
        ? "Sunset"
        : phase === "night"
          ? "Moonlight"
          : "Daylight";

  const habitatLabel =
    phase === "dusk"
      ? "sunset"
      : phase === "dawn"
        ? "sunrise"
        : phase;

  return (
    <section
      className={`habitat habitat--${phase}`}
      aria-label={`The rabbit’s meadow at ${habitatLabel}`}
    >
      <div className="habitat-art" aria-hidden="true" />

      <div className="world-clock">
        <span className={`clock-dot clock-dot--${phase}`} />

        {timeLabel}

        <span className="clock-divider" />

        <time dateTime={new Date(now).toISOString()}>
          {clock} UTC
        </time>
      </div>

      <div className="rabbit-bubble" aria-live="polite">
        {petMessage ||
          (completeToday
            ? "Thanks for showing up for us."
            : "One little hop at a time.")}

        <span aria-hidden="true">♥</span>
      </div>

      <div className="rabbit-ground-shadow" aria-hidden="true" />

      <button
        type="button"
        className="rabbit-pet"
        aria-label="Say hello to the White Rabbit"
        onClick={onPetRabbit}
      >
        <WhiteRabbit celebrating={celebrating} />
      </button>

      {celebrating && (
        <div className="happy-sparks" aria-hidden="true">
          <span>♥</span>
          <span>✦</span>
          <span>♥</span>
          <span>✦</span>
        </div>
      )}

      <div className="rabbit-name">
        <span aria-hidden="true">✦</span>
        THE WHITE RABBIT
        <span aria-hidden="true">✦</span>
      </div>
    </section>
  );
};

export default Habitat;
