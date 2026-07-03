'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { StudentSidebar } from '@/components/layout/StudentSidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useUIStore } from '@/store/uiStore';

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/resume/create': 'Create Resume',
  '/resume/upload': 'Upload Resume',
  '/placement-readiness': 'Placement Readiness',
  '/downloads': 'Downloads',
  '/settings': 'Settings',
};

function getTitle(pathname: string) {
  if (pathname.includes('/editor')) return 'Resume Editor';
  if (pathname.includes('/ats')) return 'ATS Analysis';
  return titles[pathname] ?? 'PlacementAI';
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const isEditor = pathname.includes('/editor');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount and whenever pathname changes
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/user/me');
        if (!res.ok) {
          setIsAuthenticated(false);
          router.push('/login');
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <StudentSidebar />
      <div className={isSidebarOpen ? 'md:pl-64 transition-all duration-200' : 'md:pl-20 transition-all duration-200'}>
        {!isEditor && <TopBar title={getTitle(pathname)} />}
        <main className={`surface-grid pb-20 md:pb-0 ${isEditor ? 'h-screen' : 'min-h-[calc(100vh-56px)]'}`}>
          <div className={`page-enter ${isEditor ? 'h-full' : ''}`}>{children}</div>
        </main>
      </div>
      {!isEditor && <MobileTabBar />}
    </div>
  );
}
