import Badge from './Badge';
import Card from './Card';

interface ReviewExportProps {
  onExport: () => void;
  onStartRun: () => void;
  onEditRules: () => void;
  lastSavedAt?: string;
}

const checklist = [
  'Brand voice defined',
  'Avoid rules defined',
  'Surface rules mapped',
  'Human review rules added',
  'Prompt-ready brief generated',
  'Sample outputs reviewed',
];

function ReviewExport({ onExport, onStartRun, onEditRules, lastSavedAt }: ReviewExportProps) {
  return (
    <Card className="review-panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Review & Export</p>
          <h2>Ready for First Content Run</h2>
        </div>
        <Badge tone="success">Complete</Badge>
      </div>

      <div className="checklist">
        {checklist.map((item) => (
          <div key={item}>
            <span aria-hidden="true">OK</span>
            <strong>{item}</strong>
          </div>
        ))}
      </div>

      <div className="export-actions">
        <button type="button" className="primary-button" onClick={onExport}>
          Export Brief
        </button>
        <button type="button" onClick={onStartRun}>
          Start First Run
        </button>
        <button type="button" onClick={onEditRules}>
          Edit Rules
        </button>
      </div>
      {lastSavedAt ? <p className="status-line">Last local save: {lastSavedAt}</p> : null}
    </Card>
  );
}

export default ReviewExport;
