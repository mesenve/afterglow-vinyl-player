import { localizeStatus, type Language } from '../i18n';
import type { BehaviorTrigger } from '../types';

interface TriggerMatrixProps {
  triggers: BehaviorTrigger[];
  selectedTriggerId: string;
  language?: Language;
  onSelectTrigger: (triggerId: string) => void;
}

function getStatusClass(status: string) {
  if (status === 'Aktif') return 'status-active';
  if (status.includes('nceleme')) return 'status-review';
  if (status.includes('Duraklat')) return 'status-paused';
  if (status.includes('Onay')) return 'status-approved';
  return 'status-active';
}

function TriggerMatrix({ triggers, selectedTriggerId, language = 'tr', onSelectTrigger }: TriggerMatrixProps) {
  const isTr = language === 'tr';

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">{isTr ? 'Davranış tetikleyici matrisi' : 'Behavior trigger matrix'}</p>
          <h2>{isTr ? 'Sinyalden içeriğe kurallar' : 'Rules from signal to content'}</h2>
        </div>
        <span className="muted-pill">{isTr ? '5 deterministik örnek' : '5 deterministic examples'}</span>
      </div>

      <div className="trigger-table" role="list">
        {triggers.map((trigger) => (
          <button
            type="button"
            className={`trigger-row ${selectedTriggerId === trigger.id ? 'selected' : ''}`}
            key={trigger.id}
            onClick={() => onSelectTrigger(trigger.id)}
            role="listitem"
          >
            <span className="trigger-name">{trigger.shortName}</span>
            <span>{trigger.behavior}</span>
            <span>{trigger.inferredIntent}</span>
            <span>{trigger.contentAction}</span>
            <span>{trigger.safetyGuardrail}</span>
            <span className={`status-badge ${getStatusClass(trigger.status)}`}>
              {localizeStatus(trigger.status, language)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default TriggerMatrix;
