'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Zap, LogOut } from 'lucide-react';
import Image from "next/image";

export function OfficerNavbar() {
  const router = useRouter();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between 
    border-b border-white/40 
    bg-gradient-to-r from-white/80 via-white/70 to-white/80 
    backdrop-blur-2xl px-4 lg:left-64 lg:px-8
    shadow-[0_8px_30px_rgba(0,0,0,0.05)]">

      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        
        {/* MENU BUTTON */}
        <button className="rounded-xl bg-[#EAF3FF] p-2.5 text-[#45607F] transition-all hover:bg-blue-100 hover:scale-105 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl 
          bg-gradient-to-br from-primary-DEFAULT to-accent-cyan 
          shadow-[0_10px_25px_rgba(59,73,223,0.35)]">
            <Zap className="h-5 w-5 text-white" />
          </div>

          <div className="leading-tight">
            <h1 className="text-sm font-extrabold tracking-tight text-[#0B1B34]">
              Officer Dashboard
            </h1>
            <p className="hidden text-[11px] font-medium text-[#6B85A6] sm:block">
              Manage resumes, ATS scores & student insights
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-3">


        {/* LOGOUT BUTTON */}
        <button
          onClick={async () => {
            try {
              await fetch('/api/auth/logout', { method: 'POST' });
            } catch {}
            router.push('/login');
          }}
          className="group flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-xs font-bold text-red-600 
          transition-all duration-300 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white"
        >
          <LogOut className="h-4 w-4 transition-transform group-hover:rotate-12" />
          Logout
        </button>

        {/* PROFILE BADGE */}
        <div className="flex h-10 w-10 items-center justify-center rounded-full 
        bg-gradient-to-br from-primary-DEFAULT to-accent-cyan 
        text-xs font-bold text-white 
        shadow-[0_10px_25px_rgba(59,73,223,0.35)]
        ring-2 ring-white">
          PO
        </div>

      </div>
    </header>
  );
}