import Badge from './Badge';
import Card from './Card';
import type { ProductInput, SampleOutput, SurfaceName } from '../data/caseStudy';

interface FirstRunPreviewProps {
  selectedSurface: SurfaceName;
  product: ProductInput;
  outputs: SampleOutput[];
  onSelectSurface: (surface: SurfaceName) => void;
  onChangeProduct: (product: ProductInput) => void;
}

function FirstRunPreview({ selectedSurface, product, outputs, onSelectSurface, onChangeProduct }: FirstRunPreviewProps) {
  const activeOutput = outputs.find((output) => output.surface === selectedSurface) ?? outputs[0];

  if (!activeOutput) {
    return (
      <Card>
        <p>No selected surfaces are available. Go back to Discovery Input and select at least one surface.</p>
      </Card>
    );
  }

  return (
    <div className="preview-layout">
      <Card>
        <div className="section-heading">
          <div>
            <p className="section-kicker">First Content Run Preview</p>
            <h2>{product.name}</h2>
          </div>
          <Badge tone="success">Generated locally</Badge>
        </div>
        <div className="field-stack">
          <label>
            Product
            <input
              value={product.name}
              onChange={(event) => onChangeProduct({ ...product, name: event.target.value })}
            />
          </label>
          <label>
            Product facts
            <textarea
              className="product-fact-input"
              value={product.facts}
              onChange={(event) => onChangeProduct({ ...product, facts: event.target.value })}
            />
          </label>
        </div>
        <div className="product-facts">
          <span>Current approved facts</span>
          <p>{product.facts}</p>
        </div>
        <div className="surface-toggle-grid compact">
          {outputs.map((output) => (
            <button
              type="button"
              key={output.surface}
              className={output.surface === selectedSurface ? 'selected' : ''}
              onClick={() => onSelectSurface(output.surface)}
            >
              {output.surface}
            </button>
          ))}
        </div>
      </Card>

      <Card className="output-card">
        <div className="card-title-row">
          <h3>{activeOutput.surface}</h3>
          <div className="badge-row">
            <Badge tone={activeOutput.risk === 'Low' ? 'success' : activeOutput.risk === 'Medium' ? 'warning' : 'danger'}>
              Risk: {activeOutput.risk}
            </Badge>
            <Badge tone={activeOutput.status === 'Ready' ? 'success' : 'warning'}>{activeOutput.status}</Badge>
          </div>
        </div>
        <blockquote>{activeOutput.content}</blockquote>
        <div className="fit-note">
          <strong>Why it fits the brief</strong>
          <p>{activeOutput.reason}</p>
          <ul>
            {activeOutput.checks.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}

export default FirstRunPreview;
