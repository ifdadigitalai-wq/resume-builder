'use client';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={cn(
          'w-full px-3 py-2 text-sm text-text-primary bg-white/95 border rounded-[8px] outline-none transition-all duration-200 min-h-[40px] shadow-[inset_0_1px_0_rgba(15,23,42,0.03)]',
          'placeholder:text-text-muted',
          error
            ? 'border-danger focus:ring-2 focus:ring-danger/20'
            : 'border-border hover:border-slate-300 focus:border-primary-DEFAULT focus:ring-4 focus:ring-primary-DEFAULT/10',
          'disabled:bg-surface disabled:cursor-not-allowed',
          className
        )}
      />
      {error && <p className="text-xs text-danger mt-0.5">{error}</p>}
      {helperText && !error && <p className="text-xs text-text-muted mt-0.5">{helperText}</p>}
    </div>
  );
}
