import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ParentPortalSidebar from '@/components/parent-portal/sidebar';
import ParentPortalHeader from '@/components/parent-portal/header';

export default async function ParentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and is a parent
  if (!session || session.user.role !== 'PARENT') {
    redirect('/auth/signin?callbackUrl=/parent-portal/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ParentPortalHeader />
      <div className="flex">
        <ParentPortalSidebar />
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}