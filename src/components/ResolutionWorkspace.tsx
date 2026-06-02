import Badge from './Badge';
import Card from './Card';
import type { BrandTension } from '../data/caseStudy';

interface ResolutionWorkspaceProps {
  tensions: BrandTension[];
}

function ResolutionWorkspace({ tensions }: ResolutionWorkspaceProps) {
  return (
    <div>
      <div className="section-heading">
        <div>
          <p className="section-kicker">Resolution Workspace</p>
          <h2>Turn each tension into a concrete content rule</h2>
        </div>
        <Badge tone="success">Resolved locally</Badge>
      </div>

      <div className="resolution-grid">
        {tensions.map((tension) => (
          <Card key={tension.input} className="resolution-card">
            <div className="card-title-row">
              <h3>{tension.input}</h3>
              <Badge tone="voice">{tension.selectedResolution}</Badge>
            </div>
            <p>{tension.tension}</p>
            <div className="resolved-rule">
              <span>Resolved rule</span>
              <strong>{tension.resolvedRule}</strong>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ResolutionWorkspace;
