'use client';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ScoreRingProps {
  score: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  className?: string;
}

export function ScoreRing({
  score,
  max = 100,
  size = 96,
  strokeWidth = 8,
  color = '#3B49DF',
  label,
  className,
}: ScoreRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const pct = Math.min(Math.max(score / max, 0), 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    // Animate from full offset (0%) to target
    el.style.strokeDashoffset = String(circumference);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'stroke-dashoffset 1.2s ease-out';
        el.style.strokeDashoffset = String(offset);
      });
    });
  }, [score, circumference, offset]);

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
        aria-label={`Score: ${score} out of ${max}`}
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ width: size, height: size, position: 'relative', marginTop: -size }}
      >
        <span className="text-xl font-bold text-text-primary leading-none">{score}</span>
        <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wide">
          {max === 100 ? '%' : `/ ${max}`}
        </span>
      </div>
      {label && <span className="text-xs text-text-muted font-medium">{label}</span>}
    </div>
  );
}
