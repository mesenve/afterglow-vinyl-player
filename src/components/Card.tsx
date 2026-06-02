import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

function Card({ children, className = '' }: CardProps) {
  return <article className={`card ${className}`.trim()}>{children}</article>;
}

export default Card;
