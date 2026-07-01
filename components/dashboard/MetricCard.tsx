'use client';

import { ScoreRing } from '@/components/ui/ScoreRing';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  type?: 'ring' | 'badge' | 'text';
  color?: string;
  badgeVariant?: 'blue' | 'green' | 'amber' | 'gray';
  icon?: React.ReactNode;
}

export function MetricCard({
  title,
  value,
  subtitle,
  type = 'text',
  color = '#3B49DF',
  badgeVariant = 'blue',
  icon,
}: MetricCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl p-5 shadow-[0_10px_40px_rgba(59,73,223,0.08)]"
    >
      {/* Glow */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-400/10 blur-3xl transition-all duration-500 group-hover:bg-blue-400/20" />

      {/* Shine */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -left-20 top-0 h-full w-16 rotate-12 bg-white/40 blur-md animate-[shine_1.5s_ease-in-out]" />
      </div>

      <div className="relative flex items-center gap-4">
        {/* Ring */}
        {type === 'ring' && typeof value === 'number' && (
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl" />
            <ScoreRing
              score={value}
              max={100}
              size={68}
              strokeWidth={7}
              color={color}
            />
          </div>
        )}

        {/* Icon */}
        {type !== 'ring' && (
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110',
              {
                'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600':
                  badgeVariant === 'blue',

                'bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600':
                  badgeVariant === 'green',

                'bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600':
                  badgeVariant === 'amber',

                'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600':
                  badgeVariant === 'gray',
              }
            )}
          >
            {icon}
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>

          {type === 'badge' ? (
            <span
              className={cn(
                'mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                {
                  'bg-blue-100 text-blue-700':
                    badgeVariant === 'blue',

                  'bg-emerald-100 text-emerald-700':
                    badgeVariant === 'green',

                  'bg-amber-100 text-amber-700':
                    badgeVariant === 'amber',

                  'bg-slate-200 text-slate-700':
                    badgeVariant === 'gray',
                }
              )}
            >
              {value}
            </span>
          ) : (
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              {value}
            </h3>
          )}

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Progress Accent */}
      <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden">
        <div className="h-full w-0 bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700 group-hover:w-full" />
      </div>
    </motion.div>
  );
}