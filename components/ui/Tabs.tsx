'use client';
import { cn } from '@/lib/utils';

interface TabItem {
  key: string;
  label: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export function Tabs({ items, activeKey, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex border-b border-border', className)}>
      {items.map((item) => {
        const isActive = item.key === activeKey;
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={cn(
              'flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all duration-150 whitespace-nowrap',
              isActive
                ? 'border-primary-DEFAULT text-primary-DEFAULT'
                : 'border-transparent text-text-muted hover:text-text-secondary hover:border-border'
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
