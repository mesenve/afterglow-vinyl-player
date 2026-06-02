import Badge from './Badge';
import Card from './Card';
import { surfaceRules, type SurfaceName, type SurfaceRule } from '../data/caseStudy';

interface SurfaceRuleBuilderProps {
  selectedSurface: SurfaceName;
  surfaceRule: SurfaceRule;
  onSelectSurface: (surface: SurfaceName) => void;
}

function SurfaceRuleBuilder({ selectedSurface, surfaceRule, onSelectSurface }: SurfaceRuleBuilderProps) {
  return (
    <div className="surface-builder">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Surface Rule Builder</p>
          <h2>Map the same brand voice to different content surfaces</h2>
        </div>
        <Badge tone="voice">{selectedSurface}</Badge>
      </div>

      <div className="surface-selector">
        {surfaceRules.map((surface) => (
          <button
            type="button"
            key={surface.surface}
            className={surface.surface === selectedSurface ? 'selected' : ''}
            onClick={() => onSelectSurface(surface.surface)}
          >
            <strong>{surface.surface}</strong>
            <span>{surface.purpose}</span>
          </button>
        ))}
      </div>

      <Card className="surface-detail">
        <div className="card-title-row">
          <h3>{surfaceRule.surface}</h3>
          <Badge tone="success">Mapped</Badge>
        </div>
        <dl className="detail-list">
          <div>
            <dt>Purpose</dt>
            <dd>{surfaceRule.purpose}</dd>
          </div>
          <div>
            <dt>Tone</dt>
            <dd>{surfaceRule.tone}</dd>
          </div>
          <div>
            <dt>Length guidance</dt>
            <dd>{surfaceRule.length}</dd>
          </div>
          <div>
            <dt>Allowed content</dt>
            <dd>{surfaceRule.allowed}</dd>
          </div>
          <div>
            <dt>Avoided content</dt>
            <dd>{surfaceRule.avoid}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

export default SurfaceRuleBuilder;
