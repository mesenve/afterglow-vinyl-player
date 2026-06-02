import Badge from './Badge';
import Card from './Card';
import type { BrandTension } from '../data/caseStudy';

interface ClarifyingQuestionsProps {
  tensions: BrandTension[];
}

function ClarifyingQuestions({ tensions }: ClarifyingQuestionsProps) {
  return (
    <div>
      <div className="section-heading">
        <div>
          <p className="section-kicker">Clarifying Question Generator</p>
          <h2>Ask the questions the brand team has not answered yet</h2>
        </div>
        <Badge tone="voice">Discovery assist</Badge>
      </div>

      <div className="question-table">
        {tensions.map((tension) => (
          <Card key={tension.input} className="question-row">
            <Badge tone={tension.severity === 'Critical' || tension.severity === 'High' ? 'danger' : 'warning'}>
              {tension.severity}
            </Badge>
            <div>
              <strong>{tension.input}</strong>
              <p>{tension.question}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default ClarifyingQuestions;
