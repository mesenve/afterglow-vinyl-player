import Badge from './Badge';
import Card from './Card';

interface DashboardIntroProps {
  onStart: () => void;
}

const summaryCards = [
  { label: 'Brand input analyzed', value: 'Live', detail: 'Messy notes, surfaces, maturity, and goal signals' },
  { label: 'Contradictions detected', value: 'Scored', detail: 'Tensions, risks, evidence, and missing questions' },
  { label: 'Rules resolved', value: 'Structured', detail: 'Voice rules, boundaries, approvals, and surface logic' },
  { label: 'AI handoff prepared', value: 'Ready', detail: 'Prompt-ready brief plus first-run safety checks' },
];

function DashboardIntro({ onStart }: DashboardIntroProps) {
  return (
    <div className="intro-layout">
      <section className="hero-panel">
        <Badge tone="voice">Contradiction detection layer</Badge>
        <h2>Find the hidden contradictions in brand discovery before AI writes a word.</h2>
        <p>
          This is not a brand voice generator. It is a working layer that reads vague or conflicting brand expectations,
          identifies where the AI would get confused, asks the missing questions, and converts the answers into rules the
          content engine can safely use.
        </p>
        <button type="button" className="primary-button hero-cta" onClick={onStart}>
          Start Discovery
        </button>
      </section>

      <div className="summary-grid">
        {summaryCards.map((card) => (
          <Card key={card.label} className="metric-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <p>{card.detail}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default DashboardIntro;
