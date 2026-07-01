'use client';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  const base =
    'group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden font-semibold rounded-[8px] transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants = {
    primary:
      'bg-primary-DEFAULT text-white shadow-[0_1px_2px_rgba(15,23,42,0.08),0_10px_24px_rgba(59,73,223,0.24)] hover:bg-primary-dark hover:shadow-[0_1px_2px_rgba(15,23,42,0.08),0_14px_30px_rgba(59,73,223,0.30)] focus:ring-primary-DEFAULT before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.22),transparent)] before:translate-x-[-120%] hover:before:translate-x-[120%] before:transition-transform before:duration-700',
    secondary:
      'border border-[#BFD7FF] bg-[#EAF3FF] text-[#10233F] shadow-sm hover:border-primary-DEFAULT hover:bg-primary-DEFAULT hover:text-white hover:shadow-[0_12px_26px_rgba(59,73,223,0.16)] focus:ring-primary-DEFAULT',
    ghost:
      'text-text-secondary hover:bg-blue-50 hover:text-primary-DEFAULT focus:ring-primary-DEFAULT',
    danger:
      'bg-danger text-white shadow-[0_1px_2px_rgba(15,23,42,0.08),0_10px_24px_rgba(239,68,68,0.20)] hover:bg-red-600 focus:ring-danger',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs min-h-[32px]',
    md: 'px-4 py-2 text-sm min-h-[40px]',
    lg: 'px-6 py-3 text-base min-h-[48px]',
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
