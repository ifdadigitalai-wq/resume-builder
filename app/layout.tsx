import type { Metadata } from 'next';
import './globals.css';
import { Toast } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'PlacementAI Resume Builder',
  description: 'AI resume builder dashboard for Indian campus placements.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toast />
      </body>
    </html>
  );
}
