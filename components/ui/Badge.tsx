'use client';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'blue' | 'green' | 'amber' | 'red' | 'gray' | 'purple' | 'cyan';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'blue', size = 'md', children, className }: BadgeProps) {
  const variants = {
    blue: 'bg-blue-50 text-blue-700 border border-blue-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]',
    amber: 'bg-amber-50 text-amber-700 border border-amber-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]',
    red: 'bg-red-50 text-red-700 border border-red-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]',
    gray: 'bg-slate-100 text-slate-600 border border-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]',
    purple: 'bg-purple-50 text-purple-700 border border-purple-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]',
    cyan: 'bg-cyan-50 text-cyan-700 border border-cyan-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]',
  };
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] rounded-full',
    md: 'px-2.5 py-1 text-xs rounded-full',
  };
  return (
    <span className={cn('inline-flex items-center font-semibold', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
