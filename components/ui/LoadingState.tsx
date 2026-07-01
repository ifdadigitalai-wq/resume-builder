'use client';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Loading...', className, size = 'md' }: LoadingStateProps) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 gap-3', className)}>
      <Loader2 className={cn('animate-spin text-primary-DEFAULT', sizes[size])} />
      <p className="text-sm text-text-muted font-medium">{message}</p>
    </div>
  );
}
