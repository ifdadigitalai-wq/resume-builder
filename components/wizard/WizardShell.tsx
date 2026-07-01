'use client';

import { StepIndicator } from '@/components/wizard/StepIndicator';
import { Card } from '@/components/ui/Card';

interface WizardShellProps {
  step: number;
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function WizardShell({ step, title, children, footer }: WizardShellProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-4xl flex-col gap-6 p-4 sm:p-6">
      <StepIndicator currentStep={step} totalSteps={7} />
      <Card
        className="mx-auto w-full max-w-2xl"
        header={<h2 className="text-base font-bold text-text-primary">{title}</h2>}
        footer={footer}
      >
        {children}
      </Card>
    </div>
  );
}
