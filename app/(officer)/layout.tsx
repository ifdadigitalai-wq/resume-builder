import { redirect } from 'next/navigation';
import { getSession } from '@/lib/getSession';
import { OfficerNavbar } from '@/components/layout/OfficerNavbar';
import { OfficerSidebar } from '@/components/layout/OfficerSidebar';

export default async function OfficerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'OFFICER') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#EEF4FF]">
      <OfficerSidebar />
      <OfficerNavbar />
      <main className="surface-grid min-h-screen pt-14 lg:pl-64">
        <div className="page-enter mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
