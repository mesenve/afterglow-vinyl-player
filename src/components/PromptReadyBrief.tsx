import Badge from './Badge';
import Card from './Card';
import type { GeneratedBrief } from '../data/caseStudy';

interface PromptReadyBriefProps {
  brief: GeneratedBrief;
}

function PromptReadyBrief({ brief }: PromptReadyBriefProps) {
  return (
    <Card className="brief-panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">AI Handoff Brief</p>
          <h2>Only resolved rules move forward into generation</h2>
        </div>
        <Badge tone="success">Generated</Badge>
      </div>

      <div className="brief-code">
        <section>
          <h3>Brand voice</h3>
          <p>{brief.brandVoice}</p>
        </section>
        <section>
          <h3>Tone rules</h3>
          <ul>
            {brief.toneRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Avoid</h3>
          <ul>
            {brief.avoidRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Surface rules</h3>
          <ul>
            {brief.surfaceRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3>Human approval required for</h3>
          <ul>
            {brief.approvals.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>
      </div>
    </Card>
  );
}

export default PromptReadyBrief;
