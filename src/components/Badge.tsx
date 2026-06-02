import type { ReactNode } from 'react';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'voice';

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
}

function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export default Badge;
