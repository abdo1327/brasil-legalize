import { Metadata } from 'next';
import { AdminAuthProvider } from '@/lib/admin/auth';

export const metadata: Metadata = {
  title: 'Admin Console | Brasil Legalize',
  description: 'Administration panel for Brasil Legalize',
  robots: 'noindex, nofollow', // Don't index admin pages
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50" dir="ltr" lang="en">
      <AdminAuthProvider>
        {children}
      </AdminAuthProvider>
    </div>
  );
}
