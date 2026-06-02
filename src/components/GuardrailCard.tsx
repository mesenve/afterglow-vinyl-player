import Card from './Card';

interface GuardrailCardProps {
  label: string;
  guardrail: string;
}

function GuardrailCard({ label, guardrail }: GuardrailCardProps) {
  return (
    <Card className="guardrail-card">
      <span>{label}</span>
      <p>{guardrail}</p>
    </Card>
  );
}

export default GuardrailCard;
