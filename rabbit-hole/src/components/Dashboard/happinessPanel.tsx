
type HappinessPanelProps = {
  happiness: number;
  mood: string;
  onOpenHelp: () => void;
};

const HappinessPanel = ({
  happiness,
  mood,
  onOpenHelp,
}: HappinessPanelProps) => {
  return (
    <aside className="happiness-panel" aria-label="Rabbit happiness">
      <span className="happiness-heart">♥</span>

      <h2>Happiness</h2>

      <div className="happiness-reading">
        <strong>{happiness}</strong>
        <span>/ 100</span>
      </div>

      <div
        className="happiness-meter"
        role="meter"
        aria-label="Rabbit happiness"
        aria-valuenow={happiness}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${happiness} out of 100. ${mood}`}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={
              happiness >= (10 - i) * 10 ? "is-filled" : ""
            }
          />
        ))}
      </div>

      <p className="mood-label">{mood}</p>

      <button
        type="button"
        className="happiness-help"
        onClick={onOpenHelp}
      >
        How it works
      </button>
    </aside>
  );
};

export default HappinessPanel;
