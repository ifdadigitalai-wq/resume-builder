'use client';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WizardNavButtonsProps {
  isFirst: boolean;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSaveDraft?: () => void;
  nextLabel?: string;
  loading?: boolean;
}

export function WizardNavButtons({ isFirst, isLast, onPrev, onNext, onSaveDraft, nextLabel, loading }: WizardNavButtonsProps) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <Button variant="ghost" size="md" onClick={onSaveDraft}>Save Draft</Button>
      <div className="flex items-center gap-3">
        {!isFirst && (
          <Button variant="secondary" size="md" onClick={onPrev}>
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
        )}
        <Button variant="primary" size="md" onClick={onNext} loading={loading}>
          {isLast ? (nextLabel ?? 'Generate Resume') : 'Next'}
          {!isLast && <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
