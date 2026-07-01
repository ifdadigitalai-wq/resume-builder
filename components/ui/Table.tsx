'use client';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  className?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T>({ columns, data, keyExtractor, className, onRowClick }: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-[10px] border border-border', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-surface border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn('px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide', col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-border last:border-0 transition-all duration-100',
                'hover:bg-blue-50/50 hover:border-l-2 hover:border-l-primary-DEFAULT',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className={cn('px-4 py-3 text-text-primary', col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
