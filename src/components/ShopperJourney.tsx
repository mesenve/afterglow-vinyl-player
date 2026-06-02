import type { BehaviorTrigger } from '../types';

interface ShopperJourneyProps {
  triggers: BehaviorTrigger[];
  selectedTriggerId: string;
  onSelectTrigger: (triggerId: string) => void;
}

function ShopperJourney({ triggers, selectedTriggerId, onSelectTrigger }: ShopperJourneyProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Davranış sinyali simülasyonu</p>
          <h2>Shopper journey</h2>
        </div>
        <span className="muted-pill">Consent-aware event akışı</span>
      </div>

      <div className="journey-rail" aria-label="Alışveriş davranışı akışı">
        {triggers.map((trigger, index) => (
          <button
            type="button"
            className={`journey-step ${selectedTriggerId === trigger.id ? 'selected' : ''}`}
            key={trigger.id}
            onClick={() => onSelectTrigger(trigger.id)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{trigger.journeyStep}</strong>
            <small>{trigger.inferredIntent}</small>
          </button>
        ))}
      </div>
    </section>
  );
}

export default ShopperJourney;
