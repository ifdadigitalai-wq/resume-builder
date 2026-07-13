'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from "next/image";

import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserCheck,
  GraduationCap,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/students-details', label: 'Students', icon: Users },
  { href: '/admin/job-details', label: 'Matched Jobs', icon: Briefcase },
  { href: '/admin/Allocate-job', label: 'Allocate Job', icon: UserCheck },
];

export function OfficerSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔥 MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 bg-[#020617] border-b border-white/10">
        <div className="flex items-center gap-2 text-white font-bold">
          <Zap className="h-5 w-5 text-cyan-400" />
          IFDA Institute
        </div>

        <button onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* 🔥 OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* 🔥 SIDEBAR */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 transform transition-transform duration-300',
          'bg-gradient-to-b from-[#020617] via-[#07111F] to-[#020617]',
          'text-white border-r border-white/10 backdrop-blur-xl',
          open ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:flex lg:flex-col'
        )}
      >
        {/* CLOSE BUTTON (MOBILE) */}
        <div className="lg:hidden flex justify-end p-4">
          <button onClick={() => setOpen(false)}>
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* LOGO */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center">
          
                      <Image
                        src="/images/logo/ifda-logo.jfif"   // 👈 public folder me image rakho
                        alt="Logo"
                        width={70}
                        height={40}
                        className="object-contain rounded-2xl "
                      />
                    </div>

          <div>
            <p className="text-base font-extrabold tracking-tight">
              IFDA Institute
            </p>
            <p className="text-[10px] uppercase tracking-widest text-cyan-300/70">
              Officer Panel
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {navItems.map(({ href, label, icon: Icon }, index) => {
            const isActive = pathname === href;

            return (
              <Link
                key={index}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 active:scale-[0.98]',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-all duration-300 group-hover:scale-110',
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-cyan-300'
                  )}
                />
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  {label}
                </span>

                {isActive && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-cyan-300 shadow-md shadow-cyan-300/50 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* USER CARD */}
        <div className="p-4 border-t border-white/10">
          <div className="rounded-2xl p-4 bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 active:scale-[0.98]">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-400 font-bold text-white">
                PO
              </div>

              <div>
                <p className="text-sm font-semibold">IFDA Institute</p>
                <p className="text-xs text-cyan-300/70">Placement Officer</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-cyan-200 bg-white/5 px-3 py-2 rounded-lg">
              <GraduationCap className="h-4 w-4" />
              248 Students
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}