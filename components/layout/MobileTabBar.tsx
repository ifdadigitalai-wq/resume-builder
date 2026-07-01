'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, BarChart2, Target, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileTabBar() {
  const pathname = usePathname();
  const [latestResumeId, setLatestResumeId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data?.latestResumeId) {
          setLatestResumeId(data.latestResumeId);
        }
      })
      .catch(() => {});
  }, []);

  const resumeEditorHref = latestResumeId
    ? `/resume/${latestResumeId}/editor`
    : '/resume/create';
  const resumeAtsHref = latestResumeId
    ? `/resume/${latestResumeId}/ats`
    : '#';

  const TAB_ITEMS = [
    { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { href: resumeEditorHref, label: 'Resume', icon: FileText },
    { href: resumeAtsHref, label: 'ATS', icon: BarChart2, disabled: !latestResumeId },
    { href: '/placement-readiness', label: 'Readiness', icon: Target },
    { href: '/downloads', label: 'Files', icon: Download },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white/92 backdrop-blur-xl border-t border-white/70 flex justify-around items-center px-2 py-1 safe-area-inset-bottom shadow-[0_-12px_34px_rgba(15,23,42,0.10)]">
      {TAB_ITEMS.map(({ href, label, icon: Icon, disabled }) => {
        const isActive = !disabled && (pathname === href || pathname.startsWith(href + '/'));
        
        const content = (
          <>
            <Icon className={cn('h-5 w-5', isActive && 'text-primary-DEFAULT')} />
            <span className="text-[10px] font-semibold">{label}</span>
          </>
        );

        const className = cn(
          'flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-lg transition-all min-w-[44px] min-h-[44px]',
          disabled 
            ? 'opacity-40 cursor-not-allowed text-text-muted' 
            : isActive 
              ? 'bg-blue-50 text-primary-DEFAULT shadow-sm' 
              : 'text-text-muted hover:bg-surface'
        );

        if (disabled) {
          return (
            <div key={label} className={className}>
              {content}
            </div>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            className={className}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
