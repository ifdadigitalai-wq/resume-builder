'use client';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const STEP_LABELS = ['Personal', 'Education', 'Skills', 'Projects', 'Experience', 'Certs', 'Generate'];

interface StepIndicatorProps { currentStep: number; totalSteps: number; }

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-0 w-full px-4">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1;
        const done = step < currentStep;
        const active = step === currentStep;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-200',
                done ? 'bg-primary-DEFAULT border-primary-DEFAULT text-white' :
                active ? 'bg-white border-primary-DEFAULT text-primary-DEFAULT' :
                'bg-white border-border text-text-muted'
              )}>
                {done ? <Check className="h-4 w-4" /> : step}
              </div>
              <span className={cn('text-[10px] font-medium hidden sm:block', active ? 'text-primary-DEFAULT' : 'text-text-muted')}>
                {STEP_LABELS[i]}
              </span>
            </div>
            {i < totalSteps - 1 && (
              <div className={cn('h-0.5 w-8 sm:w-12 mx-1 transition-colors duration-200', step < currentStep ? 'bg-primary-DEFAULT' : 'bg-border')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
