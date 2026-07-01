'use client';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'cyan';
  size?: 'sm' | 'md';
  animated?: boolean;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  color = 'blue',
  size = 'sm',
  animated = true,
  className,
  showLabel = false,
}: ProgressBarProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);

  const colors = {
    blue: 'bg-primary-DEFAULT',
    green: 'bg-success',
    amber: 'bg-warning',
    red: 'bg-danger',
    cyan: 'bg-accent-cyan',
  };

  const trackColors = {
    blue: 'bg-blue-100',
    green: 'bg-emerald-100',
    amber: 'bg-amber-100',
    red: 'bg-red-100',
    cyan: 'bg-cyan-100',
  };

  const heights = { sm: 'h-1.5', md: 'h-2.5' };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-text-muted">{value}%</span>
        </div>
      )}
      <div className={cn('w-full rounded-full overflow-hidden', trackColors[color], heights[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000 ease-out',
            colors[color],
            animated && 'progress-animate'
          )}
          style={{
            width: `${pct}%`,
            ['--target-width' as string]: `${pct}%`,
          }}
        />
      </div>
    </div>
  );
}
