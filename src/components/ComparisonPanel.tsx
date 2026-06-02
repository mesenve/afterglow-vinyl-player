import Badge from './Badge';
import Card from './Card';

interface ComparisonPanelProps {
  issues?: string[];
  output: string;
  prompt: string;
  risk: 'High' | 'Low';
  title: string;
  variant: 'risky' | 'safer';
  why?: string[];
}

function ComparisonPanel({ issues = [], output, prompt, risk, title, variant, why = [] }: ComparisonPanelProps) {
  return (
    <Card className={`comparison-panel ${variant}`}>
      <div className="card-title-row">
        <h3>{title}</h3>
        <Badge tone={risk === 'High' ? 'danger' : 'success'}>Risk: {risk}</Badge>
      </div>
      <span>Prompt</span>
      <p>{prompt}</p>
      <span>{variant === 'risky' ? 'Risky AI output' : 'Safer output'}</span>
      <blockquote>{output}</blockquote>
      <div className="issue-list">
        {issues.map((issue) => (
          <Badge key={issue} tone="danger">
            {issue}
          </Badge>
        ))}
        {why.map((item) => (
          <Badge key={item} tone="success">
            {item}
          </Badge>
        ))}
      </div>
    </Card>
  );
}

export default ComparisonPanel;
