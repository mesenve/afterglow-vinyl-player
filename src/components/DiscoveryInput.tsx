import Card from './Card';
import {
  goals,
  industries,
  maturities,
  surfaceNames,
  type DiscoveryState,
  type SurfaceName,
} from '../data/caseStudy';

interface DiscoveryInputProps {
  discovery: DiscoveryState;
  onChange: (discovery: DiscoveryState) => void;
}

function DiscoveryInput({ discovery, onChange }: DiscoveryInputProps) {
  const update = <Key extends keyof DiscoveryState>(key: Key, value: DiscoveryState[Key]) => {
    onChange({ ...discovery, [key]: value });
  };

  const toggleSurface = (surface: SurfaceName) => {
    const nextSurfaces = discovery.surfaces.includes(surface)
      ? discovery.surfaces.filter((item) => item !== surface)
      : [...discovery.surfaces, surface];
    update('surfaces', nextSurfaces);
  };

  return (
    <div className="two-column-grid">
      <Card className="span-large">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Discovery Input</p>
            <h2>Messy client notes</h2>
          </div>
          <span className="soft-pill">Default sample loaded</span>
        </div>
        <label>
          Discovery notes
          <textarea
            className="notes-field"
            value={discovery.messyNotes}
            onChange={(event) => update('messyNotes', event.target.value)}
          />
        </label>
      </Card>

      <Card>
        <p className="section-kicker">Client Context</p>
        <div className="field-stack">
          <div className="control-group">
            <span>Industry</span>
            <div className="segmented-control">
              {industries.map((industry) => (
                <button
                  type="button"
                  key={industry}
                  className={discovery.industry === industry ? 'selected' : ''}
                  onClick={() => update('industry', industry)}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>
          <div className="control-group">
            <span>Brand maturity</span>
            <div className="segmented-control">
              {maturities.map((maturity) => (
                <button
                  type="button"
                  key={maturity}
                  className={discovery.maturity === maturity ? 'selected' : ''}
                  onClick={() => update('maturity', maturity)}
                >
                  {maturity}
                </button>
              ))}
            </div>
          </div>
          <div className="control-group">
            <span>Primary goal</span>
            <div className="segmented-control">
              {goals.map((goal) => (
                <button
                  type="button"
                  key={goal}
                  className={discovery.primaryGoal === goal ? 'selected' : ''}
                  onClick={() => update('primaryGoal', goal)}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="span-all">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Main Content Surfaces</p>
            <h2>Select the places this brief must govern</h2>
          </div>
          <span className="soft-pill">{discovery.surfaces.length} selected</span>
        </div>
        <div className="surface-toggle-grid">
          {surfaceNames.map((surface) => (
            <button
              type="button"
              key={surface}
              className={discovery.surfaces.includes(surface) ? 'selected' : ''}
              onClick={() => toggleSurface(surface)}
            >
              {surface}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default DiscoveryInput;
