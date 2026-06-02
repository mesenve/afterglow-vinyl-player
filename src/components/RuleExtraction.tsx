import Badge from './Badge';
import Card from './Card';
import type { RuleGroup } from '../data/caseStudy';

interface RuleExtractionProps {
  messyNotes: string;
  ruleGroups: RuleGroup[];
}

function RuleExtraction({ messyNotes, ruleGroups }: RuleExtractionProps) {
  const shortNotes = messyNotes.length > 190 ? `${messyNotes.slice(0, 190)}...` : messyNotes;

  return (
    <div>
      <div className="section-heading">
        <div>
          <p className="section-kicker">Resolution Engine</p>
          <h2>Contradictions translated into explicit communication rules</h2>
        </div>
        <span className="soft-pill">Deterministic output</span>
      </div>

      <Card className="transformation-card">
        <div>
          <span>Messy brand input</span>
          <p>"{shortNotes}"</p>
        </div>
        <div>
          <span>Resolved system output</span>
          <p>
            Voice rules, avoid rules, allowed content patterns, review requirements, and surface-specific instructions
            that can feed a prompt reliably.
          </p>
        </div>
      </Card>

      <div className="rule-grid">
        {ruleGroups.map((group) => (
          <Card key={group.title} className="rule-card">
            <div className="card-title-row">
              <h3>{group.title}</h3>
              <Badge tone={group.tone}>{group.badge}</Badge>
            </div>
            <ul>
              {group.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default RuleExtraction;
