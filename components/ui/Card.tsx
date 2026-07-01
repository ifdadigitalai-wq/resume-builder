'use client';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: boolean;
}

export function Card({ children, className, header, footer, padding = true }: CardProps) {
  return (
    <div className={cn('rounded-[10px] border border-white/70 bg-white/95 shadow-card backdrop-blur-sm interactive-lift', className)}>
      {header && (
        <div className="border-b border-border/80 bg-gradient-to-r from-white to-surface/60 px-5 py-4">{header}</div>
      )}
      <div className={cn(padding && 'p-5')}>{children}</div>
      {footer && (
        <div className="rounded-b-[10px] border-t border-border/80 bg-surface/80 px-5 py-4">{footer}</div>
      )}
    </div>
  );
}
