import Badge from './Badge';
import type { RiskLevel } from '../data/caseStudy';

interface SeverityBadgeProps {
  severity?: RiskLevel;
}

function SeverityBadge({ severity = 'Low' }: SeverityBadgeProps) {
  const tone = severity === 'Critical' || severity === 'High' ? 'danger' : severity === 'Medium' ? 'warning' : 'neutral';

  return <Badge tone={tone}>{severity}</Badge>;
}

export default SeverityBadge;
