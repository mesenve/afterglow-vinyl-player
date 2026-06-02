import Badge from './Badge';
import Card from './Card';

interface AIGuardrailsProps {
  guardrails: string[];
}

const labels = ['Tone guardrail', 'CTA guardrail', 'Personalization guardrail', 'Compliance guardrail', 'Surface-length guardrail'];

function AIGuardrails({ guardrails }: AIGuardrailsProps) {
  return (
    <div>
      <div className="section-heading">
        <div>
          <p className="section-kicker">AI Guardrail Output</p>
          <h2>Convert resolved rules into prompt-ready constraints</h2>
        </div>
        <Badge tone="success">Prompt-ready</Badge>
      </div>

      <div className="guardrail-grid">
        {guardrails.map((guardrail, index) => (
          <Card key={guardrail} className="guardrail-card">
            <span>{labels[index] ?? 'Guardrail'}</span>
            <p>{guardrail}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AIGuardrails;
