'use client';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ label, error, helperText, options, placeholder, className, id, ...props }: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={inputId}
          {...props}
          className={cn(
            'w-full px-3 py-2 pr-9 text-sm text-text-primary bg-white/95 border rounded-[8px] outline-none transition-all duration-200 appearance-none min-h-[40px] shadow-[inset_0_1px_0_rgba(15,23,42,0.03)]',
            error
              ? 'border-danger focus:ring-2 focus:ring-danger/20'
              : 'border-border hover:border-slate-300 focus:border-primary-DEFAULT focus:ring-4 focus:ring-primary-DEFAULT/10',
            'disabled:bg-surface disabled:cursor-not-allowed',
            className
          )}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
      </div>
      {error && <p className="text-xs text-danger mt-0.5">{error}</p>}
      {helperText && !error && <p className="text-xs text-text-muted mt-0.5">{helperText}</p>}
    </div>
  );
}
