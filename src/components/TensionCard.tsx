import Card from './Card';
import SeverityBadge from './SeverityBadge';
import SurfaceChip from './SurfaceChip';
import type { BrandTension } from '../data/caseStudy';

interface TensionCardProps {
  isSelected: boolean;
  tension: BrandTension;
  onSelect: () => void;
}

function TensionCard({ isSelected, tension, onSelect }: TensionCardProps) {
  return (
    <button type="button" className={`tension-card ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      <Card>
        <div className="card-title-row">
          <h3>{tension.input}</h3>
          <SeverityBadge severity={tension.severity} />
        </div>
        <div className="tension-meta">
          <span>Risk</span>
          <p>{tension.contentRisk}</p>
        </div>
        <div className="surface-chip-row">
          {tension.affectedSurfaces?.map((surface) => <SurfaceChip key={surface} surface={surface} />)}
        </div>
        <div className="tension-meta">
          <span>Why it matters</span>
          <p>{tension.evidence}</p>
        </div>
      </Card>
    </button>
  );
}

export default TensionCard;
