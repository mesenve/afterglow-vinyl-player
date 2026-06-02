import Badge from './Badge';
import Card from './Card';
import type { GenerationCheck as GenerationCheckData } from '../data/caseStudy';

interface GenerationCheckProps {
  check: GenerationCheckData;
}

function GenerationCheck({ check }: GenerationCheckProps) {
  return (
    <div>
      <div className="section-heading">
        <div>
          <p className="section-kicker">First Generation Check</p>
          <h2>Show the difference between a weak prompt and a guardrailed prompt</h2>
        </div>
        <Badge tone="warning">Before / After</Badge>
      </div>

      <div className="comparison-layout">
        <Card className="comparison-panel risky">
          <span>Weak prompt</span>
          <p>{check.weakPrompt}</p>
          <span>Risky AI output</span>
          <blockquote>{check.riskyOutput}</blockquote>
          <div className="issue-list">
            {check.detectedIssues.map((issue) => (
              <Badge key={issue} tone="danger">
                {issue}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="comparison-panel safer">
          <span>Guardrailed prompt</span>
          <p>{check.guardrailedPrompt}</p>
          <span>Safer output</span>
          <blockquote>{check.saferOutput}</blockquote>
          <Badge tone="success">Ready for controlled first run</Badge>
        </Card>
      </div>
    </div>
  );
}

export default GenerationCheck;
