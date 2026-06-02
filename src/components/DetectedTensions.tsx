import Badge from './Badge';
import TensionCard from './TensionCard';
import type { BrandTension } from '../data/caseStudy';

interface DetectedTensionsProps {
  selectedTension: string;
  tensions: BrandTension[];
  onSelectTension: (tension: string) => void;
}

function DetectedTensions({ selectedTension, tensions, onSelectTension }: DetectedTensionsProps) {
  return (
    <div>
      <div className="section-heading">
        <div>
          <p className="section-kicker">Detected Tensions</p>
          <h2>Detected brand tensions</h2>
        </div>
        <Badge tone="warning">{tensions.length} tensions found</Badge>
      </div>
      <p className="intro-copy">
        The system identifies contradictions and ambiguous instructions that could lead to inconsistent, off-brand, or
        risky AI-generated content.
      </p>

      <div className="tension-card-grid">
        {tensions.map((tension) => (
          <TensionCard
            key={tension.input}
            tension={tension}
            isSelected={selectedTension === tension.input}
            onSelect={() => onSelectTension(tension.input)}
          />
        ))}
      </div>
    </div>
  );
}

export default DetectedTensions;
