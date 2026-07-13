'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";

import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  Briefcase,
  Target,
  Download,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { Tooltip } from '@/components/ui/Tooltip';

export function StudentSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const [progress, setProgress] = useState(0);
  const [latestResumeId, setLatestResumeId] = useState<string | null>(null);
  const [userName, setUserName] = useState('Student');
  const [userCourse, setUserCourse] = useState('');
  const [userBatch, setUserBatch] = useState('');

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.completionScore === 'number') {
          setProgress(data.completionScore);
        }
        if (data?.latestResumeId) {
          setLatestResumeId(data.latestResumeId);
        }
      })
      .catch(() => {});

    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        if (data?.user) {
          setUserName(data.user.name || 'Student');
          setUserCourse(data.user.course || '');
          setUserBatch(data.user.batch || '');
        }
      })
      .catch(() => {});
  }, [pathname]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(w => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const resumeEditorHref = latestResumeId
    ? `/resume/${latestResumeId}/editor`
    : '/resume/create';
  const resumeAtsHref = latestResumeId
    ? `/resume/${latestResumeId}/ats`
    : '#';

  const NAV_ITEMS = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: resumeEditorHref,
      label: 'My Resume',
      icon: FileText,
    },
    {
      href: resumeAtsHref,
      label: 'ATS Analysis',
      icon: BarChart2,
      disabled: !latestResumeId,
    },
    {
      href: '/jobs',
      label: 'Job Search',
      icon: Briefcase,
    },
    {
      href: '/placement-readiness',
      label: 'Readiness',
      icon: Target,
    },
    {
      href: '/downloads',
      label: 'Downloads',
      icon: Download,
    }, {
      href: '/Admin-Message',
      label: 'Admin Message',
      icon: MessageSquare
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
    }
  ];

  return (
    <aside
      className={cn(
        'hidden md:flex fixed left-0 top-0 z-50 h-screen flex-col overflow-hidden',
        'border-r border-white/10',
        'bg-[#07111F]/95 backdrop-blur-2xl',
        'shadow-[20px_0_60px_rgba(0,0,0,0.35)]',
        'transition-all duration-300 ease-in-out',
        'before:absolute before:inset-0 before:pointer-events-none',
        'before:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_35%)]',
        'after:absolute after:inset-0 after:pointer-events-none',
        'after:bg-[radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.15),transparent_30%)]',
        isSidebarOpen ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'relative flex items-center gap-3 border-b border-white/10 px-5 py-5',
          !isSidebarOpen && 'justify-center px-0'
        )}
      >
        <motion.div
          whileHover={{ rotate: 10, scale: 1.05 }}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 shadow-[0_0_35px_rgba(59,130,246,0.45)]"
        >
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center">

            <Image
              src="/images/logo/ifda-logo.jfif"
              alt="Logo"
              width={70}
              height={40}
              className="object-contain rounded-2xl "
            />
          </div>
        </motion.div>

        {isSidebarOpen && (
          <div>
            <p className="bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-base font-black tracking-tight text-transparent">
              IFDA Institute
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-cyan-100/50">
              Placement Portals
            </p>
          </div>
        )}
      </div>
      {/* Navigation */}
      <nav className="relative flex-1 space-y-2 overflow-y-auto px-3 py-5">
        {NAV_ITEMS.map(({ href, label, icon: Icon, disabled }) => {
          const isActive =
            !disabled && (pathname === href || pathname.startsWith(href + '/'));

          const navLinkContent = (
            <>
              {/* Active Indicator */}
              {isActive && (
                <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />
              )}

              {/* Hover Glow */}
              {!disabled && (
                <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/10 to-blue-500/5" />
                </div>
              )}

              {/* Icon */}
              <div
                className={cn(
                  'relative z-10 flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300',
                  isActive
                    ? 'bg-white/15'
                    : 'bg-white/[0.04]',
                  !disabled && 'group-hover:bg-white/[0.08]'
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              {isSidebarOpen && (
                <span className="relative z-10">
                  {label}
                </span>
              )}
            </>
          );

          const className = cn(
            'group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-300',
            disabled
              ? 'opacity-40 cursor-not-allowed text-slate-500'
              : isActive
                ? 'bg-gradient-to-r from-primary-DEFAULT to-accent-cyan text-white shadow-[0_12px_30px_rgba(59,73,223,0.35)]'
                : 'text-slate-400 hover:bg-white/[0.05] hover:text-white',
            !isSidebarOpen && 'mx-auto h-12 w-12 justify-center px-0'
          );

          if (disabled) {
            return isSidebarOpen ? (
              <div key={label} className={className}>
                {navLinkContent}
              </div>
            ) : (
              <Tooltip key={label} content={`${label} (Create a resume first)`}>
                <div className={className}>
                  {navLinkContent}
                </div>
              </Tooltip>
            );
          }

          const navLink = (
            <Link key={href} href={href} className={className}>
              {navLinkContent}
            </Link>
          );

          return isSidebarOpen ? (
            navLink
          ) : (
            <Tooltip key={href} content={label}>
              {navLink}
            </Tooltip>
          );
        })}
      </nav>

      {/* User Card */}
      {isSidebarOpen && (
        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 font-bold text-white">
                  {getInitials(userName)}
                </div>

                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#07111F] bg-emerald-400" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">
                  {userName}
                </p>

                <p className="truncate text-xs text-slate-400">
                  {userBatch ? `${userBatch} • ` : ''}{userCourse || 'Student'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute right-1 top-24 z-50 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label={
          isSidebarOpen
            ? 'Collapse sidebar'
            : 'Expand sidebar'
        }
      >
        {isSidebarOpen ? (
          <ChevronLeft className="h-4 w-4 text-slate-700" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-700" />
        )}
      </button>
    </aside>
  );
}