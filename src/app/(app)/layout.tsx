import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { AppShell } from '@/components/layout/AppShell/AppShell';

const PUBLIC_PREFIXES = ['/chapters', '/listen'];

export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const headersList = headers();
  const pathname = headersList.get('x-pathname') ?? '';
  const isPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
  const session = await getServerSession(authOptions);
  if (!session && !isPublic) redirect('/login');

  return (
    <AppShell>
      {children}
    </AppShell>
  );
}
