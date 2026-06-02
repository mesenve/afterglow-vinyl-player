import Card from './Card';
import type { DiscoveryState } from '../data/caseStudy';

interface MessyInputProps {
  discovery: DiscoveryState;
  onChange: (discovery: DiscoveryState) => void;
  onDetect: () => void;
}

const detectedInputs = [
  'Tone preferences',
  'Conversion expectations',
  'Personalization boundaries',
  'Compliance concerns',
  'Surface constraints',
];

function MessyInput({ discovery, onChange, onDetect }: MessyInputProps) {
  return (
    <div className="messy-input-grid">
      <Card>
        <div className="section-heading">
          <div>
            <p className="section-kicker">Messy Input</p>
            <h2>Messy brand input</h2>
          </div>
        </div>
        <p className="intro-copy">
          Brand teams often describe what they want through contradictions: friendly but premium, conversion-focused but
          not pushy, personal but not creepy. This step captures the raw input before it becomes an AI prompt.
        </p>
        <label>
          Raw brand notes
          <textarea
            className="notes-field"
            value={discovery.messyNotes}
            onChange={(event) => onChange({ ...discovery, messyNotes: event.target.value })}
          />
        </label>
      </Card>

      <Card className="input-summary-card">
        <p className="section-kicker">Input detected</p>
        <div className="detected-list">
          {detectedInputs.map((input) => (
            <div key={input}>
              <span aria-hidden="true" />
              <strong>{input}</strong>
            </div>
          ))}
        </div>
        <button type="button" className="primary-button" onClick={onDetect}>
          Detect Tensions
        </button>
      </Card>
    </div>
  );
}

export default MessyInput;
